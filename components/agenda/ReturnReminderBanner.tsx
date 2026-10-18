import { BellRing } from "lucide-react";
import { Compromisso } from "@/lib/types";
import { diasAteData, formatarDataCurta } from "@/lib/utils";

/**
 * Lembrete simulado DENTRO da interface (sem push/e-mail/WhatsApp reais).
 * Compara a data atual com a do compromisso para decidir se exibe o aviso —
 * estrutura pronta para futuramente disparar uma notificação real.
 */
export function ReturnReminderBanner({
  compromisso,
  nomeAnimal,
}: {
  compromisso: Compromisso;
  nomeAnimal: string;
}) {
  const dias = diasAteData(compromisso.data);
  const dentroDaJanela = dias === 1 || (dias > 1 && dias <= 7);

  if (!dentroDaJanela) return null;

  const ehAmanha = dias === 1;

  return (
    <div
      role="status"
      className="flex animate-fade-in items-start gap-4 rounded-card border border-status-high/20 bg-status-highBg p-4 text-status-high sm:p-5"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70">
        <BellRing className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base font-bold">
          {ehAmanha ? "Retorno amanhã" : "Seu retorno está próximo"}
        </p>
        <p className="mt-0.5 text-base">
          {nomeAnimal} possui retorno {ehAmanha ? "amanhã" : `em ${dias} dias`},{" "}
          {formatarDataCurta(compromisso.data)}
          {compromisso.horario ? ` às ${compromisso.horario}` : ""}.
        </p>
        {compromisso.orientacaoRetorno && (
          <p className="mt-2 text-base">
            <span className="font-bold">Orientação:</span> {compromisso.orientacaoRetorno}
          </p>
        )}
      </div>
    </div>
  );
}
