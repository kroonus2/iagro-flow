import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Package, 
  ChevronDown, 
  Eye, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileType,
  X
} from "lucide-react";
import { toast } from "sonner";

// Tipo para o defensivo
type Defensivo = {
  id: number;
  codigo: string;
  nomeComercial: string;
  unidade: string;
  principioAtivo: string;
  fabricante: string;
  indice: number;
  embalagem: string;
  maximo: number;
  minimo: number;
  ativo: boolean;
};

const Defensivos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Defensivo | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedDefensivo, setSelectedDefensivo] = useState<Defensivo | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [filters, setFilters] = useState({
    nomeComercial: "",
    fabricante: "",
    embalagem: "",
    unidade: ""
  });

  // Dados simulados expandidos
  const [defensivos, setDefensivos] = useState<Defensivo[]>([
    {
      id: 1,
      codigo: "NAPTOL",
      nomeComercial: "ACETRPILUNAS - BULK",
      unidade: "L",
      principioAtivo: "Glifosato",
      fabricante: "AgroTech",
      indice: 1.2,
      embalagem: "BULK",
      maximo: 1000,
      minimo: 100,
      ativo: true
    },
    {
      id: 2,
      codigo: "D",
      nomeComercial: "ABCD",
      unidade: "L",
      principioAtivo: "2,4-D",
      fabricante: "ChemCorp",
      indice: 0.8,
      embalagem: "BULK",
      maximo: 500,
      minimo: 50,
      ativo: true
    },
    {
      id: 3,
      codigo: "STITSTE",
      nomeComercial: "COLADA CD",
      unidade: "L",
      principioAtivo: "Atrazina",
      fabricante: "BioAgro",
      indice: 1.5,
      embalagem: "Fracionado",
      maximo: 200,
      minimo: 20,
      ativo: true
    },
    {
      id: 4,
      codigo: "2T",
      nomeComercial: "HERBICIDA CABDI ULTRASLOW ADOBE - FUSITRAT BOOX",
      unidade: "L",
      principioAtivo: "Paraquat",
      fabricante: "AgroSolutions",
      indice: 2.1,
      embalagem: "Fracionado",
      maximo: 300,
      minimo: 30,
      ativo: true
    },
    {
      id: 5,
      codigo: "SEITSA",
      nomeComercial: "INSARA CELAO",
      unidade: "L",
      principioAtivo: "Imidacloprido",
      fabricante: "PestControl",
      indice: 1.8,
      embalagem: "Fracionado",
      maximo: 150,
      minimo: 15,
      ativo: true
    },
    {
      id: 6,
      codigo: "STITSTR",
      nomeComercial: "STRUSTON",
      unidade: "L",
      principioAtivo: "Glifosato",
      fabricante: "AgroTech",
      indice: 1.0,
      embalagem: "BULK",
      maximo: 800,
      minimo: 80,
      ativo: true
    },
    {
      id: 7,
      codigo: "SITNSA",
      nomeComercial: "HERBICIDA PREPARA TOSIA SOL GR - FUMANA FD",
      unidade: "L",
      principioAtivo: "Dicamba",
      fabricante: "ChemCorp",
      indice: 1.3,
      embalagem: "Fracionado",
      maximo: 250,
      minimo: 25,
      ativo: true
    },
    {
      id: 8,
      codigo: "SAETHS",
      nomeComercial: "PACLAM",
      unidade: "L",
      principioAtivo: "Metribuzin",
      fabricante: "BioAgro",
      indice: 0.9,
      embalagem: "Fracionado",
      maximo: 180,
      minimo: 18,
      ativo: true
    },
    {
      id: 9,
      codigo: "PHSOLS",
      nomeComercial: "PHU BEEF",
      unidade: "KG",
      principioAtivo: "Tiofanato-metílico",
      fabricante: "FungiPro",
      indice: 2.5,
      embalagem: "Fracionado",
      maximo: 100,
      minimo: 10,
      ativo: true
    },
    {
      id: 10,
      codigo: "ED",
      nomeComercial: "CHARLIE CAUSTIC CONCENTRADO FOL DE CRANTE NATURAL CANTAL CASCO",
      unidade: "KG",
      principioAtivo: "Mancozebe",
      fabricante: "AgriChem",
      indice: 1.7,
      embalagem: "Fracionado",
      maximo: 120,
      minimo: 12,
      ativo: true
    },
    {
      id: 11,
      codigo: "TEST1",
      nomeComercial: "PRODUTO TESTE 1",
      unidade: "L",
      principioAtivo: "Substância A",
      fabricante: "TestCorp",
      indice: 1.1,
      embalagem: "BULK",
      maximo: 600,
      minimo: 60,
      ativo: true
    },
    {
      id: 12,
      codigo: "TEST2",
      nomeComercial: "PRODUTO TESTE 2",
      unidade: "KG",
      principioAtivo: "Substância B",
      fabricante: "TestCorp",
      indice: 1.4,
      embalagem: "Fracionado",
      maximo: 90,
      minimo: 9,
      ativo: true
    }
  ]);

  const itemsPerPage = 10;

  // Filtros e busca
  const filteredDefensivos = defensivos.filter(defensivo => {
    if (!defensivo.ativo) return false;
    
    const matchesSearch = searchTerm === "" || 
      defensivo.nomeComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defensivo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defensivo.principioAtivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defensivo.fabricante.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = 
      (filters.nomeComercial === "" || defensivo.nomeComercial.toLowerCase().includes(filters.nomeComercial.toLowerCase())) &&
      (filters.fabricante === "" || defensivo.fabricante.toLowerCase().includes(filters.fabricante.toLowerCase())) &&
      (filters.embalagem === "" || defensivo.embalagem === filters.embalagem) &&
      (filters.unidade === "" || defensivo.unidade === filters.unidade);

    return matchesSearch && matchesFilters;
  });

  // Ordenação
  const sortedDefensivos = [...filteredDefensivos].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Paginação
  const totalPages = Math.ceil(sortedDefensivos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedDefensivos.slice(startIndex, endIndex);

  // Handlers
  const handleSort = (field: keyof Defensivo) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleView = (defensivo: Defensivo) => {
    setSelectedDefensivo(defensivo);
    setShowViewDialog(true);
  };

  const handleEdit = (defensivo: Defensivo) => {
    setSelectedDefensivo(defensivo);
    setShowEditDialog(true);
  };

  const handleDelete = (defensivo: Defensivo) => {
    setSelectedDefensivo(defensivo);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedDefensivo) {
      setDefensivos(prev => 
        prev.map(d => 
          d.id === selectedDefensivo.id 
            ? { ...d, ativo: false }
            : d
        )
      );
      toast.success("Defensivo desativado com sucesso!");
      setShowDeleteDialog(false);
      setSelectedDefensivo(null);
    }
  };

  const handleAddNew = () => {
    setSelectedDefensivo(null);
    setShowAddDialog(true);
  };

  const handleImportCSV = () => {
    toast.info("Funcionalidade de importação CSV em desenvolvimento");
  };

  const handleImportXML = () => {
    toast.info("Funcionalidade de importação XML em desenvolvimento");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      nomeComercial: "",
      fabricante: "",
      embalagem: "",
      unidade: ""
    });
    setCurrentPage(1);
  };

  const getSortIcon = (field: keyof Defensivo) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Defensivos</h1>
          <p className="text-muted-foreground mt-1">
            Cadastro e gerenciamento de defensivos agrícolas
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Importar
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleImportCSV}>
                <FileText className="h-4 w-4 mr-2" />
                Importar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportXML}>
                <FileType className="h-4 w-4 mr-2" />
                Importar XML
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Filtros e Busca
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Busca Geral */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Busca geral (nome, código, princípio ativo, fabricante...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filtros por Coluna */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="filter-nome">Nome Comercial</Label>
                <Input
                  id="filter-nome"
                  placeholder="Filtrar por nome..."
                  value={filters.nomeComercial}
                  onChange={(e) => setFilters(prev => ({ ...prev, nomeComercial: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="filter-fabricante">Fabricante</Label>
                <Input
                  id="filter-fabricante"
                  placeholder="Filtrar por fabricante..."
                  value={filters.fabricante}
                  onChange={(e) => setFilters(prev => ({ ...prev, fabricante: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="filter-embalagem">Embalagem</Label>
                <Input
                  id="filter-embalagem"
                  placeholder="Ex: BULK, Fracionado"
                  value={filters.embalagem}
                  onChange={(e) => setFilters(prev => ({ ...prev, embalagem: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="filter-unidade">Unidade</Label>
                <Input
                  id="filter-unidade"
                  placeholder="Ex: L, KG"
                  value={filters.unidade}
                  onChange={(e) => setFilters(prev => ({ ...prev, unidade: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Defensivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Lista de Defensivos Cadastrados
            <span className="text-sm font-normal text-muted-foreground">
              {sortedDefensivos.length} registro(s) encontrado(s)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-2">
                      ID {getSortIcon('id')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('nomeComercial')}>
                    <div className="flex items-center gap-2">
                      Nome Comercial {getSortIcon('nomeComercial')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('unidade')}>
                    <div className="flex items-center gap-2">
                      Unidade {getSortIcon('unidade')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('principioAtivo')}>
                    <div className="flex items-center gap-2">
                      Princípio Ativo {getSortIcon('principioAtivo')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('fabricante')}>
                    <div className="flex items-center gap-2">
                      Fabricante {getSortIcon('fabricante')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('indice')}>
                    <div className="flex items-center gap-2">
                      Índice {getSortIcon('indice')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('embalagem')}>
                    <div className="flex items-center gap-2">
                      Embalagem {getSortIcon('embalagem')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('maximo')}>
                    <div className="flex items-center gap-2">
                      Máximo {getSortIcon('maximo')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('minimo')}>
                    <div className="flex items-center gap-2">
                      Mínimo {getSortIcon('minimo')}
                    </div>
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((defensivo) => (
                  <TableRow key={defensivo.id}>
                    <TableCell className="font-medium">
                      {defensivo.id}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="truncate" title={defensivo.nomeComercial}>
                          {defensivo.nomeComercial}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cód: {defensivo.codigo}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{defensivo.unidade}</TableCell>
                    <TableCell>{defensivo.principioAtivo}</TableCell>
                    <TableCell>{defensivo.fabricante}</TableCell>
                    <TableCell>{defensivo.indice}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={defensivo.embalagem === "BULK" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {defensivo.embalagem}
                      </Badge>
                    </TableCell>
                    <TableCell>{defensivo.maximo}</TableCell>
                    <TableCell>{defensivo.minimo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(defensivo)}
                          title="Consultar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(defensivo)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(defensivo)}
                          title="Desativar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {currentItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum defensivo encontrado com os filtros aplicados.
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, sortedDefensivos.length)} de {sortedDefensivos.length} registros
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{defensivos.filter(d => d.ativo).length}</p>
            <p className="text-sm text-muted-foreground">Defensivos Ativos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">B</span>
            </div>
            <p className="text-2xl font-bold">
              {defensivos.filter(d => d.embalagem === "BULK" && d.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Produtos BULK</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-secondary rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs font-bold text-secondary-foreground">F</span>
            </div>
            <p className="text-2xl font-bold">
              {defensivos.filter(d => d.embalagem === "Fracionado" && d.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Produtos Fracionados</p>
          </CardContent>
        </Card>
      </div>

      {/* Modais */}
      
      {/* Modal de Visualização */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consultar Defensivo</DialogTitle>
            <DialogDescription>
              Visualização completa dos dados do defensivo
            </DialogDescription>
          </DialogHeader>
          {selectedDefensivo && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <p className="text-sm font-medium">{selectedDefensivo.id}</p>
              </div>
              <div>
                <Label>Código</Label>
                <p className="text-sm font-medium">{selectedDefensivo.codigo}</p>
              </div>
              <div className="col-span-2">
                <Label>Nome Comercial</Label>
                <p className="text-sm font-medium">{selectedDefensivo.nomeComercial}</p>
              </div>
              <div>
                <Label>Unidade</Label>
                <p className="text-sm font-medium">{selectedDefensivo.unidade}</p>
              </div>
              <div>
                <Label>Princípio Ativo</Label>
                <p className="text-sm font-medium">{selectedDefensivo.principioAtivo}</p>
              </div>
              <div>
                <Label>Fabricante</Label>
                <p className="text-sm font-medium">{selectedDefensivo.fabricante}</p>
              </div>
              <div>
                <Label>Índice</Label>
                <p className="text-sm font-medium">{selectedDefensivo.indice}</p>
              </div>
              <div>
                <Label>Embalagem</Label>
                <p className="text-sm font-medium">{selectedDefensivo.embalagem}</p>
              </div>
              <div>
                <Label>Máximo</Label>
                <p className="text-sm font-medium">{selectedDefensivo.maximo}</p>
              </div>
              <div>
                <Label>Mínimo</Label>
                <p className="text-sm font-medium">{selectedDefensivo.minimo}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant={selectedDefensivo.ativo ? "default" : "destructive"}>
                  {selectedDefensivo.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Defensivo</DialogTitle>
            <DialogDescription>
              Edite as informações do defensivo selecionado
            </DialogDescription>
          </DialogHeader>
          {/* Form fields would go here - simplified for demo */}
          <div className="text-center py-8 text-muted-foreground">
            Formulário de edição em desenvolvimento
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast.success("Defensivo editado com sucesso!");
              setShowEditDialog(false);
            }}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Defensivo</DialogTitle>
            <DialogDescription>
              Preencha as informações do novo defensivo
            </DialogDescription>
          </DialogHeader>
          {/* Form fields would go here - simplified for demo */}
          <div className="text-center py-8 text-muted-foreground">
            Formulário de cadastro em desenvolvimento
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              toast.success("Novo defensivo cadastrado com sucesso!");
              setShowAddDialog(false);
            }}>
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Desativação */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar o defensivo "{selectedDefensivo?.nomeComercial}"?
              Esta ação não pode ser desfeita e o produto não aparecerá mais nas consultas ativas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Confirmar Desativação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Defensivos;