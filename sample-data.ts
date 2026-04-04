import { randomUUID } from "node:crypto";

import type { ParsedImportWorkbook } from "@/types";
import { parseLocalDateTime } from "@/time";

const key = (prefix: string, value: string) =>
  `${prefix}-${value.replace(/\s+/g, "-").toLowerCase()}`;

export const sampleTrip = {
  slug: "kuching-kuala-lumpur-family-2026",
  name: "Kuching & Kuala Lumpur Family Itinerary",
  travelerCount: 5,
  homeTimezone: "Asia/Kuching",
  defaultAirportLeadMinutes: 120,
  defaultWakeMinutes: 90,
  tripStartAt: parseLocalDateTime("2026-05-27T14:40", "Asia/Kuching"),
  tripEndAt: parseLocalDateTime("2026-05-31T18:20", "Asia/Kuching"),
  notes:
    "Seeded as a generic Kuching and Kuala Lumpur sample itinerary. Replace placeholder flights, stays, and activities with your actual travel plans when ready."
};

export const sampleFlights: ParsedImportWorkbook["flights"] = [
  {
    sourceKey: "flight-kch-kul",
    airline: "Malaysia Airlines",
    flightNumber: "MH2521",
    originCode: "KCH",
    originName: "Kuching International Airport",
    originTimezone: "Asia/Kuching",
    destinationCode: "KUL",
    destinationName: "Kuala Lumpur International Airport",
    destinationTimezone: "Asia/Kuala_Lumpur",
    departAt: parseLocalDateTime("2026-05-27T14:40", "Asia/Kuching"),
    arriveAt: parseLocalDateTime("2026-05-27T16:35", "Asia/Kuala_Lumpur"),
    terminal: "T1",
    airportLeadMinutes: 120,
    wakeLeadMinutes: 150,
    notes: "Sample outbound flight from Kuching to Kuala Lumpur."
  },
  {
    sourceKey: "flight-kul-kch",
    airline: "Malaysia Airlines",
    flightNumber: "MH2528",
    originCode: "KUL",
    originName: "Kuala Lumpur International Airport",
    originTimezone: "Asia/Kuala_Lumpur",
    destinationCode: "KCH",
    destinationName: "Kuching International Airport",
    destinationTimezone: "Asia/Kuching",
    departAt: parseLocalDateTime("2026-05-31T16:30", "Asia/Kuala_Lumpur"),
    arriveAt: parseLocalDateTime("2026-05-31T18:20", "Asia/Kuching"),
    terminal: "T1",
    airportLeadMinutes: 120,
    wakeLeadMinutes: 120,
    notes: "Sample return flight back to Kuching."
  }
];

export const sampleStays: ParsedImportWorkbook["stays"] = [
  {
    sourceKey: "stay-klia-transit",
    name: "KLIA Transit Hotel",
    city: "Sepang",
    country: "Malaysia",
    timezone: "Asia/Kuala_Lumpur",
    address: "KLIA Terminal 1, Sepang",
    phone: "+60 3-0000 0000",
    mapUrl: "https://maps.google.com/?q=KLIA+Terminal+1+Sepang",
    checkInAt: parseLocalDateTime("2026-05-27T19:00", "Asia/Kuala_Lumpur"),
    checkOutAt: parseLocalDateTime("2026-05-28T09:00", "Asia/Kuala_Lumpur"),
    confirmationCode: "ADD-BOOKING",
    notes: "Useful if the family wants a simple airport-area stop on arrival day."
  },
  {
    sourceKey: "stay-kl-city-centre",
    name: "Kuala Lumpur City Centre Hotel",
    city: "Kuala Lumpur",
    country: "Malaysia",
    timezone: "Asia/Kuala_Lumpur",
    address: "Near KLCC, Kuala Lumpur",
    phone: "+60 3-0000 0001",
    mapUrl: "https://maps.google.com/?q=KLCC+Kuala+Lumpur",
    checkInAt: parseLocalDateTime("2026-05-28T14:00", "Asia/Kuala_Lumpur"),
    checkOutAt: parseLocalDateTime("2026-05-30T11:00", "Asia/Kuala_Lumpur"),
    confirmationCode: "ADD-BOOKING",
    notes: "Sample city-centre base for sightseeing and meals."
  },
  {
    sourceKey: "stay-kl-last-night",
    name: "Kuala Lumpur Airport Hotel",
    city: "Sepang",
    country: "Malaysia",
    timezone: "Asia/Kuala_Lumpur",
    address: "Near KLIA, Sepang",
    phone: "+60 3-0000 0002",
    mapUrl: "https://maps.google.com/?q=KLIA+Sepang",
    checkInAt: parseLocalDateTime("2026-05-30T18:30", "Asia/Kuala_Lumpur"),
    checkOutAt: parseLocalDateTime("2026-05-31T12:00", "Asia/Kuala_Lumpur"),
    confirmationCode: "ADD-BOOKING",
    notes: "Sample final-night stay to keep departure day simple."
  }
];

export const sampleEvents: ParsedImportWorkbook["events"] = [
  {
    sourceKey: key("event", "depart-kuching"),
    title: "Leave for Kuching airport",
    category: "Transit",
    timezone: "Asia/Kuching",
    location: "Kuching",
    startAt: parseLocalDateTime("2026-05-27T12:40", "Asia/Kuching"),
    notes: "Sample airport run with a comfortable buffer for family check-in."
  },
  {
    sourceKey: key("event", "arrive-klia"),
    title: "Arrive at KLIA and collect bags",
    category: "Transit",
    timezone: "Asia/Kuala_Lumpur",
    location: "Kuala Lumpur International Airport",
    startAt: parseLocalDateTime("2026-05-27T16:35", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-27T17:20", "Asia/Kuala_Lumpur"),
    notes: "Follow signs for baggage claim and ride booking pick-up."
  },
  {
    sourceKey: key("event", "dinner-airport-area"),
    title: "Easy dinner near the airport",
    category: "Food",
    timezone: "Asia/Kuala_Lumpur",
    location: "Sepang",
    startAt: parseLocalDateTime("2026-05-27T19:45", "Asia/Kuala_Lumpur"),
    notes: "Low-effort first evening after the flight."
  },
  {
    sourceKey: key("event", "hotel-breakfast"),
    title: "Hotel breakfast and slow start",
    category: "Food",
    timezone: "Asia/Kuala_Lumpur",
    location: "Sepang",
    startAt: parseLocalDateTime("2026-05-28T07:30", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-28T08:30", "Asia/Kuala_Lumpur"),
    notes: "Keep the first morning light and flexible."
  },
  {
    sourceKey: key("event", "transfer-city"),
    title: "Transfer from Sepang to city hotel",
    category: "Transit",
    timezone: "Asia/Kuala_Lumpur",
    location: "Sepang to Kuala Lumpur",
    startAt: parseLocalDateTime("2026-05-28T10:30", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-28T12:00", "Asia/Kuala_Lumpur"),
    notes: "KLIA Express or car transfer into the city."
  },
  {
    sourceKey: key("event", "city-lunch"),
    title: "Lunch near the hotel",
    category: "Food",
    timezone: "Asia/Kuala_Lumpur",
    location: "Kuala Lumpur",
    startAt: parseLocalDateTime("2026-05-28T13:00", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-28T14:00", "Asia/Kuala_Lumpur"),
    notes: "A simple placeholder meal after check-in."
  },
  {
    sourceKey: key("event", "park-walk"),
    title: "Afternoon park walk",
    category: "Outdoor",
    timezone: "Asia/Kuala_Lumpur",
    location: "Kuala Lumpur City Centre Park",
    startAt: parseLocalDateTime("2026-05-28T16:30", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-28T17:30", "Asia/Kuala_Lumpur"),
    notes: "Easy outdoor break before dinner."
  },
  {
    sourceKey: key("event", "family-dinner"),
    title: "Family dinner in the city",
    category: "Food",
    timezone: "Asia/Kuala_Lumpur",
    location: "Kuala Lumpur",
    startAt: parseLocalDateTime("2026-05-28T19:30", "Asia/Kuala_Lumpur"),
    notes: "Generic dinner placeholder for the first full day."
  },
  {
    sourceKey: key("event", "museum-morning"),
    title: "Museum or gallery morning",
    category: "Culture",
    timezone: "Asia/Kuala_Lumpur",
    location: "Kuala Lumpur",
    startAt: parseLocalDateTime("2026-05-29T09:30", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-29T11:30", "Asia/Kuala_Lumpur"),
    requiredArrivalAt: parseLocalDateTime("2026-05-29T09:15", "Asia/Kuala_Lumpur"),
    wakeLeadMinutes: 120,
    notes: "Generic morning activity that can be replaced later."
  },
  {
    sourceKey: key("event", "shopping-break"),
    title: "Afternoon shopping break",
    category: "Leisure",
    timezone: "Asia/Kuala_Lumpur",
    location: "Kuala Lumpur",
    startAt: parseLocalDateTime("2026-05-29T14:30", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-29T16:30", "Asia/Kuala_Lumpur"),
    notes: "Flexible free-time slot."
  },
  {
    sourceKey: key("event", "dessert-stop"),
    title: "Dessert stop and evening walk",
    category: "Food",
    timezone: "Asia/Kuala_Lumpur",
    location: "Kuala Lumpur",
    startAt: parseLocalDateTime("2026-05-29T20:00", "Asia/Kuala_Lumpur"),
    notes: "A calm evening option close to the hotel."
  },
  {
    sourceKey: key("event", "morning-market"),
    title: "Morning market visit",
    category: "Culture",
    timezone: "Asia/Kuala_Lumpur",
    location: "Kuala Lumpur",
    startAt: parseLocalDateTime("2026-05-30T08:30", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-30T10:00", "Asia/Kuala_Lumpur"),
    wakeLeadMinutes: 90,
    notes: "Easy local errand-and-breakfast slot."
  },
  {
    sourceKey: key("event", "late-checkout-lunch"),
    title: "Late checkout and lunch",
    category: "Food",
    timezone: "Asia/Kuala_Lumpur",
    location: "Kuala Lumpur",
    startAt: parseLocalDateTime("2026-05-30T12:30", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-30T13:45", "Asia/Kuala_Lumpur"),
    notes: "Keeps the sample plan realistic before changing hotels."
  },
  {
    sourceKey: key("event", "transfer-airport-hotel"),
    title: "Transfer to airport-area hotel",
    category: "Transit",
    timezone: "Asia/Kuala_Lumpur",
    location: "Kuala Lumpur to Sepang",
    startAt: parseLocalDateTime("2026-05-30T16:30", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-30T18:00", "Asia/Kuala_Lumpur"),
    notes: "Move closer to KLIA before departure day."
  },
  {
    sourceKey: key("event", "final-dinner"),
    title: "Final dinner near the airport",
    category: "Food",
    timezone: "Asia/Kuala_Lumpur",
    location: "Sepang",
    startAt: parseLocalDateTime("2026-05-30T19:30", "Asia/Kuala_Lumpur"),
    notes: "Simple last-night dinner placeholder."
  },
  {
    sourceKey: key("event", "final-breakfast"),
    title: "Breakfast before departure",
    category: "Food",
    timezone: "Asia/Kuala_Lumpur",
    location: "Sepang",
    startAt: parseLocalDateTime("2026-05-31T08:00", "Asia/Kuala_Lumpur"),
    endAt: parseLocalDateTime("2026-05-31T09:00", "Asia/Kuala_Lumpur"),
    notes: "Pack, check out, and keep the morning easy."
  },
  {
    sourceKey: key("event", "check-out-buffer"),
    title: "Check out and head to KLIA",
    category: "Transit",
    timezone: "Asia/Kuala_Lumpur",
    location: "Sepang",
    startAt: parseLocalDateTime("2026-05-31T11:30", "Asia/Kuala_Lumpur"),
    requiredLeadMinutes: 0,
    notes: "Short transfer to the airport before the return flight."
  }
];

export const workbookTemplatePreview: ParsedImportWorkbook = {
  settings: {
    name: sampleTrip.name,
    homeTimezone: sampleTrip.homeTimezone,
    defaultAirportLeadMinutes: sampleTrip.defaultAirportLeadMinutes,
    defaultWakeMinutes: sampleTrip.defaultWakeMinutes,
    travelerCount: sampleTrip.travelerCount,
    tripStartAt: sampleTrip.tripStartAt,
    tripEndAt: sampleTrip.tripEndAt,
    notes: sampleTrip.notes
  },
  flights: sampleFlights,
  stays: sampleStays,
  events: sampleEvents,
  errors: []
};

export const newLogicalId = () => randomUUID();
