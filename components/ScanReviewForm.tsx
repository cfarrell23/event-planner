import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { EventType, FieldConfidence, PriceRange } from "@/lib/types";

const EVENT_TYPE_OPTIONS: { value: EventType | "restaurant"; label: string }[] = [
  { value: "club", label: "Club" },
  { value: "gig", label: "Gig" },
  { value: "comedy", label: "Comedy" },
  { value: "pop-up", label: "Pop-up" },
  { value: "restaurant", label: "Restaurant" },
];

const PRICE_OPTIONS: { value: PriceRange | null; label: string }[] = [
  { value: null, label: "Not specified" },
  { value: "free", label: "Free" },
  { value: "low", label: "£" },
  { value: "medium", label: "££" },
  { value: "high", label: "£££" },
];

const PRICE_LABELS: Record<PriceRange, string> = {
  free: "Free",
  low: "£",
  medium: "££",
  high: "£££",
};

export interface ScanReviewValues {
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  eventType: EventType | "restaurant";
  priceRange: PriceRange | null;
  priceLabel: string;
  bookingUrl: string;
}

interface Props {
  initialValues: ScanReviewValues;
  fieldConfidence: Record<"name" | "date" | "time" | "venue" | "priceLabel", FieldConfidence>;
  onSave: (values: ScanReviewValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

/** Editable review form shown after a poster is scanned, and reused for editing a saved scanned item. */
export function ScanReviewForm({ initialValues, fieldConfidence, onSave, onCancel, submitLabel = "Save as Interested" }: Props) {
  const [values, setValues] = useState<ScanReviewValues>(initialValues);

  const canSave = values.name.trim().length > 0 && values.date.trim().length > 0;

  function set<K extends keyof ScanReviewValues>(key: K, value: ScanReviewValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function NeedsReview({ field }: { field: keyof typeof fieldConfidence }) {
    if (fieldConfidence[field] !== "needs-review") return null;
    return (
      <span className="ml-1.5 inline-flex items-center gap-1 text-xs text-accent">
        <AlertTriangle size={12} aria-hidden /> needs review
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-foreground">
          Title <NeedsReview field="name" />
        </span>
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Event or venue name"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">
            Date <NeedsReview field="date" />
          </span>
          <input
            type="date"
            className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-foreground">
            Time <NeedsReview field="time" />
          </span>
          <input
            type="time"
            className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
            value={values.time}
            onChange={(e) => set("time", e.target.value)}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-foreground">
          Venue <NeedsReview field="venue" />
        </span>
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
          value={values.venue}
          onChange={(e) => set("venue", e.target.value)}
          placeholder="Venue name"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-foreground">Address</span>
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
          value={values.address}
          onChange={(e) => set("address", e.target.value)}
          placeholder="Street address, London"
        />
      </label>

      <div>
        <span className="mb-2 block text-sm font-medium text-foreground">Event type</span>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={values.eventType === opt.value}
              onClick={() => set("eventType", opt.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                values.eventType === opt.value
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-surface text-foreground hover:bg-surface-raised",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-foreground">
          Price <span className="text-muted">(optional)</span> <NeedsReview field="priceLabel" />
        </span>
        <div className="flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              aria-pressed={values.priceRange === opt.value}
              onClick={() => set("priceRange", opt.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                values.priceRange === opt.value
                  ? "border-accent-2 bg-accent-2/15 text-accent-2"
                  : "border-border bg-surface text-foreground hover:bg-surface-raised",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-foreground">
          Booking link <span className="text-muted">(optional — detected from poster, if any)</span>
        </span>
        <input
          className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
          value={values.bookingUrl}
          onChange={(e) => set("bookingUrl", e.target.value)}
          placeholder="https://..."
        />
      </label>

      <div className="flex gap-3">
        <Button
          size="lg"
          disabled={!canSave}
          onClick={() =>
            onSave({
              ...values,
              priceLabel:
                values.priceRange === null ? "Price not listed" : PRICE_LABELS[values.priceRange],
            })
          }
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button variant="secondary" size="lg" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
      {!canSave && <p className="text-xs text-muted">Title and date are required before saving.</p>}
    </div>
  );
}
