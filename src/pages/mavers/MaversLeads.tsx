import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Stat } from "@/components/ds";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Phone, MessageCircle, TrendingUp } from "lucide-react";
import { LEADS, STATUS_LABEL, brl, type LeadStatus } from "@/components/mavers/mavers-data";

const statusVariant: Record<LeadStatus, "default" | "secondary" | "outline" | "destructive"> = {
  novo: "secondary",
  qualificado: "outline",
  negociacao: "default",
  proposta: "default",
  ganho: "outline",
  perdido: "destructive",
};

export default function MaversLeads() {
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() =>
    LEADS.filter((l) => !busca || `${l.nome} ${l.veiculoInteresse} ${l.vendedor} ${l.telefone}`.toLowerCase().includes(busca.toLowerCase())),
    [busca]);

  const ativos = LEADS.filter((l) => !["ganho", "perdido"].includes(l.status));
  const ganhos = LEADS.filter((l) => l.status === "ganho").length;
  const taxa = (ganhos / LEADS.length) * 100;
  const pipeline = ativos.reduce((s, l) => s + l.valor, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Mavers · Comercial"
        title="Leads"
        description="Captação, qualificação e acompanhamento de oportunidades."
        actions={<Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Novo lead</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <Stat label="Leads ativos" value={ativos.length} className="border-0" />
        <Stat label="Pipeline" value={brl(pipeline)} className="border-0" />
        <Stat label="Conversão" value={`${taxa.toFixed(1)}%`} delta={{ value: 2.3 }} className="border-0" />
        <Stat label="Total no mês" value={LEADS.length} delta={{ value: 12.5 }} className="border-0" />
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar lead..." className="h-9 pl-8 text-sm" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="text-2xs uppercase tracking-widest">
              <TableHead>Lead</TableHead>
              <TableHead>Interesse</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.map((l) => (
              <TableRow key={l.id} className="text-sm">
                <TableCell>
                  <div>
                    <p className="font-medium">{l.nome}</p>
                    <p className="text-2xs text-muted-foreground">{l.telefone}</p>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{l.veiculoInteresse}</TableCell>
                <TableCell><Badge variant="outline" className="text-2xs">{l.origem}</Badge></TableCell>
                <TableCell className="text-xs">{l.vendedor}</TableCell>
                <TableCell><Badge variant={statusVariant[l.status]} className="text-2xs">{STATUS_LABEL[l.status]}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 ${l.score >= 75 ? "text-success" : l.score >= 50 ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="tabular text-xs font-medium">{l.score}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular text-xs font-medium">{brl(l.valor)}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Phone className="h-3 w-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7"><MessageCircle className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
