import Link from "next/link"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Mock data - would come from database in real app
const getPollData = (id: string) => {
  return {
    id: Number.parseInt(id),
    question: "What news topic interests you the most?",
    category: "Reader Survey",
    status: "active",
    totalVotes: 585,
    createdAt: "May 10, 2023 09:30 AM",
    expiresAt: "May 17, 2023 09:30 AM",
    options: [
      { id: 1, text: "Politics", votes: 245, percentage: 42 },
      { id: 2, text: "Technology", votes: 189, percentage: 32 },
      { id: 3, text: "Business", votes: 87, percentage: 15 },
      { id: 4, text: "Sports", votes: 64, percentage: 11 },
    ],
    votingHistory: [
      { date: "May 10", votes: 120 },
      { date: "May 11", votes: 145 },
      { date: "May 12", votes: 98 },
      { date: "May 13", votes: 156 },
      { date: "May 14", votes: 66 },
    ],
    demographics: {
      age: [
        { group: "18-24", percentage: 15 },
        { group: "25-34", percentage: 32 },
        { group: "35-44", percentage: 28 },
        { group: "45-54", percentage: 14 },
        { group: "55+", percentage: 11 },
      ],
      gender: [
        { group: "Male", percentage: 58 },
        { group: "Female", percentage: 41 },
        { group: "Other", percentage: 1 },
      ],
      location: [
        { group: "North America", percentage: 45 },
        { group: "Europe", percentage: 30 },
        { group: "Asia", percentage: 15 },
        { group: "Other", percentage: 10 },
      ],
    },
  }
}

export default function PollResultsPage({ params }: { params: { id: string } }) {
  const poll = getPollData(params.id)

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
          <p className="text-muted-foreground">Detailed results and analytics</p>
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
                <Badge variant="default">Active</Badge>
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Created: {poll.createdAt}</div>
              <div>Expires: {poll.expiresAt}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="results">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="history">Voting History</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="pt-4">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Vote Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {poll.options.map((option) => (
                          <div key={option.id} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{option.text}</span>
                              <span className="text-sm font-medium">{option.percentage}%</span>
                            </div>
                            <Progress value={option.percentage} className="h-2" />
                            <div className="text-xs text-muted-foreground">
                              {option.votes} {option.votes === 1 ? "vote" : "votes"}
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
                            <div className="text-sm text-muted-foreground">Total Votes</div>
                            <div className="text-2xl font-bold">{poll.totalVotes}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Leading Option</div>
                            <div className="text-2xl font-bold">{poll.options[0].text}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Margin</div>
                            <div className="text-2xl font-bold">
                              {poll.options[0].percentage - poll.options[1].percentage}%
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Options</div>
                            <div className="text-2xl font-bold">{poll.options.length}</div>
                          </div>
                        </div>

                        <Separator />

                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">Key Insights</h4>
                          <ul className="text-sm space-y-1">
                            <li>Politics is the most popular topic with 42% of votes</li>
                            <li>Technology follows closely with 32% of votes</li>
                            <li>Business and Sports have lower interest levels</li>
                            <li>The poll has received {poll.totalVotes} votes so far</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="pt-4">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Daily Voting Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                      <div className="text-center text-muted-foreground">
                        <p>Voting history chart visualization</p>
                        <p className="text-sm">(Bar chart showing daily votes)</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-5 gap-2">
                      {poll.votingHistory.map((day) => (
                        <div key={day.date} className="text-center">
                          <div className="text-sm font-medium">{day.date}</div>
                          <div className="text-lg">{day.votes}</div>
                          <div className="text-xs text-muted-foreground">votes</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Voting Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Peak Voting Time</div>
                          <div className="text-xl font-medium">2:00 PM - 4:00 PM</div>
                          <div className="text-xs text-muted-foreground">Highest activity period</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Most Active Day</div>
                          <div className="text-xl font-medium">May 13</div>
                          <div className="text-xs text-muted-foreground">156 votes</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Average Daily Votes</div>
                          <div className="text-xl font-medium">117</div>
                          <div className="text-xs text-muted-foreground">votes per day</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="demographics" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Age Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {poll.demographics.age.map((item) => (
                        <div key={item.group} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{item.group}</span>
                            <span className="text-sm font-medium">{item.percentage}%</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Gender Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {poll.demographics.gender.map((item) => (
                        <div key={item.group} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{item.group}</span>
                            <span className="text-sm font-medium">{item.percentage}%</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Geographic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {poll.demographics.location.map((item) => (
                        <div key={item.group} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{item.group}</span>
                            <span className="text-sm font-medium">{item.percentage}%</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
