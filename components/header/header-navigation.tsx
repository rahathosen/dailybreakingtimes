"use client"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface Category {
  id: number
  name: string
  slug: string
  show_in_header: boolean
  subcategories: {
    id: number
    name: string
    slug: string
    show_in_header: boolean
    is_highlighted: boolean
  }[]
}

interface HeaderNavigationProps {
  categories: Category[]
  isMobile: boolean
  isMenuOpen: boolean
}

export function HeaderNavigation({ categories, isMobile, isMenuOpen }: HeaderNavigationProps) {
  return (
    <nav className={cn("border-b border-t border-border", isMenuOpen ? "block" : "hidden md:block")}>
      <div className="container mx-auto px-4">
        {isMobile ? <MobileNavigation categories={categories} /> : <DesktopNavigation categories={categories} />}
      </div>
    </nav>
  )
}

function MobileNavigation({ categories }: { categories: Category[] }) {
  return (
    <Accordion type="single" collapsible className="py-2">
      {categories
        .filter((category) => category.show_in_header)
        .map((category) => (
          <AccordionItem key={category.id} value={category.slug}>
            <AccordionTrigger className="py-2 text-sm font-medium">{category.name}</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-4 space-y-1">
                {category.subcategories
                  .filter((sub) => sub.show_in_header)
                  .map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/${category.slug}/${sub.slug}`}
                        className={cn(
                          "block py-1.5 text-sm hover:text-primary",
                          sub.is_highlighted && "font-medium text-primary",
                        )}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  )
}

function DesktopNavigation({ categories }: { categories: Category[] }) {
  return (
    <ul className="flex items-center justify-between py-1">
      {categories
        .filter((category) => category.show_in_header)
        .map((category) => (
          <li key={category.id} className="relative group py-2">
            <Link
              href={`/${category.slug}`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium hover:text-primary"
            >
              {category.name}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Link>
            <div className="absolute left-0 top-full z-50 hidden group-hover:block bg-background shadow-lg rounded-md p-4 min-w-[200px] border border-border">
              <ul className="space-y-1">
                {category.subcategories
                  .filter((sub) => sub.show_in_header)
                  .map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/${category.slug}/${sub.slug}`}
                        className={cn(
                          "block px-2 py-1.5 text-sm hover:bg-muted rounded-md",
                          sub.is_highlighted && "font-medium text-primary",
                        )}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </li>
        ))}
    </ul>
  )
}
