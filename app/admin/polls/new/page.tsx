"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function NewPollPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question: "",
    category: "",
    options: [
      { id: 1, text: "" },
      { id: 2, text: "" },
    ],
    status: "draft",
    expiryEnabled: true,
    expiryDate: "",
    expiryTime: "",
    featured: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addOption = () => {
    const newId =
      formData.options.length > 0
        ? Math.max(...formData.options.map((o) => o.id)) + 1
        : 1;

    setFormData({
      ...formData,
      options: [...formData.options, { id: newId, text: "" }],
    });
  };

  const removeOption = (id: number) => {
    if (formData.options.length <= 2) return; // Minimum 2 options

    setFormData({
      ...formData,
      options: formData.options.filter((option) => option.id !== id),
    });
  };

  const updateOptionText = (id: number, text: string) => {
    setFormData({
      ...formData,
      options: formData.options.map((option) =>
        option.id === id ? { ...option, text } : option
      ),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = "Question is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    // Check if all options have text
    const emptyOptions = formData.options.filter(
      (option) => !option.text.trim()
    );
    if (emptyOptions.length > 0) {
      newErrors.options = "All options must have text";
    }

    // Check expiry date and time if enabled
    if (formData.expiryEnabled) {
      if (!formData.expiryDate) {
        newErrors.expiryDate = "Expiry date is required";
      }

      if (!formData.expiryTime) {
        newErrors.expiryTime = "Expiry time is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: "draft" | "active") => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare expiry date if enabled
      let expiresAt = null;
      if (
        formData.expiryEnabled &&
        formData.expiryDate &&
        formData.expiryTime
      ) {
        expiresAt = new Date(`${formData.expiryDate}T${formData.expiryTime}`);
      }

      // Prepare options array
      const options = formData.options.map((option) => option.text);

      // Create request body
      const requestBody = {
        question: formData.question,
        category: formData.category,
        options,
        status,
        expiresAt,
        featured: formData.featured,
      };

      // Send request to API
      const response = await fetch("/api/admin/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create poll");
      }

      toast({
        title: "Success",
        description: `Poll ${
          status === "draft" ? "saved as draft" : "published"
        } successfully`,
      });

      // Redirect to polls list
      router.push("/admin/polls");
      router.refresh();
    } catch (error) {
      console.error("Error creating poll:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create poll",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/admin/polls">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Poll</h1>
        <p className="text-muted-foreground">
          Create a new poll for readers to vote on
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Poll Details</CardTitle>
          <CardDescription>Enter the details for your new poll</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="question"
              className={errors.question ? "text-destructive" : ""}
            >
              Question
            </Label>
            <Input
              id="question"
              name="question"
              placeholder="Enter your poll question"
              value={formData.question}
              onChange={handleInputChange}
              className={errors.question ? "border-destructive" : ""}
            />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className={errors.category ? "text-destructive" : ""}
            >
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger
                id="category"
                className={errors.category ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reader-survey">Reader Survey</SelectItem>
                <SelectItem value="politics">Politics</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="options"
                className={errors.options ? "text-destructive" : ""}
              >
                Poll Options
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addOption}
                type="button"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {formData.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${option.id}`}
                    value={option.text}
                    onChange={(e) =>
                      updateOptionText(option.id, e.target.value)
                    }
                    className={errors.options ? "border-destructive" : ""}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(option.id)}
                    disabled={formData.options.length <= 2}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
              {errors.options && (
                <p className="text-sm text-destructive">{errors.options}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="expiry">Poll Expiration</Label>
                <p className="text-sm text-muted-foreground">
                  Set when this poll should expire
                </p>
              </div>
              <Switch
                id="expiry"
                checked={formData.expiryEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, expiryEnabled: checked })
                }
              />
            </div>

            {formData.expiryEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="expiryDate"
                    className={errors.expiryDate ? "text-destructive" : ""}
                  >
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className={errors.expiryDate ? "border-destructive" : ""}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-destructive">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="expiryTime"
                    className={errors.expiryTime ? "text-destructive" : ""}
                  >
                    Expiry Time
                  </Label>
                  <Input
                    id="expiryTime"
                    name="expiryTime"
                    type="time"
                    value={formData.expiryTime}
                    onChange={handleInputChange}
                    className={errors.expiryTime ? "border-destructive" : ""}
                  />
                  {errors.expiryTime && (
                    <p className="text-sm text-destructive">
                      {errors.expiryTime}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked })
                }
              />
              <Label htmlFor="featured">Feature on Homepage</Label>
            </div>
            <p className="text-xs text-muted-foreground pl-7">
              Featured polls will be displayed prominently on the homepage
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit("active")}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish Poll"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
