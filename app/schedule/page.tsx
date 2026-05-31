import { GameCard } from "@/components/game-card";
import { PageShell } from "@/components/page-shell";
import { formatDay, formatGameTime } from "@/lib/date-format";
import { getTournamentSnapshot } from "@/lib/data";
import type { Game } from "@/lib/types";

export const dynamic = "force-dynamic";

function groupGames(games: Game[]) {
  return games.reduce<Record<string, Game[]>>((groups, game) => {
    const day = formatDay(game.scheduled_start);
    groups[day] ??= [];
    groups[day].push(game);
    return groups;
  }, {});
}

export default async function SchedulePage() {
  const snapshot = await getTournamentSnapshot();
  const grouped = groupGames(snapshot.games);

  return (
    <PageShell tournament={snapshot.tournament} title="Schedule">
      <div className="space-y-6">
        {Object.entries(grouped).map(([day, games]) => (
          <section key={day} className="space-y-3">
            <h2 className="text-sm font-black uppercase text-slate-500">{day}</h2>
            <div className="space-y-3">
              {games.map((game) => (
                <div key={game.id}>
                  <div className="mb-2 text-xs font-bold text-slate-500">
                    {formatGameTime(game.scheduled_start)}
                  </div>
                  <GameCard game={game} compact />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
