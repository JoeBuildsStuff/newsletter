"use client";

import { useState, useEffect, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLike, getUserLike, getNewsletterLikeCount } from "@/app/actions/ratings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NewsletterRatingProps {
  newsletterId: string;
}

export function NewsletterRating({ newsletterId }: NewsletterRatingProps) {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLikes() {
      setIsLoading(true);
      try {
        const [userLikeResult, countResult] = await Promise.all([
          getUserLike(newsletterId),
          getNewsletterLikeCount(newsletterId),
        ]);

        if (userLikeResult.success) {
          setLiked(userLikeResult.liked);
        }

        if (countResult.success) {
          setLikeCount(countResult.count);
        }
      } catch (error) {
        console.error("Error loading likes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLikes();
  }, [newsletterId]);

  const handleLikeClick = () => {
    startTransition(async () => {
      const result = await toggleLike(newsletterId);
      if (result.success) {
        setLiked(result.liked);
        toast.success(result.message || (result.liked ? "Liked!" : "Unliked"));
        
        // Refresh count
        const countResult = await getNewsletterLikeCount(newsletterId);
        if (countResult.success) {
          setLikeCount(countResult.count);
        }
      } else {
        toast.error(result.error || "Failed to toggle like");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Heart className="size-5 text-muted-foreground/30" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleLikeClick}
        disabled={isPending}
        className={cn(
          "flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          "hover:opacity-80",
          liked ? "text-red-500" : "text-muted-foreground"
        )}
        aria-label={liked ? "Unlike this newsletter" : "Like this newsletter"}
      >
        <Heart
          className={cn(
            "size-6 transition-all",
            liked && "fill-current"
          )}
        />
      </button>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">{likeCount}</span>
        <span className="text-muted-foreground">
          {likeCount === 1 ? "like" : "likes"}
        </span>
      </div>
    </div>
  );
}

