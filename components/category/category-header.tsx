import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CategoryHeaderProps {
  title: string;
  description?: string | null;
  articleCount: number;
}

export default function CategoryHeader({
  title,
  description,
  articleCount,
}: CategoryHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        <Badge
          variant="outline"
          className="px-3 py-1 text-sm self-start md:self-auto"
        >
          {articleCount} {articleCount === 1 ? "Article" : "Articles"}
        </Badge>
      </div>
      <Separator className="my-4" />
    </div>
  );
}
