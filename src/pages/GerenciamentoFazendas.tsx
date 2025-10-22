import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Upload,
  Download,
  Edit,
  Trash2,
  Search,
  Filter,
  MapPin,
  TreePine,
  AlertTriangle,
  Wheat,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Componente genérico para filtros
interface FilterCardProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  searchPlaceholder: string;
  searchId: string;
  statusId: string;
}

const FilterCard: React.FC<FilterCardProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  searchPlaceholder,
  searchId,
  statusId,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros de Pesquisa
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2 col-span-3">
            <Label htmlFor={searchId}>Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id={searchId}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-2 col-span-1">
            <Label htmlFor={statusId}>Status</Label>
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Interfaces
interface Fazenda {
  id: string;
  descricao: string;
  municipio: string;
  estado: string;
  latitude: string;
  longitude: string;
  tamanho_total: string;
  status: "Ativo" | "Inativo";
}

interface Talhao {
  id: string;
  referencia_fazenda: string;
  latitude?: string;
  longitude?: string;
  area: string;
  tipo: "Talhão" | "Carreador";
  status: "Ativo" | "Inativo";
}

const GerenciamentoFazendas = () => {
  const [activeTab, setActiveTab] = useState("fazendas");

  // Estados de filtros por aba
  const [searchTerms, setSearchTerms] = useState({
    fazendas: "",
    talhoes: "",
  });
  const [statusFilters, setStatusFilters] = useState({
    fazendas: "todos",
    talhoes: "todos",
  });
  const [filteredData, setFilteredData] = useState({
    fazendas: [] as Fazenda[],
    talhoes: [] as Talhao[],
  });

  // Função para filtrar dados
  const filterData = (
    data: any[],
    searchTerm: string,
    searchFields: string[],
    statusFilter: string = "todos"
  ) => {
    let filtered = data;

    // Filtro por status
    if (statusFilter !== "todos") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }

    return filtered;
  };

  // Estados para Fazendas
  const [fazendas, setFazendas] = useState<Fazenda[]>([
    {
      id: "1",
      descricao: "Fazenda São José",
      municipio: "Uberlândia",
      estado: "MG",
      latitude: "-18.9186",
      longitude: "-48.2772",
      tamanho_total: "1000.50",
      status: "Ativo",
    },
    {
      id: "2",
      descricao: "Fazenda Boa Vista",
      municipio: "Ribeirão Preto",
      estado: "SP",
      latitude: "-21.1775",
      longitude: "-47.8103",
      tamanho_total: "2500.75",
      status: "Ativo",
    },
    {
      id: "3",
      descricao: "Fazenda Santa Maria",
      municipio: "Goiânia",
      estado: "GO",
      latitude: "-16.6864",
      longitude: "-49.2643",
      tamanho_total: "1800.25",
      status: "Inativo",
    },
  ]);
  const [showFazendaDialog, setShowFazendaDialog] = useState(false);
  const [editingFazenda, setEditingFazenda] = useState<Fazenda | null>(null);
  const [fazendaForm, setFazendaForm] = useState({
    descricao: "",
    municipio: "",
    estado: "",
    latitude: "",
    longitude: "",
    tamanho_total: "",
    status: "Ativo",
  });

  // Estados para Talhões
  const [talhoes, setTalhoes] = useState<Talhao[]>([
    {
      id: "1",
      referencia_fazenda: "1",
      latitude: "-18.9200",
      longitude: "-48.2800",
      area: "250.25",
      tipo: "Talhão",
      status: "Ativo",
    },
    {
      id: "2",
      referencia_fazenda: "1",
      latitude: "-18.9150",
      longitude: "-48.2750",
      area: "300.50",
      tipo: "Talhão",
      status: "Ativo",
    },
    {
      id: "3",
      referencia_fazenda: "1",
      area: "449.75",
      tipo: "Carreador",
      status: "Ativo",
    },
    {
      id: "4",
      referencia_fazenda: "2",
      latitude: "-21.1800",
      longitude: "-47.8150",
      area: "500.25",
      tipo: "Talhão",
      status: "Ativo",
    },
    {
      id: "5",
      referencia_fazenda: "2",
      area: "2000.50",
      tipo: "Carreador",
      status: "Ativo",
    },
  ]);
  const [showTalhaoDialog, setShowTalhaoDialog] = useState(false);
  const [editingTalhao, setEditingTalhao] = useState<Talhao | null>(null);
  const [talhaoForm, setTalhaoForm] = useState({
    referencia_fazenda: "",
    latitude: "",
    longitude: "",
    area: "",
    tipo: "Talhão",
    status: "Ativo",
  });

  // Efeito para aplicar filtros
  useEffect(() => {
    setFilteredData({
      fazendas: filterData(
        fazendas,
        searchTerms.fazendas,
        ["descricao", "municipio", "estado"],
        statusFilters.fazendas
      ),
      talhoes: filterData(
        talhoes,
        searchTerms.talhoes,
        ["referencia_fazenda", "tipo"],
        statusFilters.talhoes
      ),
    });
  }, [searchTerms, statusFilters, fazendas, talhoes]);

  // Função para validar área total dos talhões
  const validarAreaTotal = (
    fazendaId: string,
    novaArea: number,
    talhaoId?: string
  ) => {
    const fazenda = fazendas.find((f) => f.id === fazendaId);
    if (!fazenda) return { valido: false, mensagem: "Fazenda não encontrada" };

    const areaTotalFazenda = parseFloat(fazenda.tamanho_total);
    const talhoesDaFazenda = talhoes.filter(
      (t) =>
        t.referencia_fazenda === fazendaId &&
        t.status === "Ativo" &&
        t.id !== talhaoId
    );

    const areaAtualTalhoes = talhoesDaFazenda.reduce(
      (total, t) => total + parseFloat(t.area),
      0
    );
    const areaTotalComNova = areaAtualTalhoes + novaArea;

    if (areaTotalComNova > areaTotalFazenda) {
      return {
        valido: false,
        mensagem: `Área total dos talhões (${areaTotalComNova.toFixed(
          2
        )} ha) excede o tamanho total da fazenda (${areaTotalFazenda} ha)`,
      };
    }

    return { valido: true, mensagem: "" };
  };

  // Funções de Fazenda
  const handleSaveFazenda = () => {
    if (editingFazenda) {
      setFazendas(
        fazendas.map((faz) =>
          faz.id === editingFazenda.id
            ? {
                ...editingFazenda,
                ...fazendaForm,
                status: fazendaForm.status as "Ativo" | "Inativo",
              }
            : faz
        )
      );
      toast({ title: "Fazenda atualizada com sucesso!" });
    } else {
      const newFazenda: Fazenda = {
        id: Date.now().toString(),
        ...fazendaForm,
        status: fazendaForm.status as "Ativo" | "Inativo",
      };
      setFazendas([...fazendas, newFazenda]);
      toast({ title: "Fazenda cadastrada com sucesso!" });
    }
    handleCloseFazendaDialog();
  };

  const handleEditFazenda = (fazenda: Fazenda) => {
    setEditingFazenda(fazenda);
    setFazendaForm({
      descricao: fazenda.descricao,
      municipio: fazenda.municipio,
      estado: fazenda.estado,
      latitude: fazenda.latitude,
      longitude: fazenda.longitude,
      tamanho_total: fazenda.tamanho_total,
      status: fazenda.status,
    });
    setShowFazendaDialog(true);
  };

  const handleDeleteFazenda = (id: string) => {
    // Verificar se há talhões vinculados
    const talhoesVinculados = talhoes.filter(
      (t) => t.referencia_fazenda === id
    );
    if (talhoesVinculados.length > 0) {
      toast({
        title: "Erro",
        description: "Não é possível excluir fazenda com talhões vinculados.",
        variant: "destructive",
      });
      return;
    }

    setFazendas(fazendas.filter((faz) => faz.id !== id));
    toast({ title: "Fazenda removida com sucesso!" });
  };

  const handleCloseFazendaDialog = () => {
    setShowFazendaDialog(false);
    setEditingFazenda(null);
    setFazendaForm({
      descricao: "",
      municipio: "",
      estado: "",
      latitude: "",
      longitude: "",
      tamanho_total: "",
      status: "Ativo",
    });
  };

  // Funções de Talhão
  const handleSaveTalhao = () => {
    // Validar área total
    const validacao = validarAreaTotal(
      talhaoForm.referencia_fazenda,
      parseFloat(talhaoForm.area),
      editingTalhao?.id
    );

    if (!validacao.valido) {
      toast({
        title: "Erro de Validação",
        description: validacao.mensagem,
        variant: "destructive",
      });
      return;
    }

    if (editingTalhao) {
      setTalhoes(
        talhoes.map((tal) =>
          tal.id === editingTalhao.id
            ? {
                ...editingTalhao,
                ...talhaoForm,
                tipo: talhaoForm.tipo as "Talhão" | "Carreador",
                status: talhaoForm.status as "Ativo" | "Inativo",
              }
            : tal
        )
      );
      toast({ title: "Talhão atualizado com sucesso!" });
    } else {
      const newTalhao: Talhao = {
        id: Date.now().toString(),
        ...talhaoForm,
        tipo: talhaoForm.tipo as "Talhão" | "Carreador",
        status: talhaoForm.status as "Ativo" | "Inativo",
      };
      setTalhoes([...talhoes, newTalhao]);
      toast({ title: "Talhão cadastrado com sucesso!" });
    }
    handleCloseTalhaoDialog();
  };

  const handleEditTalhao = (talhao: Talhao) => {
    setEditingTalhao(talhao);
    setTalhaoForm({
      referencia_fazenda: talhao.referencia_fazenda,
      latitude: talhao.latitude || "",
      longitude: talhao.longitude || "",
      area: talhao.area,
      tipo: talhao.tipo,
      status: talhao.status,
    });
    setShowTalhaoDialog(true);
  };

  const handleDeleteTalhao = (id: string) => {
    setTalhoes(talhoes.filter((tal) => tal.id !== id));
    toast({ title: "Talhão removido com sucesso!" });
  };

  const handleCloseTalhaoDialog = () => {
    setShowTalhaoDialog(false);
    setEditingTalhao(null);
    setTalhaoForm({
      referencia_fazenda: "",
      latitude: "",
      longitude: "",
      area: "",
      tipo: "Talhão",
      status: "Ativo",
    });
  };

  // Função para calcular área total dos talhões de uma fazenda
  const calcularAreaTotalTalhoes = (fazendaId: string) => {
    return talhoes
      .filter((t) => t.referencia_fazenda === fazendaId && t.status === "Ativo")
      .reduce((total, t) => total + parseFloat(t.area), 0);
  };

  // Função para obter nome da fazenda
  const getNomeFazenda = (fazendaId: string) => {
    const fazenda = fazendas.find((f) => f.id === fazendaId);
    return fazenda ? fazenda.descricao : "Fazenda não encontrada";
  };

  // Funções de Importação
  const handleImportCSV = (tipo: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        toast({ title: `Importando ${tipo} do arquivo ${file.name}...` });
      }
    };
    input.click();
  };

  // Funções de Exportação
  const handleExport = (tipo: string, formato: "csv" | "pdf") => {
    toast({
      title: `Exportando ${tipo} em formato ${formato.toUpperCase()}...`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gerenciamento de Fazendas
          </h1>
          <p className="text-muted-foreground">
            Gerencie fazendas e seus talhões
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fazendas</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Wheat className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {fazendas.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.fazendas.length} filtradas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Talhões</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {talhoes.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.talhoes.length} filtrados
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fazendas">Fazendas</TabsTrigger>
          <TabsTrigger value="talhoes">Talhões</TabsTrigger>
        </TabsList>

        {/* Aba Fazendas */}
        <TabsContent value="fazendas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fazendas</CardTitle>
              <CardDescription>
                {filteredData.fazendas.length} fazenda(s) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FilterCard
                searchTerm={searchTerms.fazendas}
                onSearchChange={(value) =>
                  setSearchTerms({ ...searchTerms, fazendas: value })
                }
                statusFilter={statusFilters.fazendas}
                onStatusChange={(value) =>
                  setStatusFilters({ ...statusFilters, fazendas: value })
                }
                searchPlaceholder="Descrição, município ou estado..."
                searchId="search-fazendas"
                statusId="status-fazendas"
              />

              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleImportCSV("Fazenda")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar CSV
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleExport("Fazenda", "csv")}
                      >
                        Exportar CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport("Fazenda", "pdf")}
                      >
                        Exportar PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button onClick={() => setShowFazendaDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Fazenda
                </Button>
              </div>

              {filteredData.fazendas.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.fazendas
                    ? "Nenhuma fazenda encontrada com os filtros aplicados."
                    : "Nenhuma fazenda cadastrada."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Município</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Coordenadas</TableHead>
                        <TableHead>Tamanho Total (ha)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.fazendas.map((faz) => {
                        const areaTalhoes = calcularAreaTotalTalhoes(faz.id);
                        const areaFazenda = parseFloat(faz.tamanho_total);
                        const divergencia =
                          Math.abs(areaFazenda - areaTalhoes) > 0.01;

                        return (
                          <TableRow key={faz.id}>
                            <TableCell className="font-medium">
                              {faz.descricao}
                            </TableCell>
                            <TableCell>{faz.municipio}</TableCell>
                            <TableCell>{faz.estado}</TableCell>
                            <TableCell>
                              {faz.latitude}, {faz.longitude}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{faz.tamanho_total}</span>
                                {divergencia && (
                                  <span className="text-xs text-orange-600">
                                    Talhões: {areaTalhoes.toFixed(2)} ha
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  faz.status === "Ativo"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {faz.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditFazenda(faz)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteFazenda(faz.id)}
                                  className="hover:bg-destructive"
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
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Talhões */}
        <TabsContent value="talhoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Talhões</CardTitle>
              <CardDescription>
                {filteredData.talhoes.length} talhão(ões) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FilterCard
                searchTerm={searchTerms.talhoes}
                onSearchChange={(value) =>
                  setSearchTerms({ ...searchTerms, talhoes: value })
                }
                statusFilter={statusFilters.talhoes}
                onStatusChange={(value) =>
                  setStatusFilters({ ...statusFilters, talhoes: value })
                }
                searchPlaceholder="Referência da fazenda ou tipo..."
                searchId="search-talhoes"
                statusId="status-talhoes"
              />

              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleImportCSV("Talhão")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar CSV
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleExport("Talhão", "csv")}
                      >
                        Exportar CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport("Talhão", "pdf")}
                      >
                        Exportar PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button onClick={() => setShowTalhaoDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Talhão
                </Button>
              </div>

              {filteredData.talhoes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.talhoes
                    ? "Nenhum talhão encontrado com os filtros aplicados."
                    : "Nenhum talhão cadastrado."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fazenda</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Coordenadas</TableHead>
                        <TableHead>Área (ha)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.talhoes.map((tal) => (
                        <TableRow key={tal.id}>
                          <TableCell className="font-medium">
                            {getNomeFazenda(tal.referencia_fazenda)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{tal.tipo}</Badge>
                          </TableCell>
                          <TableCell>
                            {tal.tipo === "Talhão"
                              ? `${tal.latitude}, ${tal.longitude}`
                              : "N/A"}
                          </TableCell>
                          <TableCell>{tal.area}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tal.status === "Ativo" ? "default" : "secondary"
                              }
                            >
                              {tal.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTalhao(tal)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTalhao(tal.id)}
                                className="hover:bg-destructive"
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Fazenda */}
      <Dialog open={showFazendaDialog} onOpenChange={setShowFazendaDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFazenda ? "Editar Fazenda" : "Nova Fazenda"}
            </DialogTitle>
            <DialogDescription>Preencha os dados da fazenda</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="faz-descricao">Descrição</Label>
              <Input
                id="faz-descricao"
                value={fazendaForm.descricao}
                onChange={(e) =>
                  setFazendaForm({
                    ...fazendaForm,
                    descricao: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="faz-municipio">Município</Label>
                <Input
                  id="faz-municipio"
                  value={fazendaForm.municipio}
                  onChange={(e) =>
                    setFazendaForm({
                      ...fazendaForm,
                      municipio: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="faz-estado">Estado</Label>
                <Input
                  id="faz-estado"
                  value={fazendaForm.estado}
                  onChange={(e) =>
                    setFazendaForm({
                      ...fazendaForm,
                      estado: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="faz-latitude">Latitude</Label>
                <Input
                  id="faz-latitude"
                  value={fazendaForm.latitude}
                  onChange={(e) =>
                    setFazendaForm({
                      ...fazendaForm,
                      latitude: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="faz-longitude">Longitude</Label>
                <Input
                  id="faz-longitude"
                  value={fazendaForm.longitude}
                  onChange={(e) =>
                    setFazendaForm({
                      ...fazendaForm,
                      longitude: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="faz-tamanho">Tamanho Total (ha)</Label>
              <Input
                id="faz-tamanho"
                type="number"
                step="0.01"
                value={fazendaForm.tamanho_total}
                onChange={(e) =>
                  setFazendaForm({
                    ...fazendaForm,
                    tamanho_total: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="faz-status">Status</Label>
              <Select
                value={fazendaForm.status}
                onValueChange={(value) =>
                  setFazendaForm({
                    ...fazendaForm,
                    status: value as "Ativo" | "Inativo",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseFazendaDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFazenda}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Talhão */}
      <Dialog open={showTalhaoDialog} onOpenChange={setShowTalhaoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTalhao ? "Editar Talhão" : "Novo Talhão"}
            </DialogTitle>
            <DialogDescription>Preencha os dados do talhão</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tal-fazenda">Fazenda</Label>
              <Select
                value={talhaoForm.referencia_fazenda}
                onValueChange={(value) =>
                  setTalhaoForm({
                    ...talhaoForm,
                    referencia_fazenda: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fazenda" />
                </SelectTrigger>
                <SelectContent>
                  {fazendas.map((faz) => (
                    <SelectItem key={faz.id} value={faz.id}>
                      {faz.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tal-tipo">Tipo</Label>
              <Select
                value={talhaoForm.tipo}
                onValueChange={(value) =>
                  setTalhaoForm({
                    ...talhaoForm,
                    tipo: value as "Talhão" | "Carreador",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Talhão">Talhão</SelectItem>
                  <SelectItem value="Carreador">Carreador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {talhaoForm.tipo === "Talhão" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tal-latitude">Latitude</Label>
                  <Input
                    id="tal-latitude"
                    value={talhaoForm.latitude}
                    onChange={(e) =>
                      setTalhaoForm({
                        ...talhaoForm,
                        latitude: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="tal-longitude">Longitude</Label>
                  <Input
                    id="tal-longitude"
                    value={talhaoForm.longitude}
                    onChange={(e) =>
                      setTalhaoForm({
                        ...talhaoForm,
                        longitude: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="tal-area">Área (ha)</Label>
              <Input
                id="tal-area"
                type="number"
                step="0.01"
                value={talhaoForm.area}
                onChange={(e) =>
                  setTalhaoForm({
                    ...talhaoForm,
                    area: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="tal-status">Status</Label>
              <Select
                value={talhaoForm.status}
                onValueChange={(value) =>
                  setTalhaoForm({
                    ...talhaoForm,
                    status: value as "Ativo" | "Inativo",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseTalhaoDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTalhao}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciamentoFazendas;
