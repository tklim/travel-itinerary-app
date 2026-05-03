import * as XLSX from "xlsx";

import { parseImportWorkbook } from "@/import-workbook";

const buildWorkbook = () => {
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([
      {
        name: "Family Trip",
        homeTimezone: "Europe/Madrid",
        defaultAirportLeadMinutes: 180,
        defaultWakeMinutes: 90,
        travelerCount: 5,
        tripStartAt: "2026-05-29T08:00",
        tripEndAt: "2026-06-05T11:00",
        notes: "Seed workbook"
      }
    ]),
    "Settings"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([
      {
        sourceKey: "flight-1",
        airline: "Booked Flight",
        flightNumber: "TBC-001",
        originCode: "BCN",
        originName: "Barcelona",
        originTimezone: "Europe/Madrid",
        destinationCode: "OPO",
        destinationName: "Porto",
        destinationTimezone: "Europe/Lisbon",
        departAt: "2026-06-01T16:00",
        arriveAt: "2026-06-01T17:00"
      }
    ]),
    "Flights"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([
      {
        sourceKey: "stay-1",
        name: "Porto Riverside Suites",
        city: "Porto",
        country: "Portugal",
        timezone: "Europe/Lisbon",
        address: "Ribeira",
        checkInAt: "2026-06-01T19:00",
        checkOutAt: "2026-06-04T11:00"
      }
    ]),
    "Stays"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([
      {
        sourceKey: "event-1",
        title: "Food tour",
        category: "Food",
        timezone: "Europe/Lisbon",
        location: "Mercado do Bolhao",
        startAt: "2026-06-02T09:00"
      }
    ]),
    "Events"
  );

  return XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
};

describe("parseImportWorkbook", () => {
  it("parses a valid workbook", () => {
    const parsed = parseImportWorkbook(buildWorkbook());

    expect(parsed.errors).toHaveLength(0);
    expect(parsed.flights).toHaveLength(1);
    expect(parsed.stays).toHaveLength(1);
    expect(parsed.events).toHaveLength(1);
    expect(parsed.settings?.name).toBe("Family Trip");
  });

  it("preserves multiline notes from Excel-style line endings", () => {
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet([
        {
          name: "Family Trip",
          homeTimezone: "Europe/Madrid",
          defaultAirportLeadMinutes: 180,
          defaultWakeMinutes: 90,
          tripStartAt: "2026-05-29T08:00",
          tripEndAt: "2026-06-05T11:00"
        }
      ]),
      "Settings"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet([
        {
          sourceKey: "flight-1",
          airline: "Booked Flight",
          flightNumber: "TBC-001",
          originCode: "BCN",
          originTimezone: "Europe/Madrid",
          destinationCode: "OPO",
          destinationTimezone: "Europe/Lisbon",
          departAt: "2026-06-01T16:00",
          arriveAt: "2026-06-01T17:00"
        }
      ]),
      "Flights"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet([
        {
          sourceKey: "stay-1",
          name: "Porto Riverside Suites",
          city: "Porto",
          address: "Ribeira",
          timezone: "Europe/Lisbon",
          checkInAt: "2026-06-01T19:00",
          checkOutAt: "2026-06-04T11:00"
        }
      ]),
      "Stays"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet([
        {
          sourceKey: "event-1",
          title: "Food tour",
          category: "Food",
          timezone: "Europe/Lisbon",
          location: "Mercado do Bolhao",
          startAt: "2026-06-02T09:00",
          notes: "Line 1\r\nLine 2\r\nLine 3"
        }
      ]),
      "Events"
    );

    const parsed = parseImportWorkbook(
      XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer
    );

    expect(parsed.errors).toHaveLength(0);
    expect(parsed.events[0]?.notes).toBe("Line 1\nLine 2\nLine 3");
  });

  it("reports missing sheets", () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([]), "Settings");

    const parsed = parseImportWorkbook(
      XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer
    );

    expect(parsed.errors.some((error) => error.sheet === "Flights")).toBe(true);
    expect(parsed.errors.some((error) => error.sheet === "Stays")).toBe(true);
    expect(parsed.errors.some((error) => error.sheet === "Events")).toBe(true);
  });
});
