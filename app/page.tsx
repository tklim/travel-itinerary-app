import Link from "next/link";

import { logoutAction } from "@/actions";
import { requireTraveler } from "@/auth";
import { buildTravelerDashboard } from "@/itinerary";
import { AppShell, AnswerCards, LastUpdated, PageIntro, ScheduleView, StaySummaryCard, SummaryStats, TravelerNav } from "@/ui";

export default async function HomePage() {
  await requireTraveler();
  const { snapshot, answerCards, tonightStay, schedule } = await buildTravelerDashboard();

  return (
    <AppShell
      title="Travel answers at a glance"
      subtitle="Fast answers for flights, airport runs, hotels, and tomorrow morning."
      eyebrow="Traveler view"
      tripName={snapshot.trip.name}
      nav={<TravelerNav pathname="/" />}
      actions={
        <form action={logoutAction}>
          <button className="button-secondary" type="submit">
            Log out
          </button>
        </form>
      }
    >
      <PageIntro
        title="Keep everyone on the same page."
        body="This dashboard is designed for the family to answer the most common travel questions without digging through long documents or message threads."
        chips={[
          `${snapshot.trip.travelerCount ?? 0} travelers`,
          `${snapshot.flights.length} flights`,
          `${snapshot.stays.length} stays`,
          `Version ${snapshot.version}`
        ]}
      />

      <SummaryStats
        stats={[
          { label: "Trip window", value: "29 May to 5 Jun" },
          { label: "Current timezone", value: snapshot.trip.homeTimezone },
          { label: "Published plan", value: `v${snapshot.trip.publishedVersion}` }
        ]}
      />

      <AnswerCards cards={answerCards} />

      <div className="info-grid">
        <StaySummaryCard stay={tonightStay} />
        <article className="info-card stack">
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <span className="pill">Quick next steps</span>
            <h2 className="section-title">Where to look next</h2>
            <p className="muted">
              Open the full itinerary if you want the detailed day-by-day flow.
            </p>
          </div>
          <div className="pill-row">
            <Link href="/today" className="button">
              Open today
            </Link>
            <Link href="/schedule" className="button-secondary">
              Full schedule
            </Link>
            <Link href="/stay" className="button-secondary">
              Hotel details
            </Link>
          </div>
          <LastUpdated date={snapshot.trip.updatedAt} timezone={snapshot.trip.homeTimezone} />
        </article>
      </div>

      <section className="stack">
        <div className="section-heading">
          <h2 className="section-title">Upcoming itinerary</h2>
          <p className="muted">A simplified timeline for the next couple of days.</p>
        </div>
        <ScheduleView groups={schedule.slice(0, 2)} />
      </section>
    </AppShell>
  );
}
