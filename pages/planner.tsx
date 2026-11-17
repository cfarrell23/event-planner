import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { WeatherBadge } from "@/components/WeatherBadge";
import { getAllListings } from "@/lib/services/listings";
import { getWeekForecast } from "@/lib/services/weather";
import { useCalendarStore } from "@/lib/store/useCalendarStore";
import { useScannedStore } from "@/lib/store/useScannedStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { getCurrentWeekDates, formatDisplayDate } from "@/lib/utils";
import type { Listing, DayForecast } from "@/lib/types";

export default function PlannerPage() {
  const [apiListings, setApiListings] = useState<Listing[] | null>(null);
  const [forecast, setForecast] = useState<DayForecast[] | null>(null);
  const scannedItems = useScannedStore((s) => s.items);
  const rsvps = useCalendarStore((s) => s.rsvps);
  const cancelRsvp = useCalendarStore((s) => s.cancelRsvp);
  const showToast = useToastStore((s) => s.show);

  const weekDates = getCurrentWeekDates();

  useEffect(() => {
    getAllListings().then(setApiListings);
    getWeekForecast(weekDates).then(setForecast);
    // weekDates is derived from "today" and intentionally excluded — recomputing per render is fine.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allListings: Listing[] = [...(apiListings ?? []), ...scannedItems];

  return (
    <AppShell>
      <h1 className="mb-1 flex items-center gap-2 text-xl font-bold text-foreground">
        <CalendarDays size={20} className="text-accent" aria-hidden /> Planner
      </h1>
      <p className="mb-6 text-sm text-muted">Plans you&apos;ve RSVP&apos;d to, day by day — this week.</p>

      <div className="flex flex-col gap-4">
        {weekDates.map((date) => {
          const dayForecast = forecast?.find((f) => f.date === date);
          const dayItems = allListings.filter((l) =>
            rsvps.some((r) => r.listingId === l.id && r.date === date),
          );

          return (
            <section key={date} className="rounded-2xl border border-border bg-surface p-4 shadow-card">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-sm font-semibold text-foreground">{formatDisplayDate(date)}</h2>
                {dayForecast ? (
                  <WeatherBadge forecast={dayForecast} />
                ) : (
                  <span className="text-xs text-muted">Loading forecast...</span>
                )}
              </div>

              {dayItems.length === 0 ? (
                <p className="text-sm text-muted">Nothing booked for this day.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {dayItems.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      showSource
                      removeLabel={`Cancel RSVP for ${listing.name}`}
                      onRemove={() => {
                        cancelRsvp(listing.id);
                        showToast(`Cancelled RSVP for "${listing.name}"`);
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
