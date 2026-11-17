import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { CalendarDays, Heart, Sparkles, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/for-you", label: "For You", icon: Sparkles },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/profile", label: "Profile", icon: User },
];

export function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/for-you" className="text-lg font-bold tracking-tight">
          <span className="text-accent">Night</span>Planner
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = router.pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-medium sm:px-3.5 sm:text-sm",
                  active
                    ? "bg-accent/15 text-accent"
                    : "text-muted hover:bg-surface-raised hover:text-foreground",
                )}
              >
                <Icon size={16} aria-hidden />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="ml-1 flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs text-muted hover:bg-surface-raised hover:text-foreground sm:px-3.5"
              aria-label="Sign out"
            >
              <LogOut size={16} aria-hidden />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
