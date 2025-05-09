"use client";

import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Tag {
  id: number;
  name: string;
}

interface ArticleFooterProps {
  tags: { tag: Tag }[];
  shareUrl: string;
  articleId: number;
}

export function ArticleFooter({
  tags,
  shareUrl,
  articleId,
}: ArticleFooterProps) {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Article link has been copied to your clipboard.",
    });
  };

  const handleSocialShare = (platform: string) => {
    let url = "";
    const encodedUrl = encodeURIComponent(shareUrl);
    const title = encodeURIComponent("Check out this article");

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${title}`;
        break;
      case "email":
        url = `mailto:?subject=${title}&body=${encodedUrl}`;
        break;
    }

    if (platform === "email") {
      window.location.href = url;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6 pt-6">
      <Separator />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(({ tag }) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        {/* Social Sharing */}
        <div className="flex items-center space-x-2">
          <span className="font-medium">Share this article:</span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleSocialShare("facebook")}
            >
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleSocialShare("twitter")}
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleSocialShare("linkedin")}
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleSocialShare("email")}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Share via Email</span>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyLink}>
            <Share2 className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
}
