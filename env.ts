const read = (name: string, fallback: string) => process.env[name] ?? fallback;

export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  sessionSecret: read("SESSION_SECRET", "change-this-before-deploying"),
  travelerPasscode: read("TRAVELER_PASSCODE", "family2026"),
  adminPasscode: read("ADMIN_PASSCODE", "organizers2026")
};
