"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    articles: number;
  };
}

export default function HeaderNavigation() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();

        // Filter out categories with no articles
        const categoriesWithArticles = data.filter(
          (category: Category) => category._count.articles > 0
        );

        setCategories(categoriesWithArticles);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Show only the first 5 categories in the main navigation
  const mainCategories = categories.slice(0, 5);
  const moreCategories = categories.slice(5);

  if (isLoading) {
    return (
      <div className="flex space-x-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 w-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              active={pathname === "/"}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {mainCategories.map((category) => (
          <NavigationMenuItem key={category.id}>
            <Link href={`/${category.slug}`} legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={pathname === `/${category.slug}`}
              >
                {category.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}

        {moreCategories.length > 0 && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-3 p-4">
                {moreCategories.map((category) => (
                  <li key={category.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/${category.slug}`}
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === `/${category.slug}` &&
                            "bg-accent text-accent-foreground"
                        )}
                      >
                        <div className="text-sm font-medium leading-none">
                          {category.name}
                        </div>
                        <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                          {category._count.articles} articles
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
