interface ArticleContentProps {
  content: string
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
