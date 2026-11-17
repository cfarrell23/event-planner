import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EventType, PriceRange } from "../types";

interface ProfileState {
  onboarded: boolean;
  eventTypes: EventType[];
  priceRange: PriceRange | null;
  /** Weighted swipe-right counts per event type; used to bias the For You feed ordering. */
  affinity: Record<EventType | "restaurant", number>;
  setPreferences: (eventTypes: EventType[], priceRange: PriceRange) => void;
  recordLike: (eventType: EventType | "restaurant") => void;
  reset: () => void;
}

const emptyAffinity: Record<EventType | "restaurant", number> = {
  club: 0,
  gig: 0,
  comedy: 0,
  "pop-up": 0,
  restaurant: 0,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      eventTypes: [],
      priceRange: null,
      affinity: { ...emptyAffinity },
      setPreferences: (eventTypes, priceRange) =>
        set({ onboarded: true, eventTypes, priceRange }),
      recordLike: (eventType) =>
        set({ affinity: { ...get().affinity, [eventType]: get().affinity[eventType] + 1 } }),
      reset: () =>
        set({ onboarded: false, eventTypes: [], priceRange: null, affinity: { ...emptyAffinity } }),
    }),
    { name: "event-planner-profile" },
  ),
);
