import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(dirname)
    }
  },
  test: {
    include: ["**/*.test.ts"],
    exclude: ["**/*.e2e.spec.ts", "**/node_modules/**", "**/.next/**"],
    environment: "node",
    globals: true
  }
});
