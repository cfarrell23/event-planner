import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { NavBar } from "./NavBar";
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
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
