import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { NavBar } from "./NavBar";
import { RetroWaves } from "./RetroWaves";
import { useProfileStore } from "@/lib/store/useProfileStore";

/**
 * Wraps authenticated pages: redirects unauthenticated users to /signin and
 * redirects signed-in-but-not-onboarded users to /onboarding before showing the main app.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status } = useSession();
  const onboarded = useProfileStore((s) => s.onboarded);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    } else if (status === "authenticated" && !onboarded && router.pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [status, onboarded, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Loading...
      </div>
    );
  }

  if (!onboarded && router.pathname !== "/onboarding") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex lg:items-start lg:justify-center lg:py-10">
      <RetroWaves className="fixed inset-0 z-0 hidden h-full w-full lg:block" />
      <div className="relative z-10 min-h-screen bg-background text-foreground lg:min-h-0 lg:w-full lg:max-w-5xl lg:rounded-[2rem] lg:shadow-card">
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 py-6 pb-24 sm:pb-6">{children}</main>
      </div>
    </div>
  );
}
