"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { NewsletterSubscriberInsert } from "@/types/database";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || typeof email !== "string") {
    return {
      success: false,
      error: "Email is required",
    };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address",
    };
  }

  try {
    const supabase = await createClient();

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .schema("newsletter")
      .from("subscribers")
      .select("id, email, status")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existingSubscriber) {
      // If they're already subscribed, return success
      if (existingSubscriber.status === "active") {
        return {
          success: true,
          message: "You're already subscribed!",
        };
      }

      // If they previously unsubscribed, reactivate them
      if (existingSubscriber.status === "unsubscribed") {
        const { error: updateError } = await supabase
          .schema("newsletter")
          .from("subscribers")
          .update({
            status: "active",
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSubscriber.id);

        if (updateError) {
          return {
            success: false,
            error: "Failed to reactivate subscription. Please try again.",
          };
        }

        revalidatePath("/");
        return {
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
        };
      }
    }

    // Create new subscriber
    const newSubscriber: NewsletterSubscriberInsert = {
      email: email.toLowerCase().trim(),
      status: "active",
      subscribed_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .schema("newsletter")
      .from("subscribers")
      .insert(newSubscriber);

    if (insertError) {
      // Check if it's a duplicate key error (race condition)
      if (insertError.code === "23505") {
        return {
          success: true,
          message: "You're already subscribed!",
        };
      }

      return {
        success: false,
        error: "Failed to subscribe. Please try again later.",
      };
    }

    revalidatePath("/");
    return {
      success: true,
      message: "Thanks for subscribing! We'll be in touch soon.",
    };
  } catch (error) {
    console.error("Subscription error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

