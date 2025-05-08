"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { DateTimeDisplay } from "@/components/date-time-display"
import { WeatherDisplay } from "@/components/weather-display"

// This would come from an API or database in a real application
const categories = [
  {
    id: 1,
    name: "News",
    slug: "news",
    show_in_header: true,
    subcategories: [
      { id: 1, name: "Breaking", slug: "breaking", show_in_header: true, is_highlighted: true },
      { id: 2, name: "World", slug: "world", show_in_header: true, is_highlighted: false },
      { id: 3, name: "National", slug: "national", show_in_header: true, is_highlighted: false },
      { id: 4, name: "Local", slug: "local", show_in_header: true, is_highlighted: false },
      { id: 5, name: "Politics", slug: "politics", show_in_header: true, is_highlighted: false },
    ],
  },
  {
    id: 2,
    name: "Business",
    slug: "business",
    show_in_header: true,
    subcategories: [
      { id: 6, name: "Economy", slug: "economy", show_in_header: true, is_highlighted: false },
      { id: 7, name: "Markets", slug: "markets", show_in_header: true, is_highlighted: false },
      { id: 8, name: "Companies", slug: "companies", show_in_header: true, is_highlighted: false },
      { id: 9, name: "Technology", slug: "technology", show_in_header: true, is_highlighted: true },
    ],
  },
  {
    id: 3,
    name: "Opinion",
    slug: "opinion",
    show_in_header: true,
    subcategories: [
      { id: 10, name: "Editorials", slug: "editorials", show_in_header: true, is_highlighted: false },
      { id: 11, name: "Columnists", slug: "columnists", show_in_header: true, is_highlighted: false },
      { id: 12, name: "Letters", slug: "letters", show_in_header: true, is_highlighted: false },
    ],
  },
  {
    id: 4,
    name: "Arts",
    slug: "arts",
    show_in_header: true,
    subcategories: [
      { id: 13, name: "Books", slug: "books", show_in_header: true, is_highlighted: false },
      { id: 14, name: "Movies", slug: "movies", show_in_header: true, is_highlighted: true },
      { id: 15, name: "Music", slug: "music", show_in_header: true, is_highlighted: false },
      { id: 16, name: "Theater", slug: "theater", show_in_header: true, is_highlighted: false },
    ],
  },
  {
    id: 5,
    name: "Lifestyle",
    slug: "lifestyle",
    show_in_header: true,
    subcategories: [
      { id: 17, name: "Food", slug: "food", show_in_header: true, is_highlighted: false },
      { id: 18, name: "Travel", slug: "travel", show_in_header: true, is_highlighted: true },
      { id: 19, name: "Health", slug: "health", show_in_header: true, is_highlighted: false },
      { id: 20, name: "Style", slug: "style", show_in_header: true, is_highlighted: false },
    ],
  },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-background",
      )}
    >
      {/* Top header with language selector */}
      

      {/* Main header with logo and search */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left side - Weather on mobile */}
       

        {/* Center - Logo and DateTime */}
        <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none flex flex-col items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl font-serif font-bold tracking-tighter">DailyBreakingTimes</span>
          </Link>
          <div className="text-sm font-medium mt-1">
            <DateTimeDisplay />
          </div>
        </div>

        {/* Right side - Search and menu */}
        <div className="flex items-center space-x-2">
          {isMobile ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </>
          ) : (
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-8 rounded-full bg-muted" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {isMobile && isSearchOpen && (
        <div className="border-t border-border py-2 px-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search articles..." className="pl-8 rounded-full bg-muted" />
          </div>
        </div>
      )}

      {/* Categories navigation */}
      <nav className={cn("border-b border-t border-border", isMenuOpen ? "block" : "hidden md:block")}>
        <div className="container mx-auto px-4">
          {isMobile ? (
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
          ) : (
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
          )}
        </div>
      </nav>

      {/* Highlighted tags */}
      <div className="container mx-auto px-4 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 whitespace-nowrap">
          <span className="highlighted-tag">Breaking News</span>
          <span className="tag">Election 2024</span>
          <span className="tag">Climate Crisis</span>
          <span className="tag">Tech Revolution</span>
          <span className="tag">Global Economy</span>
          <span className="tag">Health Updates</span>
        </div>
      </div>
    </header>
  )
}
