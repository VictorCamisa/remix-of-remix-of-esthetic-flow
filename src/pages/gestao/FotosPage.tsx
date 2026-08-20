import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FilterBar } from "@/components/ui/FilterBar";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Camera,
  ExternalLink,
  Image,
} from "lucide-react";

const CATEGORIAS = [
  { value: "Antes", label: "Antes", color: "bg-blue-500/10 text-blue-600" },
  { value: "Depois", label: "Depois", color: "bg-emerald-500/10 text-emerald-600" },
  { value: "Durante", label: "Durante", color: "bg-amber-500/10 text-amber-600" },
  { value: "Outros", label: "Outros", color: "bg-slate-500/10 text-slate-600" },
];

const CATEGORIA_MAP = Object.fromEntries(CATEGORIAS.map((c) => [c.value, c]));

interface FotoForm {
  paciente_id: string;
  url: string;
  categoria: string;
  descricao: string;
  data_foto: string;
}

const EMPTY_FORM: FotoForm = {
  paciente_id: "",
  url: "",
  categoria: "Outros",
  descricao: "",
  data_foto: format(new Date(), "yyyy-MM-dd"),
};

export default function FotosPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FotoForm>(EMPTY_FORM);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; foto: any | null }>({ open: false, foto: null });
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const { data: fotos, isLoading } = useQuery({
    queryKey: ["gestao-fotos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fotos_paciente")
        .select("*, pacientes:paciente_id (id, nome)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const { data: pacientes } = useQuery({
    queryKey: ["pacientes-ativos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pacientes")
        .select("id, nome")
        .eq("ativo", true)
        .order("nome");
      if (error) throw error;
      return data as any[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: FotoForm) => {
      const { error } = await supabase.from("fotos_paciente").insert({
        paciente_id: data.paciente_id,
        url: data.url,
        categoria: data.categoria,
        descricao: data.descricao || null,
        data_foto: data.data_foto,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-fotos"] });
      toast({ title: "Foto adicionada!", description: "A foto foi salva com sucesso." });
      setDialogOpen(false);
      setForm(EMPTY_FORM);
    },
    onError: (e: any) => toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fotos_paciente").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-fotos"] });
      toast({ title: "Foto excluída", description: "A foto foi removida." });
      setDeleteDialog({ open: false, foto: null });
    },
    onError: (e: any) => toast({ title: "Erro ao excluir", description: e.message, variant: "destructive" }),
  });

  const filtered = fotos?.filter((f) => {
    const matchSearch = f.pacientes?.nome?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoriaFilter === "all" || f.categoria === categoriaFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/gestao"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <PageHeader
          title="Fotos"
          description="Visão agregada entre todos os pacientes — galeria de acompanhamento"
          className="mb-0 flex-1"
          actions={
            <Button onClick={() => { setForm(EMPTY_FORM); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar Foto
            </Button>
          }
        />
      </div>

      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: "Buscar por paciente..." }}
        filters={
          <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {CATEGORIAS.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {/* Gallery Grid */}
      {isLoading ? (
        <LoadingState />
      ) : !filtered?.length ? (
        <Card className="bg-card/60 border-border/40">
          <CardContent>
            <EmptyState icon={Camera} title="Nenhuma foto encontrada" description="Ajuste os filtros ou adicione uma nova foto." />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((foto) => {
            const catCfg = CATEGORIA_MAP[foto.categoria];
            const hasError = imgErrors[foto.id];
            return (
              <div
                key={foto.id}
                className={cn(
                  "group relative rounded-xl overflow-hidden",
                  "bg-card/60 border border-border/40",
                  "hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
                )}
              >
                <div className="aspect-square relative bg-muted/30">
                  {hasError ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                  ) : (
                    <img
                      src={foto.url}
                      alt={foto.descricao || "Foto do paciente"}
                      className="w-full h-full object-cover"
                      onError={() => setImgErrors((prev) => ({ ...prev, [foto.id]: true }))}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Categoria Badge */}
                  {catCfg && (
                    <div className="absolute top-2 left-2">
                      <Badge className={cn("text-xs border-0", catCfg.color)}>{catCfg.label}</Badge>
                    </div>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/crm/pacientes/${foto.paciente_id}`}>
                      <div className="h-7 w-7 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background">
                        <ExternalLink className="h-3.5 w-3.5 text-foreground" />
                      </div>
                    </Link>
                    <button onClick={() => setDeleteDialog({ open: true, foto })}>
                      <div className="h-7 w-7 rounded-lg bg-red-500/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-500">
                        <Trash2 className="h-3.5 w-3.5 text-white" />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <p className="font-medium text-sm text-foreground truncate">{foto.pacientes?.nome || "—"}</p>
                  {foto.descricao && <p className="text-xs text-muted-foreground truncate">{foto.descricao}</p>}
                  <p className="text-xs text-muted-foreground">
                    {foto.data_foto ? format(new Date(foto.data_foto), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setForm(EMPTY_FORM); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Foto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Paciente *</Label>
              <Select value={form.paciente_id} onValueChange={(v) => setForm({ ...form, paciente_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione o paciente" /></SelectTrigger>
                <SelectContent>
                  {pacientes?.map((p) => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>URL da Foto *</Label>
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" value={form.data_foto} onChange={(e) => setForm({ ...form, data_foto: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Breve descrição da foto..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.paciente_id || !form.url}>
              {saveMutation.isPending ? "Salvando..." : "Adicionar Foto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, foto: open ? deleteDialog.foto : null })}
        title="Excluir Foto"
        description="Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita."
        confirmLabel={deleteMutation.isPending ? "Excluindo..." : "Excluir"}
        variant="destructive"
        onConfirm={() => deleteMutation.mutate(deleteDialog.foto?.id)}
      />
    </div>
  );
}
