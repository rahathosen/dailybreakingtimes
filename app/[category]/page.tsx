import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryHeader from "@/components/category/category-header";
import CategoryArticleGrid from "@/components/category/category-article-grid";
import { PaginationContent } from "@/components/ui/pagination";

// Define the types for our data
interface CategoryPageProps {
  params: { category: string };
  searchParams: { page?: string };
}

// Fetch category data
async function getCategoryData(slug: string, page = 1) {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? process.env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/categories/${slug}?page=${page}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return notFound();
    }
    throw new Error("Failed to fetch category data");
  }

  return res.json();
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  try {
    const data = await getCategoryData(params.category);

    return {
      title: `${data.category.name} News | Premium News`,
      description:
        data.category.description ||
        `Latest news and articles from the ${data.category.name} category`,
    };
  } catch (error) {
    return {
      title: "Category | Premium News",
      description: "Browse news by category",
    };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const data = await getCategoryData(params.category, page);

  return (
    <main className="container mx-auto px-4 py-8">
      <CategoryHeader
        title={data.category.name}
        description={data.category.description}
        articleCount={data.pagination.totalArticles}
      />

      {data.articles.length > 0 ? (
        <>
          <CategoryArticleGrid articles={data.articles} />

          {data.pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <PaginationContent
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                baseUrl={`/${params.category}`}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground">
            There are currently no articles in this category.
          </p>
        </div>
      )}
    </main>
  );
}
