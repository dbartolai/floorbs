import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { formatDateRange } from "@/lib/date-format";
import type { Tournament } from "@/lib/types";

export function AppHeader({ tournament }: { tournament: Tournament }) {
  return (
    <header className="bg-ink px-4 pb-5 pt-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href="/" className="text-2xl font-black tracking-normal">
            Floorbs
          </Link>
          <p className="mt-1 text-sm text-slate-300">
            {tournament.name} · {tournament.location}
          </p>
        </div>
        <Link
          href="/admin"
          aria-label="Open scorer tools"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-slate-100"
        >
          <ShieldCheck className="h-5 w-5" />
        </Link>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm">
        <span className="font-semibold">{formatDateRange(tournament.start_date, tournament.end_date)}</span>
        <span className="text-slate-300">Live tournament desk</span>
      </div>
    </header>
  );
}
