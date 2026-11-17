import { useState } from "react";
import Image from "next/image";
import { ExternalLink, MapPin, CalendarPlus, CalendarX, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MapEmbed } from "@/components/MapEmbed";
import { ScanReviewForm, type ScanReviewValues } from "@/components/ScanReviewForm";
import { useCalendarStore } from "@/lib/store/useCalendarStore";
import { useScannedStore } from "@/lib/store/useScannedStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { formatDisplayDate } from "@/lib/utils";
import { isSafeExternalUrl } from "@/lib/scanUtils";
import type { Listing } from "@/lib/types";

/** Shared detail layout for Event, Restaurant, and Scanned listings. */
export function ListingDetail({ listing }: { listing: Listing }) {
  const isRsvped = useCalendarStore((s) => s.isRsvped(listing.id));
  const addRsvp = useCalendarStore((s) => s.addRsvp);
  const cancelRsvp = useCalendarStore((s) => s.cancelRsvp);
  const updateScanned = useScannedStore((s) => s.updateItem);
  const showToast = useToastStore((s) => s.show);
  const [editing, setEditing] = useState(false);

  function handleRsvpToggle() {
    if (isRsvped) {
      cancelRsvp(listing.id);
      showToast(`Cancelled RSVP for "${listing.name}"`);
    } else {
      addRsvp(listing.id, listing.kind, listing.date);
      showToast(`Added "${listing.name}" to your planner`);
    }
  }

  function handleSaveEdits(values: ScanReviewValues) {
    updateScanned(listing.id, values);
    showToast("Updated poster details");
    setEditing(false);
  }

  if (listing.kind === "scanned" && editing) {
    return (
      <article>
        <h1 className="mb-4 text-xl font-bold text-foreground">Edit scanned details</h1>
        <ScanReviewForm
          initialValues={listing}
          fieldConfidence={listing.fieldConfidence}
          onSave={handleSaveEdits}
          onCancel={() => setEditing(false)}
          submitLabel="Save changes"
        />
      </article>
    );
  }

  const canBook = isSafeExternalUrl(listing.bookingUrl);

  return (
    <article>
      <div className="relative mb-5 h-56 w-full overflow-hidden rounded-3xl sm:h-72">
        <Image
          src={listing.imageUrl}
          alt=""
          fill
          sizes="768px"
          className="object-cover"
          unoptimized={listing.kind === "scanned"}
        />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="type">{listing.eventType}</Badge>
        <Badge>{listing.priceLabel}</Badge>
        <Badge variant="default">via {listing.source}</Badge>
        {listing.deal && <Badge variant="accent">{listing.deal.label}</Badge>}
        {listing.kind === "scanned" && (
          <button
            onClick={() => setEditing(true)}
            className="ml-auto flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <Pencil size={12} aria-hidden /> Edit details
          </button>
        )}
      </div>

      <h1 className="mb-1 text-2xl font-bold text-foreground">{listing.name}</h1>
      <p className="mb-4 text-sm text-muted">
        {formatDisplayDate(listing.date)} · {listing.time}
      </p>

      <p className="mb-5 text-sm leading-relaxed text-foreground/90">{listing.description}</p>

      {listing.deal && (
        <div className="mb-5 rounded-xl border border-accent-3/40 bg-accent-3/15 p-3 text-sm text-foreground">
          <p className="font-semibold text-foreground">{listing.deal.label}</p>
          <p className="text-foreground/80">{listing.deal.description}</p>
        </div>
      )}

      <div className="mb-5 flex items-start gap-2 text-sm text-muted">
        <MapPin size={16} className="mt-0.5 flex-shrink-0" aria-hidden />
        <div>
          <p className="font-medium text-foreground">{listing.venue}</p>
          <p>{listing.address}</p>
        </div>
      </div>

      <div className="mb-6">
        <MapEmbed address={listing.address} name={listing.venue} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant={isRsvped ? "secondary" : "primary"}
          size="lg"
          onClick={handleRsvpToggle}
          className="w-full sm:w-auto"
        >
          {isRsvped ? <CalendarX aria-hidden /> : <CalendarPlus aria-hidden />}
          {isRsvped ? "Cancel RSVP" : "RSVP to Planner"}
        </Button>
        {canBook ? (
          <a href={listing.bookingUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              <ExternalLink aria-hidden />
              {listing.kind === "scanned" ? "Open detected link" : `Book on ${listing.source}`}
            </Button>
          </a>
        ) : listing.kind === "scanned" ? (
          <p className="flex items-center text-xs text-muted">No booking link detected from this poster.</p>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-muted">
        {listing.kind === "scanned"
          ? "This was saved from a scanned poster — WeekAhead doesn't process payments or confirm this booking for you."
          : `Booking happens on ${listing.source}'s site — WeekAhead doesn't process payments or reservations directly.`}
      </p>
    </article>
  );
}
