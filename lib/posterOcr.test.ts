import { describe, expect, it } from "vitest";
import { parsePosterText } from "./posterOcr";

const REFERENCE = new Date("2026-11-17T12:00:00Z");

describe("parsePosterText", () => {
  it("extracts title, date, time, venue, and price from a typical poster layout", () => {
    const text = "SUMMER BASH\n20 DEC\n9:00 PM\nAT THE UNDERWORLD\n£15";
    const result = parsePosterText(text, REFERENCE);
    expect(result.name).toBe("SUMMER BASH");
    expect(result.date).toBe("2026-12-20");
    expect(result.time).toBe("21:00");
    expect(result.venue).toBe("THE UNDERWORLD");
    expect(result.priceRange).toBe("medium");
    expect(result.priceLabel).toBe("£15");
  });

  it("recognises 'free' entry as the free price tier", () => {
    const result = parsePosterText("OPEN MIC NIGHT\nFree entry\n7PM", REFERENCE);
    expect(result.priceRange).toBe("free");
    expect(result.priceLabel).toBe("Free");
  });

  it("parses month-then-day date order", () => {
    const result = parsePosterText("GIG NIGHT\nDecember 20th\n8pm", REFERENCE);
    expect(result.date).toBe("2026-12-20");
  });

  it("rolls a date that has already passed this year into next year", () => {
    const result = parsePosterText("WINTER PARTY\n5 Jan\n9pm", REFERENCE);
    expect(result.date).toBe("2027-01-05");
  });

  it("parses numeric dates", () => {
    const result = parsePosterText("CLUB NIGHT\n20/12/2026\n10pm", REFERENCE);
    expect(result.date).toBe("2026-12-20");
  });

  it("extracts a detected booking URL", () => {
    const result = parsePosterText("GIG NIGHT\nTickets: https://dice.fm/event/abc123", REFERENCE);
    expect(result.bookingUrl).toBe("https://dice.fm/event/abc123");
  });

  it("returns nulls for fields it can't find rather than guessing", () => {
    const result = parsePosterText("", REFERENCE);
    expect(result.name).toBeNull();
    expect(result.date).toBeNull();
    expect(result.time).toBeNull();
    expect(result.venue).toBeNull();
    expect(result.priceRange).toBeNull();
    expect(result.bookingUrl).toBeNull();
  });

  it("does not mistake a venue line for the title", () => {
    const result = parsePosterText("ROOFTOP RAVE\n@ Sky Garden\n18 Dec\n7pm", REFERENCE);
    expect(result.name).toBe("ROOFTOP RAVE");
  });
});
