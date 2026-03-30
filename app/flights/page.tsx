import { logoutAction } from "@/actions";
import { requireTraveler } from "@/auth";
import { getPublishedSnapshot } from "@/itinerary";
import { formatDateTime } from "@/time";
import { AppShell, EmptyNotice, PageIntro, TravelerNav } from "@/ui";

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
      <PageIntro
        title="Keep the flight plan clear."
        body="Use this page for airline details, terminals, departure and arrival times, and transit notes across every leg of the trip."
        chips={[`${snapshot.flights.length} flights`, snapshot.trip.homeTimezone]}
      />

      {snapshot.flights.length === 0 ? (
        <EmptyNotice
          title="No flights yet"
          body="Once flights are added to the itinerary, they will appear here in order."
        />
      ) : (
        <section className="stack">
          {snapshot.flights.map((flight) => (
            <article key={flight.id} className="info-card stack">
              <div className="day-heading">
                <div>
                  <h2 className="section-title" style={{ marginBottom: 6 }}>
                    {flight.originCode} to {flight.destinationCode}
                  </h2>
                  <p className="muted" style={{ margin: 0 }}>
                    {flight.airline} {flight.flightNumber}
                  </p>
                </div>
                <span className="chip warm">Flight</span>
              </div>

              <div className="info-grid">
                <div className="stack" style={{ gap: 6 }}>
                  <span className="pill">Departure</span>
                  <strong>{formatDateTime(flight.departAt, flight.originTimezone)}</strong>
                  <p className="muted" style={{ margin: 0 }}>
                    {flight.originName} ({flight.originCode})
                  </p>
                  <p className="muted" style={{ margin: 0 }}>
                    {flight.originTimezone}
                  </p>
                  {flight.terminal ? (
                    <p className="muted" style={{ margin: 0 }}>
                      Terminal: {flight.terminal}
                    </p>
                  ) : null}
                </div>

                <div className="stack" style={{ gap: 6 }}>
                  <span className="pill">Arrival</span>
                  <strong>{formatDateTime(flight.arriveAt, flight.destinationTimezone)}</strong>
                  <p className="muted" style={{ margin: 0 }}>
                    {flight.destinationName} ({flight.destinationCode})
                  </p>
                  <p className="muted" style={{ margin: 0 }}>
                    {flight.destinationTimezone}
                  </p>
                </div>
              </div>

              <div className="pill-row">
                {flight.confirmationCode ? (
                  <span className="chip">Booking {flight.confirmationCode}</span>
                ) : null}
                {typeof flight.airportLeadMinutes === "number" ? (
                  <span className="chip">{flight.airportLeadMinutes} min airport buffer</span>
                ) : null}
                {typeof flight.wakeLeadMinutes === "number" ? (
                  <span className="chip">{flight.wakeLeadMinutes} min wake buffer</span>
                ) : null}
              </div>

              {flight.notes ? (
                <p className="muted" style={{ margin: 0 }}>
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
