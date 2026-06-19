import { PageShell } from "@/components/page-shell";
import { StandingsTable } from "@/components/standings-table";
import { formatShortTime } from "@/lib/date-format";
import { getTournamentSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function StandingsPage() {
  const snapshot = await getTournamentSnapshot();
  const assignmentsBySeed = snapshot.games.reduce<Record<string, string[]>>(
    (assignments, game) => {
      if (game.phase !== "playoff") return assignments;

      for (const participant of [game.home_participant, game.away_participant]) {
        if (participant.source.type !== "seed" || !participant.source.value) continue;

        assignments[participant.source.value] ??= [];
        assignments[participant.source.value].push(
          `${formatShortTime(game.scheduled_start)} ${game.title}`
        );
      }

      return assignments;
    },
    {}
  );

  return (
    <PageShell tournament={snapshot.tournament} title="Standings">
      <div className="space-y-6">
        {Object.entries(snapshot.standings).map(([pool, rows]) => (
          <section key={pool} className="space-y-3">
            <h2 className="text-sm font-black uppercase text-slate-500">{pool}</h2>
            <StandingsTable
              rows={rows}
              pool={pool}
              assignmentsBySeed={assignmentsBySeed}
            />
          </section>
        ))}
      </div>
    </PageShell>
  );
}
