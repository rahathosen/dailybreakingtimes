import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";

async function getPollData(id: string) {
  try {
    const pollId = Number.parseInt(id);
    if (isNaN(pollId)) return null;

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: true,
      },
    });

    if (!poll) return null;

    // Calculate total votes and percentages
    const totalVotes = poll.options.reduce(
      (sum, option) => sum + option.votes,
      0
    );
    const optionsWithPercentage = poll.options.map((option) => ({
      ...option,
      percentage:
        totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
    }));

    // Sort options by votes (descending)
    optionsWithPercentage.sort((a, b) => b.votes - a.votes);

    // Create empty voting history since we don't have vote records
    const votingHistory: { date: string; votes: number }[] = [];

    return {
      ...poll,
      totalVotes,
      options: optionsWithPercentage,
      votingHistory,
    };
  } catch (error) {
    console.error("Error fetching poll data:", error);
    return null;
  }
}

export default async function PollResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const poll = await getPollData(params.id);

  if (!poll) {
    notFound();
  }

  // Find peak voting time (simplified for this example)
  const peakVotingTime = "2:00 PM - 4:00 PM";

  // Find most active day
  const mostActiveDay =
    poll.votingHistory.length > 0
      ? poll.votingHistory.reduce(
          (max, day) => (day.votes > max.votes ? day : max),
          poll.votingHistory[0]
        )
      : { date: "N/A", votes: 0 };

  // Calculate average daily votes
  const avgDailyVotes =
    poll.votingHistory.length > 0
      ? Math.round(
          poll.votingHistory.reduce((sum, day) => sum + day.votes, 0) /
            poll.votingHistory.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/admin/polls">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Polls
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Poll Results</h1>
          <p className="text-muted-foreground">
            Detailed results and analytics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <CardTitle>{poll.question}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{poll.category}</Badge>
                <Badge
                  variant={poll.status === "active" ? "default" : "secondary"}
                >
                  {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
                </Badge>
                {poll.featured && <Badge variant="outline">Featured</Badge>}
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Created: {new Date(poll.createdAt).toLocaleString()}</div>
              {poll.expiresAt && (
                <div>Expires: {new Date(poll.expiresAt).toLocaleString()}</div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="results">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="pt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Vote Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {poll.options.map((option) => (
                          <div key={option.id} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{option.text}</span>
                              <span className="text-sm font-medium">
                                {option.percentage}%
                              </span>
                            </div>
                            <Progress
                              value={option.percentage}
                              className="h-2"
                            />
                            <div className="text-xs text-muted-foreground">
                              {option.votes}{" "}
                              {option.votes === 1 ? "vote" : "votes"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Total Votes
                            </div>
                            <div className="text-2xl font-bold">
                              {poll.totalVotes}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Leading Option
                            </div>
                            <div className="text-2xl font-bold">
                              {poll.options.length > 0
                                ? poll.options[0].text
                                : "N/A"}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Margin
                            </div>
                            <div className="text-2xl font-bold">
                              {poll.options.length > 1
                                ? `${
                                    poll.options[0].percentage -
                                    poll.options[1].percentage
                                  }%`
                                : "N/A"}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                              Options
                            </div>
                            <div className="text-2xl font-bold">
                              {poll.options.length}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">
                            Key Insights
                          </h4>
                          <ul className="text-sm space-y-1">
                            {poll.options.length > 0 && (
                              <li>
                                {poll.options[0].text} is the most popular
                                option with {poll.options[0].percentage}% of
                                votes
                              </li>
                            )}
                            {poll.options.length > 1 && (
                              <li>
                                {poll.options[1].text} follows with{" "}
                                {poll.options[1].percentage}% of votes
                              </li>
                            )}
                            {poll.options.length > 2 && (
                              <li>
                                {poll.options
                                  .slice(2)
                                  .map((o) => o.text)
                                  .join(", ")}{" "}
                                have lower interest levels
                              </li>
                            )}
                            <li>
                              The poll has received {poll.totalVotes}{" "}
                              {poll.totalVotes === 1 ? "vote" : "votes"} so far
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
