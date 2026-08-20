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
  ClipboardList,
} from "lucide-react";

interface AnamneseForm {
  paciente_id: string;
  data_anamnese: string;
  queixa_principal: string;
  historico_medico: string;
  alergias: string;
  medicamentos_uso: string;
  cirurgias_anteriores: string;
  habitos: string;
  antecedentes_familiares: string;
  expectativas: string;
  contraindicacoes: string;
  observacoes: string;
}

const EMPTY_FORM: AnamneseForm = {
  paciente_id: "",
  data_anamnese: format(new Date(), "yyyy-MM-dd"),
  queixa_principal: "",
  historico_medico: "",
  alergias: "",
  medicamentos_uso: "",
  cirurgias_anteriores: "",
  habitos: "",
  antecedentes_familiares: "",
  expectativas: "",
  contraindicacoes: "",
  observacoes: "",
};

export default function AnamnesesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnamnese, setEditingAnamnese] = useState<any>(null);
  const [form, setForm] = useState<AnamneseForm>(EMPTY_FORM);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; anamnese: any | null }>({ open: false, anamnese: null });

  const { data: anamneses, isLoading } = useQuery({
    queryKey: ["gestao-anamneses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("anamneses")
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
    mutationFn: async (data: AnamneseForm) => {
      const payload = { ...data };
      if (editingAnamnese) {
        const { error } = await supabase.from("anamneses").update(payload).eq("id", editingAnamnese.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("anamneses").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-anamneses"] });
      toast({ title: "Anamnese salva!", description: "A anamnese foi salva com sucesso." });
      setDialogOpen(false);
      setEditingAnamnese(null);
      setForm(EMPTY_FORM);
    },
    onError: (e: any) => toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("anamneses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-anamneses"] });
      toast({ title: "Anamnese excluída", description: "A anamnese foi removida." });
      setDeleteDialog({ open: false, anamnese: null });
    },
    onError: (e: any) => toast({ title: "Erro ao excluir", description: e.message, variant: "destructive" }),
  });

  const openNew = () => {
    setEditingAnamnese(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (anamnese: any) => {
    setEditingAnamnese(anamnese);
    setForm({
      paciente_id: anamnese.paciente_id || "",
      data_anamnese: anamnese.data_anamnese || format(new Date(), "yyyy-MM-dd"),
      queixa_principal: anamnese.queixa_principal || "",
      historico_medico: anamnese.historico_medico || "",
      alergias: anamnese.alergias || "",
      medicamentos_uso: anamnese.medicamentos_uso || "",
      cirurgias_anteriores: anamnese.cirurgias_anteriores || "",
      habitos: anamnese.habitos || "",
      antecedentes_familiares: anamnese.antecedentes_familiares || "",
      expectativas: anamnese.expectativas || "",
      contraindicacoes: anamnese.contraindicacoes || "",
      observacoes: anamnese.observacoes || "",
    });
    setDialogOpen(true);
  };

  const filtered = anamneses?.filter((a) =>
    a.pacientes?.nome?.toLowerCase().includes(search.toLowerCase()) ||
    a.queixa_principal?.toLowerCase().includes(search.toLowerCase())
  );

  const field = (key: keyof AnamneseForm) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/gestao"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <PageHeader
          title="Anamneses"
          description="Visão agregada entre todos os pacientes — fila de acompanhamento"
          className="mb-0 flex-1"
          actions={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" /> Nova Anamnese
            </Button>
          }
        />
      </div>

      <FilterBar search={{ value: search, onChange: setSearch, placeholder: "Buscar por paciente ou queixa..." }} />

      {/* Table */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Queixa Principal</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Alergias</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5}><LoadingState /></TableCell></TableRow>
              ) : !filtered?.length ? (
                <TableRow><TableCell colSpan={5}><EmptyState icon={ClipboardList} title="Nenhuma anamnese encontrada" description="Ajuste a busca ou registre uma nova anamnese." size="sm" /></TableCell></TableRow>
              ) : (
                filtered.map((anamnese) => (
                  <TableRow key={anamnese.id}>
                    <TableCell>
                      <Link to={`/crm/pacientes/${anamnese.paciente_id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {anamnese.pacientes?.nome || "—"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{anamnese.queixa_principal || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {anamnese.data_anamnese ? format(new Date(anamnese.data_anamnese), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{anamnese.alergias || "Nenhuma"}</TableCell>
                    <TableCell className="text-right">
                      <DataTableRowActions
                        className="justify-end"
                        onEdit={() => openEdit(anamnese)}
                        onDelete={() => setDeleteDialog({ open: true, anamnese })}
                        statusActions={[
                          { icon: ExternalLink, label: "Ver paciente", onClick: () => navigate(`/crm/pacientes/${anamnese.paciente_id}`) },
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
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingAnamnese(null); setForm(EMPTY_FORM); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAnamnese ? "Editar Anamnese" : "Nova Anamnese"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label>Data da Anamnese *</Label>
                <Input type="date" value={form.data_anamnese} onChange={field("data_anamnese")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Queixa Principal</Label>
              <Textarea value={form.queixa_principal} onChange={field("queixa_principal")} rows={2} placeholder="Descreva a queixa principal do paciente..." />
            </div>
            <div className="space-y-2">
              <Label>Histórico Médico</Label>
              <Textarea value={form.historico_medico} onChange={field("historico_medico")} rows={2} placeholder="Histórico de doenças, condições médicas..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Alergias</Label>
                <Textarea value={form.alergias} onChange={field("alergias")} rows={2} placeholder="Alergias conhecidas..." />
              </div>
              <div className="space-y-2">
                <Label>Medicamentos em Uso</Label>
                <Textarea value={form.medicamentos_uso} onChange={field("medicamentos_uso")} rows={2} placeholder="Medicamentos em uso atual..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cirurgias Anteriores</Label>
                <Textarea value={form.cirurgias_anteriores} onChange={field("cirurgias_anteriores")} rows={2} placeholder="Cirurgias realizadas anteriormente..." />
              </div>
              <div className="space-y-2">
                <Label>Hábitos</Label>
                <Textarea value={form.habitos} onChange={field("habitos")} rows={2} placeholder="Tabagismo, etilismo, atividade física..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Antecedentes Familiares</Label>
                <Textarea value={form.antecedentes_familiares} onChange={field("antecedentes_familiares")} rows={2} placeholder="Histórico familiar relevante..." />
              </div>
              <div className="space-y-2">
                <Label>Expectativas</Label>
                <Textarea value={form.expectativas} onChange={field("expectativas")} rows={2} placeholder="O que o paciente espera do tratamento..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contraindicações</Label>
                <Textarea value={form.contraindicacoes} onChange={field("contraindicacoes")} rows={2} placeholder="Contraindicações identificadas..." />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={form.observacoes} onChange={field("observacoes")} rows={2} placeholder="Observações adicionais..." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.paciente_id}>
              {saveMutation.isPending ? "Salvando..." : "Salvar Anamnese"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, anamnese: open ? deleteDialog.anamnese : null })}
        title="Excluir Anamnese"
        description="Tem certeza que deseja excluir esta anamnese? Esta ação não pode ser desfeita."
        confirmLabel={deleteMutation.isPending ? "Excluindo..." : "Excluir"}
        variant="destructive"
        onConfirm={() => deleteMutation.mutate(deleteDialog.anamnese?.id)}
      />
    </div>
  );
}
