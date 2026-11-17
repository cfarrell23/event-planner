import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import TinderCard from "react-tinder-card";
import { Heart, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getAllListings } from "@/lib/services/listings";
import { useInterestStore } from "@/lib/store/useInterestStore";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { formatDisplayDate } from "@/lib/utils";
import type { Listing } from "@/lib/types";

type SwipeDirection = "left" | "right" | "up" | "down";

interface CardRef {
  swipe: (dir: "left" | "right") => Promise<void>;
  restoreCard: () => Promise<void>;
}

/** Swipeable "For You" discovery feed. Client-only — react-tinder-card touches the DOM on mount. */
export function SwipeFeed() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [index, setIndex] = useState(0);
  const cardRef = useRef<CardRef>(null);

  const savedIds = useInterestStore((s) => s.savedIds);
  const dismissedIds = useInterestStore((s) => s.dismissedIds);
  const save = useInterestStore((s) => s.save);
  const dismiss = useInterestStore((s) => s.dismiss);
  const affinity = useProfileStore((s) => s.affinity);
  const recordLike = useProfileStore((s) => s.recordLike);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    getAllListings().then(setListings);
  }, []);

  const feed = useMemo(() => {
    if (!listings) return [];
    const seen = new Set([...savedIds, ...dismissedIds]);
    return listings
      .filter((l) => !seen.has(l.id))
      .sort((a, b) => (affinity[b.eventType] ?? 0) - (affinity[a.eventType] ?? 0));
    // Simple preference weighting: items whose type has more swipe-right history surface first.
  }, [listings, savedIds, dismissedIds, affinity]);

  const current = feed[index];
  const next = feed[index + 1];

  function handleSwipe(dir: SwipeDirection, listing: Listing) {
    if (dir === "right") {
      save(listing.id);
      recordLike(listing.eventType);
      showToast(`Saved "${listing.name}" to Interested`);
    } else if (dir === "left") {
      dismiss(listing.id);
    }
    setIndex((i) => i + 1);
  }

  if (listings === null) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted">Loading feed...</div>
    );
  }

  if (!current) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-center text-muted">
        <Sparkles aria-hidden />
        <p className="font-medium text-foreground">You&apos;re all caught up</p>
        <p className="text-sm">Check back later for more picks, or review what you&apos;ve saved.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center">
      <div className="relative h-[520px] w-full">
        {next && (
          <div className="absolute inset-0 scale-95 rounded-3xl opacity-60">
            <FeedCard listing={next} />
          </div>
        )}
        <TinderCard
          ref={cardRef}
          key={current.id}
          onSwipe={(dir) => handleSwipe(dir, current)}
          preventSwipe={["up", "down"]}
          className="tinder-swipe-container"
        >
          <FeedCard listing={current} />
        </TinderCard>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <Button
          variant="secondary"
          size="lg"
          aria-label={`Skip ${current.name}`}
          onClick={() => cardRef.current?.swipe("left")}
          className="h-14 w-14 rounded-full p-0"
        >
          <X aria-hidden />
        </Button>
        <Button
          variant="primary"
          size="lg"
          aria-label={`Mark ${current.name} as interested`}
          onClick={() => cardRef.current?.swipe("right")}
          className="h-14 w-14 rounded-full p-0"
        >
          <Heart aria-hidden />
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted">Swipe or use the buttons — right saves, left skips</p>
    </div>
  );
}

function FeedCard({ listing }: { listing: Listing }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-glow">
      <Image src={listing.imageUrl} alt="" fill sizes="384px" className="object-cover" draggable={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <Badge variant="type">{listing.eventType}</Badge>
          <Badge>{listing.priceLabel}</Badge>
          {listing.deal && <Badge variant="accent">{listing.deal.label}</Badge>}
        </div>
        <h2 className="text-xl font-bold text-foreground">{listing.name}</h2>
        <p className="text-sm text-muted">
          {listing.venue} · {formatDisplayDate(listing.date)} · {listing.time}
        </p>
      </div>
    </div>
  );
}
