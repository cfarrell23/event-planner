import { test, expect } from "@playwright/test";

/**
 * Smoke test for the core flow, with the NextAuth session mocked at the network layer
 * (no real Google OAuth credentials are configured for this hackathon build).
 */
test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth/session", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: { name: "Test User", email: "test@example.com", image: null },
        expires: new Date(Date.now() + 86_400_000).toISOString(),
      }),
    }),
  );
});

test("onboarding -> swipe -> save -> RSVP -> shows on calendar", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("button", { name: "Clubs" }).click();
  await page.getByRole("button", { name: "£ Budget-friendly" }).click();
  await page.getByRole("button", { name: "Start exploring" }).click();

  await expect(page).toHaveURL(/\/calendar$/);
  await expect(page.getByRole("heading", { name: "This Week" })).toBeVisible();

  await page.getByRole("link", { name: "For You" }).click();
  await expect(page).toHaveURL(/\/for-you$/);

  const likeButton = page.getByRole("button", { name: /Mark .* as interested/ });
  await expect(likeButton).toBeVisible({ timeout: 10_000 });
  await likeButton.click();
  await expect(page.getByText(/Saved ".*" to Interested/)).toBeVisible();

  await page.getByRole("link", { name: "Saved" }).click();
  await expect(page).toHaveURL(/\/saved$/);
  await expect(page.getByText("Nothing saved yet")).toHaveCount(0);

  await page.locator("a").filter({ hasText: /./ }).first().waitFor();
  const firstSavedCard = page.locator("main a").first();
  await firstSavedCard.click();

  const rsvpButton = page.getByRole("button", { name: "RSVP to Calendar" });
  await expect(rsvpButton).toBeVisible();
  await rsvpButton.click();
  await expect(page.getByRole("button", { name: "Cancel RSVP" })).toBeVisible();

  await page.getByRole("link", { name: "Calendar" }).click();
  await expect(page).toHaveURL(/\/calendar$/);
  await expect(page.getByText("Nothing booked for this day.")).toHaveCount(6);
});
