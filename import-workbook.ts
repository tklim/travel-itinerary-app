import * as XLSX from "xlsx";
import { z } from "zod";

import type { ImportValidationError, ParsedImportWorkbook } from "@/types";
import { parseLocalDateTime } from "@/time";

const text = (value: unknown) => String(value ?? "").trim();
const optionalText = (value: unknown) => {
  const parsed = text(value);
  return parsed.length > 0 ? parsed : undefined;
};

const numberFromCell = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const rowSchema = z.record(z.string(), z.unknown());
const requiredSheets = ["Flights", "Stays", "Events", "Settings"] as const;

const parseWorkbookDate = (
  raw: unknown,
  timezone: string,
  sheet: string,
  row: number,
  field: string,
  errors: ImportValidationError[]
) => {
  const value = text(raw);
  if (!value) {
    errors.push({ sheet, row, message: `${field} is required.` });
    return undefined;
  }

  try {
    return parseLocalDateTime(value, timezone);
  } catch {
    errors.push({
      sheet,
      row,
      message: `${field} must look like 2026-06-01T16:00.`
    });
    return undefined;
  }
};

const parseSheetRows = (workbook: XLSX.WorkBook, sheetName: string) => {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    return [];
  }

  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false
  });
};

export const parseImportWorkbook = (buffer: ArrayBuffer): ParsedImportWorkbook => {
  const workbook = XLSX.read(buffer, { type: "array" });
  const errors: ImportValidationError[] = [];

  for (const sheet of requiredSheets) {
    if (!workbook.Sheets[sheet]) {
      errors.push({ sheet, row: 0, message: `Required sheet "${sheet}" is missing.` });
    }
  }

  const settingsRows = parseSheetRows(workbook, "Settings");
  const settingsRow = settingsRows[0] ?? {};
  const settingsTimezone = text(settingsRow.homeTimezone) || "Europe/Madrid";

  const settings =
    settingsRows.length > 0
      ? {
          name: text(settingsRow.name) || "Family Trip",
          homeTimezone: settingsTimezone,
          defaultAirportLeadMinutes: numberFromCell(settingsRow.defaultAirportLeadMinutes) ?? 180,
          defaultWakeMinutes: numberFromCell(settingsRow.defaultWakeMinutes) ?? 90,
          travelerCount: numberFromCell(settingsRow.travelerCount),
          tripStartAt:
            parseWorkbookDate(
              settingsRow.tripStartAt,
              settingsTimezone,
              "Settings",
              2,
              "tripStartAt",
              errors
            ) ?? new Date(),
          tripEndAt:
            parseWorkbookDate(
              settingsRow.tripEndAt,
              settingsTimezone,
              "Settings",
              2,
              "tripEndAt",
              errors
            ) ?? new Date(),
          notes: optionalText(settingsRow.notes)
        }
      : undefined;

  const flights = parseSheetRows(workbook, "Flights").flatMap((rawRow, index) => {
    const row = rowSchema.safeParse(rawRow).success ? rawRow : {};
    const line = index + 2;
    const timezone = text(row.originTimezone) || settingsTimezone;
    const destinationTimezone = text(row.destinationTimezone) || settingsTimezone;

    const departAt = parseWorkbookDate(row.departAt, timezone, "Flights", line, "departAt", errors);
    const arriveAt = parseWorkbookDate(
      row.arriveAt,
      destinationTimezone,
      "Flights",
      line,
      "arriveAt",
      errors
    );

    const airline = text(row.airline);
    const flightNumber = text(row.flightNumber);
    const originCode = text(row.originCode);
    const destinationCode = text(row.destinationCode);

    if (!airline || !flightNumber || !originCode || !destinationCode || !departAt || !arriveAt) {
      errors.push({
        sheet: "Flights",
        row: line,
        message: "airline, flightNumber, originCode, destinationCode, departAt, and arriveAt are required."
      });
      return [];
    }

    return [
      {
        sourceKey: text(row.sourceKey) || `flight-${flightNumber.toLowerCase()}`,
        airline,
        flightNumber,
        originCode,
        originName: text(row.originName) || originCode,
        originTimezone: timezone,
        destinationCode,
        destinationName: text(row.destinationName) || destinationCode,
        destinationTimezone,
        departAt,
        arriveAt,
        terminal: optionalText(row.terminal),
        confirmationCode: optionalText(row.confirmationCode),
        airportLeadMinutes: numberFromCell(row.airportLeadMinutes),
        wakeLeadMinutes: numberFromCell(row.wakeLeadMinutes),
        notes: optionalText(row.notes)
      }
    ];
  });

  const stays = parseSheetRows(workbook, "Stays").flatMap((row, index) => {
    const line = index + 2;
    const timezone = text(row.timezone) || settingsTimezone;
    const checkInAt = parseWorkbookDate(row.checkInAt, timezone, "Stays", line, "checkInAt", errors);
    const checkOutAt = parseWorkbookDate(row.checkOutAt, timezone, "Stays", line, "checkOutAt", errors);
    const name = text(row.name);
    const city = text(row.city);
    const country = text(row.country) || "Unknown";
    const address = text(row.address);

    if (!name || !city || !address || !checkInAt || !checkOutAt) {
      errors.push({
        sheet: "Stays",
        row: line,
        message: "name, city, address, checkInAt, and checkOutAt are required."
      });
      return [];
    }

    return [
      {
        sourceKey: text(row.sourceKey) || `stay-${name.toLowerCase().replace(/\s+/g, "-")}`,
        name,
        city,
        country,
        timezone,
        address,
        phone: optionalText(row.phone),
        mapUrl: optionalText(row.mapUrl),
        checkInAt,
        checkOutAt,
        confirmationCode: optionalText(row.confirmationCode),
        notes: optionalText(row.notes)
      }
    ];
  });

  const events = parseSheetRows(workbook, "Events").flatMap((row, index) => {
    const line = index + 2;
    const timezone = text(row.timezone) || settingsTimezone;
    const startAt = parseWorkbookDate(row.startAt, timezone, "Events", line, "startAt", errors);
    const endAt = optionalText(row.endAt)
      ? parseWorkbookDate(row.endAt, timezone, "Events", line, "endAt", errors)
      : undefined;
    const requiredArrivalAt = optionalText(row.requiredArrivalAt)
      ? parseWorkbookDate(
          row.requiredArrivalAt,
          timezone,
          "Events",
          line,
          "requiredArrivalAt",
          errors
        )
      : undefined;
    const title = text(row.title);

    if (!title || !startAt) {
      errors.push({ sheet: "Events", row: line, message: "title and startAt are required." });
      return [];
    }

    return [
      {
        sourceKey: text(row.sourceKey) || `event-${title.toLowerCase().replace(/\s+/g, "-")}`,
        title,
        category: text(row.category) || "Plan",
        timezone,
        location: optionalText(row.location),
        startAt,
        endAt: endAt ?? undefined,
        requiredArrivalAt: requiredArrivalAt ?? undefined,
        requiredLeadMinutes: numberFromCell(row.requiredLeadMinutes),
        wakeLeadMinutes: numberFromCell(row.wakeLeadMinutes),
        notes: optionalText(row.notes)
      }
    ];
  });

  return { settings, flights, stays, events, errors };
};
