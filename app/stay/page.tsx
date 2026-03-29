import Link from "next/link";

import { logoutAction } from "@/actions";
import { requireTraveler } from "@/auth";
import { getPublishedSnapshot } from "@/itinerary";
import { AppShell, PageIntro, StaySummaryCard, TravelerNav } from "@/ui";
import { formatDateTime } from "@/time";

export default async function StayPage() {
  await requireTraveler();
  const snapshot = await getPublishedSnapshot();
  const currentStay =
    snapshot.stays.find((stay) => stay.checkInAt <= new Date() && new Date() < stay.checkOutAt) ??
    snapshot.stays.find((stay) => stay.checkOutAt > new Date()) ??
    snapshot.stays[0];

  return (
    <AppShell
      title="Stay details"
      subtitle="Hotel and apartment details for tonight and the rest of the trip."
      eyebrow="Traveler view"
      tripName={snapshot.trip.name}
      nav={<TravelerNav pathname="/stay" />}
      actions={
        <form action={logoutAction}>
          <button className="button-secondary" type="submit">
            Log out
          </button>
        </form>
      }
    >
      <PageIntro
        title="Know where you're sleeping tonight."
        body="This page keeps addresses, check-in windows, and map links together so nobody has to search through booking emails."
        chips={[`${snapshot.stays.length} stays`, snapshot.trip.homeTimezone]}
      />

      {currentStay ? (
        <StaySummaryCard
          stay={{
            status: "active",
            name: currentStay.name,
            city: currentStay.city,
            timezone: currentStay.timezone,
            headline: `Current or next stay in ${currentStay.city}.`,
            address: currentStay.address,
            phone: currentStay.phone,
            mapUrl: currentStay.mapUrl,
            checkInText: `Check in: ${formatDateTime(currentStay.checkInAt, currentStay.timezone)}`,
            checkOutText: `Check out: ${formatDateTime(currentStay.checkOutAt, currentStay.timezone)}`,
            notes: currentStay.notes
          }}
        />
      ) : null}

      <section className="stack">
        {snapshot.stays.map((stay) => (
          <article key={stay.id} className="info-card stack">
            <div className="day-heading">
              <div>
                <h2 className="section-title">{stay.name}</h2>
                <p className="muted">
                  {stay.city}, {stay.country}
                </p>
              </div>
              <span className="chip">{stay.timezone}</span>
            </div>
            <p style={{ margin: 0 }}>{stay.address}</p>
            <p className="muted" style={{ margin: 0 }}>
              Check in {formatDateTime(stay.checkInAt, stay.timezone)}
            </p>
            <p className="muted" style={{ margin: 0 }}>
              Check out {formatDateTime(stay.checkOutAt, stay.timezone)}
            </p>
            <div className="pill-row">
              {stay.mapUrl ? (
                <a href={stay.mapUrl} className="button-secondary" target="_blank" rel="noreferrer">
                  Open map
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
