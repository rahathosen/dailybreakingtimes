import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"

interface RecentArticle {
  id: number
  title: string
  image: string
  category: string
  publishedAt: string
  slug: string
}

interface RecentArticlesProps {
  articles: RecentArticle[]
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-serif font-bold border-b pb-2">Recent News</h2>

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="flex gap-4 items-start">
            <div className="w-20 h-20 relative flex-shrink-0">
              <Image
                src={article.image || "/thumbnail.jpg"}
                fill
                alt={article.title}
                className="object-cover rounded-md"
              />
            </div>
            <div>
              <h3 className="font-serif font-medium line-clamp-2 hover:text-primary transition-colors duration-200">
                <Link href={`/${article.category.toLowerCase()}/${article.slug}`}>{article.title}</Link>
              </h3>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span className="font-medium text-primary">{article.category}</span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>{article.publishedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
