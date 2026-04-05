# Travel Itinerary App

A mobile-first private travel itinerary app for a small family or group trip. It is designed to answer the questions travelers ask most often:

- What time is the flight?
- When do we need to get to the airport?
- Which hotel are we staying at tonight?
- What time do we need to wake up tomorrow?

## Family quick start

1. Open the app link.
2. Enter the family passcode.
3. Tap `Open itinerary`.

Then use:

- `Home` for the most important travel info
- `Today` for today's plan
- `Schedule` for the full trip plan
- `Flights` for flight times
- `Stay` for hotel details

## Stack

- `Next.js` with the App Router
- `TypeScript`
- `Prisma` with `SQLite` for local development
- Shared passcode access with signed cookies
- Spreadsheet import with `xlsx`

## Routes

- Traveler: `/`, `/today`, `/schedule`, `/stay`, `/login`
- Organizer: `/admin`, `/admin/flights`, `/admin/stays`, `/admin/events`, `/admin/import`, `/admin/settings`

## Local setup

1. Install Node.js 20+ and npm.
2. Copy `.env.example` to `.env` and update the secrets if needed.
3. Install dependencies with `npm install`.
4. Generate Prisma client with `npm run prisma:generate`.
5. Sync the local SQLite schema with `npm run prisma:migrate`.
6. Seed the initial Barcelona/Porto sample trip with `npm run prisma:seed`.
7. Start the app with `npm run dev`.

## Spreadsheet import contract

The import expects one workbook with these sheets:

- `Settings`
- `Flights`
- `Stays`
- `Events`

Datetime values should be entered as local times in an ISO-like format such as `2026-06-01T16:00`.

## Notes

- The seed data uses the existing Barcelona and Porto itinerary in this workspace.
- Flights and hotel names are placeholders until the real bookings are entered.
- `/admin` URLs are served through middleware rewrites so the public paths stay clean even with the current filesystem limitation in this workspace.
