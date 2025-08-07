import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import DashboardGerencial from "./pages/DashboardGerencial";
import DashboardOperacional from "./pages/DashboardOperacional";
import Defensivos from "./pages/Defensivos";
import CargaSmartCalda from "./pages/CargaSmartCalda";
import ReceitasSmartCalda from "./pages/ReceitasSmartCalda";
import Usuarios from "./pages/Usuarios";
import Cargas from "./pages/Cargas";
import OrdensProducao from "./pages/OrdensProducao";
import Entregas from "./pages/Entregas";
import Configuracoes from "./pages/Configuracoes";
import Supervisorio from "./pages/Supervisorio";
import NotFound from "./pages/NotFound";
import SelecionarUnidade from "./pages/SelecionarUnidade";
import GerenciamentoUsuarios from "./pages/GerenciamentoUsuarios";
import Fornecedores from "./pages/Fornecedores";
import GestaoSmartCaldas from "./pages/GestaoSmartCaldas";
import EstoqueAvancado from "./pages/EstoqueAvancado";
import ImportacaoReceitas from "./pages/ImportacaoReceitas";
import Sobre from "./pages/Sobre";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/selecionar-unidade" element={<SelecionarUnidade />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard-gerencial" element={<DashboardGerencial />} />
            <Route path="/dashboard-operacional" element={<DashboardOperacional />} />
            <Route path="/defensivos" element={<Defensivos />} />
            <Route path="/carga-smart-calda" element={<CargaSmartCalda />} />
            <Route path="/receitas" element={<ReceitasSmartCalda />} />
            {/* Páginas completas */}
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/gerenciamento-usuarios" element={<GerenciamentoUsuarios />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/gestao-smart-caldas" element={<GestaoSmartCaldas />} />
            <Route path="/cargas" element={<Cargas />} />
            <Route path="/estoque-avancado" element={<EstoqueAvancado />} />
            <Route path="/importacao-receitas" element={<ImportacaoReceitas />} />
            <Route path="/ordens-producao" element={<OrdensProducao />} />
            <Route path="/entregas" element={<Entregas />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/supervisorio" element={<Supervisorio />} />
            <Route path="/sobre" element={<Sobre />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
