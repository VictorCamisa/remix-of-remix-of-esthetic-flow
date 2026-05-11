import {
  DollarSign,
  Users,
  Building2,
  BarChart3,
  ArrowRight,
  Sparkles,
  Settings,
  ClipboardList,
  Calendar,
  FileSignature,
  Kanban,
  TrendingUp,
  Clock,
  Activity,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ─── Live KPIs via Supabase ─────────────────────────────────────
function useDashboardKPIs() {
  const today = new Date().toISOString().split("T")[0];

  const agendamentosHoje = useQuery({
    queryKey: ["home-agendamentos-hoje", today],
    queryFn: async () => {
      const { count } = await supabase
        .from("crm_agendamentos")
        .select("*", { count: "exact", head: true })
        .gte("data_agendamento", today + "T00:00:00")
        .lte("data_agendamento", today + "T23:59:59");
      return count ?? 0;
    },
  });

  const contratosPendentes = useQuery({
    queryKey: ["home-contratos-pendentes"],
    queryFn: async () => {
      const { count } = await supabase
        .from("contratos_paciente")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente");
      return count ?? 0;
    },
  });

  const pacientesAtivos = useQuery({
    queryKey: ["home-pacientes"],
    queryFn: async () => {
      const { count } = await supabase
        .from("pacientes")
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const receitaMes = useQuery({
    queryKey: ["home-receita-mes"],
    queryFn: async () => {
      const inicio = new Date();
      inicio.setDate(1);
      inicio.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("td_fluxo_de_caixa")
        .select("valor")
        .eq("tipo", "receita")
        .eq("status", "pago")
        .gte("data_lancamento", inicio.toISOString().split("T")[0]);
      const total = (data ?? []).reduce((s, r) => s + (r.valor ?? 0), 0);
      return total;
    },
  });

  return { agendamentosHoje, contratosPendentes, pacientesAtivos, receitaMes };
}

// ─── Module Cards ───────────────────────────────────────────────
const modules = [
  {
    title: "Financeiro",
    description: "Fluxo de caixa, DRE, orçamentos e relatórios financeiros",
    icon: DollarSign,
    href: "/financeiro",
    features: ["Lançamentos", "DRE", "Relatórios"],
  },
  {
    title: "Comercial",
    description: "Pipeline de vendas, agendamentos e gestão de pacientes",
    icon: Users,
    href: "/crm",
    features: ["Pipeline", "Agendamentos", "WhatsApp"],
  },
  {
    title: "Gestão Clínica",
    description: "Contratos, anamneses, prontuários e planos de tratamento",
    icon: ClipboardList,
    href: "/gestao",
    features: ["Contratos", "Anamneses", "Prontuários"],
  },
  {
    title: "Business Intelligence",
    description: "Análises, indicadores de performance e projeções",
    icon: BarChart3,
    href: "/bi",
    features: ["LTV/CAC", "Marketing", "Projeções"],
  },
  {
    title: "Administrativo",
    description: "Usuários, permissões, LGPD e auditoria do sistema",
    icon: Building2,
    href: "/admin",
    features: ["Usuários", "LGPD", "Auditoria"],
  },
];

// ─── Quick Actions ───────────────────────────────────────────────
const quickActions = [
  {
    href: "/crm/pipeline",
    icon: Kanban,
    label: "Pipeline",
    description: "Ver funil de vendas",
  },
  {
    href: "/crm/agendamentos",
    icon: Calendar,
    label: "Agenda",
    description: "Gerenciar agendamentos",
  },
  {
    href: "/gestao/contratos",
    icon: FileSignature,
    label: "Contratos",
    description: "Assinar e emitir contratos",
  },
  {
    href: "/crm/whatsapp",
    icon: MessageCircle,
    label: "WhatsApp",
    description: "Atender pacientes",
  },
];

// ─── Components ──────────────────────────────────────────────────
function KPICard({
  label,
  value,
  icon: Icon,
  loading,
  format: fmt,
  highlight,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  format?: "number" | "currency";
  highlight?: boolean;
}) {
  const displayed =
    loading ? "—" :
    fmt === "currency"
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value)
      : value.toString();

  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 rounded-2xl p-5 overflow-hidden",
        "bg-card border transition-all duration-300",
        "hover:shadow-md hover:-translate-y-0.5",
        highlight
          ? "border-primary/20 dark:border-primary/25"
          : "border-border/50 dark:border-border/30"
      )}
    >
      {/* Top accent line for highlighted cards */}
      {highlight && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <div
          className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center",
            highlight
              ? "bg-primary/10 dark:bg-primary/15"
              : "bg-muted/60 dark:bg-muted/40"
          )}
        >
          <Icon className={cn("h-4 w-4", highlight ? "text-primary" : "text-muted-foreground")} />
        </div>
      </div>

      <div>
        {loading ? (
          <div className="h-7 w-20 rounded-lg skeleton-shimmer" />
        ) : (
          <p
            className={cn(
              "text-2xl font-bold tracking-tight",
              highlight ? "text-primary" : "text-foreground"
            )}
          >
            {displayed}
          </p>
        )}
      </div>
    </div>
  );
}

function ModuleCard({
  title,
  description,
  icon: Icon,
  href,
  features,
}: (typeof modules)[0]) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative flex flex-col rounded-2xl p-6 overflow-hidden",
        "bg-card border border-border/50 dark:border-border/30",
        "transition-all duration-300",
        "hover:shadow-lg hover:border-primary/20 dark:hover:border-primary/30",
        "hover:-translate-y-1"
      )}
    >
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div
            className={cn(
              "h-11 w-11 rounded-xl flex items-center justify-center",
              "bg-primary/10 dark:bg-primary/15 border border-primary/10",
              "group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300"
            )}
          >
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div
            className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center",
              "bg-muted/50 opacity-0 group-hover:opacity-100",
              "translate-x-2 group-hover:translate-x-0",
              "transition-all duration-300"
            )}
          >
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
        </div>

        <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-[13px] text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {features.map((f) => (
            <span
              key={f}
              className={cn(
                "px-2.5 py-1 text-[11px] font-medium rounded-lg",
                "bg-muted/60 dark:bg-muted/40 text-muted-foreground",
                "border border-border/30",
                "group-hover:bg-primary/8 group-hover:text-primary group-hover:border-primary/15",
                "transition-all duration-200"
              )}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function QuickAction({ href, icon: Icon, label, description }: (typeof quickActions)[0]) {
  return (
    <Link
      to={href}
      className={cn(
        "group flex items-center gap-4 rounded-xl p-4",
        "bg-card border border-border/50 dark:border-border/30",
        "hover:border-primary/20 hover:shadow-sm hover:bg-primary/[0.02]",
        "transition-all duration-200"
      )}
    >
      <div className="h-10 w-10 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
        <Icon className="h-4.5 w-4.5 text-primary h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </Link>
  );
}

// ─── Page ───────────────────────────────────────────────────────
export default function Home() {
  const now = new Date();
  const { agendamentosHoje, contratosPendentes, pacientesAtivos, receitaMes } =
    useDashboardKPIs();

  const hora = now.getHours();
  const saudacao =
    hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const dataFormatada = format(now, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const dataCapitalizada =
    dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);

  return (
    <div className="relative min-h-full">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-64 bg-primary/[0.04] rounded-full blur-3xl dark:bg-primary/[0.03]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary/[0.03] rounded-full blur-3xl dark:hidden" />
      </div>

      <div className="relative z-10 space-y-10 animate-fade-in">
        {/* ── Hero Section ── */}
        <div className="space-y-1">
          {/* Brand mark */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="gold-bar w-10" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/80">
              ÁUREA Clinic
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-signature text-5xl md:text-6xl mb-1">
                {saudacao}, Dra. Taysa
              </h1>
              <p className="text-muted-foreground text-sm">{dataCapitalizada}</p>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground/60">
              <Activity className="h-4 w-4 text-success" />
              <span className="text-xs">Sistema operacional</span>
            </div>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3">
            Hoje
          </h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <KPICard
              label="Agendamentos Hoje"
              value={agendamentosHoje.data ?? 0}
              icon={Calendar}
              loading={agendamentosHoje.isLoading}
              highlight
            />
            <KPICard
              label="Contratos Pendentes"
              value={contratosPendentes.data ?? 0}
              icon={FileSignature}
              loading={contratosPendentes.isLoading}
            />
            <KPICard
              label="Pacientes Cadastrados"
              value={pacientesAtivos.data ?? 0}
              icon={Users}
              loading={pacientesAtivos.isLoading}
            />
            <KPICard
              label="Receita do Mês"
              value={receitaMes.data ?? 0}
              icon={TrendingUp}
              loading={receitaMes.isLoading}
              format="currency"
              highlight
            />
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3">
            Ações rápidas
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((a) => (
              <QuickAction key={a.href} {...a} />
            ))}
          </div>
        </div>

        {/* ── Modules ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Módulos
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
            {modules.map((m) => (
              <ModuleCard key={m.title} {...m} />
            ))}
          </div>
        </div>

        {/* ── IA + Configurações ── */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/assistente-ia"
            className={cn(
              "group relative flex items-center gap-5 p-5 rounded-2xl overflow-hidden",
              "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
              "dark:from-primary/15 dark:via-primary/8 dark:to-primary/3",
              "border border-primary/15 dark:border-primary/20",
              "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10",
              "transition-all duration-300 hover:-translate-y-0.5"
            )}
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
            <div className="h-13 w-13 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 h-12 w-12">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Assistente IA
                </h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
                  IA
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Tire dúvidas, analise dados e gere relatórios com IA
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </Link>

          <Link
            to="/configuracoes"
            className={cn(
              "group flex items-center gap-5 p-5 rounded-2xl",
              "bg-card border border-border/50 dark:border-border/30",
              "hover:border-border hover:shadow-sm",
              "transition-all duration-200 hover:-translate-y-0.5"
            )}
          >
            <div className="h-12 w-12 rounded-2xl bg-muted/60 dark:bg-muted/40 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
              <Settings className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-0.5">
                Configurações
              </h3>
              <p className="text-sm text-muted-foreground">
                Categorias, formas de pagamento e preferências
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </Link>
        </div>

        {/* Bottom spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
}
