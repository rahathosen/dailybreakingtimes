import { Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function ArticleFooter() {
  return (
    <div className="space-y-6 pt-6">
      <Separator />

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Share this article:</span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Share via Email</span>
            </Button>
          </div>
        </div>

        <Button variant="outline" className="sm:w-auto">
          <Share2 className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      </div>
    </div>
  )
}
