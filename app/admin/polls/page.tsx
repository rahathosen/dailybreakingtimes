import Link from "next/link"
import { Plus, Edit, Trash2, BarChart, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data - would come from database in real app
const polls = [
  {
    id: 1,
    question: "What news topic interests you the most?",
    category: "Reader Survey",
    status: "active",
    totalVotes: 585,
    createdAt: "2023-05-10 09:30:00",
    expiresAt: "2023-05-17 09:30:00",
  },
  {
    id: 2,
    question: "Do you think the climate agreement goals are achievable?",
    category: "Climate Policy",
    status: "active",
    totalVotes: 332,
    createdAt: "2023-05-12 14:15:00",
    expiresAt: "2023-05-14 14:15:00",
  },
  {
    id: 3,
    question: "Which economic policy would benefit the country most?",
    category: "Economy",
    status: "ended",
    totalVotes: 1247,
    createdAt: "2023-04-25 11:00:00",
    expiresAt: "2023-05-02 11:00:00",
  },
  {
    id: 4,
    question: "What's your favorite sports league to follow?",
    category: "Sports",
    status: "ended",
    totalVotes: 876,
    createdAt: "2023-04-18 16:45:00",
    expiresAt: "2023-04-25 16:45:00",
  },
  {
    id: 5,
    question: "Which technology trend will have the biggest impact in 2023?",
    category: "Technology",
    status: "draft",
    totalVotes: 0,
    createdAt: "2023-05-13 10:20:00",
    expiresAt: null,
  },
]

export default function PollsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Polls</h1>
          <p className="text-muted-foreground">Manage your reader polls and voting</p>
        </div>
        <Link href="/admin/polls/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Currently running polls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,040</div>
            <p className="text-xs text-muted-foreground">Across all polls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">760</div>
            <p className="text-xs text-muted-foreground">Votes per poll</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {polls.map((poll) => (
              <TableRow key={poll.id}>
                <TableCell className="font-medium">{poll.id}</TableCell>
                <TableCell className="max-w-[300px] truncate">{poll.question}</TableCell>
                <TableCell>
                  <Badge variant="outline">{poll.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={poll.status === "active" ? "default" : poll.status === "ended" ? "secondary" : "outline"}
                  >
                    {poll.status === "active" ? "Active" : poll.status === "ended" ? "Ended" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>{poll.totalVotes}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{poll.createdAt}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {poll.expiresAt ? (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{poll.expiresAt}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not set</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/polls/${poll.id}`}>
                        <BarChart className="h-4 w-4 mr-1" />
                        Results
                      </Link>
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
