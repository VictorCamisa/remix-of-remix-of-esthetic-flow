import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LEADS, STATUS_LABEL, brl, type LeadStatus } from "@/components/mavers/mavers-data";

const PIPELINE_STAGES: LeadStatus[] = ["novo", "qualificado", "negociacao", "proposta", "ganho"];

export default function MaversCRM() {
  const grouped = PIPELINE_STAGES.map((stage) => ({
    stage,
    leads: LEADS.filter((l) => l.status === stage),
  }));
  const total = LEADS.filter((l) => l.status !== "perdido").reduce((s, l) => s + l.valor, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Mavers · CRM"
        title="Pipeline comercial"
        description={`${LEADS.length} oportunidades · ${brl(total)} em pipeline`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {grouped.map(({ stage, leads }) => {
          const stageValue = leads.reduce((s, l) => s + l.valor, 0);
          return (
            <div key={stage} className="bg-muted/30 border border-border p-2 space-y-2 min-h-[400px]">
              <div className="flex items-center justify-between px-1">
                <div>
                  <p className="text-2xs uppercase tracking-widest text-muted-foreground font-semibold">{STATUS_LABEL[stage]}</p>
                  <p className="text-xs tabular text-foreground font-medium mt-0.5">{brl(stageValue)}</p>
                </div>
                <Badge variant="outline" className="text-2xs">{leads.length}</Badge>
              </div>

              <div className="space-y-2">
                {leads.map((l) => (
                  <Card key={l.id} className="p-2.5 space-y-1.5 cursor-pointer hover:border-primary/40 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight truncate">{l.nome}</p>
                      <span className="text-2xs tabular text-muted-foreground flex-shrink-0">{l.score}</span>
                    </div>
                    <p className="text-2xs text-muted-foreground truncate">{l.veiculoInteresse}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-border">
                      <Badge variant="outline" className="text-2xs">{l.origem}</Badge>
                      <span className="text-2xs tabular font-medium">{brl(l.valor)}</span>
                    </div>
                    <p className="text-2xs text-muted-foreground">{l.vendedor}</p>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
