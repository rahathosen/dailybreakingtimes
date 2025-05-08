"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Search, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DateTimeDisplay } from "@/components/date-time-display"
import HeaderLogo from "@/components/header/header-logo"
import HeaderSearch from "@/components/header/header-search"
import HeaderNavigation from "@/components/header/header-navigation"
import HeaderTags from "@/components/header/header-tags"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isMobile = useMobile()

  // Categories for navigation
  const categories = [
    { name: "Home", href: "/" },
    {
      name: "News",
      href: "/news",
      subcategories: [
        { name: "Politics", href: "/news/politics" },
        { name: "World", href: "/news/world" },
        { name: "US", href: "/news/us" },
      ],
    },
    {
      name: "Business",
      href: "/business",
      subcategories: [
        { name: "Economy", href: "/business/economy" },
        { name: "Markets", href: "/business/markets" },
        { name: "Companies", href: "/business/companies" },
      ],
    },
    {
      name: "Technology",
      href: "/technology",
      subcategories: [
        { name: "Innovation", href: "/technology/innovation" },
        { name: "Gadgets", href: "/technology/gadgets" },
        { name: "Internet", href: "/technology/internet" },
      ],
    },
    {
      name: "Sports",
      href: "/sports",
      subcategories: [
        { name: "Football", href: "/sports/football" },
        { name: "Basketball", href: "/sports/basketball" },
        { name: "Tennis", href: "/sports/tennis" },
      ],
    },
    {
      name: "Arts",
      href: "/arts",
      subcategories: [
        { name: "Film", href: "/arts/film" },
        { name: "Music", href: "/arts/music" },
        { name: "Books", href: "/arts/books" },
      ],
    },
  ]

  // Popular tags
  const tags = ["Climate", "Elections", "Economy", "Health", "Tech", "Science"]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (isScrolled) {
    // Compact header when scrolled
    return (
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-300 h-14">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          {/* Logo on the left */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-serif font-bold">DailyBreakingTimes</span>
          </Link>

          {/* Navigation in the middle - desktop only */}
          <nav className="hidden md:flex items-center justify-center space-x-1 mx-4">
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                <Link
                  href={category.href}
                  className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center"
                >
                  {category.name}
                  {category.subcategories && <ChevronDown className="ml-1 h-4 w-4 opacity-70" />}
                </Link>

                {/* Dropdown for subcategories */}
                {category.subcategories && (
                  <div className="absolute left-0 mt-1 w-48 origin-top-left rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-95 group-hover:scale-100">
                    <div className="py-1 border border-border rounded-md">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.name}
                          href={subcategory.href}
                          className="block px-4 py-2 text-sm hover:bg-muted hover:text-primary transition-colors"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side - search and mobile menu */}
          <div className="flex items-center space-x-2">
            {/* Search toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-foreground"
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Mobile menu - only on mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="py-4">
                  <h2 className="text-lg font-bold mb-4 font-serif">DailyBreakingTimes</h2>
                  <div className="mb-4">
                    <Input type="search" placeholder="Search..." className="w-full" />
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {categories.map((category) => (
                      <AccordionItem key={category.name} value={category.name}>
                        <AccordionTrigger className="text-base font-medium">{category.name}</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col space-y-2 pl-4">
                            {category.subcategories?.map((subcategory) => (
                              <Link
                                key={subcategory.name}
                                href={subcategory.href}
                                className="text-sm hover:text-primary transition-colors py-1"
                              >
                                {subcategory.name}
                              </Link>
                            )) || (
                              <Link href={category.href} className="text-sm hover:text-primary transition-colors py-1">
                                All {category.name}
                              </Link>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search bar - expanded when search is open */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-md animate-in slide-in-from-top">
              <div className="container mx-auto">
                <div className="flex items-center">
                  <Input type="search" placeholder="Search for articles..." className="flex-1" autoFocus />
                  <Button variant="default" className="ml-2">
                    Search
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Popular:</span>
                  {tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag.toLowerCase()}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    )
  }

  // Full header when not scrolled
  return (
    <header className="w-full bg-background border-b border-border transition-all duration-300">
      {/* Top bar with date and language */}
      <div className="border-b border-border py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <DateTimeDisplay timezone="Asia/Dhaka" />
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-muted-foreground">Language:</span>
              <select className="bg-transparent text-sm border-none focus:outline-none focus:ring-0">
                <option value="en">English</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main header with logo and navigation */}
      <div className="py-4">
        <div className="container mx-auto px-4">
          {/* Logo and search */}
          <div className="flex flex-col items-center justify-center mb-4">
            <HeaderLogo />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <HeaderNavigation />
            <HeaderSearch />
          </div>
        </div>
      </div>

      {/* Tags bar */}
      <HeaderTags />
    </header>
  )
}
