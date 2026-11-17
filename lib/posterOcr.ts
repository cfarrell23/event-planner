import { findFirstUrl } from "./scanUtils";
import { toIsoDate } from "./utils";
import type { PriceRange } from "./types";

/**
 * Runs the uploaded/captured poster image through client-side OCR (tesseract.js — no API key,
 * runs entirely in the browser). Dynamically imported so it never loads during SSR. Pass the
 * original file (not a downscaled copy) for the best recognition quality.
 */
export async function recognizePosterText(image: File | string): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  try {
    const {
      data: { text },
    } = await worker.recognize(image);
    return text;
  } finally {
    await worker.terminate();
  }
}

export interface ParsedPosterFields {
  name: string | null;
  date: string | null; // ISO
  time: string | null; // HH:mm
  venue: string | null;
  priceRange: PriceRange | null;
  priceLabel: string | null;
  bookingUrl: string | null;
}

const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
];

function monthIndex(token: string): number {
  return MONTHS.indexOf(token.slice(0, 3).toLowerCase());
}

/** Resolves a day/month onto the next occurrence of that date from `reference` (rolls into next year if already passed). */
function resolveUpcomingDate(day: number, month: number, reference: Date): string | null {
  if (day < 1 || day > 31 || month < 0 || month > 11) return null;
  const year = reference.getFullYear();
  let candidate = new Date(year, month, day);
  if (candidate.getTime() < new Date(reference.getFullYear(), reference.getMonth(), reference.getDate()).getTime()) {
    candidate = new Date(year + 1, month, day);
  }
  return toIsoDate(candidate);
}

function extractDate(text: string, reference: Date): string | null {
  const dayThenMonth = text.match(
    /\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i,
  );
  if (dayThenMonth) {
    return resolveUpcomingDate(Number(dayThenMonth[1]), monthIndex(dayThenMonth[2]), reference);
  }

  const monthThenDay = text.match(
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?\b/i,
  );
  if (monthThenDay) {
    return resolveUpcomingDate(Number(monthThenDay[2]), monthIndex(monthThenDay[1]), reference);
  }

  const numeric = text.match(/\b(\d{1,2})[\/.\-](\d{1,2})(?:[\/.\-](\d{2,4}))?\b/);
  if (numeric) {
    const day = Number(numeric[1]);
    const month = Number(numeric[2]) - 1;
    if (numeric[3]) {
      const year = numeric[3].length === 2 ? 2000 + Number(numeric[3]) : Number(numeric[3]);
      const d = new Date(year, month, day);
      return Number.isNaN(d.getTime()) ? null : toIsoDate(d);
    }
    return resolveUpcomingDate(day, month, reference);
  }

  return null;
}

function extractTime(text: string): string | null {
  const twelveHour = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (twelveHour) {
    let hour = Number(twelveHour[1]) % 12;
    if (/pm/i.test(twelveHour[3])) hour += 12;
    const minute = twelveHour[2] ?? "00";
    return `${String(hour).padStart(2, "0")}:${minute}`;
  }

  const twentyFourHour = text.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (twentyFourHour) {
    return `${twentyFourHour[1].padStart(2, "0")}:${twentyFourHour[2]}`;
  }

  return null;
}

function extractPrice(text: string): { priceRange: PriceRange | null; priceLabel: string | null } {
  if (/\bfree\s*(entry)?\b/i.test(text)) {
    return { priceRange: "free", priceLabel: "Free" };
  }
  const match = text.match(/£\s?(\d+(?:\.\d{1,2})?)/);
  if (match) {
    const amount = Number(match[1]);
    const priceRange: PriceRange = amount <= 10 ? "low" : amount <= 25 ? "medium" : "high";
    return { priceRange, priceLabel: `£${match[1]}` };
  }
  return { priceRange: null, priceLabel: null };
}

function extractVenue(text: string): string | null {
  const match = text.match(/(?:^|\n)\s*(?:@|at)\s+([^\n]{3,60})/i);
  return match ? match[1].trim() : null;
}

function isLikelyNonTitleLine(line: string): boolean {
  return (
    line.length < 3 ||
    /https?:\/\//i.test(line) ||
    /£\s?\d/.test(line) ||
    /\b\d{1,2}:\d{2}\b/.test(line) ||
    /\b\d{1,2}\s*(am|pm)\b/i.test(line) ||
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i.test(line) ||
    /^(free|tickets?|entry|doors|www\.)/i.test(line) ||
    /^(@|at\s)/i.test(line)
  );
}

/**
 * Picks a best-guess title: the first non-trivial, non-metadata line near the top of the
 * poster, since event titles are almost always the first thing printed (venue/date/price
 * details follow below it) — unlike those fields, title has no distinguishing pattern to
 * match on, so position is the strongest signal available.
 */
function extractTitle(text: string): string | null {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const candidates = lines.slice(0, 8).filter((l) => !isLikelyNonTitleLine(l) && l.length >= 4);
  return candidates[0] ?? null;
}

/** Parses OCR'd poster text into candidate event fields. Every field may be null if nothing confident was found. */
export function parsePosterText(rawText: string, reference: Date = new Date()): ParsedPosterFields {
  const { priceRange, priceLabel } = extractPrice(rawText);
  return {
    name: extractTitle(rawText),
    date: extractDate(rawText, reference),
    time: extractTime(rawText),
    venue: extractVenue(rawText),
    priceRange,
    priceLabel,
    bookingUrl: findFirstUrl(rawText),
  };
}
