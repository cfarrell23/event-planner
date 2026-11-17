import dynamic from "next/dynamic";
import { AppShell } from "@/components/layout/AppShell";

// react-tinder-card touches the DOM on mount; load client-side only to avoid SSR/hydration issues.
const SwipeFeed = dynamic(() => import("@/components/SwipeFeed").then((m) => m.SwipeFeed), {
  ssr: false,
  loading: () => <div className="flex h-[60vh] items-center justify-center text-muted">Loading feed...</div>,
});

export default function DiscoverPage() {
  return (
    <AppShell>
      <div className="mb-6 flex items-start justify-between">
        <h1 className="text-xl font-bold text-foreground">Discover</h1>
        <p className="hidden rotate-2 font-script text-lg text-accent sm:block" aria-hidden>
          Good plans ahead ♡
        </p>
      </div>
      <SwipeFeed />
    </AppShell>
  );
}
