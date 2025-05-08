import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
            {/* Left side - Content */}
            <div className="w-full lg:w-1/2 max-w-lg text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-800 bg-clip-text text-transparent">
                Oops!
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-200 rounded-full mb-6 mx-auto lg:mx-0"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                Page Not Found
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                We can't seem to find the page you're looking for. It might have
                been moved, renamed, or doesn't exist.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white hover:from-purple-700 hover:to-indigo-900 transition-all"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Link href="/categories">Browse Collections</Link>
                </Button>
              </div>

              {/* Quick links */}
            </div>

            {/* Right side - Illustration */}
            <div className="w-full lg:w-1/2 max-w-md">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-indigo-800/20 rounded-full blur-xl"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-purple-100">
                  <div className="aspect-square relative">
                    <Image
                      src="/lost-vector.jpg"
                      alt="404 Illustration"
                      width={500}
                      height={500}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
                      <p className="text-gray-500 text-sm">
                        Illustration: Lost Shoe
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  Need help?{" "}
                  <Link
                    href="/contact"
                    className="text-purple-700 font-semibold hover:underline"
                  >
                    Contact our support team
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
