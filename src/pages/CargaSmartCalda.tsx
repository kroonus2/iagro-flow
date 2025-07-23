import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Search, Filter, Plus } from "lucide-react";
import { toast } from "sonner";

const CargaSmartCalda = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDefensivo, setSelectedDefensivo] = useState("");
  const [quantidade, setQuantidade] = useState("");

  // Dados simulados das cargas baseados na imagem
  const cargas = [
    {
      dataInicial: "2024-01-15",
      dataFinal: "2024-01-20", 
      defensivo: "HERBICIDA QUEIMA",
      quantidade: "500L",
      status: "Ativo"
    },
    {
      dataInicial: "2024-01-10",
      dataFinal: "2024-01-18",
      defensivo: "FERTILIZANTE",
      quantidade: "750L", 
      status: "Concluído"
    }
  ];

  const handleIncluirCarga = () => {
    if (!selectedDate || !selectedDefensivo || !quantidade) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success("Carga incluída com sucesso!");
    // Aqui seria feita a integração com a API
  };

  const handlePesquisar = () => {
    toast.info("Pesquisando cargas...");
  };

  const handleLimpar = () => {
    setSelectedDate("");
    setSelectedDefensivo("");
    setQuantidade("");
    toast.info("Filtros limpos");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Carga de Smart Calda</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento de carregamento dos equipamentos Smart Calda
          </p>
        </div>
        <Button onClick={handleIncluirCarga} className="bg-iagro-dark hover:bg-iagro-dark/90">
          <Plus className="h-4 w-4 mr-2" />
          Incluir Carga
        </Button>
      </div>

      {/* Formulário de Filtros/Inclusão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Filtros e Nova Carga
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Data Inicial */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Inicial</label>
              <div className="relative">
                <div className="absolute left-3 top-3 h-4 w-4 text-primary bg-primary/20 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-sm"></div>
                </div>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Data Final */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Final</label>
              <div className="relative">
                <div className="absolute left-3 top-3 h-4 w-4 text-primary bg-primary/20 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-sm"></div>
                </div>
                <Input
                  type="date"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Defensivo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Defensivo</label>
              <div className="relative">
                <div className="absolute left-3 top-3 h-4 w-4 text-primary bg-primary/20 rounded-sm flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-primary rounded-sm"></div>
                </div>
                <Select value={selectedDefensivo} onValueChange={setSelectedDefensivo}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecione o defensivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="herbicida-queima">HERBICIDA QUEIMA</SelectItem>
                    <SelectItem value="fertilizante">FERTILIZANTE OPÇÃO</SelectItem>
                    <SelectItem value="herbicida-pre">HERBICIDA PRE EMER</SelectItem>
                    <SelectItem value="herbicida-methoxil">HERBICIDA METHOXIL</SelectItem>
                    <SelectItem value="nutrition">NUTRITION</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantidade */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantidade</label>
              <div className="relative">
                <div className="absolute left-3 top-3 h-4 w-4 text-primary bg-primary/20 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-sm"></div>
                </div>
                <Input
                  placeholder="Ex: 500"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-2">
              <Button onClick={handlePesquisar} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
              </Button>
              <Button onClick={handleLimpar} variant="outline" className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cargas Atuais */}
      <Card>
        <CardHeader>
          <CardTitle>Cargas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cargas.map((carga, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FlaskConical className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{carga.defensivo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {carga.dataInicial} até {carga.dataFinal}
                    </p>
                    <p className="text-sm font-medium">Quantidade: {carga.quantidade}</p>
                  </div>
                </div>
                <Badge 
                  variant={carga.status === "Ativo" ? "default" : "secondary"}
                >
                  {carga.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status dos Equipamentos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-success/10 rounded-full mx-auto mb-3 flex items-center justify-center">
              <FlaskConical className="h-6 w-6 text-success" />
            </div>
            <p className="text-2xl font-bold text-success">3</p>
            <p className="text-sm text-muted-foreground">Smart Caldas Ativas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-full mx-auto mb-3 flex items-center justify-center">
              <FlaskConical className="h-6 w-6 text-warning" />
            </div>
            <p className="text-2xl font-bold text-warning">1</p>
            <p className="text-sm text-muted-foreground">Em Manutenção</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
              <FlaskConical className="h-6 w-6 text-primary" />
            </div>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-sm text-muted-foreground">Eficiência Média</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CargaSmartCalda;