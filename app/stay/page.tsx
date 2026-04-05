import Link from "next/link";

import { logoutAction } from "@/actions";
import { requireTraveler } from "@/auth";
import { getPublishedSnapshot } from "@/itinerary";
import { AppShell, CompactPageIntro, LogoutButton, TravelerNav } from "@/ui";
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
          <LogoutButton />
        </form>
      }
    >
      <CompactPageIntro
        title="Know where you're sleeping tonight."
        body="Addresses, check-in windows, and map links stay together in one compact view."
        chips={[`${snapshot.stays.length} stays`, snapshot.trip.homeTimezone]}
      />

      {currentStay ? (
        <article className="stay-highlight">
          <div className="pill-row">
            <span className="pill">Where are we staying?</span>
            <span className="chip">Tonight</span>
          </div>
          <h2 className="stay-card-title">{currentStay.name}</h2>
          <p className="muted" style={{ margin: 0 }}>
            Current or next stay in {currentStay.city}.
          </p>
          <p style={{ margin: 0 }}>{currentStay.address}</p>
          <div className="stay-card-meta">
            <p className="muted" style={{ margin: 0 }}>
              Check in: {formatDateTime(currentStay.checkInAt, currentStay.timezone)}
            </p>
            <p className="muted" style={{ margin: 0 }}>
              Check out: {formatDateTime(currentStay.checkOutAt, currentStay.timezone)}
            </p>
          </div>
          <div className="pill-row">
            <span className="chip">{currentStay.timezone}</span>
            {currentStay.mapUrl ? (
              <a className="button-secondary" href={currentStay.mapUrl} target="_blank" rel="noreferrer">
                Open map
              </a>
            ) : null}
          </div>
        </article>
      ) : null}

      <section className="stay-list">
        {snapshot.stays.map((stay) => (
          <article key={stay.id} className="stay-card">
            <div className="pill-row">
              <span className="pill">{stay.city}</span>
              <span className="chip">{stay.timezone}</span>
            </div>
            <h2 className="stay-card-title">{stay.name}</h2>
            <p className="muted" style={{ margin: 0 }}>
              {stay.city}, {stay.country}
            </p>
            <p style={{ margin: 0 }}>{stay.address}</p>
            <div className="stay-card-meta">
              <p className="muted" style={{ margin: 0 }}>
                Check in {formatDateTime(stay.checkInAt, stay.timezone)}
              </p>
              <p className="muted" style={{ margin: 0 }}>
                Check out {formatDateTime(stay.checkOutAt, stay.timezone)}
              </p>
            </div>
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
