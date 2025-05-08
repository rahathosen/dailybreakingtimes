"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  BarChart,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Poll {
  id: number;
  question: string;
  category: string;
  status: string;
  totalVotes: number;
  createdAt: string;
  expiresAt: string | null;
  featured: boolean;
}

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activePolls: 0,
    totalVotes: 0,
    avgEngagement: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPolls();
  }, [statusFilter, categoryFilter]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (categoryFilter) params.append("category", categoryFilter);

      const response = await fetch(`/api/admin/polls?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Format dates
      const formattedPolls = data.map((poll: any) => ({
        ...poll,
        createdAt: new Date(poll.createdAt).toLocaleString(),
        expiresAt: poll.expiresAt
          ? new Date(poll.expiresAt).toLocaleString()
          : null,
      }));

      setPolls(formattedPolls);

      // Calculate stats
      const activePolls = formattedPolls.filter(
        (p: Poll) => p.status === "active"
      ).length;
      const totalVotes = formattedPolls.reduce(
        (sum: number, poll: Poll) => sum + poll.totalVotes,
        0
      );
      const avgEngagement =
        formattedPolls.length > 0
          ? Math.round(totalVotes / formattedPolls.length)
          : 0;

      setStats({
        activePolls,
        totalVotes,
        avgEngagement,
      });
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError("Failed to load polls. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setPollToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pollToDelete) return;

    try {
      const response = await fetch(`/api/admin/polls/${pollToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Remove the deleted poll from the state
      setPolls(polls.filter((poll) => poll.id !== pollToDelete));

      toast({
        title: "Poll deleted",
        description: "The poll has been successfully deleted.",
      });
    } catch (err) {
      console.error("Error deleting poll:", err);
      toast({
        title: "Error",
        description: "Failed to delete the poll. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPollToDelete(null);
    }
  };

  const filteredPolls = polls.filter((poll) => {
    return (
      poll.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Polls</h1>
          <p className="text-muted-foreground">
            Manage your reader polls and voting
          </p>
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
            <div className="text-2xl font-bold">{stats.activePolls}</div>
            <p className="text-xs text-muted-foreground">
              Currently running polls
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
            <p className="text-xs text-muted-foreground">Across all polls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Engagement
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgEngagement}</div>
            <p className="text-xs text-muted-foreground">Votes per poll</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search polls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/4">
          <Label htmlFor="status-filter">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/4">
          <Label htmlFor="category-filter">Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="reader-survey">Reader Survey</SelectItem>
              <SelectItem value="politics">Politics</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => fetchPolls()}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 p-4 rounded-md flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

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
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Loading polls...
                </TableCell>
              </TableRow>
            ) : filteredPolls.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No polls found. Create your first poll!
                </TableCell>
              </TableRow>
            ) : (
              filteredPolls.map((poll) => (
                <TableRow key={poll.id}>
                  <TableCell className="font-medium">{poll.id}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {poll.question}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{poll.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        poll.status === "active"
                          ? "default"
                          : poll.status === "ended"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {poll.status === "active"
                        ? "Active"
                        : poll.status === "ended"
                        ? "Ended"
                        : "Draft"}
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
                      <span className="text-xs text-muted-foreground">
                        Not set
                      </span>
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/polls/edit/${poll.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(poll.id)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              poll and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
