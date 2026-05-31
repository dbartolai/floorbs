import { AdminClient } from "@/components/admin-client";
import { getTournamentSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const snapshot = await getTournamentSnapshot();

  return <AdminClient initialSnapshot={snapshot} />;
}
