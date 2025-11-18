import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import DashboardGerencial from "./pages/DashboardGerencial";
import DashboardOperacional from "./pages/DashboardOperacional";
import ReceitasSmartCalda from "./pages/ReceitasSmartCalda";
import EstoquesGerais from "./pages/EstoquesGerais";
import OrdensProducao from "./pages/OrdensProducao";
import Entregas from "./pages/Entregas";
import Configuracoes from "./pages/Configuracoes";
import Supervisorio from "./pages/Supervisorio";
import NotFound from "./pages/NotFound";
import SelecionarUnidade from "./pages/SelecionarUnidade";
import GerenciamentoUsuarios from "./pages/GerenciamentoUsuarios";
import Fornecedores from "./pages/Fornecedores";
import GestaoSmartCaldas from "./pages/GestaoSmartCaldas";
import ImportacaoReceitas from "./pages/ImportacaoReceitas";
import GerenciamentoUnidades from "./pages/GerenciamentoUnidades";
import Sobre from "./pages/Sobre";
import InsumosAgricolas from "./pages/InsumosAgricolas";
import CadastrosAuxiliares from "./pages/CadastrosAuxiliares";
import GerenciamentoFazendas from "./pages/GerenciamentoFazendas";
import Movimentacoes from "./pages/Movimentacoes";
import NotasEntrada from "./pages/NotasEntrada";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
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
              <Route
                path="/dashboard-gerencial"
                element={<DashboardGerencial />}
              />
              <Route
                path="/dashboard-operacional"
                element={<DashboardOperacional />}
              />
              <Route path="/insumos-agricolas" element={<InsumosAgricolas />} />
              <Route path="/receitas" element={<ReceitasSmartCalda />} />
              <Route
                path="/gerenciamento-fazendas"
                element={<GerenciamentoFazendas />}
              />
              {/* Páginas completas */}
              <Route
                path="/gerenciamento-usuarios"
                element={<GerenciamentoUsuarios />}
              />
              <Route
                path="/gerenciamento-unidades"
                element={<GerenciamentoUnidades />}
              />
              <Route
                path="/gerenciamento-smart-caldas"
                element={<GestaoSmartCaldas />}
              />
              <Route path="/fornecedores" element={<Fornecedores />} />
              <Route
                path="/cadastros-auxiliares"
                element={<CadastrosAuxiliares />}
              />
              <Route path="/estoques-gerais" element={<EstoquesGerais />} />
              <Route path="/notas-entrada" element={<NotasEntrada />} />
              <Route path="/movimentacoes" element={<Movimentacoes />} />
              <Route
                path="/importacao-receitas"
                element={<ImportacaoReceitas />}
              />
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
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
