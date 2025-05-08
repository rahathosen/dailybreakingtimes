"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HeaderSearchProps {
  isMobile: boolean
}

export function HeaderSearch({ isMobile }: HeaderSearchProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  if (isMobile) {
    return (
      <>
        <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <Search className="h-5 w-5" />
        </Button>

        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 border-t border-border py-2 px-4 bg-background z-50">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-8 rounded-full bg-muted" />
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="relative w-64">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search articles..." className="pl-8 rounded-full bg-muted" />
    </div>
  )
}
