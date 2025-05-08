import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ListFilter, Tag, BarChart, TrendingUp, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the DailyBreakingTimes admin panel.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ListFilter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Website traffic for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <BarChart className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Traffic chart visualization</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trending Articles</CardTitle>
            <CardDescription>Most viewed articles today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Global Leaders Reach Historic Climate Agreement</p>
                  <p className="text-xs text-muted-foreground">3.2k views</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Tech Giants Unveil Revolutionary AI Platform</p>
                  <p className="text-xs text-muted-foreground">2.8k views</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Markets Surge as Central Bank Announces New Policy</p>
                  <p className="text-xs text-muted-foreground">2.1k views</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Articles</CardTitle>
            <CardDescription>Recently published articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="text-sm font-medium">Major Breakthrough in Cancer Research Announced</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">Health</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">Historic Peace Deal Signed in Middle East Conflict</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">World</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">New Economic Policy to Boost Small Businesses</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">Business</p>
                  <p className="text-xs text-muted-foreground">8 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Breaking News</CardTitle>
            <CardDescription>Current breaking news articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-destructive" />
                <div>
                  <p className="text-sm font-medium">Major Earthquake Reported Off Coast</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-destructive" />
                <div>
                  <p className="text-sm font-medium">Supreme Court Rules on Landmark Privacy Case</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-destructive" />
                <div>
                  <p className="text-sm font-medium">Government Announces Emergency Response to Flooding</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
