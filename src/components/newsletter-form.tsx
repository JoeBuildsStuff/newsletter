"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/actions/subscribe";
import { ArrowRight } from "lucide-react";

interface NewsletterFormProps {
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
}

export function NewsletterForm({ 
  className = "", 
  buttonText = "Subscribe",
  showIcon = true 
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await subscribeToNewsletter(formData);

    setIsSubmitting(false);

    if (result.success) {
      setEmail("");
      toast.success(result.message || "Thanks for subscribing! We'll be in touch soon.");
    } else {
      toast.error(result.error || "Failed to subscribe. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 rounded-xs"
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="sm:w-auto rounded-xs"
        >
          {isSubmitting ? (
            "Subscribing..."
          ) : (
            <>
              {buttonText}
              {showIcon && <ArrowRight className="size-4" />}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

