import Image from "next/image"
import Link from "next/link"
import { Clock, User, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ArticleHeaderProps {
  title: string
  category: string
  subcategory: string
  author: {
    name: string
    avatar: string
    role: string
  }
  publishedAt: string
  readTime: string
  tags: string[]
  featuredImage: string
}

export function ArticleHeader({
  title,
  category,
  subcategory,
  author,
  publishedAt,
  readTime,
  tags,
  featuredImage,
}: ArticleHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Link href={`/${category.toLowerCase()}`}>
            <Badge variant="outline" className="hover:bg-muted">
              {category}
            </Badge>
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href={`/${category.toLowerCase()}/${subcategory.toLowerCase()}`}>
            <Badge variant="outline" className="hover:bg-muted">
              {subcategory}
            </Badge>
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">{title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{publishedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{readTime} read</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Image
          src={author.avatar || "/placeholder.svg"}
          alt={author.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <div className="font-medium">{author.name}</div>
          <div className="text-sm text-muted-foreground">{author.role}</div>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
        <Image src={featuredImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        {tags.map((tag) => (
          <Link key={tag} href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}>
            <Badge variant="secondary" className="hover:bg-secondary/80">
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  )
}
