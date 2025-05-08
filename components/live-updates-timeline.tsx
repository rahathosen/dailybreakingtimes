import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

type LiveUpdate = {
  id: number
  title: string
  publishedTime: string
  timeAgo: string
  total: number
}

interface LiveUpdatesTimelineProps {
  updates: LiveUpdate[]
  className?: string
}

export function LiveUpdatesTimeline({ updates, className }: LiveUpdatesTimelineProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <h3 className="font-bold text-lg">LIVE UPDATES</h3>
        </div>
        <Clock className="h-4 w-4" />
      </div>
      <CardContent className="p-0">
        <div className="divide-y">
          {updates.map((update) => (
            <div key={update.id} className="p-4 hover:bg-muted/50 transition-colors relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border mt-10 mb-2"></div>
              <div className="flex items-start gap-3">
                <div className="min-w-10 pt-1.5">
                  <Badge variant="outline" className="bg-background text-xs font-normal whitespace-nowrap">
                    {update.id} of {update.total}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Published {update.publishedTime} ago
                    <span className="text-muted-foreground/70 ml-1">{update.timeAgo}</span>
                  </p>
                  <p className="font-medium leading-tight">{update.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default LiveUpdatesTimeline
