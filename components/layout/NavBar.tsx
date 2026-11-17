import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { CalendarDays, Heart, Sparkles, User, LogOut, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/discover", label: "Discover", icon: Sparkles },
  { href: "/interested", label: "Interested", icon: Heart },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/profile", label: "Profile", icon: User },
];

export function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/discover" className="text-lg font-bold tracking-tight">
          Week<span className="text-accent">Ahead</span>
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

          {/* Scan Poster is the "real-world capture" entry point — given a distinct, thumb-friendly
              treatment since it's the product's secondary input mode alongside Discover. */}
          <Link
            href="/scan"
            aria-label="Scan Poster"
            title="Scan Poster"
            className={cn(
              "ml-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full shadow-glow transition-colors sm:h-10 sm:w-10",
              router.pathname.startsWith("/scan")
                ? "bg-accent text-white"
                : "bg-accent/90 text-white hover:bg-accent",
            )}
          >
            <Camera size={18} aria-hidden />
          </Link>

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
