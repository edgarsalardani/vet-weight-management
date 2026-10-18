"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(jaRespondido);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    await responderQuestionario(questionario.id, animalId, respostas);
    setEnviando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <Card>
        <CardBody className="flex items-center gap-3 py-6 text-center">
          <div className="flex w-full flex-col items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-status-idealBg text-status-ideal">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <p className="font-medium text-ink">Questionário respondido</p>
            <p className="text-sm text-ink-muted">
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
        <p className="text-sm font-medium text-ink">{questionario.titulo}</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-5">
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
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                          selecionado
                            ? "border-primary bg-primary text-white"
                            : "border-line bg-white text-ink-muted hover:border-primary/50"
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
