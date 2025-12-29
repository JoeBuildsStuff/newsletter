"use client";

import { useState, useEffect, useTransition } from "react";
import { Star } from "lucide-react";
import { submitRating, getUserRating, getNewsletterRatingStats } from "@/app/actions/ratings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NewsletterRatingProps {
  newsletterId: string;
}

export function NewsletterRating({ newsletterId }: NewsletterRatingProps) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRatings() {
      setIsLoading(true);
      try {
        const [userRatingResult, statsResult] = await Promise.all([
          getUserRating(newsletterId),
          getNewsletterRatingStats(newsletterId),
        ]);

        if (userRatingResult.success) {
          setUserRating(userRatingResult.rating);
        }

        if (statsResult.success) {
          setAverageRating(statsResult.averageRating);
          setTotalRatings(statsResult.totalRatings);
        }
      } catch (error) {
        console.error("Error loading ratings:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRatings();
  }, [newsletterId]);

  const handleRatingClick = (rating: number) => {
    startTransition(async () => {
      const result = await submitRating(newsletterId, rating);
      if (result.success) {
        setUserRating(rating);
        toast.success(result.message || "Rating submitted!");
        
        // Refresh stats
        const statsResult = await getNewsletterRatingStats(newsletterId);
        if (statsResult.success) {
          setAverageRating(statsResult.averageRating);
          setTotalRatings(statsResult.totalRatings);
        }
      } else {
        toast.error(result.error || "Failed to submit rating");
      }
    });
  };

  const displayRating = hoveredRating || userRating || 0;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="size-5 text-muted-foreground/30"
              fill="currentColor"
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(null)}
              disabled={isPending}
              className={cn(
                "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                star <= displayRating
                  ? "text-yellow-400"
                  : "text-muted-foreground/30"
              )}
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  "size-6 transition-all",
                  star <= displayRating && "fill-current"
                )}
              />
            </button>
          ))}
        </div>
        {averageRating > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
            </span>
          </div>
        )}
      </div>
      {userRating && (
        <p className="text-sm text-muted-foreground">
          You rated this newsletter {userRating} star{userRating !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

