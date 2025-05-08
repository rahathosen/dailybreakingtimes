import { Check, Edit, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Mock data - would come from database in real app
const comments = [
  {
    id: 1,
    user: "John Doe",
    article: "Global Leaders Reach Historic Climate Agreement at Summit",
    content: "This is a significant step forward for international cooperation on climate change.",
    status: "Approved",
    created_at: "2023-05-15 14:45:00",
  },
  {
    id: 2,
    user: "Jane Smith",
    article: "Tech Giants Unveil Revolutionary AI Platform",
    content: "I'm concerned about the ethical implications of this technology.",
    status: "Pending",
    created_at: "2023-05-15 15:30:00",
  },
  {
    id: 3,
    user: "Robert Johnson",
    article: "Markets Surge as Central Bank Announces New Policy",
    content: "This policy change was long overdue. I expect markets to continue rising.",
    status: "Approved",
    created_at: "2023-05-15 16:15:00",
  },
  {
    id: 4,
    user: "Emily Davis",
    article: "Major Breakthrough in Cancer Research Announced",
    content: "As someone who lost a family member to cancer, this gives me hope.",
    status: "Approved",
    created_at: "2023-05-15 17:00:00",
  },
  {
    id: 5,
    user: "Michael Wilson",
    article: "Historic Peace Deal Signed in Middle East Conflict",
    content: "Let's hope this peace lasts longer than previous attempts.",
    status: "Rejected",
    created_at: "2023-05-15 17:45:00",
  },
]

export default function CommentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
        <p className="text-muted-foreground">Manage user comments on articles</p>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Article</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell className="font-medium">{comment.id}</TableCell>
                <TableCell>{comment.user}</TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate">{comment.article}</div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate">{comment.content}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      comment.status === "Approved"
                        ? "success"
                        : comment.status === "Pending"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {comment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-xs">{comment.created_at}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" className="text-green-500">
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Approve</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Reject</span>
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
