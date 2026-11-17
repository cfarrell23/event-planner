import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDisplayDate } from "@/lib/utils";
import { listingHref, sourceLabel } from "@/lib/listingHelpers";
import type { Listing } from "@/lib/types";

const TYPE_LABELS: Record<string, string> = {
  club: "Club",
  gig: "Gig",
  comedy: "Comedy",
  "pop-up": "Pop-up",
  restaurant: "Restaurant",
};

/** Compact horizontal card used in the Interested folder and Planner day lists. */
export function ListingCard({
  listing,
  onRemove,
  removeLabel = "Remove",
  showSource = false,
}: {
  listing: Listing;
  onRemove?: () => void;
  removeLabel?: string;
  showSource?: boolean;
}) {
  const href = listingHref(listing);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
      <Link href={href} className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        <Image src={listing.imageUrl} alt="" fill sizes="64px" className="object-cover" unoptimized={listing.kind === "scanned"} />
      </Link>
      <Link href={href} className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{listing.name}</p>
        <p className="truncate text-xs text-muted">
          {listing.venue} · {formatDisplayDate(listing.date)} · {listing.time}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Badge variant="type">{TYPE_LABELS[listing.eventType] ?? listing.eventType}</Badge>
          <Badge>{listing.priceLabel}</Badge>
          {showSource && <Badge variant="default">{sourceLabel(listing)}</Badge>}
          {listing.deal && <Badge variant="accent">{listing.deal.label}</Badge>}
        </div>
      </Link>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={removeLabel}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-raised hover:text-danger"
        >
          <X size={16} aria-hidden />
        </button>
      )}
    </div>
  );
}
