import Link from "next/link";
import { notFound } from "next/navigation";

import { importWorkbookAction, logoutAction, publishDraftAction, saveTripSettingsAction } from "@/actions";
import { EventEditor, FlightEditor, StayEditor } from "@/admin-forms";
import { getDraftSnapshot, getPrimaryTrip } from "@/itinerary";
import { workbookTemplatePreview } from "@/sample-data";
import { toDatetimeLocalValue } from "@/time";
import { AdminNav, AdminSummaryCards, AppShell, LastUpdated, PageIntro } from "@/ui";

const safeParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export async function AdminPanel({ subpage = "overview" }: { subpage?: string }) {
  if (subpage === "overview") {
    const snapshot = await getDraftSnapshot();

    return (
      <AppShell
        title="Admin overview"
        subtitle="Manage the draft itinerary before publishing it to travelers."
        eyebrow="Organizer view"
        tripName={snapshot.trip.name}
        nav={<AdminNav pathname="/admin" />}
        actions={
          <div className="pill-row">
            <form action={logoutAction}>
              <button className="button-secondary" type="submit">
                Log out
              </button>
            </form>
          </div>
        }
      >
        <PageIntro
          title="Draft first, publish when ready."
          body="Organizers edit the draft version here. Travelers only see the published version, so you can prepare changes safely before making them live."
          chips={[
            `Published v${snapshot.trip.publishedVersion}`,
            `Draft v${snapshot.trip.draftVersion}`,
            snapshot.trip.homeTimezone
          ]}
        />

        <AdminSummaryCards
          counts={[
            {
              label: "Flights in draft",
              value: String(snapshot.flights.length),
              note: "Airport timing and wake-up answers depend on these."
            },
            {
              label: "Stays in draft",
              value: String(snapshot.stays.length),
              note: "Tonight's hotel is resolved from these stay windows."
            },
            {
              label: "Events in draft",
              value: String(snapshot.events.length),
              note: "These populate the grouped daily timeline."
            }
          ]}
        />

        <div className="info-grid">
          <article className="info-card stack">
            <div className="section-heading" style={{ marginBottom: 0 }}>
              <span className="pill">Publish</span>
              <h2 className="section-title">Send the draft live</h2>
              <p className="muted">
                Publishing promotes the current draft to travelers and creates a fresh draft version for the next set of edits.
              </p>
            </div>
            <form action={publishDraftAction}>
              <button className="button" type="submit">
                Publish current draft
              </button>
            </form>
            <LastUpdated date={snapshot.trip.updatedAt} timezone={snapshot.trip.homeTimezone} />
          </article>

          <article className="info-card stack">
            <div className="section-heading" style={{ marginBottom: 0 }}>
              <span className="pill">Shortcuts</span>
              <h2 className="section-title">Common organizer tasks</h2>
              <p className="muted">Open the section you want to update.</p>
            </div>
            <div className="pill-row">
              <Link href="/admin/import" className="button">
                Import workbook
              </Link>
              <Link href="/admin/flights" className="button-secondary">
                Edit flights
              </Link>
              <Link href="/admin/stays" className="button-secondary">
                Edit stays
              </Link>
              <Link href="/admin/events" className="button-secondary">
                Edit events
              </Link>
            </div>
          </article>
        </div>

        <section className="stack">
          <div className="section-heading">
            <h2 className="section-title">Recent imports</h2>
            <p className="muted">Latest workbook runs and their results.</p>
          </div>
          {snapshot.importBatches?.map((batch) => (
            <article key={batch.id} className="info-card stack">
              <div className="day-heading">
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    {batch.filename}
                  </h3>
                  <p className="muted" style={{ margin: "6px 0 0" }}>
                    {batch.status} on version {batch.version}
                  </p>
                </div>
                <span className={`chip ${batch.status === "FAILED" ? "rose" : ""}`}>{batch.status}</span>
              </div>
              <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(safeParse(batch.summaryJson), null, 2)}
              </pre>
            </article>
          ))}
        </section>
      </AppShell>
    );
  }

  if (subpage === "settings") {
    const trip = await getPrimaryTrip();

    return (
      <AppShell
        title="Settings"
        subtitle="Trip-wide defaults and timing rules."
        eyebrow="Organizer view"
        tripName={trip.name}
        nav={<AdminNav pathname="/admin/settings" />}
        actions={
          <form action={logoutAction}>
            <button className="button-secondary" type="submit">
              Log out
            </button>
          </form>
        }
      >
        <PageIntro
          title="Trip-wide timing defaults"
          body="These settings drive the fallback airport and wake-up timings whenever a flight or event does not override them."
          chips={[`Published v${trip.publishedVersion}`, `Draft v${trip.draftVersion}`]}
        />

        <article className="form-card stack">
          <form action={saveTripSettingsAction} className="form-stack">
            <div className="two-up">
              <label className="label">
                Trip name
                <input className="input" name="name" defaultValue={trip.name} required />
              </label>
              <label className="label">
                Traveler count
                <input className="input" name="travelerCount" type="number" defaultValue={trip.travelerCount ?? ""} />
              </label>
            </div>
            <div className="two-up">
              <label className="label">
                Home timezone
                <input className="input" name="homeTimezone" defaultValue={trip.homeTimezone} required />
              </label>
              <label className="label">
                Airport lead minutes
                <input
                  className="input"
                  name="defaultAirportLeadMinutes"
                  type="number"
                  defaultValue={trip.defaultAirportLeadMinutes}
                  required
                />
              </label>
            </div>
            <div className="two-up">
              <label className="label">
                Wake lead minutes
                <input
                  className="input"
                  name="defaultWakeMinutes"
                  type="number"
                  defaultValue={trip.defaultWakeMinutes}
                  required
                />
              </label>
              <div />
            </div>
            <div className="two-up">
              <label className="label">
                Trip start
                <input
                  className="input"
                  type="datetime-local"
                  name="tripStartAt"
                  defaultValue={toDatetimeLocalValue(trip.tripStartAt, trip.homeTimezone)}
                  required
                />
              </label>
              <label className="label">
                Trip end
                <input
                  className="input"
                  type="datetime-local"
                  name="tripEndAt"
                  defaultValue={toDatetimeLocalValue(trip.tripEndAt, trip.homeTimezone)}
                  required
                />
              </label>
            </div>
            <label className="label">
              Notes
              <textarea className="textarea" name="notes" defaultValue={trip.notes ?? ""} />
            </label>
            <button className="button" type="submit">
              Save settings
            </button>
          </form>
        </article>
      </AppShell>
    );
  }

  if (subpage === "flights" || subpage === "stays" || subpage === "events") {
    const snapshot = await getDraftSnapshot();

    return (
      <AppShell
        title={subpage[0].toUpperCase() + subpage.slice(1)}
        subtitle="Edit the current draft version."
        eyebrow="Organizer view"
        tripName={snapshot.trip.name}
        nav={<AdminNav pathname={`/admin/${subpage}`} />}
        actions={
          <form action={logoutAction}>
            <button className="button-secondary" type="submit">
              Log out
            </button>
          </form>
        }
      >
        <PageIntro
          title={
            subpage === "flights"
              ? "Flights drive the urgent answers."
              : subpage === "stays"
                ? "Keep tonight's hotel accurate."
                : "Shape the day-by-day plan."
          }
          body={
            subpage === "flights"
              ? "The traveler dashboard uses these records to answer what time the flight is and when the group should leave for the airport."
              : subpage === "stays"
                ? "These stay windows resolve where the group is sleeping tonight, next check-in times, and useful hotel details."
                : "Use events for anything that belongs on the itinerary timeline and for wake-up logic that is not purely flight-based."
          }
          chips={[
            subpage === "flights"
              ? `${snapshot.flights.length} flights in draft`
              : subpage === "stays"
                ? `${snapshot.stays.length} stays in draft`
                : `${snapshot.events.length} events in draft`
          ]}
        />
        {subpage === "flights" ? <FlightEditor trip={snapshot.trip} /> : null}
        {subpage === "stays" ? <StayEditor trip={snapshot.trip} /> : null}
        {subpage === "events" ? <EventEditor trip={snapshot.trip} /> : null}
        <section className="stack">
          {subpage === "flights"
            ? snapshot.flights.map((flight) => (
                <FlightEditor key={flight.id} trip={snapshot.trip} flight={flight} />
              ))
            : null}
          {subpage === "stays"
            ? snapshot.stays.map((stay) => <StayEditor key={stay.id} trip={snapshot.trip} stay={stay} />)
            : null}
          {subpage === "events"
            ? snapshot.events.map((event) => (
                <EventEditor key={event.id} trip={snapshot.trip} event={event} />
              ))
            : null}
        </section>
      </AppShell>
    );
  }

  if (subpage === "import") {
    const snapshot = await getDraftSnapshot();

    return (
      <AppShell
        title="Import workbook"
        subtitle="Replace the draft itinerary from one spreadsheet workbook."
        eyebrow="Organizer view"
        tripName={snapshot.trip.name}
        nav={<AdminNav pathname="/admin/import" />}
        actions={
          <form action={logoutAction}>
            <button className="button-secondary" type="submit">
              Log out
            </button>
          </form>
        }
      >
        <PageIntro
          title="Spreadsheet-first updates"
          body="Upload one workbook with Flights, Stays, Events, and Settings sheets. The app validates it, records the result, and replaces the current draft only when the workbook passes validation."
          chips={["Flights", "Stays", "Events", "Settings"]}
        />

        <article className="form-card stack">
          <form action={importWorkbookAction} className="form-stack">
            <label className="label">
              Workbook file
              <input className="input" type="file" name="workbook" accept=".xlsx,.xls,.csv" required />
            </label>
            <div className="pill-row">
              <button className="button" type="submit">
                Validate and import
              </button>
              <a
                className="button-secondary"
                href="/templates/barcelona-porto-multi-timezone-template-partial-updated-from-screenshot.xlsx"
                download
              >
                Download current template
              </a>
            </div>
          </form>
        </article>

        <article className="info-card stack">
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <h2 className="section-title">Expected workbook shape</h2>
            <p className="muted">Use these sheet names and column families when preparing the import file.</p>
          </div>
          <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{`Settings: name, homeTimezone, defaultAirportLeadMinutes, defaultWakeMinutes, travelerCount, tripStartAt, tripEndAt, notes
Flights: sourceKey, airline, flightNumber, originCode, originName, originTimezone, destinationCode, destinationName, destinationTimezone, departAt, arriveAt, terminal, confirmationCode, airportLeadMinutes, wakeLeadMinutes, notes
Stays: sourceKey, name, city, country, timezone, address, phone, mapUrl, checkInAt, checkOutAt, confirmationCode, notes
Events: sourceKey, title, category, timezone, location, startAt, endAt, requiredArrivalAt, requiredLeadMinutes, wakeLeadMinutes, notes`}
          </pre>
        </article>

        <article className="info-card stack">
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <h2 className="section-title">Seed preview</h2>
            <p className="muted">The current project seed follows the same contract.</p>
          </div>
          <pre className="mono" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(
              {
                settings: workbookTemplatePreview.settings,
                flights: workbookTemplatePreview.flights.slice(0, 1),
                stays: workbookTemplatePreview.stays.slice(0, 1),
                events: workbookTemplatePreview.events.slice(0, 2)
              },
              null,
              2
            )}
          </pre>
        </article>
      </AppShell>
    );
  }

  notFound();
}
