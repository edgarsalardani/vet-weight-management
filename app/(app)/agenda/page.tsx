"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { MonthCalendar } from "@/components/agenda/MonthCalendar";
import { AppointmentListItem } from "@/components/agenda/AppointmentListItem";
import { NewAppointmentForm } from "@/components/agenda/NewAppointmentForm";
import {
  criarCompromisso,
  listarCompromissos,
} from "@/lib/services/appointmentService";
import { listarAnimais } from "@/lib/services/animalService";
import { Animal, Compromisso, NovoCompromisso } from "@/lib/types";
import { dataRelativaAHoje, formatarDataCurta, formatarDiaSemana } from "@/lib/utils";

export default function AgendaPage() {
  const { toast } = useToast();
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);

  const hoje = dataRelativaAHoje(0);
  const [ano, setAno] = useState(Number(hoje.slice(0, 4)));
  const [mes, setMes] = useState(Number(hoje.slice(5, 7)));
  const [diaSelecionado, setDiaSelecionado] = useState<string>(hoje);

  async function recarregar() {
    const [compromissosList, animaisList] = await Promise.all([
      listarCompromissos(),
      listarAnimais(),
    ]);
    setCompromissos(compromissosList);
    setAnimais(animaisList);
    setCarregando(false);
  }

  useEffect(() => {
    recarregar();
  }, []);

  const animaisPorId = useMemo(
    () => Object.fromEntries(animais.map((a) => [a.id, a])),
    [animais]
  );

  const diasComEventos = useMemo(() => {
    const contagem: Record<string, number> = {};
    for (const c of compromissos) {
      contagem[c.data] = (contagem[c.data] ?? 0) + 1;
    }
    return contagem;
  }, [compromissos]);

  const compromissosDoDia = compromissos
    .filter((c) => c.data === diaSelecionado)
    .sort((a, b) => (a.horario ?? "").localeCompare(b.horario ?? ""));

  async function handleNovoRetorno(dados: NovoCompromisso) {
    setSalvando(true);
    const novo = await criarCompromisso(dados);
    setSalvando(false);
    setMostrarForm(false);
    toast({ titulo: "Retorno agendado", descricao: "O compromisso já aparece na agenda." });
    setCompromissos((lista) => [novo, ...lista]);
    setDiaSelecionado(novo.data);
    setAno(Number(novo.data.slice(0, 4)));
    setMes(Number(novo.data.slice(5, 7)));
  }

  if (carregando) return <PageSkeleton label="Carregando agenda…" />;

  const nomeDia = `${formatarDiaSemana(diaSelecionado)}, ${formatarDataCurta(diaSelecionado)}`;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        titulo="Agenda"
        subtitulo="Retornos clínicos e atividades de pesquisa"
        acao={
          !mostrarForm && (
            <Button size="sm" onClick={() => setMostrarForm(true)}>
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Novo retorno</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          )
        }
      />

      {mostrarForm && (
        <Card className="mb-6 animate-pop-in">
          <CardBody>
            <NewAppointmentForm
              animais={animais}
              onSalvar={handleNovoRetorno}
              onCancelar={() => setMostrarForm(false)}
              salvando={salvando}
            />
          </CardBody>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <MonthCalendar
            ano={ano}
            mes={mes}
            diasComEventos={diasComEventos}
            selecionado={diaSelecionado}
            onSelecionar={setDiaSelecionado}
            onMudarMes={(novoAno, novoMes) => {
              setAno(novoAno);
              setMes(novoMes);
            }}
          />
        </div>

        <section aria-live="polite">
          <h2 className="mb-4 text-lg font-bold capitalize tracking-tight text-ink">
            {nomeDia}
          </h2>

          {compromissosDoDia.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-card border border-line/70 bg-surface px-6 py-12 text-center shadow-soft">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary">
                <CalendarClock className="h-6 w-6" />
              </span>
              <p className="text-base font-semibold text-ink">Nenhum compromisso neste dia</p>
              <p className="max-w-xs text-base text-ink-muted">
                Os dias com compromissos aparecem com um ponto no calendário.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {compromissosDoDia.map((c) => {
                const animal = animaisPorId[c.animalId];
                if (!animal) return null;
                return (
                  <AppointmentListItem
                    key={c.id}
                    compromisso={c}
                    nomeAnimal={animal.nome}
                    href={
                      c.tipo === "atividade_pesquisa" && c.projetoId
                        ? `/pesquisa/${c.projetoId}`
                        : `/animais/${animal.id}`
                    }
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
