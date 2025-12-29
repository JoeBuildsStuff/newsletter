"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Mail,
  ArrowRight,
  Star
} from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      alert("Thanks for subscribing! We'll be in touch soon.");
    }, 1000);
  };

  const features = [
    {
      icon: Sparkles,
      title: "Curated Content",
      description: "Hand-picked articles and insights delivered to your inbox weekly."
    },
    {
      icon: TrendingUp,
      title: "Stay Ahead",
      description: "Get the latest trends and updates before they go mainstream."
    },
    {
      icon: Users,
      title: "Expert Community",
      description: "Join thousands of professionals who trust our newsletter."
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      content: "This newsletter has become my go-to source for industry insights. Highly recommended!",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Software Engineer",
      content: "The quality of content is outstanding. I look forward to every issue.",
      rating: 5
    },
    {
      name: "Emily Johnson",
      role: "Designer",
      content: "Best newsletter I've subscribed to. Always relevant and well-curated.",
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
              <Sparkles className="size-4 text-primary" />
              <span className="text-muted-foreground">Join 10,000+ subscribers</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Stay Informed, Stay Ahead
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Get weekly insights, curated content, and exclusive updates delivered straight to your inbox. 
              No spam, just value.
            </p>
            
            {/* Email Signup Form */}
            <form onSubmit={handleSubmit} className="mx-auto mb-12 max-w-md">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="sm:w-auto"
                >
                  {isSubmitting ? (
                    "Subscribing..."
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-muted-foreground">Subscribers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Weekly</div>
                <div className="text-sm text-muted-foreground">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Why Subscribe?
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to stay informed and ahead of the curve.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="">
                  <CardHeader>
                    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/50 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Loved by Our Readers
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our subscribers are saying about us.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="mb-2 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base">
                    &ldquo;{testimonial.content}&rdquo;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <Mail className="mx-auto mb-4 size-12 text-primary" />
              <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-base">
                Join thousands of subscribers and never miss an update.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="sm:w-auto"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe Now"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="font-semibold">Newsletter</p>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 