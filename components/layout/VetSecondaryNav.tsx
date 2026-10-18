"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, CalendarClock, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const ITENS = [
  { href: "/dashboard", label: "Pacientes", icon: Users },
  { href: "/agenda", label: "Agenda", icon: CalendarClock },
  { href: "/pesquisa", label: "Pesquisa", icon: FlaskConical },
];

export function VetSecondaryNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-16 z-10 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-app gap-1 overflow-x-auto px-4 no-scrollbar sm:px-6">
        {ITENS.map((item) => {
          const ativo =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                ativo
                  ? "border-primary text-primary"
                  : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
