import { PageHeader } from "@/components/PageHeader";
import { Stat } from "@/components/ds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SALES, brl, brlShort } from "@/components/mavers/mavers-data";

const dre = [
  { mes: "Jan", receita: 2310, custo: 1985, despesa: 165 },
  { mes: "Fev", receita: 1980, custo: 1702, despesa: 158 },
  { mes: "Mar", receita: 2690, custo: 2316, despesa: 178 },
  { mes: "Abr", receita: 3120, custo: 2687, despesa: 191 },
  { mes: "Mai", receita: 2840, custo: 2442, despesa: 184 },
];

const contasPagar = [
  { id: "p1", descricao: "Fornecedor — Estoque maio", vencimento: "2026-05-28", valor: 184000, status: "a_vencer" },
  { id: "p2", descricao: "Despachante DETRAN", vencimento: "2026-05-25", valor: 8400, status: "a_vencer" },
  { id: "p3", descricao: "Aluguel pátio", vencimento: "2026-05-22", valor: 18500, status: "atrasado" },
  { id: "p4", descricao: "Marketing — Meta Ads", vencimento: "2026-05-30", valor: 12500, status: "a_vencer" },
  { id: "p5", descricao: "Folha vendedores", vencimento: "2026-05-31", valor: 38900, status: "a_vencer" },
];

export default function MaversFinanceiro() {
  const receita = SALES.filter((s) => s.status === "concluida").reduce((a, b) => a + b.valorVenda, 0);
  const custo = SALES.filter((s) => s.status === "concluida").reduce((a, b) => a + b.custo, 0);
  const lucroBruto = receita - custo;
  const aPagar = contasPagar.reduce((a, b) => a + b.valor, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Mavers · Financeiro"
        title="Financeiro da loja"
        description="DRE, fluxo de caixa e contas a pagar do módulo VS Auto."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <Stat label="Receita mês" value={brl(receita)} delta={{ value: 8.7 }} className="border-0" />
        <Stat label="CMV" value={brl(custo)} hint={`${((custo / receita) * 100).toFixed(1)}%`} className="border-0" />
        <Stat label="Lucro bruto" value={brl(lucroBruto)} delta={{ value: 11.4 }} className="border-0" />
        <Stat label="A pagar" value={brl(aPagar)} hint={`${contasPagar.length} contas`} className="border-0" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display">DRE — últimos 5 meses (R$ mil)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dre}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="receita" fill="hsl(var(--primary))" name="Receita" />
              <Bar dataKey="custo" fill="hsl(var(--muted-foreground))" name="CMV" />
              <Bar dataKey="despesa" fill="hsl(var(--destructive))" name="Despesa" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display">Contas a pagar</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="text-2xs uppercase tracking-widest">
              <TableHead>Descrição</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contasPagar.map((c) => (
              <TableRow key={c.id} className="text-sm">
                <TableCell className="font-medium">{c.descricao}</TableCell>
                <TableCell className="tabular text-xs">{new Date(c.vencimento).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  <Badge variant={c.status === "atrasado" ? "destructive" : "outline"} className="text-2xs">
                    {c.status === "atrasado" ? "Atrasado" : "A vencer"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular font-medium">{brl(c.valor)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
