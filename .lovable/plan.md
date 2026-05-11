## Objetivo

Refazer do zero a camada de apresentação do sistema com estética **corporativa densa** (referências: Stripe Dashboard, Bloomberg Terminal, Linear). Sidebar dupla, navegação fluida, alta densidade de informação, tipografia precisa. Mobile reconstruído do zero. Conteúdo/regras de negócio das páginas permanecem — só muda como é exibido e navegado.

## Direção visual

- **Tipografia**: `Inter Tight` (display/numérico tabular) + `IBM Plex Sans` (UI). Tamanhos compactos: base 13px, headings 14–20px. `font-variant-numeric: tabular-nums` em KPIs e tabelas.
- **Paleta**: neutros frios densos (slate/zinc) + um único acento (azul-petróleo `hsl(195 85% 42%)`) usado com parcimônia. Estados semânticos: sucesso `hsl(152 60% 38%)`, alerta `hsl(38 92% 50%)`, erro `hsl({{0 72% 50%}})`.
- **Densidade**: linhas 28–32px, padding 8–12px, bordas hairline 1px `border/40`, raios 4–6px (nada de 2xl). Zero gradientes decorativos, zero glassmorphism.
- **Hierarquia**: separadores e tipografia fazem o trabalho — sem cards "flutuantes" com sombras grandes.

## Estrutura de navegação (sidebar dupla)

```text
┌──┬──────────┬──────────────────────────────────┐
│M │ Subnav   │  Topbar (breadcrumb · ⌘K · user) │
│ó │          ├──────────────────────────────────┤
│d │ seções   │                                  │
│u │ do       │   Conteúdo                       │
│l │ módulo   │                                  │
│o │ ativo    │                                  │
│s │          │                                  │
└──┴──────────┴──────────────────────────────────┘
 56px  220px            fluido
```

- **Rail esquerdo (56px)**: ícones dos módulos (Início, Financeiro, Comercial, Gestão Clínica, BI, Admin, IA). Indicador de ativo: barra vertical 2px no acento.
- **Subnav (220px, colapsável p/ 0)**: lista as páginas do módulo ativo, agrupadas. Suporta `defaultOpen` por grupo, atalho `[` para colapsar.
- **Topbar (40px)**: breadcrumb à esquerda, ⌘K (command palette) ao centro-direita, avatar/tema/data à direita. Remove o `ModuleNav` horizontal atual (redundante com a subnav).
- **Command Palette** (`cmdk`, já instalado): busca rápida de páginas, pacientes, ações.

## Mobile (refeito do zero)

- **Topbar fina** com título da seção + ação primária à direita.
- **Bottom nav** com 5 alvos: Início, Comercial, Gestão, Financeiro, Mais.
- **Drawer "Mais"** abrindo lista completa de módulos/páginas.
- Páginas usam `MobileSection` (header sticky + lista densa). Cards reduzidos a linhas com chevron — sem KPIs gigantes.
- WhatsApp continua em layout dedicado fullscreen.

## Escopo de arquivos

**Novos**
- `src/components/shell/ModuleRail.tsx` — rail de 56px
- `src/components/shell/SubNav.tsx` — sidebar secundária
- `src/components/shell/Topbar.tsx` — topbar densa
- `src/components/shell/CommandPalette.tsx` — ⌘K
- `src/components/shell/AppShell.tsx` — orquestra desktop + mobile
- `src/components/shell/nav-config.ts` — definição única de módulos/seções (substitui `AppSidebar`/`ModuleNav`)
- `src/components/mobile/MobileShell.tsx`, `MobileTopbar.tsx`, `MobileBottomNav.tsx` (reescrito), `MobileMoreSheet.tsx`
- `src/components/ds/` — primitivos densos: `DataTable`, `Stat`, `SectionHeader`, `Toolbar`, `EmptyState`, `Hairline`

**Reescritos**
- `src/components/Layout.tsx` → fino wrapper que escolhe `AppShell` ou `MobileShell`
- `src/index.css` — novos tokens HSL (background, surface, border, muted, accent, semânticas), variáveis de tipografia/densidade
- `tailwind.config.ts` — fontes, novos tamanhos (`text-xs: 12px`, `text-sm: 13px`), spacing extras (`1.5`, `2.5`), tokens semânticos
- `index.html` — `<link>` Google Fonts (Inter Tight + IBM Plex Sans)
- `src/pages/Dashboard.tsx`, `src/pages/Home.tsx`, `src/pages/gestao/GestaoOperacional.tsx` — refeitos com `Stat`, `SectionHeader`, `DataTable` densos como referência do novo padrão
- Páginas restantes: substituições mecânicas — trocar `Card` decorativo por `SectionHeader + Hairline`, KPIs por `Stat`, listas por `DataTable`. Sem mudar lógica/queries.

**Removidos**
- `src/components/AppSidebar.tsx`, `src/components/ModuleNav.tsx`, `src/components/TopBar.tsx`, `src/components/mobile/MobileBottomNav.tsx` (substituídos), `src/components/mobile/MobileLayout.tsx` se órfão.

## Detalhes técnicos

- Sidebar dupla usa `Sidebar collapsible="icon"` do shadcn para o rail + um `aside` controlado para a subnav (`useLocalStorage` p/ estado colapsado).
- Estado ativo via `NavLink` + `useLocation`; grupo da rota atual abre por padrão.
- Acessibilidade: foco visível 2px accent, `aria-current="page"`, navegação por teclado (Tab/Arrow no rail).
- Tabelas densas: `tr` 32px, hover `bg-muted/40`, header sticky, números à direita, tabular-nums.
- Tema dark mantido — todos os tokens definidos em ambos os modos no `index.css`.
- Sem mudanças em hooks de dados, Supabase, edge functions, rotas (`App.tsx` continua igual exceto pelo Layout que ele já usa).

## Plano de execução (1 iteração só, conforme pedido)

1. Tokens (`index.css`, `tailwind.config.ts`, fontes em `index.html`)
2. Primitivos `src/components/ds/*`
3. Shell desktop (`ModuleRail`, `SubNav`, `Topbar`, `CommandPalette`, `AppShell`, `nav-config`)
4. Shell mobile (`MobileShell`, `MobileTopbar`, nova `MobileBottomNav`, `MobileMoreSheet`)
5. Novo `Layout.tsx`
6. Refazer Dashboard, Home, GestaoOperacional como referência do padrão
7. Aplicar padrão em massa nas demais páginas (substituições conservadoras)
8. Remover arquivos antigos órfãos

## Fora de escopo

- Lógica de negócio, queries, edge functions, RLS, autenticação
- Conteúdo/colunas das tabelas (apenas estilo)
- Refatoração do WhatsApp (mantém layout dedicado)
