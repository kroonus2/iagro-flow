import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import { toast } from "sonner";

const Cargas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requisicaoDialogOpen, setRequisicaoDialogOpen] = useState(false);
  const [descarteDialogOpen, setDescarteDialogOpen] = useState(false);
  const [xmlDialogOpen, setXmlDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("estoque");
  
  const [novaCarga, setNovaCarga] = useState({
    produto: "",
    quantidade: "",
    unidade: "L",
    fornecedor: "",
    lote: "",
    validade: "",
    observacoes: ""
  });

  const [novaRequisicao, setNovaRequisicao] = useState({
    hardware: "",
    produto: "",
    quantidadeSolicitada: "",
    prioridade: "media",
    observacoes: ""
  });

  const [novoDescarte, setNovoDescarte] = useState({
    bulk: "",
    produto: "",
    quantidade: "",
    motivoDescarte: "",
    observacoes: ""
  });

  // Dados simulados das cargas/estoque
  const cargas = [
    {
      id: 1,
      produto: "HERBICIDA QUEIMA",
      quantidade: 1500,
      quantidadeMinima: 500,
      estoqueIntermediario: 150,
      unidade: "L",
      fornecedor: "Fornecedor A",
      lote: "LT2024001",
      validade: "2024-12-31",
      dataEntrada: "2024-01-15",
      dataFabricacao: "2024-01-10",
      status: "disponivel",
      localizacao: "BULK 01",
      ultimaMovimentacao: "2024-01-20",
      alertas: []
    },
    {
      id: 2,
      produto: "FERTILIZANTE OPÇÃO",
      quantidade: 300,
      quantidadeMinima: 400,
      estoqueIntermediario: 50,
      unidade: "L", 
      fornecedor: "Fornecedor B",
      lote: "LT2024002",
      validade: "2024-11-30",
      dataEntrada: "2024-01-10",
      dataFabricacao: "2024-01-05",
      status: "baixo",
      localizacao: "BULK 03",
      ultimaMovimentacao: "2024-01-19",
      alertas: ["estoque_baixo"]
    },
    {
      id: 3,
      produto: "HERBICIDA PRE EMER", 
      quantidade: 0,
      quantidadeMinima: 200,
      estoqueIntermediario: 0,
      unidade: "L",
      fornecedor: "Fornecedor C",
      lote: "LT2024003",
      validade: "2024-10-15",
      dataEntrada: "2024-01-05",
      dataFabricacao: "2024-01-01",
      status: "vazio",
      localizacao: "BULK 05",
      ultimaMovimentacao: "2024-01-18",
      alertas: ["estoque_vazio", "vencendo"]
    },
    {
      id: 4,
      produto: "HERBICIDA METHOXIL",
      quantidade: 2200,
      quantidadeMinima: 300,
      estoqueIntermediario: 75,
      unidade: "L",
      fornecedor: "Fornecedor A", 
      lote: "LT2024004",
      validade: "2025-03-15",
      dataEntrada: "2024-01-12",
      dataFabricacao: "2024-01-08",
      status: "disponivel",
      localizacao: "BULK 06",
      ultimaMovimentacao: "2024-01-20",
      alertas: []
    },
    {
      id: 5,
      produto: "NUTRITION",
      quantidade: 800,
      quantidadeMinima: 600,
      estoqueIntermediario: 125,
      unidade: "L",
      fornecedor: "Fornecedor D",
      lote: "LT2024005", 
      validade: "2024-08-30",
      dataEntrada: "2024-01-08",
      dataFabricacao: "2024-01-03",
      status: "vencendo",
      localizacao: "BULK 04",
      ultimaMovimentacao: "2024-01-17",
      alertas: ["vencendo"]
    }
  ];

  // Dados simulados de requisições
  const requisicoes = [
    {
      id: 1,
      hardware: "Smart Calda 01",
      produto: "HERBICIDA QUEIMA",
      quantidadeSolicitada: 200,
      dataRequisicao: "2024-01-21",
      status: "pendente",
      prioridade: "alta",
      observacoes: "Urgente para produção"
    },
    {
      id: 2,
      hardware: "Smart Calda 02",
      produto: "FERTILIZANTE OPÇÃO",
      quantidadeSolicitada: 150,
      dataRequisicao: "2024-01-20",
      status: "aprovada",
      prioridade: "media",
      observacoes: ""
    }
  ];

  // Dados simulados de descartes
  const descartes = [
    {
      id: 1,
      numeroDescarte: "DESC-2024-001",
      bulk: "BULK 05",
      produto: "HERBICIDA PRE EMER",
      quantidade: 50,
      motivoDescarte: "Produto vencido",
      dataDescarte: "2024-01-19",
      status: "aguardando_retirada",
      observacoes: "Produto vencido em 15/01/2024"
    }
  ];

  // Dados simulados de movimentações
  const movimentacoes = [
    {
      id: 1,
      tipo: "entrada",
      produto: "HERBICIDA QUEIMA",
      quantidade: 500,
      lote: "LT2024001",
      dataMovimentacao: "2024-01-15",
      origem: "Nota Fiscal NF-001",
      destino: "BULK 01"
    },
    {
      id: 2,
      tipo: "saida",
      produto: "FERTILIZANTE OPÇÃO",
      quantidade: 100,
      lote: "LT2024002",
      dataMovimentacao: "2024-01-19",
      origem: "BULK 03",
      destino: "Smart Calda 02"
    },
    {
      id: 3,
      tipo: "entrada",
      produto: "NUTRITION",
      quantidade: 300,
      lote: "LT2024005",
      dataMovimentacao: "2024-01-18",
      origem: "XML Import",
      destino: "BULK 04"
    }
  ];

  // Alertas ativos
  const alertasAtivos = [
    {
      id: 1,
      tipo: "estoque_baixo",
      produto: "FERTILIZANTE OPÇÃO",
      mensagem: "Estoque abaixo do mínimo",
      dataAlerta: "2024-01-21",
      prioridade: "alta"
    },
    {
      id: 2,
      tipo: "vencimento",
      produto: "NUTRITION",
      mensagem: "Produto vence em 30 dias",
      dataAlerta: "2024-01-20",
      prioridade: "media"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponivel": return "default";
      case "baixo": return "secondary";
      case "vazio": return "destructive";
      case "vencendo": return "outline";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "disponivel": return "Disponível";
      case "baixo": return "Estoque Baixo";
      case "vazio": return "Vazio";
      case "vencendo": return "Vencendo";
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "disponivel": return <TrendingUp className="h-4 w-4 text-success" />;
      case "baixo": return <TrendingDown className="h-4 w-4 text-warning" />;
      case "vazio": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "vencendo": return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "destructive";
      case "media": return "secondary";
      case "baixa": return "outline";
      default: return "secondary";
    }
  };

  const filteredCargas = cargas.filter(carga => {
    const matchesSearch = carga.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carga.lote.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || carga.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleIncluirCarga = () => {
    if (!novaCarga.produto || !novaCarga.quantidade || !novaCarga.fornecedor) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success("Carga registrada com sucesso!");
    setDialogOpen(false);
    setNovaCarga({
      produto: "",
      quantidade: "",
      unidade: "L",
      fornecedor: "",
      lote: "",
      validade: "",
      observacoes: ""
    });
  };

  const handleCriarRequisicao = () => {
    if (!novaRequisicao.hardware || !novaRequisicao.produto || !novaRequisicao.quantidadeSolicitada) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success("Requisição criada com sucesso!");
    setRequisicaoDialogOpen(false);
    setNovaRequisicao({
      hardware: "",
      produto: "",
      quantidadeSolicitada: "",
      prioridade: "media",
      observacoes: ""
    });
  };

  const handleCriarDescarte = () => {
    if (!novoDescarte.bulk || !novoDescarte.produto || !novoDescarte.quantidade) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success("Descarte registrado com sucesso!");
    setDescarteDialogOpen(false);
    setNovoDescarte({
      bulk: "",
      produto: "",
      quantidade: "",
      motivoDescarte: "",
      observacoes: ""
    });
  };

  const handleImportarXML = () => {
    toast.success("XML importado com sucesso!");
    setXmlDialogOpen(false);
  };

  const calcularPercentualEstoque = (quantidade: number, minima: number) => {
    if (minima === 0) return 100;
    return Math.min((quantidade / (minima * 2)) * 100, 100);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Cargas</h1>
          <p className="text-muted-foreground mt-1">
            Controle de estoque e movimentação de produtos
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={xmlDialogOpen} onOpenChange={setXmlDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar XML/NF
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar XML/Nota Fiscal</DialogTitle>
                <DialogDescription>
                  Importe entradas automaticamente via XML ou Nota Fiscal
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Arraste e solte ou clique para selecionar
                  </p>
                  <Button variant="outline">Selecionar Arquivo</Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleImportarXML}>Importar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-iagro-dark hover:bg-iagro-dark/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Entrada
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Registrar Nova Entrada</DialogTitle>
                <DialogDescription>
                  Registre uma nova entrada de produto no estoque.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="produto">Produto</Label>
                    <Select value={novaCarga.produto} onValueChange={(value) => setNovaCarga({...novaCarga, produto: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
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
                  <div className="space-y-2">
                    <Label htmlFor="fornecedor">Fornecedor</Label>
                    <Input
                      id="fornecedor"
                      value={novaCarga.fornecedor}
                      onChange={(e) => setNovaCarga({...novaCarga, fornecedor: e.target.value})}
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={novaCarga.quantidade}
                      onChange={(e) => setNovaCarga({...novaCarga, quantidade: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade</Label>
                    <Select value={novaCarga.unidade} onValueChange={(value) => setNovaCarga({...novaCarga, unidade: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Litros (L)</SelectItem>
                        <SelectItem value="KG">Quilos (KG)</SelectItem>
                        <SelectItem value="UN">Unidades (UN)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lote">Lote</Label>
                    <Input
                      id="lote"
                      value={novaCarga.lote}
                      onChange={(e) => setNovaCarga({...novaCarga, lote: e.target.value})}
                      placeholder="LT2024XXX"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validade">Data de Validade</Label>
                  <Input
                    id="validade"
                    type="date"
                    value={novaCarga.validade}
                    onChange={(e) => setNovaCarga({...novaCarga, validade: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={novaCarga.observacoes}
                    onChange={(e) => setNovaCarga({...novaCarga, observacoes: e.target.value})}
                    placeholder="Observações adicionais"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleIncluirCarga}>
                  Registrar Entrada
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Alertas Ativos */}
      {alertasAtivos.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Alertas Ativos ({alertasAtivos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertasAtivos.map((alerta) => (
                <div key={alerta.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <div>
                      <p className="font-medium">{alerta.produto}</p>
                      <p className="text-sm text-muted-foreground">{alerta.mensagem}</p>
                    </div>
                  </div>
                  <Badge variant={getPrioridadeBadge(alerta.prioridade)}>
                    {alerta.prioridade}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="requisicoes">Requisições</TabsTrigger>
          <TabsTrigger value="descartes">Descartes</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="intermediario">Est. Intermediário</TabsTrigger>
        </TabsList>

        {/* Tab Estoque */}
        <TabsContent value="estoque" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Filtros de Pesquisa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por produto ou lote"
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
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="baixo">Estoque Baixo</SelectItem>
                    <SelectItem value="vazio">Vazio</SelectItem>
                    <SelectItem value="vencendo">Vencendo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tabela de Cargas */}
          <Card>
            <CardHeader>
              <CardTitle>Controle de Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Lote/Validade</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Última Movimentação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCargas.map((carga) => (
                      <TableRow key={carga.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Package className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{carga.produto}</p>
                              <p className="text-xs text-muted-foreground">
                                Min: {carga.quantidadeMinima} {carga.unidade}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {carga.quantidade} {carga.unidade}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {Math.round(calcularPercentualEstoque(carga.quantidade, carga.quantidadeMinima))}%
                              </span>
                            </div>
                            <Progress 
                              value={calcularPercentualEstoque(carga.quantidade, carga.quantidadeMinima)} 
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(carga.status)}
                            <Badge variant={getStatusBadge(carga.status)}>
                              {getStatusLabel(carga.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {carga.localizacao}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{carga.lote}</p>
                            <p className="text-xs text-muted-foreground">
                              Val: {carga.validade}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {carga.fornecedor}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {carga.ultimaMovimentacao}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Requisições */}
        <TabsContent value="requisicoes" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Requisições de Reposição</h3>
            <Dialog open={requisicaoDialogOpen} onOpenChange={setRequisicaoDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Requisição
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Requisição de Reposição</DialogTitle>
                  <DialogDescription>
                    Criar requisição para reposição de estoque em hardware
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hardware</Label>
                      <Select value={novaRequisicao.hardware} onValueChange={(value) => setNovaRequisicao({...novaRequisicao, hardware: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smart-calda-01">Smart Calda 01</SelectItem>
                          <SelectItem value="smart-calda-02">Smart Calda 02</SelectItem>
                          <SelectItem value="smart-calda-03">Smart Calda 03</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Produto</Label>
                      <Select value={novaRequisicao.produto} onValueChange={(value) => setNovaRequisicao({...novaRequisicao, produto: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="herbicida-queima">HERBICIDA QUEIMA</SelectItem>
                          <SelectItem value="fertilizante">FERTILIZANTE OPÇÃO</SelectItem>
                          <SelectItem value="herbicida-pre">HERBICIDA PRE EMER</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantidade Solicitada</Label>
                      <Input
                        type="number"
                        value={novaRequisicao.quantidadeSolicitada}
                        onChange={(e) => setNovaRequisicao({...novaRequisicao, quantidadeSolicitada: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select value={novaRequisicao.prioridade} onValueChange={(value) => setNovaRequisicao({...novaRequisicao, prioridade: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="baixa">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      value={novaRequisicao.observacoes}
                      onChange={(e) => setNovaRequisicao({...novaRequisicao, observacoes: e.target.value})}
                      placeholder="Observações"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCriarRequisicao}>Criar Requisição</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hardware</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisicoes.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.hardware}</TableCell>
                      <TableCell>{req.produto}</TableCell>
                      <TableCell>{req.quantidadeSolicitada}L</TableCell>
                      <TableCell>
                        <Badge variant={req.status === "pendente" ? "secondary" : "default"}>
                          {req.status === "pendente" ? "Pendente" : "Aprovada"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPrioridadeBadge(req.prioridade)}>
                          {req.prioridade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{req.dataRequisicao}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {req.status === "pendente" && (
                            <Button size="sm" onClick={() => toast.success("Requisição aprovada!")}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Descartes */}
        <TabsContent value="descartes" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Controle de Descartes</h3>
            <Dialog open={descarteDialogOpen} onOpenChange={setDescarteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Novo Descarte
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Descarte</DialogTitle>
                  <DialogDescription>
                    Registrar descarte de bulk com numeração automática
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bulk</Label>
                      <Select value={novoDescarte.bulk} onValueChange={(value) => setNovoDescarte({...novoDescarte, bulk: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bulk-01">BULK 01</SelectItem>
                          <SelectItem value="bulk-03">BULK 03</SelectItem>
                          <SelectItem value="bulk-04">BULK 04</SelectItem>
                          <SelectItem value="bulk-05">BULK 05</SelectItem>
                          <SelectItem value="bulk-06">BULK 06</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Produto</Label>
                      <Select value={novoDescarte.produto} onValueChange={(value) => setNovoDescarte({...novoDescarte, produto: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="herbicida-queima">HERBICIDA QUEIMA</SelectItem>
                          <SelectItem value="fertilizante">FERTILIZANTE OPÇÃO</SelectItem>
                          <SelectItem value="herbicida-pre">HERBICIDA PRE EMER</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        value={novoDescarte.quantidade}
                        onChange={(e) => setNovoDescarte({...novoDescarte, quantidade: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Motivo do Descarte</Label>
                      <Select value={novoDescarte.motivoDescarte} onValueChange={(value) => setNovoDescarte({...novoDescarte, motivoDescarte: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vencido">Produto Vencido</SelectItem>
                          <SelectItem value="contaminado">Contaminação</SelectItem>
                          <SelectItem value="danificado">Embalagem Danificada</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      value={novoDescarte.observacoes}
                      onChange={(e) => setNovoDescarte({...novoDescarte, observacoes: e.target.value})}
                      placeholder="Detalhes adicionais sobre o descarte"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="destructive" onClick={handleCriarDescarte}>
                    Registrar Descarte
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Bulk</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {descartes.map((desc) => (
                    <TableRow key={desc.id}>
                      <TableCell className="font-mono">{desc.numeroDescarte}</TableCell>
                      <TableCell>{desc.bulk}</TableCell>
                      <TableCell>{desc.produto}</TableCell>
                      <TableCell>{desc.quantidade}L</TableCell>
                      <TableCell>{desc.motivoDescarte}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {desc.status === "aguardando_retirada" ? "Aguardando Retirada" : desc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{desc.dataDescarte}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast.success("Retirada confirmada!")}
                        >
                          Confirmar Retirada
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Movimentações */}
        <TabsContent value="movimentacoes" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Histórico de Movimentações</h3>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentacoes.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>
                        <Badge variant={mov.tipo === "entrada" ? "default" : "secondary"}>
                          {mov.tipo === "entrada" ? "Entrada" : "Saída"}
                        </Badge>
                      </TableCell>
                      <TableCell>{mov.produto}</TableCell>
                      <TableCell>{mov.quantidade}L</TableCell>
                      <TableCell className="font-mono">{mov.lote}</TableCell>
                      <TableCell>{mov.origem}</TableCell>
                      <TableCell>{mov.destino}</TableCell>
                      <TableCell className="text-sm">{mov.dataMovimentacao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Estoque Intermediário */}
        <TabsContent value="intermediario" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Estoque Intermediário</h3>
              <p className="text-sm text-muted-foreground">
                Produtos retirados do almoxarifado mas não utilizados completamente
              </p>
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Estoque Principal</TableHead>
                    <TableHead>Estoque Intermediário</TableHead>
                    <TableHead>Total Disponível</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Última Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cargas.filter(c => c.estoqueIntermediario > 0).map((carga) => (
                    <TableRow key={carga.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{carga.produto}</p>
                            <p className="text-xs text-muted-foreground">
                              Lote: {carga.lote}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{carga.quantidade} {carga.unidade}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-iagro-dark">
                          {carga.estoqueIntermediario} {carga.unidade}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold">
                          {carga.quantidade + carga.estoqueIntermediario} {carga.unidade}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {carga.localizacao}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {carga.ultimaMovimentacao}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">
              {cargas.filter(c => c.status === "disponivel").length}
            </p>
            <p className="text-sm text-muted-foreground">Disponíveis</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingDown className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-warning">
              {cargas.filter(c => c.status === "baixo").length}
            </p>
            <p className="text-sm text-muted-foreground">Estoque Baixo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold text-destructive">
              {cargas.filter(c => c.status === "vazio").length}
            </p>
            <p className="text-sm text-muted-foreground">Vazios</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-500">
              {cargas.filter(c => c.status === "vencendo").length}
            </p>
            <p className="text-sm text-muted-foreground">Vencendo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cargas;