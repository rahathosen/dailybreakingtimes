import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface RelatedArticle {
  id: number
  title: string
  excerpt: string
  image: string
  category: string
  publishedAt: string
  slug: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold">Related Articles</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            <div className="relative">
              <Image
                src={article.image || "/placeholder.svg"}
                width={400}
                height={225}
                alt={article.title}
                className="w-full object-cover aspect-[16/9]"
              />
              <div className="absolute top-4 left-4">
                <span className="category-label">{article.category}</span>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <Clock className="h-3 w-3 mr-1" />
                <span>{article.publishedAt}</span>
              </div>
              <h3 className="text-lg font-serif font-bold mb-2 line-clamp-2 hover:text-primary transition-colors duration-200">
                <Link href={`/${article.category.toLowerCase()}/${article.slug}`}>{article.title}</Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
