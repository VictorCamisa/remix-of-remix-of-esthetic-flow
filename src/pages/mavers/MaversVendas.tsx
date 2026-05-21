import { PageHeader } from "@/components/PageHeader";
import { Stat } from "@/components/ds";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { SALES, brl } from "@/components/mavers/mavers-data";
import { format } from "date-fns";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  concluida: "default",
  aprovacao: "secondary",
  pendente: "outline",
};

const statusLabel: Record<string, string> = {
  concluida: "Concluída",
  aprovacao: "Aguardando aprovação",
  pendente: "Pendente",
};

export default function MaversVendas() {
  const concluidas = SALES.filter((s) => s.status === "concluida");
  const receita = concluidas.reduce((s, x) => s + x.valorVenda, 0);
  const lucro = concluidas.reduce((s, x) => s + (x.valorVenda - x.custo), 0);
  const ticket = concluidas.length ? receita / concluidas.length : 0;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Mavers · Vendas"
        title="Vendas"
        description="Histórico, aprovações e métricas comerciais."
        actions={<Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Nova venda</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <Stat label="Vendas no mês" value={concluidas.length} className="border-0" />
        <Stat label="Receita" value={brl(receita)} delta={{ value: 8.7 }} className="border-0" />
        <Stat label="Lucro bruto" value={brl(lucro)} hint={`${((lucro / receita) * 100).toFixed(1)}%`} className="border-0" />
        <Stat label="Ticket médio" value={brl(ticket)} className="border-0" />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="text-2xs uppercase tracking-widest">
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Comissão</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SALES.map((s) => (
              <TableRow key={s.id} className="text-sm">
                <TableCell className="tabular text-xs">{format(new Date(s.data), "dd/MM/yyyy")}</TableCell>
                <TableCell className="font-medium">{s.cliente}</TableCell>
                <TableCell className="text-xs">{s.veiculo}</TableCell>
                <TableCell className="text-xs">{s.vendedor}</TableCell>
                <TableCell><Badge variant="outline" className="text-2xs">{s.formaPagamento}</Badge></TableCell>
                <TableCell><Badge variant={statusVariant[s.status]} className="text-2xs">{statusLabel[s.status]}</Badge></TableCell>
                <TableCell className="text-right tabular text-xs">{brl(s.comissao)}</TableCell>
                <TableCell className="text-right tabular font-medium">{brl(s.valorVenda)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
