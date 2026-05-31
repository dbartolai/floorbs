import { PageShell } from "@/components/page-shell";
import { StandingsTable } from "@/components/standings-table";
import { getTournamentSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const snapshot = await getTournamentSnapshot();

  return (
    <PageShell tournament={snapshot.tournament} title="Standings">
      <div className="space-y-6">
        {Object.entries(snapshot.standings).map(([pool, rows]) => (
          <section key={pool} className="space-y-3">
            <h2 className="text-sm font-black uppercase text-slate-500">{pool}</h2>
            <StandingsTable rows={rows} />
          </section>
        ))}
      </div>
    </PageShell>
  );
}
