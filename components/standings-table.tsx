import type { StandingsRow } from "@/lib/types";

export function StandingsTable({ rows }: { rows: StandingsRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-3 py-2">Team</th>
            <th className="px-2 py-2 text-center">GP</th>
            <th className="px-2 py-2 text-center">W</th>
            <th className="px-2 py-2 text-center">L</th>
            <th className="px-2 py-2 text-center">T</th>
            <th className="px-2 py-2 text-center">GD</th>
            <th className="px-3 py-2 text-center">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.team.id}>
              <td className="px-3 py-3">
                <div className="font-black text-ink">{row.team.short_name}</div>
                <div className="text-xs font-semibold text-slate-500">{row.team.name}</div>
              </td>
              <td className="px-2 py-3 text-center font-semibold tabular-nums">{row.gamesPlayed}</td>
              <td className="px-2 py-3 text-center font-semibold tabular-nums">{row.wins}</td>
              <td className="px-2 py-3 text-center font-semibold tabular-nums">{row.losses}</td>
              <td className="px-2 py-3 text-center font-semibold tabular-nums">{row.ties}</td>
              <td className="px-2 py-3 text-center font-semibold tabular-nums">
                {row.goalDifferential > 0 ? "+" : ""}
                {row.goalDifferential}
              </td>
              <td className="px-3 py-3 text-center text-lg font-black tabular-nums text-ink">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
