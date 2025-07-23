import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { 
  Plus, 
  Search, 
  Truck, 
  MapPin, 
  Package, 
  FileText,
  Clock,
  CheckCircle,
  Navigation
} from "lucide-react";
import { toast } from "sonner";

const Entregas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novaEntrega, setNovaEntrega] = useState({
    motorista: "",
    veiculo: "",
    destino: "",
    produtos: [],
    observacoes: "",
    dataAgendada: ""
  });

  // Dados simulados das entregas
  const entregas = [
    {
      id: "EN001",
      romaneio: "ROM001",
      motorista: "José Santos",
      veiculo: "ABC-1234",
      destino: "Fazenda Santa Rita - Setor A",
      coordenadas: "-15.123456, -47.654321",
      produtos: [
        { nome: "HERBICIDA QUEIMA", quantidade: 500, unidade: "L" },
        { nome: "FERTILIZANTE", quantidade: 200, unidade: "L" }
      ],
      status: "em_transito",
      dataCarregamento: "2024-01-20 08:00",
      previsaoEntrega: "2024-01-20 14:00",
      kmPercorrido: 45,
      kmTotal: 78,
      velocidadeMedia: 65,
      ultimaLocalizacao: "BR-040, Km 120"
    },
    {
      id: "EN002",
      romaneio: "ROM002", 
      motorista: "Maria Silva",
      veiculo: "DEF-5678",
      destino: "Fazenda Boa Vista - Setor B",
      coordenadas: "-16.789012, -48.345678",
      produtos: [
        { nome: "HERBICIDA PRE EMER", quantidade: 300, unidade: "L" }
      ],
      status: "entregue",
      dataCarregamento: "2024-01-19 07:30",
      previsaoEntrega: "2024-01-19 13:00",
      dataEntrega: "2024-01-19 12:45",
      kmPercorrido: 92,
      kmTotal: 92,
      velocidadeMedia: 58,
      ultimaLocalizacao: "Fazenda Boa Vista"
    },
    {
      id: "EN003",
      romaneio: "ROM003",
      motorista: "Carlos Oliveira", 
      veiculo: "GHI-9012",
      destino: "Fazenda Progresso - Setor C",
      coordenadas: "-14.567890, -46.123456",
      produtos: [
        { nome: "NUTRITION", quantidade: 400, unidade: "L" },
        { nome: "HERBICIDA METHOXIL", quantidade: 250, unidade: "L" }
      ],
      status: "carregando",
      dataCarregamento: "2024-01-20 09:30",
      previsaoEntrega: "2024-01-20 16:00",
      kmPercorrido: 0,
      kmTotal: 115,
      velocidadeMedia: 0,
      ultimaLocalizacao: "Base IAGRO"
    },
    {
      id: "EN004",
      romaneio: "ROM004",
      motorista: "Ana Costa",
      veiculo: "JKL-3456", 
      destino: "Fazenda Esperança - Setor D",
      coordenadas: "-17.234567, -49.876543",
      produtos: [
        { nome: "FERTILIZANTE OPÇÃO", quantidade: 600, unidade: "L" }
      ],
      status: "agendada",
      dataCarregamento: null,
      previsaoEntrega: "2024-01-21 10:00",
      kmPercorrido: 0,
      kmTotal: 156,
      velocidadeMedia: 0,
      ultimaLocalizacao: "Base IAGRO"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "agendada": return "outline";
      case "carregando": return "secondary";
      case "em_transito": return "default";
      case "entregue": return "default";
      case "problema": return "destructive";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "agendada": return "Agendada";
      case "carregando": return "Carregando";
      case "em_transito": return "Em Trânsito";
      case "entregue": return "Entregue";
      case "problema": return "Problema";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "agendada": return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "carregando": return <Package className="h-4 w-4 text-warning" />;
      case "em_transito": return <Truck className="h-4 w-4 text-primary" />;
      case "entregue": return <CheckCircle className="h-4 w-4 text-success" />;
      case "problema": return <Navigation className="h-4 w-4 text-destructive" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredEntregas = entregas.filter(entrega => {
    const matchesSearch = entrega.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrega.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entrega.veiculo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || entrega.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleIncluirEntrega = () => {
    if (!novaEntrega.motorista || !novaEntrega.veiculo || !novaEntrega.destino) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success("Entrega agendada com sucesso!");
    setDialogOpen(false);
    setNovaEntrega({
      motorista: "",
      veiculo: "",
      destino: "",
      produtos: [],
      observacoes: "",
      dataAgendada: ""
    });
  };

  const handleRastrearVeiculo = (veiculo: string) => {
    toast.info(`Abrindo rastreamento do veículo ${veiculo}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle de Entregas</h1>
          <p className="text-muted-foreground mt-1">
            Romaneio de carregamento e rastreamento de veículos
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-iagro-dark hover:bg-iagro-dark/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Entrega
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Agendar Nova Entrega</DialogTitle>
              <DialogDescription>
                Crie um novo romaneio de entrega com rastreamento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motorista">Motorista</Label>
                  <Select value={novaEntrega.motorista} onValueChange={(value) => setNovaEntrega({...novaEntrega, motorista: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jose-santos">José Santos</SelectItem>
                      <SelectItem value="maria-silva">Maria Silva</SelectItem>
                      <SelectItem value="carlos-oliveira">Carlos Oliveira</SelectItem>
                      <SelectItem value="ana-costa">Ana Costa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="veiculo">Veículo</Label>
                  <Select value={novaEntrega.veiculo} onValueChange={(value) => setNovaEntrega({...novaEntrega, veiculo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ABC-1234">ABC-1234</SelectItem>
                      <SelectItem value="DEF-5678">DEF-5678</SelectItem>
                      <SelectItem value="GHI-9012">GHI-9012</SelectItem>
                      <SelectItem value="JKL-3456">JKL-3456</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destino">Destino</Label>
                <Input
                  id="destino"
                  value={novaEntrega.destino}
                  onChange={(e) => setNovaEntrega({...novaEntrega, destino: e.target.value})}
                  placeholder="Ex: Fazenda Santa Rita - Setor A"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataAgendada">Data/Hora Agendada</Label>
                <Input
                  id="dataAgendada"
                  type="datetime-local"
                  value={novaEntrega.dataAgendada}
                  onChange={(e) => setNovaEntrega({...novaEntrega, dataAgendada: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  value={novaEntrega.observacoes}
                  onChange={(e) => setNovaEntrega({...novaEntrega, observacoes: e.target.value})}
                  placeholder="Instruções especiais para a entrega"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleIncluirEntrega}>
                Agendar Entrega
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por entrega, motorista ou veículo"
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
                <SelectItem value="agendada">Agendada</SelectItem>
                <SelectItem value="carregando">Carregando</SelectItem>
                <SelectItem value="em_transito">Em Trânsito</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="problema">Problema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Entregas */}
      <Card>
        <CardHeader>
          <CardTitle>Romaneios de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Motorista/Veículo</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntregas.map((entrega) => (
                  <TableRow key={entrega.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Truck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{entrega.id}</p>
                          <p className="text-xs text-muted-foreground">
                            Romaneio: {entrega.romaneio}
                          </p>
                          {entrega.dataCarregamento && (
                            <p className="text-xs text-muted-foreground">
                              Carregado: {entrega.dataCarregamento}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(entrega.status)}
                        <Badge variant={getStatusBadge(entrega.status)}>
                          {getStatusLabel(entrega.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{entrega.motorista}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {entrega.veiculo}
                        </p>
                        {entrega.velocidadeMedia > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Vel. média: {entrega.velocidadeMedia} km/h
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{entrega.destino}</p>
                        <p className="text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {entrega.ultimaLocalizacao}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Previsão: {entrega.previsaoEntrega}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {entrega.produtos.map((produto, index) => (
                          <div key={index} className="text-xs">
                            <span className="font-medium">{produto.quantidade} {produto.unidade}</span>
                            <span className="text-muted-foreground ml-1">{produto.nome}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{entrega.kmPercorrido} km</span>
                          <span className="text-muted-foreground">
                            {entrega.kmTotal} km
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${(entrega.kmPercorrido / entrega.kmTotal) * 100}%`
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((entrega.kmPercorrido / entrega.kmTotal) * 100)}% concluído
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRastrearVeiculo(entrega.veiculo)}
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">
              {entregas.filter(e => e.status === "em_transito").length}
            </p>
            <p className="text-sm text-muted-foreground">Em Trânsito</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">
              {entregas.filter(e => e.status === "entregue").length}
            </p>
            <p className="text-sm text-muted-foreground">Entregues</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-warning">
              {entregas.filter(e => e.status === "agendada").length}
            </p>
            <p className="text-sm text-muted-foreground">Agendadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Navigation className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {entregas.reduce((acc, e) => acc + e.kmPercorrido, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Km Percorridos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Entregas;