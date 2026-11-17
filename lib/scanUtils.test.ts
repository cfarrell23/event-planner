import { describe, expect, it } from "vitest";
import { titleFromFilename, findFirstUrl, isSafeExternalUrl } from "./scanUtils";

describe("titleFromFilename", () => {
  it("converts dashes and underscores to title case", () => {
    expect(titleFromFilename("indie-gig_poster_02.jpg")).toBe("Indie Gig Poster 02");
  });

  it("falls back to a default when the filename has no usable words", () => {
    expect(titleFromFilename(".jpg")).toBe("Untitled Event");
  });
});

describe("findFirstUrl", () => {
  it("extracts the first http(s) URL from free text", () => {
    expect(findFirstUrl("Tickets at https://dice.fm/event/123 or on the door")).toBe(
      "https://dice.fm/event/123",
    );
  });

  it("returns null when no URL is present", () => {
    expect(findFirstUrl("No link on this poster")).toBeNull();
  });
});

describe("isSafeExternalUrl", () => {
  it("accepts http and https URLs", () => {
    expect(isSafeExternalUrl("https://eventbrite.com")).toBe(true);
    expect(isSafeExternalUrl("http://example.com")).toBe(true);
  });

  it("rejects non-http(s) schemes and malformed input", () => {
    expect(isSafeExternalUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeExternalUrl("not a url")).toBe(false);
    expect(isSafeExternalUrl("")).toBe(false);
    expect(isSafeExternalUrl(undefined)).toBe(false);
  });
});
