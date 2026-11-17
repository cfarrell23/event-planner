import { toIsoDate } from "./utils";
import type { EventListing, RestaurantListing, DayForecast } from "./types";

/** Returns an ISO date string `offset` days from today. Used to keep mock data anchored to "this week". */
function dayOffset(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toIsoDate(d);
}

/**
 * These are real, currently-listed events and restaurants on Eventbrite, DICE, and OpenTable
 * (names, venues, and bookingUrl verified against the live platforms). Only `date`/`time` are
 * adjusted to fall within the current demo week, since this mock layer has no live API access —
 * see PRD §7 fallback strategy. bookingUrl always points directly at that specific listing.
 */
export const MOCK_EVENTS: EventListing[] = [
  {
    id: "evt-1",
    kind: "event",
    name: "Heated Rivalry: The Club Night",
    eventType: "club",
    description:
      "Club90s' viral Heated Rivalry club night lands at The Clapham Grand for a night of 2000s and 2010s throwback anthems, running until 2:30am.",
    date: dayOffset(0),
    time: "22:00",
    priceRange: "medium",
    priceLabel: "From £15",
    venue: "The Clapham Grand",
    address: "21-25 St John's Hill, Clapham Junction, London SW11 1TT",
    lat: 51.4636,
    lng: -0.1704,
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    source: "DICE",
    bookingUrl: "https://dice.fm/event/mxla7r-heated-rivalry-the-club-night-24th-jan-the-clapham-grand-london-tickets",
    deal: { label: "Free entry before 11pm", description: "Skip the door charge if you arrive early." },
  },
  {
    id: "evt-2",
    kind: "event",
    name: "Bat's Womb Goth Club Night",
    eventType: "club",
    description:
      "A goth club night at The Underworld with guest DJ Sanguine Succubus spinning deathrock, post-punk, and industrial until late.",
    date: dayOffset(1),
    time: "21:00",
    priceRange: "low",
    priceLabel: "£10.82",
    venue: "The Underworld",
    address: "174 Camden High Street, London NW1 0NE",
    lat: 51.539,
    lng: -0.1426,
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    source: "DICE",
    bookingUrl: "https://dice.fm/event/xe73ql-bats-womb-goth-club-night-5th-apr-the-underworld-london-tickets",
  },
  {
    id: "evt-3",
    kind: "event",
    name: "Vybz Night",
    eventType: "club",
    description:
      "A London club night playing music from the King of Dancehall all night, with tracks from Vybz Kartel, Spice, Popcaan, and Beenie Man.",
    date: dayOffset(2),
    time: "22:00",
    priceRange: "low",
    priceLabel: "£11",
    venue: "The Joiner on Worship",
    address: "2-4 Paul Street, Shoreditch, London EC2A 4JH",
    lat: 51.5257,
    lng: -0.0838,
    imageUrl:
      "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80",
    source: "DICE",
    bookingUrl: "https://dice.fm/event/2qrno-vybz-night-24th-feb-the-joiner-on-worship-london-tickets",
    deal: { label: "Happy hour 6-7pm", description: "2-for-1 on all cocktails for the first hour." },
  },
  {
    id: "evt-4",
    kind: "event",
    name: "Kio - Local Geezer (Headline Show)",
    eventType: "gig",
    description:
      "Kio headlines a genre-blending night of grime, rap, jazz, and R&B at Bricks in Brixton.",
    date: dayOffset(3),
    time: "19:00",
    priceRange: "medium",
    priceLabel: "£18",
    venue: "Bricks",
    address: "414 Coldharbour Lane, Brixton, London SW9 8LF",
    lat: 51.4613,
    lng: -0.1131,
    imageUrl:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
    source: "Eventbrite",
    bookingUrl: "https://www.eventbrite.co.uk/e/kio-local-geezer-headline-show-grimerapjazzrb-tickets-1994414378093",
  },
  {
    id: "evt-5",
    kind: "event",
    name: "Djoolio — Gig & Album Release Party",
    eventType: "gig",
    description:
      "Djoolio celebrates a new album with a live set at The Star in Shoreditch, with support from Metropolitan and Sweet Loretta.",
    date: dayOffset(4),
    time: "19:00",
    priceRange: "free",
    priceLabel: "Free entry",
    venue: "The Star in Shoreditch",
    address: "243 Old Street, London EC1V 9EY",
    lat: 51.5257,
    lng: -0.0877,
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80",
    source: "Eventbrite",
    bookingUrl: "https://www.eventbrite.co.uk/e/djoolio-gig-album-release-party-tickets-2003739083538",
    deal: { label: "Free entry", description: "RSVP requested but no ticket required." },
  },
  {
    id: "evt-6",
    kind: "event",
    name: "Open House Comedy",
    eventType: "comedy",
    description:
      "A stand-up comedy night upstairs at the Ritzy in Brixton, featuring a rotating lineup of London comedians.",
    date: dayOffset(2),
    time: "19:30",
    priceRange: "low",
    priceLabel: "£9",
    venue: "Ritzy Picturehouse",
    address: "Brixton Oval, Coldharbour Lane, London SW2 1JG",
    lat: 51.4627,
    lng: -0.1145,
    imageUrl:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80",
    source: "Eventbrite",
    bookingUrl: "https://www.eventbrite.co.uk/e/open-house-comedy-tickets-2001013807163",
    deal: { label: "2-for-1 tickets", description: "Buy one ticket, bring a friend free." },
  },
  {
    id: "evt-7",
    kind: "event",
    name: "Wednesday Night Stand-up Comedy, 9PM, Soho",
    eventType: "comedy",
    description:
      "A weekly stand-up night at The Spice of Life in Soho — previous shows have included comedians seen on Taskmaster, Live at the Apollo, and Netflix.",
    date: dayOffset(5),
    time: "21:00",
    priceRange: "low",
    priceLabel: "£9",
    venue: "The Spice of Life",
    address: "6 Moor Street, Soho, London W1D 5NA",
    lat: 51.5131,
    lng: -0.1307,
    imageUrl:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
    source: "Eventbrite",
    bookingUrl: "https://www.eventbrite.co.uk/e/wednesday-night-stand-up-comedy-9pm-soho-tickets-1983125596042",
  },
  {
    id: "evt-8",
    kind: "event",
    name: "Made In 90s Presents: Heated Rooftop Experience & Old Skool Anthems",
    eventType: "pop-up",
    description:
      "A one-night 90s and 00s throwback party across two rooms at 45 London, with a heated outdoor space and old skool anthems all night.",
    date: dayOffset(6),
    time: "18:00",
    priceRange: "medium",
    priceLabel: "£12",
    venue: "45 London",
    address: "45 Curtain Road, Shoreditch, London EC2A 3PT",
    lat: 51.5253,
    lng: -0.0812,
    imageUrl:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    source: "Eventbrite",
    bookingUrl: "https://www.eventbrite.co.uk/e/made-in-90s-presents-heated-rooftop-experience-old-skool-anthems-tickets-2000873907720",
    deal: { label: "Happy hour 6-7pm", description: "2-for-1 on all cocktails for the first hour." },
  },
];

export const MOCK_RESTAURANTS: RestaurantListing[] = [
  {
    id: "res-1",
    kind: "restaurant",
    name: "Cecconi's Shoreditch",
    eventType: "restaurant",
    description:
      "An all-day Venetian restaurant in Shoreditch serving northern Italian dishes in a stylish, warm, and buzzy dining room.",
    cuisine: "Italian",
    date: dayOffset(0),
    time: "19:00",
    priceRange: "high",
    priceLabel: "£££",
    venue: "Cecconi's Shoreditch",
    address: "58-60 Redchurch Street, Shoreditch, London E2 7DP",
    lat: 51.5252,
    lng: -0.0759,
    imageUrl:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    source: "OpenTable",
    bookingUrl: "https://www.opentable.co.uk/r/cecconisshoreditch-london",
    deal: { label: "Early-bird set menu", description: "20% off set menus for bookings before 7pm." },
  },
  {
    id: "res-2",
    kind: "restaurant",
    name: "SOLA",
    eventType: "restaurant",
    description:
      "A Michelin-starred Californian restaurant in Soho from chef Victor Garvey, known for its creative, small-portion tasting menu.",
    cuisine: "Californian",
    date: dayOffset(2),
    time: "19:30",
    priceRange: "high",
    priceLabel: "£££",
    venue: "SOLA",
    address: "64 Dean Street, Soho, London W1D 4QQ",
    lat: 51.5136,
    lng: -0.1324,
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    source: "OpenTable",
    bookingUrl: "https://www.opentable.co.uk/r/sola-soho-london",
  },
  {
    id: "res-3",
    kind: "restaurant",
    name: "The Counter Soho",
    eventType: "restaurant",
    description:
      "A lively Mediterranean restaurant on Kingly Street with East Mediterranean-inspired sharing plates and an intimate listening bar downstairs.",
    cuisine: "Mediterranean",
    date: dayOffset(3),
    time: "18:30",
    priceRange: "medium",
    priceLabel: "££",
    venue: "The Counter Soho",
    address: "15 Kingly Street, Carnaby, London W1F 9BP",
    lat: 51.5134,
    lng: -0.1395,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    source: "OpenTable",
    bookingUrl: "https://www.opentable.co.uk/r/the-counter-soho-london",
    deal: { label: "Theatre pricing", description: "Fixed-price sharing menu for bookings before 7pm." },
  },
  {
    id: "res-4",
    kind: "restaurant",
    name: "Temper Soho",
    eventType: "restaurant",
    description:
      "An open-fire steakhouse in Soho known for its vibrant open kitchen and whole-animal, fire-cooked cuisine.",
    cuisine: "Steakhouse",
    date: dayOffset(1),
    time: "19:00",
    priceRange: "high",
    priceLabel: "£££",
    venue: "Temper Soho",
    address: "25 Broadwick Street, Soho, London W1F 0DF",
    lat: 51.5136,
    lng: -0.1367,
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    source: "OpenTable",
    bookingUrl: "https://www.opentable.co.uk/r/temper-soho-london",
  },
  {
    id: "res-5",
    kind: "restaurant",
    name: "Le Bab Soho",
    eventType: "restaurant",
    description:
      "Gourmet kebabs with a modern twist at this Kingly Court favourite, blending traditional recipes with inventive sharing plates.",
    cuisine: "Modern Kebab",
    date: dayOffset(4),
    time: "18:00",
    priceRange: "low",
    priceLabel: "£",
    venue: "Le Bab Soho",
    address: "Kingly Court, Carnaby Street, Soho, London W1B 5PW",
    lat: 51.5132,
    lng: -0.1397,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80",
    source: "OpenTable",
    bookingUrl: "https://www.opentable.co.uk/le-bab",
    deal: { label: "Happy hour", description: "£2 off all kebabs, 5-6:30pm." },
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
