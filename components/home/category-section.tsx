import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface CategoryArticleProps {
  category: string;
}

export function CategorySection({ category }: CategoryArticleProps) {
  return (
    <div>
      <h2 className="premium-heading text-2xl font-serif">{category}</h2>
      <div className="space-y-6">
        <Card className="premium-card">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <Image
                src={`/thumbnail.jpg`}
                width={600}
                height={300}
                alt={`${category} article`}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-5">
              <span className="category-label mb-2 inline-block">
                {category}
              </span>
              <h3 className="text-lg font-serif font-bold mb-2 hover:text-primary transition-colors duration-200">
                <Link href="#">
                  {category}: Major Development Reshapes Industry Landscape
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                A significant shift in the industry has experts predicting
                far-reaching consequences for businesses and consumers alike.
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>
                  {category === "Politics"
                    ? "Jane Smith"
                    : category === "Business"
                    ? "John Doe"
                    : category === "Technology"
                    ? "Sarah Johnson"
                    : "Michael Brown"}
                </span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>3 hours ago</span>
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="premium-card">
            <CardContent className="p-4">
              <span className="text-xs text-primary font-medium">
                {category}
              </span>
              <h4 className="text-base font-serif font-bold my-2 hover:text-primary transition-colors duration-200">
                <Link href="#">
                  New Research Reveals Surprising Trends in {category}
                </Link>
              </h4>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>5 hours ago</span>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardContent className="p-4">
              <span className="text-xs text-primary font-medium">
                {category}
              </span>
              <h4 className="text-base font-serif font-bold my-2 hover:text-primary transition-colors duration-200">
                <Link href="#">The Future of {category}: Experts Weigh In</Link>
              </h4>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>8 hours ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function CategoriesSection() {
  return (
    <section className="premium-section">
      <div className="premium-container container px-4">
        <div className="premium-divider"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
          <CategorySection category="Politics" />
          <CategorySection category="Business" />
          <CategorySection category="Technology" />
          <CategorySection category="Arts & Culture" />
        </div>
      </div>
    </section>
  );
}
