import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Trash2,
  ExternalLink,
  Pencil,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";

const CURRENCY_FORMAT = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pendente:     { label: "Pendente",     className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  aprovado:     { label: "Aprovado",     className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  recusado:     { label: "Recusado",     className: "bg-red-500/10 text-red-600 border-red-500/20" },
  em_execucao:  { label: "Em Execução",  className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  concluido:    { label: "Concluído",    className: "bg-slate-500/10 text-slate-600 border-slate-500/20" },
};

interface PlanoItem {
  tratamento_id: string;
  tratamento_nome: string;
  quantidade: number;
  valor_unitario: number;
}

interface PlanoForm {
  paciente_id: string;
  titulo: string;
  descricao: string;
  observacoes: string;
  itens: PlanoItem[];
  valor_total: number;
}

const EMPTY_FORM: PlanoForm = {
  paciente_id: "",
  titulo: "Plano de Tratamento",
  descricao: "",
  observacoes: "",
  itens: [],
  valor_total: 0,
};

export default function PlanosTratamentoPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlano, setEditingPlano] = useState<any>(null);
  const [form, setForm] = useState<PlanoForm>(EMPTY_FORM);
  const [aprovarDialog, setAprovarDialog] = useState<{ open: boolean; plano: any | null }>({ open: false, plano: null });
  const [valorRealizado, setValorRealizado] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [recusarDialog, setRecusarDialog] = useState<{ open: boolean; plano: any | null }>({ open: false, plano: null });

  // Queries
  const { data: planos, isLoading } = useQuery({
    queryKey: ["gestao-planos-tratamento"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planos_tratamento")
        .select("*, pacientes:paciente_id (id, nome, telefone)")
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
        .select("id, nome, preco_padrao")
        .order("nome");
      if (error) throw error;
      return data as any[];
    },
  });

  const { data: formasPagamento } = useQuery({
    queryKey: ["formas-pagamento"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("formas_pagamento")
        .select("id, nome")
        .order("nome");
      if (error) throw error;
      return data as any[];
    },
  });

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (data: PlanoForm) => {
      const payload = {
        paciente_id: data.paciente_id,
        titulo: data.titulo,
        descricao: data.descricao,
        observacoes: data.observacoes,
        itens: data.itens,
        valor_total: data.valor_total,
        status: editingPlano?.status || "pendente",
      };
      if (editingPlano) {
        const { error } = await supabase.from("planos_tratamento").update(payload as any).eq("id", editingPlano.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("planos_tratamento").insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-planos-tratamento"] });
      toast({ title: "Plano salvo!", description: "O plano de tratamento foi salvo com sucesso." });
      setDialogOpen(false);
      setEditingPlano(null);
      setForm(EMPTY_FORM);
    },
    onError: (e: any) => toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" }),
  });

  const aprovarMutation = useMutation({
    mutationFn: async (plano: any) => {
      const { error: updateError } = await supabase
        .from("planos_tratamento")
        .update({ status: "aprovado" })
        .eq("id", plano.id);
      if (updateError) throw updateError;

      const primeiroItem = Array.isArray(plano.itens) ? plano.itens[0] : null;
      const { error: finError } = await supabase.from("td_fluxo_de_caixa").insert({
        tipo: "receita",
        descricao: plano.titulo || "Plano de Tratamento",
        valor: parseFloat(valorRealizado.replace(/\D/g, "")) / 100 || plano.valor_total,
        status: "pendente",
        data_lancamento: format(new Date(), "yyyy-MM-dd"),
        tratamento_id: primeiroItem?.tratamento_id || null,
        forma_pagamento_id: formaPagamento || null,
        observacoes: `Plano aprovado para ${plano.pacientes?.nome}`,
      });
      if (finError) throw finError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-planos-tratamento"] });
      toast({ title: "Plano aprovado!", description: "Status atualizado e lançamento financeiro criado." });
      setAprovarDialog({ open: false, plano: null });
      setValorRealizado("");
      setFormaPagamento("");
    },
    onError: (e: any) => toast({ title: "Erro ao aprovar", description: e.message, variant: "destructive" }),
  });

  const recusarMutation = useMutation({
    mutationFn: async (planoId: string) => {
      const { error } = await supabase.from("planos_tratamento").update({ status: "recusado" }).eq("id", planoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gestao-planos-tratamento"] });
      toast({ title: "Plano recusado", description: "Status atualizado." });
      setRecusarDialog({ open: false, plano: null });
    },
    onError: (e: any) => toast({ title: "Erro ao recusar", description: e.message, variant: "destructive" }),
  });

  // Helpers
  const recalcTotal = (itens: PlanoItem[]) =>
    itens.reduce((sum, i) => sum + i.quantidade * i.valor_unitario, 0);

  const addItem = () => {
    const newItens = [...form.itens, { tratamento_id: "", tratamento_nome: "", quantidade: 1, valor_unitario: 0 }];
    setForm({ ...form, itens: newItens, valor_total: recalcTotal(newItens) });
  };

  const updateItem = (idx: number, field: keyof PlanoItem, value: any) => {
    const newItens = form.itens.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [field]: value };
      if (field === "tratamento_id") {
        const t = tratamentos?.find((t) => t.id === value);
        updated.tratamento_nome = t?.nome || "";
        if (!updated.valor_unitario && t?.preco_padrao) {
          updated.valor_unitario = t.preco_padrao;
        }
      }
      return updated;
    });
    setForm({ ...form, itens: newItens, valor_total: recalcTotal(newItens) });
  };

  const removeItem = (idx: number) => {
    const newItens = form.itens.filter((_, i) => i !== idx);
    setForm({ ...form, itens: newItens, valor_total: recalcTotal(newItens) });
  };

  const openNew = () => {
    setEditingPlano(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (plano: any) => {
    setEditingPlano(plano);
    setForm({
      paciente_id: plano.paciente_id || "",
      titulo: plano.titulo || "Plano de Tratamento",
      descricao: plano.descricao || "",
      observacoes: plano.observacoes || "",
      itens: Array.isArray(plano.itens) ? plano.itens : [],
      valor_total: plano.valor_total || 0,
    });
    setDialogOpen(true);
  };

  const openAprovar = (plano: any) => {
    setAprovarDialog({ open: true, plano });
    setValorRealizado(
      (plano.valor_total || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    );
  };

  // Filtered
  const filtered = planos?.filter((p) => {
    const matchSearch =
      p.pacientes?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      p.titulo?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // KPIs
  const total = planos?.length || 0;
  const aprovados = planos?.filter((p) => p.status === "aprovado").length || 0;
  const pendentes = planos?.filter((p) => p.status === "pendente").length || 0;
  const valorAprovado = planos
    ?.filter((p) => p.status === "aprovado")
    .reduce((sum, p) => sum + (p.valor_total || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/gestao"><ChevronLeft className="h-5 w-5" /></Link>
        </Button>
        <PageHeader title="Planos de Tratamento" description="Gerencie todos os planos e propostas de tratamento" />
        <div className="ml-auto">
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" /> Novo Plano
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Planos", value: total, icon: FileText, color: "text-blue-500" },
          { label: "Aprovados", value: aprovados, icon: CheckCircle, color: "text-emerald-500" },
          { label: "Pendentes", value: pendentes, icon: Clock, color: "text-yellow-500" },
          { label: "Valor Aprovado", value: CURRENCY_FORMAT.format(valorAprovado), icon: DollarSign, color: "text-green-500" },
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
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="recusado">Recusado</SelectItem>
                <SelectItem value="em_execucao">Em Execução</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
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
                <TableHead>Procedimentos</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
              ) : !filtered?.length ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nenhum plano encontrado</TableCell></TableRow>
              ) : (
                filtered.map((plano) => {
                  const itens: PlanoItem[] = Array.isArray(plano.itens) ? plano.itens : [];
                  const procedimentos = itens.map((i) => i.tratamento_nome || "—").join(", ");
                  const cfg = STATUS_CONFIG[plano.status] || { label: plano.status, className: "" };
                  return (
                    <TableRow key={plano.id}>
                      <TableCell>
                        <Link to={`/crm/pacientes/${plano.paciente_id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                          {plano.pacientes?.nome || "—"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{plano.titulo || "Plano de Tratamento"}</TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">{procedimentos || "—"}</TableCell>
                      <TableCell className="font-medium">{CURRENCY_FORMAT.format(plano.valor_total || 0)}</TableCell>
                      <TableCell>
                        <Badge className={cn("border", cfg.className)}>{cfg.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {plano.created_at ? format(new Date(plano.created_at), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild title="Ver paciente">
                            <Link to={`/crm/pacientes/${plano.paciente_id}`}><ExternalLink className="h-4 w-4" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(plano)} title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {plano.status === "pendente" && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => openAprovar(plano)} title="Aprovar" className="text-emerald-600 hover:text-emerald-700">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setRecusarDialog({ open: true, plano })} title="Recusar" className="text-red-600 hover:text-red-700">
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
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingPlano(null); setForm(EMPTY_FORM); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlano ? "Editar Plano" : "Novo Plano de Tratamento"}</DialogTitle>
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
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Plano de Tratamento" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} />
            </div>

            {/* Itens */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Itens do Plano</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-3 w-3 mr-1" /> Adicionar Item
                </Button>
              </div>
              {form.itens.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg border border-border/40 bg-muted/20">
                  <div className="col-span-5 space-y-1">
                    <Label className="text-xs">Tratamento</Label>
                    <Select value={item.tratamento_id} onValueChange={(v) => updateItem(idx, "tratamento_id", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {tratamentos?.map((t) => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs">Qtd.</Label>
                    <Input type="number" min={1} value={item.quantidade} onChange={(e) => updateItem(idx, "quantidade", Number(e.target.value))} />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <Label className="text-xs">Valor Unit.</Label>
                    <Input type="number" step="0.01" min={0} value={item.valor_unitario} onChange={(e) => updateItem(idx, "valor_unitario", Number(e.target.value))} />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <Label className="text-xs">Total</Label>
                    <p className="text-sm font-medium py-2">{CURRENCY_FORMAT.format(item.quantidade * item.valor_unitario)}</p>
                  </div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Valor Total (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={form.valor_total}
                onChange={(e) => setForm({ ...form, valor_total: Number(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">Calculado automaticamente dos itens. Você pode ajustar manualmente.</p>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending || !form.paciente_id || !form.titulo}>
              {saveMutation.isPending ? "Salvando..." : "Salvar Plano"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Aprovar Dialog */}
      <Dialog open={aprovarDialog.open} onOpenChange={(open) => setAprovarDialog({ open, plano: open ? aprovarDialog.plano : null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aprovar Plano de Tratamento</DialogTitle>
            <DialogDescription>
              Confirme a aprovação e informe os detalhes financeiros. Um lançamento será criado no fluxo de caixa.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Valor Realizado (R$)</Label>
              <Input
                placeholder="R$ 0,00"
                value={valorRealizado}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setValorRealizado(
                    (parseInt(v || "0") / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                  );
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Forma de Pagamento</Label>
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                <SelectContent>
                  {formasPagamento?.map((fp) => <SelectItem key={fp.id} value={fp.id}>{fp.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAprovarDialog({ open: false, plano: null })}>Cancelar</Button>
            <Button onClick={() => aprovarMutation.mutate(aprovarDialog.plano)} disabled={aprovarMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700">
              {aprovarMutation.isPending ? "Aprovando..." : "Confirmar Aprovação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recusar Dialog */}
      <Dialog open={recusarDialog.open} onOpenChange={(open) => setRecusarDialog({ open, plano: open ? recusarDialog.plano : null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recusar Plano</DialogTitle>
            <DialogDescription>Tem certeza que deseja recusar este plano de tratamento?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecusarDialog({ open: false, plano: null })}>Cancelar</Button>
            <Button variant="destructive" onClick={() => recusarMutation.mutate(recusarDialog.plano?.id)} disabled={recusarMutation.isPending}>
              {recusarMutation.isPending ? "Recusando..." : "Confirmar Recusa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
