import { AdBanner } from "@/components/ad-banner"

export function FinalAdSection() {
  return (
    <section className="premium-section bg-secondary/30">
      <div className="premium-container flex justify-center">
        <AdBanner size="large" className="shadow-sm" />
      </div>
    </section>
  )
}
