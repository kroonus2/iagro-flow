import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FlaskConical, Search, Filter, Plus } from "lucide-react";
import { toast } from "sonner";

const ReceitasSmartCalda = () => {
  const [statusFilter, setStatusFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Status disponíveis baseados na imagem
  const statusOptions = [
    { value: "nao-iniciada", label: "Não Iniciada" },
    { value: "em-progresso", label: "Em Progresso" },
    { value: "concluida", label: "Concluída" },
    { value: "conc-manualmente", label: "Conc. Manualmente" },
    { value: "concluida-conc-manual", label: "Concluída/Conc. Manual" },
    { value: "nao-iniciada-em-progresso", label: "Não Iniciada/Em Progresso" },
    { value: "todos", label: "(Todos)" }
  ];

  // Dados simulados das receitas
  const receitas = [
    {
      id: "RC001",
      nome: "Receita Herbicida A",
      status: "concluida",
      dataInicio: "2024-01-15",
      dataFim: "2024-01-15",
      smartCalda: "A32485",
      produtos: ["HERBICIDA QUEIMA", "FERTILIZANTE"],
      volume: "500L"
    },
    {
      id: "RC002", 
      nome: "Receita Fertilizante B",
      status: "em-progresso",
      dataInicio: "2024-01-16",
      dataFim: null,
      smartCalda: "A32486",
      produtos: ["FERTILIZANTE OPÇÃO", "NUTRITION"],
      volume: "750L"
    },
    {
      id: "RC003",
      nome: "Receita Defensivo C",
      status: "nao-iniciada", 
      dataInicio: null,
      dataFim: null,
      smartCalda: "A32487",
      produtos: ["HERBICIDA PRE EMER"],
      volume: "300L"
    },
    {
      id: "RC004",
      nome: "Receita Combinada D",
      status: "conc-manualmente",
      dataInicio: "2024-01-14",
      dataFim: "2024-01-14", 
      smartCalda: "A32485",
      produtos: ["HERBICIDA METHOXIL", "NUTRITION"],
      volume: "600L"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida": return "default";
      case "em-progresso": return "secondary"; 
      case "nao-iniciada": return "outline";
      case "conc-manualmente": return "destructive";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find(option => option.value === status)?.label || status;
  };

  const filteredReceitas = receitas.filter(receita => {
    const matchesStatus = statusFilter === "todos" || receita.status === statusFilter;
    const matchesSearch = receita.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receita.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleIncluirReceita = () => {
    toast.info("Funcionalidade de inclusão de receita em desenvolvimento");
  };

  const handlePesquisar = () => {
    toast.info("Pesquisando receitas...");
  };

  const handleLimpar = () => {
    setStatusFilter("todos");
    setSearchTerm("");
    toast.info("Filtros limpos");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receitas Smart Calda</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento e controle de receitas dos equipamentos Smart Calda
          </p>
        </div>
        <Button onClick={handleIncluirReceita} className="bg-iagro-dark hover:bg-iagro-dark/90">
          <Plus className="h-4 w-4 mr-2" />
          Incluir Receita
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Campos de Data */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Inicial</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 h-4 w-4 text-primary bg-primary/20 rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-sm"></div>
                    </div>
                    <Input type="date" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Final</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 h-4 w-4 text-primary bg-primary/20 rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-sm"></div>
                    </div>
                    <Input type="date" className="pl-10" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Usuário</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 h-4 w-4 text-primary bg-primary/20 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-sm"></div>
                  </div>
                  <Select>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Selecione o usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">Operador 1</SelectItem>
                      <SelectItem value="user2">Operador 2</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Filtro por Status */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Status</label>
              <RadioGroup
                value={statusFilter}
                onValueChange={setStatusFilter}
                className="space-y-2"
              >
                {statusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col gap-2 justify-end">
              <Button onClick={handlePesquisar}>
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
              </Button>
              <Button onClick={handleLimpar} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Receitas */}
      <Card>
        <CardHeader>
          <CardTitle>Receitas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReceitas.map((receita) => (
              <div key={receita.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FlaskConical className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{receita.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      ID: {receita.id} | Smart Calda: {receita.smartCalda}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Volume: {receita.volume} | Produtos: {receita.produtos.join(", ")}
                    </p>
                    {receita.dataInicio && (
                      <p className="text-xs text-muted-foreground">
                        Iniciado: {receita.dataInicio}
                        {receita.dataFim && ` | Finalizado: ${receita.dataFim}`}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={getStatusColor(receita.status)}>
                  {getStatusLabel(receita.status)}
                </Badge>
              </div>
            ))}
          </div>

          {filteredReceitas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma receita encontrada com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <FlaskConical className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">
              {receitas.filter(r => r.status === "concluida").length}
            </p>
            <p className="text-sm text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <FlaskConical className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-warning">
              {receitas.filter(r => r.status === "em-progresso").length}
            </p>
            <p className="text-sm text-muted-foreground">Em Progresso</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <FlaskConical className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {receitas.filter(r => r.status === "nao-iniciada").length}
            </p>
            <p className="text-sm text-muted-foreground">Não Iniciadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <FlaskConical className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{receitas.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceitasSmartCalda;