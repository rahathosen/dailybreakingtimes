import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface ArticleContentProps {
  content: string;
  className?: string;
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  return (
    <div
      className={cn("prose prose-lg max-w-none dark:prose-invert", className)}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
