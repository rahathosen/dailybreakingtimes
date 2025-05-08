"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function NewCategoryPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [showInHeader, setShowInHeader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // Auto-generate slug from name
    setSlug(
      value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          show_in_header: showInHeader,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create category");
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/admin/categories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Category</h1>
        <p className="text-muted-foreground">Create a new news category</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
            <CardDescription>
              Enter the details for the new category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Technology"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="e.g. technology"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                The slug is used in the URL. It should be lowercase with no
                spaces.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show_in_header"
                checked={showInHeader}
                onCheckedChange={setShowInHeader}
              />
              <Label htmlFor="show_in_header">Show in Header</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Category"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
