import { describe, expect, it } from "vitest";
import { getCurrentWeekDates, toIsoDate, priceRangeLabel } from "./utils";

describe("getCurrentWeekDates", () => {
  it("returns 7 consecutive ISO dates starting from the given day", () => {
    const today = new Date("2026-03-10T12:00:00Z");
    const dates = getCurrentWeekDates(today);
    expect(dates).toHaveLength(7);
    expect(dates[0]).toBe("2026-03-10");
    expect(dates[6]).toBe("2026-03-16");
  });

  it("rolls over month boundaries correctly", () => {
    const today = new Date("2026-02-27T00:00:00Z");
    const dates = getCurrentWeekDates(today);
    expect(dates).toEqual([
      "2026-02-27",
      "2026-02-28",
      "2026-03-01",
      "2026-03-02",
      "2026-03-03",
      "2026-03-04",
      "2026-03-05",
    ]);
  });
});

describe("toIsoDate", () => {
  it("formats a Date as YYYY-MM-DD", () => {
    expect(toIsoDate(new Date("2026-11-17T08:00:00Z"))).toBe("2026-11-17");
  });
});

describe("priceRangeLabel", () => {
  it("maps known ranges to display labels", () => {
    expect(priceRangeLabel("free")).toBe("Free");
    expect(priceRangeLabel("low")).toBe("£");
    expect(priceRangeLabel("medium")).toBe("££");
    expect(priceRangeLabel("high")).toBe("£££");
  });

  it("passes through unknown values unchanged", () => {
    expect(priceRangeLabel("mystery")).toBe("mystery");
  });
});
