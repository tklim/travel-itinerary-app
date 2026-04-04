import { logoutAction } from "@/actions";
import { requireTraveler } from "@/auth";
import { getPublishedSnapshot } from "@/itinerary";
import { formatDuration, formatShortDate, formatShortTime } from "@/time";
import { AppShell, CompactPageIntro, EmptyNotice, TravelerNav } from "@/ui";

export default async function FlightsPage() {
  await requireTraveler();
  const snapshot = await getPublishedSnapshot();

  return (
    <AppShell
      title="Flights"
      subtitle="Every flight leg, with local departure and arrival details."
      eyebrow="Traveler view"
      tripName={snapshot.trip.name}
      nav={<TravelerNav pathname="/flights" />}
      actions={
        <form action={logoutAction}>
          <button className="button-secondary" type="submit">
            Log out
          </button>
        </form>
      }
    >
      <CompactPageIntro
        title="Keep the flight plan clear."
        body="Airline details, times, terminals, and transit notes in one tighter view."
        chips={[`${snapshot.flights.length} flights`, snapshot.trip.homeTimezone]}
      />

      {snapshot.flights.length === 0 ? (
        <EmptyNotice
          title="No flights yet"
          body="Once flights are added to the itinerary, they will appear here in order."
        />
      ) : (
        <section className="flight-list">
          {snapshot.flights.map((flight) => (
            <article key={flight.id} className="flight-card">
              <div className="flight-card-header">
                <div className="pill-row">
                  <span className="pill">{formatShortDate(flight.departAt, flight.originTimezone)}</span>
                  <span className="chip warm">{flight.originCode}-{flight.destinationCode}</span>
                </div>
                <p className="muted flight-airline">
                  {flight.airline} {flight.flightNumber}
                </p>
              </div>

              <div className="flight-visual">
                <div className="flight-end flight-end-left">
                  <strong className="flight-time">
                    {formatShortTime(flight.departAt, flight.originTimezone)}
                  </strong>
                  <p className="flight-code">{flight.originCode}</p>
                  <p className="muted flight-place">{flight.originName}</p>
                  <p className="muted flight-subline">
                    {formatShortDate(flight.departAt, flight.originTimezone)}
                  </p>
                </div>

                <div className="flight-center">
                  <div className="flight-duration">{formatDuration(flight.departAt, flight.arriveAt)}</div>
                  <div className="flight-line" aria-hidden="true">
                    <span />
                    <span className="flight-plane">✈</span>
                    <span />
                  </div>
                  <div className="flight-number">{flight.flightNumber}</div>
                </div>

                <div className="flight-end flight-end-right">
                  <strong className="flight-time">
                    {formatShortTime(flight.arriveAt, flight.destinationTimezone)}
                  </strong>
                  <p className="flight-code">{flight.destinationCode}</p>
                  <p className="muted flight-place">{flight.destinationName}</p>
                  <p className="muted flight-subline">
                    {formatShortDate(flight.arriveAt, flight.destinationTimezone)}
                  </p>
                </div>
              </div>

              <div className="flight-meta">
                {flight.terminal ? <span className="chip">Terminal {flight.terminal}</span> : null}
                {flight.confirmationCode ? (
                  <span className="chip">Booking {flight.confirmationCode}</span>
                ) : null}
                {typeof flight.airportLeadMinutes === "number" ? (
                  <span className="chip">{flight.airportLeadMinutes} min airport</span>
                ) : null}
                {typeof flight.wakeLeadMinutes === "number" ? (
                  <span className="chip">{flight.wakeLeadMinutes} min wake</span>
                ) : null}
              </div>

              {flight.notes ? (
                <p className="muted flight-notes">
                  {flight.notes}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      )}
    </AppShell>
  );
}
