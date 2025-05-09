import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  is_breaking: boolean;
  is_highlighted: boolean;
}

interface CategoryArticleGridProps {
  articles: Article[];
}

export default function CategoryArticleGrid({
  articles,
}: CategoryArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden flex flex-col h-full">
          <div className="relative h-48 w-full">
            <Link href={`/${article.category.slug}/${article.slug}`}>
              <Image
                src={
                  article.featured_image ||
                  "/placeholder.svg?height=400&width=600"
                }
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>
            {article.is_breaking && (
              <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-700">
                Breaking
              </Badge>
            )}
            {article.is_highlighted && !article.is_breaking && (
              <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
                Highlighted
              </Badge>
            )}
          </div>
          <CardContent className="flex-grow pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {article.subcategory?.name || article.category.name}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {article.published_at &&
                !isNaN(new Date(article.published_at).getTime())
                  ? formatDistanceToNow(new Date(article.published_at), {
                      addSuffix: true,
                    })
                  : "Recently"}
              </span>
            </div>
            <Link href={`/${article.category.slug}/${article.slug}`}>
              <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                {article.title}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm line-clamp-3">
              {article.excerpt}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
