"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type TipoToast = "sucesso" | "erro" | "info";

interface ToastItem {
  id: number;
  titulo: string;
  descricao?: string;
  tipo: TipoToast;
}

interface ToastContextValue {
  /** Exibe uma confirmação discreta (feedback de ações: salvar, enviar, confirmar). */
  toast: (dados: { titulo: string; descricao?: string; tipo?: TipoToast }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DURACAO_MS = 4500;

const ICONES = {
  sucesso: CheckCircle2,
  erro: AlertCircle,
  info: Info,
};

const COR_ICONE = {
  sucesso: "text-primary-500",
  erro: "text-[#FF9C8F]",
  info: "text-primary-100",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ToastItem[]>([]);
  const proximoId = useRef(1);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const remover = useCallback((id: number) => {
    setItens((lista) => lista.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>(
    ({ titulo, descricao, tipo = "sucesso" }) => {
      const id = proximoId.current++;
      setItens((lista) => [...lista.slice(-2), { id, titulo, descricao, tipo }]);
      timers.current[id] = setTimeout(() => remover(id), DURACAO_MS);
    },
    [remover]
  );

  useEffect(() => {
    const atuais = timers.current;
    return () => Object.values(atuais).forEach(clearTimeout);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] md:pb-8"
      >
        {itens.map((t) => {
          const Icone = ICONES[t.tipo];
          return (
            <div
              key={t.id}
              role={t.tipo === "erro" ? "alert" : "status"}
              className="pointer-events-auto flex w-full max-w-sm animate-pop-in items-start gap-3 rounded-card bg-ink px-4 py-3.5 text-white shadow-elevated"
            >
              <Icone className={`mt-0.5 h-5 w-5 shrink-0 ${COR_ICONE[t.tipo]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.titulo}</p>
                {t.descricao && (
                  <p className="mt-0.5 text-sm text-white/75">{t.descricao}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remover(t.id)}
                aria-label="Fechar aviso"
                className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}
