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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    status: "Ativo" as "Ativo" | "Inativo",
    observacoes: "",
  });

  // Estado para controle do tipo de área sendo adicionada
  const [isAddingCarreador, setIsAddingCarreador] = useState(false);

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

    // Preencher o formulário do carreador se existir
    const carreador = fazenda.talhoes.find((t) => t.tipo === "Carreador");
    if (carreador) {
      setEditingTalhao(carreador);
      setTalhaoForm({
        latitude: "",
        longitude: "",
        area: carreador.area,
        status: carreador.status,
        observacoes: carreador.observacoes || "",
      });
    } else {
      setEditingTalhao(null);
      setTalhaoForm({
        latitude: "",
        longitude: "",
        area: "",
        status: "Ativo",
        observacoes: "",
      });
    }

    // Reset isAddingCarreador para false quando abrir para edição
    setIsAddingCarreador(false);

    setShowFazendaDialog(true);
  };

  const handleDeleteFazenda = (id: string) => {
    setFazendas(fazendas.filter((faz) => faz.id !== id));
    toast({ title: "Fazenda removida com sucesso!" });
  };

  const handleCloseFazendaDialog = () => {
    setShowFazendaDialog(false);
    setEditingFazenda(null);
    setEditingTalhao(null);
    setIsAddingCarreador(false);
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
    setTalhaoForm({
      latitude: "",
      longitude: "",
      area: "",
      status: "Ativo" as "Ativo" | "Inativo",
      observacoes: "",
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
      area: talhaoForm.area,
      tipo: isAddingCarreador ? "Carreador" : "Talhão",
      status: "Ativo" as "Ativo" | "Inativo",
      observacoes: talhaoForm.observacoes,
      // Carreador não deve ter latitude e longitude
      latitude: isAddingCarreador ? undefined : talhaoForm.latitude,
      longitude: isAddingCarreador ? undefined : talhaoForm.longitude,
    };

    // Separar talhões e carreadores
    const talhoes = fazendaForm.talhoes.filter((t) => t.tipo === "Talhão");
    const carreador = fazendaForm.talhoes.find((t) => t.tipo === "Carreador");

    let novosTalhoes: Talhao[] = [];

    if (newTalhao.tipo === "Carreador") {
      // Carreador sempre vai ao final, substituindo o existente se houver
      novosTalhoes = [...talhoes, newTalhao];
    } else {
      // Adicionar talhão antes do carreador (se existir)
      if (carreador) {
        novosTalhoes = [...talhoes, newTalhao, carreador];
      } else {
        novosTalhoes = [...talhoes, newTalhao];
      }
    }

    setFazendaForm({
      ...fazendaForm,
      talhoes: novosTalhoes,
    });

    // Limpar formulário
    setTalhaoForm({
      latitude: "",
      longitude: "",
      area: "",
      status: "Ativo" as "Ativo" | "Inativo",
      observacoes: "",
    });

    const carreadorExistia = fazendaForm.talhoes.some(
      (t) => t.tipo === "Carreador"
    );
    toast({
      title:
        newTalhao.tipo === "Carreador"
          ? carreadorExistia
            ? "Carreador substituído!"
            : "Carreador adicionado!"
          : "Área adicionada com sucesso!",
    });
  };

  const handleEditTalhao = (talhao: Talhao) => {
    setEditingTalhao(talhao);
    setIsAddingCarreador(talhao.tipo === "Carreador");
    setTalhaoForm({
      latitude: talhao.latitude || "",
      longitude: talhao.longitude || "",
      area: talhao.area,
      status: talhao.status,
      observacoes: talhao.observacoes || "",
    });
  };

  const handleUpdateTalhao = () => {
    if (!editingTalhao) return;

    // Validar se está tentando mudar para carreador quando já existe um
    if (isAddingCarreador && editingTalhao.tipo !== "Carreador") {
      const temCarreador = fazendaForm.talhoes.some(
        (t) => t.tipo === "Carreador" && t.id !== editingTalhao.id
      );
      if (temCarreador) {
        toast({
          title: "Erro",
          description:
            "Já existe um carreador cadastrado. Apenas um carreador é permitido por fazenda.",
          variant: "destructive",
        });
        return;
      }
    }

    const talhaoAtualizado: Talhao = {
      ...editingTalhao,
      area: talhaoForm.area,
      tipo: isAddingCarreador ? "Carreador" : "Talhão",
      status: "Ativo" as "Ativo" | "Inativo",
      observacoes: talhaoForm.observacoes,
      // Carreador não deve ter latitude e longitude
      latitude: isAddingCarreador ? undefined : talhaoForm.latitude,
      longitude: isAddingCarreador ? undefined : talhaoForm.longitude,
    };

    // Remover o talhão que está sendo editado
    const outrosTalhoes = fazendaForm.talhoes.filter(
      (t) => t.id !== editingTalhao.id
    );

    // Separar talhões e carreadores
    const talhoes = outrosTalhoes.filter((t) => t.tipo === "Talhão");
    const carreador = outrosTalhoes.find((t) => t.tipo === "Carreador");

    let novosTalhoes: Talhao[] = [];

    if (talhaoAtualizado.tipo === "Carreador") {
      // Carreador sempre vai ao final
      novosTalhoes = [...talhoes, talhaoAtualizado];
    } else {
      // Adicionar talhão antes do carreador (se existir)
      if (carreador) {
        novosTalhoes = [...talhoes, talhaoAtualizado, carreador];
      } else {
        novosTalhoes = [...talhoes, talhaoAtualizado];
      }
    }

    setFazendaForm({
      ...fazendaForm,
      talhoes: novosTalhoes,
    });

    setEditingTalhao(null);
    setIsAddingCarreador(false);
    setTalhaoForm({
      latitude: "",
      longitude: "",
      area: "",
      status: "Ativo" as "Ativo" | "Inativo",
      observacoes: "",
    });

    toast({ title: "Área atualizada com sucesso!" });
  };

  const handleDeleteTalhao = (talhaoId: string) => {
    const talhao = fazendaForm.talhoes.find((t) => t.id === talhaoId);
    setFazendaForm({
      ...fazendaForm,
      talhoes: fazendaForm.talhoes.filter((tal) => tal.id !== talhaoId),
    });
    toast({
      title:
        talhao?.tipo === "Carreador"
          ? "Carreador removido com sucesso!"
          : "Área removida com sucesso!",
    });
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
        "Total de Áreas": fazenda.talhoes.length,
        "Área Total (ha)": calcularAreaTotalTalhoes(fazenda.talhoes).toFixed(2),
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
            Cadastro de Fazendas & Áreas
          </h1>
          <p className="text-muted-foreground">
            Gerencie fazendas e suas áreas em um único cadastro
          </p>
        </div>
        <div></div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fazendas Ativas
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Wheat className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fazendas.filter((f) => f.status === "Ativo").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fazendas em funcionamento
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fazendas Inativas
            </CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <Wheat className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fazendas.filter((f) => f.status === "Inativo").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fazendas desativadas
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
                            {fazenda.talhoes.some(
                              (t) => t.latitude && t.longitude
                            ) && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const talhoesComCoordenadas =
                                          fazenda.talhoes.filter(
                                            (t) =>
                                              t.latitude &&
                                              t.longitude &&
                                              t.tipo === "Talhão"
                                          );

                                        if (
                                          talhoesComCoordenadas.length === 0
                                        ) {
                                          toast({
                                            title: "Aviso",
                                            description:
                                              "Esta fazenda não possui áreas com coordenadas.",
                                            variant: "destructive",
                                          });
                                          return;
                                        }

                                        let url = "";
                                        if (
                                          talhoesComCoordenadas.length === 1
                                        ) {
                                          const talhao =
                                            talhoesComCoordenadas[0];
                                          url = `https://www.google.com/maps?q=${talhao.latitude},${talhao.longitude}`;
                                        } else {
                                          const coordinates =
                                            talhoesComCoordenadas
                                              .map(
                                                (t) =>
                                                  `${t.latitude},${t.longitude}`
                                              )
                                              .join("/");
                                          url = `https://www.google.com/maps/dir/${coordinates}`;
                                        }
                                        window.open(url, "_blank");
                                      }}
                                    >
                                      <MapPin className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ver Mapa da fazenda</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
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
                            Tamanho das Áreas
                          </p>
                          <p className="text-lg font-semibold">
                            {areaTalhoes.toFixed(2)} ha
                          </p>
                        </div>
                      </div>

                      {/* Resumo dos Talhões */}
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">
                          Áreas ({fazenda.talhoes.length})
                        </h4>
                        <div className="text-xs text-muted-foreground">
                          {
                            fazenda.talhoes.filter((t) => t.tipo === "Talhão")
                              .length
                          }{" "}
                          áreas •{" "}
                          {
                            fazenda.talhoes.filter(
                              (t) => t.tipo === "Carreador"
                            ).length
                          }{" "}
                          carreador
                        </div>
                      </div>

                      {/* Lista completa dos talhões (colapsível) */}
                      <Collapsible open={isExpanded}>
                        <CollapsibleContent>
                          {fazenda.talhoes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              Nenhuma área cadastrada
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {fazenda.talhoes.map((talhao) => (
                                <div
                                  key={talhao.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
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
                                  {talhao.tipo === "Talhão" &&
                                    talhao.latitude &&
                                    talhao.longitude && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                const url = `https://www.google.com/maps?q=${talhao.latitude},${talhao.longitude}`;
                                                window.open(url, "_blank");
                                              }}
                                            >
                                              <MapPin className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Ver Mapa da Área</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
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

      {/* Dialog Fazenda */}
      <Dialog open={showFazendaDialog} onOpenChange={setShowFazendaDialog}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFazenda ? "Editar Fazenda" : "Nova Fazenda"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da fazenda e suas áreas
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
                <CardTitle className="text-lg">Áreas da Fazenda</CardTitle>
                <CardDescription>
                  Adicione as áreas que compõem esta fazenda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulário para adicionar talhão */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Adicionar Área</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div className="mt-4">
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

                  <div className="flex gap-2 mt-4">
                    {editingTalhao && editingTalhao.tipo === "Talhão" ? (
                      <>
                        <Button onClick={handleUpdateTalhao}>
                          Atualizar Talhão
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingTalhao(null);
                            setIsAddingCarreador(false);
                            setTalhaoForm({
                              latitude: "",
                              longitude: "",
                              area: "",
                              status: "Ativo",
                              observacoes: "",
                            });
                          }}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsAddingCarreador(false);
                          handleAddTalhao();
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Talhão
                      </Button>
                    )}
                  </div>
                </div>

                {/* Lista de talhões */}
                {fazendaForm.talhoes.filter((t) => t.tipo === "Talhão").length >
                  0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Talhões Cadastrados</h4>
                    <div className="space-y-2">
                      {fazendaForm.talhoes
                        .filter((t) => t.tipo === "Talhão")
                        .map((talhao) => (
                          <div
                            key={talhao.id}
                            className="flex items-center justify-between p-3 bg-white border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                Área: {talhao.area} ha
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {talhao.latitude && talhao.longitude && (
                                  <span>
                                    Lat: {talhao.latitude}, Long:{" "}
                                    {talhao.longitude}
                                  </span>
                                )}
                                {talhao.observacoes && (
                                  <span className="ml-2">
                                    • {talhao.observacoes}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
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
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Carreador da Fazenda */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Carreador
                </CardTitle>
                <CardDescription>
                  Adicione o carreador da fazenda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Formulário para carreador */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Carreador</h4>
                  <div>
                    <Label htmlFor="carr-area">Área (ha)</Label>
                    <Input
                      id="carr-area"
                      type="number"
                      step="0.01"
                      value={talhaoForm.area}
                      onChange={(e) => {
                        const carreadorExistente = fazendaForm.talhoes.find(
                          (t) => t.tipo === "Carreador"
                        );
                        const newArea = e.target.value;

                        setTalhaoForm({
                          ...talhaoForm,
                          area: newArea,
                        });

                        // Atualizar ou adicionar carreador imediatamente
                        if (carreadorExistente) {
                          // Atualizar carreador existente
                          const outrosTalhoes = fazendaForm.talhoes.filter(
                            (t) => t.tipo === "Talhão"
                          );

                          if (newArea && parseFloat(newArea) > 0) {
                            const carreadorAtualizado: Talhao = {
                              ...carreadorExistente,
                              area: newArea,
                            };

                            setFazendaForm({
                              ...fazendaForm,
                              talhoes: [...outrosTalhoes, carreadorAtualizado],
                            });
                          } else {
                            // Se o campo estiver vazio, remover o carreador
                            setFazendaForm({
                              ...fazendaForm,
                              talhoes: outrosTalhoes,
                            });
                          }
                        } else if (newArea && parseFloat(newArea) > 0) {
                          // Adicionar novo carreador
                          const novoCarreador: Talhao = {
                            id: Date.now().toString(),
                            area: newArea,
                            tipo: "Carreador",
                            status: "Ativo",
                          };

                          setFazendaForm({
                            ...fazendaForm,
                            talhoes: [...fazendaForm.talhoes, novoCarreador],
                          });
                        }
                      }}
                      placeholder="Ex: 100.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo de áreas */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex md:flex-row flex-col md:justify-around gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total de Áreas
                    </p>
                    <p className="text-lg font-semibold">
                      {
                        fazendaForm.talhoes.filter((t) => t.tipo === "Talhão")
                          .length
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Carreador
                    </p>
                    <p className="text-lg font-semibold">
                      {fazendaForm.talhoes.find((t) => t.tipo === "Carreador")
                        ? "✓ Cadastrado"
                        : "Não cadastrado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Área Total (ha)
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
