import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsletterForm } from "@/components/newsletter-form";
import { getTestimonials, getSubscriberCount, getTotalLikes } from "@/app/actions/get-data";
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Mail,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

function formatSubscriberCount(count: number): string {
  if (count >= 1000) {
    const thousands = (count / 1000).toFixed(1);
    return `${thousands.replace(/\.0$/, "")}K+`;
  }
  return count.toString();
}

export default async function Home() {
  // Fetch data from database
  const [testimonialsResult, subscriberCountResult, likesResult] = await Promise.all([
    getTestimonials(),
    getSubscriberCount(),
    getTotalLikes(),
  ]);

  const testimonials = testimonialsResult.success ? testimonialsResult.data : [];
  const subscriberCount = subscriberCountResult.success ? subscriberCountResult.count : 0;
  const totalLikes = likesResult.success ? likesResult.count : 0;

  const features = [
    {
      icon: Sparkles,
      title: "Curated Content",
      description: "Hand-picked articles and insights delivered to your inbox monthly."
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-xs border bg-card/50 px-4 py-2 text-sm">
              <Sparkles className="size-4 text-primary" />
              <span className="text-muted-foreground">
                Join {formatSubscriberCount(subscriberCount)} subscribers
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Stay Informed, Stay Ahead
            </h1>
            <p className="mb-8 text-muted-foreground">
              Get monthly insights, curated content, and exclusive updates delivered straight to your inbox. 
              No spam, just value.
            </p>
            
            {/* Email Signup Form */}
            <div className="mx-auto mb-12 max-w-md">
              <NewsletterForm />
            </div>

            {/* View Newsletters Link */}
            <div className="mb-8">
              <Button asChild variant="link" size="sm" className="text-muted-foreground">
                <a href="/newsletters">
                  View past newsletters
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold">{formatSubscriberCount(subscriberCount)}</div>
                <div className="text-sm text-muted-foreground">Subscribers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{formatSubscriberCount(totalLikes)}</div>
                <div className="text-sm text-muted-foreground">Likes</div>
              </div>
              <div>
                <div className="text-3xl font-bold">Monthly</div>
                <div className="text-sm text-muted-foreground">Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/15 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Why Subscribe?
            </h2>
            <p className="text-muted-foreground">
              Everything you need to stay informed and ahead of the curve.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="rounded-xs">
                  <CardHeader>
                    <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xs bg-primary/10">
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
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Loved by Our Readers
            </h2>
            <p className="text-muted-foreground">
              See what our subscribers are saying about us.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="rounded-xs">
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
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground py-8">
                No testimonials available yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/15 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-2xl rounded-xs">
            <CardHeader className="text-center">
              <Mail className="mx-auto mb-4 size-12 text-primary" />
              <CardTitle className="text-3xl">Ready to Get Started?</CardTitle>
              <CardDescription className="text-muted-foreground">
                Join thousands of subscribers and never miss an update.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterForm buttonText="Subscribe Now" showIcon={false} />
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