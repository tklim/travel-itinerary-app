import type { Stay } from "@prisma/client";

import { logoutAction } from "@/actions";
import { requireTraveler } from "@/auth";
import { getPublishedSnapshot } from "@/itinerary";
import { AppShell, CompactPageIntro, LogoutButton, TravelerNav } from "@/ui";
import { formatDateTime } from "@/time";

const formatStayDayNumber = (date: Date, timezone: string) => formatDateTime(date, timezone, "d");
const formatStayMonth = (date: Date, timezone: string) => formatDateTime(date, timezone, "MMM").toUpperCase();
const formatStayWeekday = (date: Date, timezone: string) => formatDateTime(date, timezone, "EEEE");
const formatStayTime = (date: Date, timezone: string) => formatDateTime(date, timezone, "h:mm a");

function StayDateCard({
  label,
  date,
  timezone
}: {
  label: string;
  date: Date;
  timezone: string;
}) {
  return (
    <div className="stay-date-card">
      <span className="stay-date-label">{label}</span>
      <strong className="stay-date-number">{formatStayDayNumber(date, timezone)}</strong>
      <span className="stay-date-month">{formatStayMonth(date, timezone)}</span>
      <span className="stay-date-weekday">{formatStayWeekday(date, timezone)}</span>
      <div className="stay-date-time-row">
        <span className="stay-date-time">{formatStayTime(date, timezone)}</span>
      </div>
    </div>
  );
}

function StayMetaBlock({
  value,
  tone = "default",
  compact = false
}: {
  value?: string | null;
  tone?: "default" | "note";
  compact?: boolean;
}) {
  if (!value) {
    return null;
  }

  return (
    <div
      className={`stay-meta-block${compact ? " stay-meta-block-compact" : ""}${tone === "note" ? " stay-meta-block-note" : ""}`}
    >
      <p className={`stay-meta-value${compact ? " stay-meta-value-compact" : ""}`}>{value}</p>
    </div>
  );
}

function StayReservationCard({
  stay,
  emphasis
}: {
  stay: Stay;
  emphasis?: "highlight" | "default";
}) {
  const isHighlight = emphasis === "highlight";

  return (
    <article className={isHighlight ? "stay-highlight stay-reservation-card" : "stay-card stay-reservation-card"}>
      <div className="stay-reservation-shell">
        <div className="stay-reservation-main">
          <div className="pill-row">
            <span className="pill">{stay.city}</span>
            <span className="chip">{stay.timezone}</span>
            {isHighlight ? <span className="chip warm">Tonight</span> : null}
          </div>
          <div className="stay-reservation-copy">
            <h2 className="stay-card-title">{stay.name}</h2>
            <p className="muted" style={{ margin: 0 }}>
              {stay.city}, {stay.country}
            </p>
          </div>
          <div className="stay-reservation-dates">
            <StayDateCard label="Check-in" date={stay.checkInAt} timezone={stay.timezone} />
            <StayDateCard label="Check-out" date={stay.checkOutAt} timezone={stay.timezone} />
          </div>
          <div className="stay-meta-stack">
            <StayMetaBlock
              value={stay.phone ? `${stay.address}  •  ${stay.phone}` : stay.address}
            />
            <StayMetaBlock value={stay.confirmationCode} compact />
            <StayMetaBlock value={stay.notes ? `NOTES: ${stay.notes}` : null} tone="note" compact />
          </div>
        </div>
      </div>

      <div className="stay-card-footer">
        {stay.mapUrl ? (
          <a href={stay.mapUrl} className="button-secondary" target="_blank" rel="noreferrer">
            Open map
          </a>
        ) : null}
      </div>
    </article>
  );
}

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
        body="Addresses, check-in windows, booking details, and map links stay together in one clearer stay summary."
        chips={[`${snapshot.stays.length} stays`, snapshot.trip.homeTimezone]}
      />

      {currentStay ? (
        <section className="stack" style={{ gap: 12 }}>
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <div className="pill-row">
              <span className="pill">Where are we staying?</span>
              <span className="chip warm">
                {currentStay.checkInAt <= new Date() && new Date() < currentStay.checkOutAt ? "Tonight" : "Next stay"}
              </span>
            </div>
            <p className="muted">Current or next stay, with the key booking details in one place.</p>
          </div>
          <StayReservationCard stay={currentStay} emphasis="highlight" />
        </section>
      ) : null}

      <section className="stay-list">
        {snapshot.stays.map((stay) => (
          <StayReservationCard key={stay.id} stay={stay} />
        ))}
      </section>
    </AppShell>
  );
}
