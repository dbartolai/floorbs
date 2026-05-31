"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { AppHeader } from "@/components/app-header";
import { FeedList } from "@/components/feed-list";
import { GameCard } from "@/components/game-card";
import { Section } from "@/components/section";
import type { TournamentSnapshot } from "@/lib/types";

export function HomeDashboard({ initialSnapshot }: { initialSnapshot: TournamentSnapshot }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [isPending, startTransition] = useTransition();

  async function refresh() {
    const response = await fetch("/api/tournament", { cache: "no-store" });
    if (!response.ok) return;
    const nextSnapshot = (await response.json()) as TournamentSnapshot;
    startTransition(() => setSnapshot(nextSnapshot));
  }

  useEffect(() => {
    const id = window.setInterval(refresh, 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="safe-bottom min-h-screen bg-court">
      <AppHeader tournament={snapshot.tournament} />

      <div className="space-y-6 py-5">
        <section className="px-4">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-xl font-black text-ink">Live now</h1>
            <button
              type="button"
              onClick={refresh}
              className="flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-sm font-bold text-slate-600 shadow-sm"
            >
              <RefreshCw className={isPending ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
              Refresh
            </button>
          </div>
          {snapshot.liveGames.length > 0 ? (
            <div className="space-y-3">
              {snapshot.liveGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm font-semibold text-slate-500">
              No games are live right now.
            </div>
          )}
        </section>

        <Section title="Up next" href="/schedule" action="Schedule">
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {snapshot.upcomingGames.slice(0, 4).map((game) => (
              <div key={game.id} className="w-[82%] shrink-0">
                <GameCard game={game} compact />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Latest finals" href="/results" action="Results">
          <div className="space-y-3">
            {snapshot.finalGames.slice(0, 3).map((game) => (
              <GameCard key={game.id} game={game} compact />
            ))}
          </div>
        </Section>

        <Section title="Tournament feed">
          <FeedList posts={snapshot.feedPosts.slice(0, 5)} />
        </Section>
      </div>
    </main>
  );
}
