# VetCheck - Versão 2

Protótipo funcional e navegável (sem backend) para validar o fluxo de uso de
uma plataforma de acompanhamento veterinário com dois grandes contextos:

1. **Acompanhamento corporal / programa de controle de peso**
2. **Projetos de pesquisa**

Os dois contextos vivem na mesma aplicação e compartilham o cadastro de
animais e responsáveis, mas têm telas e fluxos próprios — não se misturam.

Todos os dados são mockados em memória (`lib/mock-data.ts`). Nada é enviado
a um servidor — a aplicação roda inteiramente no navegador.

## Como executar localmente

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`. Na tela de login, escolha um dos perfis de
demonstração:

- **Entrar como Veterinária** — Dra. Camila Andrade. Acesso completo:
  pacientes, avaliações, evolução, recomendações, documentos, agenda,
  relatórios e projetos de pesquisa.
- **Entrar como Responsável** — Mariana Silva, responsável pelo paciente
  "Thor" (pré-carregado com histórico completo: avaliações, recomendações,
  agenda e participação em um projeto de pesquisa).

Não há senha real: a sessão é simulada e guardada em `localStorage`.

## Dependências principais

| Pacote | Uso |
| --- | --- |
| `next` | Framework (App Router) |
| `react` / `react-dom` | Base da aplicação |
| `typescript` | Tipagem estática |
| `tailwindcss` | Estilização utilitária |
| `recharts` | Gráficos de evolução (peso, ECC, composição) |
| `lucide-react` | Ícones |
| `date-fns` | Utilitário de datas (reservado para uso futuro) |
| `clsx` | Composição condicional de classes CSS |

## Estrutura de pastas

```
app/
  login/                          Login (seleção de perfil)
  (app)/                          Área da veterinária/pesquisadora (protegida)
    dashboard/                     Lista de pacientes
    agenda/                        Retornos clínicos + atividades de pesquisa
    pesquisa/                      Listagem de projetos de pesquisa
    pesquisa/[projetoId]/          Detalhes do projeto (participantes,
                                    cronograma, questionários, documentos)
    animais/novo/                  Cadastro de animal
    animais/[id]/                  Detalhes do animal (hub de navegação)
    animais/[id]/avaliacoes/       Histórico de avaliações
    animais/[id]/avaliacoes/nova/  Nova avaliação corporal
    animais/[id]/evolucao/         Evolução (cards, gráficos, ECC visual)
    animais/[id]/comparacao/       Comparação inicial / anterior / atual
    animais/[id]/recomendacoes/    Recomendações e plano de manejo
    animais/[id]/documentos/       Documentos e exames (upload simulado)
    animais/[id]/relatorio/        Relatório pós-retorno
  responsavel/                     Área do responsável (protegida, leitura)
    page.tsx                       "Meu Animal"
    pesquisa/                      Projeto de pesquisa do animal (se houver)
  compartilhar/[id]/               Link simplificado, sem login

components/
  ui/              Primitivos reutilizáveis (Button, Card, Field, Badge,
                    Stat, NavCard...)
  layout/          Cabeçalhos e navegação (AppHeader, VetSecondaryNav)
  animals/         Avatar, card e formulário de animal
  assessments/      Formulário/lista de avaliação, escala do ECC, silhueta
                    ilustrativa (BodySilhouette — 9 níveis contínuos)
  charts/           Gráficos de peso, ECC e composição corporal (Recharts)
  recommendations/  Formulário e card de recomendações / plano de manejo
  documents/         Item de lista de documentos/exames
  agenda/            Item de lista de compromissos
  research/          Card de projeto, timeline de atividades, formulário
                      de questionário

lib/
  types.ts                 Tipos de domínio (ver seção "Modelos" abaixo)
  constants.ts              Opções de formulário, faixas e labels de status
  utils.ts                  Formatação, cálculo de idade e variações
  mock-data.ts              Dados fictícios de toda a aplicação
  services/                 Camada de acesso a dados (ver abaixo)

context/
  AuthContext.tsx           Sessão mockada (perfil veterinária/responsável)
```

## Modelos (tipos) da Versão 2

Além de `Animal` e `AvaliacaoCorporal` (já existentes), foram adicionados:

- `Recomendacao` — plano de manejo em blocos (`alimentoPrincipal`,
  `petisco`, `agua`, `atividadeFisica`, `outrasOrientacoes`), estrutura
  validada com a Dra. Camila na segunda rodada. Todos os campos são texto
  livre informado pela veterinária; nada é calculado automaticamente.
- `Compromisso` — item de agenda, com `tipo: "retorno_clinico" |
  "atividade_pesquisa"`, `orientacaoRetorno` (ex.: jejum) e
  `statusConfirmacao` (`aguardando` / `confirmado` /
  `remarcacao_solicitada`) para o fluxo de confirmação do responsável.
- `Documento` — documentos/exames do paciente (upload simulado).
- `ProjetoPesquisa`, `ParticipacaoPesquisa`, `AtividadePesquisa`,
  `Questionario`, `RespostaQuestionario` — módulo de projetos de pesquisa,
  vinculado aos animais via `ParticipacaoPesquisa` (sem duplicar cadastro).
  Cada projeto tem seu(s) próprio(s) questionário(s) — `Questionario`
  referencia `projetoId`, não existe questionário único compartilhado.

Cada tipo tem, em `lib/types.ts`, um comentário com o nome sugerido para a
futura tabela Supabase/Postgres (ex.: `Recomendacao` → `recommendations`).

## Refinamentos da segunda validação (esta rodada)

- **Recomendações em blocos**: `RecommendationCard`/`RecommendationForm`
  reescritos para os 5 blocos validados, sempre exibidos separadamente
  (nunca como texto único).
- **Agenda em calendário mensal** (`MonthCalendar`): navegação entre
  meses, indicador de dias com compromissos, painel do dia selecionado.
  Novo formulário de retorno (`NewAppointmentForm`) com atalhos "15 dias" /
  "30 dias" / "escolher outra data".
- **Orientação para o retorno** (`Compromisso.orientacaoRetorno`),
  cadastrada pela veterinária e exibida também ao responsável.
- **Confirmação de presença / remarcação** (`NextAppointmentCard`): o
  responsável nunca edita a agenda diretamente — apenas confirma presença
  ou registra uma solicitação de remarcação (`appointmentService.
  confirmarPresenca` / `solicitarRemarcacao`).
- **Lembretes simulados dentro do app** (`ReturnReminderBanner`): compara
  a data atual com a do retorno (`diasAteData`) e avisa 7 dias e 1 dia
  antes — sem push/e-mail/WhatsApp, estrutura pronta para um canal real
  futuro.
- **Questionário por projeto**: cada `ProjetoPesquisa` tem seu próprio
  `Questionario` (ex.: dieta × hábitos alimentares), nunca um questionário
  único compartilhado.
- **`BodySilhouette` refinada**: indicação sutil de costelas visíveis
  (escores baixos) e reforço abdominal (escores altos) — inspirada
  apenas na lógica de um material de referência de ECC, com ilustração
  100% original (nenhuma arte de terceiros foi copiada).

## Preparado para integração futura com Supabase/PostgreSQL

Toda leitura/escrita passa pela camada `lib/services/*`
(`animalService`, `assessmentService`, `recommendationService`,
`appointmentService`, `documentService`, `researchService`). Hoje operam
sobre arrays em memória, mas já têm assinatura assíncrona (`Promise`) e
formato de dados compatível com uma futura chamada Supabase — por exemplo:

```ts
// hoje
export async function listarAnimais(): Promise<Animal[]> { ... }

// no futuro, troca-se apenas o corpo da função:
export async function listarAnimais(): Promise<Animal[]> {
  const { data } = await supabase.from("patients").select("*");
  return data;
}
```

`documentService.criarDocumento` já está isolado especificamente para que,
no futuro, o envio real de arquivo (Supabase Storage) substitua a
simulação atual sem alterar as telas que o consomem.

## Observações sobre o escopo desta versão

- Nenhuma fórmula clínica foi criada: massa gorda/magra, medidas e ECC
  continuam sendo apenas registrados, nunca calculados automaticamente.
- A "representação visual" do ECC (`BodySilhouette`) é uma ilustração SVG
  própria e genérica (não copiada de associações veterinárias, não gerada
  por IA), com a curva do corpo calculada continuamente para os 9 níveis
  da escala. É apoio visual e não constitui diagnóstico — texto explícito
  disponível via `aria-label` do componente.
- Upload de documentos e envio de questionários são simulados (sem
  servidor). O envio das respostas do questionário fica em memória durante
  a sessão.
- O módulo de pesquisa não substitui TCLE/CEUA/CEP nem qualquer
  procedimento ético formal — a tela de documentos do projeto deixa isso
  explícito.
- Não foram implementados: autenticação real, banco de dados, IA,
  diagnóstico automático, recomendação automática, assinatura digital,
  Google Calendar, notificações, pagamentos, chat ou WhatsApp — conforme
  escopo definido para esta etapa.

## Dados reais incorporados (planilha da Dra. Camila)

A paciente **Mel** foi atualizada com dados reais da planilha
`Software_Acompanhamento_do_Emagrecimento.xlsx` (abas "Morfometria",
"Prescrição" e "Perda de Peso Semanal"), fornecida como referência —
**não como especificação de tela**. O que foi incorporado:

- **Cadastro**: raça (SRD), porte (pequeno) e data de nascimento
  corrigidos para os valores reais da planilha.
- **Avaliações** (`aval_mel_1`/`aval_mel_2`): peso, ECC, massa gorda/magra
  e circunferência torácica são os valores reais de 30/04/2025 e
  10/09/2026. Os demais campos de medidas (abdominal, comprimento,
  cernelha) ficaram em branco por não haver correspondência direta na
  planilha — nenhum valor foi inventado para eles.
- **Recomendação** (`rec_mel_1`): quantidade de alimento principal
  (106 g/dia) e de petisco/pepino (354 g/dia) são os *resultados* já
  calculados na aba "Prescrição" da planilha, apenas transcritos como
  texto — **a fórmula de cálculo (NEPP, fator, kcal/g) não foi
  implementada no sistema**, só o resultado final é exibido, como já
  acontecia com as demais recomendações.
- **Agenda** (`compr_mel_checkin_peso`): registro do retorno de
  acompanhamento semanal (peso, semanas, perda em g e % — aba "Perda de
  Peso Semanal"), incluído como um compromisso concluído, já que a
  planilha não trouxe um novo ECC/composição nesse retorno (apenas peso).
- A escala **%MG por ECC** (ECC 8 → 37% de massa gorda, ECC 6 → 27%) já
  existente na planilha da Dra. Camila foi usada só para *conferir* os
  valores digitados nos mocks — o aplicativo continua sem calcular isso
  automaticamente.
- O paciente **Thor** não tinha correspondência na planilha (que traz
  apenas a Mel) e permanece com os dados já validados em rodadas
  anteriores.
- **Datas relativas**: os próximos retornos (`compr_thor_retorno`,
  `compr_mel_retorno` etc.) são calculados relativos ao dia em que o app é
  executado (`dataRelativaAHoje`), para que os lembretes de 7 dias / 1 dia
  sempre demonstrem corretamente, independentemente de quando for testado.
