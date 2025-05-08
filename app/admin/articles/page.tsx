import Link from "next/link"
import { Plus, Edit, Trash2, Eye, AlertTriangle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data - would come from database in real app
const articles = [
  {
    id: 1,
    title: "Global Leaders Reach Historic Climate Agreement at Summit",
    slug: "global-leaders-climate-agreement",
    category: "News",
    subcategory: "World",
    type: "Breaking News",
    is_breaking: true,
    is_highlighted: true,
    published_at: "2023-05-15 14:30:00",
  },
  {
    id: 2,
    title: "Tech Giants Unveil Revolutionary AI Platform",
    slug: "tech-giants-ai-platform",
    category: "Business",
    subcategory: "Technology",
    type: "Feature",
    is_breaking: false,
    is_highlighted: true,
    published_at: "2023-05-14 09:15:00",
  },
  {
    id: 3,
    title: "Markets Surge as Central Bank Announces New Policy",
    slug: "markets-surge-central-bank",
    category: "Business",
    subcategory: "Markets",
    type: "Analysis",
    is_breaking: false,
    is_highlighted: false,
    published_at: "2023-05-13 16:45:00",
  },
  {
    id: 4,
    title: "Major Breakthrough in Cancer Research Announced",
    slug: "breakthrough-cancer-research",
    category: "News",
    subcategory: "Health",
    type: "Feature",
    is_breaking: true,
    is_highlighted: true,
    published_at: "2023-05-12 11:20:00",
  },
  {
    id: 5,
    title: "Historic Peace Deal Signed in Middle East Conflict",
    slug: "peace-deal-middle-east",
    category: "News",
    subcategory: "World",
    type: "Breaking News",
    is_breaking: true,
    is_highlighted: false,
    published_at: "2023-05-11 08:30:00",
  },
]

export default function ArticlesPage() {
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
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.id}</TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate font-medium">{article.title}</div>
                  <div className="text-xs text-muted-foreground">{article.slug}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.subcategory}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>{article.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    {article.is_breaking && (
                      <Badge variant="destructive" className="flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Breaking</span>
                      </Badge>
                    )}
                    {article.is_highlighted && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Highlighted</span>
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">{article.published_at}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
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
