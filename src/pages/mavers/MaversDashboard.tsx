import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Stat } from "@/components/ds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Car, Users, ShoppingCart, DollarSign, TrendingUp, AlertCircle, ArrowRight,
} from "lucide-react";
import { VEHICLES, LEADS, SALES, SALESPEOPLE, brl, brlShort } from "@/components/mavers/mavers-data";

const trend = [
  { mes: "Dez", vendas: 18, receita: 1820 },
  { mes: "Jan", vendas: 22, receita: 2310 },
  { mes: "Fev", vendas: 19, receita: 1980 },
  { mes: "Mar", vendas: 25, receita: 2690 },
  { mes: "Abr", vendas: 28, receita: 3120 },
  { mes: "Mai", vendas: 24, receita: 2840 },
];

const mixOrigem = [
  { name: "Instagram", value: 32, color: "hsl(var(--primary))" },
  { name: "Site", value: 24, color: "hsl(var(--chart-2, 200 80% 50%))" },
  { name: "Google Ads", value: 18, color: "hsl(var(--chart-3, 280 60% 55%))" },
  { name: "WhatsApp", value: 14, color: "hsl(var(--chart-4, 30 80% 55%))" },
  { name: "Indicação", value: 12, color: "hsl(var(--chart-5, 140 60% 45%))" },
];

export default function MaversDashboard() {
  const disponiveis = VEHICLES.filter((v) => v.status === "disponivel").length;
  const reservados = VEHICLES.filter((v) => v.status === "reservado").length;
  const vendidosMes = SALES.filter((s) => s.status === "concluida").length;
  const receitaMes = SALES.filter((s) => s.status === "concluida").reduce((s, x) => s + x.valorVenda, 0);
  const margemMes = SALES.filter((s) => s.status === "concluida").reduce((s, x) => s + (x.valorVenda - x.custo), 0);
  const leadsAtivos = LEADS.filter((l) => !["ganho", "perdido"].includes(l.status)).length;
  const ticketMedio = vendidosMes ? receitaMes / vendidosMes : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mavers · VS Auto"
        title="Painel da loja"
        description="Visão consolidada de estoque, leads, pipeline e desempenho comercial."
        actions={
          <Badge variant="outline" className="text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-success mr-1.5 inline-block" />
            Operando
          </Badge>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <Stat label="Estoque disponível" value={disponiveis} hint={`${reservados} reservados`} className="border-0" />
        <Stat label="Vendas no mês" value={vendidosMes} delta={{ value: 14.2 }} className="border-0" />
        <Stat label="Receita do mês" value={brlShort(receitaMes)} delta={{ value: 8.7 }} className="border-0" />
        <Stat label="Margem bruta" value={brlShort(margemMes)} hint={`${((margemMes / receitaMes) * 100).toFixed(1)}%`} className="border-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">Receita & Vendas — 6 meses</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="receita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v}k`} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Area type="monotone" dataKey="receita" name="Receita (R$ mil)" stroke="hsl(var(--primary))" fill="url(#receita)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">Origem dos leads</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mixOrigem} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {mixOrigem.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-display">Equipe comercial</CardTitle>
            <Link to="/mavers/vendas" className="text-2xs uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
              ver vendas <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {SALESPEOPLE.map((s) => {
              const pct = Math.min(100, (s.realizadoMes / s.meta) * 100);
              return (
                <div key={s.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{s.nome}</span>
                    <span className="tabular text-muted-foreground">{brlShort(s.realizadoMes)} / {brlShort(s.meta)}</span>
                  </div>
                  <div className="h-1.5 bg-muted/60 overflow-hidden rounded-sm">
                    <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-2xs text-muted-foreground">
                    <span>{s.vendasMes} vendas · {(s.conversao * 100).toFixed(0)}% conv.</span>
                    <span className="tabular">{pct.toFixed(0)}% da meta</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">Atalhos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-px bg-border border border-border">
            <Atalho to="/mavers/estoque" icon={Car} label="Estoque" value={`${disponiveis} veículos`} />
            <Atalho to="/mavers/leads" icon={Users} label="Leads ativos" value={`${leadsAtivos} em pipeline`} />
            <Atalho to="/mavers/vendas" icon={ShoppingCart} label="Ticket médio" value={brlShort(ticketMedio)} />
            <Atalho to="/mavers/financeiro" icon={DollarSign} label="Financeiro" value={brlShort(receitaMes)} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-primary" />
            Veículos com maior tempo em estoque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {[...VEHICLES].filter((v) => v.status !== "vendido").sort((a, b) => b.diasEstoque - a.diasEstoque).slice(0, 5).map((v) => (
              <Link key={v.id} to={`/mavers/estoque/${v.id}`} className="flex items-center gap-3 py-2.5 hover:bg-accent/50 -mx-2 px-2 transition-colors">
                <Car className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{v.marca} {v.modelo} <span className="text-muted-foreground font-normal">— {v.versao}</span></p>
                  <p className="text-2xs text-muted-foreground">{v.ano} · {v.km.toLocaleString("pt-BR")} km · {v.cor}</p>
                </div>
                <span className="text-xs tabular text-foreground font-medium">{brl(v.preco)}</span>
                <Badge variant={v.diasEstoque > 30 ? "destructive" : "outline"} className="text-2xs ml-2">{v.diasEstoque}d</Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Atalho({ to, icon: Icon, label, value }: { to: string; icon: any; label: string; value: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 p-3 bg-card hover:bg-accent transition-colors">
      <Icon className="h-4 w-4 text-primary" />
      <div className="flex-1 min-w-0">
        <p className="text-2xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground tabular">{value}</p>
      </div>
      <ArrowRight className="h-3 w-3 text-muted-foreground" />
    </Link>
  );
}
