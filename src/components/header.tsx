import Logo from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { Mails } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <Logo icon={Mails} text="Newsletter" />
        <ModeToggle align="end" />
      </div>
    </header>
  );
}

