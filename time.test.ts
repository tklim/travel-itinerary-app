import { formatRelativeDayLabel, parseLocalDateTime, zonedDayKey } from "@/time";

describe("time helpers", () => {
  it("builds timezone-aware day keys", () => {
    const date = parseLocalDateTime("2026-06-01T16:00", "Europe/Madrid");
    expect(zonedDayKey(date, "Europe/Madrid")).toBe("2026-06-01");
  });

  it("returns Today and Tomorrow labels correctly", () => {
    const now = parseLocalDateTime("2026-06-01T08:00", "Europe/Madrid");
    const today = parseLocalDateTime("2026-06-01T20:00", "Europe/Madrid");
    const tomorrow = parseLocalDateTime("2026-06-02T07:00", "Europe/Madrid");

    expect(formatRelativeDayLabel(today, "Europe/Madrid", now)).toBe("Today");
    expect(formatRelativeDayLabel(tomorrow, "Europe/Madrid", now)).toBe("Tomorrow");
  });
});
