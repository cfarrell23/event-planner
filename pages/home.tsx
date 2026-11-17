import { useEffect, useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, ChevronDown, Calendar, List as ListIcon, Map as MapIcon, User } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { VerticalListingCard } from "@/components/home/VerticalListingCard";
import { FeatureBanner } from "@/components/home/FeatureBanner";
import { MapEmbed } from "@/components/MapEmbed";
import { getAllListings } from "@/lib/services/listings";
import { useInterestStore } from "@/lib/store/useInterestStore";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { getCurrentWeekDates, cn } from "@/lib/utils";
import type { Listing, EventType } from "@/lib/types";

// react-tinder-card touches the DOM on mount; load client-side only to avoid SSR/hydration issues.
const SwipeFeed = dynamic(() => import("@/components/SwipeFeed").then((m) => m.SwipeFeed), {
  ssr: false,
  loading: () => <div className="flex h-[60vh] items-center justify-center text-muted">Loading feed...</div>,
});

const TYPE_LABELS: Record<EventType | "restaurant", string> = {
  club: "clubs",
  gig: "gigs",
  comedy: "comedy",
  "pop-up": "pop-ups",
  restaurant: "restaurants",
};

const TRENDING_BADGES = ["Trending", "New this week", "Selling fast"];

export default function HomePage() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [nearView, setNearView] = useState<"list" | "map">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const savedIds = useInterestStore((s) => s.savedIds);
  const affinity = useProfileStore((s) => s.affinity);
  const eventTypes = useProfileStore((s) => s.eventTypes);

  useEffect(() => {
    getAllListings().then(setListings);
  }, []);

  const weekDates = useMemo(() => getCurrentWeekDates(), []);

  const sections = useMemo(() => {
    if (!listings) return null;
    const unsaved = listings.filter((l) => !savedIds.includes(l.id));

    const forYou = [...unsaved]
      .sort((a, b) => (affinity[b.eventType] ?? 0) - (affinity[a.eventType] ?? 0))
      .slice(0, 3);
    const used = new Set(forYou.map((l) => l.id));

    const different =
      unsaved.find((l) => !used.has(l.id) && !eventTypes.includes(l.eventType as EventType)) ??
      unsaved.find((l) => !used.has(l.id));
    if (different) used.add(different.id);

    const trending = unsaved.filter((l) => !used.has(l.id)).slice(0, 3);
    trending.forEach((l) => used.add(l.id));

    const nearYou = unsaved.filter((l) => !used.has(l.id));

    return { forYou, different, trending, nearYou };
  }, [listings, savedIds, affinity, eventTypes]);

  return (
    <AppShell>
      {/* Decorative — no location switching or search wired up yet. */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground"
            aria-hidden
            tabIndex={-1}
          >
            Shoreditch <ChevronDown size={14} aria-hidden />
          </button>
          {/* Collapses the day strip below into a single icon on desktop. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground sm:flex"
          >
            <Calendar size={16} aria-hidden />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground"
            aria-hidden
            tabIndex={-1}
          >
            <Search size={16} aria-hidden />
          </button>
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt=""
              width={36}
              height={36}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-accent">
              <User size={16} aria-hidden />
            </div>
          )}
        </div>
      </div>

      {/* Decorative — doesn't filter the sections below yet. Collapses to a single calendar
          icon on desktop, where a full week of day-chips takes up space without adding much. */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 sm:hidden">
        {weekDates.map((date, i) => {
          const d = new Date(`${date}T00:00:00`);
          const active = selectedDate === date;
          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={cn(
                "flex flex-shrink-0 flex-col items-center rounded-2xl px-3 py-2 text-xs font-medium",
                active ? "bg-accent text-white" : "border border-border bg-surface text-foreground",
              )}
            >
              <span>{i === 0 ? "TODAY" : d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
              <span className="text-base font-bold">{d.getDate()}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setSelectedDate(null)}
          className={cn(
            "flex flex-shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground",
            selectedDate === null && "border-accent",
          )}
        >
          <Calendar size={16} aria-hidden />
          Any day
        </button>
      </div>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Discover something</h1>
          <p className="text-sm text-muted">Swipe your way to your next plan.</p>
        </div>
      </div>
      <div className="mb-10">
        <SwipeFeed compact />
      </div>

      {listings === null || sections === null ? (
        <p className="text-sm text-muted">Loading your week...</p>
      ) : (
        <>
          <Section title="For You" subtitle="Picked around what you're into">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {sections.forYou.map((listing) => (
                <VerticalListingCard
                  key={listing.id}
                  listing={listing}
                  reason={
                    affinity[listing.eventType] > 0
                      ? `Because you like ${TYPE_LABELS[listing.eventType]}`
                      : "Picked for your week"
                  }
                />
              ))}
            </div>
          </Section>

          {sections.different && (
            <Section title="Try Something Different" subtitle="Step outside your usual. You might surprise yourself.">
              <FeatureBanner listing={sections.different} tag="A little different for you" />
            </Section>
          )}

          <Section title="Trending this week" subtitle="What everyone's talking about">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {sections.trending.map((listing, i) => (
                <VerticalListingCard key={listing.id} listing={listing} badge={TRENDING_BADGES[i % TRENDING_BADGES.length]} />
              ))}
            </div>
          </Section>

          <Section
            title="Near You"
            subtitle="Things happening around Shoreditch"
            action={
              <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
                <button
                  type="button"
                  onClick={() => setNearView("list")}
                  aria-label="Show as list"
                  aria-pressed={nearView === "list"}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full",
                    nearView === "list" ? "bg-accent text-white" : "text-muted",
                  )}
                >
                  <ListIcon size={14} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setNearView("map")}
                  aria-label="Show on map"
                  aria-pressed={nearView === "map"}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full",
                    nearView === "map" ? "bg-accent text-white" : "text-muted",
                  )}
                >
                  <MapIcon size={14} aria-hidden />
                </button>
              </div>
            }
          >
            {nearView === "map" ? (
              <MapEmbed address="Shoreditch, London" name="Shoreditch" />
            ) : (
              <div className="flex flex-col gap-2">
                {sections.nearYou.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </Section>
        </>
      )}
    </AppShell>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-1 flex items-start justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {action ?? (
          <Link href="/interested" className="text-sm font-medium text-accent">
            See all
          </Link>
        )}
      </div>
      <p className="mb-3 text-sm text-muted">{subtitle}</p>
      {children}
    </section>
  );
}
