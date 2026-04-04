import { test, expect } from "@playwright/test";

test("traveler can log in and see itinerary answers", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Passcode").fill("family2026");
  await page.getByRole("button", { name: "Open itinerary" }).click();

  await expect(page.getByText("Travel trip at a glance")).toBeVisible();
  await expect(page.getByText("Next flight")).toBeVisible();
  await page.getByRole("link", { name: "Schedule" }).click();
  await expect(page.getByText("Every day, in order")).toBeVisible();
});
