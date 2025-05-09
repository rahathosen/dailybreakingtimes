import { Skeleton } from "@/components/ui/skeleton";

export default function SubcategoryLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="h-[1px] bg-gray-200 my-4" />
      </div>

      {/* Article grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center mt-8">
        <Skeleton className="h-10 w-64" />
      </div>
    </main>
  );
}
