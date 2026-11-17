import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InterestState {
  /** IDs the user swiped right on — the "Interested" folder. */
  savedIds: string[];
  /** IDs dismissed this session (swiped left) so they don't reappear in the feed. */
  dismissedIds: string[];
  save: (id: string) => void;
  remove: (id: string) => void;
  dismiss: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useInterestStore = create<InterestState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      dismissedIds: [],
      save: (id) =>
        set((state) =>
          state.savedIds.includes(id) ? state : { savedIds: [...state.savedIds, id] },
        ),
      remove: (id) => set((state) => ({ savedIds: state.savedIds.filter((x) => x !== id) })),
      dismiss: (id) =>
        set((state) =>
          state.dismissedIds.includes(id) ? state : { dismissedIds: [...state.dismissedIds, id] },
        ),
      isSaved: (id) => get().savedIds.includes(id),
    }),
    { name: "event-planner-interest" },
  ),
);
