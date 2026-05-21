import {
  Home,
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
  Package,
  Users,
  BarChart3,
  Target,
  FileBarChart,
  Kanban,
  Calendar,
  Heart,
  Building2,
  Lock,
  History,
  PieChart,
  LineChart,
  Sparkles,
  Settings,
  ClipboardList,
  FileSignature,
  FlaskConical,
  Camera,
  Pill,
  Stethoscope,
  MessageCircle,
  LayoutDashboard,
  Car,
  ShoppingCart,
  Award,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export interface NavModule {
  id: string;
  label: string;
  short: string;
  icon: LucideIcon;
  basePath: string;
  matchPaths?: string[];
  groups: NavGroup[];
}

export const MODULES: NavModule[] = [
  {
    id: "home",
    label: "Início",
    short: "Início",
    icon: Home,
    basePath: "/",
    matchPaths: ["/"],
    groups: [{ items: [{ label: "Visão geral", to: "/", icon: LayoutDashboard, end: true }] }],
  },
  {
    id: "financeiro",
    label: "Financeiro",
    short: "Fin.",
    icon: DollarSign,
    basePath: "/financeiro",
    groups: [
      {
        label: "Operação",
        items: [
          { label: "Dashboard", to: "/financeiro", icon: LayoutDashboard, end: true },
          { label: "Diário de Caixa", to: "/financeiro/diario-caixa", icon: FileText },
          { label: "Lançamentos", to: "/financeiro/lancamentos", icon: DollarSign },
          { label: "Contas a Pagar", to: "/financeiro/contas-pagar", icon: CreditCard },
        ],
      },
      {
        label: "Catálogo",
        items: [
          { label: "Tratamentos", to: "/financeiro/tratamentos", icon: TrendingUp },
          { label: "Estoque", to: "/financeiro/estoque", icon: Package },
          { label: "Fornecedores", to: "/financeiro/fornecedores", icon: Users },
        ],
      },
      {
        label: "Análise",
        items: [
          { label: "DRE", to: "/financeiro/dre", icon: BarChart3 },
          { label: "Orçamento", to: "/financeiro/orcamento", icon: Target },
          { label: "Relatórios", to: "/financeiro/relatorios", icon: FileBarChart },
        ],
      },
    ],
  },
  {
    id: "crm",
    label: "Comercial",
    short: "Com.",
    icon: Users,
    basePath: "/crm",
    groups: [
      {
        label: "Vendas",
        items: [
          { label: "Pipeline", to: "/crm/pipeline", icon: Kanban },
          { label: "Agendamentos", to: "/crm/agendamentos", icon: Calendar },
          { label: "Pós-venda", to: "/crm/pos-venda", icon: Heart },
        ],
      },
      {
        label: "Pessoas",
        items: [
          { label: "Pacientes", to: "/crm/pacientes", icon: Users },
          { label: "Leads", to: "/crm/leads", icon: Target },
        ],
      },
      {
        label: "Atendimento",
        items: [{ label: "WhatsApp", to: "/crm/whatsapp", icon: MessageCircle }],
      },
    ],
  },
  {
    id: "gestao",
    label: "Gestão Clínica",
    short: "Gest.",
    icon: ClipboardList,
    basePath: "/gestao",
    groups: [
      {
        items: [
          { label: "Visão geral", to: "/gestao", icon: LayoutDashboard, end: true },
        ],
      },
      {
        label: "Documentos",
        items: [
          { label: "Planos de Tratamento", to: "/gestao/planos-tratamento", icon: FileText },
          { label: "Contratos", to: "/gestao/contratos", icon: FileSignature },
          { label: "Receituários", to: "/gestao/receituarios", icon: Pill },
        ],
      },
      {
        label: "Clínico",
        items: [
          { label: "Anamneses", to: "/gestao/anamneses", icon: ClipboardList },
          { label: "Exames", to: "/gestao/exames", icon: FlaskConical },
          { label: "Fotos", to: "/gestao/fotos", icon: Camera },
          { label: "Prontuários", to: "/gestao/prontuarios", icon: Stethoscope },
        ],
      },
    ],
  },
  {
    id: "bi",
    label: "Business Intelligence",
    short: "BI",
    icon: BarChart3,
    basePath: "/bi",
    groups: [
      {
        items: [
          { label: "Dashboard", to: "/bi", icon: LayoutDashboard, end: true },
          { label: "LTV / CAC", to: "/bi?tab=ltv-cac", icon: Users },
          { label: "Marketing", to: "/bi?tab=marketing", icon: Target },
          { label: "Tratamentos", to: "/bi?tab=tratamentos", icon: PieChart },
          { label: "Sazonalidade", to: "/bi?tab=sazonalidade", icon: Calendar },
          { label: "Projeções", to: "/bi?tab=projecoes", icon: LineChart },
        ],
      },
    ],
  },
  {
    id: "mavers",
    label: "Mavers · VS Auto",
    short: "Mavers",
    icon: Car,
    basePath: "/mavers",
    groups: [
      {
        items: [
          { label: "Dashboard", to: "/mavers", icon: LayoutDashboard, end: true },
        ],
      },
      {
        label: "Operação",
        items: [
          { label: "Estoque", to: "/mavers/estoque", icon: Car },
          { label: "Leads", to: "/mavers/leads", icon: Target },
          { label: "CRM", to: "/mavers/crm", icon: Kanban },
          { label: "Vendas", to: "/mavers/vendas", icon: ShoppingCart },
        ],
      },
      {
        label: "Gestão",
        items: [
          { label: "Comissões", to: "/mavers/comissoes", icon: Award },
          { label: "Financeiro", to: "/mavers/financeiro", icon: DollarSign },
          { label: "Marketing", to: "/mavers/marketing", icon: Megaphone },
          { label: "Relatórios", to: "/mavers/relatorios", icon: FileBarChart },
        ],
      },
    ],
  },
  {
    id: "admin",
    label: "Administrativo",
    short: "Admin",
    icon: Building2,
    basePath: "/admin",
    groups: [
      {
        items: [
          { label: "Usuários", to: "/admin?tab=usuarios", icon: Users },
          { label: "LGPD", to: "/admin?tab=lgpd", icon: Lock },
          { label: "Documentos", to: "/admin?tab=documentos", icon: FileText },
          { label: "Auditoria", to: "/admin?tab=auditoria", icon: History },
        ],
      },
    ],
  },
];

export const SYSTEM_ITEMS: NavItem[] = [
  { label: "Assistente IA", to: "/assistente-ia", icon: Sparkles },
  { label: "Configurações", to: "/configuracoes", icon: Settings },
];

export function findActiveModule(pathname: string): NavModule {
  // exact root match
  if (pathname === "/") return MODULES[0];
  // longest prefix wins (skip home)
  let best: NavModule = MODULES[0];
  let bestLen = 0;
  for (const m of MODULES) {
    if (m.basePath === "/") continue;
    if (pathname === m.basePath || pathname.startsWith(m.basePath + "/")) {
      if (m.basePath.length > bestLen) {
        best = m;
        bestLen = m.basePath.length;
      }
    }
  }
  return best;
}

export function isItemActive(itemTo: string, pathname: string, search: string, end?: boolean): boolean {
  const [path, query] = itemTo.split("?");
  if (query) {
    const sp = new URLSearchParams(query);
    const cur = new URLSearchParams(search);
    if (pathname !== path) return false;
    for (const [k, v] of sp.entries()) if (cur.get(k) !== v) return false;
    return true;
  }
  if (end) return pathname === path;
  return pathname === path || pathname.startsWith(path + "/");
}
