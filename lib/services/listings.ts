import { MOCK_EVENTS, MOCK_RESTAURANTS } from "../mockData";
import type { Listing, EventListing, RestaurantListing } from "../types";

/**
 * Live Eventbrite/DICE/OpenTable integration is an open research item (see PRD section 6) —
 * no API keys are configured for the hackathon build, so this always serves mock data.
 * Swap the body of each fetcher below for a real API call once credentials are available;
 * the mock fallback should stay in place per NFR-03 (resilience on API failure).
 */

const SIMULATED_LATENCY_MS = 150;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

export async function getAllListings(): Promise<Listing[]> {
  try {
    if (!process.env.NEXT_PUBLIC_EVENTBRITE_API_KEY) {
      return await delay([...MOCK_EVENTS, ...MOCK_RESTAURANTS]);
    }
    // TODO: real Eventbrite / DICE / OpenTable calls go here once API keys exist.
    return await delay([...MOCK_EVENTS, ...MOCK_RESTAURANTS]);
  } catch {
    return [...MOCK_EVENTS, ...MOCK_RESTAURANTS];
  }
}

export async function getEvents(): Promise<EventListing[]> {
  const all = await getAllListings();
  return all.filter((l): l is EventListing => l.kind === "event");
}

export async function getRestaurants(): Promise<RestaurantListing[]> {
  const all = await getAllListings();
  return all.filter((l): l is RestaurantListing => l.kind === "restaurant");
}

export async function getListingById(id: string): Promise<Listing | undefined> {
  const all = await getAllListings();
  return all.find((l) => l.id === id);
}
