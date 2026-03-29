import { logoutAction } from "@/actions";
import { requireAdmin, requireTraveler } from "@/auth";
import { AdminPanel } from "@/admin-panel";
import { buildTravelerDashboard } from "@/itinerary";
import { AppShell, PageIntro, ScheduleView, TravelerNav } from "@/ui";

export default async function SchedulePage({
  searchParams
}: {
  searchParams?: Promise<{ mode?: string; subpage?: string }>;
}) {
  const params = (await searchParams) ?? {};

  if (params.mode === "admin") {
    await requireAdmin();
    return <AdminPanel subpage={params.subpage || "overview"} />;
  }

  await requireTraveler();
  const { snapshot, schedule } = await buildTravelerDashboard();

  return (
    <AppShell
      title="Schedule"
      subtitle="The full trip timeline grouped by local day."
      eyebrow="Traveler view"
      tripName={snapshot.trip.name}
      nav={<TravelerNav pathname="/schedule" />}
      actions={
        <form action={logoutAction}>
          <button className="button-secondary" type="submit">
            Log out
          </button>
        </form>
      }
    >
      <PageIntro
        title="Every day, in order"
        body="Flight times, tours, dinners, and transfer moments are grouped by the local day so they stay understandable across Barcelona and Porto."
        chips={[`${schedule.length} day groups`, `${snapshot.events.length} events`, `${snapshot.flights.length} flights`]}
      />
      <ScheduleView groups={schedule} />
    </AppShell>
  );
}
