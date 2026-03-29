import type { Event, Flight, ImportBatch, Stay, Trip } from "@prisma/client";

export type TripSnapshot = {
  trip: Trip;
  version: number;
  flights: Flight[];
  stays: Stay[];
  events: Event[];
  importBatches?: ImportBatch[];
};

export type AnswerCard = {
  title: string;
  headline: string;
  supporting: string;
  detail: string;
  badge?: string;
};

export type TonightStaySummary = {
  status: "active" | "upcoming" | "none";
  name: string;
  city: string;
  timezone: string;
  headline: string;
  address?: string;
  phone?: string | null;
  mapUrl?: string | null;
  checkInText: string;
  checkOutText: string;
  notes?: string | null;
};

export type DayTimelineItem = {
  id: string;
  kind: "flight" | "event";
  title: string;
  category: string;
  timezone: string;
  startAt: Date;
  endAt?: Date | null;
  subtitle: string;
  detail?: string | null;
  location?: string | null;
  emphasis?: "transit" | "plan" | "stay";
};

export type DayTimelineGroup = {
  dayKey: string;
  label: string;
  dateText: string;
  timezone: string;
  items: DayTimelineItem[];
};

export type ImportValidationError = {
  sheet: string;
  row: number;
  message: string;
};

export type ParsedImportWorkbook = {
  settings?: {
    name: string;
    homeTimezone: string;
    defaultAirportLeadMinutes: number;
    defaultWakeMinutes: number;
    travelerCount?: number;
    tripStartAt: Date;
    tripEndAt: Date;
    notes?: string;
  };
  flights: Array<{
    sourceKey: string;
    airline: string;
    flightNumber: string;
    originCode: string;
    originName: string;
    originTimezone: string;
    destinationCode: string;
    destinationName: string;
    destinationTimezone: string;
    departAt: Date;
    arriveAt: Date;
    terminal?: string;
    confirmationCode?: string;
    airportLeadMinutes?: number;
    wakeLeadMinutes?: number;
    notes?: string;
  }>;
  stays: Array<{
    sourceKey: string;
    name: string;
    city: string;
    country: string;
    timezone: string;
    address: string;
    phone?: string;
    mapUrl?: string;
    checkInAt: Date;
    checkOutAt: Date;
    confirmationCode?: string;
    notes?: string;
  }>;
  events: Array<{
    sourceKey: string;
    title: string;
    category: string;
    timezone: string;
    location?: string;
    startAt: Date;
    endAt?: Date;
    requiredArrivalAt?: Date;
    requiredLeadMinutes?: number;
    wakeLeadMinutes?: number;
    notes?: string;
  }>;
  errors: ImportValidationError[];
};

export type SessionRole = "traveler" | "admin";
