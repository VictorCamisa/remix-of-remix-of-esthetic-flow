import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
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
  Pill,
} from "lucide-react";

interface ReceituarioForm {
  paciente_id: string;
  data_prescricao: string;
  medicamentos: string;
  posologia: string;
  orientacoes: string;
  validade_dias: number;
}

const EMPTY_FORM: ReceituarioForm = {
  paciente_id: "",
  data_prescricao: format(new Date(), "yyyy-MM-dd"),
  medicamentos: "",
  posologia: "",
  orientacoes: "",
  validade_dias: 30,
};

export default function ReceituariosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReceituario, setEditingReceituario] = useState<any>(null);
  const [form, setForm] = useState<ReceituarioForm>(EMPTY_FORM);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; receituario: any | null }>({ open: false, receituario: null });

  const { data: receituarios, isLoading } = useQuery({
    queryKey: ["gestao-receituarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receituario_digital")
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
    mutationFn: async (data: ReceituarioForm) => {
      const payload = { ...data };
      if (editingReceituario) {
        const { error } = await supabase.from("receituario_digital").update(payload).eq("id", editingReceituario.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("receituario_digital").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-receituarios"] });
      toast({ title: "Receituário salvo!", description: "A prescrição foi salva com sucesso." });
      setDialogOpen(false);
      setEditingReceituario(null);
      setForm(EMPTY_FORM);
    },
    onError: (e: any) => toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("receituario_digital").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-receituarios"] });
      toast({ title: "Receituário excluído", description: "A prescrição foi removida." });
      setDeleteDialog({ open: false, receituario: null });
    },
    onError: (e: any) => toast({ title: "Erro ao excluir", description: e.message, variant: "destructive" }),
  });

  const openNew = () => {
    setEditingReceituario(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (receituario: any) => {
    setEditingReceituario(receituario);
    setForm({
      paciente_id: receituario.paciente_id || "",
      data_prescricao: receituario.data_prescricao || format(new Date(), "yyyy-MM-dd"),
      medicamentos: receituario.medicamentos || "",
      posologia: receituario.posologia || "",
      orientacoes: receituario.orientacoes || "",
      validade_dias: receituario.validade_dias ?? 30,
    });
    setDialogOpen(true);
  };

  const filtered = receituarios?.filter((r) =>
    r.pacientes?.nome?.toLowerCase().includes(search.toLowerCase()) ||
    r.medicamentos?.toLowerCase().includes(search.toLowerCase())
  );

  const field = (key: keyof ReceituarioForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/gestao"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <PageHeader
          title="Receituários"
          description="Visão agregada entre todos os pacientes — fila de prescrições digitais"
          className="mb-0 flex-1"
          actions={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" /> Novo Receituário
            </Button>
          }
        />
      </div>

      <FilterBar search={{ value: search, onChange: setSearch, placeholder: "Buscar por paciente ou medicamento..." }} />

      {/* Table */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Medicamentos</TableHead>
                <TableHead>Validade (dias)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5}><LoadingState /></TableCell></TableRow>
              ) : !filtered?.length ? (
                <TableRow><TableCell colSpan={5}><EmptyState icon={Pill} title="Nenhum receituário encontrado" description="Ajuste a busca ou crie uma nova prescrição." size="sm" /></TableCell></TableRow>
              ) : (
                filtered.map((receituario) => (
                  <TableRow key={receituario.id}>
                    <TableCell>
                      <Link to={`/crm/pacientes/${receituario.paciente_id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {receituario.pacientes?.nome || "—"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {receituario.data_prescricao ? format(new Date(receituario.data_prescricao), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs">
                      {receituario.medicamentos
                        ? receituario.medicamentos.substring(0, 60) + (receituario.medicamentos.length > 60 ? "..." : "")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{receituario.validade_dias ?? 30} dias</TableCell>
                    <TableCell className="text-right">
                      <DataTableRowActions
                        className="justify-end"
                        onEdit={() => openEdit(receituario)}
                        onDelete={() => setDeleteDialog({ open: true, receituario })}
                        statusActions={[
                          { icon: ExternalLink, label: "Ver paciente", onClick: () => navigate(`/crm/pacientes/${receituario.paciente_id}`) },
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
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingReceituario(null); setForm(EMPTY_FORM); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingReceituario ? "Editar Receituário" : "Novo Receituário"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Paciente *</Label>
                <Select value={form.paciente_id} onValueChange={(v) => setForm({ ...form, paciente_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione o paciente" /></SelectTrigger>
                  <SelectContent>
                    {pacientes?.map((p) => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data da Prescrição</Label>
                <Input type="date" value={form.data_prescricao} onChange={field("data_prescricao")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Medicamentos *</Label>
              <Textarea value={form.medicamentos} onChange={field("medicamentos")} rows={3} placeholder="Liste os medicamentos prescritos..." />
            </div>
            <div className="space-y-2">
              <Label>Posologia</Label>
              <Textarea value={form.posologia} onChange={field("posologia")} rows={3} placeholder="Descreva a forma de uso e doses..." />
            </div>
            <div className="space-y-2">
              <Label>Orientações</Label>
              <Textarea value={form.orientacoes} onChange={field("orientacoes")} rows={2} placeholder="Orientações adicionais ao paciente..." />
            </div>
            <div className="space-y-2">
              <Label>Validade (dias)</Label>
              <Input
                type="number"
                min={1}
                value={form.validade_dias}
                onChange={(e) => setForm({ ...form, validade_dias: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.paciente_id || !form.medicamentos}>
              {saveMutation.isPending ? "Salvando..." : "Salvar Receituário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, receituario: open ? deleteDialog.receituario : null })}
        title="Excluir Receituário"
        description="Tem certeza que deseja excluir esta prescrição? Esta ação não pode ser desfeita."
        confirmLabel={deleteMutation.isPending ? "Excluindo..." : "Excluir"}
        variant="destructive"
        onConfirm={() => deleteMutation.mutate(deleteDialog.receituario?.id)}
      />
    </div>
  );
}
