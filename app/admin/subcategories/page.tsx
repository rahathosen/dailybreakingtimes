import Link from "next/link"
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

// Mock data - would come from database in real app
const subcategories = [
  { id: 1, name: "Breaking", slug: "breaking", category: "News", show_in_header: true, is_highlighted: true },
  { id: 2, name: "World", slug: "world", category: "News", show_in_header: true, is_highlighted: false },
  { id: 3, name: "National", slug: "national", category: "News", show_in_header: true, is_highlighted: false },
  { id: 4, name: "Local", slug: "local", category: "News", show_in_header: true, is_highlighted: false },
  { id: 5, name: "Politics", slug: "politics", category: "News", show_in_header: true, is_highlighted: false },
  { id: 6, name: "Economy", slug: "economy", category: "Business", show_in_header: true, is_highlighted: false },
  { id: 7, name: "Markets", slug: "markets", category: "Business", show_in_header: true, is_highlighted: false },
  { id: 8, name: "Technology", slug: "technology", category: "Business", show_in_header: true, is_highlighted: true },
  { id: 9, name: "Movies", slug: "movies", category: "Arts", show_in_header: true, is_highlighted: true },
  { id: 10, name: "Travel", slug: "travel", category: "Lifestyle", show_in_header: true, is_highlighted: true },
]

export default function SubcategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subcategories</h1>
          <p className="text-muted-foreground">Manage your news subcategories</p>
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
                  <Badge variant="outline">{subcategory.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch id={`show-${subcategory.id}`} checked={subcategory.show_in_header} />
                    {subcategory.show_in_header ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch id={`highlight-${subcategory.id}`} checked={subcategory.is_highlighted} />
                    {subcategory.is_highlighted && <Star className="h-4 w-4 text-gold fill-gold" />}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
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
  )
}
