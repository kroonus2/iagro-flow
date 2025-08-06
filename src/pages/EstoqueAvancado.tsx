import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit2, Trash2, Search, Package, FileText, CalendarIcon, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data expandido com campos de nota fiscal
const mockEstoque = [
  { 
    id: 1, 
    produto: "Glifosato 480g/L", 
    categoria: "defensivos", 
    quantidade: 150, 
    unidade: "L", 
    lote: "GL2024001", 
    validade: "2025-06-15",
    fornecedor: "AgroQuímica Brasil",
    localizacao: "Galpão A - Prateleira 3",
    valorUnitario: 45.50,
    notaFiscal: {
      numero: "123456",
      serie: "001",
      dataEmissao: "2024-01-10",
      valorTotal: 6825.00,
      chaveAcesso: "31240101234567890123456789012345678901234567890"
    },
    tipo: "normal"
  },
  { 
    id: 2, 
    produto: "NPK 20-05-20", 
    categoria: "fertilizantes", 
    quantidade: 50, 
    unidade: "kg", 
    lote: "NPK240205", 
    validade: "2026-02-20",
    fornecedor: "Fertilizantes do Norte",
    localizacao: "Galpão B - Box 1",
    valorUnitario: 3.25,
    notaFiscal: {
      numero: "789012",
      serie: "002",
      dataEmissao: "2024-01-05",
      valorTotal: 162.50,
      chaveAcesso: "31240201234567890123456789012345678901234567891"
    },
    tipo: "intermediario"
  },
  { 
    id: 3, 
    produto: "Sementes de Tomate Híbrido", 
    categoria: "sementes", 
    quantidade: 25, 
    unidade: "pacotes", 
    lote: "SEM2024003", 
    validade: "2024-12-31",
    fornecedor: "Sementes Premium",
    localizacao: "Câmara Fria - Setor A",
    valorUnitario: 125.00,
    notaFiscal: {
      numero: "345678",
      serie: "001",
      dataEmissao: "2024-01-08",
      valorTotal: 3125.00,
      chaveAcesso: "31240301234567890123456789012345678901234567892"
    },
    tipo: "intermediario"
  }
];

const EstoqueAvancado = () => {
  const { toast } = useToast();
  const [estoque, setEstoque] = useState(mockEstoque);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [itemEditando, setItemEditando] = useState<any>(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [dataValidade, setDataValidade] = useState<Date>();
  const [dataEmissaoNF, setDataEmissaoNF] = useState<Date>();

  const [novoItem, setNovoItem] = useState({
    produto: "",
    categoria: "",
    quantidade: "",
    unidade: "",
    lote: "",
    validade: "",
    fornecedor: "",
    localizacao: "",
    valorUnitario: "",
    observacoes: "",
    tipo: "normal",
    notaFiscal: {
      numero: "",
      serie: "",
      dataEmissao: "",
      valorTotal: "",
      chaveAcesso: ""
    }
  });

  const categorias = [
    { value: "defensivos", label: "Defensivos Agrícolas" },
    { value: "fertilizantes", label: "Fertilizantes" },
    { value: "sementes", label: "Sementes" },
    { value: "equipamentos", label: "Equipamentos" },
    { value: "outros", label: "Outros" }
  ];

  const unidades = [
    { value: "L", label: "Litros" },
    { value: "kg", label: "Quilogramas" },
    { value: "g", label: "Gramas" },
    { value: "un", label: "Unidades" },
    { value: "pacotes", label: "Pacotes" },
    { value: "caixas", label: "Caixas" }
  ];

  const estoquesFiltrados = estoque.filter(item => {
    const matchPesquisa = item.produto.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
                         item.lote.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
                         item.fornecedor.toLowerCase().includes(termoPesquisa.toLowerCase());
    const matchCategoria = !filtroCategoria || item.categoria === filtroCategoria;
    const matchTipo = !filtroTipo || item.tipo === filtroTipo;
    
    return matchPesquisa && matchCategoria && matchTipo;
  });

  const estoqueNormal = estoquesFiltrados.filter(item => item.tipo === "normal");
  const estoqueIntermediario = estoquesFiltrados.filter(item => item.tipo === "intermediario");

  const handleCriarItem = () => {
    const item = {
      id: estoque.length + 1,
      ...novoItem,
      quantidade: parseFloat(novoItem.quantidade),
      valorUnitario: parseFloat(novoItem.valorUnitario),
      notaFiscal: {
        ...novoItem.notaFiscal,
        valorTotal: parseFloat(novoItem.notaFiscal.valorTotal || "0")
      }
    };
    setEstoque([...estoque, item]);
    resetarFormulario();
    setDialogAberto(false);
    toast({ title: "Item adicionado ao estoque com sucesso!", variant: "default" });
  };

  const handleEditarItem = (item: any) => {
    setItemEditando(item);
    setNovoItem({
      ...item,
      quantidade: item.quantidade.toString(),
      valorUnitario: item.valorUnitario.toString(),
      notaFiscal: {
        ...item.notaFiscal,
        valorTotal: item.notaFiscal.valorTotal.toString()
      }
    });
    setDialogAberto(true);
  };

  const handleExcluirItem = (id: number) => {
    setEstoque(estoque.filter(item => item.id !== id));
    toast({ title: "Item removido do estoque!", variant: "default" });
  };

  const resetarFormulario = () => {
    setNovoItem({
      produto: "",
      categoria: "",
      quantidade: "",
      unidade: "",
      lote: "",
      validade: "",
      fornecedor: "",
      localizacao: "",
      valorUnitario: "",
      observacoes: "",
      tipo: "normal",
      notaFiscal: {
        numero: "",
        serie: "",
        dataEmissao: "",
        valorTotal: "",
        chaveAcesso: ""
      }
    });
    setItemEditando(null);
    setDataValidade(undefined);
    setDataEmissaoNF(undefined);
  };

  const getCategoriaBadge = (categoria: string) => {
    const cores = {
      defensivos: "destructive",
      fertilizantes: "default",
      sementes: "secondary",
      equipamentos: "outline",
      outros: "outline"
    };
    return cores[categoria as keyof typeof cores] || "outline";
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === "intermediario" ? "secondary" : "default";
  };

  const getEstoqueStatus = (quantidade: number, categoria: string) => {
    // Lógica simples para demonstração
    if (quantidade < 10) return { status: "baixo", variant: "destructive" as const };
    if (quantidade < 50) return { status: "médio", variant: "secondary" as const };
    return { status: "bom", variant: "default" as const };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Estoque Avançada</h1>
          <p className="text-muted-foreground">
            Controle completo de estoque com integração de notas fiscais
          </p>
        </div>
        <Dialog open={dialogAberto} onOpenChange={(open) => {
          setDialogAberto(open);
          if (!open) resetarFormulario();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar ao Estoque
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {itemEditando ? "Editar Item do Estoque" : "Adicionar Novo Item ao Estoque"}
              </DialogTitle>
              <DialogDescription>
                Preencha todas as informações do produto, incluindo dados da nota fiscal.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="produto" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="produto">Produto</TabsTrigger>
                <TabsTrigger value="estoque">Estoque</TabsTrigger>
                <TabsTrigger value="fiscal">Nota Fiscal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="produto" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="produto">Nome do Produto</Label>
                    <Input
                      id="produto"
                      value={novoItem.produto}
                      onChange={(e) => setNovoItem({ ...novoItem, produto: e.target.value })}
                      placeholder="Ex: Glifosato 480g/L"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={novoItem.categoria} onValueChange={(value) => setNovoItem({ ...novoItem, categoria: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fornecedor">Fornecedor</Label>
                    <Input
                      id="fornecedor"
                      value={novoItem.fornecedor}
                      onChange={(e) => setNovoItem({ ...novoItem, fornecedor: e.target.value })}
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lote">Lote</Label>
                    <Input
                      id="lote"
                      value={novoItem.lote}
                      onChange={(e) => setNovoItem({ ...novoItem, lote: e.target.value })}
                      placeholder="Número do lote"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Validade</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataValidade && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataValidade ? format(dataValidade, "dd/MM/yyyy") : <span>Selecione a data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataValidade}
                          onSelect={(date) => {
                            setDataValidade(date);
                            setNovoItem({ ...novoItem, validade: date ? format(date, "yyyy-MM-dd") : "" });
                          }}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="estoque" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={novoItem.quantidade}
                      onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade</Label>
                    <Select value={novoItem.unidade} onValueChange={(value) => setNovoItem({ ...novoItem, unidade: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {unidades.map((unidade) => (
                          <SelectItem key={unidade.value} value={unidade.value}>
                            {unidade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorUnitario">Valor Unitário (R$)</Label>
                    <Input
                      id="valorUnitario"
                      type="number"
                      step="0.01"
                      value={novoItem.valorUnitario}
                      onChange={(e) => setNovoItem({ ...novoItem, valorUnitario: e.target.value })}
                      placeholder="0,00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Estoque</Label>
                    <Select value={novoItem.tipo} onValueChange={(value) => setNovoItem({ ...novoItem, tipo: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Estoque Normal</SelectItem>
                        <SelectItem value="intermediario">Estoque Intermediário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="localizacao">Localização no Estoque</Label>
                    <Input
                      id="localizacao"
                      value={novoItem.localizacao}
                      onChange={(e) => setNovoItem({ ...novoItem, localizacao: e.target.value })}
                      placeholder="Ex: Galpão A - Prateleira 3"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="fiscal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroNF">Número da Nota Fiscal</Label>
                    <Input
                      id="numeroNF"
                      value={novoItem.notaFiscal.numero}
                      onChange={(e) => setNovoItem({ 
                        ...novoItem, 
                        notaFiscal: { ...novoItem.notaFiscal, numero: e.target.value }
                      })}
                      placeholder="123456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serieNF">Série</Label>
                    <Input
                      id="serieNF"
                      value={novoItem.notaFiscal.serie}
                      onChange={(e) => setNovoItem({ 
                        ...novoItem, 
                        notaFiscal: { ...novoItem.notaFiscal, serie: e.target.value }
                      })}
                      placeholder="001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Emissão</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataEmissaoNF && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataEmissaoNF ? format(dataEmissaoNF, "dd/MM/yyyy") : <span>Selecione a data</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataEmissaoNF}
                          onSelect={(date) => {
                            setDataEmissaoNF(date);
                            setNovoItem({ 
                              ...novoItem, 
                              notaFiscal: { 
                                ...novoItem.notaFiscal, 
                                dataEmissao: date ? format(date, "yyyy-MM-dd") : "" 
                              }
                            });
                          }}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valorTotalNF">Valor Total da NF (R$)</Label>
                    <Input
                      id="valorTotalNF"
                      type="number"
                      step="0.01"
                      value={novoItem.notaFiscal.valorTotal}
                      onChange={(e) => setNovoItem({ 
                        ...novoItem, 
                        notaFiscal: { ...novoItem.notaFiscal, valorTotal: e.target.value }
                      })}
                      placeholder="0,00"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="chaveAcesso">Chave de Acesso da NFe</Label>
                    <Input
                      id="chaveAcesso"
                      value={novoItem.notaFiscal.chaveAcesso}
                      onChange={(e) => setNovoItem({ 
                        ...novoItem, 
                        notaFiscal: { ...novoItem.notaFiscal, chaveAcesso: e.target.value }
                      })}
                      placeholder="44 dígitos da chave de acesso"
                      maxLength={44}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCriarItem}>
                {itemEditando ? "Atualizar" : "Adicionar"} Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros e Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pesquisa">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pesquisa"
                  placeholder="Produto, lote ou fornecedor..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Estoque</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setTermoPesquisa("");
                  setFiltroCategoria("");
                  setFiltroTipo("");
                  toast({ title: "Filtros limpos!", variant: "default" });
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="normal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="normal" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Estoque Normal ({estoqueNormal.length})
          </TabsTrigger>
          <TabsTrigger value="intermediario" className="flex items-center gap-2 bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
            <TrendingUp className="h-4 w-4" />
            Estoque Intermediário ({estoqueIntermediario.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="normal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estoque Normal</CardTitle>
              <CardDescription>
                {estoqueNormal.length} item(ns) em estoque normal
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>NF</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estoqueNormal.map((item) => {
                    const stockStatus = getEstoqueStatus(item.quantidade, item.categoria);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.produto}</div>
                            <div className="text-sm text-muted-foreground">{item.fornecedor}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getCategoriaBadge(item.categoria)}>
                            {categorias.find(c => c.value === item.categoria)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.quantidade} {item.unidade}</div>
                            <div className="text-sm text-muted-foreground">R$ {item.valorUnitario.toFixed(2)}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.lote}</TableCell>
                        <TableCell>{new Date(item.validade).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>NF: {item.notaFiscal.numero}</div>
                            <div className="text-muted-foreground">Série: {item.notaFiscal.serie}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditarItem(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => handleExcluirItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intermediario" className="space-y-6">
          <Card className="border-warning/50 bg-gradient-to-r from-warning/5 to-warning/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-warning" />
                Estoque Intermediário
              </CardTitle>
              <CardDescription>
                {estoqueIntermediario.length} item(ns) em estoque intermediário - Destacado para controle especial
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-warning/10">
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="bg-gradient-to-r from-warning/20 to-warning/30 font-bold">Quantidade Intermediária</TableHead>
                    <TableHead>Lote</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>NF</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estoqueIntermediario.map((item) => {
                    const stockStatus = getEstoqueStatus(item.quantidade, item.categoria);
                    return (
                      <TableRow key={item.id} className="hover:bg-warning/5">
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.produto}</div>
                            <div className="text-sm text-muted-foreground">{item.fornecedor}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getCategoriaBadge(item.categoria)}>
                            {categorias.find(c => c.value === item.categoria)?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="bg-gradient-to-r from-warning/10 to-warning/20 font-bold">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-warning" />
                            <div>
                              <div className="font-bold text-warning-foreground">{item.quantidade} {item.unidade}</div>
                              <div className="text-sm text-muted-foreground">R$ {item.valorUnitario.toFixed(2)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.lote}</TableCell>
                        <TableCell>{new Date(item.validade).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>NF: {item.notaFiscal.numero}</div>
                            <div className="text-muted-foreground">Série: {item.notaFiscal.serie}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.variant}>
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditarItem(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => handleExcluirItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstoqueAvancado;