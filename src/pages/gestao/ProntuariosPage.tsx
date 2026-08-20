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
  Stethoscope,
} from "lucide-react";

interface ProntuarioForm {
  paciente_id: string;
  tratamento_id: string;
  data_atendimento: string;
  descricao_procedimento: string;
  observacoes_clinicas: string;
  evolucao: string;
  proximos_passos: string;
}

const EMPTY_FORM: ProntuarioForm = {
  paciente_id: "",
  tratamento_id: "",
  data_atendimento: format(new Date(), "yyyy-MM-dd"),
  descricao_procedimento: "",
  observacoes_clinicas: "",
  evolucao: "",
  proximos_passos: "",
};

export default function ProntuariosPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [tratamentoFilter, setTratamentoFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProntuario, setEditingProntuario] = useState<any>(null);
  const [form, setForm] = useState<ProntuarioForm>(EMPTY_FORM);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; prontuario: any | null }>({ open: false, prontuario: null });

  const { data: prontuarios, isLoading } = useQuery({
    queryKey: ["gestao-prontuarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prontuarios")
        .select("*, pacientes:paciente_id (id, nome), tratamentos:tratamento_id (id, nome)")
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

  const { data: tratamentos } = useQuery({
    queryKey: ["tratamentos-lista"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tratamentos")
        .select("id, nome")
        .order("nome");
      if (error) throw error;
      return data as any[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ProntuarioForm) => {
      const payload = {
        ...data,
        tratamento_id: data.tratamento_id || null,
      };
      if (editingProntuario) {
        const { error } = await supabase.from("prontuarios").update(payload).eq("id", editingProntuario.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("prontuarios").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-prontuarios"] });
      toast({ title: "Prontuário salvo!", description: "O prontuário foi salvo com sucesso." });
      setDialogOpen(false);
      setEditingProntuario(null);
      setForm(EMPTY_FORM);
    },
    onError: (e: any) => toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("prontuarios").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-prontuarios"] });
      toast({ title: "Prontuário excluído", description: "O prontuário foi removido." });
      setDeleteDialog({ open: false, prontuario: null });
    },
    onError: (e: any) => toast({ title: "Erro ao excluir", description: e.message, variant: "destructive" }),
  });

  const openNew = () => {
    setEditingProntuario(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (prontuario: any) => {
    setEditingProntuario(prontuario);
    setForm({
      paciente_id: prontuario.paciente_id || "",
      tratamento_id: prontuario.tratamento_id || "",
      data_atendimento: prontuario.data_atendimento || format(new Date(), "yyyy-MM-dd"),
      descricao_procedimento: prontuario.descricao_procedimento || "",
      observacoes_clinicas: prontuario.observacoes_clinicas || "",
      evolucao: prontuario.evolucao || "",
      proximos_passos: prontuario.proximos_passos || "",
    });
    setDialogOpen(true);
  };

  const filtered = prontuarios?.filter((p) => {
    const matchSearch =
      p.pacientes?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      p.tratamentos?.nome?.toLowerCase().includes(search.toLowerCase());
    const matchTrat = tratamentoFilter === "all" || p.tratamento_id === tratamentoFilter;
    return matchSearch && matchTrat;
  });

  const field = (key: keyof ProntuarioForm) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/gestao"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <PageHeader
          title="Prontuários"
          description="Visão agregada entre todos os pacientes — registros clínicos e evoluções"
          className="mb-0 flex-1"
          actions={
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" /> Novo Prontuário
            </Button>
          }
        />
      </div>

      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: "Buscar por paciente ou tratamento..." }}
        filters={
          <Select value={tratamentoFilter} onValueChange={setTratamentoFilter}>
            <SelectTrigger className="w-full md:w-52">
              <SelectValue placeholder="Tratamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tratamentos</SelectItem>
              {tratamentos?.map((t) => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
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
                <TableHead>Procedimento</TableHead>
                <TableHead>Data Atendimento</TableHead>
                <TableHead>Evolução</TableHead>
                <TableHead>Próximos Passos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6}><LoadingState /></TableCell></TableRow>
              ) : !filtered?.length ? (
                <TableRow><TableCell colSpan={6}><EmptyState icon={Stethoscope} title="Nenhum prontuário encontrado" description="Ajuste os filtros ou registre um novo prontuário." size="sm" /></TableCell></TableRow>
              ) : (
                filtered.map((prontuario) => (
                  <TableRow key={prontuario.id}>
                    <TableCell>
                      <Link to={`/crm/pacientes/${prontuario.paciente_id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {prontuario.pacientes?.nome || "—"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{prontuario.tratamentos?.nome || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {prontuario.data_atendimento ? format(new Date(prontuario.data_atendimento), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs">
                      {prontuario.evolucao ? prontuario.evolucao.substring(0, 50) + (prontuario.evolucao.length > 50 ? "..." : "") : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs">
                      {prontuario.proximos_passos ? prontuario.proximos_passos.substring(0, 50) + (prontuario.proximos_passos.length > 50 ? "..." : "") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DataTableRowActions
                        className="justify-end"
                        onEdit={() => openEdit(prontuario)}
                        onDelete={() => setDeleteDialog({ open: true, prontuario })}
                        statusActions={[
                          { icon: ExternalLink, label: "Ver paciente", onClick: () => navigate(`/crm/pacientes/${prontuario.paciente_id}`) },
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
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingProntuario(null); setForm(EMPTY_FORM); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProntuario ? "Editar Prontuário" : "Novo Prontuário"}</DialogTitle>
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
                <Label>Tratamento</Label>
                <Select value={form.tratamento_id} onValueChange={(v) => setForm({ ...form, tratamento_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione o tratamento" /></SelectTrigger>
                  <SelectContent>
                    {tratamentos?.map((t) => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data do Atendimento *</Label>
              <Input type="date" value={form.data_atendimento} onChange={field("data_atendimento")} />
            </div>
            <div className="space-y-2">
              <Label>Descrição do Procedimento</Label>
              <Textarea value={form.descricao_procedimento} onChange={field("descricao_procedimento")} rows={3} placeholder="Descreva o procedimento realizado..." />
            </div>
            <div className="space-y-2">
              <Label>Observações Clínicas</Label>
              <Textarea value={form.observacoes_clinicas} onChange={field("observacoes_clinicas")} rows={3} placeholder="Observações clínicas relevantes..." />
            </div>
            <div className="space-y-2">
              <Label>Evolução</Label>
              <Textarea value={form.evolucao} onChange={field("evolucao")} rows={3} placeholder="Evolução do paciente..." />
            </div>
            <div className="space-y-2">
              <Label>Próximos Passos</Label>
              <Textarea value={form.proximos_passos} onChange={field("proximos_passos")} rows={2} placeholder="O que deve ser feito na próxima consulta..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.paciente_id}>
              {saveMutation.isPending ? "Salvando..." : "Salvar Prontuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, prontuario: open ? deleteDialog.prontuario : null })}
        title="Excluir Prontuário"
        description="Tem certeza que deseja excluir este prontuário? Esta ação não pode ser desfeita."
        confirmLabel={deleteMutation.isPending ? "Excluindo..." : "Excluir"}
        variant="destructive"
        onConfirm={() => deleteMutation.mutate(deleteDialog.prontuario?.id)}
      />
    </div>
  );
}
