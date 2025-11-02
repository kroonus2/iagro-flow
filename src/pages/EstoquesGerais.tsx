import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Edit,
  Download,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

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

// Dados simulados de materiais agrícolas (vinculados ao InsumosAgricolas.tsx)
const materiaisAgricolas: {
  [key: number]: { codigo: string; descricao: string; nomeComercial: string };
} = {
  1005392: {
    codigo: "1005392",
    descricao: "HERBICIDA NUFARM U 46 BR",
    nomeComercial: "U 46 BR",
  },
  1027638: {
    codigo: "1027638",
    descricao: "HERBICIDA UPL DEZ",
    nomeComercial: "DEZ",
  },
  1027636: {
    codigo: "1027636",
    descricao: "HERBICIDA IHARA MIRANT",
    nomeComercial: "MIRANT",
  },
  1003390: {
    codigo: "1003390",
    descricao: "FERTILIZANTE",
    nomeComercial: "FERTILIZANTE",
  },
};

// Mapeamento de fornecedores
const fornecedores: { [key: number]: string } = {
  1: "Fornecedor A",
  2: "Fornecedor B",
  3: "Fornecedor C",
};

// Mapeamento de localizações (baseado em CadastrosAuxiliares.tsx)
const localizacoes: {
  [key: number]: { codigo: string; descricao: string; tipoEstoque: string };
} = {
  1: {
    codigo: "ARM-001",
    descricao: "Armazém Principal - Área A",
    tipoEstoque: "PRIMÁRIO",
  },
  2: {
    codigo: "ARM-002",
    descricao: "Armazém Principal - Área B",
    tipoEstoque: "PRIMÁRIO",
  },
  3: {
    codigo: "ARM-003",
    descricao: "Armazém Químico",
    tipoEstoque: "PRIMÁRIO",
  },
  4: {
    codigo: "SC01-IB01",
    descricao: "SmartCalda 1 - IBC01",
    tipoEstoque: "SMARTCALDA",
  },
  5: {
    codigo: "SC01-SL01",
    descricao: "SmartCalda 1 - SL01",
    tipoEstoque: "SMARTCALDA",
  },
  6: {
    codigo: "FRAC-001",
    descricao: "Bancada Produção 1",
    tipoEstoque: "FRACIONÁRIO",
  },
  7: {
    codigo: "FRAC-002",
    descricao: "Bancada Produção 2",
    tipoEstoque: "FRACIONÁRIO",
  },
  8: {
    codigo: "FRAC-003",
    descricao: "Aplicação em Campo",
    tipoEstoque: "FRACIONÁRIO",
  },
};

type EntradaNotaFiscal = {
  nota: number;
  idFornecedor: number;
  dataEntrada: string;
  idItem: number;
  lote: string;
  qtde: number;
  unidade: string;
  validade: string;
  tipoEmbalagem: string;
  qtdeEmbalagem: number;
  capEmbalagem: number;
  saldoAtual: number;
  localizacao: string;
};

type EstoqueTecnicoFracionario = {
  idEstoque: number;
  idItem: number;
  nLote: string;
  idLocalizacao: number;
  saldoMovimentacao: number;
  unidade: string;
  saldoDispon: number;
  dataUso: string | null;
};

const Cargas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requisicaoDialogOpen, setRequisicaoDialogOpen] = useState(false);
  const [xmlDialogOpen, setXmlDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [editarDialogOpen, setEditarDialogOpen] = useState(false);
  const [movimentarDialogOpen, setMovimentarDialogOpen] = useState(false);
  const [entradaSelecionada, setEntradaSelecionada] =
    useState<EntradaNotaFiscal | null>(null);
  const [entradaEditando, setEntradaEditando] =
    useState<EntradaNotaFiscal | null>(null);
  const [entradaMovimentando, setEntradaMovimentando] =
    useState<EntradaNotaFiscal | null>(null);
  const [activeTab, setActiveTab] = useState("primario");
  const [searchTermTecnico, setSearchTermTecnico] = useState("");
  const [searchTermFracionario, setSearchTermFracionario] = useState("");
  const [detalhesTecnicoDialogOpen, setDetalhesTecnicoDialogOpen] =
    useState(false);
  const [detalhesFracionarioDialogOpen, setDetalhesFracionarioDialogOpen] =
    useState(false);
  const [itemSelecionado, setItemSelecionado] =
    useState<EstoqueTecnicoFracionario | null>(null);

  // Estado para ordenação
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [entradasEstoquePrimario, setEntradasEstoquePrimario] = useState<
    EntradaNotaFiscal[]
  >([
    {
      nota: 999999,
      idFornecedor: 1,
      dataEntrada: "2025-10-13",
      idItem: 1005392,
      lote: "NR42123259600",
      qtde: 5000,
      unidade: "LITROS",
      validade: "2026-10-13",
      tipoEmbalagem: "IBCS1000",
      qtdeEmbalagem: 5,
      capEmbalagem: 1000,
      saldoAtual: 4000,
      localizacao: "ARM-001",
    },
    {
      nota: 999999,
      idFornecedor: 1,
      dataEntrada: "2025-10-13",
      idItem: 1003390,
      lote: "NR99999999999",
      qtde: 3000,
      unidade: "LITROS",
      validade: "2026-10-13",
      tipoEmbalagem: "IBCS1001",
      qtdeEmbalagem: 3,
      capEmbalagem: 1000,
      saldoAtual: 3000,
      localizacao: "ARM-003",
    },
    {
      nota: 999999,
      idFornecedor: 1,
      dataEntrada: "2025-10-13",
      idItem: 1027638,
      lote: "SY003-24-20-160",
      qtde: 800,
      unidade: "KILOS",
      validade: "2025-10-13",
      tipoEmbalagem: "BAGS500",
      qtdeEmbalagem: 8,
      capEmbalagem: 100,
      saldoAtual: 700,
      localizacao: "ARM-002",
    },
    {
      nota: 999999,
      idFornecedor: 1,
      dataEntrada: "2025-10-13",
      idItem: 1027636,
      lote: "005-22-12000",
      qtde: 400,
      unidade: "LITROS",
      validade: "2026-10-15",
      tipoEmbalagem: "GALÃO20L",
      qtdeEmbalagem: 50,
      capEmbalagem: 8,
      saldoAtual: 350,
      localizacao: "ARM-003",
    },
  ]);

  const [novaCarga, setNovaCarga] = useState({
    nota: "",
    idFornecedor: "",
    dataEntrada: "",
    idItem: "",
    lote: "",
    qtde: "",
    unidade: "LITROS",
    validade: "",
    tipoEmbalagem: "",
    qtdeEmbalagem: "",
    capEmbalagem: "",
    saldoAtual: "",
    localizacao: "",
  });

  const [novaRequisicao, setNovaRequisicao] = useState({
    hardware: "",
    produto: "",
    quantidadeSolicitada: "",
    prioridade: "media",
    observacoes: "",
  });

  // Tipos de movimentações disponíveis a partir do Estoque Primário
  const tiposMovimentacoes = [
    {
      nome: "PRODUÇÃO-TÉCNICO",
      origem: "PRIMÁRIO",
      destino: "SMARTCALDA", // TÉCNICO
      acao: "SUBTRAIR",
      tipo: "saida",
    },
    {
      nome: "PRODUÇÃO-FRACIONÁRIO",
      origem: "PRIMÁRIO",
      destino: "FRACIONÁRIO",
      acao: "SUBTRAIR",
      tipo: "saida",
    },
    {
      nome: "PERDA PRIMÁRIO",
      origem: "PRIMÁRIO",
      destino: "DESCARTE",
      acao: "SUBTRAIR",
      tipo: "saida",
    },
  ];

  const [movimentacaoForm, setMovimentacaoForm] = useState({
    tipoMovimento: "",
    idLocDestino: "",
    qtde: "",
    observacoes: "",
  });

  // Dados simulados de Estoque Técnico (localizações SMARTCALDA: 4, 5)
  const [estoqueTecnico, setEstoqueTecnico] = useState<
    EstoqueTecnicoFracionario[]
  >([
    {
      idEstoque: 1,
      idItem: 1005392,
      nLote: "NR42123259600",
      idLocalizacao: 4,
      saldoMovimentacao: 1000,
      unidade: "L",
      saldoDispon: 100,
      dataUso: null,
    },
    {
      idEstoque: 2,
      idItem: 1027638,
      nLote: "SY003-24-20-160",
      idLocalizacao: 5,
      saldoMovimentacao: 100,
      unidade: "KG",
      saldoDispon: 100,
      dataUso: null,
    },
  ]);

  // Dados simulados de Estoque Fracionário (localizações FRACIONÁRIO: 6, 7, 8)
  const [estoqueFracionario, setEstoqueFracionario] = useState<
    EstoqueTecnicoFracionario[]
  >([
    {
      idEstoque: 3,
      idItem: 1027636,
      nLote: "005-22-12000",
      idLocalizacao: 6,
      saldoMovimentacao: 50,
      unidade: "L",
      saldoDispon: 50,
      dataUso: null,
    },
  ]);

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
      observacoes: "Urgente para produção",
    },
    {
      id: 2,
      hardware: "Smart Calda 02",
      produto: "FERTILIZANTE OPÇÃO",
      quantidadeSolicitada: 150,
      dataRequisicao: "2024-01-20",
      status: "aprovada",
      prioridade: "media",
      observacoes: "",
    },
  ];

  // Alertas ativos
  const alertasAtivos = [
    {
      id: 1,
      tipo: "estoque_baixo",
      produto: "FERTILIZANTE OPÇÃO",
      mensagem: "Estoque abaixo do mínimo",
      dataAlerta: "2024-01-21",
      prioridade: "alta",
    },
    {
      id: 2,
      tipo: "vencimento",
      produto: "NUTRITION",
      mensagem: "Produto vence em 30 dias",
      dataAlerta: "2024-01-20",
      prioridade: "media",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "disponivel":
        return "default";
      case "baixo":
        return "secondary";
      case "vazio":
        return "destructive";
      case "vencendo":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "baixo":
        return "Estoque Baixo";
      case "vazio":
        return "Vazio";
      case "vencendo":
        return "Vencendo";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "disponivel":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "baixo":
        return <TrendingDown className="h-4 w-4 text-warning" />;
      case "vazio":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "vencendo":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "destructive";
      case "media":
        return "secondary";
      case "baixa":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Função para ordenar dados
  const sortData = (data: any[], key: string, direction: "asc" | "desc") => {
    return [...data].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Tratamento especial para diferentes tipos de dados
      if (
        key === "qtde" ||
        key === "saldoAtual" ||
        key === "idItem" ||
        key === "nota" ||
        key === "idEstoque" ||
        key === "saldoMovimentacao" ||
        key === "saldoDispon" ||
        key === "idLocalizacao"
      ) {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (
        key === "dataEntrada" ||
        key === "validade" ||
        key === "dataUso"
      ) {
        aValue = aValue ? new Date(aValue).getTime() : Number.MAX_SAFE_INTEGER;
        bValue = bValue ? new Date(bValue).getTime() : Number.MAX_SAFE_INTEGER;
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

  // Função para obter dados ordenados e filtrados
  const getSortedAndFilteredData = (
    data: any[],
    filteredData: any[],
    tab: string
  ) => {
    if (sortConfig && activeTab === tab) {
      return sortData(filteredData, sortConfig.key, sortConfig.direction);
    }
    return filteredData;
  };

  const filteredEntradasRaw = entradasEstoquePrimario.filter((entrada) => {
    const material = materiaisAgricolas[entrada.idItem];
    const materialNome = material?.nomeComercial || material?.descricao || "";
    const matchesSearch =
      entrada.nota.toString().includes(searchTerm) ||
      materialNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrada.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrada.localizacao.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredEntradas = getSortedAndFilteredData(
    entradasEstoquePrimario,
    filteredEntradasRaw,
    "primario"
  );

  const filteredEstoqueTecnicoRaw = estoqueTecnico.filter((item) => {
    const material = materiaisAgricolas[item.idItem];
    const materialNome = material?.nomeComercial || material?.descricao || "";
    const loc = localizacoes[item.idLocalizacao];
    const matchesSearch =
      materialNome.toLowerCase().includes(searchTermTecnico.toLowerCase()) ||
      item.nLote.toLowerCase().includes(searchTermTecnico.toLowerCase()) ||
      (loc?.codigo || "")
        .toLowerCase()
        .includes(searchTermTecnico.toLowerCase()) ||
      (loc?.descricao || "")
        .toLowerCase()
        .includes(searchTermTecnico.toLowerCase());
    return matchesSearch;
  });

  const filteredEstoqueTecnico = getSortedAndFilteredData(
    estoqueTecnico,
    filteredEstoqueTecnicoRaw,
    "tecnico"
  );

  const filteredEstoqueFracionarioRaw = estoqueFracionario.filter((item) => {
    const material = materiaisAgricolas[item.idItem];
    const materialNome = material?.nomeComercial || material?.descricao || "";
    const loc = localizacoes[item.idLocalizacao];
    const matchesSearch =
      materialNome
        .toLowerCase()
        .includes(searchTermFracionario.toLowerCase()) ||
      item.nLote.toLowerCase().includes(searchTermFracionario.toLowerCase()) ||
      (loc?.codigo || "")
        .toLowerCase()
        .includes(searchTermFracionario.toLowerCase()) ||
      (loc?.descricao || "")
        .toLowerCase()
        .includes(searchTermFracionario.toLowerCase());
    return matchesSearch;
  });

  const filteredEstoqueFracionario = getSortedAndFilteredData(
    estoqueFracionario,
    filteredEstoqueFracionarioRaw,
    "fracionario"
  );

  const handleVerDetalhes = (entrada: EntradaNotaFiscal) => {
    setEntradaSelecionada(entrada);
    setDetalhesDialogOpen(true);
  };

  const handleVerDetalhesTecnico = (item: EstoqueTecnicoFracionario) => {
    setItemSelecionado(item);
    setDetalhesTecnicoDialogOpen(true);
  };

  const handleVerDetalhesFracionario = (item: EstoqueTecnicoFracionario) => {
    setItemSelecionado(item);
    setDetalhesFracionarioDialogOpen(true);
  };

  const handleEditarEntrada = (entrada: EntradaNotaFiscal) => {
    setEntradaEditando(entrada);
    setEditarDialogOpen(true);
  };

  const handleMovimentarItem = (entrada: EntradaNotaFiscal) => {
    setEntradaMovimentando(entrada);
    setMovimentacaoForm({
      tipoMovimento: "",
      idLocDestino: "",
      qtde: "",
      observacoes: "",
    });
    setMovimentarDialogOpen(true);
  };

  const handleSalvarMovimentacao = () => {
    if (!entradaMovimentando) return;

    if (!movimentacaoForm.tipoMovimento || !movimentacaoForm.qtde) {
      toast.error("Preencha o tipo de movimentação e a quantidade");
      return;
    }

    // Verificar se precisa de localização de destino
    const tipoMov = tiposMovimentacoes.find(
      (t) => t.nome === movimentacaoForm.tipoMovimento
    );
    const locsDestino = getLocalizacoesDestino(movimentacaoForm.tipoMovimento);
    if (locsDestino.length > 0 && !movimentacaoForm.idLocDestino) {
      toast.error("Selecione a localização de destino");
      return;
    }

    const quantidade = Number(movimentacaoForm.qtde);
    if (quantidade > entradaMovimentando.saldoAtual) {
      toast.error("Quantidade não pode ser maior que o saldo atual");
      return;
    }

    if (quantidade <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }

    // Atualizar saldo atual da entrada
    const index = entradasEstoquePrimario.findIndex(
      (e) =>
        e.nota === entradaMovimentando.nota &&
        e.idItem === entradaMovimentando.idItem &&
        e.lote === entradaMovimentando.lote
    );

    if (index !== -1) {
      const novasEntradas = [...entradasEstoquePrimario];
      novasEntradas[index] = {
        ...novasEntradas[index],
        saldoAtual: novasEntradas[index].saldoAtual - quantidade,
      };
      setEntradasEstoquePrimario(novasEntradas);
    }

    toast.success("Movimentação realizada com sucesso!");
    setMovimentarDialogOpen(false);
    setEntradaMovimentando(null);
    setMovimentacaoForm({
      tipoMovimento: "",
      idLocDestino: "",
      qtde: "",
      observacoes: "",
    });
  };

  // Obter localizações de destino baseado no tipo de movimento
  const getLocalizacoesDestino = (tipoMovimento: string) => {
    const tipoMov = tiposMovimentacoes.find((t) => t.nome === tipoMovimento);
    if (!tipoMov) return [];

    if (tipoMov.destino === "SMARTCALDA") {
      // Localizações TÉCNICO (SMARTCALDA)
      return Object.entries(localizacoes)
        .filter(([_, loc]) => loc.tipoEstoque === "SMARTCALDA")
        .map(([id, loc]) => ({ id: Number(id), ...loc }));
    } else if (tipoMov.destino === "FRACIONÁRIO") {
      // Localizações FRACIONÁRIO
      return Object.entries(localizacoes)
        .filter(([_, loc]) => loc.tipoEstoque === "FRACIONÁRIO")
        .map(([id, loc]) => ({ id: Number(id), ...loc }));
    } else if (tipoMov.destino === "DESCARTE") {
      // Para descarte, não precisa de localização específica
      return [];
    }
    return [];
  };

  const handleSalvarEdicao = () => {
    if (!entradaEditando) return;

    const index = entradasEstoquePrimario.findIndex(
      (e) =>
        e.nota === entradaEditando.nota &&
        e.idItem === entradaEditando.idItem &&
        e.lote === entradaEditando.lote
    );

    if (index !== -1) {
      const novasEntradas = [...entradasEstoquePrimario];
      novasEntradas[index] = entradaEditando;
      setEntradasEstoquePrimario(novasEntradas);
      toast.success("Entrada atualizada com sucesso!");
      setEditarDialogOpen(false);
      setEntradaEditando(null);
    }
  };

  const handleIncluirCarga = () => {
    if (
      !novaCarga.nota ||
      !novaCarga.idFornecedor ||
      !novaCarga.dataEntrada ||
      !novaCarga.idItem ||
      !novaCarga.qtde ||
      !novaCarga.unidade
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const novaEntrada: EntradaNotaFiscal = {
      nota: Number(novaCarga.nota),
      idFornecedor: Number(novaCarga.idFornecedor),
      dataEntrada: novaCarga.dataEntrada,
      idItem: Number(novaCarga.idItem),
      lote: novaCarga.lote || "",
      qtde: Number(novaCarga.qtde),
      unidade: novaCarga.unidade,
      validade: novaCarga.validade || "",
      tipoEmbalagem: novaCarga.tipoEmbalagem || "",
      qtdeEmbalagem: novaCarga.qtdeEmbalagem
        ? Number(novaCarga.qtdeEmbalagem)
        : 0,
      capEmbalagem: novaCarga.capEmbalagem ? Number(novaCarga.capEmbalagem) : 0,
      saldoAtual: novaCarga.saldoAtual
        ? Number(novaCarga.saldoAtual)
        : Number(novaCarga.qtde),
      localizacao: novaCarga.localizacao || "",
    };

    setEntradasEstoquePrimario([...entradasEstoquePrimario, novaEntrada]);
    toast.success("Entrada registrada com sucesso!");
    setDialogOpen(false);
    setNovaCarga({
      nota: "",
      idFornecedor: "",
      dataEntrada: "",
      idItem: "",
      lote: "",
      qtde: "",
      unidade: "LITROS",
      validade: "",
      tipoEmbalagem: "",
      qtdeEmbalagem: "",
      capEmbalagem: "",
      saldoAtual: "",
      localizacao: "",
    });
  };

  const handleCriarRequisicao = () => {
    if (
      !novaRequisicao.hardware ||
      !novaRequisicao.produto ||
      !novaRequisicao.quantidadeSolicitada
    ) {
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
      observacoes: "",
    });
  };

  const handleImportarXML = () => {
    toast.success("XML importado com sucesso!");
    setXmlDialogOpen(false);
  };

  const handleImportarCSV = () => {
    toast.success("CSV importado com sucesso!");
    setCsvDialogOpen(false);
  };

  const handleExportar = (
    tipo: "csv" | "pdf",
    estoque: "primario" | "tecnico" | "fracionario"
  ) => {
    if (tipo === "csv") {
      toast.success(`Exportando ${estoque} em formato CSV...`);
      // Aqui você pode implementar a lógica de exportação CSV
    } else {
      toast.success(`Exportando ${estoque} em formato PDF...`);
      // Aqui você pode implementar a lógica de exportação PDF
    }
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
          <h1 className="text-3xl font-bold text-foreground">
            Gerenciamento de Cargas
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle de estoque e movimentação de produtos
          </p>
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
                <div
                  key={alerta.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <div>
                      <p className="font-medium">{alerta.produto}</p>
                      <p className="text-sm text-muted-foreground">
                        {alerta.mensagem}
                      </p>
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

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">
              {entradasEstoquePrimario.length}
            </p>
            <p className="text-sm text-muted-foreground">Entradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingDown className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-warning">
              {entradasEstoquePrimario.reduce(
                (acc, e) => acc + e.saldoAtual,
                0
              )}
            </p>
            <p className="text-sm text-muted-foreground">Saldo Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold text-destructive">
              {
                entradasEstoquePrimario.filter(
                  (e) =>
                    new Date(e.validade) <
                    new Date(new Date().setDate(new Date().getDate() + 30))
                ).length
              }
            </p>
            <p className="text-sm text-muted-foreground">Vencendo</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">
              {new Set(entradasEstoquePrimario.map((e) => e.idItem)).size}
            </p>
            <p className="text-sm text-muted-foreground">Itens Únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="primario">Est. Primário</TabsTrigger>
          <TabsTrigger value="tecnico">Est. Técnico</TabsTrigger>
          <TabsTrigger value="fracionario">Est. Fracionário</TabsTrigger>
        </TabsList>

        {/* Tab Estoque Primário */}
        <TabsContent value="primario" className="space-y-6">
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
                    placeholder="Buscar por nota, item, lote ou localização"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Importar</span>
                    <span className="sm:hidden">Importar</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setXmlDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar XML/NF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCsvDialogOpen(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Importar CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                    <span className="sm:hidden">Exportar</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleExportar("csv", "primario")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExportar("pdf", "primario")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Nova Entrada</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Registrar Nova Entrada</DialogTitle>
                  <DialogDescription>
                    Registre uma nova entrada de produto no estoque.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nota">Número da Nota *</Label>
                      <Input
                        id="nota"
                        type="number"
                        value={novaCarga.nota}
                        onChange={(e) =>
                          setNovaCarga({ ...novaCarga, nota: e.target.value })
                        }
                        placeholder="999999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idFornecedor">Fornecedor *</Label>
                      <Select
                        value={novaCarga.idFornecedor}
                        onValueChange={(value) =>
                          setNovaCarga({ ...novaCarga, idFornecedor: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Fornecedor A</SelectItem>
                          <SelectItem value="2">Fornecedor B</SelectItem>
                          <SelectItem value="3">Fornecedor C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataEntrada">Data de Entrada *</Label>
                      <Input
                        id="dataEntrada"
                        type="date"
                        value={novaCarga.dataEntrada}
                        onChange={(e) =>
                          setNovaCarga({
                            ...novaCarga,
                            dataEntrada: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idItem">Item *</Label>
                      <Select
                        value={novaCarga.idItem}
                        onValueChange={(value) =>
                          setNovaCarga({ ...novaCarga, idItem: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1005392">
                            U 46 BR (1005392)
                          </SelectItem>
                          <SelectItem value="1027638">DEZ (1027638)</SelectItem>
                          <SelectItem value="1027636">
                            MIRANT (1027636)
                          </SelectItem>
                          <SelectItem value="1003390">
                            FERTILIZANTE (1003390)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lote">Número do Lote</Label>
                      <Input
                        id="lote"
                        value={novaCarga.lote}
                        onChange={(e) =>
                          setNovaCarga({ ...novaCarga, lote: e.target.value })
                        }
                        placeholder="NR42123259600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="qtde">Quantidade *</Label>
                      <Input
                        id="qtde"
                        type="number"
                        value={novaCarga.qtde}
                        onChange={(e) =>
                          setNovaCarga({ ...novaCarga, qtde: e.target.value })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unidade">Unidade *</Label>
                      <Select
                        value={novaCarga.unidade}
                        onValueChange={(value) =>
                          setNovaCarga({ ...novaCarga, unidade: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LITROS">
                            Litros (LITROS)
                          </SelectItem>
                          <SelectItem value="KILOS">Quilos (KILOS)</SelectItem>
                          <SelectItem value="UNIDADES">
                            Unidades (UNIDADES)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="validade">Data de Validade</Label>
                      <Input
                        id="validade"
                        type="date"
                        value={novaCarga.validade}
                        onChange={(e) =>
                          setNovaCarga({
                            ...novaCarga,
                            validade: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipoEmbalagem">Tipo de Embalagem</Label>
                      <Input
                        id="tipoEmbalagem"
                        value={novaCarga.tipoEmbalagem}
                        onChange={(e) =>
                          setNovaCarga({
                            ...novaCarga,
                            tipoEmbalagem: e.target.value,
                          })
                        }
                        placeholder="IBCS1000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qtdeEmbalagem">
                        Quantidade de Embalagens
                      </Label>
                      <Input
                        id="qtdeEmbalagem"
                        type="number"
                        value={novaCarga.qtdeEmbalagem}
                        onChange={(e) =>
                          setNovaCarga({
                            ...novaCarga,
                            qtdeEmbalagem: e.target.value,
                          })
                        }
                        placeholder="5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capEmbalagem">
                        Capacidade da Embalagem
                      </Label>
                      <Input
                        id="capEmbalagem"
                        type="number"
                        value={novaCarga.capEmbalagem}
                        onChange={(e) =>
                          setNovaCarga({
                            ...novaCarga,
                            capEmbalagem: e.target.value,
                          })
                        }
                        placeholder="1000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="saldoAtual">Saldo Atual</Label>
                      <Input
                        id="saldoAtual"
                        type="number"
                        value={novaCarga.saldoAtual}
                        onChange={(e) =>
                          setNovaCarga({
                            ...novaCarga,
                            saldoAtual: e.target.value,
                          })
                        }
                        placeholder="Deixe vazio para usar a quantidade"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="localizacao">Localização</Label>
                      <Input
                        id="localizacao"
                        value={novaCarga.localizacao}
                        onChange={(e) =>
                          setNovaCarga({
                            ...novaCarga,
                            localizacao: e.target.value,
                          })
                        }
                        placeholder="ARM-001"
                      />
                    </div>
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

          {/* Tabela de Entradas */}
          <Card>
            <CardHeader>
              <CardTitle>Estoque Primário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader
                        sortKey="nota"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Nota
                      </SortableHeader>
                      <SortableHeader
                        sortKey="dataEntrada"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Data Entrada
                      </SortableHeader>
                      <SortableHeader
                        sortKey="idItem"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Item
                      </SortableHeader>
                      <SortableHeader
                        sortKey="qtde"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Quantidade
                      </SortableHeader>
                      <SortableHeader
                        sortKey="saldoAtual"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Saldo Atual
                      </SortableHeader>
                      <SortableHeader
                        sortKey="localizacao"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Localização
                      </SortableHeader>
                      <SortableHeader
                        sortKey="validade"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Validade
                      </SortableHeader>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntradas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <p className="text-muted-foreground">
                            Nenhuma entrada encontrada
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEntradas.map((entrada, index) => {
                        const material = materiaisAgricolas[entrada.idItem];
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {entrada.nota}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(entrada.dataEntrada).toLocaleDateString(
                                "pt-BR"
                              )}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {material?.nomeComercial ||
                                    material?.descricao ||
                                    "Item não encontrado"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {entrada.idItem}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {entrada.qtde} {entrada.unidade}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {entrada.saldoAtual} {entrada.unidade}
                              </span>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {entrada.localizacao}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(entrada.validade).toLocaleDateString(
                                "pt-BR"
                              )}
                            </TableCell>
                            <TableCell className="text-left">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVerDetalhes(entrada)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditarEntrada(entrada)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMovimentarItem(entrada)}
                                  title="Movimentar item"
                                >
                                  <ArrowUpDown className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
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
            <Dialog
              open={requisicaoDialogOpen}
              onOpenChange={setRequisicaoDialogOpen}
            >
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
                      <Select
                        value={novaRequisicao.hardware}
                        onValueChange={(value) =>
                          setNovaRequisicao({
                            ...novaRequisicao,
                            hardware: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smart-calda-01">
                            Smart Calda 01
                          </SelectItem>
                          <SelectItem value="smart-calda-02">
                            Smart Calda 02
                          </SelectItem>
                          <SelectItem value="smart-calda-03">
                            Smart Calda 03
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Produto</Label>
                      <Select
                        value={novaRequisicao.produto}
                        onValueChange={(value) =>
                          setNovaRequisicao({
                            ...novaRequisicao,
                            produto: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="herbicida-queima">
                            HERBICIDA QUEIMA
                          </SelectItem>
                          <SelectItem value="fertilizante">
                            FERTILIZANTE OPÇÃO
                          </SelectItem>
                          <SelectItem value="herbicida-pre">
                            HERBICIDA PRE EMER
                          </SelectItem>
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
                        onChange={(e) =>
                          setNovaRequisicao({
                            ...novaRequisicao,
                            quantidadeSolicitada: e.target.value,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={novaRequisicao.prioridade}
                        onValueChange={(value) =>
                          setNovaRequisicao({
                            ...novaRequisicao,
                            prioridade: value,
                          })
                        }
                      >
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
                      onChange={(e) =>
                        setNovaRequisicao({
                          ...novaRequisicao,
                          observacoes: e.target.value,
                        })
                      }
                      placeholder="Observações"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCriarRequisicao}>
                    Criar Requisição
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
                      <TableCell className="font-medium">
                        {req.hardware}
                      </TableCell>
                      <TableCell>{req.produto}</TableCell>
                      <TableCell>{req.quantidadeSolicitada}L</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            req.status === "pendente" ? "secondary" : "default"
                          }
                        >
                          {req.status === "pendente" ? "Pendente" : "Aprovada"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPrioridadeBadge(req.prioridade)}>
                          {req.prioridade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {req.dataRequisicao}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {req.status === "pendente" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                toast.success("Requisição aprovada!")
                              }
                            >
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

        {/* Tab Estoque Técnico */}
        <TabsContent value="tecnico" className="space-y-6">
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
                    placeholder="Buscar por item, lote ou localização"
                    value={searchTermTecnico}
                    onChange={(e) => setSearchTermTecnico(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Importar</span>
                    <span className="sm:hidden">Importar</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setXmlDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar XML/NF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCsvDialogOpen(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Importar CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                    <span className="sm:hidden">Exportar</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleExportar("csv", "tecnico")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExportar("pdf", "tecnico")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tabela de Estoque Técnico */}
          <Card>
            <CardHeader>
              <CardTitle>Estoque Técnico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader
                        sortKey="idItem"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Item
                      </SortableHeader>
                      <SortableHeader
                        sortKey="nLote"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Nº Lote
                      </SortableHeader>
                      <SortableHeader
                        sortKey="idLocalizacao"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Localização
                      </SortableHeader>
                      <SortableHeader
                        sortKey="saldoMovimentacao"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Saldo Movimentação
                      </SortableHeader>
                      <SortableHeader
                        sortKey="saldoDispon"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Saldo Disponível
                      </SortableHeader>
                      <SortableHeader
                        sortKey="unidade"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Unidade
                      </SortableHeader>
                      <SortableHeader
                        sortKey="dataUso"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Data de Uso
                      </SortableHeader>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEstoqueTecnico.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <p className="text-muted-foreground">
                            Nenhum item encontrado
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEstoqueTecnico.map((item) => {
                        const material = materiaisAgricolas[item.idItem];
                        const loc = localizacoes[item.idLocalizacao];
                        return (
                          <TableRow key={item.idEstoque}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {material?.nomeComercial ||
                                    material?.descricao ||
                                    "Item não encontrado"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.idItem}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {item.nLote}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {loc?.codigo || "-"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {loc?.descricao || "-"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {item.saldoMovimentacao} {item.unidade}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {item.saldoDispon} {item.unidade}
                              </span>
                            </TableCell>
                            <TableCell>{item.unidade}</TableCell>
                            <TableCell className="text-sm">
                              {item.dataUso
                                ? new Date(item.dataUso).toLocaleDateString(
                                    "pt-BR"
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell className="text-left">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVerDetalhesTecnico(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Estoque Fracionário */}
        <TabsContent value="fracionario" className="space-y-6">
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
                    placeholder="Buscar por item, lote ou localização"
                    value={searchTermFracionario}
                    onChange={(e) => setSearchTermFracionario(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Importar</span>
                    <span className="sm:hidden">Importar</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setXmlDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar XML/NF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCsvDialogOpen(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Importar CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Exportar</span>
                    <span className="sm:hidden">Exportar</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleExportar("csv", "fracionario")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExportar("pdf", "fracionario")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tabela de Estoque Fracionário */}
          <Card>
            <CardHeader>
              <CardTitle>Estoque Fracionário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader
                        sortKey="idItem"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Item
                      </SortableHeader>
                      <SortableHeader
                        sortKey="nLote"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Nº Lote
                      </SortableHeader>
                      <SortableHeader
                        sortKey="idLocalizacao"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Localização
                      </SortableHeader>
                      <SortableHeader
                        sortKey="saldoMovimentacao"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Saldo Movimentação
                      </SortableHeader>
                      <SortableHeader
                        sortKey="saldoDispon"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Saldo Disponível
                      </SortableHeader>
                      <SortableHeader
                        sortKey="unidade"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Unidade
                      </SortableHeader>
                      <SortableHeader
                        sortKey="dataUso"
                        onSort={handleSort}
                        sortConfig={sortConfig}
                      >
                        Data de Uso
                      </SortableHeader>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEstoqueFracionario.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <p className="text-muted-foreground">
                            Nenhum item encontrado
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEstoqueFracionario.map((item) => {
                        const material = materiaisAgricolas[item.idItem];
                        const loc = localizacoes[item.idLocalizacao];
                        return (
                          <TableRow key={item.idEstoque}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {material?.nomeComercial ||
                                    material?.descricao ||
                                    "Item não encontrado"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.idItem}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {item.nLote}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {loc?.codigo || "-"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {loc?.descricao || "-"}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {item.saldoMovimentacao} {item.unidade}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {item.saldoDispon} {item.unidade}
                              </span>
                            </TableCell>
                            <TableCell>{item.unidade}</TableCell>
                            <TableCell className="text-sm">
                              {item.dataUso
                                ? new Date(item.dataUso).toLocaleDateString(
                                    "pt-BR"
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell className="text-left">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleVerDetalhesFracionario(item)
                                }
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Edição - Estoque Primário */}
      <Dialog open={editarDialogOpen} onOpenChange={setEditarDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Entrada - Estoque Primário</DialogTitle>
            <DialogDescription>
              Edite as informações da entrada de produto no estoque.
            </DialogDescription>
          </DialogHeader>
          {entradaEditando && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nota">Número da Nota *</Label>
                  <Input
                    id="edit-nota"
                    type="number"
                    value={entradaEditando.nota}
                    onChange={(e) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        nota: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-idFornecedor">Fornecedor *</Label>
                  <Select
                    value={entradaEditando.idFornecedor.toString()}
                    onValueChange={(value) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        idFornecedor: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Fornecedor A</SelectItem>
                      <SelectItem value="2">Fornecedor B</SelectItem>
                      <SelectItem value="3">Fornecedor C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dataEntrada">Data de Entrada *</Label>
                  <Input
                    id="edit-dataEntrada"
                    type="date"
                    value={entradaEditando.dataEntrada}
                    onChange={(e) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        dataEntrada: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-idItem">Item *</Label>
                  <Select
                    value={entradaEditando.idItem.toString()}
                    onValueChange={(value) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        idItem: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1005392">U 46 BR (1005392)</SelectItem>
                      <SelectItem value="1027638">DEZ (1027638)</SelectItem>
                      <SelectItem value="1027636">MIRANT (1027636)</SelectItem>
                      <SelectItem value="1003390">
                        FERTILIZANTE (1003390)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lote">Número do Lote</Label>
                  <Input
                    id="edit-lote"
                    value={entradaEditando.lote}
                    onChange={(e) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        lote: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-qtde">Quantidade *</Label>
                  <Input
                    id="edit-qtde"
                    type="number"
                    value={entradaEditando.qtde}
                    onChange={(e) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        qtde: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unidade">Unidade *</Label>
                  <Select
                    value={entradaEditando.unidade}
                    onValueChange={(value) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        unidade: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LITROS">Litros (LITROS)</SelectItem>
                      <SelectItem value="KILOS">Quilos (KILOS)</SelectItem>
                      <SelectItem value="UNIDADES">
                        Unidades (UNIDADES)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-validade">Data de Validade</Label>
                  <Input
                    id="edit-validade"
                    type="date"
                    value={entradaEditando.validade}
                    onChange={(e) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        validade: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tipoEmbalagem">Tipo de Embalagem</Label>
                  <Input
                    id="edit-tipoEmbalagem"
                    value={entradaEditando.tipoEmbalagem}
                    onChange={(e) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        tipoEmbalagem: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-qtdeEmbalagem">
                    Quantidade de Embalagens
                  </Label>
                  <Input
                    id="edit-qtdeEmbalagem"
                    type="number"
                    value={entradaEditando.qtdeEmbalagem}
                    onChange={(e) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        qtdeEmbalagem: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-capEmbalagem">
                    Capacidade da Embalagem
                  </Label>
                  <Input
                    id="edit-capEmbalagem"
                    type="number"
                    value={entradaEditando.capEmbalagem}
                    onChange={(e) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        capEmbalagem: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-saldoAtual">Saldo Atual</Label>
                  <Input
                    id="edit-saldoAtual"
                    type="number"
                    value={entradaEditando.saldoAtual}
                    onChange={(e) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        saldoAtual: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-localizacao">Localização</Label>
                  <Input
                    id="edit-localizacao"
                    value={entradaEditando.localizacao}
                    onChange={(e) =>
                      setEntradaEditando({
                        ...entradaEditando,
                        localizacao: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditarDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSalvarEdicao}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes - Estoque Técnico */}
      <Dialog
        open={detalhesTecnicoDialogOpen}
        onOpenChange={setDetalhesTecnicoDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes - Estoque Técnico</DialogTitle>
            <DialogDescription>
              Informações completas do item em estoque técnico
            </DialogDescription>
          </DialogHeader>
          {itemSelecionado && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-muted-foreground">ID Estoque</Label>
                <p className="text-sm font-medium">
                  {itemSelecionado.idEstoque}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">ID Item</Label>
                <p className="text-sm font-medium">{itemSelecionado.idItem}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Item</Label>
                <p className="text-sm font-medium">
                  {materiaisAgricolas[itemSelecionado.idItem]?.nomeComercial ||
                    materiaisAgricolas[itemSelecionado.idItem]?.descricao ||
                    "Item não encontrado"}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Nº Lote</Label>
                <p className="text-sm font-medium font-mono">
                  {itemSelecionado.nLote}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">ID Localização</Label>
                <p className="text-sm font-medium">
                  {itemSelecionado.idLocalizacao}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Localização</Label>
                <p className="text-sm font-medium">
                  {localizacoes[itemSelecionado.idLocalizacao]?.codigo || "-"} -{" "}
                  {localizacoes[itemSelecionado.idLocalizacao]?.descricao ||
                    "-"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Saldo Movimentação
                </Label>
                <p className="text-sm font-medium">
                  {itemSelecionado.saldoMovimentacao} {itemSelecionado.unidade}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Saldo Disponível
                </Label>
                <p className="text-sm font-medium">
                  {itemSelecionado.saldoDispon} {itemSelecionado.unidade}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Unidade</Label>
                <p className="text-sm font-medium">{itemSelecionado.unidade}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data de Uso</Label>
                <p className="text-sm font-medium">
                  {itemSelecionado.dataUso
                    ? new Date(itemSelecionado.dataUso).toLocaleDateString(
                        "pt-BR"
                      )
                    : "Não utilizado"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes - Estoque Fracionário */}
      <Dialog
        open={detalhesFracionarioDialogOpen}
        onOpenChange={setDetalhesFracionarioDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes - Estoque Fracionário</DialogTitle>
            <DialogDescription>
              Informações completas do item em estoque fracionário
            </DialogDescription>
          </DialogHeader>
          {itemSelecionado && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-muted-foreground">ID Estoque</Label>
                <p className="text-sm font-medium">
                  {itemSelecionado.idEstoque}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">ID Item</Label>
                <p className="text-sm font-medium">{itemSelecionado.idItem}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Item</Label>
                <p className="text-sm font-medium">
                  {materiaisAgricolas[itemSelecionado.idItem]?.nomeComercial ||
                    materiaisAgricolas[itemSelecionado.idItem]?.descricao ||
                    "Item não encontrado"}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Nº Lote</Label>
                <p className="text-sm font-medium font-mono">
                  {itemSelecionado.nLote}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">ID Localização</Label>
                <p className="text-sm font-medium">
                  {itemSelecionado.idLocalizacao}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Localização</Label>
                <p className="text-sm font-medium">
                  {localizacoes[itemSelecionado.idLocalizacao]?.codigo || "-"} -{" "}
                  {localizacoes[itemSelecionado.idLocalizacao]?.descricao ||
                    "-"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Saldo Movimentação
                </Label>
                <p className="text-sm font-medium">
                  {itemSelecionado.saldoMovimentacao} {itemSelecionado.unidade}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Saldo Disponível
                </Label>
                <p className="text-sm font-medium">
                  {itemSelecionado.saldoDispon} {itemSelecionado.unidade}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Unidade</Label>
                <p className="text-sm font-medium">{itemSelecionado.unidade}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data de Uso</Label>
                <p className="text-sm font-medium">
                  {itemSelecionado.dataUso
                    ? new Date(itemSelecionado.dataUso).toLocaleDateString(
                        "pt-BR"
                      )
                    : "Não utilizado"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialogs de Importação */}
      <Dialog open={xmlDialogOpen} onOpenChange={setXmlDialogOpen}>
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

      <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar CSV</DialogTitle>
            <DialogDescription>
              Importe entradas automaticamente via arquivo CSV
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Arraste e solte ou clique para selecionar
              </p>
              <Button variant="outline">Selecionar Arquivo</Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleImportarCSV}>Importar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Movimentação - Estoque Primário */}
      <Dialog
        open={movimentarDialogOpen}
        onOpenChange={setMovimentarDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Movimentar Item - Estoque Primário</DialogTitle>
            <DialogDescription>
              Realize uma movimentação de estoque para este item
            </DialogDescription>
          </DialogHeader>
          {entradaMovimentando && (
            <div className="grid gap-4 py-4">
              {/* Informações do Item */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Item</Label>
                  <p className="text-sm font-medium">
                    {materiaisAgricolas[entradaMovimentando.idItem]
                      ?.nomeComercial ||
                      materiaisAgricolas[entradaMovimentando.idItem]
                        ?.descricao ||
                      "Item não encontrado"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Saldo Atual</Label>
                  <p className="text-sm font-medium">
                    {entradaMovimentando.saldoAtual}{" "}
                    {entradaMovimentando.unidade}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Lote</Label>
                  <p className="text-sm font-mono">
                    {entradaMovimentando.lote}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mov-tipo">Tipo de Movimentação *</Label>
                <Select
                  value={movimentacaoForm.tipoMovimento}
                  onValueChange={(value) => {
                    setMovimentacaoForm({
                      ...movimentacaoForm,
                      tipoMovimento: value,
                      idLocDestino: "", // Resetar destino ao mudar tipo
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de movimentação" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMovimentacoes.map((tipo, index) => (
                      <SelectItem key={index} value={tipo.nome}>
                        {tipo.nome} ({tipo.origem} → {tipo.destino})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {movimentacaoForm.tipoMovimento &&
                getLocalizacoesDestino(movimentacaoForm.tipoMovimento).length >
                  0 && (
                  <div className="space-y-2">
                    <Label htmlFor="mov-destino">
                      Localização de Destino *
                    </Label>
                    <Select
                      value={movimentacaoForm.idLocDestino}
                      onValueChange={(value) =>
                        setMovimentacaoForm({
                          ...movimentacaoForm,
                          idLocDestino: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a localização de destino" />
                      </SelectTrigger>
                      <SelectContent>
                        {getLocalizacoesDestino(
                          movimentacaoForm.tipoMovimento
                        ).map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.codigo} - {loc.descricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

              <div className="space-y-2">
                <Label htmlFor="mov-qtde">Quantidade *</Label>
                <Input
                  id="mov-qtde"
                  type="number"
                  value={movimentacaoForm.qtde}
                  onChange={(e) =>
                    setMovimentacaoForm({
                      ...movimentacaoForm,
                      qtde: e.target.value,
                    })
                  }
                  placeholder={`Máximo: ${entradaMovimentando.saldoAtual} ${entradaMovimentando.unidade}`}
                  max={entradaMovimentando.saldoAtual}
                />
                <p className="text-xs text-muted-foreground">
                  Saldo disponível: {entradaMovimentando.saldoAtual}{" "}
                  {entradaMovimentando.unidade}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mov-observacoes">Observações (opcional)</Label>
                <Textarea
                  id="mov-observacoes"
                  value={movimentacaoForm.observacoes}
                  onChange={(e) =>
                    setMovimentacaoForm({
                      ...movimentacaoForm,
                      observacoes: e.target.value,
                    })
                  }
                  placeholder="Adicione observações sobre a movimentação"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setMovimentarDialogOpen(false);
                setEntradaMovimentando(null);
                setMovimentacaoForm({
                  tipoMovimento: "",
                  idLocDestino: "",
                  qtde: "",
                  observacoes: "",
                });
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSalvarMovimentacao}>
              Confirmar Movimentação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes - Estoque Primário */}
      <Dialog open={detalhesDialogOpen} onOpenChange={setDetalhesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Entrada - Estoque Primário</DialogTitle>
            <DialogDescription>
              Informações completas da entrada de nota fiscal
            </DialogDescription>
          </DialogHeader>
          {entradaSelecionada && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-muted-foreground">Nota Fiscal</Label>
                <p className="text-sm font-medium">{entradaSelecionada.nota}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data de Entrada</Label>
                <p className="text-sm font-medium">
                  {new Date(entradaSelecionada.dataEntrada).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">ID Item</Label>
                <p className="text-sm font-medium">
                  {entradaSelecionada.idItem}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Item</Label>
                <p className="text-sm font-medium">
                  {materiaisAgricolas[entradaSelecionada.idItem]
                    ?.nomeComercial ||
                    materiaisAgricolas[entradaSelecionada.idItem]?.descricao ||
                    "Item não encontrado"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">ID Fornecedor</Label>
                <p className="text-sm font-medium">
                  {entradaSelecionada.idFornecedor} -{" "}
                  {fornecedores[entradaSelecionada.idFornecedor] ||
                    "Não identificado"}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Lote</Label>
                <p className="text-sm font-medium font-mono">
                  {entradaSelecionada.lote}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Quantidade</Label>
                <p className="text-sm font-medium">
                  {entradaSelecionada.qtde} {entradaSelecionada.unidade}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Unidade</Label>
                <p className="text-sm font-medium">
                  {entradaSelecionada.unidade}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Saldo Atual</Label>
                <p className="text-sm font-medium">
                  {entradaSelecionada.saldoAtual} {entradaSelecionada.unidade}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Validade</Label>
                <p className="text-sm font-medium">
                  {new Date(entradaSelecionada.validade).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Tipo de Embalagem
                </Label>
                <p className="text-sm font-medium">
                  {entradaSelecionada.tipoEmbalagem}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Qtd. Embalagem</Label>
                <p className="text-sm font-medium">
                  {entradaSelecionada.qtdeEmbalagem}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Capacidade Embalagem
                </Label>
                <p className="text-sm font-medium">
                  {entradaSelecionada.capEmbalagem}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Localização</Label>
                <p className="text-sm font-medium font-mono">
                  {entradaSelecionada.localizacao}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cargas;
