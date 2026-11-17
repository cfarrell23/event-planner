import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/lib/store/useProfileStore";
import type { EventType, PriceRange } from "@/lib/types";

const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: "club", label: "Clubs" },
  { value: "gig", label: "Gigs" },
  { value: "comedy", label: "Comedy nights" },
  { value: "pop-up", label: "Pop-up events" },
];

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "low", label: "£ Budget-friendly" },
  { value: "medium", label: "££ Mid-range" },
  { value: "high", label: "£££ Treat yourself" },
];

export default function Onboarding() {
  const router = useRouter();
  const { status } = useSession();
  const setPreferences = useProfileStore((s) => s.setPreferences);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status, router]);

  function toggleType(type: EventType) {
    setEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  function handleSubmit() {
    if (eventTypes.length === 0 || !priceRange) return;
    setPreferences(eventTypes, priceRange);
    router.replace("/calendar");
  }

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
      <h1 className="mb-1 text-2xl font-bold text-foreground">What are you into?</h1>
      <p className="mb-8 text-sm text-muted">
        Pick what sounds like you — we&apos;ll use this to personalize your For You feed. You can
        change this anytime from your profile.
      </p>

      <fieldset className="mb-8">
        <legend className="mb-3 text-sm font-medium text-foreground">Event types</legend>
        <div className="grid grid-cols-2 gap-3">
          {EVENT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={eventTypes.includes(opt.value)}
              onClick={() => toggleType(opt.value)}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                eventTypes.includes(opt.value)
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-surface text-foreground hover:bg-surface-raised",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-10">
        <legend className="mb-3 text-sm font-medium text-foreground">Price range</legend>
        <div className="grid grid-cols-2 gap-3">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={priceRange === opt.value}
              onClick={() => setPriceRange(opt.value)}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                priceRange === opt.value
                  ? "border-accent-2 bg-accent-2/15 text-accent-2"
                  : "border-border bg-surface text-foreground hover:bg-surface-raised",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Button
        size="lg"
        disabled={eventTypes.length === 0 || !priceRange}
        onClick={handleSubmit}
      >
        Start exploring
      </Button>
    </div>
  );
}
