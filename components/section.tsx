import Link from "next/link";

export function Section({
  title,
  href,
  action,
  children
}: {
  title: string;
  href?: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black text-ink">{title}</h2>
        {href ? (
          <Link href={href} className="text-sm font-bold text-floorbs">
            {action ?? "View all"}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
