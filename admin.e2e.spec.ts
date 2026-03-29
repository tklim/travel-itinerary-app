import { test, expect } from "@playwright/test";

test("organizer can open admin overview and import screen", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Passcode").fill("organizers2026");
  await page.getByRole("button", { name: "Open itinerary" }).click();

  await expect(page.getByText("Admin overview")).toBeVisible();
  await page.goto("/admin/import");
  await expect(page.getByText("Spreadsheet-first updates")).toBeVisible();
});
