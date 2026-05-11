import { Menu, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAuthMenu } from "@/components/UserAuthMenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  ClipboardList,
  FileSignature,
  FlaskConical,
  Camera,
  Pill,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

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

function MobileNavModule({
  module,
  onClose,
}: {
  module: NavModule;
  onClose: () => void;
}) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(module.basePath);
  const [isOpen, setIsOpen] = useState(isActive);
  const Icon = module.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between rounded-xl px-3 py-2.5",
          "text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary/10 text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center",
              isActive ? "bg-primary/15" : "bg-muted/60"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
          </div>
          <span>{module.label}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="ml-5 mt-1 space-y-0.5 border-l border-primary/10 pl-3">
          {module.items.map((item) => {
            const ItemIcon = item.icon;
            const isItemActive =
              location.pathname === item.to ||
              (item.to.includes("?") &&
                location.pathname + location.search === item.to);

            return (
              <SheetClose asChild key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2",
                    "text-[13px] transition-all duration-150",
                    isItemActive
                      ? "text-primary font-medium bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <ItemIcon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </SheetClose>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function TopBar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-14 lg:hidden",
        "border-b transition-all duration-300",
        "bg-background/80 dark:bg-background/60",
        "backdrop-blur-xl",
        "border-border/40 dark:border-border/20"
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        {/* Menu Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-muted/60"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className={cn(
              "w-[300px] p-0",
              "bg-background/95 dark:bg-background/90",
              "backdrop-blur-2xl"
            )}
          >
            <SheetHeader className="border-b border-border/40 p-4">
              <SheetTitle className="text-left">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-1.5 rounded-xl",
                      "bg-gradient-to-br from-primary/10 to-primary/5"
                    )}
                  >
                    <img
                      src={logoTaysa}
                      alt="Dra. Taysa Dias"
                      className="h-8 w-auto dark:brightness-125 dark:contrast-110"
                    />
                  </div>
                  <div>
                    <p className="font-signature text-lg text-primary leading-tight">ÁUREA Clinic</p>
                    <p className="text-[10px] text-muted-foreground/70 font-normal leading-tight">Dra. Taysa Dias</p>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
              {/* Home */}
              <SheetClose asChild>
                <Link
                  to="/"
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-sm font-medium transition-all duration-200",
                    location.pathname === "/"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
                    <Home className="h-4 w-4" />
                  </div>
                  <span>Início</span>
                </Link>
              </SheetClose>

              <div className="separator-gold my-3 mx-1" />

              {/* Modules */}
              {modules.map((module) => (
                <MobileNavModule
                  key={module.basePath}
                  module={module}
                  onClose={() => setMobileOpen(false)}
                />
              ))}

              <div className="separator-gold my-3 mx-1" />

              {/* Global Items */}
              {globalItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                const isAI = item.to === "/assistente-ia";

                return (
                  <SheetClose asChild key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5",
                        "text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-primary bg-primary/10"
                          : isAI
                          ? "text-primary/70 hover:text-primary hover:bg-primary/8"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          isAI ? "bg-primary/10" : "bg-muted/60"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{item.label}</span>
                      {isAI && !isActive && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
                          IA
                        </span>
                      )}
                    </Link>
                  </SheetClose>
                );
              })}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-border/40 p-3 bg-background/80 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground/50">ÁUREA Clinic v1.0</p>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <UserAuthMenu />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className={cn(
              "p-1.5 rounded-lg transition-all duration-200",
              "bg-gradient-to-br from-primary/10 to-primary/5",
              "group-hover:from-primary/15 group-hover:to-primary/8"
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
          <span className="font-signature text-xl text-primary leading-none">ÁUREA</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <UserAuthMenu />
        </div>
      </div>
    </header>
  );
}
