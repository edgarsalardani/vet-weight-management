"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { RESPONSAVEL_MOCK, USUARIO_MOCK } from "@/lib/mock-data";
import { Perfil } from "@/lib/types";

const STORAGE_KEY = "vetcheck.sessao";

export interface Sessao {
  perfil: Perfil;
  nome: string;
  crmv?: string;
  /** Apenas para perfil "responsavel": id do animal vinculado nesta demonstração. */
  animalId?: string;
}

interface AuthContextValue {
  sessao: Sessao | null;
  carregando: boolean;
  login: (perfil: Perfil) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function montarSessao(perfil: Perfil): Sessao {
  if (perfil === "responsavel") {
    return {
      perfil: "responsavel",
      nome: RESPONSAVEL_MOCK.nome,
      animalId: RESPONSAVEL_MOCK.animalId,
    };
  }
  return {
    perfil: "veterinaria",
    nome: USUARIO_MOCK.nome,
    crmv: USUARIO_MOCK.crmv,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salvo =
      typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
    if (salvo === "veterinaria" || salvo === "responsavel") {
      setSessao(montarSessao(salvo));
    }
    setCarregando(false);
  }, []);

  const login = async (perfil: Perfil) => {
    // Simula uma chamada assíncrona de autenticação.
    await new Promise((r) => setTimeout(r, 350));
    window.localStorage.setItem(STORAGE_KEY, perfil);
    setSessao(montarSessao(perfil));
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSessao(null);
  };

  const value = useMemo(
    () => ({ sessao, carregando, login, logout }),
    [sessao, carregando]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
