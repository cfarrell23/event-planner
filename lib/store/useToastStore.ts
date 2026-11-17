import { create } from "zustand";

export interface Toast {
  id: number;
  message: string;
}

let nextId = 1;

interface ToastState {
  toasts: Toast[];
  show: (message: string) => void;
  dismiss: (id: number) => void;
}

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message) => {
    const id = nextId++;
    set({ toasts: [...get().toasts, { id, message }] });
    setTimeout(() => get().dismiss(id), 2500);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
