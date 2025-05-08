import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function HomeHeroSection() {
  return (
    <section className="premium-section bg-gradient-to-b from-secondary to-background py-12">
      <div className="premium-container container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main featured article */}
          <Card className="col-span-1 lg:col-span-8 overflow-hidden border-0 shadow-lg">
            <div className="relative">
              <Image
                src="/thumbnail.jpg"
                width={1200}
                height={600}
                alt="Featured article"
                className="w-full object-cover aspect-[16/9]"
              />
              <div className="absolute top-4 left-4">
                <span className="category-label">World</span>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <span className="font-medium text-primary">Breaking News</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>2 hours ago</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2 hover:text-primary transition-colors duration-200">
                <Link href="#">
                  Global Leaders Reach Historic Climate Agreement at Summit
                </Link>
              </h2>
              <p className="text-muted-foreground mb-4">
                In a landmark decision, world leaders have committed to
                ambitious carbon reduction targets, signaling a new era in
                international climate cooperation. The agreement includes
                substantial financial commitments to support developing nations.
              </p>
              <Button variant="outline" size="sm">
                Read Full Story
              </Button>
            </CardContent>
          </Card>

          {/* Secondary featured articles */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative">
                <Image
                  src="/thumbnail.jpg"
                  width={600}
                  height={300}
                  alt="Secondary article"
                  className="w-full object-cover aspect-[16/9]"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded">
                    Technology
                  </span>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>5 hours ago</span>
                </div>
                <h3 className="text-lg font-serif font-bold mb-2 hover:text-primary transition-colors duration-200">
                  <Link href="#">
                    Tech Giants Unveil Revolutionary AI Platform
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  The new platform promises to transform industries from
                  healthcare to transportation with unprecedented capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative">
                <Image
                  src="/thumbnail.jpg"
                  width={600}
                  height={300}
                  alt="Secondary article"
                  className="w-full object-cover aspect-[16/9]"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded">
                    Business
                  </span>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>8 hours ago</span>
                </div>
                <h3 className="text-lg font-serif font-bold mb-2 hover:text-primary transition-colors duration-200">
                  <Link href="#">
                    Markets Surge as Central Bank Announces New Policy
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Global markets responded positively to the announcement, with
                  major indices reaching record highs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
