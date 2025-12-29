import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNewsletters } from "@/app/actions/get-data";
import { Calendar, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewslettersPage() {
  const newslettersResult = await getNewsletters();
  const newsletters = newslettersResult.success ? newslettersResult.data : [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Our Newsletters
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse through our published newsletters and stay up to date with the latest content.
            </p>
          </div>

          {/* Back to Home Link */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                ← Back to Home
              </Button>
            </Link>
          </div>

          {/* Newsletters List */}
          {newsletters.length > 0 ? (
            <div className="space-y-6">
              {newsletters.map((newsletter) => (
                <Card key={newsletter.id} className="rounded-xs">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="mb-2 text-2xl">
                          {newsletter.title}
                        </CardTitle>
                        {newsletter.excerpt && (
                          <CardDescription className="text-base">
                            {newsletter.excerpt}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      {newsletter.sent_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4" />
                          <span>Sent on {formatDate(newsletter.sent_at)}</span>
                        </div>
                      )}
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="text-muted-foreground line-clamp-3">
                        {newsletter.content}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Link href={`/newsletters/${newsletter.id}`}>
                        <Button variant="outline" className="gap-2">
                          Read Full Newsletter
                          <Mail className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="rounded-xs">
              <CardContent className="py-12 text-center">
                <Mail className="mx-auto mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No newsletters yet</h3>
                <p className="text-muted-foreground">
                  We haven&apos;t published any newsletters yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

