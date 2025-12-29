import Logo from "@/components/logo";
import { Mails } from "lucide-react";
import Link from "next/link";
import { AuthButton } from "@/components/auth-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/">
          <Logo icon={Mails} text="Newsletter" />
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/newsletters" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Newsletters
          </Link>
          <AuthButton variant="avatar" />
        </div>
      </div>
    </header>
  );
}

