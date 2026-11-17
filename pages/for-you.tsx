import dynamic from "next/dynamic";
import { AppShell } from "@/components/layout/AppShell";

// react-tinder-card touches the DOM on mount; load client-side only to avoid SSR/hydration issues.
const SwipeFeed = dynamic(() => import("@/components/SwipeFeed").then((m) => m.SwipeFeed), {
  ssr: false,
  loading: () => <div className="flex h-[60vh] items-center justify-center text-muted">Loading feed...</div>,
});

export default function ForYouPage() {
  return (
    <AppShell>
      <h1 className="mb-6 text-xl font-bold text-foreground">For You</h1>
      <SwipeFeed />
    </AppShell>
  );
}
