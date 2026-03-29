import { logoutAction } from "@/actions";
import { requireTraveler } from "@/auth";
import { buildTravelerDashboard } from "@/itinerary";
import { AppShell, AnswerCards, PageIntro, ScheduleView, TravelerNav } from "@/ui";

export default async function TodayPage() {
  await requireTraveler();
  const { snapshot, answerCards, schedule } = await buildTravelerDashboard();
  const currentGroup = schedule.find((group) => group.label === "Today") ?? schedule[0];

  return (
    <AppShell
      title="Today"
      subtitle="The clearest view of what matters right now."
      eyebrow="Traveler view"
      tripName={snapshot.trip.name}
      nav={<TravelerNav pathname="/today" />}
      actions={
        <form action={logoutAction}>
          <button className="button-secondary" type="submit">
            Log out
          </button>
        </form>
      }
    >
      <PageIntro
        title={currentGroup ? currentGroup.label : "Today"}
        body="Use this page when someone asks what is happening now, what comes next, or whether tomorrow starts early."
        chips={currentGroup ? [currentGroup.dateText, currentGroup.timezone] : undefined}
      />
      <AnswerCards cards={answerCards.slice(0, 3)} />
      {currentGroup ? <ScheduleView groups={[currentGroup]} /> : null}
    </AppShell>
  );
}
