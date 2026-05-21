import { PageHeader } from "@/components/PageHeader";
import { Stat } from "@/components/ds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Trophy, Medal } from "lucide-react";
import { SALESPEOPLE, SALES, brl } from "@/components/mavers/mavers-data";

const RULES = [
  { id: "r1", nome: "Padrão Mavers", descricao: "2% sobre valor da venda", ativo: true, vendedores: 3 },
  { id: "r2", nome: "Bonus Meta 100%", descricao: "+0,5% ao atingir meta mensal", ativo: true, vendedores: 3 },
  { id: "r3", nome: "Premium Diesel", descricao: "3% sobre vendas diesel acima R$ 200k", ativo: true, vendedores: 2 },
  { id: "r4", nome: "Indicação", descricao: "1% sobre vendas vindas de indicação", ativo: false, vendedores: 0 },
];

export default function MaversComissoes() {
  const totalComissao = SALESPEOPLE.reduce((s, p) => s + p.comissaoMes, 0);
  const totalRealizado = SALESPEOPLE.reduce((s, p) => s + p.realizadoMes, 0);
  const totalMeta = SALESPEOPLE.reduce((s, p) => s + p.meta, 0);
  const ranked = [...SALESPEOPLE].sort((a, b) => b.realizadoMes - a.realizadoMes);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Mavers · Comissões"
        title="Comissões"
        description="Regras, metas e ranking de performance da equipe."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        <Stat label="Comissão total mês" value={brl(totalComissao)} className="border-0" />
        <Stat label="Realizado" value={brl(totalRealizado)} className="border-0" />
        <Stat label="Meta da loja" value={brl(totalMeta)} hint={`${((totalRealizado / totalMeta) * 100).toFixed(0)}%`} className="border-0" />
        <Stat label="Regras ativas" value={RULES.filter((r) => r.ativo).length} className="border-0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-primary" /> Ranking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ranked.map((p, i) => {
              const pct = Math.min(100, (p.realizadoMes / p.meta) * 100);
              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-2xs font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{i + 1}</span>
                      <span className="font-medium">{p.nome}</span>
                      {i === 0 && <Medal className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <span className="tabular text-xs text-muted-foreground">{p.vendasMes} vendas</span>
                  </div>
                  <div className="h-1.5 bg-muted/60 overflow-hidden rounded-sm">
                    <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-2xs text-muted-foreground tabular">
                    <span>{brl(p.realizadoMes)} / {brl(p.meta)}</span>
                    <span>Comissão: {brl(p.comissaoMes)}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Award className="h-3.5 w-3.5 text-primary" /> Regras de comissão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-border">
            {RULES.map((r) => (
              <div key={r.id} className="py-2.5 flex items-start justify-between gap-2 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{r.nome}</p>
                  <p className="text-2xs text-muted-foreground mt-0.5">{r.descricao}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={r.ativo ? "default" : "outline"} className="text-2xs">{r.ativo ? "Ativa" : "Inativa"}</Badge>
                  <span className="text-2xs text-muted-foreground">{r.vendedores} vendedores</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display">Histórico de comissões — mês atual</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="text-2xs uppercase tracking-widest">
              <TableHead>Venda</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead className="text-right">Valor venda</TableHead>
              <TableHead className="text-right">% Comissão</TableHead>
              <TableHead className="text-right">Comissão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SALES.filter((s) => s.status === "concluida").map((s) => (
              <TableRow key={s.id} className="text-sm">
                <TableCell className="tabular text-xs text-muted-foreground">{s.id.toUpperCase()}</TableCell>
                <TableCell className="font-medium">{s.vendedor}</TableCell>
                <TableCell className="text-xs">{s.veiculo}</TableCell>
                <TableCell className="text-right tabular text-xs">{brl(s.valorVenda)}</TableCell>
                <TableCell className="text-right tabular text-xs">{((s.comissao / s.valorVenda) * 100).toFixed(2)}%</TableCell>
                <TableCell className="text-right tabular font-medium">{brl(s.comissao)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
