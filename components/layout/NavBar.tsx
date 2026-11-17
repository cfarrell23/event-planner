import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { CalendarDays, Heart, Home, Sparkles, User, LogOut, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Sparkles },
  { href: "/interested", label: "Interested", icon: Heart },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/profile", label: "Profile", icon: User },
];

export function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/home" className="flex min-w-0 items-baseline gap-2">
          <span className="flex-shrink-0 font-display text-lg font-extrabold tracking-tight text-brand-green">
            Week<span className="text-accent">Ahead</span>
          </span>
          <span className="inline-block h-3 w-0.5 flex-shrink-0 rounded-full bg-accent" aria-hidden />
          <span className="truncate text-[11px] text-muted sm:text-xs">Great plan, just in time</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* On mobile this becomes a fixed bottom tab bar; on sm+ it's an inline pill row
              in the header. It stays a single <nav> so there is exactly one set of
              "Main navigation" links for accessibility tools and the e2e tests. */}
          <nav
            className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface px-0.5 py-1.5 sm:static sm:w-auto sm:justify-end sm:gap-1 sm:border-0 sm:bg-transparent sm:p-0"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = router.pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10px] font-medium sm:flex-none sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3.5 sm:py-2 sm:text-sm",
                    active
                      ? "text-accent sm:bg-accent/15"
                      : "text-muted hover:text-foreground sm:hover:bg-surface-raised",
                  )}
                >
                  <Icon size={17} aria-hidden className="sm:hidden" />
                  <Icon size={16} aria-hidden className="hidden sm:block" />
                  <span>{label}</span>
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
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5 sm:ml-0.5 sm:flex-none sm:h-10 sm:w-10 sm:flex-shrink-0 sm:items-center sm:justify-center sm:rounded-full sm:p-0 sm:shadow-glow",
                router.pathname.startsWith("/scan")
                  ? "text-accent sm:bg-accent sm:text-white"
                  : "text-muted hover:text-foreground sm:bg-accent/90 sm:text-white sm:hover:bg-accent",
              )}
            >
              <Camera size={17} aria-hidden />
              <span className="text-[10px] font-medium sm:hidden">Scan</span>
            </Link>
          </nav>

          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs text-muted hover:bg-surface-raised hover:text-foreground sm:px-3.5"
              aria-label="Sign out"
            >
              <LogOut size={16} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
