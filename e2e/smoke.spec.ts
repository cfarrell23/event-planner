import { test, expect } from "@playwright/test";

const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

/**
 * Smoke test for the core flow. Exercises the real sign-in button, which resolves to the
 * mock "google" credentials provider when GOOGLE_CLIENT_ID/SECRET aren't configured.
 */
test("sign in -> onboarding -> discover swipe -> RSVP -> shows on planner", async ({ page }) => {
  await page.goto("/signin");
  await expect(page.getByText(/Demo mode/)).toBeVisible();
  await page.getByRole("button", { name: "Sign in with Google" }).click();

  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("button", { name: "Clubs" }).click();
  await page.getByRole("button", { name: "£ Budget-friendly" }).click();
  await page.getByRole("button", { name: "Start exploring" }).click();

  await expect(page).toHaveURL(/\/discover$/);

  const likeButton = page.getByRole("button", { name: /Mark .* as interested/ });
  await expect(likeButton).toBeVisible({ timeout: 10_000 });
  await likeButton.click();
  await expect(page.getByText(/Saved ".*" to Interested/)).toBeVisible();

  await page.getByRole("link", { name: "Interested" }).click();
  await expect(page).toHaveURL(/\/interested$/);
  await expect(page.getByText("Nothing saved yet")).toHaveCount(0);
  await expect(page.getByText("Recommended").first()).toBeVisible();

  await page.locator("main a").first().click();

  const rsvpButton = page.getByRole("button", { name: "RSVP to Planner" });
  await expect(rsvpButton).toBeVisible();
  await rsvpButton.click();
  await expect(page.getByRole("button", { name: "Cancel RSVP" })).toBeVisible();

  await page.getByRole("link", { name: "Planner" }).click();
  await expect(page).toHaveURL(/\/planner$/);
  await expect(page.getByText("Nothing booked for this day.")).toHaveCount(6);
});

test("scan poster -> review -> save -> appears in Interested with source label", async ({ page }) => {
  await page.goto("/signin");
  await page.getByRole("button", { name: "Sign in with Google" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("button", { name: "Gigs" }).click();
  await page.getByRole("button", { name: "££ Mid-range" }).click();
  await page.getByRole("button", { name: "Start exploring" }).click();

  await page.getByRole("link", { name: "Scan Poster" }).click();
  await expect(page).toHaveURL(/\/scan$/);

  await page.locator('input[type="file"]').first().setInputFiles({
    name: "indie-gig-poster.png",
    mimeType: "image/png",
    buffer: Buffer.from(TINY_PNG_BASE64, "base64"),
  });

  await expect(page.getByText(/Extracting details/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Save as Interested" })).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.getByLabel("Title")).toHaveValue("Indie Gig Poster");

  await page.getByRole("button", { name: "Save as Interested" }).click();

  await expect(page).toHaveURL(/\/interested$/);
  await expect(page.getByText("Scanned poster")).toBeVisible();
  await expect(page.getByText("Indie Gig Poster")).toBeVisible();
});
