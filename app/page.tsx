import { HomeDashboard } from "@/components/home-dashboard";
import { getTournamentSnapshot } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const snapshot = await getTournamentSnapshot();

  return <HomeDashboard initialSnapshot={snapshot} />;
}
