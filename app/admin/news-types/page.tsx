"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
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
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";

interface NewsType {
  id: number;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
}

export default function NewsTypesPage() {
  const [newsTypes, setNewsTypes] = useState<NewsType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNewsTypes();
  }, []);

  const fetchNewsTypes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/news-types");
      if (!response.ok) {
        throw new Error("Failed to fetch news types");
      }
      const data = await response.json();
      setNewsTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/news-types/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete news type");
      }

      // Remove from local state
      setNewsTypes(newsTypes.filter((newsType) => newsType.id !== id));
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
        <Button onClick={fetchNewsTypes} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Types</h1>
          <p className="text-muted-foreground">Manage your article types</p>
        </div>
        <Link href="/admin/news-types/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add News Type
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsTypes.map((newsType) => (
              <TableRow key={newsType.id}>
                <TableCell className="font-medium">{newsType.id}</TableCell>
                <TableCell>{newsType.name}</TableCell>
                <TableCell>{newsType.slug}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {newsType._count?.articles || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/news-types/edit/${newsType.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <DeleteConfirmationDialog
                      title="Delete News Type"
                      description={`Are you sure you want to delete the news type "${newsType.name}"? This action cannot be undone.`}
                      onDelete={() => handleDelete(newsType.id)}
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
