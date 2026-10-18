"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
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
    setCompromissos((lista) => [novo, ...lista]);
    setDiaSelecionado(novo.data);
    setAno(Number(novo.data.slice(0, 4)));
    setMes(Number(novo.data.slice(5, 7)));
  }

  if (carregando) return <Spinner label="Carregando agenda…" />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        titulo="Agenda"
        subtitulo="Retornos clínicos e atividades de pesquisa"
        acao={
          !mostrarForm && (
            <Button size="sm" onClick={() => setMostrarForm(true)}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Novo retorno</span>
            </Button>
          )
        }
      />

      {mostrarForm && (
        <Card className="mb-5">
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

      <div className="mt-5">
        <h2 className="mb-3 text-sm font-medium text-ink-muted">
          {formatarDiaSemana(diaSelecionado)}, {formatarDataCurta(diaSelecionado)}
        </h2>

        {compromissosDoDia.length === 0 ? (
          <p className="rounded-card border border-dashed border-line bg-surface px-4 py-8 text-center text-sm text-ink-muted">
            Nenhum compromisso neste dia.
          </p>
        ) : (
          <div className="space-y-3">
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
      </div>

      {compromissos.length === 0 && (
        <div className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
          <CalendarClock className="h-4 w-4" />
          Nenhum compromisso registrado ainda.
        </div>
      )}
    </div>
  );
}
