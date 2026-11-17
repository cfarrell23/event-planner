import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { useToastStore } from "@/lib/store/useToastStore";
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

export default function ProfilePage() {
  const { data: session } = useSession();
  const storedEventTypes = useProfileStore((s) => s.eventTypes);
  const storedPriceRange = useProfileStore((s) => s.priceRange);
  const setPreferences = useProfileStore((s) => s.setPreferences);
  const showToast = useToastStore((s) => s.show);

  const [eventTypes, setEventTypes] = useState<EventType[]>(storedEventTypes);
  const [priceRange, setPriceRange] = useState<PriceRange | null>(storedPriceRange);

  useEffect(() => {
    setEventTypes(storedEventTypes);
    setPriceRange(storedPriceRange);
  }, [storedEventTypes, storedPriceRange]);

  function toggleType(type: EventType) {
    setEventTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  function handleSave() {
    if (eventTypes.length === 0 || !priceRange) return;
    setPreferences(eventTypes, priceRange);
    showToast("Preferences updated");
  }

  return (
    <AppShell>
      <div className="mb-8 flex items-center gap-4">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt=""
            width={56}
            height={56}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-xl font-bold text-foreground">{session?.user?.name}</h1>
          <p className="text-sm text-muted">{session?.user?.email}</p>
        </div>
      </div>

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
                "rounded-2xl border px-4 py-3 text-sm font-medium shadow-card transition-colors",
                eventTypes.includes(opt.value)
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-foreground hover:bg-surface-raised",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-8">
        <legend className="mb-3 text-sm font-medium text-foreground">Price range</legend>
        <div className="grid grid-cols-2 gap-3">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={priceRange === opt.value}
              onClick={() => setPriceRange(opt.value)}
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm font-medium shadow-card transition-colors",
                priceRange === opt.value
                  ? "border-accent-2 bg-accent-2 text-white"
                  : "border-border bg-surface text-foreground hover:bg-surface-raised",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Button size="lg" disabled={eventTypes.length === 0 || !priceRange} onClick={handleSave}>
        Save changes
      </Button>
    </AppShell>
  );
}
