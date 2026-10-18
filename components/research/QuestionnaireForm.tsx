"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { FieldWrapper, Textarea } from "@/components/ui/Field";
import { responderQuestionario } from "@/lib/services/researchService";
import { Questionario } from "@/lib/types";

export function QuestionnaireForm({
  questionario,
  animalId,
  jaRespondido = false,
}: {
  questionario: Questionario;
  animalId: string;
  jaRespondido?: boolean;
}) {
  const { toast } = useToast();
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(jaRespondido);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    await responderQuestionario(questionario.id, animalId, respostas);
    setEnviando(false);
    setEnviado(true);
    toast({ titulo: "Respostas enviadas", descricao: "Obrigado por responder ao questionário." });
  }

  if (enviado) {
    return (
      <Card>
        <CardBody className="flex items-center gap-3 py-6 text-center">
          <div className="flex w-full flex-col items-center gap-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-status-idealBg text-status-ideal">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <p className="text-lg font-bold text-ink">Questionário respondido</p>
            <p className="text-base text-ink-muted">
              Obrigado por enviar suas respostas para &ldquo;{questionario.titulo}&rdquo;.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-base font-bold text-ink">{questionario.titulo}</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questionario.perguntas.map((pergunta) => (
            <FieldWrapper key={pergunta.id} label={pergunta.texto} htmlFor={pergunta.id}>
              {pergunta.tipo === "escala" && pergunta.opcoes ? (
                <div className="flex flex-wrap gap-2">
                  {pergunta.opcoes.map((opcao) => {
                    const selecionado = respostas[pergunta.id] === opcao;
                    return (
                      <button
                        key={opcao}
                        type="button"
                        onClick={() =>
                          setRespostas((r) => ({ ...r, [pergunta.id]: opcao }))
                        }
                        className={`h-11 rounded-full border px-4 text-sm font-semibold transition duration-150 active:scale-95 ${
                          selecionado
                            ? "border-primary bg-primary text-white shadow-soft"
                            : "border-line bg-white text-ink-muted hover:border-primary/40 hover:bg-primary-50"
                        }`}
                      >
                        {opcao}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <Textarea
                  id={pergunta.id}
                  rows={3}
                  value={respostas[pergunta.id] ?? ""}
                  onChange={(e) =>
                    setRespostas((r) => ({ ...r, [pergunta.id]: e.target.value }))
                  }
                />
              )}
            </FieldWrapper>
          ))}

          <Button type="submit" full carregando={enviando}>
            Enviar respostas
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
