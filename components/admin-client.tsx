"use client";

import clsx from "clsx";
import {
  CheckCircle2,
  LogOut,
  Megaphone,
  Minus,
  Plus,
  Radio,
  Send
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { GameCard } from "@/components/game-card";
import { formatShortTime } from "@/lib/date-format";
import {
  formatGameReference,
  getGameParticipantSource,
  parseSourceOptionValue,
  seedCodeForPool,
  sourceOptionValue,
  teamForSeed
} from "@/lib/playoff-sources";
import type {
  FeedPostType,
  Game,
  GameParticipant,
  GameStatus,
  ParticipantSource,
  TournamentSnapshot
} from "@/lib/types";

type Session = {
  displayName: string;
  role: string;
};

type SourceOption = {
  value: string;
  label: string;
};

export function AdminClient({ initialSnapshot }: { initialSnapshot: TournamentSnapshot }) {
  const initialPlayoffGame = initialSnapshot.games.find((game) => game.phase === "playoff");
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [session, setSession] = useState<Session | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(
    initialSnapshot.liveGames[0]?.id ?? initialSnapshot.games[0]?.id ?? ""
  );
  const [selectedPlayoffGameId, setSelectedPlayoffGameId] = useState(
    initialPlayoffGame?.id ?? ""
  );
  const [homeSourceValue, setHomeSourceValue] = useState(
    initialPlayoffGame
      ? sourceOptionValue(getGameParticipantSource(initialPlayoffGame, "home"))
      : "tbd:"
  );
  const [awaySourceValue, setAwaySourceValue] = useState(
    initialPlayoffGame
      ? sourceOptionValue(getGameParticipantSource(initialPlayoffGame, "away"))
      : "tbd:"
  );
  const [feedTitle, setFeedTitle] = useState("");
  const [feedBody, setFeedBody] = useState("");
  const [feedType, setFeedType] = useState<FeedPostType>("announcement");

  const selectedGame = useMemo(
    () => snapshot.games.find((game) => game.id === selectedGameId) ?? snapshot.games[0],
    [selectedGameId, snapshot.games]
  );
  const playoffGames = useMemo(
    () => snapshot.games.filter((game) => game.phase === "playoff"),
    [snapshot.games]
  );
  const selectedPlayoffGame = useMemo(
    () =>
      playoffGames.find((game) => game.id === selectedPlayoffGameId) ??
      playoffGames[0] ??
      null,
    [playoffGames, selectedPlayoffGameId]
  );
  const sourceOptions = useMemo(
    () => buildSourceOptions(snapshot, selectedPlayoffGame),
    [snapshot, selectedPlayoffGame]
  );

  async function loadSession() {
    const response = await fetch("/api/admin/session", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { session: Session | null };
    setSession(data.session);
  }

  async function refreshSnapshot() {
    const response = await fetch("/api/tournament", { cache: "no-store" });
    if (!response.ok) return;
    setSnapshot((await response.json()) as TournamentSnapshot);
  }

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!selectedPlayoffGame) return;
    setHomeSourceValue(sourceOptionValue(getGameParticipantSource(selectedPlayoffGame, "home")));
    setAwaySourceValue(sourceOptionValue(getGameParticipantSource(selectedPlayoffGame, "away")));
  }, [selectedPlayoffGame]);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });

    setBusy(false);

    if (!response.ok) {
      setError("Invalid scorer code.");
      return;
    }

    const data = (await response.json()) as { session: Session };
    setSession(data.session);
    setCode("");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setSession(null);
  }

  async function updateGame(next: {
    homeScore?: number;
    awayScore?: number;
    status?: GameStatus;
  }) {
    if (!selectedGame) return;

    setBusy(true);
    setError("");

    const response = await fetch(`/api/admin/games/${selectedGame.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });

    setBusy(false);

    if (!response.ok) {
      setError("Could not update game.");
      return;
    }

    await refreshSnapshot();
  }

  async function savePlayoffSlot(event: FormEvent) {
    event.preventDefault();
    if (!selectedPlayoffGame) return;

    setBusy(true);
    setError("");

    const response = await fetch(`/api/admin/games/${selectedPlayoffGame.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        homeSource: parseSourceOptionValue(homeSourceValue),
        awaySource: parseSourceOptionValue(awaySourceValue)
      })
    });

    setBusy(false);

    if (!response.ok) {
      setError("Could not update playoff slot.");
      return;
    }

    await refreshSnapshot();
  }

  async function submitFeed(event: FormEvent) {
    event.preventDefault();
    if (!feedTitle.trim()) return;

    setBusy(true);
    setError("");

    const response = await fetch("/api/admin/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: feedTitle,
        body: feedBody,
        type: feedType,
        gameId: selectedGame?.id ?? null
      })
    });

    setBusy(false);

    if (!response.ok) {
      setError("Could not post update.");
      return;
    }

    setFeedTitle("");
    setFeedBody("");
    await refreshSnapshot();
  }

  return (
    <main className="safe-bottom min-h-screen bg-court">
      <AppHeader tournament={snapshot.tournament} />

      {!session ? (
        <section className="px-4 py-5">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h1 className="text-2xl font-black text-ink">Scorer Code</h1>
            <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">
              Enter the 6-digit code from the tournament desk.
            </p>
            <form onSubmit={handleLogin} className="mt-5 space-y-4">
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                className="h-16 w-full rounded-lg border border-slate-300 bg-slate-50 text-center text-3xl font-black tracking-[0.25em] text-ink outline-none focus:border-floorbs focus:bg-white"
                placeholder="000000"
                autoComplete="one-time-code"
              />
              {error ? <p className="text-sm font-bold text-live">{error}</p> : null}
              <button
                type="submit"
                disabled={busy || code.length !== 6}
                className="h-12 w-full rounded-lg bg-floorbs text-sm font-black text-white disabled:bg-slate-300"
              >
                Unlock scorer tools
              </button>
            </form>
          </div>
        </section>
      ) : (
        <section className="space-y-5 px-4 py-5">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div>
              <h1 className="text-xl font-black text-ink">Scorer tools</h1>
              <p className="text-sm font-semibold text-slate-500">
                {session.displayName} · {session.role}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <label className="text-xs font-black uppercase text-slate-500" htmlFor="game">
              Select game
            </label>
            <select
              id="game"
              value={selectedGame?.id ?? ""}
              onChange={(event) => setSelectedGameId(event.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-base font-bold text-ink"
            >
              {snapshot.games.map((game) => (
                <option key={game.id} value={game.id}>
                  {formatShortTime(game.scheduled_start)} · {game.court} ·{" "}
                  {participantName(game.home_participant)} vs{" "}
                  {participantName(game.away_participant)}
                </option>
              ))}
            </select>
          </div>

          {selectedGame ? (
            <>
              <GameCard game={selectedGame} />
              <ScoreControls
                game={selectedGame}
                disabled={busy}
                onUpdate={updateGame}
              />
            </>
          ) : null}

          {playoffGames.length > 0 ? (
            <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-ink">Playoff slots</h2>
                <p className="text-sm font-semibold text-slate-500">
                  Assign teams, group seeds, or winner/loser references.
                </p>
              </div>

              <div className="grid gap-2">
                {playoffGames.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => setSelectedPlayoffGameId(game.id)}
                    className={clsx(
                      "rounded-lg border p-3 text-left",
                      selectedPlayoffGame?.id === game.id
                        ? "border-floorbs bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-black text-ink">
                        {formatShortTime(game.scheduled_start)} · {game.title}
                      </span>
                      <span className="text-xs font-black uppercase text-slate-500">
                        {game.status}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-sm font-semibold text-slate-600">
                      {participantName(game.home_participant)} vs{" "}
                      {participantName(game.away_participant)}
                    </div>
                  </button>
                ))}
              </div>

              {selectedPlayoffGame ? (
                <form onSubmit={savePlayoffSlot} className="space-y-3 border-t border-slate-100 pt-3">
                  <SourceSelect
                    label="Home"
                    value={homeSourceValue}
                    options={sourceOptions}
                    preview={previewSource(homeSourceValue, snapshot)}
                    onChange={setHomeSourceValue}
                  />
                  <SourceSelect
                    label="Away"
                    value={awaySourceValue}
                    options={sourceOptions}
                    preview={previewSource(awaySourceValue, snapshot)}
                    onChange={setAwaySourceValue}
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="h-12 w-full rounded-lg bg-floorbs text-sm font-black text-white disabled:bg-slate-300"
                  >
                    Save playoff slot
                  </button>
                </form>
              ) : null}
            </section>
          ) : null}

          <form
            onSubmit={submitFeed}
            className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-floorbs" />
              <h2 className="text-lg font-black text-ink">Feed post</h2>
            </div>
            <select
              value={feedType}
              onChange={(event) => setFeedType(event.target.value as FeedPostType)}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-ink"
            >
              <option value="announcement">Announcement</option>
              <option value="score_update">Score update</option>
              <option value="final_score">Final score</option>
              <option value="standings_update">Standings update</option>
              <option value="smack">Smack</option>
            </select>
            <input
              value={feedTitle}
              onChange={(event) => setFeedTitle(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm font-bold text-ink"
              placeholder="Post title"
            />
            <textarea
              value={feedBody}
              onChange={(event) => setFeedBody(event.target.value)}
              className="min-h-20 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-ink"
              placeholder="Optional details"
            />
            {error ? <p className="text-sm font-bold text-live">{error}</p> : null}
            <button
              type="submit"
              disabled={busy || !feedTitle.trim()}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-black text-white disabled:bg-slate-300"
            >
              <Send className="h-4 w-4" />
              Post update
            </button>
          </form>
        </section>
      )}
    </main>
  );
}

function ScoreControls({
  game,
  disabled,
  onUpdate
}: {
  game: Game;
  disabled: boolean;
  onUpdate: (next: { homeScore?: number; awayScore?: number; status?: GameStatus }) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <StatusButton
          active={game.status === "live"}
          disabled={disabled}
          icon={<Radio className="h-4 w-4" />}
          label="Mark live"
          onClick={() => onUpdate({ status: "live" })}
        />
        <StatusButton
          active={game.status === "final"}
          disabled={disabled}
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Mark final"
          onClick={() => onUpdate({ status: "final" })}
        />
      </div>

      <ScoreStepper
        label={participantName(game.home_participant)}
        score={game.home_score}
        disabled={disabled}
        onMinus={() => onUpdate({ homeScore: Math.max(0, game.home_score - 1) })}
        onPlus={() => onUpdate({ homeScore: game.home_score + 1 })}
      />
      <ScoreStepper
        label={participantName(game.away_participant)}
        score={game.away_score}
        disabled={disabled}
        onMinus={() => onUpdate({ awayScore: Math.max(0, game.away_score - 1) })}
        onPlus={() => onUpdate({ awayScore: game.away_score + 1 })}
      />
    </div>
  );
}

function SourceSelect({
  label,
  value,
  options,
  preview,
  onChange
}: {
  label: string;
  value: string;
  options: SourceOption[];
  preview: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-bold text-ink"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="mt-1 block text-xs font-semibold leading-4 text-slate-500">
        {preview}
      </span>
    </label>
  );
}

function buildSourceOptions(
  snapshot: TournamentSnapshot,
  selectedGame: Game | null
): SourceOption[] {
  const options: SourceOption[] = [{ value: "tbd:", label: "TBD" }];

  for (const team of snapshot.teams) {
    options.push({
      value: sourceOptionValue({ type: "team", value: team.id }),
      label: team.name
    });
  }

  for (const [pool, rows] of Object.entries(snapshot.standings)) {
    rows.forEach((row, index) => {
      const code = seedCodeForPool(pool, index + 1);
      options.push({
        value: sourceOptionValue({ type: "seed", value: code }),
        label: `${code} · ${row.team.name}`
      });
    });
  }

  if (selectedGame) {
    const selectedTime = new Date(selectedGame.scheduled_start).getTime();
    for (const game of snapshot.games) {
      if (game.phase !== "playoff") continue;
      if (game.id === selectedGame.id) continue;
      if (new Date(game.scheduled_start).getTime() >= selectedTime) continue;

      const reference = formatGameReference(game);
      options.push({
        value: sourceOptionValue({ type: "winner", value: game.id }),
        label: `Winner of ${reference}`
      });
      options.push({
        value: sourceOptionValue({ type: "loser", value: game.id }),
        label: `Loser of ${reference}`
      });
    }
  }

  return options;
}

function previewSource(value: string, snapshot: TournamentSnapshot) {
  const source = parseSourceOptionValue(value);

  if (source.type === "tbd") return "No team assigned yet.";

  if (source.type === "team") {
    return snapshot.teams.find((team) => team.id === source.value)?.name ?? "Team not found.";
  }

  if (source.type === "seed") {
    const team = teamForSeed(snapshot.standings, source.value);
    return team
      ? `${source.value} -> ${team.name} based on current standings.`
      : `${source.value} will resolve from standings.`;
  }

  const game = snapshot.games.find((item) => item.id === source.value);
  if (!game) return "Referenced game not found.";

  const reference = `${source.type === "winner" ? "Winner" : "Loser"} of ${formatGameReference(game)}`;
  if (game.status !== "final" || game.home_score === game.away_score) {
    return `${reference} once that game is final.`;
  }

  const participant = winnerLoserParticipant(game, source);
  return participant
    ? `${reference} -> ${participantName(participant)}`
    : `${reference} once that game is final.`;
}

function winnerLoserParticipant(game: Game, source: ParticipantSource) {
  const homeWon = game.home_score > game.away_score;
  if (source.type === "winner") {
    return homeWon ? game.home_participant : game.away_participant;
  }

  return homeWon ? game.away_participant : game.home_participant;
}

function participantName(participant: GameParticipant) {
  return participant.detail ?? participant.label;
}

function StatusButton({
  active,
  disabled,
  icon,
  label,
  onClick
}: {
  active: boolean;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-black",
        active ? "bg-ink text-white" : "bg-slate-100 text-slate-700"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function ScoreStepper({
  label,
  score,
  disabled,
  onMinus,
  onPlus
}: {
  label: string;
  score: number;
  disabled: boolean;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="min-w-0 truncate text-base font-black text-ink">{label}</span>
        <span className="text-4xl font-black tabular-nums text-ink">{score}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={onMinus}
          className="flex h-14 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm disabled:text-slate-300"
          aria-label={`Decrease ${label} score`}
        >
          <Minus className="h-7 w-7" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onPlus}
          className="flex h-14 items-center justify-center rounded-lg bg-floorbs text-white shadow-sm disabled:bg-slate-300"
          aria-label={`Increase ${label} score`}
        >
          <Plus className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
