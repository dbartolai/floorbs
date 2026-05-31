import { AppHeader } from "@/components/app-header";
import type { Tournament } from "@/lib/types";

export function PageShell({
  tournament,
  title,
  children
}: {
  tournament: Tournament;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="safe-bottom min-h-screen bg-court">
      <AppHeader tournament={tournament} />
      <div className="space-y-5 px-4 py-5">
        <h1 className="text-2xl font-black text-ink">{title}</h1>
        {children}
      </div>
    </main>
  );
}
