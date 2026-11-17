import { useToastStore } from "@/lib/store/useToastStore";

/** Renders transient in-app confirmation messages (e.g. "Saved", "RSVP added"). */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2 sm:bottom-6"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-full border border-border bg-surface-raised px-4 py-2 text-sm text-foreground shadow-glow"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
