"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Eye, EyeOff, Star } from "lucide-react";
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

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  show_in_header: boolean;
  is_highlighted: boolean;
  category: {
    id: number;
    name: string;
  };
}

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/subcategories");
      if (!response.ok) {
        throw new Error("Failed to fetch subcategories");
      }
      const data = await response.json();
      setSubcategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVisibility = async (id: number, currentValue: boolean) => {
    try {
      const subcategory = subcategories.find((s) => s.id === id);
      if (!subcategory) return;

      const response = await fetch(`/api/admin/subcategories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: subcategory.name,
          slug: subcategory.slug,
          categoryId: subcategory.category.id,
          show_in_header: !currentValue,
          is_highlighted: subcategory.is_highlighted,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subcategory");
      }

      // Update local state
      setSubcategories(
        subcategories.map((subcategory) =>
          subcategory.id === id
            ? { ...subcategory, show_in_header: !currentValue }
            : subcategory
        )
      );
    } catch (err) {
      console.error(err);
      // Revert the switch if there was an error
      setSubcategories([...subcategories]);
    }
  };

  const handleToggleHighlight = async (id: number, currentValue: boolean) => {
    try {
      const subcategory = subcategories.find((s) => s.id === id);
      if (!subcategory) return;

      const response = await fetch(`/api/admin/subcategories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: subcategory.name,
          slug: subcategory.slug,
          categoryId: subcategory.category.id,
          show_in_header: subcategory.show_in_header,
          is_highlighted: !currentValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subcategory");
      }

      // Update local state
      setSubcategories(
        subcategories.map((subcategory) =>
          subcategory.id === id
            ? { ...subcategory, is_highlighted: !currentValue }
            : subcategory
        )
      );
    } catch (err) {
      console.error(err);
      // Revert the switch if there was an error
      setSubcategories([...subcategories]);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/subcategories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete subcategory");
      }

      // Remove from local state
      setSubcategories(
        subcategories.filter((subcategory) => subcategory.id !== id)
      );
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
        <Button onClick={fetchSubcategories} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subcategories</h1>
          <p className="text-muted-foreground">
            Manage your news subcategories
          </p>
        </div>
        <Link href="/admin/subcategories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Subcategory
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
              <TableHead>Category</TableHead>
              <TableHead>Show in Header</TableHead>
              <TableHead>Highlighted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcategories.map((subcategory) => (
              <TableRow key={subcategory.id}>
                <TableCell className="font-medium">{subcategory.id}</TableCell>
                <TableCell>{subcategory.name}</TableCell>
                <TableCell>{subcategory.slug}</TableCell>
                <TableCell>
                  <Badge variant="outline">{subcategory.category.name}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`show-${subcategory.id}`}
                      checked={subcategory.show_in_header}
                      onCheckedChange={() =>
                        handleToggleVisibility(
                          subcategory.id,
                          subcategory.show_in_header
                        )
                      }
                    />
                    {subcategory.show_in_header ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`highlight-${subcategory.id}`}
                      checked={subcategory.is_highlighted}
                      onCheckedChange={() =>
                        handleToggleHighlight(
                          subcategory.id,
                          subcategory.is_highlighted
                        )
                      }
                    />
                    {subcategory.is_highlighted && (
                      <Star className="h-4 w-4 text-gold fill-gold" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/admin/subcategories/edit/${subcategory.id}`}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <DeleteConfirmationDialog
                      title="Delete Subcategory"
                      description={`Are you sure you want to delete the subcategory "${subcategory.name}"? This action cannot be undone.`}
                      onDelete={() => handleDelete(subcategory.id)}
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
