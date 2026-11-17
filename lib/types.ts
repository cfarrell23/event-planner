// Shared domain types for events, restaurants, scanned posters, preferences, and planner state.

export type EventType = "club" | "gig" | "comedy" | "pop-up";

export type PriceRange = "free" | "low" | "medium" | "high";

export type ListingKind = "event" | "restaurant" | "scanned";

export interface Deal {
  label: string;
  description: string;
}

export interface EventListing {
  id: string;
  kind: "event";
  name: string;
  eventType: EventType;
  description: string;
  date: string; // ISO date, YYYY-MM-DD
  time: string; // e.g. "22:00"
  priceRange: PriceRange;
  priceLabel: string; // e.g. "£15" or "Free entry"
  venue: string;
  address: string;
  lat: number;
  lng: number;
  imageUrl: string;
  source: "Eventbrite" | "DICE";
  bookingUrl: string;
  deal?: Deal;
}

export interface RestaurantListing {
  id: string;
  kind: "restaurant";
  name: string;
  eventType: "restaurant";
  description: string;
  cuisine: string;
  date: string;
  time: string;
  priceRange: PriceRange;
  priceLabel: string;
  venue: string;
  address: string;
  lat: number;
  lng: number;
  imageUrl: string;
  source: "OpenTable";
  bookingUrl: string;
  deal?: Deal;
}

/** A field extracted from a scanned poster, flagged so the user knows what to double-check. */
export type FieldConfidence = "confident" | "needs-review";

/** A PlanItem captured by photographing or uploading an event poster, rather than pulled from an API. */
export interface ScannedItem {
  id: string;
  kind: "scanned";
  name: string;
  eventType: EventType | "restaurant";
  description: string;
  date: string;
  time: string;
  priceRange: PriceRange | null; // null when the poster didn't show a price and the user left it unspecified
  priceLabel: string; // e.g. "£15", or "Price not listed" when priceRange is null
  venue: string;
  address: string;
  lat: number;
  lng: number;
  imageUrl: string; // compressed data URL of the captured poster
  source: "Poster Scan";
  bookingUrl: string; // detected URL, or "" if none was found
  deal?: Deal;
  fieldConfidence: Record<"name" | "date" | "time" | "venue" | "priceLabel", FieldConfidence>;
  createdAt: string; // ISO datetime
}

export type Listing = EventListing | RestaurantListing | ScannedItem;

export interface DayForecast {
  date: string; // ISO date
  tempC: number;
  condition: "sunny" | "cloudy" | "rainy" | "clear-night" | "windy";
  summary: string;
}

export interface RsvpEntry {
  listingId: string;
  kind: ListingKind;
  date: string;
  addedAt: string; // ISO datetime
}
