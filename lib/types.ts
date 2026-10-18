/**
 * Tipos de domínio da aplicação.
 *
 * Estes tipos foram desenhados para espelhar o formato que as tabelas
 * assumiriam em um banco Postgres (Supabase): ids como string (uuid),
 * datas como string ISO (timestamptz/date) e nomes de campo em
 * português para casar 1:1 com as colunas do banco no futuro.
 */

export type Perfil = "veterinaria" | "responsavel";

export type Sexo = "macho" | "femea";

export type Porte = "pequeno" | "medio" | "grande" | "gigante";

export interface Animal {
  id: string;
  nome: string;
  raca: string;
  sexo: Sexo;
  dataNascimento: string; // ISO date (yyyy-mm-dd)
  porte: Porte;
  responsavelNome: string;
  fotoUrl?: string | null;
  criadoEm: string; // ISO datetime
}

export type NovoAnimal = Omit<Animal, "id" | "criadoEm">;

export interface MedidasCorporais {
  circunferenciaToracica?: number; // cm
  circunferenciaAbdominal?: number; // cm
  comprimentoCorporal?: number; // cm
  alturaCernelha?: number; // cm
}

export interface AvaliacaoCorporal {
  id: string;
  animalId: string;
  data: string; // ISO date (yyyy-mm-dd)
  peso: number; // kg
  escoreCorporal: number; // escala 1-9
  massaGorda?: number | null; // %
  massaMagra?: number | null; // %
  medidas?: MedidasCorporais;
  fotoUrl?: string | null;
  observacoes?: string;
  criadoEm: string; // ISO datetime
}

export type NovaAvaliacao = Omit<AvaliacaoCorporal, "id" | "criadoEm">;

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  crmv?: string;
}

/**
 * -----------------------------------------------------------------------
 * Modelos da Versão 2.0
 * -----------------------------------------------------------------------
 * Mapeamento sugerido para as futuras tabelas Supabase/Postgres (nomes em
 * inglês, conforme convenção de schema), mantendo os campos em português
 * no código da aplicação para consistência com o restante do projeto:
 *
 *   Animal              -> patients
 *   AvaliacaoCorporal    -> assessments
 *   Recomendacao         -> recommendations
 *   Compromisso          -> appointments
 *   Documento            -> documents
 *   ProjetoPesquisa      -> research_projects
 *   ParticipacaoPesquisa -> research_participants
 *   AtividadePesquisa    -> research_activities
 *   Questionario         -> research_questionnaires
 *   RespostaQuestionario -> research_questionnaire_responses
 * -----------------------------------------------------------------------
 */

/**
 * Recomendações / Plano de manejo.
 *
 * Estrutura validada com a médica-veterinária: cada campo é um bloco de
 * texto livre, exibido separadamente (nunca como um único texto corrido).
 * Todo o conteúdo é INFORMADO pela médica-veterinária — o sistema não
 * calcula quantidade de alimento, quantidade por refeição, nem prescreve
 * atividade física ou petiscos.
 */
export interface Recomendacao {
  id: string;
  animalId: string;
  data: string; // ISO date — data em que a recomendação foi registrada
  alimentoPrincipal?: string; // ex.: "100 g/dia, em 3 refeições de ~33 g"
  petisco?: string; // ex.: "100 g de pepino, ao longo do dia"
  agua?: string; // ex.: "Fornecer água à vontade"
  atividadeFisica?: string; // ex.: "Caminhadas leves de até 15 min/dia"
  outrasOrientacoes?: string;
  criadoEm: string; // ISO datetime
}

export type NovaRecomendacao = Omit<Recomendacao, "id" | "criadoEm">;

/** Tipo de compromisso na agenda — distingue retorno clínico de atividade de pesquisa. */
export type TipoCompromisso = "retorno_clinico" | "atividade_pesquisa";

export type StatusCompromisso =
  | "agendado"
  | "concluido"
  | "cancelado";

/**
 * Status da confirmação de presença pelo responsável — independente do
 * `status` do compromisso em si. O responsável nunca altera a agenda
 * diretamente: "confirmar" apenas marca a presença, e "remarcar" apenas
 * registra uma solicitação para a veterinária tratar.
 */
export type StatusConfirmacao = "aguardando" | "confirmado" | "remarcacao_solicitada";

export interface Compromisso {
  id: string;
  animalId: string;
  tipo: TipoCompromisso;
  titulo: string; // ex.: "Retorno do programa de controle de peso"
  data: string; // ISO date
  horario?: string; // ex.: "14:00"
  descricao?: string;
  /** Orientação para o retorno, informada pela veterinária (ex.: jejum). */
  orientacaoRetorno?: string;
  /** Relevante principalmente para retorno_clinico; ver StatusConfirmacao. */
  statusConfirmacao?: StatusConfirmacao;
  projetoId?: string; // preenchido quando tipo === "atividade_pesquisa"
  status: StatusCompromisso;
  criadoEm: string; // ISO datetime
}

export type NovoCompromisso = Omit<Compromisso, "id" | "criadoEm">;

/**
 * Documentos e exames do paciente (simulados nesta etapa — sem upload
 * real). `arquivoUrl` guarda uma data URL quando o usuário simula o
 * envio de um arquivo pela interface.
 */
export interface Documento {
  id: string;
  animalId: string;
  avaliacaoId?: string; // associação opcional com um retorno específico
  titulo: string; // ex.: "Hemograma"
  tipoArquivo: string; // ex.: "PDF", "JPG"
  data: string; // ISO date
  descricao?: string;
  arquivoUrl?: string | null;
  criadoEm: string; // ISO datetime
}

export type NovoDocumento = Omit<Documento, "id" | "criadoEm">;

/**
 * -----------------------------------------------------------------------
 * Módulo de Projetos de Pesquisa (independente do acompanhamento corporal,
 * compartilhando apenas o cadastro de animais/responsáveis).
 * -----------------------------------------------------------------------
 */

export type StatusProjeto = "planejado" | "em_andamento" | "concluido";

export interface ProjetoPesquisa {
  id: string;
  nome: string;
  descricao: string;
  periodoInicio: string; // ISO date
  periodoFim?: string; // ISO date
  status: StatusProjeto;
  criadoEm: string; // ISO datetime
}

export type StatusParticipacao = "ativo" | "concluido" | "inativo";

/** Vínculo de um animal já cadastrado a um projeto de pesquisa. */
export interface ParticipacaoPesquisa {
  id: string;
  projetoId: string;
  animalId: string;
  status: StatusParticipacao;
  dataInclusao: string; // ISO date
}

export type StatusAtividade = "concluido" | "pendente" | "agendado" | "futuro";

export interface AtividadePesquisa {
  id: string;
  projetoId: string;
  data: string; // ISO date
  titulo: string;
  instrucao?: string; // ex.: "Comparecer ao hospital" / "Responsável deve responder"
  status: StatusAtividade;
  questionarioId?: string; // preenchido quando a atividade envolve um questionário
}

export interface PerguntaQuestionario {
  id: string;
  texto: string;
  tipo: "escala" | "texto";
  opcoes?: string[]; // usado quando tipo === "escala"
}

/**
 * Cada projeto de pesquisa possui seu(s) próprio(s) questionário(s) —
 * não existe um questionário único compartilhado entre projetos.
 * `projetoId` é a referência que garante esse vínculo individual.
 */
export interface Questionario {
  id: string;
  projetoId: string;
  titulo: string;
  perguntas: PerguntaQuestionario[];
}

/** Resposta simulada (sem backend) de um responsável a um questionário. */
export interface RespostaQuestionario {
  id: string;
  questionarioId: string;
  animalId: string;
  respostas: Record<string, string>; // perguntaId -> resposta
  enviadoEm: string; // ISO datetime
}

