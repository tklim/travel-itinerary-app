import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __travelPrisma: PrismaClient | undefined;
}

export const db =
  global.__travelPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.__travelPrisma = db;
}
