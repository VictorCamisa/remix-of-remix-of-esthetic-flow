import { useState } from "react";
import { Link } from "react-router-dom";
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
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  ChevronLeft,
  Plus,
  Pencil,
  ExternalLink,
  FileSignature,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
} from "lucide-react";

const TIPOS_PROCEDIMENTO = [
  "Microlifting Cervical",
  "Lipo de Papada",
  "Toxina Botulínica",
  "Blefaroplastia",
  "Bichectomia",
  "Lavieen",
  "Ultraformer",
  "Lip Lift",
  "Suspensão Facial",
  "Deep-Plane",
  "Peeling Químico",
  "Otomodelação",
  "Plano de Tratamento",
  "Uso de Imagem",
  "Geral",
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pendente:  { label: "Pendente",  className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  assinado:  { label: "Assinado",  className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  cancelado: { label: "Cancelado", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

interface ContratoForm {
  paciente_id: string;
  titulo: string;
  tipo: string;
  descricao: string;
}

const EMPTY_FORM: ContratoForm = {
  paciente_id: "",
  titulo: "",
  tipo: "",
  descricao: "",
};

export default function ContratosPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContrato, setEditingContrato] = useState<any>(null);
  const [form, setForm] = useState<ContratoForm>(EMPTY_FORM);
  const [assinarDialog, setAssinarDialog] = useState<{ open: boolean; contrato: any | null }>({ open: false, contrato: null });
  const [cancelarDialog, setCancelarDialog] = useState<{ open: boolean; contrato: any | null }>({ open: false, contrato: null });

  const { data: contratos, isLoading } = useQuery({
    queryKey: ["gestao-contratos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contratos_paciente")
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
    mutationFn: async (data: ContratoForm) => {
      const payload = {
        paciente_id: data.paciente_id,
        titulo: data.titulo,
        tipo: data.tipo,
        descricao: data.descricao,
        status: editingContrato?.status || "pendente",
      };
      if (editingContrato) {
        const { error } = await supabase.from("contratos_paciente").update(payload).eq("id", editingContrato.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("contratos_paciente").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-contratos"] });
      toast({ title: "Contrato salvo!", description: "O contrato foi salvo com sucesso." });
      setDialogOpen(false);
      setEditingContrato(null);
      setForm(EMPTY_FORM);
    },
    onError: (e: any) => toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" }),
  });

  const assinarMutation = useMutation({
    mutationFn: async (contratoId: string) => {
      const { error } = await supabase
        .from("contratos_paciente")
        .update({ status: "assinado", data_assinatura: new Date().toISOString() })
        .eq("id", contratoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-contratos"] });
      toast({ title: "Contrato assinado!", description: "Status atualizado para assinado." });
      setAssinarDialog({ open: false, contrato: null });
    },
    onError: (e: any) => toast({ title: "Erro ao assinar", description: e.message, variant: "destructive" }),
  });

  const cancelarMutation = useMutation({
    mutationFn: async (contratoId: string) => {
      const { error } = await supabase
        .from("contratos_paciente")
        .update({ status: "cancelado" })
        .eq("id", contratoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-contratos"] });
      toast({ title: "Contrato cancelado", description: "Status atualizado." });
      setCancelarDialog({ open: false, contrato: null });
    },
    onError: (e: any) => toast({ title: "Erro ao cancelar", description: e.message, variant: "destructive" }),
  });

  const openNew = () => {
    setEditingContrato(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (contrato: any) => {
    setEditingContrato(contrato);
    setForm({
      paciente_id: contrato.paciente_id || "",
      titulo: contrato.titulo || "",
      tipo: contrato.tipo || "",
      descricao: contrato.descricao || "",
    });
    setDialogOpen(true);
  };

  const filtered = contratos?.filter((c) => {
    const matchSearch =
      c.pacientes?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      c.titulo?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchTipo = tipoFilter === "all" || c.tipo === tipoFilter;
    return matchSearch && matchStatus && matchTipo;
  });

  const total = contratos?.length || 0;
  const assinados = contratos?.filter((c) => c.status === "assinado").length || 0;
  const pendentes = contratos?.filter((c) => c.status === "pendente").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/gestao"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <PageHeader title="Contratos" description="Gerencie todos os contratos e termos de serviço" />
        <div className="ml-auto">
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" /> Novo Contrato
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: total, icon: FileText, color: "text-blue-500" },
          { label: "Assinados", value: assinados, icon: CheckCircle, color: "text-emerald-500" },
          { label: "Pendentes", value: pendentes, icon: Clock, color: "text-yellow-500" },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-card/60 border-border/40">
            <CardContent className="p-4 flex items-center gap-3">
              <kpi.icon className={cn("h-8 w-8", kpi.color)} />
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <p className="text-xl font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por paciente ou título..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-44">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="assinado">Assinado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-52">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {TIPOS_PROCEDIMENTO.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card/60 border-border/40">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo/Procedimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Data Assinatura</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
              ) : !filtered?.length ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum contrato encontrado</TableCell></TableRow>
              ) : (
                filtered.map((contrato) => {
                  const cfg = STATUS_CONFIG[contrato.status] || { label: contrato.status, className: "" };
                  return (
                    <TableRow key={contrato.id}>
                      <TableCell>
                        <Link to={`/crm/pacientes/${contrato.paciente_id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                          {contrato.pacientes?.nome || "—"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{contrato.titulo || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{contrato.tipo || "—"}</TableCell>
                      <TableCell>
                        <Badge className={cn("border", cfg.className)}>{cfg.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {contrato.created_at ? format(new Date(contrato.created_at), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {contrato.data_assinatura ? format(new Date(contrato.data_assinatura), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild title="Ver paciente">
                            <Link to={`/crm/pacientes/${contrato.paciente_id}`}><ExternalLink className="h-4 w-4" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(contrato)} title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {contrato.status === "pendente" && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => setAssinarDialog({ open: true, contrato })} title="Marcar como Assinado" className="text-emerald-600 hover:text-emerald-700">
                                <FileSignature className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setCancelarDialog({ open: true, contrato })} title="Cancelar" className="text-red-600 hover:text-red-700">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingContrato(null); setForm(EMPTY_FORM); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingContrato ? "Editar Contrato" : "Novo Contrato"}</DialogTitle>
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
              <Label>Título *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Contrato de Prestação de Serviços" />
            </div>
            <div className="space-y-2">
              <Label>Tipo/Procedimento *</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  {TIPOS_PROCEDIMENTO.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={4} placeholder="Descreva os termos do contrato..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => saveMutation.mutate(form)}
              disabled={saveMutation.isPending || !form.paciente_id || !form.titulo || !form.tipo}
            >
              {saveMutation.isPending ? "Salvando..." : "Salvar Contrato"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assinar Dialog */}
      <Dialog open={assinarDialog.open} onOpenChange={(open) => setAssinarDialog({ open, contrato: open ? assinarDialog.contrato : null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Marcar como Assinado</DialogTitle>
            <DialogDescription>
              Confirme que o contrato "{assinarDialog.contrato?.titulo}" foi assinado. A data de assinatura será registrada como agora.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssinarDialog({ open: false, contrato: null })}>Cancelar</Button>
            <Button onClick={() => assinarMutation.mutate(assinarDialog.contrato?.id)} disabled={assinarMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700">
              {assinarMutation.isPending ? "Salvando..." : "Confirmar Assinatura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancelar Dialog */}
      <Dialog open={cancelarDialog.open} onOpenChange={(open) => setCancelarDialog({ open, contrato: open ? cancelarDialog.contrato : null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar Contrato</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar o contrato "{cancelarDialog.contrato?.titulo}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelarDialog({ open: false, contrato: null })}>Voltar</Button>
            <Button variant="destructive" onClick={() => cancelarMutation.mutate(cancelarDialog.contrato?.id)} disabled={cancelarMutation.isPending}>
              {cancelarMutation.isPending ? "Cancelando..." : "Confirmar Cancelamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
