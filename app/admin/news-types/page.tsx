import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data - would come from database in real app
const newsTypes = [
  { id: 1, name: "Breaking News", articles: 15 },
  { id: 2, name: "Feature", articles: 28 },
  { id: 3, name: "Opinion", articles: 22 },
  { id: 4, name: "Analysis", articles: 17 },
  { id: 5, name: "Interview", articles: 9 },
  { id: 6, name: "Investigation", articles: 6 },
  { id: 7, name: "Review", articles: 12 },
]

export default function NewsTypesPage() {
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
              <TableHead>Articles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">{type.id}</TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{type.articles}</Badge>
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
