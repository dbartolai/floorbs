import { PageShell } from "@/components/page-shell";
import { getTournamentSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LeadersPage() {
  const snapshot = await getTournamentSnapshot();

  return (
    <PageShell tournament={snapshot.tournament} title="Leaders">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Player</th>
              <th className="px-2 py-2 text-center">G</th>
              <th className="px-2 py-2 text-center">A</th>
              <th className="px-3 py-2 text-center">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {snapshot.leaders.map((leader) => (
              <tr key={leader.rank}>
                <td className="px-3 py-3">
                  <div className="font-black text-ink">
                    {leader.rank}. {leader.name}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">{leader.team}</div>
                </td>
                <td className="px-2 py-3 text-center font-semibold tabular-nums">
                  {leader.goals}
                </td>
                <td className="px-2 py-3 text-center font-semibold tabular-nums">
                  {leader.assists}
                </td>
                <td className="px-3 py-3 text-center text-lg font-black tabular-nums text-ink">
                  {leader.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm font-semibold leading-5 text-slate-500">
        Leaders are demo data for this MVP and can be wired to player scoring later.
      </p>
    </PageShell>
  );
}
