import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Car, Filter, Gauge, Calendar, Tag } from "lucide-react";
import { VEHICLES, VEHICLE_STATUS_LABEL, brl, type VehicleStatus } from "@/components/mavers/mavers-data";

const statusVariant: Record<VehicleStatus, "default" | "secondary" | "outline" | "destructive"> = {
  disponivel: "default",
  reservado: "secondary",
  vendido: "outline",
  manutencao: "destructive",
};

export default function MaversEstoque() {
  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");
  const [marcaFilter, setMarcaFilter] = useState("all");

  const marcas = useMemo(() => Array.from(new Set(VEHICLES.map((v) => v.marca))).sort(), []);

  const filtrados = useMemo(() => {
    return VEHICLES.filter((v) => {
      if (statusFilter !== "all" && v.status !== statusFilter) return false;
      if (marcaFilter !== "all" && v.marca !== marcaFilter) return false;
      if (busca && !`${v.marca} ${v.modelo} ${v.versao} ${v.placa}`.toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    });
  }, [busca, statusFilter, marcaFilter]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Mavers · Estoque"
        title="Estoque de veículos"
        description={`${filtrados.length} de ${VEHICLES.length} veículos`}
        actions={
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Novo veículo
          </Button>
        }
      />

      <Card>
        <CardContent className="p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por marca, modelo, versão ou placa"
              className="h-9 pl-8 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="h-9 w-[160px] text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="disponivel">Disponível</SelectItem>
              <SelectItem value="reservado">Reservado</SelectItem>
              <SelectItem value="vendido">Vendido</SelectItem>
              <SelectItem value="manutencao">Manutenção</SelectItem>
            </SelectContent>
          </Select>
          <Select value={marcaFilter} onValueChange={setMarcaFilter}>
            <SelectTrigger className="h-9 w-[150px] text-sm"><SelectValue placeholder="Marca" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas marcas</SelectItem>
              {marcas.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <Filter className="h-3.5 w-3.5" />
            Mais filtros
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map((v) => (
          <Link key={v.id} to={`/mavers/estoque/${v.id}`} className="group">
            <Card className="overflow-hidden hover:border-primary/40 transition-colors h-full">
              <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                <img
                  src={v.foto}
                  alt={`${v.marca} ${v.modelo}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <Badge variant={statusVariant[v.status]} className="absolute top-2 left-2 text-2xs">
                  {VEHICLE_STATUS_LABEL[v.status]}
                </Badge>
                <span className="absolute bottom-2 right-2 text-2xs bg-background/90 backdrop-blur px-1.5 py-0.5 font-medium text-foreground">
                  {v.diasEstoque}d em estoque
                </span>
              </div>
              <CardContent className="p-3 space-y-2">
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">{v.marca} {v.modelo}</p>
                  <p className="text-xs text-muted-foreground truncate">{v.versao}</p>
                </div>
                <div className="flex items-center gap-3 text-2xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {v.ano}</span>
                  <span className="flex items-center gap-1"><Gauge className="h-3 w-3" /> {(v.km / 1000).toFixed(0)}k km</span>
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {v.placa}</span>
                </div>
                <div className="flex items-end justify-between pt-1 border-t border-border">
                  <span className="text-base font-display font-semibold text-foreground tabular">{brl(v.preco)}</span>
                  <span className="text-2xs text-muted-foreground">FIPE {brl(v.precoFipe)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Car className="h-8 w-8" />
            <p className="text-sm">Nenhum veículo encontrado com os filtros atuais.</p>
          </div>
        )}
      </div>
    </div>
  );
}
