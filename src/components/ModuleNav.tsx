import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
  Lock,
  History,
  PieChart,
  LineChart,
  ClipboardList,
  FileSignature,
  FlaskConical,
  Camera,
  Pill,
  Stethoscope,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface ModuleConfig {
  basePath: string;
  items: NavItem[];
}

const moduleConfigs: Record<string, ModuleConfig> = {
  financeiro: {
    basePath: "/financeiro",
    items: [
      { label: "Dashboard", to: "/financeiro", icon: Home },
      { label: "Diário de Caixa", to: "/financeiro/diario-caixa", icon: FileText },
      { label: "Lançamentos", to: "/financeiro/lancamentos", icon: DollarSign },
      { label: "Contas a Pagar", to: "/financeiro/contas-pagar", icon: CreditCard },
      { label: "Tratamentos", to: "/financeiro/tratamentos", icon: TrendingUp },
      { label: "Estoque", to: "/financeiro/estoque", icon: Package },
      { label: "Fornecedores", to: "/financeiro/fornecedores", icon: Users },
      { label: "DRE", to: "/financeiro/dre", icon: BarChart3 },
      { label: "Orçamento", to: "/financeiro/orcamento", icon: Target },
      { label: "Relatórios", to: "/financeiro/relatorios", icon: FileBarChart },
    ],
  },
  crm: {
    basePath: "/crm",
    items: [
      { label: "Pipeline", to: "/crm/pipeline", icon: Kanban },
      { label: "Agendamentos", to: "/crm/agendamentos", icon: Calendar },
      { label: "WhatsApp", to: "/crm/whatsapp", icon: MessageCircle },
      { label: "Pós-venda", to: "/crm/pos-venda", icon: Heart },
      { label: "Leads", to: "/crm/leads", icon: Users },
      { label: "Pacientes", to: "/crm/pacientes", icon: Users },
    ],
  },
  admin: {
    basePath: "/admin",
    items: [
      { label: "Usuários", to: "/admin?tab=usuarios", icon: Users },
      { label: "LGPD", to: "/admin?tab=lgpd", icon: Lock },
      { label: "Documentos", to: "/admin?tab=documentos", icon: FileText },
      { label: "Auditoria", to: "/admin?tab=auditoria", icon: History },
    ],
  },
  bi: {
    basePath: "/bi",
    items: [
      { label: "Dashboard", to: "/bi", icon: BarChart3 },
      { label: "LTV / CAC", to: "/bi?tab=ltv-cac", icon: Users },
      { label: "Marketing", to: "/bi?tab=marketing", icon: Target },
      { label: "Tratamentos", to: "/bi?tab=tratamentos", icon: PieChart },
      { label: "Sazonalidade", to: "/bi?tab=sazonalidade", icon: Calendar },
      { label: "Projeções", to: "/bi?tab=projecoes", icon: LineChart },
    ],
  },
  gestao: {
    basePath: "/gestao",
    items: [
      { label: "Dashboard", to: "/gestao", icon: Home },
      { label: "Planos de Tratamento", to: "/gestao/planos-tratamento", icon: FileText },
      { label: "Contratos", to: "/gestao/contratos", icon: FileSignature },
      { label: "Anamneses", to: "/gestao/anamneses", icon: ClipboardList },
      { label: "Exames", to: "/gestao/exames", icon: FlaskConical },
      { label: "Fotos", to: "/gestao/fotos", icon: Camera },
      { label: "Receituários", to: "/gestao/receituarios", icon: Pill },
      { label: "Prontuários", to: "/gestao/prontuarios", icon: Stethoscope },
    ],
  },
};

function getActiveModule(pathname: string): ModuleConfig | null {
  for (const config of Object.values(moduleConfigs)) {
    if (pathname.startsWith(config.basePath)) {
      return config;
    }
  }
  return null;
}

export function ModuleNav() {
  const location = useLocation();
  const currentModule = getActiveModule(location.pathname);

  if (!currentModule) return null;

  return (
    <div
      className={cn(
        "border-b sticky top-0 z-10 overflow-hidden",
        "bg-background/80 dark:bg-background/60",
        "backdrop-blur-xl",
        "border-border/40 dark:border-border/20"
      )}
    >
      <ScrollArea className="w-full max-w-full">
        <nav className="flex items-center gap-1 px-5 py-2.5">
          {currentModule.items.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              (item.to.includes("?") &&
                location.pathname + location.search === item.to) ||
              (item.to === "/financeiro" &&
                location.pathname === "/financeiro" &&
                !location.search);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium",
                  "transition-all duration-200 whitespace-nowrap group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 dark:hover:bg-muted/40"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
