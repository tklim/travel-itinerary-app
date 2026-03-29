"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSessionToken, requireAdmin, SESSION_COOKIE_NAME, validatePasscode } from "@/auth";
import { db } from "@/db";
import { parseImportWorkbook } from "@/import-workbook";
import { createDraftRecordId, getPrimaryTrip, publishDraftVersion, replaceDraftData } from "@/itinerary";
import { newLogicalId } from "@/sample-data";
import { parseLocalDateTime } from "@/time";

const stringValue = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

const optionalString = (formData: FormData, key: string) => {
  const value = stringValue(formData, key);
  return value.length > 0 ? value : null;
};

const optionalNumber = (formData: FormData, key: string) => {
  const value = stringValue(formData, key);
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const requiredDateTime = (formData: FormData, key: string, timezone: string) => {
  const value = stringValue(formData, key);
  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return parseLocalDateTime(value, timezone);
};

const optionalDateTime = (formData: FormData, key: string, timezone: string) => {
  const value = stringValue(formData, key);
  if (!value) {
    return null;
  }

  return parseLocalDateTime(value, timezone);
};

const refreshAll = () => {
  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/schedule");
  revalidatePath("/stay");
  revalidatePath("/admin");
  revalidatePath("/admin/flights");
  revalidatePath("/admin/stays");
  revalidatePath("/admin/events");
  revalidatePath("/admin/import");
  revalidatePath("/admin/settings");
};

export async function loginAction(formData: FormData) {
  const passcode = stringValue(formData, "passcode");
  const role = validatePasscode(passcode);

  if (!role) {
    redirect("/login?error=invalid");
  }

  const token = await createSessionToken(role);
  (await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });

  redirect(role === "admin" ? "/admin" : "/");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
  redirect("/login");
}

export async function saveTripSettingsAction(formData: FormData) {
  await requireAdmin();
  const trip = await getPrimaryTrip();

  const homeTimezone = stringValue(formData, "homeTimezone") || trip.homeTimezone;

  await db.trip.update({
    where: { id: trip.id },
    data: {
      name: stringValue(formData, "name") || trip.name,
      travelerCount: optionalNumber(formData, "travelerCount"),
      homeTimezone,
      defaultAirportLeadMinutes: optionalNumber(formData, "defaultAirportLeadMinutes") ?? trip.defaultAirportLeadMinutes,
      defaultWakeMinutes: optionalNumber(formData, "defaultWakeMinutes") ?? trip.defaultWakeMinutes,
      tripStartAt: requiredDateTime(formData, "tripStartAt", homeTimezone),
      tripEndAt: requiredDateTime(formData, "tripEndAt", homeTimezone),
      notes: optionalString(formData, "notes")
    }
  });

  refreshAll();
  redirect("/admin/settings?saved=1");
}

export async function saveFlightAction(formData: FormData) {
  await requireAdmin();
  const trip = await getPrimaryTrip();
  const version = trip.draftVersion;
  const logicalId = stringValue(formData, "logicalId") || createDraftRecordId();
  const originTimezone = stringValue(formData, "originTimezone") || trip.homeTimezone;
  const destinationTimezone = stringValue(formData, "destinationTimezone") || trip.homeTimezone;

  await db.flight.upsert({
    where: {
      tripId_version_logicalId: {
        tripId: trip.id,
        version,
        logicalId
      }
    },
    update: {
      airline: stringValue(formData, "airline"),
      flightNumber: stringValue(formData, "flightNumber"),
      originCode: stringValue(formData, "originCode"),
      originName: stringValue(formData, "originName"),
      originTimezone,
      destinationCode: stringValue(formData, "destinationCode"),
      destinationName: stringValue(formData, "destinationName"),
      destinationTimezone,
      departAt: requiredDateTime(formData, "departAt", originTimezone),
      arriveAt: requiredDateTime(formData, "arriveAt", destinationTimezone),
      terminal: optionalString(formData, "terminal"),
      confirmationCode: optionalString(formData, "confirmationCode"),
      airportLeadMinutes: optionalNumber(formData, "airportLeadMinutes"),
      wakeLeadMinutes: optionalNumber(formData, "wakeLeadMinutes"),
      notes: optionalString(formData, "notes")
    },
    create: {
      logicalId,
      sourceKey: `manual-flight-${logicalId}`,
      tripId: trip.id,
      version,
      airline: stringValue(formData, "airline"),
      flightNumber: stringValue(formData, "flightNumber"),
      originCode: stringValue(formData, "originCode"),
      originName: stringValue(formData, "originName"),
      originTimezone,
      destinationCode: stringValue(formData, "destinationCode"),
      destinationName: stringValue(formData, "destinationName"),
      destinationTimezone,
      departAt: requiredDateTime(formData, "departAt", originTimezone),
      arriveAt: requiredDateTime(formData, "arriveAt", destinationTimezone),
      terminal: optionalString(formData, "terminal"),
      confirmationCode: optionalString(formData, "confirmationCode"),
      airportLeadMinutes: optionalNumber(formData, "airportLeadMinutes"),
      wakeLeadMinutes: optionalNumber(formData, "wakeLeadMinutes"),
      notes: optionalString(formData, "notes")
    }
  });

  refreshAll();
  redirect("/admin/flights?saved=1");
}

export async function deleteFlightAction(formData: FormData) {
  await requireAdmin();
  const trip = await getPrimaryTrip();
  const logicalId = stringValue(formData, "logicalId");

  await db.flight.delete({
    where: {
      tripId_version_logicalId: {
        tripId: trip.id,
        version: trip.draftVersion,
        logicalId
      }
    }
  });

  refreshAll();
  redirect("/admin/flights?deleted=1");
}

export async function saveStayAction(formData: FormData) {
  await requireAdmin();
  const trip = await getPrimaryTrip();
  const version = trip.draftVersion;
  const logicalId = stringValue(formData, "logicalId") || createDraftRecordId();
  const timezone = stringValue(formData, "timezone") || trip.homeTimezone;

  await db.stay.upsert({
    where: {
      tripId_version_logicalId: {
        tripId: trip.id,
        version,
        logicalId
      }
    },
    update: {
      name: stringValue(formData, "name"),
      city: stringValue(formData, "city"),
      country: stringValue(formData, "country"),
      timezone,
      address: stringValue(formData, "address"),
      phone: optionalString(formData, "phone"),
      mapUrl: optionalString(formData, "mapUrl"),
      checkInAt: requiredDateTime(formData, "checkInAt", timezone),
      checkOutAt: requiredDateTime(formData, "checkOutAt", timezone),
      confirmationCode: optionalString(formData, "confirmationCode"),
      notes: optionalString(formData, "notes")
    },
    create: {
      logicalId,
      sourceKey: `manual-stay-${logicalId}`,
      tripId: trip.id,
      version,
      name: stringValue(formData, "name"),
      city: stringValue(formData, "city"),
      country: stringValue(formData, "country"),
      timezone,
      address: stringValue(formData, "address"),
      phone: optionalString(formData, "phone"),
      mapUrl: optionalString(formData, "mapUrl"),
      checkInAt: requiredDateTime(formData, "checkInAt", timezone),
      checkOutAt: requiredDateTime(formData, "checkOutAt", timezone),
      confirmationCode: optionalString(formData, "confirmationCode"),
      notes: optionalString(formData, "notes")
    }
  });

  refreshAll();
  redirect("/admin/stays?saved=1");
}

export async function deleteStayAction(formData: FormData) {
  await requireAdmin();
  const trip = await getPrimaryTrip();
  const logicalId = stringValue(formData, "logicalId");

  await db.stay.delete({
    where: {
      tripId_version_logicalId: {
        tripId: trip.id,
        version: trip.draftVersion,
        logicalId
      }
    }
  });

  refreshAll();
  redirect("/admin/stays?deleted=1");
}

export async function saveEventAction(formData: FormData) {
  await requireAdmin();
  const trip = await getPrimaryTrip();
  const version = trip.draftVersion;
  const logicalId = stringValue(formData, "logicalId") || createDraftRecordId();
  const timezone = stringValue(formData, "timezone") || trip.homeTimezone;

  await db.event.upsert({
    where: {
      tripId_version_logicalId: {
        tripId: trip.id,
        version,
        logicalId
      }
    },
    update: {
      title: stringValue(formData, "title"),
      category: stringValue(formData, "category"),
      timezone,
      location: optionalString(formData, "location"),
      startAt: requiredDateTime(formData, "startAt", timezone),
      endAt: optionalDateTime(formData, "endAt", timezone),
      requiredArrivalAt: optionalDateTime(formData, "requiredArrivalAt", timezone),
      requiredLeadMinutes: optionalNumber(formData, "requiredLeadMinutes"),
      wakeLeadMinutes: optionalNumber(formData, "wakeLeadMinutes"),
      notes: optionalString(formData, "notes")
    },
    create: {
      logicalId,
      sourceKey: `manual-event-${logicalId}`,
      tripId: trip.id,
      version,
      title: stringValue(formData, "title"),
      category: stringValue(formData, "category"),
      timezone,
      location: optionalString(formData, "location"),
      startAt: requiredDateTime(formData, "startAt", timezone),
      endAt: optionalDateTime(formData, "endAt", timezone),
      requiredArrivalAt: optionalDateTime(formData, "requiredArrivalAt", timezone),
      requiredLeadMinutes: optionalNumber(formData, "requiredLeadMinutes"),
      wakeLeadMinutes: optionalNumber(formData, "wakeLeadMinutes"),
      notes: optionalString(formData, "notes")
    }
  });

  refreshAll();
  redirect("/admin/events?saved=1");
}

export async function deleteEventAction(formData: FormData) {
  await requireAdmin();
  const trip = await getPrimaryTrip();
  const logicalId = stringValue(formData, "logicalId");

  await db.event.delete({
    where: {
      tripId_version_logicalId: {
        tripId: trip.id,
        version: trip.draftVersion,
        logicalId
      }
    }
  });

  refreshAll();
  redirect("/admin/events?deleted=1");
}

export async function publishDraftAction() {
  await requireAdmin();
  await publishDraftVersion();
  refreshAll();
  redirect("/admin?published=1");
}

export async function importWorkbookAction(formData: FormData) {
  await requireAdmin();
  const trip = await getPrimaryTrip();
  const file = formData.get("workbook");

  if (!(file instanceof File)) {
    redirect("/admin/import?error=nofile");
  }

  const parsed = parseImportWorkbook(await file.arrayBuffer());

  if (parsed.errors.length > 0) {
    await db.importBatch.create({
      data: {
        tripId: trip.id,
        version: trip.draftVersion,
        filename: file.name,
        status: "FAILED",
        summaryJson: JSON.stringify(parsed.errors)
      }
    });

    refreshAll();
    redirect("/admin/import?error=validation");
  }

  if (parsed.settings) {
    await db.trip.update({
      where: { id: trip.id },
      data: {
        name: parsed.settings.name,
        homeTimezone: parsed.settings.homeTimezone,
        defaultAirportLeadMinutes: parsed.settings.defaultAirportLeadMinutes,
        defaultWakeMinutes: parsed.settings.defaultWakeMinutes,
        travelerCount: parsed.settings.travelerCount,
        tripStartAt: parsed.settings.tripStartAt,
        tripEndAt: parsed.settings.tripEndAt,
        notes: parsed.settings.notes
      }
    });
  }

  await replaceDraftData(trip.draftVersion, {
    flights: parsed.flights.map((flight) => ({
      ...flight,
      logicalId: newLogicalId(),
      tripId: trip.id,
      version: trip.draftVersion
    })),
    stays: parsed.stays.map((stay) => ({
      ...stay,
      logicalId: newLogicalId(),
      tripId: trip.id,
      version: trip.draftVersion
    })),
    events: parsed.events.map((event) => ({
      ...event,
      logicalId: newLogicalId(),
      tripId: trip.id,
      version: trip.draftVersion
    }))
  });

  await db.importBatch.create({
    data: {
      tripId: trip.id,
      version: trip.draftVersion,
      filename: file.name,
      status: "SUCCESS",
      summaryJson: JSON.stringify({
        flights: parsed.flights.length,
        stays: parsed.stays.length,
        events: parsed.events.length
      })
    }
  });

  refreshAll();
  redirect("/admin/import?imported=1");
}
