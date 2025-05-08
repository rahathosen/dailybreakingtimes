import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface CategoryNewsProps {
  title: string;
  category: string;
}

export default function CategoryNews({ title, category }: CategoryNewsProps) {
  // This would typically come from a database or API
  const articles = [
    {
      id: 1,
      title: `${title}: Major Development Reshapes Industry Landscape`,
      excerpt:
        "A significant shift in the industry has experts predicting far-reaching consequences for businesses and consumers alike.",
      image: `/thumbnail.jpg?height=300&width=600&text=${category}1`,
      time: "3 hours ago",
      author: "Jane Smith",
    },
    {
      id: 2,
      title: `New Research Reveals Surprising Trends in ${title}`,
      excerpt:
        "Groundbreaking study challenges conventional wisdom and offers new insights into evolving patterns.",
      image: `/thumbnail.jpg?height=300&width=600&text=${category}2`,
      time: "5 hours ago",
      author: "John Doe",
    },
    {
      id: 3,
      title: `The Future of ${title}: Experts Weigh In`,
      excerpt:
        "Leading authorities share their predictions on what's next for this rapidly evolving sector.",
      image: `/thumbnail.jpg?height=300&width=600&text=${category}3`,
      time: "8 hours ago",
      author: "Sarah Johnson",
    },
    {
      id: 4,
      title: `${title} Special Report: Behind the Headlines`,
      excerpt:
        "An in-depth analysis of the stories making waves and what they mean for the bigger picture.",
      image: `/thumbnail.jpg?height=300&width=600&text=${category}4`,
      time: "12 hours ago",
      author: "Michael Brown",
    },
  ];

  return (
    <section className="py-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold">{title}</h2>
        <Link
          href={`/${category.toLowerCase()}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            <div className="relative">
              <Image
                src={article.image || "/thumbnail.jpg"}
                width={600}
                height={300}
                alt={article.title}
                className="w-full object-cover aspect-[16/9]"
              />
              <div className="absolute top-4 left-4">
                <span className="category-label">{title}</span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <span>{article.author}</span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>{article.time}</span>
              </div>
              <h3 className="text-lg font-serif font-bold mb-2 line-clamp-2 hover:text-primary transition-colors duration-200">
                <Link href="#">{article.title}</Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.excerpt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
