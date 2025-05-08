import Link from "next/link"
import { DateTimeDisplay } from "@/components/date-time-display"

export function HeaderLogo() {
  return (
    <div className="flex flex-col items-center">
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-2xl md:text-3xl font-serif font-bold tracking-tighter">DailyBreakingTimes</span>
      </Link>
      <div className="text-sm font-medium mt-1">
        <DateTimeDisplay />
      </div>
    </div>
  )
}
