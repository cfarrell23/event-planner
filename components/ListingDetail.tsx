import Image from "next/image";
import { ExternalLink, MapPin, CalendarPlus, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MapEmbed } from "@/components/MapEmbed";
import { useCalendarStore } from "@/lib/store/useCalendarStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { formatDisplayDate } from "@/lib/utils";
import type { Listing } from "@/lib/types";

/** Shared detail layout for both Event and Restaurant listings. */
export function ListingDetail({ listing }: { listing: Listing }) {
  const isRsvped = useCalendarStore((s) => s.isRsvped(listing.id));
  const addRsvp = useCalendarStore((s) => s.addRsvp);
  const cancelRsvp = useCalendarStore((s) => s.cancelRsvp);
  const showToast = useToastStore((s) => s.show);

  function handleRsvpToggle() {
    if (isRsvped) {
      cancelRsvp(listing.id);
      showToast(`Cancelled RSVP for "${listing.name}"`);
    } else {
      addRsvp(listing.id, listing.kind, listing.date);
      showToast(`Added "${listing.name}" to your calendar`);
    }
  }

  return (
    <article>
      <div className="relative mb-5 h-56 w-full overflow-hidden rounded-2xl sm:h-72">
        <Image src={listing.imageUrl} alt="" fill sizes="768px" className="object-cover" />
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        <Badge variant="type">{listing.eventType}</Badge>
        <Badge>{listing.priceLabel}</Badge>
        <Badge variant="default">via {listing.source}</Badge>
        {listing.deal && <Badge variant="accent">{listing.deal.label}</Badge>}
      </div>

      <h1 className="mb-1 text-2xl font-bold text-foreground">{listing.name}</h1>
      <p className="mb-4 text-sm text-muted">
        {formatDisplayDate(listing.date)} · {listing.time}
      </p>

      <p className="mb-5 text-sm leading-relaxed text-foreground/90">{listing.description}</p>

      {listing.deal && (
        <div className="mb-5 rounded-xl border border-accent/30 bg-accent/10 p-3 text-sm text-foreground">
          <p className="font-semibold text-accent">{listing.deal.label}</p>
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
          {isRsvped ? "Cancel RSVP" : "RSVP to Calendar"}
        </Button>
        <a href={listing.bookingUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full">
            <ExternalLink aria-hidden />
            Book on {listing.source}
          </Button>
        </a>
      </div>
      <p className="mt-3 text-xs text-muted">
        Booking happens on {listing.source}&apos;s site — NightPlanner doesn&apos;t process payments
        or reservations directly.
      </p>
    </article>
  );
}
