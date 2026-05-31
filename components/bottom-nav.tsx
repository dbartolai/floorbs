"use client";

import clsx from "clsx";
import {
  BarChart3,
  CalendarDays,
  Home,
  ListChecks,
  ShieldCheck,
  Trophy
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/standings", label: "Standings", icon: BarChart3 },
  { href: "/results", label: "Results", icon: ListChecks },
  { href: "/leaders", label: "Leaders", icon: Trophy }
];

export function BottomNav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[520px] border-t border-slate-800 bg-ink px-4 pb-[env(safe-area-inset-bottom)] pt-2">
        <Link
          href="/"
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-ink"
        >
          <ShieldCheck className="h-4 w-4" />
          Exit scorer tools
        </Link>
      </nav>
    );
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-[520px] grid-cols-5 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold",
              active ? "bg-blue-50 text-floorbs" : "text-slate-500"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
