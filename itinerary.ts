import { randomUUID } from "node:crypto";

import type { Event, Flight, Prisma, Stay } from "@prisma/client";
import { addMinutes, compareAsc, isAfter } from "date-fns";

import { db } from "@/db";
import { newLogicalId, sampleEvents, sampleFlights, sampleStays, sampleTrip } from "@/sample-data";
import { addLeadMinutes, formatDateTime, formatRelativeDayLabel, formatShortDate, formatShortTime, zonedDayKey } from "@/time";
import type { AnswerCard, DayTimelineGroup, DayTimelineItem, TonightStaySummary, TripSnapshot } from "@/types";

const eventRequiredAt = (
  event: Pick<Event, "startAt" | "requiredArrivalAt" | "requiredLeadMinutes">
) => {
  if (event.requiredArrivalAt) {
    return event.requiredArrivalAt;
  }

  if (typeof event.requiredLeadMinutes === "number") {
    return addMinutes(event.startAt, -event.requiredLeadMinutes);
  }

  return event.startAt;
};

const flightRequiredAt = (
  flight: Pick<Flight, "departAt" | "airportLeadMinutes">,
  defaultAirportLeadMinutes: number
) => addMinutes(flight.departAt, -(flight.airportLeadMinutes ?? defaultAirportLeadMinutes));

const compareByStart = <T extends { startAt: Date }>(a: T, b: T) => compareAsc(a.startAt, b.startAt);

export const bootstrapIfEmpty = async () => {
  const existing = await db.trip.findFirst({ select: { id: true } });
  if (existing) {
    return;
  }

  await db.trip.create({
    data: {
      ...sampleTrip,
      flights: {
        createMany: {
          data: [
            ...sampleFlights.map((flight) => ({
              ...flight,
              logicalId: newLogicalId(),
              version: 1
            })),
            ...sampleFlights.map((flight) => ({
              ...flight,
              logicalId: newLogicalId(),
              version: 2
            }))
          ]
        }
      },
      stays: {
        createMany: {
          data: [
            ...sampleStays.map((stay) => ({
              ...stay,
              logicalId: newLogicalId(),
              version: 1
            })),
            ...sampleStays.map((stay) => ({
              ...stay,
              logicalId: newLogicalId(),
              version: 2
            }))
          ]
        }
      },
      events: {
        createMany: {
          data: [
            ...sampleEvents.map((event) => ({
              ...event,
              logicalId: newLogicalId(),
              version: 1
            })),
            ...sampleEvents.map((event) => ({
              ...event,
              logicalId: newLogicalId(),
              version: 2
            }))
          ]
        }
      }
    }
  });
};

export const getPrimaryTrip = async () => {
  await bootstrapIfEmpty();

  const trip = await db.trip.findFirst({
    select: {
      id: true,
      slug: true,
      name: true,
      travelerCount: true,
      homeTimezone: true,
      publishedVersion: true,
      draftVersion: true,
      defaultAirportLeadMinutes: true,
      defaultWakeMinutes: true,
      tripStartAt: true,
      tripEndAt: true,
      notes: true,
      createdAt: true,
      updatedAt: true
    } satisfies Prisma.TripSelect
  });

  if (!trip) {
    throw new Error("Trip could not be loaded.");
  }

  return trip;
};

const getSnapshot = async (version: number): Promise<TripSnapshot> => {
  const trip = await getPrimaryTrip();
  const [flights, stays, events, importBatches] = await Promise.all([
    db.flight.findMany({
      where: { tripId: trip.id, version },
      orderBy: { departAt: "asc" }
    }),
    db.stay.findMany({
      where: { tripId: trip.id, version },
      orderBy: { checkInAt: "asc" }
    }),
    db.event.findMany({
      where: { tripId: trip.id, version },
      orderBy: { startAt: "asc" }
    }),
    db.importBatch.findMany({
      where: { tripId: trip.id },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  return { trip, version, flights, stays, events, importBatches };
};

export const getPublishedSnapshot = async () => {
  const trip = await getPrimaryTrip();
  return getSnapshot(trip.publishedVersion);
};

export const getDraftSnapshot = async () => {
  const trip = await getPrimaryTrip();
  return getSnapshot(trip.draftVersion);
};

export const deriveNextFlightCard = (snapshot: TripSnapshot, now: Date): AnswerCard => {
  const nextFlight = snapshot.flights.find((flight) => isAfter(flight.departAt, now) || isAfter(flight.arriveAt, now));
  if (!nextFlight) {
    return {
      title: "Next flight",
      headline: "All flights completed",
      supporting: "No more flights are scheduled in this itinerary.",
      detail: "You can still review the full travel timeline below."
    };
  }

  return {
    title: "Next flight",
    headline: `${nextFlight.airline} ${nextFlight.flightNumber}`,
    supporting: `${nextFlight.originCode} to ${nextFlight.destinationCode}`,
    detail: `${formatDateTime(nextFlight.departAt, nextFlight.originTimezone)} from ${nextFlight.originName}`,
    badge: formatRelativeDayLabel(nextFlight.departAt, nextFlight.originTimezone, now)
  };
};

export const deriveAirportCard = (snapshot: TripSnapshot, now: Date): AnswerCard => {
  const nextFlight = snapshot.flights.find((flight) => isAfter(flight.departAt, now));
  if (!nextFlight) {
    return {
      title: "Leave for airport",
      headline: "No airport run pending",
      supporting: "There are no upcoming departures right now.",
      detail: "When flights are added, this card will show your leave time."
    };
  }

  const leaveAt = flightRequiredAt(nextFlight, snapshot.trip.defaultAirportLeadMinutes);

  return {
    title: "Leave for airport",
    headline: formatShortTime(leaveAt, nextFlight.originTimezone),
    supporting: `${formatRelativeDayLabel(leaveAt, nextFlight.originTimezone, now)} from ${nextFlight.originName}`,
    detail: `Based on a ${nextFlight.airportLeadMinutes ?? snapshot.trip.defaultAirportLeadMinutes}-minute airport buffer.`,
    badge: nextFlight.originCode
  };
};

export const deriveTonightStaySummary = (snapshot: TripSnapshot, now: Date): TonightStaySummary => {
  const activeStay = snapshot.stays.find((stay) => stay.checkInAt <= now && now < stay.checkOutAt);
  const tonightStay = activeStay ?? snapshot.stays.find((stay) => stay.checkOutAt > now);

  if (!tonightStay) {
    return {
      status: "none",
      name: "No stay scheduled",
      city: "",
      timezone: snapshot.trip.homeTimezone,
      headline: "No accommodation is attached to this trip yet.",
      checkInText: "Add a stay from the admin area.",
      checkOutText: ""
    };
  }

  return {
    status: activeStay ? "active" : "upcoming",
    name: tonightStay.name,
    city: tonightStay.city,
    timezone: tonightStay.timezone,
    headline: activeStay ? `Tonight you are in ${tonightStay.city}.` : `Your next stay is in ${tonightStay.city}.`,
    address: tonightStay.address,
    phone: tonightStay.phone,
    mapUrl: tonightStay.mapUrl,
    checkInText: `Check in: ${formatDateTime(tonightStay.checkInAt, tonightStay.timezone)}`,
    checkOutText: `Check out: ${formatDateTime(tonightStay.checkOutAt, tonightStay.timezone)}`,
    notes: tonightStay.notes
  };
};

export const deriveTomorrowWakeCard = (snapshot: TripSnapshot, now: Date): AnswerCard => {
  const referenceTimezone = deriveTonightStaySummary(snapshot, now).timezone || snapshot.trip.homeTimezone;
  const tomorrowTargetKey = zonedDayKey(addMinutes(now, 24 * 60), referenceTimezone);

  const eventCandidate = snapshot.events
    .map((event) => ({
      timezone: event.timezone,
      wakeAt: addLeadMinutes(eventRequiredAt(event), event.wakeLeadMinutes ?? snapshot.trip.defaultWakeMinutes),
      referenceAt: eventRequiredAt(event),
      title: event.title
    }))
    .filter((item) => zonedDayKey(item.referenceAt, referenceTimezone) === tomorrowTargetKey)
    .sort((a, b) => compareAsc(a.referenceAt, b.referenceAt))[0];

  const flightCandidate = snapshot.flights
    .map((flight) => ({
      timezone: flight.originTimezone,
      wakeAt: addLeadMinutes(
        flightRequiredAt(flight, snapshot.trip.defaultAirportLeadMinutes),
        flight.wakeLeadMinutes ?? snapshot.trip.defaultWakeMinutes
      ),
      referenceAt: flightRequiredAt(flight, snapshot.trip.defaultAirportLeadMinutes),
      title: `${flight.originCode} flight`
    }))
    .filter((item) => zonedDayKey(item.referenceAt, referenceTimezone) === tomorrowTargetKey)
    .sort((a, b) => compareAsc(a.referenceAt, b.referenceAt))[0];

  const candidate = [eventCandidate, flightCandidate]
    .filter(Boolean)
    .sort((a, b) => compareAsc(a!.referenceAt, b!.referenceAt))[0];

  if (!candidate) {
    return {
      title: "Wake up tomorrow",
      headline: "No early start tomorrow",
      supporting: "There is no timed item requiring a wake-up reminder tomorrow.",
      detail: "You can leave this as a slower morning unless the plan changes."
    };
  }

  return {
    title: "Wake up tomorrow",
    headline: formatShortTime(candidate.wakeAt, candidate.timezone),
    supporting: `${candidate.title} starts your day`,
    detail: "Based on the current wake-up buffer for tomorrow's first timed plan.",
    badge: "Tomorrow"
  };
};

const toFlightTimelineItem = (flight: Flight): DayTimelineItem => ({
  id: flight.id,
  kind: "flight",
  title: `${flight.originCode} to ${flight.destinationCode}`,
  category: "Flight",
  timezone: flight.originTimezone,
  startAt: flight.departAt,
  endAt: flight.arriveAt,
  subtitle: `${flight.airline} ${flight.flightNumber}`,
  detail: flight.notes,
  location: flight.originName,
  emphasis: "transit"
});

const toEventTimelineItem = (event: Event): DayTimelineItem => ({
  id: event.id,
  kind: "event",
  title: event.title,
  category: event.category,
  timezone: event.timezone,
  startAt: event.startAt,
  endAt: event.endAt,
  subtitle: event.location || event.category,
  detail: event.notes,
  location: event.location,
  emphasis: event.category.toLowerCase() === "transit" ? "transit" : "plan"
});

export const buildSchedule = (snapshot: TripSnapshot, now = new Date()): DayTimelineGroup[] => {
  const items = [...snapshot.flights.map(toFlightTimelineItem), ...snapshot.events.map(toEventTimelineItem)].sort(compareByStart);
  const grouped = new Map<string, DayTimelineGroup>();

  for (const item of items) {
    const dayKey = zonedDayKey(item.startAt, item.timezone);
    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, {
        dayKey,
        label: formatRelativeDayLabel(item.startAt, item.timezone, now),
        dateText: formatShortDate(item.startAt, item.timezone),
        timezone: item.timezone,
        items: []
      });
    }

    grouped.get(dayKey)!.items.push(item);
  }

  return [...grouped.values()];
};

export const buildTravelerDashboard = async (now = new Date()) => {
  const snapshot = await getPublishedSnapshot();
  return {
    snapshot,
    ...buildTravelerState(snapshot, now)
  };
};

export const buildTravelerState = (snapshot: TripSnapshot, now = new Date()) => {
  const tonightStay = deriveTonightStaySummary(snapshot, now);

  return {
    answerCards: [
      deriveNextFlightCard(snapshot, now),
      deriveAirportCard(snapshot, now),
      {
        title: "Tonight's hotel",
        headline: tonightStay.name,
        supporting: tonightStay.headline,
        detail: tonightStay.checkInText,
        badge: tonightStay.city || undefined
      },
      deriveTomorrowWakeCard(snapshot, now)
    ],
    tonightStay,
    schedule: buildSchedule(snapshot, now)
  };
};

const cloneFlight = (flight: Flight, version: number) => ({
  logicalId: flight.logicalId,
  sourceKey: flight.sourceKey,
  tripId: flight.tripId,
  version,
  airline: flight.airline,
  flightNumber: flight.flightNumber,
  originCode: flight.originCode,
  originName: flight.originName,
  originTimezone: flight.originTimezone,
  destinationCode: flight.destinationCode,
  destinationName: flight.destinationName,
  destinationTimezone: flight.destinationTimezone,
  departAt: flight.departAt,
  arriveAt: flight.arriveAt,
  terminal: flight.terminal,
  confirmationCode: flight.confirmationCode,
  airportLeadMinutes: flight.airportLeadMinutes,
  wakeLeadMinutes: flight.wakeLeadMinutes,
  notes: flight.notes
});

const cloneStay = (stay: Stay, version: number) => ({
  logicalId: stay.logicalId,
  sourceKey: stay.sourceKey,
  tripId: stay.tripId,
  version,
  name: stay.name,
  city: stay.city,
  country: stay.country,
  timezone: stay.timezone,
  address: stay.address,
  phone: stay.phone,
  mapUrl: stay.mapUrl,
  checkInAt: stay.checkInAt,
  checkOutAt: stay.checkOutAt,
  confirmationCode: stay.confirmationCode,
  notes: stay.notes
});

const cloneEvent = (event: Event, version: number) => ({
  logicalId: event.logicalId,
  sourceKey: event.sourceKey,
  tripId: event.tripId,
  version,
  title: event.title,
  category: event.category,
  timezone: event.timezone,
  location: event.location,
  startAt: event.startAt,
  endAt: event.endAt,
  requiredArrivalAt: event.requiredArrivalAt,
  requiredLeadMinutes: event.requiredLeadMinutes,
  wakeLeadMinutes: event.wakeLeadMinutes,
  notes: event.notes
});

export const publishDraftVersion = async () => {
  const trip = await getPrimaryTrip();
  const draft = await getDraftSnapshot();
  const nextDraftVersion = draft.version + 1;

  await db.$transaction(async (tx) => {
    await tx.flight.deleteMany({ where: { tripId: trip.id, version: nextDraftVersion } });
    await tx.stay.deleteMany({ where: { tripId: trip.id, version: nextDraftVersion } });
    await tx.event.deleteMany({ where: { tripId: trip.id, version: nextDraftVersion } });

    if (draft.flights.length > 0) {
      await tx.flight.createMany({
        data: draft.flights.map((flight) => cloneFlight(flight, nextDraftVersion))
      });
    }

    if (draft.stays.length > 0) {
      await tx.stay.createMany({
        data: draft.stays.map((stay) => cloneStay(stay, nextDraftVersion))
      });
    }

    if (draft.events.length > 0) {
      await tx.event.createMany({
        data: draft.events.map((event) => cloneEvent(event, nextDraftVersion))
      });
    }

    await tx.trip.update({
      where: { id: trip.id },
      data: {
        publishedVersion: draft.version,
        draftVersion: nextDraftVersion
      }
    });
  });
};

export const replaceDraftData = async (
  draftVersion: number,
  input: {
    flights: Prisma.FlightCreateManyInput[];
    stays: Prisma.StayCreateManyInput[];
    events: Prisma.EventCreateManyInput[];
  }
) => {
  const trip = await getPrimaryTrip();

  await db.$transaction(async (tx) => {
    await tx.flight.deleteMany({ where: { tripId: trip.id, version: draftVersion } });
    await tx.stay.deleteMany({ where: { tripId: trip.id, version: draftVersion } });
    await tx.event.deleteMany({ where: { tripId: trip.id, version: draftVersion } });

    if (input.flights.length > 0) {
      await tx.flight.createMany({ data: input.flights });
    }

    if (input.stays.length > 0) {
      await tx.stay.createMany({ data: input.stays });
    }

    if (input.events.length > 0) {
      await tx.event.createMany({ data: input.events });
    }
  });
};

export const createDraftRecordId = () => randomUUID();
