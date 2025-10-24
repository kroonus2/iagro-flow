import { useState, useEffect } from "react";
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
  DialogTrigger,
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MapPin,
  TreePine,
  AlertTriangle,
  Wheat,
  Upload,
  Download,
  ChevronDown,
  ChevronRight,
  Map,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  talhoes: Talhao[]; // Talhões da fazenda
}

interface Talhao {
  id: string;
  latitude?: string;
  longitude?: string;
  area: string;
  tipo: "Talhão" | "Carreador";
  status: "Ativo" | "Inativo";
  observacoes?: string;
}

// Componente de filtro
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

const GerenciamentoFazendas = () => {
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [filteredFazendas, setFilteredFazendas] = useState<Fazenda[]>([]);
  const [expandedFazendas, setExpandedFazendas] = useState<Set<string>>(
    new Set()
  );

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Função para filtrar dados
  const filterData = (
    data: any[],
    searchTerm: string,
    searchFields: string[],
    statusFilter: string
  ) => {
    let filtered = data;

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

    if (statusFilter !== "todos") {
      filtered = filtered.filter((item) => item.status === statusFilter);
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
      talhoes: [
        {
          id: "1",
          latitude: "-18.9200",
          longitude: "-48.2800",
          area: "250.25",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão principal para soja",
        },
        {
          id: "2",
          latitude: "-18.9150",
          longitude: "-48.2750",
          area: "300.50",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão para milho",
        },
        {
          id: "3",
          area: "449.75",
          tipo: "Carreador",
          status: "Ativo",
          observacoes: "Último item obrigatório para todas as fazendas",
        },
      ],
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
      talhoes: [
        {
          id: "4",
          latitude: "-21.1850",
          longitude: "-47.8200",
          area: "500.25",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão A - Soja",
        },
        {
          id: "5",
          area: "2000.50",
          tipo: "Carreador",
          status: "Ativo",
          observacoes: "Carreador principal",
        },
      ],
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
      talhoes: [],
    },
    {
      id: "4",
      descricao: "Fazenda Vista Alegre",
      municipio: "Campinas",
      estado: "SP",
      latitude: "-22.9056",
      longitude: "-47.0608",
      tamanho_total: "3200.75",
      status: "Ativo",
      talhoes: [
        {
          id: "6",
          latitude: "-22.9100",
          longitude: "-47.0650",
          area: "800.25",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão principal",
        },
        {
          id: "7",
          area: "2400.50",
          tipo: "Carreador",
          status: "Ativo",
          observacoes: "Carreador principal",
        },
      ],
    },
    {
      id: "5",
      descricao: "Fazenda São Pedro",
      municipio: "Sorocaba",
      estado: "SP",
      latitude: "-23.5015",
      longitude: "-47.4526",
      tamanho_total: "1500.00",
      status: "Ativo",
      talhoes: [
        {
          id: "8",
          latitude: "-23.5050",
          longitude: "-47.4550",
          area: "500.00",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão A",
        },
        {
          id: "9",
          latitude: "-23.5080",
          longitude: "-47.4580",
          area: "500.00",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão B",
        },
        {
          id: "10",
          area: "500.00",
          tipo: "Carreador",
          status: "Ativo",
          observacoes: "Carreador",
        },
      ],
    },
  ]);

  const [showFazendaDialog, setShowFazendaDialog] = useState(false);
  const [showMapDialog, setShowMapDialog] = useState(false);
  const [editingFazenda, setEditingFazenda] = useState<Fazenda | null>(null);
  const [fazendaForm, setFazendaForm] = useState({
    descricao: "",
    municipio: "",
    estado: "",
    latitude: "",
    longitude: "",
    tamanho_total: "",
    status: "Ativo" as "Ativo" | "Inativo",
    talhoes: [] as Talhao[],
  });

  // Estados para edição de talhões
  const [editingTalhao, setEditingTalhao] = useState<Talhao | null>(null);
  const [talhaoForm, setTalhaoForm] = useState({
    latitude: "",
    longitude: "",
    area: "",
    tipo: "Talhão" as "Talhão" | "Carreador",
    status: "Ativo" as "Ativo" | "Inativo",
    observacoes: "",
  });

  // Efeito para aplicar filtros
  useEffect(() => {
    const filtered = filterData(
      fazendas,
      searchTerm,
      ["descricao", "municipio", "estado"],
      statusFilter
    );
    setFilteredFazendas(filtered);
    setCurrentPage(1); // Reset para primeira página quando filtros mudarem
  }, [searchTerm, statusFilter, fazendas]);

  // Função para validar área total dos talhões
  const validarAreaTotal = (
    talhoes: Talhao[],
    novaArea: number,
    talhaoId?: string
  ) => {
    const talhoesAtuais = talhoes.filter((t) => t.id !== talhaoId);
    const areaAtual = talhoesAtuais.reduce(
      (sum, t) => sum + parseFloat(t.area),
      0
    );
    const areaTotal = areaAtual + novaArea;

    return { areaAtual, areaTotal };
  };

  // Funções de Fazenda
  const handleSaveFazenda = () => {
    // Validar área total dos talhões
    const validacao = validarAreaTotal(fazendaForm.talhoes, 0);
    const areaTotalFazenda = parseFloat(fazendaForm.tamanho_total);

    if (validacao.areaTotal > areaTotalFazenda) {
      toast({
        title: "Erro de Validação",
        description: `A soma das áreas dos talhões (${validacao.areaTotal.toFixed(
          2
        )} ha) excede o tamanho total da fazenda (${areaTotalFazenda} ha)`,
        variant: "destructive",
      });
      return;
    }

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
      talhoes: fazenda.talhoes,
    });
    setShowFazendaDialog(true);
  };

  const handleDeleteFazenda = (id: string) => {
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
      status: "Ativo" as "Ativo" | "Inativo",
      talhoes: [],
    });
  };

  // Funções de Talhão
  const handleAddTalhao = () => {
    if (!talhaoForm.area || parseFloat(talhaoForm.area) <= 0) {
      toast({
        title: "Erro",
        description: "Área deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    const newTalhao: Talhao = {
      id: Date.now().toString(),
      ...talhaoForm,
      tipo: talhaoForm.tipo as "Talhão" | "Carreador",
      status: talhaoForm.status as "Ativo" | "Inativo",
    };

    setFazendaForm({
      ...fazendaForm,
      talhoes: [...fazendaForm.talhoes, newTalhao],
    });

    // Limpar formulário
    setTalhaoForm({
      latitude: "",
      longitude: "",
      area: "",
      tipo: "Talhão" as "Talhão" | "Carreador",
      status: "Ativo" as "Ativo" | "Inativo",
      observacoes: "",
    });

    toast({ title: "Talhão adicionado com sucesso!" });
  };

  const handleEditTalhao = (talhao: Talhao) => {
    setEditingTalhao(talhao);
    setTalhaoForm({
      latitude: talhao.latitude || "",
      longitude: talhao.longitude || "",
      area: talhao.area,
      tipo: talhao.tipo,
      status: talhao.status,
      observacoes: talhao.observacoes || "",
    });
  };

  const handleUpdateTalhao = () => {
    if (!editingTalhao) return;

    const updatedTalhoes = fazendaForm.talhoes.map((tal) =>
      tal.id === editingTalhao.id
        ? {
            ...tal,
            ...talhaoForm,
            tipo: talhaoForm.tipo as "Talhão" | "Carreador",
            status: talhaoForm.status as "Ativo" | "Inativo",
          }
        : tal
    );

    setFazendaForm({
      ...fazendaForm,
      talhoes: updatedTalhoes,
    });

    setEditingTalhao(null);
    setTalhaoForm({
      latitude: "",
      longitude: "",
      area: "",
      tipo: "Talhão" as "Talhão" | "Carreador",
      status: "Ativo" as "Ativo" | "Inativo",
      observacoes: "",
    });

    toast({ title: "Talhão atualizado com sucesso!" });
  };

  const handleDeleteTalhao = (talhaoId: string) => {
    setFazendaForm({
      ...fazendaForm,
      talhoes: fazendaForm.talhoes.filter((tal) => tal.id !== talhaoId),
    });
    toast({ title: "Talhão removido com sucesso!" });
  };

  // Função para calcular área total dos talhões de uma fazenda
  const calcularAreaTotalTalhoes = (talhoes: Talhao[]) => {
    return talhoes
      .filter((t) => t.status === "Ativo")
      .reduce((total, t) => total + parseFloat(t.area), 0);
  };

  // Funções de Export/Import
  const handleExport = (tipo: string, formato: string) => {
    if (tipo === "Fazenda") {
      const dados = filteredFazendas.map((fazenda) => ({
        Descrição: fazenda.descricao,
        Município: fazenda.municipio,
        Estado: fazenda.estado,
        Latitude: fazenda.latitude,
        Longitude: fazenda.longitude,
        "Tamanho Total (ha)": fazenda.tamanho_total,
        Status: fazenda.status,
        "Total de Talhões": fazenda.talhoes.length,
        "Área dos Talhões": calcularAreaTotalTalhoes(fazenda.talhoes).toFixed(
          2
        ),
      }));

      if (formato === "csv") {
        const csvContent = [
          Object.keys(dados[0] || {}).join(","),
          ...dados.map((row) => Object.values(row).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fazendas_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }

    toast({
      title: `Exportação ${formato.toUpperCase()} realizada com sucesso!`,
    });
  };

  // Estados para importação CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvPreview, setCsvPreview] = useState(false);
  const [dialogImportAberto, setDialogImportAberto] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());
        const data = lines
          .slice(1)
          .map((line) => {
            const values = line.split(",").map((v) => v.trim());
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = values[index] || "";
            });
            return obj;
          })
          .filter((row) => row.descricao); // Remove linhas vazias

        setCsvData(data);
        setCsvPreview(true);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive",
      });
    }
  };

  const importarCSV = () => {
    const novosIds = csvData.map(
      (_, index) => Math.max(...fazendas.map((f) => parseInt(f.id))) + index + 1
    );
    const novosFornecedores: Fazenda[] = csvData.map((item, index) => ({
      id: novosIds[index].toString(),
      descricao: item.descricao || "",
      municipio: item.municipio || "",
      estado: item.estado || "",
      latitude: item.latitude || "",
      longitude: item.longitude || "",
      tamanho_total: item.tamanho_total || "",
      status: "Ativo" as "Ativo" | "Inativo",
      talhoes: [],
    }));

    setFazendas((prev) => [...prev, ...novosFornecedores]);
    toast({
      title: "Importação concluída!",
      description: `${novosFornecedores.length} fazendas importadas com sucesso.`,
      variant: "default",
    });

    setCsvFile(null);
    setCsvData([]);
    setCsvPreview(false);
    setDialogImportAberto(false);
  };

  const downloadTemplate = () => {
    const csvContent =
      "descricao,municipio,estado,latitude,longitude,tamanho_total\n" +
      "Fazenda Exemplo Ltda,Uberlândia,MG,-18.9186,-48.2772,1000.50";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "template_fazendas.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportCSV = () => {
    setDialogImportAberto(true);
  };

  // Função para gerar mapa
  const handleGenerateMap = () => {
    setShowMapDialog(true);
  };

  // Função para gerar URL do Google Maps com múltiplos pontos
  const generateMapUrl = () => {
    const fazendasComCoordenadas = fazendas.filter(
      (f) =>
        f.latitude &&
        f.longitude &&
        parseFloat(f.latitude) !== 0 &&
        parseFloat(f.longitude) !== 0
    );

    if (fazendasComCoordenadas.length === 0) {
      toast({
        title: "Aviso",
        description: "Nenhuma fazenda com coordenadas válidas encontrada.",
        variant: "destructive",
      });
      return;
    }

    // Se há apenas uma fazenda, mostrar ela
    if (fazendasComCoordenadas.length === 1) {
      const fazenda = fazendasComCoordenadas[0];
      return `https://www.google.com/maps?q=${fazenda.latitude},${fazenda.longitude}`;
    }

    // Para múltiplas fazendas, criar uma URL com todos os pontos
    const coordinates = fazendasComCoordenadas
      .map((f) => `${f.latitude},${f.longitude}`)
      .join("/");

    return `https://www.google.com/maps/dir/${coordinates}`;
  };

  // Função para gerar dados do mapa para visualização
  const getMapData = () => {
    return fazendas
      .map((fazenda) => ({
        id: fazenda.id,
        nome: fazenda.descricao,
        municipio: fazenda.municipio,
        estado: fazenda.estado,
        latitude: parseFloat(fazenda.latitude) || 0,
        longitude: parseFloat(fazenda.longitude) || 0,
        tamanho_total: parseFloat(fazenda.tamanho_total) || 0,
        status: fazenda.status,
        talhoes: fazenda.talhoes
          .map((talhao) => ({
            id: talhao.id,
            tipo: talhao.tipo,
            area: parseFloat(talhao.area) || 0,
            latitude: talhao.latitude ? parseFloat(talhao.latitude) : null,
            longitude: talhao.longitude ? parseFloat(talhao.longitude) : null,
            status: talhao.status,
            observacoes: talhao.observacoes,
          }))
          .filter((t) => t.latitude !== null && t.longitude !== null),
      }))
      .filter((f) => f.latitude !== 0 && f.longitude !== 0);
  };

  // Função para alternar expansão de fazenda
  const toggleFazendaExpansion = (fazendaId: string) => {
    const newExpanded = new Set(expandedFazendas);
    if (newExpanded.has(fazendaId)) {
      newExpanded.delete(fazendaId);
    } else {
      newExpanded.add(fazendaId);
    }
    setExpandedFazendas(newExpanded);
  };

  // Funções de paginação
  const totalPages = Math.ceil(filteredFazendas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFazendas = filteredFazendas.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cadastro de Fazendas & Talhões
          </h1>
          <p className="text-muted-foreground">
            Gerencie fazendas e seus talhões em um único cadastro
          </p>
        </div>
        <div></div>
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
            <div className="text-2xl font-bold">{fazendas.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de fazendas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Talhões</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TreePine className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fazendas.reduce((acc, f) => acc + f.talhoes.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de talhões cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <FilterCard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchPlaceholder="Buscar por descrição, município ou estado..."
        searchId="search-fazendas"
        statusId="status-fazendas"
      />

      {/* Botões de Ação */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {/* Botão Importar */}
          <Dialog
            open={dialogImportAberto}
            onOpenChange={setDialogImportAberto}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importar CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Importar Fazendas</DialogTitle>
                <DialogDescription>
                  Importe fazendas através de arquivo CSV. Baixe o template para
                  o formato correto.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Template CSV</h4>
                    <p className="text-sm text-muted-foreground">
                      Baixe o modelo com o formato correto para importação
                    </p>
                  </div>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Template
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csvFile">Arquivo CSV</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </div>

                {csvPreview && csvData.length > 0 && (
                  <div className="space-y-2">
                    <Label>Prévia dos Dados ({csvData.length} registros)</Label>
                    <div className="max-h-60 overflow-auto border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Município</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Tamanho Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {csvData.slice(0, 5).map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {item.descricao}
                              </TableCell>
                              <TableCell>{item.municipio}</TableCell>
                              <TableCell>{item.estado}</TableCell>
                              <TableCell>{item.tamanho_total}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {csvData.length > 5 && (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          ... e mais {csvData.length - 5} registros
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogImportAberto(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={importarCSV}
                  disabled={!csvPreview || csvData.length === 0}
                >
                  Importar {csvData.length} Fazendas
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("Fazenda", "csv")}>
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("Fazenda", "pdf")}>
                Exportar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={handleGenerateMap}>
            <Map className="h-4 w-4 mr-2" />
            Gerar Mapa
          </Button>
        </div>
        <Button onClick={() => setShowFazendaDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Fazenda
        </Button>
      </div>

      {/* Card Principal com Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Fazendas Cadastradas</CardTitle>
          <CardDescription>
            {filteredFazendas.length} fazenda(s) encontrada(s)
            {filteredFazendas.length > itemsPerPage && (
              <span className="ml-2">
                • Página {currentPage} de {totalPages}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Listagem de Fazendas */}
          <div className="space-y-4">
            {filteredFazendas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm
                  ? "Nenhuma fazenda encontrada com os filtros aplicados."
                  : "Nenhuma fazenda cadastrada."}
              </div>
            ) : (
              currentFazendas.map((fazenda) => {
                const areaTalhoes = calcularAreaTotalTalhoes(fazenda.talhoes);
                const areaFazenda = parseFloat(fazenda.tamanho_total);
                const isExpanded = expandedFazendas.has(fazenda.id);

                return (
                  <Card
                    key={fazenda.id}
                    className="border-l-4 border-l-blue-500"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleFazendaExpansion(fazenda.id)
                                }
                                className="p-1 h-8 w-8"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </Collapsible>
                          <div>
                            <CardTitle className="text-lg">
                              {fazenda.descricao}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {fazenda.municipio}/{fazenda.estado} •{" "}
                              {fazenda.latitude}, {fazenda.longitude}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-2">
                          <Badge
                            variant={
                              fazenda.status === "Ativo"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {fazenda.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFazenda(fazenda)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFazenda(fazenda.id)}
                              className="hover:bg-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Tamanho Total
                          </p>
                          <p className="text-lg font-semibold">
                            {fazenda.tamanho_total} ha
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Área dos Talhões
                          </p>
                          <p className="text-lg font-semibold">
                            {areaTalhoes.toFixed(2)} ha
                          </p>
                        </div>
                      </div>

                      {/* Resumo dos Talhões */}
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">
                          Talhões ({fazenda.talhoes.length})
                        </h4>
                        <div className="text-xs text-muted-foreground">
                          {
                            fazenda.talhoes.filter((t) => t.tipo === "Talhão")
                              .length
                          }{" "}
                          talhões •{" "}
                          {
                            fazenda.talhoes.filter(
                              (t) => t.tipo === "Carreador"
                            ).length
                          }{" "}
                          carreadores
                        </div>
                      </div>

                      {/* Lista completa dos talhões (colapsível) */}
                      <Collapsible open={isExpanded}>
                        <CollapsibleContent>
                          {fazenda.talhoes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              Nenhum talhão cadastrado
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {fazenda.talhoes.map((talhao) => (
                                <div
                                  key={talhao.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline">
                                      {talhao.tipo}
                                    </Badge>
                                    <span className="text-sm font-medium">
                                      {talhao.area} ha
                                    </span>
                                    {talhao.tipo === "Talhão" && (
                                      <span className="text-xs text-muted-foreground">
                                        {talhao.latitude}, {talhao.longitude}
                                      </span>
                                    )}
                                    {talhao.observacoes && (
                                      <span className="text-xs text-muted-foreground">
                                        {talhao.observacoes}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        talhao.status === "Ativo"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {talhao.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Paginação */}
          {filteredFazendas.length > itemsPerPage && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog do Mapa */}
      <Dialog open={showMapDialog} onOpenChange={setShowMapDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mapa das Fazendas e Talhões</DialogTitle>
            <DialogDescription>
              Visualização das coordenadas das fazendas e seus talhões
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Resumo das coordenadas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Resumo das Coordenadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {getMapData().length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Fazendas com Coordenadas
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {getMapData().reduce(
                        (acc, f) => acc + f.talhoes.length,
                        0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Talhões com Coordenadas
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {getMapData()
                        .reduce((acc, f) => acc + f.tamanho_total, 0)
                        .toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Área Total (ha)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista detalhada das fazendas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Detalhes das Coordenadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getMapData().map((fazenda) => (
                    <div key={fazenda.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{fazenda.nome}</h4>
                          <p className="text-sm text-muted-foreground">
                            {fazenda.municipio}/{fazenda.estado}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              fazenda.status === "Ativo"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {fazenda.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const url = `https://www.google.com/maps?q=${fazenda.latitude},${fazenda.longitude}`;
                              window.open(url, "_blank");
                            }}
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            Ver no Maps
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Coordenadas da Fazenda
                          </p>
                          <p className="text-sm font-mono">
                            {fazenda.latitude}, {fazenda.longitude}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Tamanho Total
                          </p>
                          <p className="text-sm font-semibold">
                            {fazenda.tamanho_total} ha
                          </p>
                        </div>
                      </div>

                      {fazenda.talhoes.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Talhões com Coordenadas ({fazenda.talhoes.length})
                          </p>
                          <div className="space-y-2">
                            {fazenda.talhoes.map((talhao) => (
                              <div
                                key={talhao.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="text-xs">
                                    {talhao.tipo}
                                  </Badge>
                                  <span className="text-sm font-mono">
                                    {talhao.latitude}, {talhao.longitude}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {talhao.area} ha
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const url = `https://www.google.com/maps?q=${talhao.latitude},${talhao.longitude}`;
                                    window.open(url, "_blank");
                                  }}
                                >
                                  <MapPin className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botões de ação */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = generateMapUrl();
                    if (url) {
                      window.open(url, "_blank");
                    }
                  }}
                >
                  <Map className="h-4 w-4 mr-2" />
                  Abrir no Google Maps
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const mapData = getMapData();
                    const csvContent = [
                      "Fazenda,Municipio,Estado,Latitude_Fazenda,Longitude_Fazenda,Tamanho_Total,Talhoes_Com_Coordenadas",
                      ...mapData.map(
                        (f) =>
                          `"${f.nome}","${f.municipio}","${f.estado}",${f.latitude},${f.longitude},${f.tamanho_total},${f.talhoes.length}`
                      ),
                    ].join("\n");

                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `coordenadas_fazendas_${
                      new Date().toISOString().split("T")[0]
                    }.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Coordenadas
                </Button>
              </div>
              <Button variant="outline" onClick={() => setShowMapDialog(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Fazenda */}
      <Dialog open={showFazendaDialog} onOpenChange={setShowFazendaDialog}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFazenda ? "Editar Fazenda" : "Nova Fazenda"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da fazenda e seus talhões
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Dados Gerais da Fazenda */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Dados Gerais da Fazenda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="faz-descricao">Descrição / Nome</Label>
                    <Input
                      id="faz-descricao"
                      value={fazendaForm.descricao}
                      onChange={(e) =>
                        setFazendaForm({
                          ...fazendaForm,
                          descricao: e.target.value,
                        })
                      }
                      placeholder="Ex: Fazenda São José"
                    />
                  </div>
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
                      placeholder="Ex: Uberlândia"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="faz-estado">UF</Label>
                    <Input
                      id="faz-estado"
                      value={fazendaForm.estado}
                      onChange={(e) =>
                        setFazendaForm({
                          ...fazendaForm,
                          estado: e.target.value,
                        })
                      }
                      placeholder="Ex: MG"
                    />
                  </div>
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
                      placeholder="Ex: -18.9186"
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
                      placeholder="Ex: -48.2772"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      placeholder="Ex: 1000.50"
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
              </CardContent>
            </Card>

            {/* Talhões da Fazenda */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Talhões da Fazenda</CardTitle>
                <CardDescription>
                  Adicione os talhões que compõem esta fazenda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulário para adicionar talhão */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Adicionar Talhão</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="Ex: 100.5"
                      />
                    </div>
                  </div>

                  {talhaoForm.tipo === "Talhão" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                          placeholder="Ex: -18.9200"
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
                          placeholder="Ex: -48.2800"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="tal-observacoes">Observações</Label>
                      <Input
                        id="tal-observacoes"
                        value={talhaoForm.observacoes}
                        onChange={(e) =>
                          setTalhaoForm({
                            ...talhaoForm,
                            observacoes: e.target.value,
                          })
                        }
                        placeholder="Ex: Talhão principal para soja"
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

                  <div className="flex gap-2 mt-4">
                    {editingTalhao ? (
                      <>
                        <Button onClick={handleUpdateTalhao}>
                          Atualizar Talhão
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingTalhao(null)}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button onClick={handleAddTalhao}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Talhão
                      </Button>
                    )}
                  </div>
                </div>

                {/* Lista de talhões */}
                <div>
                  <h4 className="font-medium mb-3">
                    Talhões Cadastrados ({fazendaForm.talhoes.length})
                  </h4>
                  {fazendaForm.talhoes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum talhão cadastrado
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {fazendaForm.talhoes.map((talhao) => (
                        <div
                          key={talhao.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{talhao.tipo}</Badge>
                            <span className="text-sm font-medium">
                              {talhao.area} ha
                            </span>
                            {talhao.tipo === "Talhão" && (
                              <span className="text-xs text-muted-foreground">
                                {talhao.latitude}, {talhao.longitude}
                              </span>
                            )}
                            {talhao.observacoes && (
                              <span className="text-xs text-muted-foreground">
                                {talhao.observacoes}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                talhao.status === "Ativo"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {talhao.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTalhao(talhao)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTalhao(talhao.id)}
                              className="hover:bg-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resumo de áreas */}
                <div className="flex md:flex-row flex-col md:justify-around gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total de Talhões
                    </p>
                    <p className="text-lg font-semibold">
                      {fazendaForm.talhoes.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Soma das Áreas (ha)
                    </p>
                    <p className="text-lg font-semibold">
                      {calcularAreaTotalTalhoes(fazendaForm.talhoes).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseFazendaDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFazenda}>
              {editingFazenda ? "Atualizar Fazenda" : "Salvar Fazenda"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciamentoFazendas;
