"use server";

import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types/database";

export async function getTestimonials() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("newsletter")
      .from("testimonials")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching testimonials:", error);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }

    return {
      success: true,
      data: (data || []) as Testimonial[],
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return {
      success: false,
      data: [],
      error: "Failed to fetch testimonials",
    };
  }
}

export async function getSubscriberCount() {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .schema("newsletter")
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    if (error) {
      console.error("Error fetching subscriber count:", error);
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
    console.error("Error fetching subscriber count:", error);
    return {
      success: false,
      count: 0,
      error: "Failed to fetch subscriber count",
    };
  }
}

export async function getTotalLikes() {
  try {
    const supabase = await createClient();

    // Get total count of all likes across all newsletters
    const { count, error } = await supabase
      .schema("newsletter")
      .from("newsletter_likes")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching likes:", error);
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
    console.error("Error calculating total likes:", error);
    return {
      success: false,
      count: 0,
      error: "Failed to calculate total likes",
    };
  }
}

export async function getNewsletters() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("newsletter")
      .from("newsletters")
      .select("*")
      .eq("status", "sent")
      .order("sent_at", { ascending: false });

    if (error) {
      console.error("Error fetching newsletters:", error);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return {
      success: false,
      data: [],
      error: "Failed to fetch newsletters",
    };
  }
}

export async function getNewsletterById(id: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .schema("newsletter")
      .from("newsletters")
      .select("*")
      .eq("id", id)
      .eq("status", "sent")
      .single();

    if (error) {
      console.error("Error fetching newsletter:", error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching newsletter:", error);
    return {
      success: false,
      data: null,
      error: "Failed to fetch newsletter",
    };
  }
}

