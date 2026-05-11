import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AgendamentoStatus,
  CRMAgendamento,
  STATUS_LABELS,
  STATUS_ICONS,
  InteracaoTipo,
  useAgendamentoMutations,
  useInteracaoMutations,
} from "./hooks/useCRMAgendamentos";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TransicaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agendamentoId: string;
  fromStatus: AgendamentoStatus;
  toStatus: AgendamentoStatus;
  agendamento?: CRMAgendamento;
  onSuccess?: () => void;
}

export function TransicaoModal({
  open,
  onOpenChange,
  agendamentoId,
  fromStatus,
  toStatus,
  agendamento,
  onSuccess,
}: TransicaoModalProps) {
  const [observacao, setObservacao] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState<Date | undefined>();
  const [horaAgendamento, setHoraAgendamento] = useState("09:00");
  const [motivoPerda, setMotivoPerda] = useState("");
  const [valorOrcamento, setValorOrcamento] = useState("");
  const [valorRealizado, setValorRealizado] = useState(() => {
    if (agendamento?.valor_previsto) {
      return Number(agendamento.valor_previsto).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
    return "";
  });
  const [formaPagamento, setFormaPagamento] = useState("");

  const { updateAgendamento, updateStatus } = useAgendamentoMutations();
  const { createInteracao } = useInteracaoMutations();

  const isRealizadoTransition = fromStatus === "confirmado" && toStatus === "realizado";

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
    enabled: isRealizadoTransition,
  });

  const getTransitionConfig = (): {
    title: string;
    description: string;
    showObservacao?: boolean;
    showValor?: boolean;
    showAgendamento?: boolean;
    showMotivo?: boolean;
    showRealizado?: boolean;
    autoConfirm?: boolean;
    interacaoTipo: InteracaoTipo;
  } => {
    // Lead → Em Negociação
    if (fromStatus === "lead" && toStatus === "em_negociacao") {
      return {
        title: "Iniciar Negociação",
        description: "Registre o primeiro contato com o lead.",
        showObservacao: true,
        interacaoTipo: "status_change",
      };
    }

    // Em Negociação → Orçamento Enviado
    if (fromStatus === "em_negociacao" && toStatus === "orcamento_enviado") {
      return {
        title: "Enviar Orçamento",
        description: "Registre o valor do orçamento enviado.",
        showValor: true,
        showObservacao: true,
        interacaoTipo: "orcamento",
      };
    }

    // Orçamento Enviado → Agendado
    if (fromStatus === "orcamento_enviado" && toStatus === "agendado") {
      return {
        title: "Agendar Procedimento",
        description: "Defina a data e horário do agendamento.",
        showAgendamento: true,
        showObservacao: true,
        interacaoTipo: "agendamento",
      };
    }

    // Agendado → Confirmado
    if (fromStatus === "agendado" && toStatus === "confirmado") {
      return {
        title: "Confirmar Presença",
        description: "O cliente confirmou o agendamento.",
        showObservacao: true,
        autoConfirm: true,
        interacaoTipo: "status_change",
      };
    }

    // Confirmado → Realizado
    if (isRealizadoTransition) {
      return {
        title: "Registrar Realização",
        description: "O procedimento foi realizado. Informe os dados financeiros para lançamento automático no fluxo de caixa.",
        showObservacao: true,
        showRealizado: true,
        interacaoTipo: "status_change",
      };
    }

    // Qualquer → Perdido
    if (toStatus === "perdido") {
      return {
        title: "Registrar Perda",
        description: "Por que esse lead foi perdido?",
        showMotivo: true,
        interacaoTipo: "status_change",
      };
    }

    // Perdido/Reativação → Em Negociação (reativação)
    if ((fromStatus === "perdido" || fromStatus === "reativacao") && toStatus === "em_negociacao") {
      return {
        title: "Reativar Lead",
        description: "Dê uma nova chance a esse lead.",
        showObservacao: true,
        interacaoTipo: "status_change",
      };
    }

    // Default
    return {
      title: `Mover para ${STATUS_LABELS[toStatus]}`,
      description: "Confirme a mudança de status.",
      showObservacao: true,
      interacaoTipo: "status_change",
    };
  };

  const config = getTransitionConfig();

  const parseCurrencyValue = (formatted: string): number => {
    const clean = formatted.replace(/[^\d,]/g, "").replace(",", ".");
    return parseFloat(clean) || 0;
  };

  const handleSubmit = async () => {
    try {
      const updates: Record<string, unknown> = { status: toStatus };

      if (config.showAgendamento && dataAgendamento) {
        const [hours, minutes] = horaAgendamento.split(":").map(Number);
        const fullDate = new Date(dataAgendamento);
        fullDate.setHours(hours, minutes, 0, 0);
        updates.data_agendamento = fullDate.toISOString();
      }

      if (config.showMotivo && motivoPerda) {
        updates.motivo_cancelamento = motivoPerda;
      }

      if (config.showValor && valorOrcamento) {
        updates.valor_previsto = parseFloat(valorOrcamento.replace(/\D/g, "")) / 100;
      }

      if (config.showRealizado) {
        const vr = parseCurrencyValue(valorRealizado);
        if (vr > 0) {
          updates.valor_realizado = vr;
        }
      }

      // Atualiza o agendamento
      await updateAgendamento.mutateAsync({
        id: agendamentoId,
        ...updates,
      });

      // Integração financeira: lançamento no fluxo de caixa quando realizado
      if (config.showRealizado) {
        const vr = parseCurrencyValue(valorRealizado);
        const pacienteNome = agendamento?.paciente?.nome || "Paciente";
        const tratamentoNome = agendamento?.tratamento?.nome || "Atendimento";

        const lancamento: Record<string, unknown> = {
          tipo: "receita",
          descricao: `Procedimento - ${tratamentoNome}`,
          valor: vr || agendamento?.valor_previsto || 0,
          data_lancamento: format(new Date(), "yyyy-MM-dd"),
          status: "pago",
          tratamento_id: agendamento?.tratamento_id || null,
          observacoes: `Paciente: ${pacienteNome}. ${observacao}`.trim(),
        };

        if (formaPagamento) {
          lancamento.forma_pagamento_id = formaPagamento;
        }

        const { error: finError } = await supabase.from("td_fluxo_de_caixa").insert(lancamento as any);
        if (finError) {
          console.error("Erro ao lançar no fluxo de caixa:", finError);
          toast({
            title: "Aviso",
            description: "Status atualizado, mas houve erro ao lançar no fluxo de caixa: " + finError.message,
            variant: "destructive",
          });
        }
      }

      // Sempre registra a interação para documentar a mudança
      const interacaoObservacao = buildInteracaoObservacao();
      await createInteracao.mutateAsync({
        agendamento_id: agendamentoId,
        tipo: config.interacaoTipo,
        observacao: interacaoObservacao,
      });

      toast({
        title: "Status atualizado!",
        description: `Movido para ${STATUS_LABELS[toStatus]}${config.showRealizado ? " e lançamento financeiro criado." : "."}`,
      });

      onOpenChange(false);
      onSuccess?.();

      // Reset form
      setObservacao("");
      setDataAgendamento(undefined);
      setHoraAgendamento("09:00");
      setMotivoPerda("");
      setValorOrcamento("");
      setValorRealizado("");
      setFormaPagamento("");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({ title: "Erro ao atualizar", description: errorMessage, variant: "destructive" });
    }
  };

  const buildInteracaoObservacao = () => {
    const parts: string[] = [];

    parts.push(`Status alterado de "${STATUS_LABELS[fromStatus]}" para "${STATUS_LABELS[toStatus]}"`);

    if (config.showValor && valorOrcamento) {
      parts.push(`Valor do orçamento: ${valorOrcamento}`);
    }

    if (config.showAgendamento && dataAgendamento) {
      parts.push(`Agendado para: ${format(dataAgendamento, "dd/MM/yyyy", { locale: ptBR })} às ${horaAgendamento}`);
    }

    if (config.showMotivo && motivoPerda) {
      parts.push(`Motivo: ${motivoPerda}`);
    }

    if (config.showRealizado && valorRealizado) {
      parts.push(`Valor realizado: ${valorRealizado}`);
    }

    if (observacao) {
      parts.push(`Obs: ${observacao}`);
    }

    return parts.join(". ");
  };

  const isLoading = updateAgendamento.isPending || updateStatus.isPending;

  const formatCurrencyInput = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    const value = parseInt(digits) / 100;
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{STATUS_ICONS[toStatus]}</span>
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {config.showValor && (
            <div className="space-y-2">
              <Label htmlFor="valor">Valor do Orçamento</Label>
              <Input
                id="valor"
                placeholder="R$ 0,00"
                value={valorOrcamento}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  const formatted = (parseInt(value || "0") / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  });
                  setValorOrcamento(formatted);
                }}
              />
            </div>
          )}

          {config.showRealizado && (
            <>
              <div className="space-y-2">
                <Label htmlFor="valorRealizado">Valor Realizado</Label>
                <Input
                  id="valorRealizado"
                  placeholder="R$ 0,00"
                  value={valorRealizado}
                  onChange={(e) => setValorRealizado(formatCurrencyInput(e.target.value))}
                />
                {agendamento?.valor_previsto && (
                  <p className="text-xs text-muted-foreground">
                    Valor previsto: {Number(agendamento.valor_previsto).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {formasPagamento?.map((fp: any) => (
                      <SelectItem key={fp.id} value={fp.id}>{fp.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {config.showAgendamento && (
            <>
              <div className="space-y-2">
                <Label>Data do Agendamento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dataAgendamento && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataAgendamento ? (
                        format(dataAgendamento, "PPP", { locale: ptBR })
                      ) : (
                        "Selecione uma data"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dataAgendamento}
                      onSelect={setDataAgendamento}
                      locale={ptBR}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">Horário</Label>
                <Input
                  id="hora"
                  type="time"
                  value={horaAgendamento}
                  onChange={(e) => setHoraAgendamento(e.target.value)}
                />
              </div>
            </>
          )}

          {config.showMotivo && (
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo da Perda</Label>
              <Textarea
                id="motivo"
                placeholder="Por que o lead foi perdido?"
                value={motivoPerda}
                onChange={(e) => setMotivoPerda(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {config.showObservacao && !config.showMotivo && (
            <div className="space-y-2">
              <Label htmlFor="observacao">Observação (opcional)</Label>
              <Textarea
                id="observacao"
                placeholder="Adicione uma nota sobre essa transição..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
