import { logoutAction } from "@/actions";
import { requireTraveler } from "@/auth";
import { buildTravelerDashboard } from "@/itinerary";
import { formatShortTime } from "@/time";
import { AppShell, CompactPageIntro, LogoutButton, TravelerNav } from "@/ui";

export default async function TodayPage() {
  await requireTraveler();
  const { snapshot, answerCards, schedule } = await buildTravelerDashboard();
  const currentGroup = schedule.find((group) => group.label === "Today") ?? schedule[0];
  const orderedItems = currentGroup
    ? [...currentGroup.items].sort((a, b) => a.startAt.getTime() - b.startAt.getTime())
    : [];
  const heroTitle = currentGroup?.label === "Today" ? "Today" : "Next travel day";

  return (
    <AppShell
      title="Today"
      subtitle="The clearest view of what matters right now."
      eyebrow="Traveler view"
      tripName={snapshot.trip.name}
      nav={<TravelerNav pathname="/today" />}
      actions={
        <form action={logoutAction}>
          <LogoutButton />
        </form>
      }
    >
      <CompactPageIntro
        title={heroTitle}
        detail={currentGroup?.dateText ?? "Today"}
        body="Use this page when someone asks what is happening now, what comes next, or whether tomorrow starts early."
        chips={currentGroup ? [currentGroup.dateText, currentGroup.timezone] : undefined}
      />

      <section className="today-card-list">
        {answerCards.slice(0, 3).map((card) => (
          <article key={card.title} className="today-card">
            <div className="pill-row">
              <span className="pill">{card.title}</span>
              {card.badge ? <span className="chip warm">{card.badge}</span> : null}
            </div>
            <strong className="today-card-headline">{card.headline}</strong>
            <p className="today-card-supporting">{card.supporting}</p>
            <p className="muted today-card-detail">{card.detail}</p>
          </article>
        ))}
      </section>

      {currentGroup ? (
        <section className="timeline-card today-agenda">
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <div className="pill-row">
              <span className="pill">Agenda</span>
              <span className="chip warm">{orderedItems.length} items</span>
            </div>
            <h2 className="section-title">In time order</h2>
            <p className="muted">Everything for this day is shown in start-time sequence.</p>
          </div>

          <div className="today-agenda-list">
            {orderedItems.map((item) => (
              <article key={item.id} className="today-agenda-item">
                <div className="today-agenda-time">
                  <strong>{formatShortTime(item.startAt, item.timezone)}</strong>
                  {item.endAt ? (
                    <span className="muted">to {formatShortTime(item.endAt, item.timezone)}</span>
                  ) : null}
                </div>
                <div className="today-agenda-content">
                  <div className="pill-row">
                    <span className="pill">{item.category}</span>
                    {item.kind === "flight" ? <span className="chip warm">Flight</span> : null}
                  </div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p>{item.subtitle}</p>
                  {item.detail ? <p className="muted">{item.detail}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
