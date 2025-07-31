import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Cpu, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface SmartCalda {
  id: string;
  nome: string;
  status: "online" | "offline" | "manutencao";
  ultimaAtualizacao: string;
}

interface Unidade {
  id: string;
  nome: string;
  tipo: "matriz" | "filial";
  cidade: string;
  estado: string;
  smartCaldas: SmartCalda[];
}

const SelecionarUnidade = () => {
  const navigate = useNavigate();
  const [selectedUnidade, setSelectedUnidade] = useState<string | null>(null);

  // Dados mock das unidades
  const unidades: Unidade[] = [
    {
      id: "1",
      nome: "Usina Central - Matriz",
      tipo: "matriz",
      cidade: "Ribeirão Preto",
      estado: "SP",
      smartCaldas: [
        { id: "sc1", nome: "Smart Calda 01", status: "online", ultimaAtualizacao: "2024-01-31 14:30:25" },
        { id: "sc2", nome: "Smart Calda 02", status: "online", ultimaAtualizacao: "2024-01-31 14:29:15" },
        { id: "sc3", nome: "Smart Calda 03", status: "manutencao", ultimaAtualizacao: "2024-01-31 12:15:00" }
      ]
    },
    {
      id: "2",
      nome: "Unidade Norte",
      tipo: "filial",
      cidade: "Sertãozinho",
      estado: "SP",
      smartCaldas: [
        { id: "sc4", nome: "Smart Calda 04", status: "online", ultimaAtualizacao: "2024-01-31 14:28:45" },
        { id: "sc5", nome: "Smart Calda 05", status: "offline", ultimaAtualizacao: "2024-01-31 13:45:00" }
      ]
    },
    {
      id: "3",
      nome: "Unidade Sul",
      tipo: "filial",
      cidade: "Piracicaba",
      estado: "SP",
      smartCaldas: [
        { id: "sc6", nome: "Smart Calda 06", status: "online", ultimaAtualizacao: "2024-01-31 14:31:10" },
        { id: "sc7", nome: "Smart Calda 07", status: "online", ultimaAtualizacao: "2024-01-31 14:30:55" },
        { id: "sc8", nome: "Smart Calda 08", status: "online", ultimaAtualizacao: "2024-01-31 14:29:30" }
      ]
    }
  ];

  const getStatusColor = (status: SmartCalda["status"]) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "offline": return "bg-red-500";
      case "manutencao": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: SmartCalda["status"]) => {
    switch (status) {
      case "online": return "Online";
      case "offline": return "Offline";
      case "manutencao": return "Manutenção";
      default: return "Desconhecido";
    }
  };

  const handleSelectUnidade = (unidadeId: string) => {
    const unidade = unidades.find(u => u.id === unidadeId);
    if (unidade) {
      // Simular salvamento da unidade selecionada
      localStorage.setItem("unidadeSelecionada", JSON.stringify(unidade));
      toast.success(`Unidade ${unidade.nome} selecionada!`);
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-hover p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">Selecionar Unidade</h1>
          <p className="text-lg opacity-90">Escolha a unidade que deseja gerenciar</p>
        </div>

        {/* Grid de Unidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {unidades.map((unidade) => (
            <Card 
              key={unidade.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 ${
                selectedUnidade === unidade.id ? "ring-2 ring-accent" : ""
              }`}
              onClick={() => setSelectedUnidade(unidade.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {unidade.nome}
                  </CardTitle>
                  <Badge variant={unidade.tipo === "matriz" ? "default" : "secondary"}>
                    {unidade.tipo === "matriz" ? "Matriz" : "Filial"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{unidade.cidade}, {unidade.estado}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Smart Caldas */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Smart Caldas ({unidade.smartCaldas.length})
                  </h4>
                  <div className="space-y-2">
                    {unidade.smartCaldas.map((sc) => (
                      <div key={sc.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(sc.status)}`} />
                          <span className="text-sm font-medium">{sc.nome}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getStatusText(sc.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão de Seleção */}
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectUnidade(unidade.id);
                  }}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Acessar Unidade
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botão de Voltar */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate("/login")}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Voltar ao Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelecionarUnidade;