"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Star,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: { id: number; name: string };
  subcategory: { id: number; name: string };
  news_type: { id: number; name: string };
  is_breaking: boolean;
  is_highlighted: boolean;
  published_at: string | null;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showBreakingOnly, setShowBreakingOnly] = useState(false);
  const [showHighlightedOnly, setShowHighlightedOnly] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load articles with search params
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params
        const params = new URLSearchParams();
        params.append("page", currentPage.toString());
        params.append("limit", "10");

        if (searchTerm) {
          params.append("search", searchTerm);
        }

        if (selectedCategory && selectedCategory !== "all") {
          params.append("categoryId", selectedCategory);
        }

        if (showBreakingOnly) {
          params.append("isBreaking", "true");
        }

        if (showHighlightedOnly) {
          params.append("isHighlighted", "true");
        }

        const response = await fetch(
          `/api/admin/articles?${params.toString()}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Error fetching articles: ${response.status}`
          );
        }

        const data = await response.json();
        setArticles(data.articles || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        setError((err as Error).message);
        console.error("Failed to fetch articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    showBreakingOnly,
    showHighlightedOnly,
  ]);

  // Load categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");

        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/admin/articles/${articleToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Error deleting article: ${response.status}`
        );
      }

      // Remove from state
      setArticles(articles.filter((article) => article.id !== articleToDelete));
      setDeleteDialogOpen(false);
      setArticleToDelete(null);

      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted",
      });
    } catch (err) {
      console.error("Failed to delete article:", err);
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground">Manage your news articles</p>
        </div>
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breaking"
                    checked={showBreakingOnly}
                    onCheckedChange={(checked) =>
                      setShowBreakingOnly(checked === true)
                    }
                  />
                  <Label htmlFor="breaking">Breaking News Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="highlighted"
                    checked={showHighlightedOnly}
                    onCheckedChange={(checked) =>
                      setShowHighlightedOnly(checked === true)
                    }
                  />
                  <Label htmlFor="highlighted">Highlighted Only</Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setShowBreakingOnly(false);
                    setShowHighlightedOnly(false);
                    setSelectedCategory("");
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading articles...
                </TableCell>
              </TableRow>
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No articles found.{" "}
                  {searchTerm && "Try a different search term."}
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.id}</TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate font-medium">
                      {article.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {article.slug}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <Badge variant="outline">{article.category.name}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {article.subcategory.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge>{article.news_type.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {article.is_breaking && (
                        <Badge
                          variant="destructive"
                          className="flex items-center space-x-1"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          <span>Breaking</span>
                        </Badge>
                      )}
                      {article.is_highlighted && (
                        <Badge
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          <Star className="h-3 w-3" />
                          <span>Highlighted</span>
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {formatDate(article.published_at)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/${article.category.name.toLowerCase()}/${
                            article.slug
                          }`}
                          target="_blank"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/articles/edit/${article.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(article.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Article"
        description="Are you sure you want to delete this article? This action cannot be undone."
        isLoading={deleteLoading}
      />
    </div>
  );
}
