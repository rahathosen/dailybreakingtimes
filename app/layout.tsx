import type React from "react";
import type { Metadata } from "next/types";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BreakingNewsTicker } from "@/components/breaking-news-ticker";
import { LiveNewsTicker } from "@/components/live-news-ticker";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "DailyBreakingTimes",
  description: "Your source for premium news and insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Don't render the regular layout for admin pages
  const isAdminPage =
    typeof window !== "undefined"
      ? window.location.pathname.startsWith("/admin")
      : false;

  if (isAdminPage) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={`min-h-screen bg-background font-sans antialiased ${fontSans.variable}`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background font-sans antialiased ${fontSans.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <BreakingNewsTicker />
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
            <LiveNewsTicker />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
