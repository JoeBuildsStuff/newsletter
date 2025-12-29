import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getNewsletterById } from "@/app/actions/get-data";
import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const newsletterResult = await getNewsletterById(id);

  if (!newsletterResult.success || !newsletterResult.data) {
    notFound();
  }

  const newsletter = newsletterResult.data;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link href="/newsletters">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="size-4" />
                Back to All Newsletters
              </Button>
            </Link>
          </div>

          {/* Newsletter Content */}
          <Card className="rounded-xs">
            <CardHeader>
              <div className="mb-4">
                {newsletter.sent_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="size-4" />
                    <span>Published on {formatDate(newsletter.sent_at)}</span>
                  </div>
                )}
              </div>
              <CardTitle className="text-3xl sm:text-4xl">
                {newsletter.title}
              </CardTitle>
              {newsletter.excerpt && (
                <p className="mt-4 text-lg text-muted-foreground">
                  {newsletter.excerpt}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap text-foreground">
                  {newsletter.content}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to List */}
          <div className="mt-8 text-center">
            <Link href="/newsletters">
              <Button variant="outline">
                View All Newsletters
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

