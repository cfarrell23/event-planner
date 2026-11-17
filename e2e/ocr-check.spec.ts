import { test, expect } from "@playwright/test";

/** Generates a synthetic poster PNG (via canvas) with clearly legible text for OCR verification. */
async function generatePosterPng(page: import("@playwright/test").Page): Promise<Buffer> {
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.textBaseline = "top";
    ctx.font = "bold 60px sans-serif";
    ctx.fillText("SUMMER BASH", 40, 120);
    ctx.font = "40px sans-serif";
    ctx.fillText("20 DEC", 40, 300);
    ctx.fillText("9:00 PM", 40, 380);
    ctx.fillText("AT THE UNDERWORLD", 40, 460);
    ctx.fillText("£15", 40, 540);
    return canvas.toDataURL("image/png");
  });
  const base64 = dataUrl.split(",")[1];
  return Buffer.from(base64, "base64");
}

test("OCR genuinely reads text off a poster image, not just the filename", async ({ page }) => {
  test.setTimeout(60_000);

  await page.goto("/signin");
  await page.getByRole("button", { name: "Sign in with Google" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByRole("button", { name: "Clubs" }).click();
  await page.getByRole("button", { name: "£ Budget-friendly" }).click();
  await page.getByRole("button", { name: "Start exploring" }).click();

  await page.getByRole("link", { name: "Scan Poster" }).click();
  await expect(page).toHaveURL(/\/scan$/);

  const posterPng = await generatePosterPng(page);
  await page.locator('input[type="file"]').first().setInputFiles({
    name: "unrelated-filename-123.png",
    mimeType: "image/png",
    buffer: posterPng,
  });

  await expect(page.getByRole("button", { name: "Save as Interested" })).toBeVisible({
    timeout: 45_000,
  });

  // The title must come from the poster's actual text, not the (deliberately unrelated) filename.
  await expect(page.getByLabel("Title")).toHaveValue(/summer bash/i);
  await expect(page.getByLabel("Venue")).toHaveValue(/underworld/i);
  await expect(page.getByLabel(/^Date/)).not.toHaveValue("");
  await expect(page.getByLabel(/^Time/)).toHaveValue("21:00");
});
