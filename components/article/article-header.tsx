import Image from "next/image";
import Link from "next/link";
import { Clock, Tag as TagIcon, Eye, Hourglass } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArticleHeaderProps {
  title: string;
  category: {
    name: string;
    slug: string;
  };
  subcategory: {
    name: string;
    slug: string;
  } | null;
  publishedAt: string;
  viewCount: number;
  readTime: string;
  tags: string[];
  featuredImage: string;
}

export function ArticleHeader({
  title,
  category,
  subcategory,
  publishedAt,
  readTime,
  viewCount,
  tags,
  featuredImage,
}: ArticleHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Link href={`/${category.slug}`}>
            <Badge variant="outline" className="hover:bg-muted">
              {category.name}
            </Badge>
          </Link>
          {subcategory && (
            <>
              <span className="text-muted-foreground">/</span>
              <Link href={`/subcategory/${subcategory.slug}`}>
                <Badge variant="outline" className="hover:bg-muted">
                  {subcategory.name}
                </Badge>
              </Link>
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{publishedAt}</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{viewCount} views</span>
          </div>

          <div className="flex items-center gap-2">
            <Hourglass className="h-4 w-4" />
            <span>{readTime} read</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
        <Image
          src={featuredImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <TagIcon className="h-4 w-4 text-muted-foreground" />
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
