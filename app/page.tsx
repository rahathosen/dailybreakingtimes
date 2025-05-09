import { HomeHeroSection } from "@/components/home/hero-section";
import { TrendingSection } from "@/components/home/trending-section";
import { PollAdSection } from "@/components/home/poll-ad-section";
import { EditorsPicksSection } from "@/components/home/editors-picks";
import { CategoriesSection } from "@/components/home/category-section";
import { FinalAdSection } from "@/components/home/final-ad-section";

export default function Home() {
  return (
    <main className="bg-background">
      <HomeHeroSection />
      <TrendingSection />
      <PollAdSection />
      {/* <EditorsPicksSection /> */}
      <CategoriesSection />
      <FinalAdSection />
    </main>
  );
}
