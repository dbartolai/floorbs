import { PageShell } from "@/components/page-shell";
import { getTournamentSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LeadersPage() {
  const snapshot = await getTournamentSnapshot();

  return (
    <PageShell tournament={snapshot.tournament} title="Leaders">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-black text-ink">Not tracked yet</h2>
        <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">
          Player goals, assists, and points are not part of this tournament demo yet.
        </p>
      </div>
    </PageShell>
  );
}
