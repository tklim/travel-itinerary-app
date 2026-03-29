import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: ["traveler.e2e.spec.ts", "admin.e2e.spec.ts"],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  }
});
