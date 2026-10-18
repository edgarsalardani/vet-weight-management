"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_VETERINARIA, itemAtivo } from "@/components/layout/vetNav";

/** Barra de navegação inferior (somente celular) da área da veterinária. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-3">
        {NAV_VETERINARIA.map((item) => {
          const ativo = itemAtivo(item, pathname);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={ativo ? "page" : undefined}
                className="group flex min-h-[60px] flex-col items-center justify-center gap-1 py-2"
              >
                <span
                  className={cn(
                    "flex h-8 w-14 items-center justify-center rounded-full transition duration-150",
                    ativo
                      ? "bg-primary-50 text-primary"
                      : "text-ink-muted group-active:bg-surfaceMuted"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    ativo ? "text-primary" : "text-ink-muted"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
