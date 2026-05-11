import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { ModuleNav } from "@/components/ModuleNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAuthMenu } from "@/components/UserAuthMenu";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { MobileWhatsApp } from "@/components/mobile/pages/MobileWhatsApp";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const moduleRoutes = ["/financeiro", "/crm", "/admin", "/bi", "/gestao"];

function shouldShowModuleNav(pathname: string): boolean {
  return moduleRoutes.some((route) => pathname.startsWith(route));
}

// Build a human-readable breadcrumb from the current path
const routeLabels: Record<string, string> = {
  "": "Início",
  financeiro: "Financeiro",
  "diario-caixa": "Diário de Caixa",
  lancamentos: "Lançamentos",
  "contas-pagar": "Contas a Pagar",
  tratamentos: "Tratamentos",
  estoque: "Estoque",
  fornecedores: "Fornecedores",
  dre: "DRE",
  orcamento: "Orçamento",
  relatorios: "Relatórios",
  crm: "Comercial",
  pipeline: "Pipeline",
  agendamentos: "Agendamentos",
  whatsapp: "WhatsApp",
  "pos-venda": "Pós-venda",
  leads: "Leads",
  pacientes: "Pacientes",
  gestao: "Gestão Clínica",
  "planos-tratamento": "Planos de Tratamento",
  contratos: "Contratos",
  anamneses: "Anamneses",
  exames: "Exames",
  fotos: "Fotos",
  receituarios: "Receituários",
  prontuarios: "Prontuários",
  bi: "Business Intelligence",
  admin: "Administrativo",
  "assistente-ia": "Assistente IA",
  configuracoes: "Configurações",
};

function DesktopHeader() {
  const location = useLocation();
  const today = format(new Date(), "EEE, d MMM", { locale: ptBR });
  const todayCap = today.charAt(0).toUpperCase() + today.slice(1);

  // Build breadcrumb from path segments
  const segments = location.pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg) => routeLabels[seg] ?? seg);

  return (
    <header
      className={cn(
        "hidden lg:flex h-14 items-center justify-between px-8",
        "border-b transition-all duration-300",
        "bg-background/60 dark:bg-background/40",
        "backdrop-blur-xl",
        "border-border/40 dark:border-border/20"
      )}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {crumbs.length === 0 ? (
          <span className="font-medium text-foreground">Início</span>
        ) : (
          crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-muted-foreground/40 text-xs">/</span>
              )}
              <span
                className={cn(
                  i === crumbs.length - 1
                    ? "font-medium text-foreground"
                    : "text-muted-foreground/70"
                )}
              >
                {crumb}
              </span>
            </span>
          ))
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
          <Calendar className="h-3.5 w-3.5" />
          <span>{todayCap}</span>
        </div>
        <div className="w-px h-5 bg-border/50" />
        <ThemeToggle />
        <UserAuthMenu />
      </div>
    </header>
  );
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isAssistenteIA = location.pathname === "/assistente-ia";
  const isWhatsApp = location.pathname === "/crm/whatsapp";
  const isFullHeightPage = isAssistenteIA || isWhatsApp;
  const showModuleNav = shouldShowModuleNav(location.pathname) && !isWhatsApp;

  // Mobile Layout
  if (isMobile) {
    if (isWhatsApp) {
      return <MobileWhatsApp />;
    }

    return (
      <div
        className={cn(
          "flex flex-col w-full",
          isFullHeightPage ? "h-screen" : "min-h-screen"
        )}
      >
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-background" />
        </div>

        <main
          className={cn(
            "flex-1 flex flex-col min-w-0",
            isFullHeightPage
              ? "h-full overflow-hidden"
              : "overflow-y-auto pb-20"
          )}
        >
          {children}
        </main>

        {!isFullHeightPage && <MobileBottomNav />}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div
      className={cn(
        "flex w-full overflow-hidden relative",
        isFullHeightPage ? "h-screen" : "min-h-screen"
      )}
    >
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20 dark:hidden" />
        <div className="hidden dark:block absolute inset-0">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px]" />
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <AppSidebar />
      </div>

      {/* Main Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0",
          isFullHeightPage ? "h-full overflow-hidden" : "min-h-screen"
        )}
      >
        {/* Mobile TopBar (tablet) */}
        <TopBar />

        {/* Desktop Header */}
        <DesktopHeader />

        {/* Module Navigation */}
        {showModuleNav && <ModuleNav />}

        {/* Main content */}
        <main
          className={cn(
            "flex-1 overflow-hidden",
            isFullHeightPage
              ? "flex flex-col min-h-0"
              : "p-6 md:p-8 lg:p-10 overflow-y-auto"
          )}
        >
          <div
            className={cn(
              isFullHeightPage
                ? "flex-1 flex flex-col min-h-0 h-full"
                : "max-w-[1600px] mx-auto w-full"
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
