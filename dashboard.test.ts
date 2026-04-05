import type { Event, Flight, Stay } from "@prisma/client";

import { buildTravelerState, deriveTonightStaySummary, deriveTomorrowWakeCard } from "@/itinerary";
import { sampleEvents, sampleFlights, sampleStays, sampleTrip } from "@/sample-data";
import { parseLocalDateTime } from "@/time";
import type { TripSnapshot } from "@/types";

const trip = {
  id: "trip_1",
  ...sampleTrip,
  publishedVersion: 1,
  draftVersion: 2,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z")
};

const flights = sampleFlights.map(
  (flight, index) =>
    ({
      ...flight,
      id: `flight_${index}`,
      logicalId: `flight_${index}`,
      tripId: trip.id,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      confirmationCode: flight.confirmationCode ?? null,
      terminal: flight.terminal ?? null,
      airportLeadMinutes: flight.airportLeadMinutes ?? null,
      wakeLeadMinutes: flight.wakeLeadMinutes ?? null,
      notes: flight.notes ?? null
    }) satisfies Flight
);

const stays = sampleStays.map(
  (stay, index) =>
    ({
      ...stay,
      id: `stay_${index}`,
      logicalId: `stay_${index}`,
      tripId: trip.id,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: stay.phone ?? null,
      mapUrl: stay.mapUrl ?? null,
      confirmationCode: stay.confirmationCode ?? null,
      notes: stay.notes ?? null
    }) satisfies Stay
);

const events = sampleEvents.map(
  (event, index) =>
    ({
      ...event,
      id: `event_${index}`,
      logicalId: `event_${index}`,
      tripId: trip.id,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      location: event.location ?? null,
      endAt: event.endAt ?? null,
      requiredArrivalAt: event.requiredArrivalAt ?? null,
      requiredLeadMinutes: event.requiredLeadMinutes ?? null,
      wakeLeadMinutes: event.wakeLeadMinutes ?? null,
      notes: event.notes ?? null
    }) satisfies Event
);

const snapshot: TripSnapshot = {
  trip,
  version: 1,
  flights,
  stays,
  events,
  importBatches: []
};

describe("traveler dashboard state", () => {
  it("resolves the active stay for tonight", () => {
    const now = parseLocalDateTime("2026-05-29T21:00", "Asia/Kuala_Lumpur");
    const stay = deriveTonightStaySummary(snapshot, now);

    expect(stay.name).toBe("Kuala Lumpur City Centre Hotel");
    expect(stay.status).toBe("active");
  });

  it("computes tomorrow wake-up from the earliest timed plan", () => {
    const now = parseLocalDateTime("2026-05-28T20:30", "Asia/Kuala_Lumpur");
    const wakeCard = deriveTomorrowWakeCard(snapshot, now);

    expect(wakeCard.title).toBe("Wake up tomorrow");
    expect(wakeCard.badge).toBe("Tomorrow");
    expect(wakeCard.headline).toContain("7:15");
  });

  it("builds answer cards and grouped schedule", () => {
    const now = parseLocalDateTime("2026-05-29T09:00", "Asia/Kuala_Lumpur");
    const state = buildTravelerState(snapshot, now);
    const todayGroup = state.schedule.find((group) => group.label === "Today");
    const firstFlight = state.schedule.flatMap((group) => group.items).find((item) => item.kind === "flight");

    expect(state.answerCards).toHaveLength(4);
    expect(state.schedule.length).toBeGreaterThan(3);
    expect(state.answerCards[0].title).toBe("Next flight");
    expect(state.schedule[0].label).toBe("Wed 27 May");
    expect(state.schedule[0].dateText).toBe("Wed 27 May");
    expect(todayGroup?.dateText).toBe("Fri 29 May");
    expect(firstFlight?.endTimezone).toBe("Asia/Kuala_Lumpur");
  });
});
