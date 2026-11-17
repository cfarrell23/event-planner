import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RsvpEntry, ListingKind } from "../types";

interface CalendarState {
  rsvps: RsvpEntry[];
  addRsvp: (listingId: string, kind: ListingKind, date: string) => void;
  cancelRsvp: (listingId: string) => void;
  isRsvped: (listingId: string) => boolean;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      rsvps: [],
      addRsvp: (listingId, kind, date) =>
        set((state) =>
          state.rsvps.some((r) => r.listingId === listingId)
            ? state
            : {
                rsvps: [
                  ...state.rsvps,
                  { listingId, kind, date, addedAt: new Date().toISOString() },
                ],
              },
        ),
      cancelRsvp: (listingId) =>
        set((state) => ({ rsvps: state.rsvps.filter((r) => r.listingId !== listingId) })),
      isRsvped: (listingId) => get().rsvps.some((r) => r.listingId === listingId),
    }),
    { name: "event-planner-calendar" },
  ),
);
