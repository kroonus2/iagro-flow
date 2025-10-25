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
import { Textarea } from "@/components/ui/textarea";
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
  Building2,
  Truck,
  User,
  Settings,
  DollarSign,
  Users,
  Activity,
  Eye,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Componente para cabeçalhos ordenáveis
interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  children,
  sortKey,
  onSort,
  sortConfig,
  className = "",
}) => {
  const isActive = sortConfig?.key === sortKey;
  const direction = isActive ? sortConfig.direction : null;

  return (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 select-none ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {children}
        <div className="flex flex-col">
          <ChevronUp
            className={`h-3 w-3 ${
              isActive && direction === "asc"
                ? "text-primary"
                : "text-muted-foreground/50"
            }`}
          />
          <ChevronDown
            className={`h-3 w-3 -mt-1 ${
              isActive && direction === "desc"
                ? "text-primary"
                : "text-muted-foreground/50"
            }`}
          />
        </div>
      </div>
    </TableHead>
  );
};

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
interface Localizacao {
  id: string;
  codigo: string;
  descricao: string;
  tipo_estoque: string;
  capacidade: string;
  status: "Ativo" | "Inativo";
}

interface Caminhao {
  id: string;
  placa: string;
  patrimonio: string;
  volume: string;
  modelo: string;
  marca: string;
  ano: string;
  observacoes?: string;
  status: "Ativo" | "Inativo";
}

interface Motorista {
  id: string;
  codigo: string;
  matricula: string;
  nome: string;
  contato: string;
  cnh?: string;
  dataExpiracaoCnh?: string;
  status: "Ativo" | "Inativo";
}

interface Operacao {
  id: string;
  descricao: string;
  status: "Ativo" | "Inativo";
}

interface CentroCusto {
  id: string;
  descricao: string;
  status: "Ativo" | "Inativo";
}

interface Responsavel {
  id: string;
  nome: string;
  status: "Ativo" | "Inativo";
}

const CadastrosAuxiliares = () => {
  const [activeTab, setActiveTab] = useState("localizacao");

  // Estados de filtros por aba
  const [searchTerms, setSearchTerms] = useState({
    localizacao: "",
    caminhao: "",
    motorista: "",
    operacao: "",
    centroCusto: "",
    responsavel: "",
  });
  const [statusFilters, setStatusFilters] = useState({
    localizacao: "todos",
    caminhao: "todos",
    motorista: "todos",
    operacao: "todos",
    centroCusto: "todos",
    responsavel: "todos",
  });
  const [filteredData, setFilteredData] = useState({
    localizacoes: [] as Localizacao[],
    caminhoes: [] as Caminhao[],
    motoristas: [] as Motorista[],
    operacoes: [] as Operacao[],
    centrosCusto: [] as CentroCusto[],
    responsaveis: [] as Responsavel[],
  });

  // Estados para ordenação
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Função para ordenar dados
  const sortData = (data: any[], key: string, direction: "asc" | "desc") => {
    return [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Tratamento especial para diferentes tipos de dados
      if (key === "volume" || key === "ano") {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (key === "dataExpiracaoCnh") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      } else {
        aValue = (aValue || "").toString().toLowerCase();
        bValue = (bValue || "").toString().toLowerCase();
      }

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

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

  // Função para lidar com clique na ordenação
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Estados para Localização
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([
    {
      id: "1",
      codigo: "ARM-001",
      descricao: "Armazém Principal - Área A",
      tipo_estoque: "PRIMÁRIO",
      capacidade: "50 IBCs",
      status: "Ativo",
    },
    {
      id: "2",
      codigo: "ARM-002",
      descricao: "Armazém Principal - Área B",
      tipo_estoque: "SECUNDÁRIO",
      capacidade: "30 IBCs",
      status: "Ativo",
    },
    {
      id: "3",
      codigo: "EST-001",
      descricao: "Estoque Externo - Pátio 1",
      tipo_estoque: "PRIMÁRIO",
      capacidade: "100 IBCs",
      status: "Inativo",
    },
    {
      id: "4",
      codigo: "SIL-001",
      descricao: "Silos - Área Norte",
      tipo_estoque: "TERCIÁRIO",
      capacidade: "25 Silos",
      status: "Ativo",
    },
    {
      id: "5",
      codigo: "DEP-001",
      descricao: "Depósito Central",
      tipo_estoque: "PRIMÁRIO",
      capacidade: "75 IBCs",
      status: "Ativo",
    },
  ]);
  const [showLocalizacaoDialog, setShowLocalizacaoDialog] = useState(false);
  const [editingLocalizacao, setEditingLocalizacao] =
    useState<Localizacao | null>(null);
  const [localizacaoForm, setLocalizacaoForm] = useState({
    codigo: "",
    descricao: "",
    tipo_estoque: "",
    capacidade: "",
    status: "Ativo",
  });

  // Estados para Caminhão
  const [caminhoes, setCaminhoes] = useState<Caminhao[]>([
    {
      id: "1",
      placa: "GNN-1010",
      patrimonio: "999999",
      volume: "13000",
      modelo: "F32",
      marca: "Volvo",
      ano: "2023",
      observacoes:
        "Caminhão em excelente estado, recentemente revisado. Equipado com sistema de rastreamento GPS e câmeras de segurança.",
      status: "Ativo",
    },
    {
      id: "2",
      placa: "ABC-1234",
      patrimonio: "888888",
      volume: "15000",
      modelo: "FH16",
      marca: "Volvo",
      ano: "2022",
      observacoes:
        "Veículo principal da frota. Requer manutenção preventiva a cada 10.000 km. Motor em perfeito funcionamento.",
      status: "Ativo",
    },
    {
      id: "3",
      placa: "DEF-5678",
      patrimonio: "777777",
      volume: "12000",
      modelo: "Actros",
      marca: "Mercedes-Benz",
      ano: "2024",
      observacoes:
        "Caminhão temporariamente fora de operação devido a problemas no sistema de freios. Aguardando peças de reposição.",
      status: "Inativo",
    },
    {
      id: "4",
      placa: "GHI-9012",
      patrimonio: "666666",
      volume: "14000",
      modelo: "Scania R",
      marca: "Scania",
      ano: "2023",
      observacoes:
        "Veículo novo, ainda em período de garantia. Equipado com sistema de telemetria avançado para monitoramento de performance.",
      status: "Ativo",
    },
    {
      id: "5",
      placa: "JKL-3456",
      patrimonio: "555555",
      volume: "11000",
      modelo: "Constellation",
      marca: "Volkswagen",
      ano: "2021",
      observacoes:
        "Caminhão confiável, utilizado principalmente para rotas urbanas. Baixo consumo de combustível e manutenção simples.",
      status: "Ativo",
    },
  ]);
  const [showCaminhaoDialog, setShowCaminhaoDialog] = useState(false);
  const [editingCaminhao, setEditingCaminhao] = useState<Caminhao | null>(null);
  const [showCaminhaoDetalhes, setShowCaminhaoDetalhes] = useState(false);
  const [caminhaoDetalhes, setCaminhaoDetalhes] = useState<Caminhao | null>(
    null
  );
  const [caminhaoForm, setCaminhaoForm] = useState({
    placa: "",
    patrimonio: "",
    volume: "",
    modelo: "",
    marca: "",
    ano: "",
    observacoes: "",
    status: "Ativo",
  });

  // Estados para Motorista
  const [motoristas, setMotoristas] = useState<Motorista[]>([
    {
      id: "1",
      codigo: "1",
      matricula: "9999999",
      nome: "Ze",
      contato: "3499999999",
      cnh: "12345678901",
      dataExpiracaoCnh: "2025-12-31",
      status: "Ativo",
    },
    {
      id: "2",
      codigo: "2",
      matricula: "8888888",
      nome: "João Silva",
      contato: "3498888888",
      cnh: "98765432109",
      dataExpiracaoCnh: "2024-06-15",
      status: "Ativo",
    },
    {
      id: "3",
      codigo: "3",
      matricula: "7777777",
      nome: "Maria Santos",
      contato: "3497777777",
      cnh: "11122233344",
      dataExpiracaoCnh: "2023-11-20",
      status: "Inativo",
    },
    {
      id: "4",
      codigo: "4",
      matricula: "6666666",
      nome: "Carlos Oliveira",
      contato: "3496666666",
      cnh: "55566677788",
      dataExpiracaoCnh: "2026-03-10",
      status: "Ativo",
    },
    {
      id: "5",
      codigo: "5",
      matricula: "5555555",
      nome: "Ana Costa",
      contato: "3495555555",
      cnh: "99988877766",
      dataExpiracaoCnh: "2025-08-25",
      status: "Ativo",
    },
  ]);
  const [showMotoristaDialog, setShowMotoristaDialog] = useState(false);
  const [editingMotorista, setEditingMotorista] = useState<Motorista | null>(
    null
  );
  const [showMotoristaDetalhes, setShowMotoristaDetalhes] = useState(false);
  const [motoristaDetalhes, setMotoristaDetalhes] = useState<Motorista | null>(
    null
  );
  const [motoristaForm, setMotoristaForm] = useState({
    codigo: "",
    matricula: "",
    nome: "",
    contato: "",
    cnh: "",
    dataExpiracaoCnh: "",
    status: "Ativo",
  });

  // Estados para Operação
  const [operacoes, setOperacoes] = useState<Operacao[]>([
    {
      id: "1",
      descricao: "COMBATE A BROCA AVIÃO",
      status: "Ativo",
    },
    {
      id: "2",
      descricao: "APLICAÇÃO HERBICIDA ÁREA A",
      status: "Ativo",
    },
    {
      id: "3",
      descricao: "PULVERIZAÇÃO FUNGICIDA",
      status: "Inativo",
    },
    {
      id: "4",
      descricao: "CONTROLE DE PRAGAS SOLO",
      status: "Ativo",
    },
    {
      id: "5",
      descricao: "APLICAÇÃO FERTILIZANTE FOLIAR",
      status: "Ativo",
    },
  ]);
  const [showOperacaoDialog, setShowOperacaoDialog] = useState(false);
  const [editingOperacao, setEditingOperacao] = useState<Operacao | null>(null);
  const [operacaoForm, setOperacaoForm] = useState({
    descricao: "",
    status: "Ativo",
  });

  // Estados para Centro de Custo
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([
    {
      id: "1",
      descricao: "Combate Prag Doe C Soca",
      status: "Ativo",
    },
    {
      id: "2",
      descricao: "Aplicação Defensivos Área Norte",
      status: "Ativo",
    },
    {
      id: "3",
      descricao: "Manutenção Preventiva Equipamentos",
      status: "Inativo",
    },
    {
      id: "4",
      descricao: "Pulverização Área Sul",
      status: "Ativo",
    },
    {
      id: "5",
      descricao: "Controle Fitossanitário",
      status: "Ativo",
    },
  ]);
  const [showCentroCustoDialog, setShowCentroCustoDialog] = useState(false);
  const [editingCentroCusto, setEditingCentroCusto] =
    useState<CentroCusto | null>(null);
  const [centroCustoForm, setCentroCustoForm] = useState({
    descricao: "",
    status: "Ativo",
  });

  // Estados para importação CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvPreview, setCsvPreview] = useState(false);
  const [dialogImportAberto, setDialogImportAberto] = useState(false);
  const [tipoImportacao, setTipoImportacao] = useState("");

  // Estados para Responsável
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([
    {
      id: "1",
      nome: "LUCIANO APARECIDO GRAÇAS",
      status: "Ativo",
    },
    {
      id: "2",
      nome: "FERNANDO HENRIQUE SILVA",
      status: "Ativo",
    },
    {
      id: "3",
      nome: "ROBERTO CARLOS SANTOS",
      status: "Inativo",
    },
    {
      id: "4",
      nome: "PATRICIA MARIA OLIVEIRA",
      status: "Ativo",
    },
    {
      id: "5",
      nome: "ANDERSON LUIZ COSTA",
      status: "Ativo",
    },
  ]);
  const [showResponsavelDialog, setShowResponsavelDialog] = useState(false);
  const [editingResponsavel, setEditingResponsavel] =
    useState<Responsavel | null>(null);
  const [responsavelForm, setResponsavelForm] = useState({
    nome: "",
    status: "Ativo",
  });

  // Efeito para aplicar filtros e ordenação
  useEffect(() => {
    let localizacoesFiltered = filterData(
      localizacoes,
      searchTerms.localizacao,
      ["codigo", "descricao", "tipo_estoque"],
      statusFilters.localizacao
    );
    let caminhoesFiltered = filterData(
      caminhoes,
      searchTerms.caminhao,
      ["placa", "patrimonio", "modelo", "marca"],
      statusFilters.caminhao
    );
    let motoristasFiltered = filterData(
      motoristas,
      searchTerms.motorista,
      ["codigo", "matricula", "nome", "contato"],
      statusFilters.motorista
    );
    let operacoesFiltered = filterData(
      operacoes,
      searchTerms.operacao,
      ["descricao"],
      statusFilters.operacao
    );
    let centrosCustoFiltered = filterData(
      centrosCusto,
      searchTerms.centroCusto,
      ["descricao"],
      statusFilters.centroCusto
    );
    let responsaveisFiltered = filterData(
      responsaveis,
      searchTerms.responsavel,
      ["nome"],
      statusFilters.responsavel
    );

    // Aplicar ordenação se configurada
    if (sortConfig) {
      if (activeTab === "localizacao") {
        localizacoesFiltered = sortData(
          localizacoesFiltered,
          sortConfig.key,
          sortConfig.direction
        );
      } else if (activeTab === "caminhao") {
        caminhoesFiltered = sortData(
          caminhoesFiltered,
          sortConfig.key,
          sortConfig.direction
        );
      } else if (activeTab === "motorista") {
        motoristasFiltered = sortData(
          motoristasFiltered,
          sortConfig.key,
          sortConfig.direction
        );
      } else if (activeTab === "operacoes") {
        operacoesFiltered = sortData(
          operacoesFiltered,
          sortConfig.key,
          sortConfig.direction
        );
      } else if (activeTab === "centro-custo") {
        centrosCustoFiltered = sortData(
          centrosCustoFiltered,
          sortConfig.key,
          sortConfig.direction
        );
      } else if (activeTab === "responsavel") {
        responsaveisFiltered = sortData(
          responsaveisFiltered,
          sortConfig.key,
          sortConfig.direction
        );
      }
    }

    setFilteredData({
      localizacoes: localizacoesFiltered,
      caminhoes: caminhoesFiltered,
      motoristas: motoristasFiltered,
      operacoes: operacoesFiltered,
      centrosCusto: centrosCustoFiltered,
      responsaveis: responsaveisFiltered,
    });
  }, [
    searchTerms,
    statusFilters,
    localizacoes,
    caminhoes,
    motoristas,
    operacoes,
    centrosCusto,
    responsaveis,
    sortConfig,
    activeTab,
  ]);

  // Funções de Localização
  const handleSaveLocalizacao = () => {
    if (editingLocalizacao) {
      setLocalizacoes(
        localizacoes.map((loc) =>
          loc.id === editingLocalizacao.id
            ? {
                ...editingLocalizacao,
                ...localizacaoForm,
                status: localizacaoForm.status as "Ativo" | "Inativo",
              }
            : loc
        )
      );
      toast({ title: "Localização atualizada com sucesso!" });
    } else {
      const newLocalizacao: Localizacao = {
        id: Date.now().toString(),
        ...localizacaoForm,
        status: localizacaoForm.status as "Ativo" | "Inativo",
      };
      setLocalizacoes([...localizacoes, newLocalizacao]);
      toast({ title: "Localização cadastrada com sucesso!" });
    }
    handleCloseLocalizacaoDialog();
  };

  const handleEditLocalizacao = (localizacao: Localizacao) => {
    setEditingLocalizacao(localizacao);
    setLocalizacaoForm({
      codigo: localizacao.codigo,
      descricao: localizacao.descricao,
      tipo_estoque: localizacao.tipo_estoque,
      capacidade: localizacao.capacidade,
      status: localizacao.status,
    });
    setShowLocalizacaoDialog(true);
  };

  const handleDeleteLocalizacao = (id: string) => {
    setLocalizacoes(localizacoes.filter((loc) => loc.id !== id));
    toast({ title: "Localização removida com sucesso!" });
  };

  const handleCloseLocalizacaoDialog = () => {
    setShowLocalizacaoDialog(false);
    setEditingLocalizacao(null);
    setLocalizacaoForm({
      codigo: "",
      descricao: "",
      tipo_estoque: "",
      capacidade: "",
      status: "Ativo",
    });
  };

  // Funções de Caminhão
  const handleSaveCaminhao = () => {
    if (editingCaminhao) {
      setCaminhoes(
        caminhoes.map((cam) =>
          cam.id === editingCaminhao.id
            ? {
                ...editingCaminhao,
                ...caminhaoForm,
                status: caminhaoForm.status as "Ativo" | "Inativo",
              }
            : cam
        )
      );
      toast({ title: "Caminhão atualizado com sucesso!" });
    } else {
      const newCaminhao: Caminhao = {
        id: Date.now().toString(),
        ...caminhaoForm,
        status: caminhaoForm.status as "Ativo" | "Inativo",
      };
      setCaminhoes([...caminhoes, newCaminhao]);
      toast({ title: "Caminhão cadastrado com sucesso!" });
    }
    handleCloseCaminhaoDialog();
  };

  const handleEditCaminhao = (caminhao: Caminhao) => {
    setEditingCaminhao(caminhao);
    setCaminhaoForm({
      placa: caminhao.placa,
      patrimonio: caminhao.patrimonio,
      volume: caminhao.volume,
      modelo: caminhao.modelo,
      marca: caminhao.marca,
      ano: caminhao.ano,
      observacoes: caminhao.observacoes || "",
      status: caminhao.status,
    });
    setShowCaminhaoDialog(true);
  };

  const handleDeleteCaminhao = (id: string) => {
    setCaminhoes(caminhoes.filter((cam) => cam.id !== id));
    toast({ title: "Caminhão removido com sucesso!" });
  };

  const handleCloseCaminhaoDialog = () => {
    setShowCaminhaoDialog(false);
    setEditingCaminhao(null);
    setCaminhaoForm({
      placa: "",
      patrimonio: "",
      volume: "",
      modelo: "",
      marca: "",
      ano: "",
      observacoes: "",
      status: "Ativo",
    });
  };

  const handleViewCaminhaoDetalhes = (caminhao: Caminhao) => {
    setCaminhaoDetalhes(caminhao);
    setShowCaminhaoDetalhes(true);
  };

  // Funções de Motorista
  const handleSaveMotorista = () => {
    if (editingMotorista) {
      setMotoristas(
        motoristas.map((mot) =>
          mot.id === editingMotorista.id
            ? {
                ...editingMotorista,
                ...motoristaForm,
                status: motoristaForm.status as "Ativo" | "Inativo",
              }
            : mot
        )
      );
      toast({ title: "Motorista atualizado com sucesso!" });
    } else {
      const newMotorista: Motorista = {
        id: Date.now().toString(),
        ...motoristaForm,
        status: motoristaForm.status as "Ativo" | "Inativo",
      };
      setMotoristas([...motoristas, newMotorista]);
      toast({ title: "Motorista cadastrado com sucesso!" });
    }
    handleCloseMotoristaDialog();
  };

  const handleEditMotorista = (motorista: Motorista) => {
    setEditingMotorista(motorista);
    setMotoristaForm({
      codigo: motorista.codigo,
      matricula: motorista.matricula,
      nome: motorista.nome,
      contato: motorista.contato,
      cnh: motorista.cnh || "",
      dataExpiracaoCnh: motorista.dataExpiracaoCnh || "",
      status: motorista.status,
    });
    setShowMotoristaDialog(true);
  };

  const handleDeleteMotorista = (id: string) => {
    setMotoristas(motoristas.filter((mot) => mot.id !== id));
    toast({ title: "Motorista removido com sucesso!" });
  };

  const handleCloseMotoristaDialog = () => {
    setShowMotoristaDialog(false);
    setEditingMotorista(null);
    setMotoristaForm({
      codigo: "",
      matricula: "",
      nome: "",
      contato: "",
      cnh: "",
      dataExpiracaoCnh: "",
      status: "Ativo",
    });
  };

  const handleViewMotoristaDetalhes = (motorista: Motorista) => {
    setMotoristaDetalhes(motorista);
    setShowMotoristaDetalhes(true);
  };

  // Função para verificar se a CNH está expirada
  const isCnhExpirada = (dataExpiracao: string) => {
    const hoje = new Date();
    const dataExpiracaoDate = new Date(dataExpiracao);
    return dataExpiracaoDate < hoje;
  };

  // Função para verificar se a CNH expira em breve (30 dias)
  const isCnhExpirandoEmBreve = (dataExpiracao: string) => {
    const hoje = new Date();
    const dataExpiracaoDate = new Date(dataExpiracao);
    const diferencaDias = Math.ceil(
      (dataExpiracaoDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diferencaDias <= 30 && diferencaDias > 0;
  };

  // Funções de Operação
  const handleSaveOperacao = () => {
    if (editingOperacao) {
      setOperacoes(
        operacoes.map((op) =>
          op.id === editingOperacao.id
            ? {
                ...editingOperacao,
                ...operacaoForm,
                status: operacaoForm.status as "Ativo" | "Inativo",
              }
            : op
        )
      );
      toast({ title: "Operação atualizada com sucesso!" });
    } else {
      const newOperacao: Operacao = {
        id: Date.now().toString(),
        ...operacaoForm,
        status: operacaoForm.status as "Ativo" | "Inativo",
      };
      setOperacoes([...operacoes, newOperacao]);
      toast({ title: "Operação cadastrada com sucesso!" });
    }
    handleCloseOperacaoDialog();
  };

  const handleEditOperacao = (operacao: Operacao) => {
    setEditingOperacao(operacao);
    setOperacaoForm({
      descricao: operacao.descricao,
      status: operacao.status,
    });
    setShowOperacaoDialog(true);
  };

  const handleDeleteOperacao = (id: string) => {
    setOperacoes(operacoes.filter((op) => op.id !== id));
    toast({ title: "Operação removida com sucesso!" });
  };

  const handleCloseOperacaoDialog = () => {
    setShowOperacaoDialog(false);
    setEditingOperacao(null);
    setOperacaoForm({
      descricao: "",
      status: "Ativo",
    });
  };

  // Funções de Centro de Custo
  const handleSaveCentroCusto = () => {
    if (editingCentroCusto) {
      setCentrosCusto(
        centrosCusto.map((cc) =>
          cc.id === editingCentroCusto.id
            ? {
                ...editingCentroCusto,
                ...centroCustoForm,
                status: centroCustoForm.status as "Ativo" | "Inativo",
              }
            : cc
        )
      );
      toast({ title: "Centro de Custo atualizado com sucesso!" });
    } else {
      const newCentroCusto: CentroCusto = {
        id: Date.now().toString(),
        ...centroCustoForm,
        status: centroCustoForm.status as "Ativo" | "Inativo",
      };
      setCentrosCusto([...centrosCusto, newCentroCusto]);
      toast({ title: "Centro de Custo cadastrado com sucesso!" });
    }
    handleCloseCentroCustoDialog();
  };

  const handleEditCentroCusto = (centroCusto: CentroCusto) => {
    setEditingCentroCusto(centroCusto);
    setCentroCustoForm({
      descricao: centroCusto.descricao,
      status: centroCusto.status,
    });
    setShowCentroCustoDialog(true);
  };

  const handleDeleteCentroCusto = (id: string) => {
    setCentrosCusto(centrosCusto.filter((cc) => cc.id !== id));
    toast({ title: "Centro de Custo removido com sucesso!" });
  };

  const handleCloseCentroCustoDialog = () => {
    setShowCentroCustoDialog(false);
    setEditingCentroCusto(null);
    setCentroCustoForm({
      descricao: "",
      status: "Ativo",
    });
  };

  // Funções de Responsável
  const handleSaveResponsavel = () => {
    if (editingResponsavel) {
      setResponsaveis(
        responsaveis.map((resp) =>
          resp.id === editingResponsavel.id
            ? {
                ...editingResponsavel,
                ...responsavelForm,
                status: responsavelForm.status as "Ativo" | "Inativo",
              }
            : resp
        )
      );
      toast({ title: "Responsável atualizado com sucesso!" });
    } else {
      const newResponsavel: Responsavel = {
        id: Date.now().toString(),
        ...responsavelForm,
        status: responsavelForm.status as "Ativo" | "Inativo",
      };
      setResponsaveis([...responsaveis, newResponsavel]);
      toast({ title: "Responsável cadastrado com sucesso!" });
    }
    handleCloseResponsavelDialog();
  };

  const handleEditResponsavel = (responsavel: Responsavel) => {
    setEditingResponsavel(responsavel);
    setResponsavelForm({
      nome: responsavel.nome,
      status: responsavel.status,
    });
    setShowResponsavelDialog(true);
  };

  const handleDeleteResponsavel = (id: string) => {
    setResponsaveis(responsaveis.filter((resp) => resp.id !== id));
    toast({ title: "Responsável removido com sucesso!" });
  };

  const handleCloseResponsavelDialog = () => {
    setShowResponsavelDialog(false);
    setEditingResponsavel(null);
    setResponsavelForm({
      nome: "",
      status: "Ativo",
    });
  };

  // Funções de Importação CSV
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
          .filter((row) => Object.values(row).some((val) => val)); // Remove linhas vazias

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
    if (tipoImportacao === "localizacao") {
      const novosIds = csvData.map(
        (_, index) =>
          Math.max(...localizacoes.map((l) => parseInt(l.id))) + index + 1
      );
      const novosItens: Localizacao[] = csvData.map((item, index) => ({
        id: novosIds[index].toString(),
        codigo: item.codigo || "",
        descricao: item.descricao || "",
        tipo_estoque: item.tipo_estoque || "",
        capacidade: item.capacidade || "",
        status: "Ativo" as "Ativo" | "Inativo",
      }));
      setLocalizacoes((prev) => [...prev, ...novosItens]);
    } else if (tipoImportacao === "caminhao") {
      const novosIds = csvData.map(
        (_, index) =>
          Math.max(...caminhoes.map((c) => parseInt(c.id))) + index + 1
      );
      const novosItens: Caminhao[] = csvData.map((item, index) => ({
        id: novosIds[index].toString(),
        placa: item.placa || "",
        patrimonio: item.patrimonio || "",
        volume: item.volume || "",
        modelo: item.modelo || "",
        marca: item.marca || "",
        ano: item.ano || "",
        observacoes: item.observacoes || "",
        status: "Ativo" as "Ativo" | "Inativo",
      }));
      setCaminhoes((prev) => [...prev, ...novosItens]);
    } else if (tipoImportacao === "motorista") {
      const novosIds = csvData.map(
        (_, index) =>
          Math.max(...motoristas.map((m) => parseInt(m.id))) + index + 1
      );
      const novosItens: Motorista[] = csvData.map((item, index) => ({
        id: novosIds[index].toString(),
        codigo: item.codigo || "",
        matricula: item.matricula || "",
        nome: item.nome || "",
        contato: item.contato || "",
        cnh: item.cnh || "",
        dataExpiracaoCnh: item.dataExpiracaoCnh || "",
        status: "Ativo" as "Ativo" | "Inativo",
      }));
      setMotoristas((prev) => [...prev, ...novosItens]);
    } else if (tipoImportacao === "operacao") {
      const novosIds = csvData.map(
        (_, index) =>
          Math.max(...operacoes.map((o) => parseInt(o.id))) + index + 1
      );
      const novosItens: Operacao[] = csvData.map((item, index) => ({
        id: novosIds[index].toString(),
        descricao: item.descricao || "",
        status: "Ativo" as "Ativo" | "Inativo",
      }));
      setOperacoes((prev) => [...prev, ...novosItens]);
    } else if (tipoImportacao === "centroCusto") {
      const novosIds = csvData.map(
        (_, index) =>
          Math.max(...centrosCusto.map((cc) => parseInt(cc.id))) + index + 1
      );
      const novosItens: CentroCusto[] = csvData.map((item, index) => ({
        id: novosIds[index].toString(),
        descricao: item.descricao || "",
        status: "Ativo" as "Ativo" | "Inativo",
      }));
      setCentrosCusto((prev) => [...prev, ...novosItens]);
    } else if (tipoImportacao === "responsavel") {
      const novosIds = csvData.map(
        (_, index) =>
          Math.max(...responsaveis.map((r) => parseInt(r.id))) + index + 1
      );
      const novosItens: Responsavel[] = csvData.map((item, index) => ({
        id: novosIds[index].toString(),
        nome: item.nome || "",
        status: "Ativo" as "Ativo" | "Inativo",
      }));
      setResponsaveis((prev) => [...prev, ...novosItens]);
    }

    toast({
      title: "Importação concluída!",
      description: `${csvData.length} ${tipoImportacao}(s) importado(s) com sucesso.`,
      variant: "default",
    });

    setCsvFile(null);
    setCsvData([]);
    setCsvPreview(false);
    setDialogImportAberto(false);
    setTipoImportacao("");
  };

  const downloadTemplate = (tipo: string) => {
    let csvContent = "";
    let filename = "";

    switch (tipo) {
      case "localizacao":
        csvContent =
          "codigo,descricao,tipo_estoque,capacidade\n" +
          "ARM-001,Armazém Principal - Área A,PRIMÁRIO,50 IBCs";
        filename = "template_localizacoes.csv";
        break;
      case "caminhao":
        csvContent =
          "placa,patrimonio,volume,modelo,marca,ano,observacoes\n" +
          "ABC-1234,999999,13000,F32,Volvo,2023,Caminhão em excelente estado";
        filename = "template_caminhoes.csv";
        break;
      case "motorista":
        csvContent =
          "codigo,matricula,nome,contato,cnh,dataExpiracaoCnh\n" +
          "1,9999999,João Silva,3499999999,12345678901,2025-12-31";
        filename = "template_motoristas.csv";
        break;
      case "operacao":
        csvContent = "descricao\n" + "COMBATE A BROCA AVIÃO";
        filename = "template_operacoes.csv";
        break;
      case "centroCusto":
        csvContent = "descricao\n" + "Combate Prag Doe C Soca";
        filename = "template_centros_custo.csv";
        break;
      case "responsavel":
        csvContent = "nome\n" + "LUCIANO APARECIDO GRAÇAS";
        filename = "template_responsaveis.csv";
        break;
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportCSV = (tipo: string) => {
    setTipoImportacao(tipo);
    setDialogImportAberto(true);
  };

  // Funções de Exportação
  const handleExport = (tipo: string, formato: "csv" | "pdf") => {
    toast({
      title: `Exportando ${tipo} em formato ${formato.toUpperCase()}...`,
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Cadastros Auxiliares
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie os cadastros auxiliares do sistema
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Localizações</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {localizacoes.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.localizacoes.length} filtradas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caminhões</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <Truck className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {caminhoes.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.caminhoes.length} filtrados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Motoristas</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {motoristas.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.motoristas.length} filtrados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operações</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Settings className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {operacoes.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.operacoes.length} filtradas
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Centros de Custo
            </CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {centrosCusto.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.centrosCusto.length} filtrados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responsáveis</CardTitle>
            <div className="p-2 bg-rose-100 rounded-lg">
              <Users className="h-5 w-5 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600">
              {responsaveis.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredData.responsaveis.length} filtrados
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-6 min-w-[740px]">
            <TabsTrigger value="localizacao">Localização</TabsTrigger>
            <TabsTrigger value="caminhao">Caminhões</TabsTrigger>
            <TabsTrigger value="motorista">Motoristas</TabsTrigger>
            <TabsTrigger value="operacoes">Operações</TabsTrigger>
            <TabsTrigger value="centro-custo">Centros de Custo</TabsTrigger>
            <TabsTrigger value="responsavel">Responsáveis</TabsTrigger>
          </TabsList>
        </div>

        {/* Aba Localização */}
        <TabsContent value="localizacao" className="space-y-4">
          <FilterCard
            searchTerm={searchTerms.localizacao}
            onSearchChange={(value) =>
              setSearchTerms({ ...searchTerms, localizacao: value })
            }
            statusFilter={statusFilters.localizacao}
            onStatusChange={(value) =>
              setStatusFilters({ ...statusFilters, localizacao: value })
            }
            searchPlaceholder="Código, descrição ou tipo de estoque..."
            searchId="search-localizacao"
            statusId="status-localizacao"
          />

          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleImportCSV("localizacao")}
                className="flex-1 sm:flex-none"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Importar CSV</span>
                <span className="sm:hidden">Importar</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                    <span className="sm:hidden">Exportar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleExport("Localização", "csv")}
                  >
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport("Localização", "pdf")}
                  >
                    Exportar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              onClick={() => setShowLocalizacaoDialog(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nova Localização</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Localizações</CardTitle>
              <CardDescription>
                {filteredData.localizacoes.length} localização(ões)
                encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredData.localizacoes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.localizacao
                    ? "Nenhuma localização encontrada com os filtros aplicados."
                    : "Nenhuma localização cadastrada."}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableHeader
                          sortKey="codigo"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Código
                        </SortableHeader>
                        <SortableHeader
                          sortKey="descricao"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Descrição
                        </SortableHeader>
                        <SortableHeader
                          sortKey="tipo_estoque"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Tipo de Estoque
                        </SortableHeader>
                        <TableHead>Capacidade</TableHead>
                        <SortableHeader
                          sortKey="status"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Status
                        </SortableHeader>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.localizacoes.map((loc) => (
                        <TableRow key={loc.id}>
                          <TableCell className="font-medium">
                            {loc.codigo}
                          </TableCell>
                          <TableCell>{loc.descricao}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{loc.tipo_estoque}</Badge>
                          </TableCell>
                          <TableCell>{loc.capacidade}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                loc.status === "Ativo" ? "default" : "secondary"
                              }
                            >
                              {loc.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-start gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditLocalizacao(loc)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteLocalizacao(loc.id)}
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

        {/* Aba Caminhão */}
        <TabsContent value="caminhao" className="space-y-4">
          <FilterCard
            searchTerm={searchTerms.caminhao}
            onSearchChange={(value) =>
              setSearchTerms({ ...searchTerms, caminhao: value })
            }
            statusFilter={statusFilters.caminhao}
            onStatusChange={(value) =>
              setStatusFilters({ ...statusFilters, caminhao: value })
            }
            searchPlaceholder="Placa, patrimônio, modelo ou marca..."
            searchId="search-caminhao"
            statusId="status-caminhao"
          />

          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleImportCSV("caminhao")}
                className="flex-1 sm:flex-none"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Importar CSV</span>
                <span className="sm:hidden">Importar</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                    <span className="sm:hidden">Exportar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleExport("Caminhão", "csv")}
                  >
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport("Caminhão", "pdf")}
                  >
                    Exportar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              onClick={() => setShowCaminhaoDialog(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Novo Caminhão</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Caminhões</CardTitle>
              <CardDescription>
                {filteredData.caminhoes.length} caminhão(ões) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredData.caminhoes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.caminhao
                    ? "Nenhum caminhão encontrado com os filtros aplicados."
                    : "Nenhum caminhão cadastrado."}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableHeader
                          sortKey="placa"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Placa
                        </SortableHeader>
                        <SortableHeader
                          sortKey="patrimonio"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Patrimônio
                        </SortableHeader>
                        <SortableHeader
                          sortKey="volume"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Volume (L)
                        </SortableHeader>
                        <SortableHeader
                          sortKey="modelo"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Modelo
                        </SortableHeader>
                        <SortableHeader
                          sortKey="marca"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Marca
                        </SortableHeader>
                        <SortableHeader
                          sortKey="ano"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Ano
                        </SortableHeader>
                        <SortableHeader
                          sortKey="status"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Status
                        </SortableHeader>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.caminhoes.map((cam) => (
                        <TableRow key={cam.id}>
                          <TableCell className="font-medium">
                            {cam.placa}
                          </TableCell>
                          <TableCell>{cam.patrimonio}</TableCell>
                          <TableCell>{cam.volume}</TableCell>
                          <TableCell>{cam.modelo}</TableCell>
                          <TableCell>{cam.marca}</TableCell>
                          <TableCell>{cam.ano}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                cam.status === "Ativo" ? "default" : "secondary"
                              }
                            >
                              {cam.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-start gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewCaminhaoDetalhes(cam)}
                                title="Ver detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCaminhao(cam)}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCaminhao(cam.id)}
                                className="hover:bg-destructive"
                                title="Excluir"
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

        {/* Aba Motorista */}
        <TabsContent value="motorista" className="space-y-4">
          <FilterCard
            searchTerm={searchTerms.motorista}
            onSearchChange={(value) =>
              setSearchTerms({ ...searchTerms, motorista: value })
            }
            statusFilter={statusFilters.motorista}
            onStatusChange={(value) =>
              setStatusFilters({ ...statusFilters, motorista: value })
            }
            searchPlaceholder="Código, matrícula, nome ou contato..."
            searchId="search-motorista"
            statusId="status-motorista"
          />

          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleImportCSV("motorista")}
                className="flex-1 sm:flex-none"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Importar CSV</span>
                <span className="sm:hidden">Importar</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                    <span className="sm:hidden">Exportar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleExport("Motorista", "csv")}
                  >
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport("Motorista", "pdf")}
                  >
                    Exportar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              onClick={() => setShowMotoristaDialog(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Novo Motorista</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Motoristas</CardTitle>
              <CardDescription>
                {filteredData.motoristas.length} motorista(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredData.motoristas.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.motorista
                    ? "Nenhum motorista encontrado com os filtros aplicados."
                    : "Nenhum motorista cadastrado."}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableHeader
                          sortKey="codigo"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Código
                        </SortableHeader>
                        <SortableHeader
                          sortKey="matricula"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Matrícula
                        </SortableHeader>
                        <SortableHeader
                          sortKey="nome"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Nome
                        </SortableHeader>
                        <TableHead>Contato</TableHead>
                        <SortableHeader
                          sortKey="status"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Status
                        </SortableHeader>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.motoristas.map((mot) => (
                        <TableRow key={mot.id}>
                          <TableCell className="font-medium">
                            {mot.codigo}
                          </TableCell>
                          <TableCell>{mot.matricula}</TableCell>
                          <TableCell>{mot.nome}</TableCell>
                          <TableCell>{mot.contato}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                mot.status === "Ativo" ? "default" : "secondary"
                              }
                            >
                              {mot.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-start gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewMotoristaDetalhes(mot)}
                                title="Ver detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditMotorista(mot)}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMotorista(mot.id)}
                                className="hover:bg-destructive"
                                title="Excluir"
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

        {/* Aba Operações */}
        <TabsContent value="operacoes" className="space-y-4">
          <FilterCard
            searchTerm={searchTerms.operacao}
            onSearchChange={(value) =>
              setSearchTerms({ ...searchTerms, operacao: value })
            }
            statusFilter={statusFilters.operacao}
            onStatusChange={(value) =>
              setStatusFilters({ ...statusFilters, operacao: value })
            }
            searchPlaceholder="Descrição..."
            searchId="search-operacao"
            statusId="status-operacao"
          />

          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleImportCSV("operacao")}
                className="flex-1 sm:flex-none"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Importar CSV</span>
                <span className="sm:hidden">Importar</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                    <span className="sm:hidden">Exportar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleExport("Operação", "csv")}
                  >
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport("Operação", "pdf")}
                  >
                    Exportar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              onClick={() => setShowOperacaoDialog(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nova Operação</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Operações</CardTitle>
              <CardDescription>
                {filteredData.operacoes.length} operação(ões) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredData.operacoes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.operacao
                    ? "Nenhuma operação encontrada com os filtros aplicados."
                    : "Nenhuma operação cadastrada."}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableHeader
                          sortKey="descricao"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Descrição
                        </SortableHeader>
                        <SortableHeader
                          sortKey="status"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Status
                        </SortableHeader>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.operacoes.map((op) => (
                        <TableRow key={op.id}>
                          <TableCell className="font-medium">
                            {op.descricao}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                op.status === "Ativo" ? "default" : "secondary"
                              }
                            >
                              {op.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-start gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditOperacao(op)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteOperacao(op.id)}
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

        {/* Aba Centro de Custo */}
        <TabsContent value="centro-custo" className="space-y-4">
          <FilterCard
            searchTerm={searchTerms.centroCusto}
            onSearchChange={(value) =>
              setSearchTerms({ ...searchTerms, centroCusto: value })
            }
            statusFilter={statusFilters.centroCusto}
            onStatusChange={(value) =>
              setStatusFilters({ ...statusFilters, centroCusto: value })
            }
            searchPlaceholder="Descrição..."
            searchId="search-centro-custo"
            statusId="status-centro-custo"
          />

          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleImportCSV("centroCusto")}
                className="flex-1 sm:flex-none"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Importar CSV</span>
                <span className="sm:hidden">Importar</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                    <span className="sm:hidden">Exportar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleExport("Centro de Custo", "csv")}
                  >
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport("Centro de Custo", "pdf")}
                  >
                    Exportar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              onClick={() => setShowCentroCustoDialog(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Novo Centro de Custo</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Centros de Custo</CardTitle>
              <CardDescription>
                {filteredData.centrosCusto.length} centro(s) de custo
                encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredData.centrosCusto.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.centroCusto
                    ? "Nenhum centro de custo encontrado com os filtros aplicados."
                    : "Nenhum centro de custo cadastrado."}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableHeader
                          sortKey="descricao"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Descrição
                        </SortableHeader>
                        <SortableHeader
                          sortKey="status"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Status
                        </SortableHeader>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.centrosCusto.map((cc) => (
                        <TableRow key={cc.id}>
                          <TableCell className="font-medium">
                            {cc.descricao}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                cc.status === "Ativo" ? "default" : "secondary"
                              }
                            >
                              {cc.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-start gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCentroCusto(cc)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCentroCusto(cc.id)}
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

        {/* Aba Responsável */}
        <TabsContent value="responsavel" className="space-y-4">
          <FilterCard
            searchTerm={searchTerms.responsavel}
            onSearchChange={(value) =>
              setSearchTerms({ ...searchTerms, responsavel: value })
            }
            statusFilter={statusFilters.responsavel}
            onStatusChange={(value) =>
              setStatusFilters({ ...statusFilters, responsavel: value })
            }
            searchPlaceholder="Nome..."
            searchId="search-responsavel"
            statusId="status-responsavel"
          />

          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleImportCSV("responsavel")}
                className="flex-1 sm:flex-none"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Importar CSV</span>
                <span className="sm:hidden">Importar</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                    <span className="sm:hidden">Exportar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleExport("Responsável", "csv")}
                  >
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport("Responsável", "pdf")}
                  >
                    Exportar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              onClick={() => setShowResponsavelDialog(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Novo Responsável</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Responsáveis</CardTitle>
              <CardDescription>
                {filteredData.responsaveis.length} responsável(is) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredData.responsaveis.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.responsavel
                    ? "Nenhum responsável encontrado com os filtros aplicados."
                    : "Nenhum responsável cadastrado."}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <SortableHeader
                          sortKey="nome"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Nome
                        </SortableHeader>
                        <SortableHeader
                          sortKey="status"
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        >
                          Status
                        </SortableHeader>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.responsaveis.map((resp) => (
                        <TableRow key={resp.id}>
                          <TableCell className="font-medium">
                            {resp.nome}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                resp.status === "Ativo"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {resp.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-start gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditResponsavel(resp)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteResponsavel(resp.id)}
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

      {/* Dialog Genérico de Importação */}
      <Dialog
        open={dialogImportAberto}
        onOpenChange={(open) => {
          if (!open) {
            setDialogImportAberto(false);
            setTipoImportacao("");
            setCsvFile(null);
            setCsvData([]);
            setCsvPreview(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Importar{" "}
              {tipoImportacao === "localizacao"
                ? "Localizações"
                : tipoImportacao === "caminhao"
                ? "Caminhões"
                : tipoImportacao === "motorista"
                ? "Motoristas"
                : tipoImportacao === "operacao"
                ? "Operações"
                : tipoImportacao === "centroCusto"
                ? "Centros de Custo"
                : tipoImportacao === "responsavel"
                ? "Responsáveis"
                : ""}
            </DialogTitle>
            <DialogDescription>
              Importe dados através de arquivo CSV. Baixe o template para o
              formato correto.
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
              <Button
                variant="outline"
                onClick={() => downloadTemplate(tipoImportacao)}
              >
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
                        {tipoImportacao === "localizacao" && (
                          <>
                            <TableHead>Código</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Tipo de Estoque</TableHead>
                            <TableHead>Capacidade</TableHead>
                          </>
                        )}
                        {tipoImportacao === "caminhao" && (
                          <>
                            <TableHead>Placa</TableHead>
                            <TableHead>Patrimônio</TableHead>
                            <TableHead>Modelo</TableHead>
                            <TableHead>Marca</TableHead>
                            <TableHead>Observações</TableHead>
                          </>
                        )}
                        {tipoImportacao === "motorista" && (
                          <>
                            <TableHead>Código</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Matrícula</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>CNH</TableHead>
                            <TableHead>Expiração CNH</TableHead>
                          </>
                        )}
                        {(tipoImportacao === "operacao" ||
                          tipoImportacao === "centroCusto") && (
                          <>
                            <TableHead>Descrição</TableHead>
                          </>
                        )}
                        {tipoImportacao === "responsavel" && (
                          <>
                            <TableHead>Nome</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvData.slice(0, 5).map((item, index) => (
                        <TableRow key={index}>
                          {tipoImportacao === "localizacao" && (
                            <>
                              <TableCell className="font-medium">
                                {item.codigo}
                              </TableCell>
                              <TableCell>{item.descricao}</TableCell>
                              <TableCell>{item.tipo_estoque}</TableCell>
                              <TableCell>{item.capacidade}</TableCell>
                            </>
                          )}
                          {tipoImportacao === "caminhao" && (
                            <>
                              <TableCell className="font-medium">
                                {item.placa}
                              </TableCell>
                              <TableCell>{item.patrimonio}</TableCell>
                              <TableCell>{item.modelo}</TableCell>
                              <TableCell>{item.marca}</TableCell>
                              <TableCell className="max-w-xs truncate">
                                {item.observacoes || "-"}
                              </TableCell>
                            </>
                          )}
                          {tipoImportacao === "motorista" && (
                            <>
                              <TableCell className="font-medium">
                                {item.codigo}
                              </TableCell>
                              <TableCell>{item.nome}</TableCell>
                              <TableCell>{item.matricula}</TableCell>
                              <TableCell>{item.contato}</TableCell>
                              <TableCell className="max-w-xs truncate">
                                {item.cnh || "-"}
                              </TableCell>
                              <TableCell>
                                {item.dataExpiracaoCnh
                                  ? new Date(
                                      item.dataExpiracaoCnh
                                    ).toLocaleDateString("pt-BR")
                                  : "-"}
                              </TableCell>
                            </>
                          )}
                          {(tipoImportacao === "operacao" ||
                            tipoImportacao === "centroCusto") && (
                            <>
                              <TableCell className="font-medium">
                                {item.descricao}
                              </TableCell>
                            </>
                          )}
                          {tipoImportacao === "responsavel" && (
                            <>
                              <TableCell className="font-medium">
                                {item.nome}
                              </TableCell>
                            </>
                          )}
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
              onClick={() => {
                setDialogImportAberto(false);
                setTipoImportacao("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={importarCSV}
              disabled={!csvPreview || csvData.length === 0}
            >
              Importar {csvData.length}{" "}
              {tipoImportacao === "localizacao"
                ? "Localizações"
                : tipoImportacao === "caminhao"
                ? "Caminhões"
                : tipoImportacao === "motorista"
                ? "Motoristas"
                : tipoImportacao === "operacao"
                ? "Operações"
                : tipoImportacao === "centroCusto"
                ? "Centros de Custo"
                : tipoImportacao === "responsavel"
                ? "Responsáveis"
                : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Localização */}
      <Dialog
        open={showLocalizacaoDialog}
        onOpenChange={setShowLocalizacaoDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLocalizacao ? "Editar Localização" : "Nova Localização"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da localização
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="loc-codigo">Código</Label>
              <Input
                id="loc-codigo"
                value={localizacaoForm.codigo}
                onChange={(e) =>
                  setLocalizacaoForm({
                    ...localizacaoForm,
                    codigo: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="loc-descricao">Descrição</Label>
              <Input
                id="loc-descricao"
                value={localizacaoForm.descricao}
                onChange={(e) =>
                  setLocalizacaoForm({
                    ...localizacaoForm,
                    descricao: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="loc-tipo">Tipo de Estoque</Label>
              <Select
                value={localizacaoForm.tipo_estoque}
                onValueChange={(value) =>
                  setLocalizacaoForm({
                    ...localizacaoForm,
                    tipo_estoque: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIMÁRIO">PRIMÁRIO</SelectItem>
                  <SelectItem value="SECUNDÁRIO">SECUNDÁRIO</SelectItem>
                  <SelectItem value="TERCIÁRIO">TERCIÁRIO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="loc-capacidade">Capacidade</Label>
              <Input
                id="loc-capacidade"
                value={localizacaoForm.capacidade}
                onChange={(e) =>
                  setLocalizacaoForm({
                    ...localizacaoForm,
                    capacidade: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="loc-status">Status</Label>
              <Select
                value={localizacaoForm.status}
                onValueChange={(value) =>
                  setLocalizacaoForm({
                    ...localizacaoForm,
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
            <Button variant="outline" onClick={handleCloseLocalizacaoDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLocalizacao}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Caminhão */}
      <Dialog open={showCaminhaoDialog} onOpenChange={setShowCaminhaoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCaminhao ? "Editar Caminhão" : "Novo Caminhão"}
            </DialogTitle>
            <DialogDescription>Preencha os dados do caminhão</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cam-placa">Placa</Label>
              <Input
                id="cam-placa"
                value={caminhaoForm.placa}
                onChange={(e) =>
                  setCaminhaoForm({ ...caminhaoForm, placa: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="cam-patrimonio">Patrimônio</Label>
              <Input
                id="cam-patrimonio"
                value={caminhaoForm.patrimonio}
                onChange={(e) =>
                  setCaminhaoForm({
                    ...caminhaoForm,
                    patrimonio: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="cam-volume">Volume (L)</Label>
              <Input
                id="cam-volume"
                type="number"
                value={caminhaoForm.volume}
                onChange={(e) =>
                  setCaminhaoForm({ ...caminhaoForm, volume: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="cam-modelo">Modelo</Label>
              <Input
                id="cam-modelo"
                value={caminhaoForm.modelo}
                onChange={(e) =>
                  setCaminhaoForm({ ...caminhaoForm, modelo: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="cam-marca">Marca</Label>
              <Input
                id="cam-marca"
                value={caminhaoForm.marca}
                onChange={(e) =>
                  setCaminhaoForm({ ...caminhaoForm, marca: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="cam-ano">Ano</Label>
              <Input
                id="cam-ano"
                type="number"
                value={caminhaoForm.ano}
                onChange={(e) =>
                  setCaminhaoForm({ ...caminhaoForm, ano: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="cam-observacoes">Observações</Label>
              <Textarea
                id="cam-observacoes"
                value={caminhaoForm.observacoes}
                onChange={(e) =>
                  setCaminhaoForm({
                    ...caminhaoForm,
                    observacoes: e.target.value,
                  })
                }
                placeholder="Digite observações sobre o caminhão (opcional)"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="cam-status">Status</Label>
              <Select
                value={caminhaoForm.status}
                onValueChange={(value) =>
                  setCaminhaoForm({
                    ...caminhaoForm,
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
            <Button variant="outline" onClick={handleCloseCaminhaoDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCaminhao}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Motorista */}
      <Dialog open={showMotoristaDialog} onOpenChange={setShowMotoristaDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMotorista ? "Editar Motorista" : "Novo Motorista"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do motorista
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mot-codigo">Código</Label>
              <Input
                id="mot-codigo"
                value={motoristaForm.codigo}
                onChange={(e) =>
                  setMotoristaForm({ ...motoristaForm, codigo: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="mot-matricula">Matrícula</Label>
              <Input
                id="mot-matricula"
                value={motoristaForm.matricula}
                onChange={(e) =>
                  setMotoristaForm({
                    ...motoristaForm,
                    matricula: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="mot-nome">Nome</Label>
              <Input
                id="mot-nome"
                value={motoristaForm.nome}
                onChange={(e) =>
                  setMotoristaForm({ ...motoristaForm, nome: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="mot-contato">Contato</Label>
              <Input
                id="mot-contato"
                value={motoristaForm.contato}
                onChange={(e) =>
                  setMotoristaForm({
                    ...motoristaForm,
                    contato: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="mot-cnh">CNH (opcional)</Label>
              <Input
                id="mot-cnh"
                value={motoristaForm.cnh}
                onChange={(e) =>
                  setMotoristaForm({
                    ...motoristaForm,
                    cnh: e.target.value,
                  })
                }
                placeholder="Digite o número da CNH"
              />
            </div>
            <div>
              <Label htmlFor="mot-data-expiracao">
                Data de Expiração da CNH (opcional)
              </Label>
              <Input
                id="mot-data-expiracao"
                type="date"
                value={motoristaForm.dataExpiracaoCnh}
                onChange={(e) =>
                  setMotoristaForm({
                    ...motoristaForm,
                    dataExpiracaoCnh: e.target.value,
                  })
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="mot-status">Status</Label>
              <Select
                value={motoristaForm.status}
                onValueChange={(value) =>
                  setMotoristaForm({
                    ...motoristaForm,
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
            <Button variant="outline" onClick={handleCloseMotoristaDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMotorista}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Operação */}
      <Dialog open={showOperacaoDialog} onOpenChange={setShowOperacaoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingOperacao ? "Editar Operação" : "Nova Operação"}
            </DialogTitle>
            <DialogDescription>Preencha os dados da operação</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="op-descricao">Descrição</Label>
              <Input
                id="op-descricao"
                value={operacaoForm.descricao}
                onChange={(e) =>
                  setOperacaoForm({
                    ...operacaoForm,
                    descricao: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="op-status">Status</Label>
              <Select
                value={operacaoForm.status}
                onValueChange={(value) =>
                  setOperacaoForm({
                    ...operacaoForm,
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
            <Button variant="outline" onClick={handleCloseOperacaoDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveOperacao}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Centro de Custo */}
      <Dialog
        open={showCentroCustoDialog}
        onOpenChange={setShowCentroCustoDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCentroCusto
                ? "Editar Centro de Custo"
                : "Novo Centro de Custo"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do centro de custo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cc-descricao">Descrição</Label>
              <Input
                id="cc-descricao"
                value={centroCustoForm.descricao}
                onChange={(e) =>
                  setCentroCustoForm({
                    ...centroCustoForm,
                    descricao: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="cc-status">Status</Label>
              <Select
                value={centroCustoForm.status}
                onValueChange={(value) =>
                  setCentroCustoForm({
                    ...centroCustoForm,
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
            <Button variant="outline" onClick={handleCloseCentroCustoDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCentroCusto}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Detalhes Motorista */}
      <Dialog
        open={showMotoristaDetalhes}
        onOpenChange={setShowMotoristaDetalhes}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Motorista</DialogTitle>
            <DialogDescription>
              Informações completas do motorista
            </DialogDescription>
          </DialogHeader>
          {motoristaDetalhes && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Código
                  </Label>
                  <p className="text-lg font-semibold">
                    {motoristaDetalhes.codigo}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Matrícula
                  </Label>
                  <p className="text-lg font-semibold">
                    {motoristaDetalhes.matricula}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Nome
                  </Label>
                  <p className="text-lg font-semibold">
                    {motoristaDetalhes.nome}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Contato
                  </Label>
                  <p className="text-lg font-semibold">
                    {motoristaDetalhes.contato}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        motoristaDetalhes.status === "Ativo"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {motoristaDetalhes.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Seção CNH */}
              {(motoristaDetalhes.cnh ||
                motoristaDetalhes.dataExpiracaoCnh) && (
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Informações da CNH
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {motoristaDetalhes.cnh && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Número da CNH
                          </Label>
                          <p className="text-lg font-semibold">
                            {motoristaDetalhes.cnh}
                          </p>
                        </div>
                      )}
                      {motoristaDetalhes.dataExpiracaoCnh && (
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Data de Expiração
                          </Label>
                          <p className="text-lg font-semibold">
                            {new Date(
                              motoristaDetalhes.dataExpiracaoCnh
                            ).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Alertas de CNH */}
                  {motoristaDetalhes.dataExpiracaoCnh && (
                    <div className="space-y-2">
                      {isCnhExpirada(motoristaDetalhes.dataExpiracaoCnh) && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              CNH Expirada
                            </p>
                            <p className="text-xs text-red-600">
                              A CNH expirou em{" "}
                              {new Date(
                                motoristaDetalhes.dataExpiracaoCnh
                              ).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      )}
                      {!isCnhExpirada(motoristaDetalhes.dataExpiracaoCnh) &&
                        isCnhExpirandoEmBreve(
                          motoristaDetalhes.dataExpiracaoCnh
                        ) && (
                          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">
                                CNH Expirando em Breve
                              </p>
                              <p className="text-xs text-yellow-600">
                                A CNH expira em{" "}
                                {new Date(
                                  motoristaDetalhes.dataExpiracaoCnh
                                ).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMotoristaDetalhes(false)}
            >
              Fechar
            </Button>
            <Button
              onClick={() => {
                setShowMotoristaDetalhes(false);
                if (motoristaDetalhes) {
                  handleEditMotorista(motoristaDetalhes);
                }
              }}
            >
              Editar Motorista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Detalhes Caminhão */}
      <Dialog
        open={showCaminhaoDetalhes}
        onOpenChange={setShowCaminhaoDetalhes}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Caminhão</DialogTitle>
            <DialogDescription>
              Informações completas do veículo
            </DialogDescription>
          </DialogHeader>
          {caminhaoDetalhes && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Placa
                  </Label>
                  <p className="text-lg font-semibold">
                    {caminhaoDetalhes.placa}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Patrimônio
                  </Label>
                  <p className="text-lg font-semibold">
                    {caminhaoDetalhes.patrimonio}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Volume (L)
                  </Label>
                  <p className="text-lg font-semibold">
                    {caminhaoDetalhes.volume}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Ano
                  </Label>
                  <p className="text-lg font-semibold">
                    {caminhaoDetalhes.ano}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Modelo
                  </Label>
                  <p className="text-lg font-semibold">
                    {caminhaoDetalhes.modelo}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Marca
                  </Label>
                  <p className="text-lg font-semibold">
                    {caminhaoDetalhes.marca}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status
                  </Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        caminhaoDetalhes.status === "Ativo"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {caminhaoDetalhes.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {caminhaoDetalhes.observacoes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Observações
                  </Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {caminhaoDetalhes.observacoes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCaminhaoDetalhes(false)}
            >
              Fechar
            </Button>
            <Button
              onClick={() => {
                setShowCaminhaoDetalhes(false);
                if (caminhaoDetalhes) {
                  handleEditCaminhao(caminhaoDetalhes);
                }
              }}
            >
              Editar Caminhão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Responsável */}
      <Dialog
        open={showResponsavelDialog}
        onOpenChange={setShowResponsavelDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingResponsavel ? "Editar Responsável" : "Novo Responsável"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do responsável
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resp-nome">Nome</Label>
              <Input
                id="resp-nome"
                value={responsavelForm.nome}
                onChange={(e) =>
                  setResponsavelForm({
                    ...responsavelForm,
                    nome: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="resp-status">Status</Label>
              <Select
                value={responsavelForm.status}
                onValueChange={(value) =>
                  setResponsavelForm({
                    ...responsavelForm,
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
            <Button variant="outline" onClick={handleCloseResponsavelDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveResponsavel}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CadastrosAuxiliares;
