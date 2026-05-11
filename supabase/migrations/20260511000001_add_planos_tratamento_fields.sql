-- Adiciona campos faltantes em planos_tratamento
ALTER TABLE planos_tratamento 
  ADD COLUMN IF NOT EXISTS titulo TEXT,
  ADD COLUMN IF NOT EXISTS descricao TEXT,
  ADD COLUMN IF NOT EXISTS observacoes TEXT,
  ADD COLUMN IF NOT EXISTS agendamento_id UUID REFERENCES crm_agendamentos(id) ON DELETE SET NULL;

-- Índice para busca por agendamento
CREATE INDEX IF NOT EXISTS idx_planos_tratamento_agendamento 
  ON planos_tratamento(agendamento_id);

-- Adiciona campo valor_realizado em crm_agendamentos se não existir
ALTER TABLE crm_agendamentos
  ADD COLUMN IF NOT EXISTS valor_realizado NUMERIC(10,2);
