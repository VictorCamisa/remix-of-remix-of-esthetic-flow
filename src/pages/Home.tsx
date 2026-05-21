import {
  DollarSign, Users, Building2, BarChart3, ArrowRight, Sparkles, Settings,
  ClipboardList, Calendar, FileSignature, Kanban, TrendingUp, MessageCircle, LayoutDashboard,
  Car,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Stat } from "@/components/ds";

function useKPIs() {
  const today = new Date().toISOString().split("T")[0];
  const agendamentosHoje = useQuery({
    queryKey: ["home-agend", today],
    queryFn: async () => {
      const { count } = await supabase.from("crm_agendamentos").select("*", { count: "exact", head: true })
        .gte("data_agendamento", today + "T00:00:00").lte("data_agendamento", today + "T23:59:59");
      return count ?? 0;
    },
  });
  const contratosPendentes = useQuery({
    queryKey: ["home-contratos"],
    queryFn: async () => {
      const { count } = await supabase.from("contratos_paciente").select("*", { count: "exact", head: true }).eq("status", "pendente");
      return count ?? 0;
    },
  });
  const pacientes = useQuery({
    queryKey: ["home-pac"],
    queryFn: async () => {
      const { count } = await supabase.from("pacientes").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });
  const receitaMes = useQuery({
    queryKey: ["home-rec"],
    queryFn: async () => {
      const inicio = new Date(); inicio.setDate(1); inicio.setHours(0, 0, 0, 0);
      const { data } = await supabase.from("td_fluxo_de_caixa").select("valor")
        .eq("tipo", "receita").eq("status", "pago")
        .gte("data_lancamento", inicio.toISOString().split("T")[0]);
      return (data ?? []).reduce((s, r) => s + (r.valor ?? 0), 0);
    },
  });
  return { agendamentosHoje, contratosPendentes, pacientes, receitaMes };
}

const modules = [
  { title: "Financeiro", desc: "Fluxo de caixa, DRE, orçamentos.", icon: DollarSign, href: "/financeiro" },
  { title: "Comercial", desc: "Pipeline, agendamentos, WhatsApp.", icon: Users, href: "/crm/pipeline" },
  { title: "Gestão Clínica", desc: "Contratos, anamneses, prontuários.", icon: ClipboardList, href: "/gestao" },
  { title: "Mavers · VS Auto", desc: "Estoque, leads, vendas e CRM da loja Mavers.", icon: Car, href: "/mavers" },
  { title: "Business Intelligence", desc: "LTV/CAC, marketing, projeções.", icon: BarChart3, href: "/bi" },
  { title: "Administrativo", desc: "Usuários, LGPD, auditoria.", icon: Building2, href: "/admin" },
];

const quickActions = [
  { href: "/crm/pipeline", icon: Kanban, label: "Pipeline" },
  { href: "/crm/agendamentos", icon: Calendar, label: "Agenda" },
  { href: "/gestao/contratos", icon: FileSignature, label: "Contratos" },
  { href: "/crm/whatsapp", icon: MessageCircle, label: "WhatsApp" },
  { href: "/financeiro", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/assistente-ia", icon: Sparkles, label: "Assistente IA" },
];

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);
}

export default function Home() {
  const now = new Date();
  const { agendamentosHoje, contratosPendentes, pacientes, receitaMes } = useKPIs();
  const hora = now.getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const data = format(now, "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <div className="space-y-6">
      {/* Hero (denso, editorial) */}
      <div className="flex items-end justify-between gap-4 pb-4 border-b border-border">
        <div>
          <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            Painel · {data.charAt(0).toUpperCase() + data.slice(1)}
          </p>
          <h1 className="text-3xl font-display font-semibold text-foreground tracking-tight">
            {saudacao}, Dra. Taysa
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-2xs text-muted-foreground tabular">Sistema operacional</span>
        </div>
      </div>

      {/* KPIs — sem cards arredondados, hairline borders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <Stat label="Agendamentos hoje" value={agendamentosHoje.isLoading ? "—" : agendamentosHoje.data ?? 0} hint="agenda" className="border-0" />
        <Stat label="Contratos pendentes" value={contratosPendentes.isLoading ? "—" : contratosPendentes.data ?? 0} hint="aguardando assinatura" className="border-0" />
        <Stat label="Pacientes cadastrados" value={pacientes.isLoading ? "—" : pacientes.data ?? 0} hint="base ativa" className="border-0" />
        <Stat label="Receita do mês" value={receitaMes.isLoading ? "—" : brl(receitaMes.data ?? 0)} hint="lançamentos pagos" className="border-0" />
      </div>

      {/* Quick Actions — barra densa */}
      <div>
        <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Ações rápidas
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border border border-border">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                to={a.href}
                className="group flex items-center gap-2.5 h-10 px-3 bg-card hover:bg-accent transition-colors text-[13px]"
              >
                <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
                <span className="font-medium text-foreground">{a.label}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground/40 ml-auto group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Módulos — table-like list */}
      <div>
        <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Módulos
        </p>
        <div className="border border-border">
          {modules.map((m, i) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.title}
                to={m.href}
                className={cn(
                  "group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 h-12 bg-card hover:bg-accent transition-colors",
                  i !== modules.length - 1 && "border-b border-border"
                )}
              >
                <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="text-sm font-medium text-foreground">{m.title}</span>
                  <span className="text-xs text-muted-foreground truncate">{m.desc}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer link */}
      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
        <Link to="/configuracoes" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
          <Settings className="h-3 w-3" />
          Configurações
        </Link>
        <span className="tabular text-2xs">v1.0 · {format(now, "dd/MM/yyyy HH:mm")}</span>
      </div>
    </div>
  );
}
