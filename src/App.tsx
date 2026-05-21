import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Auth
import Auth from "./pages/Auth";

// Home
import Home from "./pages/Home";

// Módulo Financeiro
import Dashboard from "./pages/Dashboard";
import DiarioCaixa from "./pages/DiarioCaixa";
import Lancamentos from "./pages/Lancamentos";
import ContasPagar from "./pages/ContasPagar";
import Tratamentos from "./pages/Tratamentos";
import Estoque from "./pages/Estoque";
import Fornecedores from "./pages/Fornecedores";
import DRE from "./pages/DRE";
import Relatorios from "./pages/Relatorios";
import RelatoriosEstoque from "./pages/RelatoriosEstoque";
import Orcamento from "./pages/Orcamento";

// Módulo CRM
import Pacientes from "./pages/crm/Pacientes";
import FichaPaciente from "./pages/crm/FichaPaciente";
import Pipeline from "./pages/crm/Pipeline";
import Agendamentos from "./pages/crm/Agendamentos";
import PosVenda from "./pages/crm/PosVenda";
import Leads from "./pages/crm/Leads";
import WhatsApp from "./pages/crm/WhatsApp";

// Módulo Admin
import Admin from "./pages/admin/Admin";
import BusinessIntelligence from "./pages/bi/BusinessIntelligence";

// Módulo Gestão Operacional
import GestaoOperacional from "./pages/gestao/GestaoOperacional";
import PlanosTratamentoPage from "./pages/gestao/PlanosTratamentoPage";
import ContratosPage from "./pages/gestao/ContratosPage";
import AnamnesesPage from "./pages/gestao/AnamnesesPage";
import ExamesPage from "./pages/gestao/ExamesPage";
import FotosPage from "./pages/gestao/FotosPage";
import ReceituariosPage from "./pages/gestao/ReceituariosPage";
import ProntuariosPage from "./pages/gestao/ProntuariosPage";

// Módulo Mavers (VS Auto)
import MaversDashboard from "./pages/mavers/MaversDashboard";
import MaversEstoque from "./pages/mavers/MaversEstoque";
import MaversVehicleDetails from "./pages/mavers/MaversVehicleDetails";
import MaversLeads from "./pages/mavers/MaversLeads";
import MaversCRM from "./pages/mavers/MaversCRM";
import MaversVendas from "./pages/mavers/MaversVendas";
import MaversComissoes from "./pages/mavers/MaversComissoes";
import MaversFinanceiro from "./pages/mavers/MaversFinanceiro";
import MaversMarketing from "./pages/mavers/MaversMarketing";
import MaversRelatorios from "./pages/mavers/MaversRelatorios";

// Páginas públicas
import FormularioPaciente from "./pages/public/FormularioPaciente";

// Global
import AssistenteIA from "./pages/AssistenteIA";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Páginas públicas */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/formulario/:token" element={<FormularioPaciente />} />
              
              {/* Rotas protegidas */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        {/* Home */}
                        <Route path="/" element={<Home />} />
                        
                        {/* Módulo Financeiro */}
                        <Route path="/financeiro" element={<Dashboard />} />
                        <Route path="/financeiro/diario-caixa" element={<DiarioCaixa />} />
                        <Route path="/financeiro/lancamentos" element={<Lancamentos />} />
                        <Route path="/financeiro/contas-pagar" element={<ContasPagar />} />
                        <Route path="/financeiro/tratamentos" element={<Tratamentos />} />
                        <Route path="/financeiro/estoque" element={<Estoque />} />
                        <Route path="/financeiro/fornecedores" element={<Fornecedores />} />
                        <Route path="/financeiro/dre" element={<DRE />} />
                        <Route path="/financeiro/orcamento" element={<Orcamento />} />
                        <Route path="/financeiro/relatorios" element={<Relatorios />} />
                        <Route path="/financeiro/relatorios-estoque" element={<RelatoriosEstoque />} />
                        
                        {/* Módulo CRM / Comercial */}
                        <Route path="/crm" element={<Pipeline />} />
                        <Route path="/crm/pipeline" element={<Pipeline />} />
                        <Route path="/crm/agendamentos" element={<Agendamentos />} />
                        <Route path="/crm/pos-venda" element={<PosVenda />} />
                        <Route path="/crm/leads" element={<Leads />} />
                        <Route path="/crm/whatsapp" element={<WhatsApp />} />
                        <Route path="/crm/pacientes" element={<Pacientes />} />
                        <Route path="/crm/pacientes/:id" element={<FichaPaciente />} />
                        
                        {/* Módulo Administrativo */}
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/*" element={<Admin />} />
                        
                        {/* Módulo BI */}
                        <Route path="/bi" element={<BusinessIntelligence />} />
                        <Route path="/bi/*" element={<BusinessIntelligence />} />
                        
                        {/* Módulo Gestão Operacional */}
                        <Route path="/gestao" element={<GestaoOperacional />} />
                        <Route path="/gestao/planos-tratamento" element={<PlanosTratamentoPage />} />
                        <Route path="/gestao/contratos" element={<ContratosPage />} />
                        <Route path="/gestao/anamneses" element={<AnamnesesPage />} />
                        <Route path="/gestao/exames" element={<ExamesPage />} />
                        <Route path="/gestao/fotos" element={<FotosPage />} />
                        <Route path="/gestao/receituarios" element={<ReceituariosPage />} />
                        <Route path="/gestao/prontuarios" element={<ProntuariosPage />} />
                        
                        {/* Módulo Mavers (VS Auto) */}
                        <Route path="/mavers" element={<MaversDashboard />} />
                        <Route path="/mavers/estoque" element={<MaversEstoque />} />
                        <Route path="/mavers/estoque/:id" element={<MaversVehicleDetails />} />
                        <Route path="/mavers/leads" element={<MaversLeads />} />
                        <Route path="/mavers/crm" element={<MaversCRM />} />
                        <Route path="/mavers/vendas" element={<MaversVendas />} />
                        <Route path="/mavers/comissoes" element={<MaversComissoes />} />
                        <Route path="/mavers/financeiro" element={<MaversFinanceiro />} />
                        <Route path="/mavers/marketing" element={<MaversMarketing />} />
                        <Route path="/mavers/relatorios" element={<MaversRelatorios />} />

                        {/* Global */}
                        <Route path="/assistente-ia" element={<AssistenteIA />} />
                        <Route path="/configuracoes" element={<Configuracoes />} />
                        
                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
