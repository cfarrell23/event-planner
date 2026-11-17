import type { Listing } from "./types";

/** Route to a listing's detail page, dispatching on how it was sourced. */
export function listingHref(listing: Listing): string {
  switch (listing.kind) {
    case "event":
      return `/events/${listing.id}`;
    case "restaurant":
      return `/restaurants/${listing.id}`;
    case "scanned":
      return `/scanned/${listing.id}`;
  }
}

/** User-facing provenance label shown wherever Discover and Scan Poster items appear together. */
export function sourceLabel(listing: Listing): string {
  return listing.kind === "scanned" ? "Scanned poster" : "Recommended";
}
