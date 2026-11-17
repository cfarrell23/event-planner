import { test, expect } from "@playwright/test";

/** A harder, more realistic poster: colour gradient background, low-contrast text, scattered layout. */
async function generateHardPosterPng(page: import("@playwright/test").Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#2d1b4e");
    gradient.addColorStop(1, "#8e2de2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Low-contrast, stylised, slightly rotated title text over the gradient.
    ctx.save();
    ctx.translate(450, 220);
    ctx.rotate(-0.03);
    ctx.fillStyle = "#6b4fa0";
    ctx.font = "italic bold 90px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("NEON DREAMS", 0, 0);
    ctx.restore();

    ctx.fillStyle = "#e0d0ff";
    ctx.font = "44px Georgia";
    ctx.textAlign = "left";
    ctx.fillText("Saturday 12 December", 80, 600);
    ctx.fillText("Doors 10:30pm", 80, 670);
    ctx.fillText("@ Fabric London", 80, 740);
    ctx.fillText("£20 advance", 80, 810);

    return canvas.toDataURL("image/png");
  });
  const base64 = dataUrl.split(",")[1];
  return Buffer.from(base64, "base64");
}

test("OCR still extracts key fields from a harder, low-contrast poster", async ({ page }) => {
  test.setTimeout(60_000);

  await page.goto("/signin");
  await page.getByRole("button", { name: "Sign in with Google" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("button", { name: "Clubs" }).click();
  await page.getByRole("button", { name: "£ Budget-friendly" }).click();
  await page.getByRole("button", { name: "Start exploring" }).click();

  await page.getByRole("link", { name: "Scan Poster" }).click();
  await expect(page).toHaveURL(/\/scan$/);

  const posterPng = await generateHardPosterPng(page);
  await page.locator('input[type="file"]').first().setInputFiles({
    name: "photo.png",
    mimeType: "image/png",
    buffer: posterPng,
  });

  await expect(page.getByRole("button", { name: "Save as Interested" })).toBeVisible({
    timeout: 45_000,
  });

  await expect(page.getByLabel("Venue")).toHaveValue(/fabric/i);
  await expect(page.getByLabel(/^Date/)).toHaveValue("2026-12-12");
  await expect(page.getByLabel(/^Time/)).toHaveValue("22:30");
  await expect(page.getByRole("button", { name: "££", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
