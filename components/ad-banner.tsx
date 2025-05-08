import { cn } from "@/lib/utils"

interface AdBannerProps {
  size: "large" | "medium" | "small"
  className?: string
}

export function AdBanner({ size, className }: AdBannerProps) {
  const dimensions = {
    large: "h-60 md:h-80",
    medium: "h-40 md:h-60",
    small: "h-32 md:h-40",
  }

  return (
    <div className={cn("w-full rounded-md overflow-hidden border border-border", dimensions[size], className)}>
      <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-4 text-center">
        <p className="text-xs text-muted-foreground mb-2">ADVERTISEMENT</p>
        <div className="bg-background/50 rounded-md p-4 w-full h-[80%] flex items-center justify-center">
          <p className="text-muted-foreground">Ad Space - {size.charAt(0).toUpperCase() + size.slice(1)} Banner</p>
        </div>
      </div>
    </div>
  )
}
