import { BellRing } from "lucide-react";
import { Compromisso } from "@/lib/types";
import { diasAteData, formatarDataCurta } from "@/lib/utils";

/**
 * Lembrete simulado DENTRO da interface (sem push/e-mail/WhatsApp reais).
 * Compara a data atual com a data do compromisso para decidir se exibe o
 * aviso — estrutura pronta para futuramente disparar uma notificação real
 * por um canal ainda a definir.
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
    <div className="mb-4 flex items-start gap-3 rounded-card border border-status-high/30 bg-status-highBg px-4 py-3.5 text-status-high">
      <BellRing className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          {ehAmanha ? "Retorno amanhã" : "Seu retorno está próximo"}
        </p>
        <p className="mt-0.5 text-sm">
          {nomeAnimal} possui retorno {ehAmanha ? "amanhã" : `em ${dias} dias`}.
          <br />
          {formatarDataCurta(compromisso.data)}
          {compromisso.horario ? ` às ${compromisso.horario}` : ""}.
        </p>
        {compromisso.orientacaoRetorno && (
          <p className="mt-1.5 text-sm">
            <span className="font-medium">Orientação:</span>{" "}
            {compromisso.orientacaoRetorno}
          </p>
        )}
      </div>
    </div>
  );
}
