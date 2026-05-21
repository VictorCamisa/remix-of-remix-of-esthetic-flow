import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileBarChart, Download, Calendar, Car, Users, ShoppingCart, DollarSign, Megaphone, Award } from "lucide-react";

const RELATORIOS = [
  { id: "r1", titulo: "Performance comercial", desc: "Vendas, conversão, ticket médio por vendedor.", icon: ShoppingCart, periodo: "Mensal" },
  { id: "r2", titulo: "Giro de estoque", desc: "Dias parados, margem por veículo, FIPE comparativa.", icon: Car, periodo: "Semanal" },
  { id: "r3", titulo: "Funil de leads", desc: "Origem, conversão por etapa e tempo de ciclo.", icon: Users, periodo: "Mensal" },
  { id: "r4", titulo: "DRE Mavers", desc: "Demonstrativo consolidado da loja.", icon: DollarSign, periodo: "Mensal" },
  { id: "r5", titulo: "Comissões", desc: "Apuração detalhada por vendedor e regra.", icon: Award, periodo: "Mensal" },
  { id: "r6", titulo: "ROI de marketing", desc: "CAC, LTV e retorno por canal/campanha.", icon: Megaphone, periodo: "Mensal" },
  { id: "r7", titulo: "Calendário operacional", desc: "Entregas, vistorias, agendamentos.", icon: Calendar, periodo: "Diário" },
  { id: "r8", titulo: "Auditoria de operações", desc: "Trilha de aprovações e alterações.", icon: FileBarChart, periodo: "Sob demanda" },
];

export default function MaversRelatorios() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Mavers · Relatórios"
        title="Relatórios"
        description="Exportação e visualização dos principais relatórios da loja."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {RELATORIOS.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.id} className="hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2 space-y-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-display">{r.titulo}</CardTitle>
                </div>
                <Badge variant="outline" className="text-2xs">{r.periodo}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">{r.desc}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs flex-1">Visualizar</Button>
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs"><Download className="h-3 w-3" /> PDF</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
