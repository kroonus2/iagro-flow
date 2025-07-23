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
import NotFound from "./pages/NotFound";

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
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard-gerencial" element={<DashboardGerencial />} />
            <Route path="/dashboard-operacional" element={<DashboardOperacional />} />
            <Route path="/defensivos" element={<Defensivos />} />
            <Route path="/carga-smart-calda" element={<CargaSmartCalda />} />
            <Route path="/receitas" element={<ReceitasSmartCalda />} />
            {/* Páginas em desenvolvimento */}
            <Route path="/usuarios" element={<div className="p-6"><h1 className="text-2xl font-bold">Usuários - Em Desenvolvimento</h1></div>} />
            <Route path="/cargas" element={<div className="p-6"><h1 className="text-2xl font-bold">Cargas - Em Desenvolvimento</h1></div>} />
            <Route path="/ordens-producao" element={<div className="p-6"><h1 className="text-2xl font-bold">Ordens de Produção - Em Desenvolvimento</h1></div>} />
            <Route path="/entregas" element={<div className="p-6"><h1 className="text-2xl font-bold">Entregas - Em Desenvolvimento</h1></div>} />
            <Route path="/configuracoes" element={<div className="p-6"><h1 className="text-2xl font-bold">Configurações - Em Desenvolvimento</h1></div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
