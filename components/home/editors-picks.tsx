import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Award } from "lucide-react";

// Featured editors picks
const editorsPicks = [
  {
    id: 1,
    title: "The Future of Sustainable Energy: Breakthroughs and Challenges",
    excerpt:
      "Exploring the latest innovations in renewable energy and the obstacles that remain.",
    image: "/thumbnail.jpg",
    category: "Science",
    time: "1 day ago",
    author: "Dr. Emma Richards",
  },
  {
    id: 2,
    title: "Global Economic Outlook: Recovery Amid Uncertainty",
    excerpt:
      "Analysis of economic trends and forecasts for the coming year in a post-pandemic world.",
    image: "/thumbnail.jpg",
    category: "Finance",
    time: "2 days ago",
    author: "Robert Chen",
  },
  {
    id: 3,
    title: "The Evolution of Modern Cinema: From Studios to Streaming",
    excerpt:
      "How streaming platforms are reshaping film production, distribution, and viewing habits.",
    image: "/thumbnail.jpg",
    category: "Entertainment",
    time: "3 days ago",
    author: "Sophia Martinez",
  },
];

export function EditorsPicksSection() {
  return (
    <section className="premium-section">
      <div className="premium-container container px-4">
        <div className="flex items-center mb-6">
          <Award className="h-5 w-5 mr-2 text-gold" />
          <h2 className="premium-heading text-2xl font-serif">
            Editor's Picks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {editorsPicks.map((article) => (
            <Card key={article.id} className="premium-card hover:shadow-md">
              <div className="relative">
                <Image
                  src={article.image || "/thumbnail.jpg"}
                  width={600}
                  height={300}
                  alt={article.title}
                  className="w-full object-cover aspect-[16/9]"
                />
                <div className="absolute top-4 left-4">
                  <span className="category-label">{article.category}</span>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <span className="font-medium">{article.author}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{article.time}</span>
                </div>
                <h3 className="text-lg font-serif font-bold mb-2 hover:text-primary transition-colors duration-200">
                  <Link href="#">{article.title}</Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {article.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
