import clsx from "clsx";
import type { GameStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: GameStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex h-6 items-center rounded-md px-2 text-xs font-black uppercase tracking-normal",
        status === "live" && "bg-live text-white",
        status === "final" && "bg-slate-900 text-white",
        status === "scheduled" && "bg-slate-100 text-slate-600"
      )}
    >
      {status === "live" ? "LIVE" : status}
    </span>
  );
}
