// Shared domain types for events, restaurants, user preferences, and calendar state.

export type EventType = "club" | "gig" | "comedy" | "pop-up";

export type PriceRange = "free" | "low" | "medium" | "high";

export type ListingKind = "event" | "restaurant";

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

export type Listing = EventListing | RestaurantListing;

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
