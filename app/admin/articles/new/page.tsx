"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleEditor } from "@/components/markdown-editor";
import { ImageUpload } from "@/components/image-upload";
import { MultiSelect } from "@/components/multi-select";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: number;
  name: string;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

interface NewsType {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [newsTypeId, setNewsTypeId] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [publishDate, setPublishDate] = useState("");

  // Data loading state
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [newsTypes, setNewsTypes] = useState<NewsType[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (subcategory) => subcategory.categoryId === Number.parseInt(categoryId)
  );

  // Format tags for multi-select
  const tagOptions = tags.map((tag) => ({
    value: tag.id.toString(),
    label: tag.name,
  }));

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  // Load categories, subcategories, news types, and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [categoriesRes, subcategoriesRes, newsTypesRes, tagsRes] =
          await Promise.all([
            fetch("/api/admin/categories"),
            fetch("/api/admin/subcategories"),
            fetch("/api/admin/news-types"),
            fetch("/api/admin/tags"),
          ]);

        if (
          !categoriesRes.ok ||
          !subcategoriesRes.ok ||
          !newsTypesRes.ok ||
          !tagsRes.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [categoriesData, subcategoriesData, newsTypesData, tagsData] =
          await Promise.all([
            categoriesRes.json(),
            subcategoriesRes.json(),
            newsTypesRes.json(),
            tagsRes.json(),
          ]);

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setNewsTypes(newsTypesData);
        setTags(tagsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load form data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (isDraft = false) => {
    try {
      setSubmitting(true);
      setError(null);

      // Basic validation
      if (!title) {
        setError("Title is required");
        return;
      }

      if (!slug) {
        setError("Slug is required");
        return;
      }

      if (!content) {
        setError("Content is required");
        return;
      }

      if (!categoryId) {
        setError("Category is required");
        return;
      }

      if (!subcategoryId) {
        setError("Subcategory is required");
        return;
      }

      if (!newsTypeId) {
        setError("News type is required");
        return;
      }

      // Prepare article data
      const articleData = {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        featured_image: featuredImage,
        is_breaking: isBreaking,
        is_highlighted: isHighlighted,
        published_at: isDraft ? null : publishDate || new Date().toISOString(),
        categoryId: Number.parseInt(categoryId),
        subcategoryId: Number.parseInt(subcategoryId),
        newsTypeId: Number.parseInt(newsTypeId),
        tags: selectedTags,
      };

      // Submit to API
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create article");
      }

      // Show success message
      toast({
        title: "Article created",
        description: isDraft
          ? "Article saved as draft"
          : "Article published successfully",
      });

      // Redirect to articles list
      router.push("/admin/articles");
    } catch (err) {
      console.error("Error creating article:", err);
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/admin/articles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Article</h1>
        <p className="text-muted-foreground">Create a new news article</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details for the article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter article title"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="article-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The slug is used in the URL. It should be lowercase with
                  hyphens instead of spaces.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief summary of the article"
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={categoryId}
                    onValueChange={(value) => {
                      setCategoryId(value);
                      setSubcategoryId(""); // Reset subcategory when category changes
                    }}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={subcategoryId}
                    onValueChange={setSubcategoryId}
                    disabled={!categoryId || filteredSubcategories.length === 0}
                  >
                    <SelectTrigger id="subcategory">
                      <SelectValue
                        placeholder={
                          !categoryId
                            ? "Select a category first"
                            : filteredSubcategories.length === 0
                            ? "No subcategories available"
                            : "Select subcategory"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubcategories.map((subcategory) => (
                        <SelectItem
                          key={subcategory.id}
                          value={subcategory.id.toString()}
                        >
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">News Type</Label>
                <Select value={newsTypeId} onValueChange={setNewsTypeId}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select news type" />
                  </SelectTrigger>
                  <SelectContent>
                    {newsTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                <ImageUpload
                  onImageUploaded={(url) => setFeaturedImage(url)}
                  onImageRemoved={() => setFeaturedImage(null)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
              <CardDescription>
                Write or paste the full article content in Markdown format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ArticleEditor
                initialValue={content}
                onChange={setContent}
                className="mt-4"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Article Settings</CardTitle>
              <CardDescription>
                Configure additional settings for the article
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_breaking"
                  checked={isBreaking}
                  onCheckedChange={setIsBreaking}
                />
                <Label htmlFor="is_breaking">Mark as Breaking News</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_highlighted"
                  checked={isHighlighted}
                  onCheckedChange={setIsHighlighted}
                />
                <Label htmlFor="is_highlighted">Highlight Article</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <MultiSelect
                  options={tagOptions}
                  selected={selectedTags.map((id) => id.toString())}
                  onChange={(values) =>
                    setSelectedTags(values.map((v) => Number.parseInt(v)))
                  }
                  placeholder="Select tags"
                />
                <p className="text-xs text-muted-foreground">
                  Tags help users find related content
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="published_at">Publish Date</Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to publish immediately
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={submitting}
              >
                Save as Draft
              </Button>
              <Button onClick={() => handleSubmit(false)} disabled={submitting}>
                {submitting ? "Publishing..." : "Publish Article"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
