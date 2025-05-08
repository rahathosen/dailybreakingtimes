"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";

interface Tag {
  id: number;
  name: string;
  slug: string;
  is_highlighted: boolean;
  _count?: {
    articles: number;
  };
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/tags");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleHighlight = async (id: number, currentValue: boolean) => {
    try {
      const tag = tags.find((t) => t.id === id);
      if (!tag) return;

      const response = await fetch(`/api/admin/tags/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tag.name,
          slug: tag.slug,
          is_highlighted: !currentValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tag");
      }

      // Update local state
      setTags(
        tags.map((tag) =>
          tag.id === id ? { ...tag, is_highlighted: !currentValue } : tag
        )
      );
    } catch (err) {
      console.error(err);
      // Revert the switch if there was an error
      setTags([...tags]);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete tag");
      }

      // Remove from local state
      setTags(tags.filter((tag) => tag.id !== id));
    } catch (err) {
      console.error(err);
      alert(
        err instanceof Error ? err.message : "An error occurred while deleting"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        <p>Error: {error}</p>
        <Button onClick={fetchTags} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">Manage your article tags</p>
        </div>
        <Link href="/admin/tags/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead>Highlighted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.id}</TableCell>
                <TableCell>{tag.name}</TableCell>
                <TableCell>{tag.slug}</TableCell>
                <TableCell>
                  <Badge variant="outline">{tag._count?.articles || 0}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`highlight-${tag.id}`}
                      checked={tag.is_highlighted}
                      onCheckedChange={() =>
                        handleToggleHighlight(tag.id, tag.is_highlighted)
                      }
                    />
                    {tag.is_highlighted && (
                      <Star className="h-4 w-4 text-gold fill-gold" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/tags/edit/${tag.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <DeleteConfirmationDialog
                      title="Delete Tag"
                      description={`Are you sure you want to delete the tag "${tag.name}"? This action cannot be undone.`}
                      onDelete={() => handleDelete(tag.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
