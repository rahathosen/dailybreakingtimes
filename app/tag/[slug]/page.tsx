import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryHeader from "@/components/category/category-header";
import CategoryArticleGrid from "@/components/category/category-article-grid";
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TagPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

// Fetch tag data
async function getTagData(slug: string, page = 1) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(`${baseUrl}/api/tags/${slug}?page=${page}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return notFound();
    }
    throw new Error("Failed to fetch tag data");
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  try {
    const { tag } = await getTagData(params.slug);

    return {
      title: `${tag.name} | News Portal`,
      description: `Latest news and articles tagged with ${tag.name}`,
    };
  } catch (error) {
    return {
      title: "Tag | News Portal",
      description: "Browse articles by tag",
    };
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const { tag, articles, pagination } = await getTagData(params.slug, page);

  return (
    <main className="container mx-auto px-4 py-8">
      <CategoryHeader
        title={`#${tag.name}`}
        description={`All articles tagged with ${tag.name}`}
        articleCount={pagination.totalArticles}
      />

      {articles.length > 0 ? (
        <>
          <CategoryArticleGrid articles={articles} />

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/tag/${params.slug}?page=${page - 1}`}
                    />
                  </PaginationItem>
                )}

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((pageNum) => {
                  // Show current page, first and last pages, and pages around current page
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href={`/tag/${params.slug}?page=${pageNum}`}
                          className={
                            pageNum === page
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 h-9 w-9"
                              : "h-9 w-9"
                          }
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Show ellipsis for gaps
                  if (
                    (pageNum === 2 && page > 3) ||
                    (pageNum === pagination.totalPages - 1 &&
                      page < pagination.totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return null;
                })}

                {page < pagination.totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      href={`/tag/${params.slug}?page=${page + 1}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            There are currently no articles with this tag.
          </p>
        </div>
      )}
    </main>
  );
}
