"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { NewsletterLikeInsert } from "@/types/database";

export async function toggleLike(newsletterId: string) {
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
        error: "You must be logged in to like newsletters",
      };
    }

    // Check if user has already liked this newsletter
    const { data: existingLike } = await supabase
      .schema("newsletter")
      .from("newsletter_likes")
      .select("id")
      .eq("newsletter_id", newsletterId)
      .eq("user_id", user.id)
      .single();

    if (existingLike) {
      // Unlike - delete the like
      const { error: deleteError } = await supabase
        .schema("newsletter")
        .from("newsletter_likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) {
        console.error("Error removing like:", deleteError);
        return {
          success: false,
          error: "Failed to remove like. Please try again.",
        };
      }

      revalidatePath(`/newsletters/${newsletterId}`);
      return {
        success: true,
        liked: false,
        message: "Like removed",
      };
    } else {
      // Like - create new like
      const newLike: NewsletterLikeInsert = {
        newsletter_id: newsletterId,
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .schema("newsletter")
        .from("newsletter_likes")
        .insert(newLike);

      if (insertError) {
        console.error("Error creating like:", insertError);
        return {
          success: false,
          error: "Failed to like newsletter. Please try again.",
        };
      }

      revalidatePath(`/newsletters/${newsletterId}`);
      return {
        success: true,
        liked: true,
        message: "Newsletter liked!",
      };
    }
  } catch (error) {
    console.error("Like error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function getUserLike(newsletterId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: true,
        liked: false,
      };
    }

    const { data, error } = await supabase
      .schema("newsletter")
      .from("newsletter_likes")
      .select("id")
      .eq("newsletter_id", newsletterId)
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is fine
      console.error("Error fetching user like:", error);
      return {
        success: false,
        liked: false,
        error: error.message,
      };
    }

    return {
      success: true,
      liked: !!data,
    };
  } catch (error) {
    console.error("Error fetching user like:", error);
    return {
      success: false,
      liked: false,
      error: "Failed to fetch like status",
    };
  }
}

export async function getNewsletterLikeCount(newsletterId: string) {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .schema("newsletter")
      .from("newsletter_likes")
      .select("*", { count: "exact", head: true })
      .eq("newsletter_id", newsletterId);

    if (error) {
      console.error("Error fetching like count:", error);
      return {
        success: false,
        count: 0,
        error: error.message,
      };
    }

    return {
      success: true,
      count: count || 0,
    };
  } catch (error) {
    console.error("Error calculating like count:", error);
    return {
      success: false,
      count: 0,
      error: "Failed to calculate like count",
    };
  }
}

