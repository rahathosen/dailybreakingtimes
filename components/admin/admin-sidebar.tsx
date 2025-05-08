"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Newspaper,
  Tag,
  ListFilter,
  FileText,
  Vote,
  Home,
  X,
  Users,
  MessageSquare,
  BarChart,
  Settings,
  Menu,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(isOpen);

  // Sync with props
  useEffect(() => {
    setSidebarOpen(isOpen);
  }, [isOpen]);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Categories", href: "/admin/categories", icon: ListFilter },
    { name: "Subcategories", href: "/admin/subcategories", icon: ListFilter },
    { name: "Tags", href: "/admin/tags", icon: Tag },
    { name: "News Types", href: "/admin/news-types", icon: Newspaper },
    { name: "Articles", href: "/admin/articles", icon: FileText },
    { name: "Polls", href: "/admin/polls", icon: Vote },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    if (onClose) onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-background transition-transform duration-300 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-bold text-lg">DailyBreakingTimes</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={handleCloseSidebar}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close Sidebar</span>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    handleCloseSidebar();
                  }
                }}
              >
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href ? "bg-secondary font-medium" : ""
                  )}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            ))}
            <div className="mt-auto pt-4">
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Website
                </Button>
              </Link>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
