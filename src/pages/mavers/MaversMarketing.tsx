import { PageHeader } from "@/components/PageHeader";
import { Stat } from "@/components/ds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { brlShort } from "@/components/mavers/mavers-data";

const trend = [
  { mes: "Dez", leads: 78, invest: 18 },
  { mes: "Jan", leads: 92, invest: 22 },
  { mes: "Fev", leads: 81, invest: 20 },
  { mes: "Mar", leads: 105, invest: 25 },
  { mes: "Abr", leads: 124, invest: 28 },
  { mes: "Mai", leads: 118, invest: 27 },
];

const campanhas = [
  { nome: "Meta Ads — Estoque maio", canal: "Meta", invest: 8400, leads: 42, cac: 200, status: "ativa" },
  { nome: "Google Search — SUVs", canal: "Google Ads", invest: 6200, leads: 28, cac: 221, status: "ativa" },
  { nome: "Instagram — Reels Toro", canal: "Instagram", invest: 3100, leads: 19, cac: 163, status: "ativa" },
  { nome: "OLX — Destaques", canal: "OLX", invest: 1800, leads: 14, cac: 129, status: "ativa" },
  { nome: "WhatsApp Broadcast", canal: "WhatsApp", invest: 0, leads: 15, cac: 0, status: "organica" },
];

export default function MaversMarketing() {
  const invest = campanhas.reduce((s, c) => s + c.invest, 0);
  const leads = campanhas.reduce((s, c) => s + c.leads, 0);
  const cac = invest / leads;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Mavers · Marketing"
        title="Marketing & captação"
        description="Investimento, performance e funil de captação."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <Stat label="Investimento mês" value={brlShort(invest)} delta={{ value: 6.2 }} className="border-0" />
        <Stat label="Leads gerados" value={leads} delta={{ value: 12.5 }} className="border-0" />
        <Stat label="CAC médio" value={brlShort(cac)} hint="custo por lead" className="border-0" />
        <Stat label="Campanhas ativas" value={campanhas.filter((c) => c.status === "ativa").length} className="border-0" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display">Leads × Investimento (6 meses)</CardTitle>
        </CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis yAxisId="l" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis yAxisId="r" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v}k`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="l" type="monotone" dataKey="leads" stroke="hsl(var(--primary))" strokeWidth={2} name="Leads" />
              <Line yAxisId="r" type="monotone" dataKey="invest" stroke="hsl(var(--muted-foreground))" strokeWidth={2} name="Invest. (R$ mil)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display">Campanhas</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="text-2xs uppercase tracking-widest">
              <TableHead>Campanha</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead className="text-right">Investimento</TableHead>
              <TableHead className="text-right">Leads</TableHead>
              <TableHead className="text-right">CAC</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campanhas.map((c) => (
              <TableRow key={c.nome} className="text-sm">
                <TableCell className="font-medium">{c.nome}</TableCell>
                <TableCell><Badge variant="outline" className="text-2xs">{c.canal}</Badge></TableCell>
                <TableCell className="text-right tabular text-xs">{brlShort(c.invest)}</TableCell>
                <TableCell className="text-right tabular text-xs">{c.leads}</TableCell>
                <TableCell className="text-right tabular text-xs">{c.cac ? brlShort(c.cac) : "—"}</TableCell>
                <TableCell><Badge variant={c.status === "ativa" ? "default" : "secondary"} className="text-2xs">{c.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
