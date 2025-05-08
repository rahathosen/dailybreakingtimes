import Link from "next/link";
import { Plus, Edit, Trash2, Star } from "lucide-react";
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
import { prisma } from "@/lib/prisma";

export default async function TagsPage() {
  // Ensure user is authenticated

  // Fetch tags with article count
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { articles: true },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

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
                  <Badge variant="outline">{tag._count.articles}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`highlight-${tag.id}`}
                      checked={tag.is_highlighted}
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
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
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
