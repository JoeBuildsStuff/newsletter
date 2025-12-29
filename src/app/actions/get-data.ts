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

export async function getAverageRating() {
  try {
    const supabase = await createClient();

    // Get all testimonials to calculate the true average rating
    const { data, error } = await supabase
      .from("newsletter.testimonials")
      .select("rating");

    if (error) {
      console.error("Error fetching ratings:", error);
      return {
        success: false,
        rating: 0,
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        rating: 0,
        count: 0,
      };
    }

    const sum = data.reduce((acc, t) => acc + (t.rating || 0), 0);
    const average = Math.round((sum / data.length) * 10) / 10;

    return {
      success: true,
      rating: average,
      count: data.length,
    };
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return {
      success: false,
      rating: 0,
      error: "Failed to calculate average rating",
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

