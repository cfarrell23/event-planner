import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScannedItem } from "../types";

interface ScannedState {
  items: ScannedItem[];
  addItem: (item: ScannedItem) => void;
  updateItem: (id: string, patch: Partial<ScannedItem>) => void;
  getById: (id: string) => ScannedItem | undefined;
}

export const useScannedStore = create<ScannedState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set({ items: [...get().items, item] }),
      updateItem: (id, patch) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }),
      getById: (id) => get().items.find((i) => i.id === id),
    }),
    { name: "event-planner-scanned" },
  ),
);
