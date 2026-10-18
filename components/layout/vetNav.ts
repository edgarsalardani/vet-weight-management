import { CalendarClock, FlaskConical, Users, LucideIcon } from "lucide-react";

export interface ItemNav {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Prefixos de rota que também marcam este item como ativo. */
  prefixos: string[];
}

/** Navegação principal da área da veterinária (usada no topo e na barra inferior). */
export const NAV_VETERINARIA: ItemNav[] = [
  { href: "/dashboard", label: "Pacientes", icon: Users, prefixos: ["/dashboard", "/animais"] },
  { href: "/agenda", label: "Agenda", icon: CalendarClock, prefixos: ["/agenda"] },
  { href: "/pesquisa", label: "Pesquisa", icon: FlaskConical, prefixos: ["/pesquisa"] },
];

export function itemAtivo(item: ItemNav, pathname: string): boolean {
  return item.prefixos.some((p) => pathname === p || pathname.startsWith(p + "/"));
}
