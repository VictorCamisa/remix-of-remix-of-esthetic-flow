// Dataset mock do módulo Mavers (VS Auto) — espelha o domínio de
// concessionária do sistema vs-auto adaptado para a stack QTOP.

export type VehicleStatus = "disponivel" | "reservado" | "vendido" | "manutencao";

export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  versao: string;
  ano: number;
  km: number;
  cor: string;
  combustivel: "Gasolina" | "Flex" | "Diesel" | "Híbrido" | "Elétrico";
  cambio: "Manual" | "Automático" | "CVT";
  placa: string;
  preco: number;
  precoFipe: number;
  custoAquisicao: number;
  status: VehicleStatus;
  diasEstoque: number;
  foto: string;
}

export const VEHICLES: Vehicle[] = [
  {
    id: "v-001", marca: "Toyota", modelo: "Corolla", versao: "XEi 2.0 Flex",
    ano: 2023, km: 18500, cor: "Prata", combustivel: "Flex", cambio: "Automático",
    placa: "MAV-2A23", preco: 142900, precoFipe: 148000, custoAquisicao: 126000,
    status: "disponivel", diasEstoque: 12,
    foto: "https://images.unsplash.com/photo-1617469767053-d3b1f4e90060?w=600",
  },
  {
    id: "v-002", marca: "Honda", modelo: "Civic", versao: "Touring 1.5 Turbo",
    ano: 2022, km: 32100, cor: "Preto", combustivel: "Gasolina", cambio: "CVT",
    placa: "MAV-3B45", preco: 138500, precoFipe: 142000, custoAquisicao: 121000,
    status: "reservado", diasEstoque: 28,
    foto: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600",
  },
  {
    id: "v-003", marca: "Volkswagen", modelo: "T-Cross", versao: "Highline 1.4 TSI",
    ano: 2024, km: 9800, cor: "Branco", combustivel: "Flex", cambio: "Automático",
    placa: "MAV-7C12", preco: 154900, precoFipe: 159000, custoAquisicao: 137000,
    status: "disponivel", diasEstoque: 6,
    foto: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600",
  },
  {
    id: "v-004", marca: "Jeep", modelo: "Compass", versao: "Limited Diesel 4x4",
    ano: 2023, km: 24300, cor: "Cinza", combustivel: "Diesel", cambio: "Automático",
    placa: "MAV-8D77", preco: 219900, precoFipe: 224000, custoAquisicao: 195000,
    status: "disponivel", diasEstoque: 19,
    foto: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600",
  },
  {
    id: "v-005", marca: "Hyundai", modelo: "HB20", versao: "Comfort 1.0",
    ano: 2022, km: 41200, cor: "Vermelho", combustivel: "Flex", cambio: "Manual",
    placa: "MAV-1E55", preco: 72900, precoFipe: 75200, custoAquisicao: 63500,
    status: "vendido", diasEstoque: 0,
    foto: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600",
  },
  {
    id: "v-006", marca: "Chevrolet", modelo: "Onix", versao: "LTZ Turbo",
    ano: 2024, km: 4100, cor: "Azul", combustivel: "Flex", cambio: "Automático",
    placa: "MAV-9F31", preco: 98900, precoFipe: 101500, custoAquisicao: 86200,
    status: "disponivel", diasEstoque: 3,
    foto: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600",
  },
  {
    id: "v-007", marca: "Fiat", modelo: "Toro", versao: "Ranch 2.0 Diesel",
    ano: 2023, km: 27800, cor: "Verde", combustivel: "Diesel", cambio: "Automático",
    placa: "MAV-4G18", preco: 198900, precoFipe: 204000, custoAquisicao: 174000,
    status: "manutencao", diasEstoque: 42,
    foto: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",
  },
  {
    id: "v-008", marca: "Renault", modelo: "Kwid", versao: "Outsider 1.0",
    ano: 2024, km: 6700, cor: "Laranja", combustivel: "Flex", cambio: "Manual",
    placa: "MAV-2H92", preco: 74900, precoFipe: 76800, custoAquisicao: 65800,
    status: "disponivel", diasEstoque: 9,
    foto: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600",
  },
];

export type LeadStatus = "novo" | "qualificado" | "negociacao" | "proposta" | "ganho" | "perdido";
export type LeadOrigem = "Site" | "Instagram" | "Facebook" | "WhatsApp" | "Indicação" | "Google Ads" | "OLX";

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  origem: LeadOrigem;
  veiculoInteresse: string;
  status: LeadStatus;
  vendedor: string;
  criadoEm: string;
  ultimoContato: string;
  score: number;
  valor: number;
}

export const LEADS: Lead[] = [
  { id: "l-001", nome: "Ricardo Almeida", telefone: "(11) 99812-4520", origem: "Instagram", veiculoInteresse: "Toyota Corolla XEi", status: "negociacao", vendedor: "Marcos Lima", criadoEm: "2026-05-18", ultimoContato: "2026-05-21", score: 87, valor: 142900 },
  { id: "l-002", nome: "Patrícia Souza", telefone: "(11) 99771-3398", origem: "Site", veiculoInteresse: "VW T-Cross Highline", status: "proposta", vendedor: "Ana Reis", criadoEm: "2026-05-15", ultimoContato: "2026-05-20", score: 92, valor: 154900 },
  { id: "l-003", nome: "Felipe Castro", telefone: "(11) 98622-7711", origem: "Google Ads", veiculoInteresse: "Jeep Compass Limited", status: "qualificado", vendedor: "Marcos Lima", criadoEm: "2026-05-19", ultimoContato: "2026-05-20", score: 74, valor: 219900 },
  { id: "l-004", nome: "Juliana Pires", telefone: "(11) 99003-2287", origem: "WhatsApp", veiculoInteresse: "Honda Civic Touring", status: "novo", vendedor: "Ana Reis", criadoEm: "2026-05-21", ultimoContato: "2026-05-21", score: 61, valor: 138500 },
  { id: "l-005", nome: "Eduardo Martins", telefone: "(11) 99554-7720", origem: "Indicação", veiculoInteresse: "Fiat Toro Ranch", status: "negociacao", vendedor: "Bruno Tavares", criadoEm: "2026-05-12", ultimoContato: "2026-05-19", score: 81, valor: 198900 },
  { id: "l-006", nome: "Carolina Dias", telefone: "(11) 98801-5544", origem: "OLX", veiculoInteresse: "Hyundai HB20", status: "ganho", vendedor: "Bruno Tavares", criadoEm: "2026-05-05", ultimoContato: "2026-05-17", score: 95, valor: 72900 },
  { id: "l-007", nome: "Marcelo Tavares", telefone: "(11) 99102-0098", origem: "Facebook", veiculoInteresse: "Chevrolet Onix LTZ", status: "perdido", vendedor: "Ana Reis", criadoEm: "2026-05-08", ultimoContato: "2026-05-14", score: 35, valor: 98900 },
  { id: "l-008", nome: "Larissa Nunes", telefone: "(11) 99887-3344", origem: "Site", veiculoInteresse: "Renault Kwid Outsider", status: "qualificado", vendedor: "Marcos Lima", criadoEm: "2026-05-20", ultimoContato: "2026-05-21", score: 68, valor: 74900 },
];

export interface Sale {
  id: string;
  data: string;
  cliente: string;
  veiculo: string;
  vendedor: string;
  valorVenda: number;
  custo: number;
  comissao: number;
  formaPagamento: "À vista" | "Financiamento" | "Consórcio" | "Troca + financiamento";
  status: "concluida" | "aprovacao" | "pendente";
}

export const SALES: Sale[] = [
  { id: "s-001", data: "2026-05-17", cliente: "Carolina Dias", veiculo: "Hyundai HB20 Comfort", vendedor: "Bruno Tavares", valorVenda: 72900, custo: 63500, comissao: 1458, formaPagamento: "Financiamento", status: "concluida" },
  { id: "s-002", data: "2026-05-15", cliente: "Renato Pinto", veiculo: "VW Polo Highline", vendedor: "Marcos Lima", valorVenda: 89500, custo: 78200, comissao: 1790, formaPagamento: "À vista", status: "concluida" },
  { id: "s-003", data: "2026-05-13", cliente: "Aline Mota", veiculo: "Toyota Yaris XLS", vendedor: "Ana Reis", valorVenda: 96800, custo: 84100, comissao: 1936, formaPagamento: "Troca + financiamento", status: "concluida" },
  { id: "s-004", data: "2026-05-11", cliente: "Gustavo Henrique", veiculo: "Jeep Renegade Sport", vendedor: "Bruno Tavares", valorVenda: 119900, custo: 104500, comissao: 2398, formaPagamento: "Financiamento", status: "concluida" },
  { id: "s-005", data: "2026-05-09", cliente: "Mariana Costa", veiculo: "Nissan Kicks SV", vendedor: "Marcos Lima", valorVenda: 132500, custo: 116200, comissao: 2650, formaPagamento: "Consórcio", status: "concluida" },
  { id: "s-006", data: "2026-05-20", cliente: "Felipe Castro", veiculo: "Jeep Compass Limited", vendedor: "Marcos Lima", valorVenda: 219900, custo: 195000, comissao: 4398, formaPagamento: "Financiamento", status: "aprovacao" },
  { id: "s-007", data: "2026-05-21", cliente: "Patrícia Souza", veiculo: "VW T-Cross Highline", vendedor: "Ana Reis", valorVenda: 154900, custo: 137000, comissao: 3098, formaPagamento: "Troca + financiamento", status: "pendente" },
];

export interface Salesperson {
  id: string;
  nome: string;
  meta: number;
  realizadoMes: number;
  vendasMes: number;
  ticketMedio: number;
  conversao: number;
  comissaoMes: number;
}

export const SALESPEOPLE: Salesperson[] = [
  { id: "sp-1", nome: "Marcos Lima", meta: 400000, realizadoMes: 312000, vendasMes: 4, ticketMedio: 78000, conversao: 0.21, comissaoMes: 6240 },
  { id: "sp-2", nome: "Ana Reis", meta: 350000, realizadoMes: 251700, vendasMes: 3, ticketMedio: 83900, conversao: 0.18, comissaoMes: 5034 },
  { id: "sp-3", nome: "Bruno Tavares", meta: 320000, realizadoMes: 192800, vendasMes: 2, ticketMedio: 96400, conversao: 0.15, comissaoMes: 3856 },
];

export function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);
}

export function brlShort(v: number) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return brl(v);
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  novo: "Novo",
  qualificado: "Qualificado",
  negociacao: "Negociação",
  proposta: "Proposta",
  ganho: "Ganho",
  perdido: "Perdido",
};

export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
  manutencao: "Manutenção",
};
