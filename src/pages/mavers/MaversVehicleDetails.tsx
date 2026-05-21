import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Gauge, Fuel, Cog, Palette, Tag, Phone, MessageCircle, FileText } from "lucide-react";
import { VEHICLES, VEHICLE_STATUS_LABEL, brl } from "@/components/mavers/mavers-data";

export default function MaversVehicleDetails() {
  const { id } = useParams();
  const v = VEHICLES.find((x) => x.id === id);

  if (!v) {
    return (
      <div className="space-y-4">
        <PageHeader title="Veículo não encontrado" />
        <Link to="/mavers/estoque" className="text-sm text-primary inline-flex items-center gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao estoque
        </Link>
      </div>
    );
  }

  const margem = v.preco - v.custoAquisicao;
  const margemPct = (margem / v.preco) * 100;
  const vsFipe = v.preco - v.precoFipe;

  return (
    <div className="space-y-5">
      <Link to="/mavers/estoque" className="text-xs text-muted-foreground inline-flex items-center gap-1.5 hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Estoque
      </Link>

      <PageHeader
        eyebrow={`Mavers · ${v.placa}`}
        title={`${v.marca} ${v.modelo}`}
        description={v.versao}
        actions={
          <div className="flex gap-2">
            <Badge variant="outline">{VEHICLE_STATUS_LABEL[v.status]}</Badge>
            <Button size="sm" variant="outline" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Proposta</Button>
            <Button size="sm" className="gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> Reservar</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="aspect-[16/9] bg-muted">
            <img src={v.foto} alt={v.modelo} className="w-full h-full object-cover" />
          </div>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">Precificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-2xs uppercase tracking-widest text-muted-foreground">Preço de venda</p>
              <p className="text-3xl font-display font-semibold text-foreground tabular">{brl(v.preco)}</p>
            </div>
            <Separator />
            <Row label="FIPE" value={brl(v.precoFipe)} hint={`${vsFipe >= 0 ? "+" : ""}${brl(vsFipe)}`} />
            <Row label="Custo aquisição" value={brl(v.custoAquisicao)} />
            <Row label="Margem bruta" value={brl(margem)} hint={`${margemPct.toFixed(1)}%`} accent />
            <Row label="Dias em estoque" value={`${v.diasEstoque} dias`} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">Ficha técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm">
              <Field icon={Calendar} label="Ano" value={String(v.ano)} />
              <Field icon={Gauge} label="Quilometragem" value={`${v.km.toLocaleString("pt-BR")} km`} />
              <Field icon={Palette} label="Cor" value={v.cor} />
              <Field icon={Fuel} label="Combustível" value={v.combustivel} />
              <Field icon={Cog} label="Câmbio" value={v.cambio} />
              <Field icon={Tag} label="Placa" value={v.placa} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">Leads interessados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { nome: "Ricardo Almeida", tel: "(11) 99812-4520", status: "Negociação" },
              { nome: "Patrícia Souza", tel: "(11) 99771-3398", status: "Proposta" },
            ].map((l) => (
              <div key={l.nome} className="flex items-center justify-between gap-2 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{l.nome}</p>
                  <p className="text-2xs text-muted-foreground">{l.tel}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-2xs">{l.status}</Badge>
                  <Button size="icon" variant="ghost" className="h-7 w-7"><Phone className="h-3 w-3" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="text-right">
        <span className={`tabular font-medium ${accent ? "text-success" : "text-foreground"}`}>{value}</span>
        {hint && <span className="block text-2xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
      <div>
        <dt className="text-2xs uppercase tracking-widest text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-foreground">{value}</dd>
      </div>
    </div>
  );
}
