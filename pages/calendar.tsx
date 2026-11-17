import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { WeatherBadge } from "@/components/WeatherBadge";
import { getAllListings } from "@/lib/services/listings";
import { getWeekForecast } from "@/lib/services/weather";
import { useCalendarStore } from "@/lib/store/useCalendarStore";
import { useToastStore } from "@/lib/store/useToastStore";
import { getCurrentWeekDates, formatDisplayDate } from "@/lib/utils";
import type { Listing, DayForecast } from "@/lib/types";

export default function CalendarPage() {
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [forecast, setForecast] = useState<DayForecast[] | null>(null);
  const rsvps = useCalendarStore((s) => s.rsvps);
  const cancelRsvp = useCalendarStore((s) => s.cancelRsvp);
  const showToast = useToastStore((s) => s.show);

  const weekDates = getCurrentWeekDates();

  useEffect(() => {
    getAllListings().then(setListings);
    getWeekForecast(weekDates).then(setForecast);
    // weekDates is derived from "today" and intentionally excluded — recomputing per render is fine.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppShell>
      <h1 className="mb-1 flex items-center gap-2 text-xl font-bold text-foreground">
        <CalendarDays size={20} aria-hidden /> This Week
      </h1>
      <p className="mb-6 text-sm text-muted">Plans you&apos;ve RSVP&apos;d to, day by day.</p>

      <div className="flex flex-col gap-4">
        {weekDates.map((date) => {
          const dayForecast = forecast?.find((f) => f.date === date);
          const dayItems = (listings ?? []).filter((l) =>
            rsvps.some((r) => r.listingId === l.id && r.date === date),
          );

          return (
            <section key={date} className="rounded-2xl border border-border bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">{formatDisplayDate(date)}</h2>
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
