import { randomUUID } from "node:crypto";

import type { ParsedImportWorkbook } from "@/types";
import { parseLocalDateTime } from "@/time";

const key = (prefix: string, value: string) =>
  `${prefix}-${value.replace(/\s+/g, "-").toLowerCase()}`;

export const sampleTrip = {
  slug: "barcelona-porto-family-2026",
  name: "Barcelona & Porto Family Itinerary",
  travelerCount: 5,
  homeTimezone: "Europe/Madrid",
  defaultAirportLeadMinutes: 180,
  defaultWakeMinutes: 90,
  tripStartAt: parseLocalDateTime("2026-05-29T08:00", "Europe/Madrid"),
  tripEndAt: parseLocalDateTime("2026-06-05T11:00", "Europe/Madrid"),
  notes:
    "Seeded from the existing Barcelona and Porto itinerary in this workspace. Replace placeholder flight and hotel details with confirmed bookings when ready."
};

export const sampleFlights: ParsedImportWorkbook["flights"] = [
  {
    sourceKey: "flight-arrive-bcn",
    airline: "Booked Flight",
    flightNumber: "TBC-BCN",
    originCode: "PER",
    originName: "Perth",
    originTimezone: "Australia/Perth",
    destinationCode: "BCN",
    destinationName: "Barcelona El Prat",
    destinationTimezone: "Europe/Madrid",
    departAt: parseLocalDateTime("2026-05-28T14:45", "Australia/Perth"),
    arriveAt: parseLocalDateTime("2026-05-29T08:00", "Europe/Madrid"),
    terminal: "T1",
    airportLeadMinutes: 180,
    wakeLeadMinutes: 180,
    notes: "Replace this placeholder with the confirmed long-haul booking."
  },
  {
    sourceKey: "flight-bcn-opo",
    airline: "Iberia / Vueling",
    flightNumber: "TBC-OPO",
    originCode: "BCN",
    originName: "Barcelona El Prat",
    originTimezone: "Europe/Madrid",
    destinationCode: "OPO",
    destinationName: "Porto Airport",
    destinationTimezone: "Europe/Lisbon",
    departAt: parseLocalDateTime("2026-06-01T16:00", "Europe/Madrid"),
    arriveAt: parseLocalDateTime("2026-06-01T17:00", "Europe/Lisbon"),
    terminal: "T1",
    airportLeadMinutes: 90,
    wakeLeadMinutes: 180,
    notes: "The current itinerary suggests a mid-afternoon flight to Porto."
  },
  {
    sourceKey: "flight-opo-bcn",
    airline: "Iberia / Vueling",
    flightNumber: "TBC-BCN2",
    originCode: "OPO",
    originName: "Porto Airport",
    originTimezone: "Europe/Lisbon",
    destinationCode: "BCN",
    destinationName: "Barcelona El Prat",
    destinationTimezone: "Europe/Madrid",
    departAt: parseLocalDateTime("2026-06-04T18:00", "Europe/Lisbon"),
    arriveAt: parseLocalDateTime("2026-06-04T20:00", "Europe/Madrid"),
    airportLeadMinutes: 120,
    wakeLeadMinutes: 180,
    notes: "Replace with the booked return-to-Barcelona flight number."
  },
  {
    sourceKey: "flight-bcn-home",
    airline: "Booked Flight",
    flightNumber: "TBC-HOME",
    originCode: "BCN",
    originName: "Barcelona El Prat",
    originTimezone: "Europe/Madrid",
    destinationCode: "PER",
    destinationName: "Perth",
    destinationTimezone: "Australia/Perth",
    departAt: parseLocalDateTime("2026-06-05T11:00", "Europe/Madrid"),
    arriveAt: parseLocalDateTime("2026-06-06T08:00", "Australia/Perth"),
    terminal: "T1",
    airportLeadMinutes: 120,
    wakeLeadMinutes: 120,
    notes: "Placeholder final departure based on the existing itinerary."
  }
];

export const sampleStays: ParsedImportWorkbook["stays"] = [
  {
    sourceKey: "stay-barcelona-old-town",
    name: "Barcelona Old Town Apartment",
    city: "Barcelona",
    country: "Spain",
    timezone: "Europe/Madrid",
    address: "Near Placa Catalunya, Barcelona",
    phone: "+34 000 000 000",
    mapUrl: "https://maps.google.com/?q=Placa+Catalunya+Barcelona",
    checkInAt: parseLocalDateTime("2026-05-29T14:00", "Europe/Madrid"),
    checkOutAt: parseLocalDateTime("2026-06-01T12:00", "Europe/Madrid"),
    confirmationCode: "ADD-BOOKING",
    notes: "Replace with the confirmed Barcelona stay when available."
  },
  {
    sourceKey: "stay-porto-riverside",
    name: "Porto Riverside Suites",
    city: "Porto",
    country: "Portugal",
    timezone: "Europe/Lisbon",
    address: "Ribeira district, Porto",
    phone: "+351 000 000 000",
    mapUrl: "https://maps.google.com/?q=Ribeira+Porto",
    checkInAt: parseLocalDateTime("2026-06-01T19:00", "Europe/Lisbon"),
    checkOutAt: parseLocalDateTime("2026-06-04T11:00", "Europe/Lisbon"),
    confirmationCode: "ADD-BOOKING",
    notes: "The itinerary recommends staying in Clerigos or Ribeira."
  },
  {
    sourceKey: "stay-barcelona-eixample",
    name: "Eixample Central Hotel",
    city: "Barcelona",
    country: "Spain",
    timezone: "Europe/Madrid",
    address: "Eixample, Barcelona",
    phone: "+34 000 000 001",
    mapUrl: "https://maps.google.com/?q=Eixample+Barcelona",
    checkInAt: parseLocalDateTime("2026-06-04T21:00", "Europe/Madrid"),
    checkOutAt: parseLocalDateTime("2026-06-05T08:45", "Europe/Madrid"),
    confirmationCode: "ADD-BOOKING",
    notes: "Final-night Barcelona stay placeholder."
  }
];

export const sampleEvents: ParsedImportWorkbook["events"] = [
  {
    sourceKey: key("event", "arrive-el-prat"),
    title: "Arrive El Prat Airport",
    category: "Transit",
    timezone: "Europe/Madrid",
    location: "Barcelona El Prat Airport",
    startAt: parseLocalDateTime("2026-05-29T08:00", "Europe/Madrid"),
    notes: "Aerobus to Placa Catalunya after arrival."
  },
  {
    sourceKey: key("event", "la-boqueria"),
    title: "La Boqueria Market breakfast",
    category: "Food",
    timezone: "Europe/Madrid",
    location: "La Boqueria",
    startAt: parseLocalDateTime("2026-05-29T10:30", "Europe/Madrid"),
    endAt: parseLocalDateTime("2026-05-29T11:30", "Europe/Madrid"),
    notes: "Arrive early before crowds peak."
  },
  {
    sourceKey: key("event", "gothic-quarter"),
    title: "Gothic Quarter stroll",
    category: "Culture",
    timezone: "Europe/Madrid",
    location: "Barri Gotic",
    startAt: parseLocalDateTime("2026-05-29T12:00", "Europe/Madrid"),
    endAt: parseLocalDateTime("2026-05-29T13:30", "Europe/Madrid"),
    notes: "Placa Reial, Cathedral, Pont del Bisbe."
  },
  {
    sourceKey: key("event", "barceloneta-dinner"),
    title: "Barceloneta sunset and tapas dinner",
    category: "Food",
    timezone: "Europe/Madrid",
    location: "Barceloneta",
    startAt: parseLocalDateTime("2026-05-29T19:30", "Europe/Madrid"),
    notes: "La Cova Fumada or Bar Electricitat."
  },
  {
    sourceKey: key("event", "sagrada-familia"),
    title: "Sagrada Familia entry",
    category: "Culture",
    timezone: "Europe/Madrid",
    location: "Sagrada Familia",
    startAt: parseLocalDateTime("2026-05-30T08:30", "Europe/Madrid"),
    endAt: parseLocalDateTime("2026-05-30T10:30", "Europe/Madrid"),
    requiredArrivalAt: parseLocalDateTime("2026-05-30T08:15", "Europe/Madrid"),
    wakeLeadMinutes: 120,
    notes: "Book the first entry slot."
  },
  {
    sourceKey: key("event", "park-guell"),
    title: "Park Guell",
    category: "Outdoor",
    timezone: "Europe/Madrid",
    location: "Park Guell",
    startAt: parseLocalDateTime("2026-05-30T15:30", "Europe/Madrid"),
    endAt: parseLocalDateTime("2026-05-30T17:00", "Europe/Madrid"),
    requiredArrivalAt: parseLocalDateTime("2026-05-30T15:15", "Europe/Madrid"),
    notes: "Timed ticket entry for the Monumental Zone."
  },
  {
    sourceKey: key("event", "montserrat-train"),
    title: "Train to Montserrat",
    category: "Transit",
    timezone: "Europe/Madrid",
    location: "Placa Espanya station",
    startAt: parseLocalDateTime("2026-05-31T08:30", "Europe/Madrid"),
    wakeLeadMinutes: 90,
    notes: "Take the R5 FGC train and the rack railway."
  },
  {
    sourceKey: key("event", "montserrat-monastery"),
    title: "Montserrat Monastery and Black Madonna",
    category: "Culture",
    timezone: "Europe/Madrid",
    location: "Montserrat",
    startAt: parseLocalDateTime("2026-05-31T10:00", "Europe/Madrid"),
    endAt: parseLocalDateTime("2026-05-31T11:30", "Europe/Madrid"),
    notes: "Look for the choir timing if available."
  },
  {
    sourceKey: key("event", "montjuic-morning"),
    title: "Montjuic by cable car and castle",
    category: "Outdoor",
    timezone: "Europe/Madrid",
    location: "Montjuic",
    startAt: parseLocalDateTime("2026-06-01T09:00", "Europe/Madrid"),
    endAt: parseLocalDateTime("2026-06-01T11:00", "Europe/Madrid"),
    notes: "Easy final Barcelona morning before Porto."
  },
  {
    sourceKey: key("event", "collect-bags-bcn"),
    title: "Collect bags and leave for airport",
    category: "Transit",
    timezone: "Europe/Madrid",
    location: "Barcelona stay",
    startAt: parseLocalDateTime("2026-06-01T13:00", "Europe/Madrid"),
    requiredLeadMinutes: 0,
    notes: "Quick lunch near the hotel, then Aerobus."
  },
  {
    sourceKey: key("event", "porto-checkin"),
    title: "Check in and Sao Bento Station",
    category: "Stay",
    timezone: "Europe/Lisbon",
    location: "Porto",
    startAt: parseLocalDateTime("2026-06-01T19:00", "Europe/Lisbon"),
    endAt: parseLocalDateTime("2026-06-01T20:15", "Europe/Lisbon"),
    notes: "Drop bags first, then station visit."
  },
  {
    sourceKey: key("event", "porto-francesinha"),
    title: "First dinner in Porto",
    category: "Food",
    timezone: "Europe/Lisbon",
    location: "Cafe Santiago",
    startAt: parseLocalDateTime("2026-06-01T20:30", "Europe/Lisbon"),
    notes: "Francesinha dinner for the first night."
  },
  {
    sourceKey: key("event", "porto-food-tour"),
    title: "Porto Food and Vintage Port tour",
    category: "Food",
    timezone: "Europe/Lisbon",
    location: "Mercado do Bolhao",
    startAt: parseLocalDateTime("2026-06-02T09:00", "Europe/Lisbon"),
    endAt: parseLocalDateTime("2026-06-02T12:30", "Europe/Lisbon"),
    requiredArrivalAt: parseLocalDateTime("2026-06-02T08:45", "Europe/Lisbon"),
    wakeLeadMinutes: 120,
    notes: "Book ahead for the highly rated group tour."
  },
  {
    sourceKey: key("event", "gaia-cellars"),
    title: "Walk to Gaia wine cellars",
    category: "Wine",
    timezone: "Europe/Lisbon",
    location: "Vila Nova de Gaia",
    startAt: parseLocalDateTime("2026-06-02T14:30", "Europe/Lisbon"),
    endAt: parseLocalDateTime("2026-06-02T18:00", "Europe/Lisbon"),
    notes: "Taylor's, Graham's, or Sandeman."
  },
  {
    sourceKey: key("event", "gaia-sunset"),
    title: "Gaia cable car and sunset viewpoint",
    category: "Outdoor",
    timezone: "Europe/Lisbon",
    location: "Miradouro da Serra do Pilar",
    startAt: parseLocalDateTime("2026-06-02T18:30", "Europe/Lisbon"),
    notes: "Best Porto skyline view."
  },
  {
    sourceKey: key("event", "douro-depart"),
    title: "Depart for Douro Valley",
    category: "Transit",
    timezone: "Europe/Lisbon",
    location: "Porto",
    startAt: parseLocalDateTime("2026-06-03T08:00", "Europe/Lisbon"),
    wakeLeadMinutes: 90,
    notes: "Guided tour or scenic train line."
  },
  {
    sourceKey: key("event", "douro-lunch"),
    title: "Lunch with Douro River views",
    category: "Food",
    timezone: "Europe/Lisbon",
    location: "Douro Valley",
    startAt: parseLocalDateTime("2026-06-03T13:00", "Europe/Lisbon"),
    endAt: parseLocalDateTime("2026-06-03T14:15", "Europe/Lisbon"),
    notes: "Traditional Portuguese lunch."
  },
  {
    sourceKey: key("event", "porto-fado"),
    title: "Fado show and dinner",
    category: "Culture",
    timezone: "Europe/Lisbon",
    location: "Casa da Mariquinhas",
    startAt: parseLocalDateTime("2026-06-03T20:00", "Europe/Lisbon"),
    notes: "Authentic Fado performance."
  },
  {
    sourceKey: key("event", "livraria-lello"),
    title: "Livraria Lello",
    category: "Culture",
    timezone: "Europe/Lisbon",
    location: "Livraria Lello",
    startAt: parseLocalDateTime("2026-06-04T09:00", "Europe/Lisbon"),
    endAt: parseLocalDateTime("2026-06-04T10:00", "Europe/Lisbon"),
    notes: "Go early for smaller queues."
  },
  {
    sourceKey: key("event", "porto-lunch-airport"),
    title: "Farewell lunch then metro to airport",
    category: "Transit",
    timezone: "Europe/Lisbon",
    location: "Porto city centre",
    startAt: parseLocalDateTime("2026-06-04T13:00", "Europe/Lisbon"),
    notes: "Allow time to collect bags and head to OPO."
  },
  {
    sourceKey: key("event", "barcelona-night-out"),
    title: "Final Barcelona night out",
    category: "Food",
    timezone: "Europe/Madrid",
    location: "El Born or Poble Sec",
    startAt: parseLocalDateTime("2026-06-04T21:00", "Europe/Madrid"),
    notes: "Tapas and cocktails after returning from Porto."
  },
  {
    sourceKey: key("event", "final-breakfast"),
    title: "Final breakfast in Barcelona",
    category: "Food",
    timezone: "Europe/Madrid",
    location: "Near Eixample",
    startAt: parseLocalDateTime("2026-06-05T07:30", "Europe/Madrid"),
    endAt: parseLocalDateTime("2026-06-05T08:15", "Europe/Madrid"),
    notes: "Pack up and get ready for departure."
  },
  {
    sourceKey: key("event", "final-airport-run"),
    title: "Collect bags and Aerobus to BCN",
    category: "Transit",
    timezone: "Europe/Madrid",
    location: "Placa Catalunya",
    startAt: parseLocalDateTime("2026-06-05T09:00", "Europe/Madrid"),
    notes: "Aim to reach the airport with 90 minutes to spare."
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
