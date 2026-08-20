import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilterBar } from "@/components/ui/FilterBar";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { DataTableRowActions } from "@/components/ui/DataTableRowActions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ChevronLeft,
  Plus,
  ExternalLink,
  Download,
  FlaskConical,
} from "lucide-react";

interface ExameForm {
  paciente_id: string;
  nome: string;
  tipo: string;
  data_exame: string;
  laboratorio: string;
  resultado: string;
  observacoes: string;
}

const EMPTY_FORM: ExameForm = {
  paciente_id: "",
  nome: "",
  tipo: "",
  data_exame: format(new Date(), "yyyy-MM-dd"),
  laboratorio: "",
  resultado: "",
  observacoes: "",
};

export default function ExamesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExame, setEditingExame] = useState<any>(null);
  const [form, setForm] = useState<ExameForm>(EMPTY_FORM);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; exame: any | null }>({ open: false, exame: null });

  const { data: exames, isLoading } = useQuery({
    queryKey: ["gestao-exames"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exames_paciente")
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

  const tipos = [...new Set(exames?.map((e) => e.tipo).filter(Boolean) || [])];

  const saveMutation = useMutation({
    mutationFn: async (data: ExameForm) => {
      const payload = { ...data, laboratorio: data.laboratorio || null };
      if (editingExame) {
        const { error } = await supabase.from("exames_paciente").update(payload).eq("id", editingExame.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("exames_paciente").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-exames"] });
      toast({ title: "Exame salvo!", description: "O exame foi salvo com sucesso." });
      setDialogOpen(false);
      setEditingExame(null);
      setForm(EMPTY_FORM);
    },
    onError: (e: any) => toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exames_paciente").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-exames"] });
      toast({ title: "Exame excluído", description: "O exame foi removido." });
      setDeleteDialog({ open: false, exame: null });
    },
    onError: (e: any) => toast({ title: "Erro ao excluir", description: e.message, variant: "destructive" }),
  });

  const openNew = () => {
    setEditingExame(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (exame: any) => {
    setEditingExame(exame);
    setForm({
      paciente_id: exame.paciente_id || "",
      nome: exame.nome || "",
      tipo: exame.tipo || "",
      data_exame: exame.data_exame || format(new Date(), "yyyy-MM-dd"),
      laboratorio: exame.laboratorio || "",
      resultado: exame.resultado || "",
      observacoes: exame.observacoes || "",
    });
    setDialogOpen(true);
  };

  const filtered = exames?.filter((e) => {
    const matchSearch =
      e.pacientes?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      e.nome?.toLowerCase().includes(search.toLowerCase());
    const matchTipo = tipoFilter === "all" || e.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  const field = (key: keyof ExameForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/gestao"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <PageHeader
          title="Exames"
          description="Visão agregada entre todos os pacientes — acompanhamento de exames laboratoriais"
          className="mb-0 flex-1"
          actions={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" /> Novo Exame
            </Button>
          }
        />
      </div>

      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: "Buscar por paciente ou exame..." }}
        filters={
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {tipos.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {/* Table */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Nome do Exame</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Laboratório</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7}><LoadingState /></TableCell></TableRow>
              ) : !filtered?.length ? (
                <TableRow><TableCell colSpan={7}><EmptyState icon={FlaskConical} title="Nenhum exame encontrado" description="Ajuste os filtros ou registre um novo exame." size="sm" /></TableCell></TableRow>
              ) : (
                filtered.map((exame) => (
                  <TableRow key={exame.id}>
                    <TableCell>
                      <Link to={`/crm/pacientes/${exame.paciente_id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {exame.pacientes?.nome || "—"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{exame.nome || "—"}</TableCell>
                    <TableCell>
                      {exame.tipo && <Badge variant="outline">{exame.tipo}</Badge>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {exame.data_exame ? format(new Date(exame.data_exame), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{exame.laboratorio || "—"}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs">
                      {exame.resultado ? exame.resultado.substring(0, 50) + (exame.resultado.length > 50 ? "..." : "") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DataTableRowActions
                        className="justify-end"
                        onEdit={() => openEdit(exame)}
                        onDelete={() => setDeleteDialog({ open: true, exame })}
                        statusActions={[
                          { icon: ExternalLink, label: "Ver paciente", onClick: () => navigate(`/crm/pacientes/${exame.paciente_id}`) },
                          ...(exame.arquivo_url
                            ? [{ icon: Download, label: "Download", onClick: () => window.open(exame.arquivo_url, "_blank", "noopener,noreferrer") }]
                            : []),
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingExame(null); setForm(EMPTY_FORM); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExame ? "Editar Exame" : "Novo Exame"}</DialogTitle>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Exame *</Label>
                <Input value={form.nome} onChange={field("nome")} placeholder="Ex: Hemograma Completo" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input value={form.tipo} onChange={field("tipo")} placeholder="Ex: Hemograma, Coagulação..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data do Exame</Label>
                <Input type="date" value={form.data_exame} onChange={field("data_exame")} />
              </div>
              <div className="space-y-2">
                <Label>Laboratório</Label>
                <Input value={form.laboratorio} onChange={field("laboratorio")} placeholder="Nome do laboratório..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Resultado</Label>
              <Textarea value={form.resultado} onChange={field("resultado")} rows={3} placeholder="Resultado do exame..." />
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={form.observacoes} onChange={field("observacoes")} rows={2} placeholder="Observações adicionais..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.paciente_id || !form.nome}>
              {saveMutation.isPending ? "Salvando..." : "Salvar Exame"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, exame: open ? deleteDialog.exame : null })}
        title="Excluir Exame"
        description="Tem certeza que deseja excluir este exame? Esta ação não pode ser desfeita."
        confirmLabel={deleteMutation.isPending ? "Excluindo..." : "Excluir"}
        variant="destructive"
        onConfirm={() => deleteMutation.mutate(deleteDialog.exame?.id)}
      />
    </div>
  );
}
