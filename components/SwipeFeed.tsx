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
import { cn, formatDisplayDate } from "@/lib/utils";
import type { Listing } from "@/lib/types";

type SwipeDirection = "left" | "right" | "up" | "down";

interface CardRef {
  swipe: (dir: "left" | "right") => Promise<void>;
  restoreCard: () => Promise<void>;
}

/**
 * Swipeable "For You" discovery feed. Client-only — react-tinder-card touches the DOM on mount.
 * `compact` renders a smaller, horizontal card on desktop (used when embedded in the Home page
 * alongside other sections); mobile sizing is unchanged either way, as is the standalone
 * /discover page, which never passes `compact`.
 */
export function SwipeFeed({ compact = false }: { compact?: boolean } = {}) {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [index, setIndex] = useState(0);
  const cardRef = useRef<CardRef>(null);

  const savedIds = useInterestStore((s) => s.savedIds);
  const dismiss = useInterestStore((s) => s.dismiss);
  const save = useInterestStore((s) => s.save);
  const affinity = useProfileStore((s) => s.affinity);
  const recordLike = useProfileStore((s) => s.recordLike);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    getAllListings().then(setListings);
  }, []);

  // Only saved items leave the pool for good — skipped items loop back around once the lap
  // completes, so the feed never runs dry (swipe right to permanently retire a card).
  const feed = useMemo(() => {
    if (!listings) return [];
    return listings
      .filter((l) => !savedIds.includes(l.id))
      .sort((a, b) => (affinity[b.eventType] ?? 0) - (affinity[a.eventType] ?? 0));
    // Simple preference weighting: items whose type has more swipe-right history surface first.
  }, [listings, savedIds, affinity]);

  const current = feed.length > 0 ? feed[index % feed.length] : undefined;
  const next = feed.length > 1 ? feed[(index + 1) % feed.length] : undefined;

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
        <p className="font-medium text-foreground">You&apos;ve saved everything</p>
        <p className="text-sm">Every pick this week is already in your Interested list.</p>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto flex max-w-sm flex-col items-center", compact && "sm:max-w-2xl")}>
      <div className={cn("relative h-[520px] w-full", compact && "sm:h-48")}>
        {next && (
          <div className="absolute inset-0 scale-95 rounded-3xl opacity-60">
            <FeedCard listing={next} compact={compact} />
          </div>
        )}
        <TinderCard
          ref={cardRef}
          key={`${current.id}-${index}`}
          onSwipe={(dir) => handleSwipe(dir, current)}
          preventSwipe={["up", "down"]}
          className="tinder-swipe-container"
        >
          <FeedCard listing={current} compact={compact} />
        </TinderCard>
      </div>

      <div className={cn("mt-6 flex items-start gap-10", compact && "sm:mt-4")}>
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="secondary"
            size="lg"
            aria-label={`Skip ${current.name}`}
            onClick={() => cardRef.current?.swipe("left")}
            className="h-16 w-16 rounded-full p-0 text-accent"
          >
            <X size={26} aria-hidden />
          </Button>
          <span className="text-xs font-medium text-muted" aria-hidden>
            Not for me
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="primary"
            size="lg"
            aria-label={`Mark ${current.name} as interested`}
            onClick={() => cardRef.current?.swipe("right")}
            className="h-16 w-16 rounded-full p-0"
          >
            <Heart size={26} aria-hidden fill="currentColor" />
          </Button>
          <span className="text-xs font-medium text-muted" aria-hidden>
            Interested
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">
        Swipe or use the buttons — right saves it, left skips it for now (it&apos;ll come back around)
      </p>
    </div>
  );
}

function FeedCard({ listing, compact = false }: { listing: Listing; compact?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-glow">
      <Image src={listing.imageUrl} alt="" fill sizes="(min-width: 640px) 672px, 384px" className="object-cover" draggable={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className={cn("absolute bottom-0 left-0 right-0 p-5", compact && "sm:p-3")}>
        <div className={cn("mb-2 flex flex-wrap gap-1.5", compact && "sm:mb-1")}>
          <Badge variant="type" className="bg-accent-2 text-white uppercase tracking-wide">
            {listing.eventType}
          </Badge>
          <Badge className="bg-white/90 text-foreground uppercase tracking-wide">{listing.priceLabel}</Badge>
          {listing.deal && (
            <Badge variant="accent" className="bg-accent-3 text-foreground uppercase tracking-wide">
              {listing.deal.label}
            </Badge>
          )}
        </div>
        <h2 className={cn("font-display text-xl font-bold text-white", compact && "sm:text-base")}>
          {listing.name}
        </h2>
        <p className={cn("text-sm text-white/80", compact && "sm:text-xs")}>
          {listing.venue} · {formatDisplayDate(listing.date)} · {listing.time}
        </p>
      </div>
    </div>
  );
}
