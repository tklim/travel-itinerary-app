import { addMinutes, differenceInCalendarDays, differenceInMinutes, format, isSameDay } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";

const parseLocalDateTimeParts = (value: string) => {
  const match =
    /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2})$/.exec(
      value
    );

  if (!match?.groups) {
    throw new RangeError(`Invalid local datetime: ${value}`);
  }

  return {
    year: Number(match.groups.year),
    month: Number(match.groups.month),
    day: Number(match.groups.day),
    hour: Number(match.groups.hour),
    minute: Number(match.groups.minute)
  };
};

export const parseLocalDateTime = (value: string, timezone: string) => {
  const { year, month, day, hour, minute } = parseLocalDateTimeParts(value);

  return fromZonedTime(new Date(year, month - 1, day, hour, minute), timezone);
};

export const toDatetimeLocalValue = (date: Date, timezone: string) =>
  formatInTimeZone(date, timezone, "yyyy-MM-dd'T'HH:mm");

export const formatDateTime = (
  date: Date,
  timezone: string,
  pattern = "EEE d MMM, h:mm a"
) => formatInTimeZone(date, timezone, pattern);

export const formatShortTime = (date: Date, timezone: string) =>
  formatInTimeZone(date, timezone, "h:mm a");

export const formatShortDate = (date: Date, timezone: string) =>
  formatInTimeZone(date, timezone, "EEE d MMM");

export const formatDuration = (start: Date, end: Date) => {
  const totalMinutes = Math.max(differenceInMinutes(end, start), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
};

export const formatDateLabel = (date: Date, timezone: string) =>
  formatInTimeZone(date, timezone, "EEEE d MMMM");

export const formatDateRange = (start: Date, end: Date, timezone: string) => {
  const startMonth = formatInTimeZone(start, timezone, "MMM");
  const endMonth = formatInTimeZone(end, timezone, "MMM");
  const startYear = formatInTimeZone(start, timezone, "yyyy");
  const endYear = formatInTimeZone(end, timezone, "yyyy");

  if (startYear === endYear && startMonth === endMonth) {
    return `${formatInTimeZone(start, timezone, "d")} to ${formatInTimeZone(
      end,
      timezone,
      "d MMM"
    )}`;
  }

  if (startYear === endYear) {
    return `${formatInTimeZone(start, timezone, "d MMM")} to ${formatInTimeZone(
      end,
      timezone,
      "d MMM"
    )}`;
  }

  return `${formatInTimeZone(start, timezone, "d MMM yyyy")} to ${formatInTimeZone(
    end,
    timezone,
    "d MMM yyyy"
  )}`;
};

export const zonedDayKey = (date: Date, timezone: string) =>
  formatInTimeZone(date, timezone, "yyyy-MM-dd");

export const formatRelativeDayLabel = (
  date: Date,
  timezone: string,
  now = new Date()
) => {
  const zonedDate = toZonedTime(date, timezone);
  const zonedNow = toZonedTime(now, timezone);

  if (isSameDay(zonedDate, zonedNow)) {
    return "Today";
  }

  const daysDiff = differenceInCalendarDays(zonedDate, zonedNow);
  if (daysDiff === 1) {
    return "Tomorrow";
  }

  if (daysDiff === -1) {
    return "Yesterday";
  }

  return format(zonedDate, "EEE d MMM");
};

export const addLeadMinutes = (date: Date, minutes: number) => addMinutes(date, -minutes);
