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
import { Plus, Search, Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Cargas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novaCarga, setNovaCarga] = useState({
    produto: "",
    quantidade: "",
    unidade: "L",
    fornecedor: "",
    lote: "",
    validade: "",
    observacoes: ""
  });

  // Dados simulados das cargas/estoque
  const cargas = [
    {
      id: 1,
      produto: "HERBICIDA QUEIMA",
      quantidade: 1500,
      quantidadeMinima: 500,
      unidade: "L",
      fornecedor: "Fornecedor A",
      lote: "LT2024001",
      validade: "2024-12-31",
      dataEntrada: "2024-01-15",
      status: "disponivel",
      localizacao: "BULK 01",
      ultimaMovimentacao: "2024-01-20"
    },
    {
      id: 2,
      produto: "FERTILIZANTE OPÇÃO",
      quantidade: 300,
      quantidadeMinima: 400,
      unidade: "L", 
      fornecedor: "Fornecedor B",
      lote: "LT2024002",
      validade: "2024-11-30",
      dataEntrada: "2024-01-10",
      status: "baixo",
      localizacao: "BULK 03",
      ultimaMovimentacao: "2024-01-19"
    },
    {
      id: 3,
      produto: "HERBICIDA PRE EMER", 
      quantidade: 0,
      quantidadeMinima: 200,
      unidade: "L",
      fornecedor: "Fornecedor C",
      lote: "LT2024003",
      validade: "2024-10-15",
      dataEntrada: "2024-01-05",
      status: "vazio",
      localizacao: "BULK 05",
      ultimaMovimentacao: "2024-01-18"
    },
    {
      id: 4,
      produto: "HERBICIDA METHOXIL",
      quantidade: 2200,
      quantidadeMinima: 300,
      unidade: "L",
      fornecedor: "Fornecedor A", 
      lote: "LT2024004",
      validade: "2025-03-15",
      dataEntrada: "2024-01-12",
      status: "disponivel",
      localizacao: "BULK 06",
      ultimaMovimentacao: "2024-01-20"
    },
    {
      id: 5,
      produto: "NUTRITION",
      quantidade: 800,
      quantidadeMinima: 600,
      unidade: "L",
      fornecedor: "Fornecedor D",
      lote: "LT2024005", 
      validade: "2024-08-30",
      dataEntrada: "2024-01-08",
      status: "vencendo",
      localizacao: "BULK 04",
      ultimaMovimentacao: "2024-01-17"
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
                <Input
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