import {
  Animal,
  AtividadePesquisa,
  AvaliacaoCorporal,
  Compromisso,
  Documento,
  ParticipacaoPesquisa,
  ProjetoPesquisa,
  Questionario,
  Recomendacao,
  Usuario,
} from "@/lib/types";
import { dataRelativaAHoje } from "@/lib/utils";

/**
 * Dados mockados usados enquanto não há integração com banco de dados.
 * A forma dos objetos já reflete o esquema pensado para as tabelas
 * `animais` e `avaliacoes_corporais` em um futuro banco Postgres/Supabase.
 */

export const USUARIO_MOCK: Usuario = {
  id: "user_1",
  nome: "Dra. Camila Andrade",
  email: "camila.andrade@vetcheck.com.br",
  crmv: "CRMV-SP 32145",
};

/**
 * Conta de demonstração do responsável (login mockado, sem backend).
 * Neste protótipo, o responsável visualiza somente o animal indicado aqui.
 */
export const RESPONSAVEL_MOCK = {
  nome: "Mariana Silva",
  animalId: "animal_thor",
};

export const ANIMAIS_MOCK: Animal[] = [
  {
    id: "animal_thor",
    nome: "Thor",
    raca: "Labrador Retriever",
    sexo: "macho",
    dataNascimento: "2019-04-10",
    porte: "grande",
    responsavelNome: "Mariana Silva",
    fotoUrl: null,
    criadoEm: "2025-11-10T13:20:00.000Z",
  },
  {
    id: "animal_luna",
    nome: "Luna",
    raca: "Poodle",
    sexo: "femea",
    dataNascimento: "2019-07-02",
    porte: "pequeno",
    responsavelNome: "Carla Mendes",
    fotoUrl: null,
    criadoEm: "2025-12-05T10:05:00.000Z",
  },
  {
    id: "animal_bento",
    nome: "Bento",
    raca: "Sem raça definida (SRD)",
    sexo: "macho",
    dataNascimento: "2022-01-20",
    porte: "medio",
    responsavelNome: "Fernanda Lima",
    fotoUrl: null,
    criadoEm: "2026-01-08T09:40:00.000Z",
  },
  {
    id: "animal_mel",
    nome: "Mel",
    raca: "SRD (Sem Raça Definida)",
    sexo: "femea",
    dataNascimento: "2019-09-13",
    porte: "pequeno",
    responsavelNome: "Ricardo Souza",
    fotoUrl: null,
    criadoEm: "2025-04-30T14:00:00.000Z",
  },
  {
    id: "animal_nina",
    nome: "Nina",
    raca: "Shih Tzu",
    sexo: "femea",
    dataNascimento: "2023-05-30",
    porte: "pequeno",
    responsavelNome: "Beatriz Costa",
    fotoUrl: null,
    criadoEm: "2026-09-08T11:15:00.000Z",
  },
];

export const AVALIACOES_MOCK: AvaliacaoCorporal[] = [
  // Thor — plano de controle de peso, acompanhado pela responsável Mariana Silva
  {
    id: "aval_thor_1",
    animalId: "animal_thor",
    data: "2026-05-15",
    peso: 32.0,
    escoreCorporal: 8,
    massaGorda: 48,
    massaMagra: 52,
    medidas: {
      circunferenciaToracica: 80,
      circunferenciaAbdominal: 84,
      comprimentoCorporal: 90,
      alturaCernelha: 57,
    },
    fotoUrl: null,
    observacoes:
      "Primeira consulta do programa de controle de peso. Rotina alimentar sem controle de porções.",
    criadoEm: "2026-05-15T13:20:00.000Z",
  },
  {
    id: "aval_thor_2",
    animalId: "animal_thor",
    data: "2026-06-10",
    peso: 30.8,
    escoreCorporal: 7,
    massaGorda: 44,
    massaMagra: 56,
    medidas: {
      circunferenciaToracica: 78,
      circunferenciaAbdominal: 80,
      comprimentoCorporal: 90,
      alturaCernelha: 57,
    },
    fotoUrl: null,
    observacoes: "Boa resposta à dieta. Iniciadas caminhadas diárias de 30 min.",
    criadoEm: "2026-06-10T14:00:00.000Z",
  },
  {
    id: "aval_thor_3",
    animalId: "animal_thor",
    data: "2026-07-01",
    peso: 29.6,
    escoreCorporal: 7,
    massaGorda: 41,
    massaMagra: 59,
    medidas: {
      circunferenciaToracica: 76,
      circunferenciaAbdominal: 77,
      comprimentoCorporal: 90,
      alturaCernelha: 57,
    },
    fotoUrl: null,
    observacoes: "Perda de peso consistente, sem sinais de fraqueza.",
    criadoEm: "2026-07-01T13:45:00.000Z",
  },
  {
    id: "aval_thor_4",
    animalId: "animal_thor",
    data: "2026-08-05",
    peso: 28.7,
    escoreCorporal: 6,
    massaGorda: 39,
    massaMagra: 61,
    medidas: {
      circunferenciaToracica: 75,
      circunferenciaAbdominal: 74,
      comprimentoCorporal: 90,
      alturaCernelha: 57,
    },
    fotoUrl: null,
    observacoes: "Cintura mais definida. Manter plano atual e reavaliar em 30 dias.",
    criadoEm: "2026-08-05T09:30:00.000Z",
  },

  // Luna — peso estável, próximo do ideal
  {
    id: "aval_luna_1",
    animalId: "animal_luna",
    data: "2025-12-05",
    peso: 5.8,
    escoreCorporal: 5,
    massaGorda: 22,
    massaMagra: 74,
    medidas: {
      circunferenciaToracica: 38,
      circunferenciaAbdominal: 36,
      comprimentoCorporal: 34,
      alturaCernelha: 28,
    },
    fotoUrl: null,
    observacoes: "Animal saudável, sem alterações relevantes.",
    criadoEm: "2025-12-05T10:05:00.000Z",
  },
  {
    id: "aval_luna_2",
    animalId: "animal_luna",
    data: "2026-02-14",
    peso: 6.0,
    escoreCorporal: 5,
    massaGorda: 23,
    massaMagra: 73,
    medidas: {
      circunferenciaToracica: 38,
      circunferenciaAbdominal: 37,
      comprimentoCorporal: 34,
      alturaCernelha: 28,
    },
    fotoUrl: null,
    observacoes: "",
    criadoEm: "2026-02-14T09:15:00.000Z",
  },
  {
    id: "aval_luna_3",
    animalId: "animal_luna",
    data: "2026-04-20",
    peso: 6.1,
    escoreCorporal: 5,
    massaGorda: 23,
    massaMagra: 73,
    medidas: {
      circunferenciaToracica: 39,
      circunferenciaAbdominal: 37,
      comprimentoCorporal: 34,
      alturaCernelha: 28,
    },
    fotoUrl: null,
    observacoes: "Pequena variação, dentro do esperado.",
    criadoEm: "2026-04-20T13:00:00.000Z",
  },
  {
    id: "aval_luna_4",
    animalId: "animal_luna",
    data: "2026-06-22",
    peso: 5.9,
    escoreCorporal: 4,
    massaGorda: 21,
    massaMagra: 75,
    medidas: {
      circunferenciaToracica: 38,
      circunferenciaAbdominal: 36,
      comprimentoCorporal: 34,
      alturaCernelha: 28,
    },
    fotoUrl: null,
    observacoes: "",
    criadoEm: "2026-06-22T15:20:00.000Z",
  },
  {
    id: "aval_luna_5",
    animalId: "animal_luna",
    data: "2026-08-30",
    peso: 5.9,
    escoreCorporal: 4,
    massaGorda: 21,
    massaMagra: 75,
    medidas: {
      circunferenciaToracica: 38,
      circunferenciaAbdominal: 36,
      comprimentoCorporal: 34,
      alturaCernelha: 28,
    },
    fotoUrl: null,
    observacoes: "Manter rotina alimentar atual.",
    criadoEm: "2026-08-30T10:40:00.000Z",
  },

  // Bento — recuperação de peso, historico curto
  {
    id: "aval_bento_1",
    animalId: "animal_bento",
    data: "2026-01-08",
    peso: 14.0,
    escoreCorporal: 3,
    massaGorda: 14,
    massaMagra: 78,
    medidas: {
      circunferenciaToracica: 52,
      circunferenciaAbdominal: 46,
      comprimentoCorporal: 62,
      alturaCernelha: 42,
    },
    fotoUrl: null,
    observacoes: "Animal resgatado, histórico de subnutrição.",
    criadoEm: "2026-01-08T09:40:00.000Z",
  },
  {
    id: "aval_bento_2",
    animalId: "animal_bento",
    data: "2026-03-15",
    peso: 15.2,
    escoreCorporal: 3,
    massaGorda: 15,
    massaMagra: 79,
    medidas: {
      circunferenciaToracica: 54,
      circunferenciaAbdominal: 47,
      comprimentoCorporal: 62,
      alturaCernelha: 42,
    },
    fotoUrl: null,
    observacoes: "Ganho de peso gradual conforme esperado.",
    criadoEm: "2026-03-15T11:00:00.000Z",
  },
  {
    id: "aval_bento_3",
    animalId: "animal_bento",
    data: "2026-05-10",
    peso: 16.5,
    escoreCorporal: 4,
    massaGorda: 17,
    massaMagra: 78,
    medidas: {
      circunferenciaToracica: 55,
      circunferenciaAbdominal: 49,
      comprimentoCorporal: 62,
      alturaCernelha: 42,
    },
    fotoUrl: null,
    observacoes: "",
    criadoEm: "2026-05-10T14:30:00.000Z",
  },
  {
    id: "aval_bento_4",
    animalId: "animal_bento",
    data: "2026-07-11",
    peso: 17.4,
    escoreCorporal: 4,
    massaGorda: 18,
    massaMagra: 78,
    medidas: {
      circunferenciaToracica: 56,
      circunferenciaAbdominal: 50,
      comprimentoCorporal: 62,
      alturaCernelha: 42,
    },
    fotoUrl: null,
    observacoes: "Boa evolução muscular.",
    criadoEm: "2026-07-11T10:00:00.000Z",
  },
  {
    id: "aval_bento_5",
    animalId: "animal_bento",
    data: "2026-09-01",
    peso: 18.0,
    escoreCorporal: 5,
    massaGorda: 19,
    massaMagra: 77,
    medidas: {
      circunferenciaToracica: 57,
      circunferenciaAbdominal: 51,
      comprimentoCorporal: 62,
      alturaCernelha: 42,
    },
    fotoUrl: null,
    observacoes: "Peso ideal alcançado. Seguir para manutenção.",
    criadoEm: "2026-09-01T09:00:00.000Z",
  },

  // Mel — dados reais da planilha de acompanhamento (Morfometria) da Dra.
  // Camila: avaliação inicial e reavaliação mais recente. %MG/%MM seguem a
  // tabela de referência por ECC já usada na planilha (ECC 8 → 37% MG;
  // ECC 6 → 27% MG). Peso meta calculado na planilha citado em observações.
  {
    id: "aval_mel_1",
    animalId: "animal_mel",
    data: "2025-04-30",
    peso: 10.65,
    escoreCorporal: 8,
    massaGorda: 37,
    massaMagra: 63,
    medidas: {
      circunferenciaToracica: 57,
    },
    fotoUrl: null,
    observacoes:
      "Avaliação inicial do programa de controle de peso. Peso meta calculado: 6,71 kg.",
    criadoEm: "2025-04-30T14:05:00.000Z",
  },
  {
    id: "aval_mel_2",
    animalId: "animal_mel",
    data: "2026-09-10",
    peso: 7.75,
    escoreCorporal: 6,
    massaGorda: 27,
    massaMagra: 73,
    medidas: {
      circunferenciaToracica: 51,
    },
    fotoUrl: null,
    observacoes:
      "Reavaliação após período de acompanhamento. Peso meta atualizado: 5,43 kg.",
    criadoEm: "2026-09-10T16:10:00.000Z",
  },

  // Nina — apenas uma avaliação (recém cadastrada)
  {
    id: "aval_nina_1",
    animalId: "animal_nina",
    data: "2026-09-08",
    peso: 6.8,
    escoreCorporal: 6,
    massaGorda: 27,
    massaMagra: 66,
    medidas: {
      circunferenciaToracica: 40,
      circunferenciaAbdominal: 41,
      comprimentoCorporal: 32,
      alturaCernelha: 26,
    },
    fotoUrl: null,
    observacoes: "Primeira consulta de acompanhamento corporal.",
    criadoEm: "2026-09-08T11:15:00.000Z",
  },
];

/* ------------------------------------------------------------------ */
/* Recomendações / Plano de manejo                                     */
/* ------------------------------------------------------------------ */

export const RECOMENDACOES_MOCK: Recomendacao[] = [
  {
    id: "rec_thor_0",
    animalId: "animal_thor",
    data: "2026-05-15",
    alimentoPrincipal: "260 g de ração por dia, divididos em 2 refeições diárias de 130 g cada.",
    petisco: "Evitar petiscos industrializados.",
    agua: "Fornecer água à vontade.",
    atividadeFisica: "Caminhadas curtas, conforme tolerância do animal.",
    outrasOrientacoes: "Reavaliar após 30 dias.",
    criadoEm: "2026-05-15T13:30:00.000Z",
  },
  {
    id: "rec_thor_1",
    animalId: "animal_thor",
    data: "2026-08-05",
    alimentoPrincipal: "220 g de ração por dia, divididos em 2 refeições diárias de 110 g cada.",
    petisco: "Até 100 g de chuchu cozido por dia, oferecido ao longo do dia.",
    agua: "Fornecer água à vontade.",
    atividadeFisica: "Caminhada leve de 10 a 15 minutos por dia.",
    outrasOrientacoes: "Dividir os petiscos ao longo do dia.",
    criadoEm: "2026-08-05T09:45:00.000Z",
  },
  // Mel — prescrição real da planilha (aba "Prescrição"), calculada a
  // partir do peso inicial (10,65 kg): NEPP, alimento principal e petisco
  // já computados pela Dra. Camila — valores apenas transcritos aqui.
  {
    id: "rec_mel_1",
    animalId: "animal_mel",
    data: "2025-04-30",
    alimentoPrincipal:
      "106 gramas de ração terapêutica por dia (cálculo com base no peso inicial de 10,65 kg), divididas em três refeições diárias de aproximadamente 35 gramas cada.",
    petisco:
      "Até 354 gramas de pepino por dia, oferecidas ao longo do dia ou junto da refeição principal.",
    agua: "Fornecer água à vontade.",
    atividadeFisica:
      "Caminhadas leves de até 15 minutos, diariamente ou em dias alternados, de acordo com a disponibilidade do responsável.",
    outrasOrientacoes:
      "Reavaliação da prescrição recomendada diante da redução de peso já alcançada desde o início do programa.",
    criadoEm: "2025-04-30T14:05:00.000Z",
  },
];

/* ------------------------------------------------------------------ */
/* Agenda                                                               */
/* ------------------------------------------------------------------ */

export const COMPROMISSOS_MOCK: Compromisso[] = [
  {
    id: "compr_thor_concluido",
    animalId: "animal_thor",
    tipo: "retorno_clinico",
    titulo: "Retorno do programa de controle de peso",
    data: "2026-08-05",
    horario: "09:30",
    status: "concluido",
    statusConfirmacao: "confirmado",
    criadoEm: "2026-07-01T13:50:00.000Z",
  },
  {
    id: "compr_bento_retorno",
    animalId: "animal_bento",
    tipo: "retorno_clinico",
    titulo: "Retorno do programa de ganho de peso",
    data: dataRelativaAHoje(11),
    horario: "11:00",
    status: "agendado",
    statusConfirmacao: "aguardando",
    criadoEm: "2026-09-01T09:05:00.000Z",
  },
  {
    id: "compr_luna_retorno",
    animalId: "animal_luna",
    tipo: "retorno_clinico",
    titulo: "Retorno de manutenção",
    data: dataRelativaAHoje(6),
    horario: "10:00",
    status: "agendado",
    statusConfirmacao: "aguardando",
    criadoEm: "2026-08-30T10:45:00.000Z",
  },
  {
    id: "compr_mel_checkin_peso",
    animalId: "animal_mel",
    tipo: "retorno_clinico",
    titulo: "Checagem de peso — acompanhamento semanal",
    data: "2025-06-04",
    status: "concluido",
    statusConfirmacao: "confirmado",
    descricao:
      "Peso de retorno: 10,3 kg (perda de 350 g em 5 semanas — 70 g/semana, 0,66%/semana).",
    criadoEm: "2025-06-04T10:00:00.000Z",
  },
  {
    id: "compr_mel_retorno",
    animalId: "animal_mel",
    tipo: "retorno_clinico",
    titulo: "Retorno do programa de controle de peso",
    data: dataRelativaAHoje(1),
    horario: "16:30",
    orientacaoRetorno: "Paciente deve estar em jejum alimentar de 12 horas.",
    status: "agendado",
    statusConfirmacao: "aguardando",
    criadoEm: "2026-09-05T16:20:00.000Z",
  },
  {
    id: "compr_thor_retorno",
    animalId: "animal_thor",
    tipo: "retorno_clinico",
    titulo: "Retorno do programa de controle de peso",
    data: dataRelativaAHoje(7),
    horario: "14:00",
    descricao: "Reavaliação de peso, ECC e ajuste do plano de manejo.",
    orientacaoRetorno: "Paciente deve estar em jejum alimentar de 12 horas.",
    status: "agendado",
    statusConfirmacao: "aguardando",
    criadoEm: "2026-08-05T09:50:00.000Z",
  },
  {
    id: "compr_thor_pesquisa",
    animalId: "animal_thor",
    tipo: "atividade_pesquisa",
    titulo: "Coleta de material — Estudo de Avaliação da Dieta X",
    data: dataRelativaAHoje(46),
    horario: "09:00",
    descricao: "Coleta de material biológico para o projeto de pesquisa.",
    projetoId: "proj_dieta_x",
    status: "agendado",
    criadoEm: "2026-08-05T09:50:00.000Z",
  },
];

/* ------------------------------------------------------------------ */
/* Documentos e exames                                                  */
/* ------------------------------------------------------------------ */

export const DOCUMENTOS_MOCK: Documento[] = [
  {
    id: "doc_thor_hemograma",
    animalId: "animal_thor",
    avaliacaoId: "aval_thor_4",
    titulo: "Hemograma",
    tipoArquivo: "PDF",
    data: "2026-09-12",
    descricao: "Hemograma completo de rotina.",
    arquivoUrl: null,
    criadoEm: "2026-09-12T08:00:00.000Z",
  },
  {
    id: "doc_thor_bioquimica",
    animalId: "animal_thor",
    titulo: "Bioquímica",
    tipoArquivo: "PDF",
    data: "2026-08-30",
    descricao: "Perfil bioquímico (função renal e hepática).",
    arquivoUrl: null,
    criadoEm: "2026-08-30T08:00:00.000Z",
  },
];

/* ------------------------------------------------------------------ */
/* Projetos de pesquisa                                                 */
/* ------------------------------------------------------------------ */

export const PROJETOS_PESQUISA_MOCK: ProjetoPesquisa[] = [
  {
    id: "proj_dieta_x",
    nome: "Estudo de Avaliação da Dieta X",
    descricao:
      "Acompanhamento da resposta clínica e da composição corporal de cães em programa de controle de peso, sob uso de uma dieta terapêutica específica.",
    periodoInicio: "2026-06-01",
    periodoFim: "2026-12-15",
    status: "em_andamento",
    criadoEm: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "proj_nutricional_canina",
    nome: "Projeto de Avaliação Nutricional Canina",
    descricao:
      "Levantamento observacional de hábitos alimentares e condição corporal em cães atendidos na rotina clínica.",
    periodoInicio: "2026-03-01",
    periodoFim: "2026-09-30",
    status: "em_andamento",
    criadoEm: "2026-02-15T10:00:00.000Z",
  },
];

export const PARTICIPACOES_PESQUISA_MOCK: ParticipacaoPesquisa[] = [
  {
    id: "part_thor_dietax",
    projetoId: "proj_dieta_x",
    animalId: "animal_thor",
    status: "ativo",
    dataInclusao: "2026-06-10",
  },
  {
    id: "part_mel_dietax",
    projetoId: "proj_dieta_x",
    animalId: "animal_mel",
    status: "ativo",
    dataInclusao: "2026-08-10",
  },
  {
    id: "part_bento_nutri",
    projetoId: "proj_nutricional_canina",
    animalId: "animal_bento",
    status: "ativo",
    dataInclusao: "2026-03-15",
  },
];

export const ATIVIDADES_PESQUISA_MOCK: AtividadePesquisa[] = [
  {
    id: "ativ_dietax_1",
    projetoId: "proj_dieta_x",
    data: "2026-06-10",
    titulo: "Avaliação inicial",
    instrucao: "Comparecer ao hospital",
    status: "concluido",
  },
  {
    id: "ativ_dietax_2",
    projetoId: "proj_dieta_x",
    data: dataRelativaAHoje(3),
    titulo: "Questionário de avaliação da dieta",
    instrucao: "Responsável deve responder",
    status: "pendente",
    questionarioId: "quest_dietax_1",
  },
  {
    id: "ativ_dietax_3",
    projetoId: "proj_dieta_x",
    data: "2026-10-30",
    titulo: "Coleta de material",
    instrucao: "Comparecer ao hospital",
    status: "agendado",
  },
  {
    id: "ativ_dietax_4",
    projetoId: "proj_dieta_x",
    data: "2026-11-15",
    titulo: "Avaliação de acompanhamento",
    instrucao: "Comparecer ao hospital",
    status: "futuro",
  },
  {
    id: "ativ_dietax_5",
    projetoId: "proj_dieta_x",
    data: "2026-11-30",
    titulo: "Avaliação final",
    instrucao: "Comparecer ao hospital",
    status: "futuro",
  },
  {
    id: "ativ_nutri_1",
    projetoId: "proj_nutricional_canina",
    data: "2026-03-15",
    titulo: "Cadastro e avaliação inicial",
    instrucao: "Comparecer ao hospital",
    status: "concluido",
  },
  {
    id: "ativ_nutri_2",
    projetoId: "proj_nutricional_canina",
    data: dataRelativaAHoje(5),
    titulo: "Questionário de hábitos alimentares",
    instrucao: "Responsável deve responder",
    status: "pendente",
    questionarioId: "quest_nutri_1",
  },
  {
    id: "ativ_nutri_3",
    projetoId: "proj_nutricional_canina",
    data: "2026-09-30",
    titulo: "Avaliação final do estudo",
    instrucao: "Comparecer ao hospital",
    status: "agendado",
  },
];

export const QUESTIONARIOS_MOCK: Questionario[] = [
  {
    id: "quest_dietax_1",
    projetoId: "proj_dieta_x",
    titulo: "Questionário de Avaliação da Dieta",
    perguntas: [
      {
        id: "p1",
        texto: "Como você avalia a aceitação da dieta pelo animal?",
        tipo: "escala",
        opcoes: ["Ótima", "Boa", "Regular", "Ruim"],
      },
      {
        id: "p2",
        texto: "Qual a facilidade de fornecimento da dieta no dia a dia?",
        tipo: "escala",
        opcoes: ["Muito fácil", "Fácil", "Difícil", "Muito difícil"],
      },
      {
        id: "p3",
        texto: "Observações adicionais",
        tipo: "texto",
      },
    ],
  },
  // Cada projeto possui seu próprio questionário — este é específico do
  // Projeto de Avaliação Nutricional Canina, com perguntas diferentes do
  // questionário do Estudo da Dieta X acima.
  {
    id: "quest_nutri_1",
    projetoId: "proj_nutricional_canina",
    titulo: "Questionário de Hábitos Alimentares",
    perguntas: [
      {
        id: "n1",
        texto: "Quantas refeições o animal recebe por dia, em geral?",
        tipo: "escala",
        opcoes: ["1", "2", "3", "4 ou mais"],
      },
      {
        id: "n2",
        texto: "Com que frequência o animal recebe petiscos?",
        tipo: "escala",
        opcoes: ["Nunca", "Raramente", "Algumas vezes por semana", "Diariamente"],
      },
      {
        id: "n3",
        texto: "Descreva brevemente a rotina alimentar do animal",
        tipo: "texto",
      },
    ],
  },
];

/**
 * Documentos do projeto de pesquisa — lista estática simplificada para
 * este protótipo (sem upload real). Os documentos e consentimentos de
 * cada projeto devem seguir os procedimentos éticos aprovados para ele.
 */
export const DOCUMENTOS_PROJETO_MOCK: Record<
  string,
  { titulo: string; descricao: string }[]
> = {
  proj_dieta_x: [
    {
      titulo: "Protocolo do estudo",
      descricao: "Objetivos, critérios de inclusão e metodologia do projeto.",
    },
    {
      titulo: "Termo de participação",
      descricao: "Orientações para os responsáveis pelos animais participantes.",
    },
  ],
  proj_nutricional_canina: [
    {
      titulo: "Protocolo do estudo",
      descricao: "Objetivos e metodologia do levantamento observacional.",
    },
  ],
};
