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

interface SubcategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

async function getSubcategoryData(slug: string, page = 1) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    const response = await fetch(
      `${baseUrl}/api/subcategories/${slug}?page=${page}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return notFound();
      }
      throw new Error(
        `Failed to fetch subcategory data: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching subcategory data:", error);
    throw error;
  }
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  try {
    const { subcategory } = await getSubcategoryData(params.slug);

    return {
      title: `${subcategory.name} - ${subcategory.category.name} | News Portal`,
      description:
        subcategory.description ||
        `Latest news and articles from ${subcategory.name}`,
    };
  } catch (error) {
    return {
      title: "Subcategory | News Portal",
      description: "Browse articles by subcategory",
    };
  }
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const { subcategory, articles, pagination } = await getSubcategoryData(
    params.slug,
    page
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <CategoryHeader
        title={subcategory.name}
        description={subcategory.description}
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
                      href={`/subcategory/${params.slug}?page=${page - 1}`}
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
                          href={`/subcategory/${params.slug}?page=${pageNum}`}
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
                      href={`/subcategory/${params.slug}?page=${page + 1}`}
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
            There are currently no articles in this subcategory.
          </p>
        </div>
      )}
    </main>
  );
}
