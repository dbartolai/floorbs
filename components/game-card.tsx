import clsx from "clsx";
import { Clock3, MapPin } from "lucide-react";
import { formatShortTime } from "@/lib/date-format";
import type { Game, GameParticipant } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

export function GameCard({
  game,
  compact = false
}: {
  game: Game;
  compact?: boolean;
}) {
  const showScore = game.status !== "scheduled";

  return (
    <article
      className={clsx(
        "rounded-lg border bg-white p-3 shadow-sm",
        game.status === "live" ? "border-rose-200" : "border-slate-200"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold text-slate-500">
        <div className="flex min-w-0 items-center gap-2">
          <Clock3 className="h-4 w-4 shrink-0" />
          <span>{formatShortTime(game.scheduled_start)}</span>
          <span className="text-slate-300">·</span>
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{game.court}</span>
          {game.phase === "playoff" ? (
            <>
              <span className="text-slate-300">·</span>
              <span className="truncate">{game.title}</span>
            </>
          ) : null}
        </div>
        <StatusBadge status={game.status} />
      </div>

      <TeamScoreRow
        participant={game.home_participant}
        score={showScore ? game.home_score : null}
        compact={compact}
      />
      <div className="my-2 h-px bg-slate-100" />
      <TeamScoreRow
        participant={game.away_participant}
        score={showScore ? game.away_score : null}
        compact={compact}
      />
    </article>
  );
}

function TeamScoreRow({
  participant,
  score,
  compact
}: {
  participant: GameParticipant;
  score: number | null;
  compact: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-700">
          {participant.shortLabel}
        </div>
        <div className="min-w-0">
          <div
            className={clsx(
              "truncate font-black text-ink",
              compact ? "text-base" : "text-lg"
            )}
          >
            {participant.label}
          </div>
          {participant.detail ? (
            <div className="truncate text-xs font-bold text-slate-500">
              {participant.detail}
            </div>
          ) : null}
        </div>
      </div>
      <span
        className={clsx(
          "w-10 shrink-0 text-right font-black tabular-nums text-ink",
          score === null ? "text-lg text-slate-300" : compact ? "text-2xl" : "text-4xl"
        )}
      >
        {score ?? "-"}
      </span>
    </div>
  );
}
