# Relatório de atualizações de UX/UI — consolidação de componentes e padronização de páginas

**Branch:** `feat/ux-ui-consolidacao` · **Base:** `origin/main` · **Data:** 2026-08-20

## Resumo

Este PR consolida componentes de UI duplicados, padroniza o padrão de filtro/tabela/estado-vazio/confirmação usado nas páginas de gestão, CRM, estoque, fornecedores, tratamentos e administração, e introduz cor distinta por módulo para facilitar a orientação visual (wayfinding). O resultado líquido é **redução de código** (2.608 inserções / 4.675 remoções em 80 arquivos) com o mesmo comportamento visual de hoje — nenhuma reescrita de layout ou do sistema de design já em produção.

## Contexto importante: por que este PR não mexe no layout principal

Ao investigar o repositório para abrir este PR, encontrei uma divergência: o checkout local estava 16 commits atrás do `origin/main`. Nesse intervalo, o `origin/main` já havia recebido **outro redesign**, feito via Lovable/gpt-engineer-app bot ("feat: redesign completo ÁUREA Clinic — design system, layout, UX/UI" + vários commits "Refactored layout & tokens"), que substituiu a arquitetura de layout: `Layout.tsx` hoje delega para `AppShell`/`MobileShell` (pasta `src/components/shell/`, com `ModuleRail`, `SubNav`, `Topbar`, `CommandPalette`, `nav-config.ts`), no lugar do antigo `AppSidebar`/`TopBar`.

O trabalho de UX/UI que existia localmente (não commitado) tinha sido feito em cima da base antiga, antes desse redesign. Para não brigar com o que já está em produção, cada arquivo foi conferido individualmente contra o `origin/main` atual antes de decidir o que reaplicar:

- **Reaplicado como estava** — arquivos que o redesign do Lovable não tocou (a grande maioria: páginas de gestão, CRM, estoque, fornecedores, tratamentos, admin, BI).
- **Adaptado** — arquivos tocados por ambos os lados (`PageHeader.tsx`, `tailwind.config.ts`, `src/index.css`, `PlanosTratamentoPage.tsx`, navegação mobile), mesclados manualmente para não perder nem o redesign novo nem o trabalho de consolidação.
- **Descartado** — mudanças em `AppSidebar.tsx`, `TopBar.tsx`, `Layout.tsx`, `Dashboard.tsx`, `Home.tsx` e `GestaoOperacional.tsx`: esses arquivos já foram redesenhados pelo Lovable e/ou os componentes antigos que a mudança local editava (`AppSidebar`, `TopBar`) hoje **não são mais importados por nada** — código morto substituído pelo shell novo. Reaplicar essas edições não teria efeito visual e só adicionaria ruído.

O `.card-kpi` e o sistema de glass/gradiente/sombra que já está no ar em `src/index.css` **não foi removido** — a versão local antiga propunha substituí-lo por um sistema "flat" de 3 níveis, mas isso é uma decisão de direção visual maior que caberia a uma conversa própria, não a uma reconciliação de branches. Os componentes novos deste PR usam o mesmo estilo de card (`rounded-2xl border border-border/50 bg-card shadow-sm`) que já é usado em todo o app hoje.

## O que mudou

### 1. Cor por módulo (wayfinding)
`tailwind.config.ts` e `src/index.css` ganharam tokens `--module-financeiro`, `--module-crm`, `--module-admin`, `--module-bi` e `--module-gestao` com matizes distintos (antes, todos apontavam para `var(--primary)` — mesma cor dourada/teal para os cinco módulos). É aditivo: nenhum token existente foi removido ou renomeado.

### 2. Componentes de UI duplicados, consolidados em um só
Havia até 4 versões do mesmo cartão de KPI e 2 versões de estado vazio, cada uma em um canto diferente do código:

| Antes (removido) | Depois |
|---|---|
| `components/dashboard/KPICard.tsx`, `components/dashboard/AdvancedKPICard.tsx`, `components/bi/BIKPICard.tsx`, `components/mobile/MobileKPICard.tsx` | `components/ui/KPICard.tsx` (props `label`, `value`, `icon`, `tone`, `trend`, `size`) |
| `components/admin/EmptyState.tsx`, `components/mobile/MobileEmptyState.tsx` | `components/ui/EmptyState.tsx` |
| `components/admin/ConfirmDialog.tsx` | `components/ui/ConfirmDialog.tsx` (agora reutilizável fora do módulo admin) |
| `components/ui/GlassCard.tsx`, `components/ui/ModularGrid.tsx`, `components/ui/sidebar.tsx`, `components/ModuleNav.tsx` | removidos — confirmado que nada mais importava esses arquivos |

Cada duplicata tinha pequenas diferenças de API e de estilo que nunca eram intencionais — eram só cópias que foram divergindo. Antes de apagar qualquer arquivo, conferi (via `grep`) que não sobrava nenhuma importação órfã; o único caso com uso real (`BIKPICard` em `BusinessIntelligence.tsx`) foi migrado para o componente único.

### 3. Três componentes novos, para parar de repetir o mesmo bloco em cada página
- **`FilterBar`** — casca de layout para a barra de busca + filtros (`Select`, etc.) que se repetia, com pequenas variações, em praticamente toda página com listagem.
- **`DataTableRowActions`** — ordem padrão de ações de linha (Ver → Editar → ações de status → Excluir), com suporte a ações de domínio coloridas por tom (ex.: "Marcar como Assinado" em verde, "Cancelar" em vermelho).
- **`LoadingState`** — substitui o texto solto "Carregando..." que cada tabela escrevia à mão.

### 4. Padronização aplicada às páginas
As páginas abaixo passaram a usar os componentes acima no lugar de blocos de JSX ad-hoc (Card com KPI manual, `<Search>` + `<Input>` copiado e colado, texto de loading solto, `AlertDialog` reescrito a cada exclusão):

**Gestão:** Contratos, Anamneses, Exames, Fotos, Receituários, Prontuários, Planos de Tratamento
**CRM:** Pipeline, Agendamentos, Leads, Leads Perdidos, Pacientes, Ficha do Paciente
**Financeiro/Estoque/Fornecedores/Tratamentos:** filtros e KPIs de Estoque, Fornecedores, Tratamentos, Pacientes
**Admin:** Auditoria, Checklists, Documentos, LGPD, Usuários, Solicitações de Acesso
**BI:** gráficos de LTV/CAC, Marketing ROAS, Projeções, e a página de Business Intelligence

### 5. Navegação: duas correções de itens sem entrada no menu
Ao revisar a fonte única de navegação (`src/components/shell/nav-config.ts`, usada pelo `ModuleRail`, `SubNav` e pelo menu "Mais" do mobile), encontrei duas telas que já existiam e funcionavam, mas não tinham link em lugar nenhum da UI:

- **Leads Perdidos** (`/crm/leads-perdidos`) — a página existe desde antes, mas não havia rota em `App.tsx` nem item de menu. Além de cadastrar os dois, corrigi o atalho horizontal do Pipeline mobile, que apontava para `/crm/perdidos` (rota inexistente) — agora deriva do mesmo `nav-config.ts` em vez de manter uma lista hardcoded própria.
- **Checklists** (`/admin?tab=checklists`) — a aba já existe dentro da página Admin, mas não tinha atalho direto no rail/menu administrativo.

### 6. Páginas placeholder órfãs, removidas
`AdminPlaceholder.tsx`, `BIPlaceholder.tsx`, `CRMPlaceholder.tsx` e `Index.tsx` não eram mais referenciados por nenhuma rota — sobras de uma versão anterior do roteamento.

## O que foi validado

- `tsc --noEmit`: limpo (sem erros, igual ao baseline do `origin/main`).
- `vite build`: build de produção completa sem erros (os únicos avisos — tamanho de chunk e import dinâmico duplicado — já existiam antes deste PR).
- `eslint`: a contagem de problemas (475) é equivalente ao baseline do checkout antigo (478) — os erros existentes são `no-explicit-any` em código pré-existente (principalmente Supabase Edge Functions) e não foram introduzidos por este PR.

## Fora do escopo (de propósito)

- Não mexi em `AppSidebar.tsx`/`TopBar.tsx` (código morto, mas removê-los é uma limpeza separada, sem relação com UX visível).
- Não toquei em `Dashboard.tsx`, `Home.tsx` nem `GestaoOperacional.tsx` — já foram redesenhados na onda do Lovable; misturar os dois exigiria decidir qual visual "vence", o que não é uma chamada que eu deveria tomar sozinho.
- Não removi o sistema de glass/gradiente/sombra de `index.css` — é uma mudança de direção visual maior, não uma consolidação.
- Os arquivos em `Processos TD/` (documentos de protocolo clínico) não foram tocados — não têm relação com o código.
