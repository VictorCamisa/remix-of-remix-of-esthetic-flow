import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAuthMenu } from "@/components/UserAuthMenu";
import { cn } from "@/lib/utils";
import { findActiveModule } from "./nav-config";

const labels: Record<string, string> = {
  "": "Início",
  financeiro: "Financeiro", "diario-caixa": "Diário de Caixa", lancamentos: "Lançamentos",
  "contas-pagar": "Contas a Pagar", tratamentos: "Tratamentos", estoque: "Estoque",
  fornecedores: "Fornecedores", dre: "DRE", orcamento: "Orçamento", relatorios: "Relatórios",
  crm: "Comercial", pipeline: "Pipeline", agendamentos: "Agendamentos", whatsapp: "WhatsApp",
  "pos-venda": "Pós-venda", leads: "Leads", pacientes: "Pacientes",
  gestao: "Gestão Clínica", "planos-tratamento": "Planos de Tratamento", contratos: "Contratos",
  anamneses: "Anamneses", exames: "Exames", fotos: "Fotos", receituarios: "Receituários",
  prontuarios: "Prontuários", bi: "Business Intelligence", admin: "Administrativo",
  "assistente-ia": "Assistente IA", configuracoes: "Configurações",
};

export function Topbar({ onCommandOpen }: { onCommandOpen?: () => void }) {
  const { pathname } = useLocation();
  const today = format(new Date(), "EEE, d MMM yyyy", { locale: ptBR });
  const todayCap = today.charAt(0).toUpperCase() + today.slice(1);
  const segs = pathname.split("/").filter(Boolean);
  const module = findActiveModule(pathname);

  return (
    <header className="hidden lg:flex h-14 items-center justify-between px-5 border-b border-border bg-background">
      <nav className="flex items-center gap-1.5 text-[13px] min-w-0">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        {segs.length > 0 && (
          <>
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" strokeWidth={2.5} />
            <span className="text-muted-foreground">{module.label}</span>
          </>
        )}
        {segs.length > 1 && (
          <>
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" strokeWidth={2.5} />
            <span className="font-medium text-foreground truncate">
              {labels[segs[segs.length - 1]] ?? segs[segs.length - 1]}
            </span>
          </>
        )}
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCommandOpen}
          className={cn(
            "h-8 w-72 flex items-center gap-2 px-2.5 rounded border border-border bg-muted/40",
            "text-[13px] text-muted-foreground hover:bg-muted hover:border-border transition-colors"
          )}
        >
          <Search className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="flex-1 text-left">Buscar páginas, pacientes…</span>
          <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-background border border-border">⌘K</kbd>
        </button>

        <span className="text-2xs text-muted-foreground tabular hidden xl:inline">{todayCap}</span>
        <div className="w-px h-5 bg-border" />
        <ThemeToggle />
        <UserAuthMenu />
      </div>
    </header>
  );
}
