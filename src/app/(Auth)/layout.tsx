import { Mails } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center p-4">
        <Mails className="size-10 shrink-0" />
        <h1 className="text-2xl font-bold">Newsletter</h1>
        <p className="text-sm text-muted-foreground">
          {/* subheading here */}
        </p>
      {children}
    </main>
  );
}
