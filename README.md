# VetCheck

O VetCheck é uma aplicação web para acompanhar a evolução corporal de cães, principalmente em programas de controle e perda de peso. Ele reúne as avaliações feitas a cada consulta e retorno, mostra a evolução do paciente de forma visual e permite que o responsável pelo animal acompanhe o tratamento pelo celular.

## Funcionalidades

- Cadastro de pacientes e registro de avaliações corporais, com histórico, gráficos de evolução, comparação entre avaliações e relatório pós-retorno
- Recomendações e plano de manejo, além de documentos e exames de cada paciente
- Agenda de retornos em calendário mensal, com orientações para o retorno
- Projetos de pesquisa, com cronograma de atividades e questionários
- Dois perfis de uso: a veterinária gerencia pacientes, avaliações e agenda; o responsável acompanha a evolução do animal, confirma presença ou solicita remarcação de retornos e responde aos questionários da pesquisa

## Tecnologias

- Next.js 14 (App Router)
- React 18 e TypeScript
- Tailwind CSS
- Recharts, para os gráficos
- Lucide React, para os ícones

## Como executar

É necessário ter o Node.js 18 ou superior instalado.

```bash
npm install
npm run dev
```

Depois, acesse `http://localhost:3000` e escolha um perfil na tela inicial.

## Status

O projeto está em desenvolvimento e, por enquanto, utiliza dados de demonstração.
