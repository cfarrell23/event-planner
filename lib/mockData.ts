import { toIsoDate } from "./utils";
import type { EventListing, RestaurantListing, DayForecast } from "./types";

/** Returns an ISO date string `offset` days from today. Used to keep mock data anchored to "this week". */
function dayOffset(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toIsoDate(d);
}

export const MOCK_EVENTS: EventListing[] = [
  {
    id: "evt-1",
    kind: "event",
    name: "Neon Nights: Warehouse Rave",
    eventType: "club",
    description:
      "A late-night warehouse rave in Hackney Wick with a rotating lineup of underground house and techno DJs across two rooms.",
    date: dayOffset(0),
    time: "23:00",
    priceRange: "medium",
    priceLabel: "£18",
    venue: "The Yard Warehouse",
    address: "12 Wallis Road, Hackney Wick, London E9 5LN",
    lat: 51.5416,
    lng: -0.0245,
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    source: "DICE",
    bookingUrl: "https://dice.fm",
    deal: { label: "Free entry before 11pm", description: "Skip the door charge if you arrive early." },
  },
  {
    id: "evt-2",
    kind: "event",
    name: "Live at Camden: The Lumen Set",
    eventType: "gig",
    description:
      "Indie-electronic four-piece The Lumen Set play an intimate headline show, with support from two emerging London acts.",
    date: dayOffset(1),
    time: "20:00",
    priceRange: "low",
    priceLabel: "£12",
    venue: "Camden Assembly",
    address: "49 Chalk Farm Road, London NW1 8AN",
    lat: 51.5416,
    lng: -0.1466,
    imageUrl:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
    source: "Eventbrite",
    bookingUrl: "https://eventbrite.com",
  },
  {
    id: "evt-3",
    kind: "event",
    name: "Laugh Lounge: New Material Night",
    eventType: "comedy",
    description:
      "Five stand-up comedians test out new material in a relaxed basement club setting. Expect a few rough edges and a lot of laughs.",
    date: dayOffset(1),
    time: "19:30",
    priceRange: "low",
    priceLabel: "£8",
    venue: "The Backroom Comedy Club",
    address: "22 Greek Street, Soho, London W1D 4DZ",
    lat: 51.5136,
    lng: -0.1316,
    imageUrl:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80",
    source: "Eventbrite",
    bookingUrl: "https://eventbrite.com",
    deal: { label: "2-for-1 tickets", description: "Buy one ticket, bring a friend free." },
  },
  {
    id: "evt-4",
    kind: "event",
    name: "Rooftop Pop-Up: Sunset Sessions",
    eventType: "pop-up",
    description:
      "A one-night rooftop pop-up bar with skyline views, a guest DJ, and a cocktail menu designed exclusively for the event.",
    date: dayOffset(2),
    time: "18:00",
    priceRange: "medium",
    priceLabel: "£10 entry",
    venue: "Sky Garden Rooftop",
    address: "20 Fenchurch Street, London EC3M 8AF",
    lat: 51.5113,
    lng: -0.0836,
    imageUrl:
      "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80",
    source: "DICE",
    bookingUrl: "https://dice.fm",
    deal: { label: "Happy hour 6-7pm", description: "2-for-1 on all cocktails for the first hour." },
  },
  {
    id: "evt-5",
    kind: "event",
    name: "Deep House Collective: All Night Long",
    eventType: "club",
    description:
      "A members-favourite club night returns with back-to-back deep house sets running until 5am.",
    date: dayOffset(3),
    time: "22:30",
    priceRange: "high",
    priceLabel: "£25",
    venue: "Fabric",
    address: "77A Charterhouse Street, London EC1M 3HN",
    lat: 51.5201,
    lng: -0.1019,
    imageUrl:
      "https://images.unsplash.com/photo-1571266028243-d220c6e6a3ea?w=800&q=80",
    source: "DICE",
    bookingUrl: "https://dice.fm",
  },
  {
    id: "evt-6",
    kind: "event",
    name: "Open Mic Comedy Basement",
    eventType: "comedy",
    description:
      "A no-frills open mic night for new and returning comedians. The crowd is friendly and the drinks are cheap.",
    date: dayOffset(4),
    time: "19:00",
    priceRange: "free",
    priceLabel: "Free entry",
    venue: "The Cavern Bar",
    address: "54 Kingsland Road, London E2 8DP",
    lat: 51.5276,
    lng: -0.0776,
    imageUrl:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
    source: "Eventbrite",
    bookingUrl: "https://eventbrite.com",
    deal: { label: "Free entry", description: "No cover charge all night." },
  },
  {
    id: "evt-7",
    kind: "event",
    name: "Gig Night: The Analog Youth",
    eventType: "gig",
    description:
      "Post-punk revivalists The Analog Youth bring their UK tour to a sold-out-prone East London venue.",
    date: dayOffset(5),
    time: "20:30",
    priceRange: "medium",
    priceLabel: "£16",
    venue: "Moth Club",
    address: "Old Trades Hall, Valette Street, London E9 6NU",
    lat: 51.5386,
    lng: -0.0506,
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80",
    source: "DICE",
    bookingUrl: "https://dice.fm",
  },
  {
    id: "evt-8",
    kind: "event",
    name: "Pop-Up Silent Disco in the Park",
    eventType: "pop-up",
    description:
      "Three channels, three DJs, one park. A roaming silent disco pop-up that moves locations each month.",
    date: dayOffset(6),
    time: "17:00",
    priceRange: "low",
    priceLabel: "£7",
    venue: "Victoria Park",
    address: "Grove Road, London E3 5TB",
    lat: 51.5362,
    lng: -0.0388,
    imageUrl:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    source: "DICE",
    bookingUrl: "https://dice.fm",
  },
];

export const MOCK_RESTAURANTS: RestaurantListing[] = [
  {
    id: "res-1",
    kind: "restaurant",
    name: "Bao & Spice",
    eventType: "restaurant",
    description:
      "Modern Taiwanese small plates and steamed bao, perfect for a quick bite before heading out for the night.",
    cuisine: "Taiwanese",
    date: dayOffset(0),
    time: "19:00",
    priceRange: "medium",
    priceLabel: "££",
    venue: "Bao & Spice Shoreditch",
    address: "88 Redchurch Street, London E2 7DP",
    lat: 51.5255,
    lng: -0.0756,
    imageUrl:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    source: "OpenTable",
    bookingUrl: "https://opentable.co.uk",
    deal: { label: "Early-bird set menu", description: "20% off set menus for bookings before 7pm." },
  },
  {
    id: "res-2",
    kind: "restaurant",
    name: "Fonda Mezcal",
    eventType: "restaurant",
    description:
      "Lively Mexican cantina with a mezcal-forward cocktail list, ideal for a pre-gig dinner with friends.",
    cuisine: "Mexican",
    date: dayOffset(1),
    time: "18:30",
    priceRange: "medium",
    priceLabel: "££",
    venue: "Fonda Mezcal Camden",
    address: "15 Inverness Street, London NW1 7HJ",
    lat: 51.5401,
    lng: -0.1444,
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    source: "OpenTable",
    bookingUrl: "https://opentable.co.uk",
  },
  {
    id: "res-3",
    kind: "restaurant",
    name: "The Soho Grill",
    eventType: "restaurant",
    description:
      "A classic grill house in the heart of Soho, popular for quick pre-theatre and pre-comedy dinners.",
    cuisine: "British Grill",
    date: dayOffset(1),
    time: "18:00",
    priceRange: "high",
    priceLabel: "£££",
    venue: "The Soho Grill",
    address: "9 Frith Street, London W1D 3HE",
    lat: 51.5142,
    lng: -0.1316,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    source: "OpenTable",
    bookingUrl: "https://opentable.co.uk",
    deal: { label: "Theatre pricing", description: "Fixed-price 2-course menu before 7pm." },
  },
  {
    id: "res-4",
    kind: "restaurant",
    name: "Rooftop Bites",
    eventType: "restaurant",
    description:
      "Small plates and sharing boards served on the terrace, right before the rooftop pop-up kicks off downstairs.",
    cuisine: "Mediterranean",
    date: dayOffset(2),
    time: "17:30",
    priceRange: "medium",
    priceLabel: "££",
    venue: "Sky Garden Terrace Kitchen",
    address: "20 Fenchurch Street, London EC3M 8AF",
    lat: 51.5113,
    lng: -0.0836,
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    source: "OpenTable",
    bookingUrl: "https://opentable.co.uk",
  },
  {
    id: "res-5",
    kind: "restaurant",
    name: "Ramen Yurei",
    eventType: "restaurant",
    description:
      "No-frills late-night ramen bar, open until 1am for post-club and pre-club bowls alike.",
    cuisine: "Japanese",
    date: dayOffset(3),
    time: "21:00",
    priceRange: "low",
    priceLabel: "£",
    venue: "Ramen Yurei Farringdon",
    address: "63 Cowcross Street, London EC1M 6BP",
    lat: 51.5205,
    lng: -0.1037,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    source: "OpenTable",
    bookingUrl: "https://opentable.co.uk",
    deal: { label: "Happy hour", description: "£2 off all bowls, 9-10pm." },
  },
];

const CONDITIONS: DayForecast["condition"][] = [
  "sunny",
  "cloudy",
  "rainy",
  "clear-night",
  "windy",
];

/** Deterministic mock forecast generator, used as a fallback when the live weather API is unavailable. */
export function getMockForecast(dates: string[]): DayForecast[] {
  return dates.map((date, i) => {
    const condition = CONDITIONS[i % CONDITIONS.length];
    const tempC = 9 + ((i * 3) % 10);
    const summaryByCondition: Record<DayForecast["condition"], string> = {
      sunny: "Clear skies, great for a rooftop night out.",
      cloudy: "Overcast but dry.",
      rainy: "Showers expected, bring an umbrella for the queue.",
      "clear-night": "Clear and crisp after dark.",
      windy: "Breezy conditions in the evening.",
    };
    return { date, tempC, condition, summary: summaryByCondition[condition] };
  });
}
