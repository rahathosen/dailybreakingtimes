"use client";

import type React from "react";
import type { Metadata } from "next/types";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header/header";
import Footer from "@/components/footer";
import { BreakingNewsTicker } from "@/components/breaking-news-ticker";
import { LiveNewsTicker } from "@/components/live-news-ticker";
import { usePathname } from "next/navigation";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "DailyBreakingTimes",
  description: "Your source for premium news and insights",
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="relative flex min-h-screen flex-col">
        {!isAdminRoute && <BreakingNewsTicker />}
        {!isAdminRoute && <Header />}
        <div className="flex-1">{children}</div>
        {!isAdminRoute && <Footer />}
        {!isAdminRoute && <LiveNewsTicker />}
      </div>
    </ThemeProvider>
  );
}
