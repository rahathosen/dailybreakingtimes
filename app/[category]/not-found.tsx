import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoryNotFound() {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The category you're looking for doesn't exist or may have been removed.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/categories">Browse Categories</Link>
        </Button>
      </div>
    </main>
  );
}
