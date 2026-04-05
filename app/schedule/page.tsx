import { logoutAction } from "@/actions";
import { requireAdmin, requireTraveler } from "@/auth";
import { AdminPanel } from "@/admin-panel";
import { buildTravelerDashboard } from "@/itinerary";
import { AgendaGroups, AppShell, CompactPageIntro, LogoutButton, TravelerNav } from "@/ui";

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
          <LogoutButton />
        </form>
      }
    >
      <CompactPageIntro
        title="Every day, in order"
        body="Flight times, plans, and transfers are grouped by local day and shown in time sequence."
        chips={[`${schedule.length} day groups`, `${snapshot.events.length} events`, `${snapshot.flights.length} flights`]}
      />
      <AgendaGroups groups={schedule} />
    </AppShell>
  );
}
