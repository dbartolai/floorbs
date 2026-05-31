import { GameCard } from "@/components/game-card";
import { PageShell } from "@/components/page-shell";
import { formatGameTime } from "@/lib/date-format";
import { getTournamentSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const snapshot = await getTournamentSnapshot();

  return (
    <PageShell tournament={snapshot.tournament} title="Results">
      <div className="space-y-3">
        {snapshot.finalGames.map((game) => (
          <article key={game.id} className="space-y-2">
            <div className="text-xs font-bold text-slate-500">
              {formatGameTime(game.scheduled_start)} · {game.court}
            </div>
            <GameCard game={game} compact />
          </article>
        ))}
      </div>
    </PageShell>
  );
}
