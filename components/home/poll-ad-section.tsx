import { PollWidget } from "@/components/poll-widget";
import { AdBanner } from "@/components/ad-banner";

// Sample poll data
const pollData = {
  id: "poll-1",
  question: "What news topic interests you the most?",
  options: [
    { id: "option-1", text: "Politics", votes: 245, percentage: 42 },
    { id: "option-2", text: "Technology", votes: 189, percentage: 32 },
    { id: "option-3", text: "Business", votes: 87, percentage: 15 },
    { id: "option-4", text: "Sports", votes: 64, percentage: 11 },
  ],
  totalVotes: 585,
  category: "Reader Survey",
  expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
};

export function PollAdSection() {
  return (
    <section className="premium-section bg-secondary/50">
      <div className="premium-container container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PollWidget featured={true} className="mb-8" />
          <div className="flex items-center justify-center">
            <AdBanner size="medium" className="shadow-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
