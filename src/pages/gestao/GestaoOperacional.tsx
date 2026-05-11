import { Link } from "react-router-dom";
import {
  FileText, ClipboardList, FlaskConical, Camera, Pill, Stethoscope,
  FileSignature, ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Stat } from "@/components/ds";
import { cn } from "@/lib/utils";

interface Process {
  title: string; href: string; icon: React.ElementType;
  total: number; pending: number; completed: number;
}

function Row({ p }: { p: Process }) {
  const rate = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
  const Icon = p.icon;
  return (
    <Link
      to={p.href}
      className="group grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-4 h-12 hover:bg-accent transition-colors"
    >
      <Icon className="h-4 w-4 text-primary" strokeWidth={2} />
      <span className="text-sm font-medium text-foreground truncate">{p.title}</span>
      <span className="text-xs text-muted-foreground tabular w-16 text-right">{p.total} total</span>
      <span className="text-xs text-warning tabular w-20 text-right">{p.pending} pend.</span>
      <span className="text-xs text-success tabular w-20 text-right">{p.completed} ok</span>
      <div className="flex items-center gap-2 w-32 justify-end">
        <div className="h-1 w-16 bg-muted overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${rate}%` }} />
        </div>
        <span className="text-2xs tabular text-muted-foreground w-8 text-right">{rate}%</span>
        <ArrowRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}

export default function GestaoOperacional() {
  const { data: counts } = useQuery({
    queryKey: ["gestao-counts"],
    queryFn: async () => {
      const [
        { count: totalPacientes },
        { count: planosPendentes }, { count: planosCompletos },
        { count: contratosPendentes }, { count: contratosAssinados },
        { count: anamneses }, { count: exames }, { count: fotos },
        { count: receituarios }, { count: prontuarios },
      ] = await Promise.all([
        supabase.from("pacientes").select("*", { count: "exact", head: true }),
        supabase.from("planos_tratamento").select("*", { count: "exact", head: true }).eq("status", "pendente"),
        supabase.from("planos_tratamento").select("*", { count: "exact", head: true }).eq("status", "aprovado"),
        supabase.from("contratos_paciente").select("*", { count: "exact", head: true }).eq("status", "pendente"),
        supabase.from("contratos_paciente").select("*", { count: "exact", head: true }).eq("status", "assinado"),
        supabase.from("anamneses").select("*", { count: "exact", head: true }),
        supabase.from("exames_paciente").select("*", { count: "exact", head: true }),
        supabase.from("fotos_paciente").select("*", { count: "exact", head: true }),
        supabase.from("receituario_digital").select("*", { count: "exact", head: true }),
        supabase.from("prontuarios").select("*", { count: "exact", head: true }),
      ]);
      return {
        totalPacientes: totalPacientes || 0,
        planosPendentes: planosPendentes || 0, planosCompletos: planosCompletos || 0,
        contratosPendentes: contratosPendentes || 0, contratosAssinados: contratosAssinados || 0,
        anamneses: anamneses || 0, exames: exames || 0, fotos: fotos || 0,
        receituarios: receituarios || 0, prontuarios: prontuarios || 0,
      };
    },
  });

  const c = counts ?? { totalPacientes: 0, planosPendentes: 0, planosCompletos: 0, contratosPendentes: 0, contratosAssinados: 0, anamneses: 0, exames: 0, fotos: 0, receituarios: 0, prontuarios: 0 };

  const processes: Process[] = [
    { title: "Planos de Tratamento", icon: FileText, href: "/gestao/planos-tratamento", total: c.planosPendentes + c.planosCompletos, pending: c.planosPendentes, completed: c.planosCompletos },
    { title: "Contratos", icon: FileSignature, href: "/gestao/contratos", total: c.contratosPendentes + c.contratosAssinados, pending: c.contratosPendentes, completed: c.contratosAssinados },
    { title: "Anamneses", icon: ClipboardList, href: "/gestao/anamneses", total: c.anamneses, pending: 0, completed: c.anamneses },
    { title: "Exames", icon: FlaskConical, href: "/gestao/exames", total: c.exames, pending: 0, completed: c.exames },
    { title: "Fotos", icon: Camera, href: "/gestao/fotos", total: c.fotos, pending: 0, completed: c.fotos },
    { title: "Receituários", icon: Pill, href: "/gestao/receituarios", total: c.receituarios, pending: 0, completed: c.receituarios },
    { title: "Prontuários", icon: Stethoscope, href: "/gestao/prontuarios", total: c.prontuarios, pending: 0, completed: c.prontuarios },
  ];

  const totalProcessos = processes.reduce((acc, p) => acc + p.total, 0);
  const totalPendentes = processes.reduce((acc, p) => acc + p.pending, 0);
  const totalCompletos = processes.reduce((acc, p) => acc + p.completed, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gestão Clínica"
        title="Visão operacional"
        description="Estado de cada processo clínico"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <Stat label="Pacientes ativos" value={c.totalPacientes} className="border-0" />
        <Stat label="Total processos" value={totalProcessos} className="border-0" />
        <Stat label="Pendentes" value={totalPendentes} className="border-0" />
        <Stat label="Completos" value={totalCompletos} className="border-0" />
      </div>

      <div>
        <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Processos
        </p>
        <div className="border border-border bg-card divide-y divide-border">
          {processes.map((p) => <Row key={p.title} p={p} />)}
        </div>
      </div>
    </div>
  );
}
