import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  FileText, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Factory
} from "lucide-react";
import { toast } from "sonner";

const OrdensProducao = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novaOrdem, setNovaOrdem] = useState({
    receita: "",
    quantidade: "",
    unidade: "L",
    prioridade: "normal",
    smartCalda: "",
    observacoes: "",
    dataAgendada: ""
  });

  // Dados simulados das ordens de produção
  const ordensProducao = [
    {
      id: "OP001",
      receita: "Receita Herbicida A",
      quantidade: 500,
      unidade: "L",
      status: "em_producao",
      prioridade: "alta",
      smartCalda: "A32485",
      operador: "João Silva",
      progresso: 75,
      iniciado: "2024-01-20 08:00",
      previsaoTermino: "2024-01-20 16:00",
      observacoes: "Produção normal, sem intercorrências"
    },
    {
      id: "OP002", 
      receita: "Receita Fertilizante B",
      quantidade: 750,
      unidade: "L",
      status: "aguardando",
      prioridade: "normal",
      smartCalda: "A32486",
      operador: "Maria Santos",
      progresso: 0,
      iniciado: null,
      previsaoTermino: "2024-01-21 12:00",
      observacoes: "Aguardando liberação de matéria-prima"
    },
    {
      id: "OP003",
      receita: "Receita Defensivo C", 
      quantidade: 300,
      unidade: "L",
      status: "concluida",
      prioridade: "baixa",
      smartCalda: "A32487",
      operador: "Carlos Oliveira",
      progresso: 100,
      iniciado: "2024-01-19 14:00",
      previsaoTermino: "2024-01-19 18:00",
      observacoes: "Produção concluída com sucesso"
    },
    {
      id: "OP004",
      receita: "Receita Combinada D",
      quantidade: 600,
      unidade: "L", 
      status: "pausada",
      prioridade: "alta",
      smartCalda: "A32485",
      operador: "Ana Costa",
      progresso: 45,
      iniciado: "2024-01-20 06:00",
      previsaoTermino: "2024-01-20 20:00",
      observacoes: "Pausada para manutenção preventiva"
    },
    {
      id: "OP005",
      receita: "Receita Especial E",
      quantidade: 400,
      unidade: "L",
      status: "cancelada",
      prioridade: "normal", 
      smartCalda: "A32486",
      operador: "Roberto Lima",
      progresso: 20,
      iniciado: "2024-01-18 10:00",
      previsaoTermino: null,
      observacoes: "Cancelada por falta de matéria-prima"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aguardando": return "outline";
      case "em_producao": return "default";
      case "pausada": return "secondary";
      case "concluida": return "default";
      case "cancelada": return "destructive";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aguardando": return "Aguardando";
      case "em_producao": return "Em Produção";
      case "pausada": return "Pausada";
      case "concluida": return "Concluída";
      case "cancelada": return "Cancelada";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aguardando": return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "em_producao": return <Play className="h-4 w-4 text-primary" />;
      case "pausada": return <Pause className="h-4 w-4 text-warning" />;
      case "concluida": return <CheckCircle className="h-4 w-4 text-success" />;
      case "cancelada": return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "destructive";
      case "normal": return "default";
      case "baixa": return "secondary";
      default: return "outline";
    }
  };

  const filteredOrdens = ordensProducao.filter(ordem => {
    const matchesSearch = ordem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordem.receita.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || ordem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleIncluirOrdem = () => {
    if (!novaOrdem.receita || !novaOrdem.quantidade || !novaOrdem.smartCalda) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success("Ordem de produção criada com sucesso!");
    setDialogOpen(false);
    setNovaOrdem({
      receita: "",
      quantidade: "",
      unidade: "L",
      prioridade: "normal",
      smartCalda: "",
      observacoes: "",
      dataAgendada: ""
    });
  };

  const handleIniciarOrdem = (id: string) => {
    toast.success(`Ordem ${id} iniciada!`);
  };

  const handlePausarOrdem = (id: string) => {
    toast.warning(`Ordem ${id} pausada!`);
  };

  const handleConcluirOrdem = (id: string) => {
    toast.success(`Ordem ${id} concluída!`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordens de Produção</h1>
          <p className="text-muted-foreground mt-1">
            Controle e acompanhamento das ordens de produção
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-iagro-dark hover:bg-iagro-dark/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Ordem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Criar Nova Ordem de Produção</DialogTitle>
              <DialogDescription>
                Crie uma nova ordem de produção baseada em uma receita.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="receita">Receita</Label>
                <Select value={novaOrdem.receita} onValueChange={(value) => setNovaOrdem({...novaOrdem, receita: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a receita" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita-herbicida-a">Receita Herbicida A</SelectItem>
                    <SelectItem value="receita-fertilizante-b">Receita Fertilizante B</SelectItem>
                    <SelectItem value="receita-defensivo-c">Receita Defensivo C</SelectItem>
                    <SelectItem value="receita-combinada-d">Receita Combinada D</SelectItem>
                    <SelectItem value="receita-especial-e">Receita Especial E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={novaOrdem.quantidade}
                    onChange={(e) => setNovaOrdem({...novaOrdem, quantidade: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select value={novaOrdem.unidade} onValueChange={(value) => setNovaOrdem({...novaOrdem, unidade: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Litros (L)</SelectItem>
                      <SelectItem value="KG">Quilos (KG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select value={novaOrdem.prioridade} onValueChange={(value) => setNovaOrdem({...novaOrdem, prioridade: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smartCalda">Smart Calda</Label>
                  <Select value={novaOrdem.smartCalda} onValueChange={(value) => setNovaOrdem({...novaOrdem, smartCalda: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A32485">Smart Calda A32485</SelectItem>
                      <SelectItem value="A32486">Smart Calda A32486</SelectItem>
                      <SelectItem value="A32487">Smart Calda A32487</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataAgendada">Data Agendada</Label>
                  <Input
                    id="dataAgendada"
                    type="datetime-local"
                    value={novaOrdem.dataAgendada}
                    onChange={(e) => setNovaOrdem({...novaOrdem, dataAgendada: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={novaOrdem.observacoes}
                  onChange={(e) => setNovaOrdem({...novaOrdem, observacoes: e.target.value})}
                  placeholder="Observações sobre a ordem de produção"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleIncluirOrdem}>
                Criar Ordem
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ordem ou receita"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="em_producao">Em Produção</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Ordens */}
      <Card>
        <CardHeader>
          <CardTitle>Ordens de Produção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Smart Calda</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead>Previsão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrdens.map((ordem) => (
                  <TableRow key={ordem.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{ordem.id}</p>
                          <p className="text-sm text-muted-foreground">{ordem.receita}</p>
                          <p className="text-xs text-muted-foreground">
                            {ordem.quantidade} {ordem.unidade}
                          </p>
                          <Badge 
                            variant={getPrioridadeBadge(ordem.prioridade)} 
                            className="text-xs mt-1"
                          >
                            {ordem.prioridade.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ordem.status)}
                        <Badge variant={getStatusBadge(ordem.status)}>
                          {getStatusLabel(ordem.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{ordem.progresso}%</span>
                        </div>
                        <Progress value={ordem.progresso} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {ordem.smartCalda}
                    </TableCell>
                    <TableCell className="text-sm">
                      {ordem.operador}
                    </TableCell>
                    <TableCell className="text-xs">
                      {ordem.previsaoTermino ? (
                        <div>
                          <p className="text-muted-foreground">
                            {ordem.previsaoTermino}
                          </p>
                          {ordem.iniciado && (
                            <p className="text-muted-foreground">
                              Iniciado: {ordem.iniciado}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {ordem.status === "aguardando" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleIniciarOrdem(ordem.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {ordem.status === "em_producao" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePausarOrdem(ordem.id)}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleConcluirOrdem(ordem.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {ordem.status === "pausada" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleIniciarOrdem(ordem.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {ordensProducao.filter(o => o.status === "aguardando").length}
            </p>
            <p className="text-sm text-muted-foreground">Aguardando</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Play className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">
              {ordensProducao.filter(o => o.status === "em_producao").length}
            </p>
            <p className="text-sm text-muted-foreground">Em Produção</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Pause className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-warning">
              {ordensProducao.filter(o => o.status === "pausada").length}
            </p>
            <p className="text-sm text-muted-foreground">Pausadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">
              {ordensProducao.filter(o => o.status === "concluida").length}
            </p>
            <p className="text-sm text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Factory className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{ordensProducao.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdensProducao;