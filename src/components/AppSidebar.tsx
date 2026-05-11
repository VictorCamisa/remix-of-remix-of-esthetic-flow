import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import logoTaysa from "@/assets/logo-dra-taysa.png";
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileSignature,
  FlaskConical,
  Camera,
  Pill,
  Stethoscope,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface NavModule {
  label: string;
  icon: LucideIcon;
  basePath: string;
  items: NavItem[];
}

const modules: NavModule[] = [
  {
    label: "Financeiro",
    icon: DollarSign,
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
  {
    label: "Comercial",
    icon: Users,
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
  {
    label: "Gestão Clínica",
    icon: ClipboardList,
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
  {
    label: "Business Intelligence",
    icon: BarChart3,
    basePath: "/bi",
    items: [
      { label: "Dashboard BI", to: "/bi", icon: BarChart3 },
      { label: "LTV / CAC", to: "/bi?tab=ltv-cac", icon: Users },
      { label: "Marketing", to: "/bi?tab=marketing", icon: Target },
      { label: "Tratamentos", to: "/bi?tab=tratamentos", icon: PieChart },
      { label: "Sazonalidade", to: "/bi?tab=sazonalidade", icon: Calendar },
      { label: "Projeções", to: "/bi?tab=projecoes", icon: LineChart },
    ],
  },
  {
    label: "Administrativo",
    icon: Building2,
    basePath: "/admin",
    items: [
      { label: "Usuários", to: "/admin?tab=usuarios", icon: Users },
      { label: "LGPD", to: "/admin?tab=lgpd", icon: Lock },
      { label: "Documentos", to: "/admin?tab=documentos", icon: FileText },
      { label: "Auditoria", to: "/admin?tab=auditoria", icon: History },
    ],
  },
];

const globalItems: NavItem[] = [
  { label: "Assistente IA", to: "/assistente-ia", icon: Sparkles },
  { label: "Configurações", to: "/configuracoes", icon: Settings },
];

function NavModuleSection({
  module,
  collapsed,
}: {
  module: NavModule;
  collapsed: boolean;
}) {
  const location = useLocation();
  const isActive =
    location.pathname === module.basePath ||
    location.pathname.startsWith(module.basePath + "/") ||
    module.items.some(
      (item) =>
        location.pathname === item.to ||
        (item.to.includes("?") &&
          location.pathname + location.search === item.to)
    );

  const [isOpen, setIsOpen] = useState(isActive);
  const Icon = module.icon;

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={module.items[0]?.to ?? module.basePath}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl mx-auto",
                "transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {module.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between rounded-xl px-3 py-2.5",
          "text-sm font-medium transition-all duration-200",
          "group/trigger",
          isActive
            ? "bg-primary/10 dark:bg-primary/15 text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60 dark:hover:bg-muted/40"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
              "transition-all duration-200",
              isActive
                ? "bg-primary/20 dark:bg-primary/30"
                : "bg-muted/60 dark:bg-muted/40 group-hover/trigger:bg-primary/10"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                isActive ? "text-primary" : ""
              )}
            />
          </div>
          <span>{module.label}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground/60 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="ml-5 mt-1 space-y-0.5 border-l border-primary/10 dark:border-primary/15 pl-3">
          {module.items.map((item) => {
            const ItemIcon = item.icon;
            const isItemActive =
              location.pathname === item.to ||
              (item.to.includes("?") &&
                location.pathname + location.search === item.to) ||
              (item.to === "/financeiro" && location.pathname === "/");

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/financeiro"}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2",
                  "text-[13px] transition-all duration-150",
                  !isItemActive &&
                    "text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-muted/30"
                )}
                activeClassName="text-primary font-medium bg-primary/8 dark:bg-primary/12"
              >
                <ItemIcon className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sidebarWidth = collapsed ? "w-[72px]" : "w-[264px]";

  return (
    <aside
      className={cn(
        "h-screen flex flex-col flex-shrink-0 relative",
        "transition-all duration-300 ease-out",
        "border-r",
        "bg-card/80 border-border/40",
        "dark:bg-card/40 dark:border-border/20",
        "backdrop-blur-2xl",
        sidebarWidth
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-border/40 dark:border-border/20",
          "transition-all duration-300",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {collapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors"
                >
                  <span className="font-signature text-xl text-primary leading-none">Æ</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">ÁUREA Clinic</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <>
            <Link to="/" className="flex items-center gap-3 min-w-0 group">
              <div
                className={cn(
                  "flex-shrink-0 p-1.5 rounded-xl transition-all duration-200",
                  "bg-gradient-to-br from-primary/10 to-primary/5",
                  "group-hover:from-primary/15 group-hover:to-primary/10"
                )}
              >
                <img
                  src={logoTaysa}
                  alt="Dra. Taysa Dias"
                  className={cn(
                    "h-8 w-auto transition-all duration-200",
                    "dark:brightness-125 dark:contrast-110",
                    "group-hover:scale-[1.02]"
                  )}
                />
              </div>
              <div className="min-w-0">
                <p className="font-signature text-lg text-primary leading-tight truncate">ÁUREA Clinic</p>
                <p className="text-[10px] text-muted-foreground/70 leading-tight truncate">Dra. Taysa Dias</p>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 flex-shrink-0"
              onClick={() => setCollapsed(true)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3">
        <nav className={cn("space-y-1", collapsed ? "px-2" : "px-2.5")}>
          {/* Home */}
          {collapsed ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/"
                    end
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl mx-auto",
                      "text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
                    )}
                    activeClassName="bg-muted text-foreground"
                  >
                    <Home className="h-5 w-5" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">Início</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <NavLink
              to="/"
              end
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5",
                "text-sm font-medium transition-all duration-200",
                "text-muted-foreground hover:text-foreground hover:bg-muted/60 dark:hover:bg-muted/40"
              )}
              activeClassName="text-foreground bg-muted dark:bg-muted/60"
            >
              <div className="h-8 w-8 rounded-lg bg-muted/60 dark:bg-muted/40 flex items-center justify-center flex-shrink-0">
                <Home className="h-4 w-4" />
              </div>
              <span>Início</span>
            </NavLink>
          )}

          {/* Divider */}
          {!collapsed && (
            <div className="separator-gold my-3 mx-1" />
          )}
          {collapsed && <div className="h-px bg-border/30 my-2 mx-2" />}

          {/* Section label */}
          {!collapsed && (
            <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              Módulos
            </p>
          )}

          {/* Modules */}
          <div className="space-y-0.5">
            {modules.map((module) => (
              <NavModuleSection
                key={module.basePath}
                module={module}
                collapsed={collapsed}
              />
            ))}
          </div>

          {/* Divider */}
          {!collapsed && (
            <div className="separator-gold my-3 mx-1" />
          )}
          {collapsed && <div className="h-px bg-border/30 my-2 mx-2" />}

          {/* Section label */}
          {!collapsed && (
            <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
              Sistema
            </p>
          )}

          {/* Global Items */}
          <div className="space-y-0.5">
            {globalItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              const isAI = item.to === "/assistente-ia";

              if (collapsed) {
                return (
                  <TooltipProvider key={item.to} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <NavLink
                          to={item.to}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl mx-auto",
                            "transition-all duration-200",
                            !isActive &&
                              (isAI
                                ? "text-primary/70 hover:text-primary hover:bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/60")
                          )}
                          activeClassName="bg-primary/10 text-primary"
                        >
                          <Icon className="h-5 w-5" />
                        </NavLink>
                      </TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-sm font-medium transition-all duration-200",
                    !isActive &&
                      (isAI
                        ? "text-primary/70 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/15"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60 dark:hover:bg-muted/40")
                  )}
                  activeClassName="text-primary bg-primary/10 dark:bg-primary/15 font-medium"
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      isAI
                        ? "bg-primary/10 dark:bg-primary/20"
                        : "bg-muted/60 dark:bg-muted/40"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                  {isAI && !isActive && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-md font-semibold bg-primary/10 text-primary">
                      IA
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div
        className={cn(
          "border-t border-border/40 dark:border-border/20",
          collapsed ? "p-2" : "p-3"
        )}
      >
        {collapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl mx-auto flex text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  onClick={() => setCollapsed(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expandir menu</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[10px] font-medium text-muted-foreground/80">ÁUREA Clinic v1.0</p>
              <p className="text-[9px] text-muted-foreground/50">© 2026 VS Soluções</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/40"
              onClick={() => setCollapsed(false)}
              aria-label="Expandir menu"
            >
              <ChevronRight className="h-3.5 w-3.5 opacity-0" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
