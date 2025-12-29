"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { NewsletterRatingInsert } from "@/types/database";

export async function submitRating(newsletterId: string, rating: number) {
  if (rating < 1 || rating > 5) {
    return {
      success: false,
      error: "Rating must be between 1 and 5",
    };
  }

  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "You must be logged in to rate newsletters",
      };
    }

    // Check if user has already rated this newsletter
    const { data: existingRating } = await supabase
      .schema("newsletter")
      .from("newsletter_ratings")
      .select("id, rating")
      .eq("newsletter_id", newsletterId)
      .eq("user_id", user.id)
      .single();

    const now = new Date().toISOString();

    if (existingRating) {
      // Update existing rating
      const { error: updateError } = await supabase
        .schema("newsletter")
        .from("newsletter_ratings")
        .update({
          rating,
          updated_at: now,
        })
        .eq("id", existingRating.id);

      if (updateError) {
        console.error("Error updating rating:", updateError);
        return {
          success: false,
          error: "Failed to update rating. Please try again.",
        };
      }

      revalidatePath(`/newsletters/${newsletterId}`);
      return {
        success: true,
        message: "Rating updated successfully",
      };
    } else {
      // Create new rating
      const newRating: NewsletterRatingInsert = {
        newsletter_id: newsletterId,
        user_id: user.id,
        rating,
        created_at: now,
        updated_at: now,
      };

      const { error: insertError } = await supabase
        .schema("newsletter")
        .from("newsletter_ratings")
        .insert(newRating);

      if (insertError) {
        console.error("Error creating rating:", insertError);
        return {
          success: false,
          error: "Failed to submit rating. Please try again.",
        };
      }

      revalidatePath(`/newsletters/${newsletterId}`);
      return {
        success: true,
        message: "Rating submitted successfully",
      };
    }
  } catch (error) {
    console.error("Rating error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getUserRating(newsletterId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: true,
        rating: null,
      };
    }

    const { data, error } = await supabase
      .schema("newsletter")
      .from("newsletter_ratings")
      .select("rating")
      .eq("newsletter_id", newsletterId)
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is fine
      console.error("Error fetching user rating:", error);
      return {
        success: false,
        rating: null,
        error: error.message,
      };
    }

    return {
      success: true,
      rating: data?.rating || null,
    };
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return {
      success: false,
      rating: null,
      error: "Failed to fetch rating",
    };
  }
}

export async function getNewsletterRatingStats(newsletterId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("newsletter")
      .from("newsletter_ratings")
      .select("rating")
      .eq("newsletter_id", newsletterId);

    if (error) {
      console.error("Error fetching rating stats:", error);
      return {
        success: false,
        averageRating: 0,
        totalRatings: 0,
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        averageRating: 0,
        totalRatings: 0,
      };
    }

    const sum = data.reduce((acc, r) => acc + (r.rating || 0), 0);
    const average = Math.round((sum / data.length) * 10) / 10;

    return {
      success: true,
      averageRating: average,
      totalRatings: data.length,
    };
  } catch (error) {
    console.error("Error calculating rating stats:", error);
    return {
      success: false,
      averageRating: 0,
      totalRatings: 0,
      error: "Failed to calculate rating statistics",
    };
  }
}

