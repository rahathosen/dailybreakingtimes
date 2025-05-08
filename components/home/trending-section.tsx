import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, TrendingUp, BookOpen } from "lucide-react"

// Trending stories data
const trendingStories = [
  {
    id: 1,
    title: "Major Tech Company Announces Revolutionary AI Assistant",
    category: "Technology",
    time: "4 hours ago",
    reads: "24.5K",
  },
  {
    id: 2,
    title: "Historic Peace Agreement Signed Between Warring Nations",
    category: "World",
    time: "6 hours ago",
    reads: "18.2K",
  },
  {
    id: 3,
    title: "Stock Markets Reach All-Time High Following Economic Report",
    category: "Business",
    time: "8 hours ago",
    reads: "15.7K",
  },
  {
    id: 4,
    title: "Famous Director Reveals Details About Upcoming Blockbuster",
    category: "Entertainment",
    time: "10 hours ago",
    reads: "12.3K",
  },
]

export function TrendingSection() {
  return (
    <section className="premium-section">
      <div className="premium-container">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          <h2 className="premium-heading text-2xl font-serif">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingStories.map((story) => (
            <Card key={story.id} className="premium-card hover:border-primary">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="category-label">{story.category}</span>
                  <span className="text-xs font-medium flex items-center text-muted-foreground">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {story.reads}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold mb-3 line-clamp-2 hover:text-primary transition-colors duration-200">
                  <Link href="#">{story.title}</Link>
                </h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{story.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
