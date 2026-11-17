const PLATFORM_DOMAINS = {
  Eventbrite: "eventbrite.co.uk",
  DICE: "dice.fm",
  OpenTable: "opentable.co.uk",
} as const;

type BookablePlatform = keyof typeof PLATFORM_DOMAINS;

/**
 * Links to the specific listing on its source platform. None of these platforms expose a
 * reliable, documented URL we can construct directly from a name alone (Eventbrite's own
 * search page has no public query-param spec, DICE requires an opaque city/event ID we don't
 * have, and OpenTable's /s search is both parameter-fragile and bot-protected) — so instead
 * this builds a domain-scoped Google search for the exact name and venue, which reliably
 * surfaces the real listing as the top result rather than guessing a URL that may 404.
 */
export function buildBookingSearchUrl(source: BookablePlatform, name: string, venue: string): string {
  const domain = PLATFORM_DOMAINS[source];
  const query = `site:${domain} "${name}" "${venue}" London`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
