import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useInterestStore } from "@/lib/store/useInterestStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { cn, formatDisplayDate } from "@/lib/utils";
import { listingHref } from "@/lib/listingHelpers";
import type { Listing } from "@/lib/types";

/**
 * Vertical card used by the Home page's "For You" and "Trending this week" sections: image on
 * top, a save toggle in the corner, and either a "because you..." reason pill or a small badge
 * (e.g. "Trending") depending on which section is rendering it.
 */
export function VerticalListingCard({
  listing,
  reason,
  badge,
}: {
  listing: Listing;
  reason?: string;
  badge?: string;
}) {
  const saved = useInterestStore((s) => s.savedIds.includes(listing.id));
  const save = useInterestStore((s) => s.save);
  const remove = useInterestStore((s) => s.remove);
  const showToast = useToastStore((s) => s.show);

  function toggleSave(e: MouseEvent) {
    e.preventDefault();
    if (saved) {
      remove(listing.id);
      showToast(`Removed "${listing.name}" from Interested`);
    } else {
      save(listing.id);
      showToast(`Saved "${listing.name}" to Interested`);
    }
  }

  return (
    <Link href={listingHref(listing)} className="block w-full flex-shrink-0">
      <div className="relative mb-2 aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image src={listing.imageUrl} alt="" fill sizes="240px" className="object-cover" />
        {badge && (
          <span className="absolute left-2 top-2 rounded-full bg-accent-3 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">
            {badge}
          </span>
        )}
        <button
          onClick={toggleSave}
          aria-label={saved ? `Remove ${listing.name} from Interested` : `Save ${listing.name} to Interested`}
          className={cn(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full shadow-card",
            saved ? "bg-accent text-white" : "bg-white/90 text-accent",
          )}
        >
          <Heart size={14} aria-hidden fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <p className="truncate font-display text-sm font-semibold text-foreground">{listing.name}</p>
      <p className="truncate text-xs text-muted">
        {listing.venue} · {formatDisplayDate(listing.date)} · {listing.priceLabel}
      </p>
      {reason && (
        <span className="mt-1.5 inline-block rounded-full bg-sand px-2 py-0.5 text-[10px] font-medium text-foreground/70">
          {reason}
        </span>
      )}
    </Link>
  );
}
