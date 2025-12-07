import { useState, useEffect } from "react";
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
  Download,
  ArrowUpDown,
  Trash2,
  ChevronRight,
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
  [key: number]: {
    codigo: string;
    descricao: string;
    nomeComercial: string;
    categoriaId?: number;
  };
} = {
  1005392: {
    codigo: "1005392",
    descricao: "HERBICIDA NUFARM U 46 BR",
    nomeComercial: "U 46 BR",
    categoriaId: 69,
  },
  1027638: {
    codigo: "1027638",
    descricao: "HERBICIDA UPL DEZ",
    nomeComercial: "DEZ",
    categoriaId: 69,
  },
  1027636: {
    codigo: "1027636",
    descricao: "HERBICIDA IHARA MIRANT",
    nomeComercial: "MIRANT",
    categoriaId: 69,
  },
  1003390: {
    codigo: "1003390",
    descricao: "FERTILIZANTE",
    nomeComercial: "FERTILIZANTE",
    categoriaId: 617,
  },
};

// Mapeamento de classes (baseado em InsumosAgricolas.tsx)
const classes: {
  [key: number]: { identificacao: string; nomeClasse: string };
} = {
  1: {
    identificacao: "CLS-001",
    nomeClasse: "Herbicidas",
  },
  2: {
    identificacao: "CLS-002",
    nomeClasse: "Fertilizantes",
  },
  3: {
    identificacao: "CLS-003",
    nomeClasse: "Inseticidas",
  },
};

// Mapeamento de categorias (baseado em InsumosAgricolas.tsx)
const categorias: {
  [key: number]: {
    codigo: string;
    descricaoResumida: string;
    classeId: number;
  };
} = {
  69: {
    codigo: "69",
    descricaoResumida: "Herbicida 2,4 D-DIMETILAM 806 G/L",
    classeId: 1,
  },
  617: {
    codigo: "617",
    descricaoResumida: "Fertilizante (Adubo)",
    classeId: 2,
  },
  3001: {
    codigo: "3001",
    descricaoResumida: "Herbicida Tebuthiuron 500 G/L",
    classeId: 1,
  },
  5027: {
    codigo: "5027",
    descricaoResumida: "Formicida Isca Sulfluramida",
    classeId: 3,
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

// Mapeamento de tipos de embalagem (cadastro do sistema)
const tiposEmbalagem: {
  [key: number]: { codigo: string; descricao: string; capacidade: number };
} = {
  1: {
    codigo: "IBCS1000",
    descricao: "IBC 1000L",
    capacidade: 1000,
  },
  2: {
    codigo: "IBCS1001",
    descricao: "IBC 1000L Tipo 2",
    capacidade: 1000,
  },
  3: {
    codigo: "BAGS500",
    descricao: "Saco 500kg",
    capacidade: 500,
  },
  4: {
    codigo: "GALÃO20L",
    descricao: "Galão 20L",
    capacidade: 20,
  },
  5: {
    codigo: "BALDE5L",
    descricao: "Balde 5L",
    capacidade: 5,
  },
  6: {
    codigo: "BALDE10L",
    descricao: "Balde 10L",
    capacidade: 10,
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
  ativo: boolean;
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

const Estoques = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requisicaoDialogOpen, setRequisicaoDialogOpen] = useState(false);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [movimentarDialogOpen, setMovimentarDialogOpen] = useState(false);
  const [tipoEstoqueMovimentando, setTipoEstoqueMovimentando] = useState<
    "primario" | "tecnico" | "fracionario"
  >("primario");
  const [
    itemMovimentandoTecnicoFracionario,
    setItemMovimentandoTecnicoFracionario,
  ] = useState<EstoqueTecnicoFracionario | null>(null);
  const [entradaSelecionada, setEntradaSelecionada] =
    useState<EntradaNotaFiscal | null>(null);
  const [entradaMovimentando, setEntradaMovimentando] =
    useState<EntradaNotaFiscal | null>(null);
  const [idItemMovimentacao, setIdItemMovimentacao] = useState<number | null>(
    null
  );
  const [mostrarAlertaVencimento, setMostrarAlertaVencimento] = useState(false);
  const [entradaSelecionadaAlerta, setEntradaSelecionadaAlerta] =
    useState<string>("");
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

  // Estado para controlar quais itens estão expandidos no estoque primário
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Estado para controlar quais itens estão expandidos no estoque técnico
  const [expandedItemsTecnico, setExpandedItemsTecnico] = useState<Set<number>>(
    new Set()
  );

  // Estado para controlar quais itens estão expandidos no estoque fracionário
  const [expandedItemsFracionario, setExpandedItemsFracionario] = useState<
    Set<number>
  >(new Set());

  const [entradasEstoquePrimario, setEntradasEstoquePrimario] = useState<
    EntradaNotaFiscal[]
  >([
    // Nota Fiscal 999999 - Fornecedor A
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
      ativo: true,
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
      ativo: true,
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
      ativo: true,
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
      ativo: true,
    },
    // Nota Fiscal 1000123 - Fornecedor A - Mais itens do mesmo produto
    {
      nota: 1000123,
      idFornecedor: 1,
      dataEntrada: "2025-10-15",
      idItem: 1005392,
      lote: "NR42123259700",
      qtde: 3000,
      unidade: "LITROS",
      validade: "2026-11-15",
      tipoEmbalagem: "IBCS1000",
      qtdeEmbalagem: 3,
      capEmbalagem: 1000,
      saldoAtual: 2500,
      localizacao: "ARM-001",
      ativo: true,
    },
    {
      nota: 1000123,
      idFornecedor: 1,
      dataEntrada: "2025-10-15",
      idItem: 1005392,
      lote: "NR42123259800",
      qtde: 2000,
      unidade: "LITROS",
      validade: "2026-11-20",
      tipoEmbalagem: "IBCS1000",
      qtdeEmbalagem: 2,
      capEmbalagem: 1000,
      saldoAtual: 0,
      localizacao: "ARM-001",
      ativo: false, // Saldo zerado
    },
    // Nota Fiscal 1000456 - Fornecedor B
    {
      nota: 1000456,
      idFornecedor: 2,
      dataEntrada: "2025-10-18",
      idItem: 1027638,
      lote: "SY003-24-20-161",
      qtde: 600,
      unidade: "KILOS",
      validade: "2025-12-18",
      tipoEmbalagem: "BAGS500",
      qtdeEmbalagem: 6,
      capEmbalagem: 100,
      saldoAtual: 450,
      localizacao: "ARM-002",
      ativo: true,
    },
    {
      nota: 1000456,
      idFornecedor: 2,
      dataEntrada: "2025-10-18",
      idItem: 1027636,
      lote: "005-22-12001",
      qtde: 200,
      unidade: "LITROS",
      validade: "2026-12-18",
      tipoEmbalagem: "GALÃO20L",
      qtdeEmbalagem: 25,
      capEmbalagem: 8,
      saldoAtual: 180,
      localizacao: "ARM-003",
      ativo: true,
    },
    // Nota Fiscal 1000789 - Fornecedor C
    {
      nota: 1000789,
      idFornecedor: 3,
      dataEntrada: "2025-10-20",
      idItem: 1003390,
      lote: "FERT-2025-001",
      qtde: 5000,
      unidade: "LITROS",
      validade: "2027-01-20",
      tipoEmbalagem: "IBCS1001",
      qtdeEmbalagem: 5,
      capEmbalagem: 1000,
      saldoAtual: 4800,
      localizacao: "ARM-003",
      ativo: true,
    },
    {
      nota: 1000789,
      idFornecedor: 3,
      dataEntrada: "2025-10-20",
      idItem: 1027636,
      lote: "005-22-12002",
      qtde: 300,
      unidade: "LITROS",
      validade: "2026-12-20",
      tipoEmbalagem: "GALÃO20L",
      qtdeEmbalagem: 30,
      capEmbalagem: 10,
      saldoAtual: 250,
      localizacao: "ARM-003",
      ativo: true,
    },
    // Nota Fiscal 1001111 - Fornecedor A - Lote já usado (inativo)
    {
      nota: 1001111,
      idFornecedor: 1,
      dataEntrada: "2025-09-10",
      idItem: 1005392,
      lote: "NR42123259500",
      qtde: 4000,
      unidade: "LITROS",
      validade: "2026-09-10",
      tipoEmbalagem: "IBCS1000",
      qtdeEmbalagem: 4,
      capEmbalagem: 1000,
      saldoAtual: 0,
      localizacao: "ARM-001",
      ativo: false, // Saldo zerado
    },
    // Nota Fiscal 1001234 - Fornecedor B
    {
      nota: 1001234,
      idFornecedor: 2,
      dataEntrada: "2025-10-22",
      idItem: 1027638,
      lote: "SY003-24-20-162",
      qtde: 1000,
      unidade: "KILOS",
      validade: "2026-01-22",
      tipoEmbalagem: "BAGS500",
      qtdeEmbalagem: 10,
      capEmbalagem: 100,
      saldoAtual: 850,
      localizacao: "ARM-002",
      ativo: true,
    },
  ]);

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

  // Tipos de movimentações entre Técnico e Fracionário
  const tiposMovimentacoesTecnicoFracionario = [
    {
      nome: "TÉCNICO-FRACIONÁRIO",
      origem: "TÉCNICO",
      destino: "FRACIONÁRIO",
      acao: "SUBTRAIR",
      tipo: "saida",
    },
    {
      nome: "FRACIONÁRIO-TÉCNICO",
      origem: "FRACIONÁRIO",
      destino: "TÉCNICO",
      acao: "SUBTRAIR",
      tipo: "saida",
    },
  ];

  const [movimentacaoForm, setMovimentacaoForm] = useState({
    entradaId: "", // ID único da entrada (nota + idItem + lote)
    tipoMovimento: "",
    idLocDestino: "",
    qtde: "",
    observacoes: "",
  });

  // Função para gerar ID único da entrada usando separador que não aparece em lotes
  const gerarIdEntrada = (entrada: EntradaNotaFiscal): string => {
    // Usar "|||" como separador que não aparece em lotes, notas ou IDs
    return `${entrada.nota}|||${entrada.idItem}|||${entrada.lote}`;
  };

  // Função para obter entrada pelo ID
  const obterEntradaPorId = (id: string): EntradaNotaFiscal | null => {
    const partes = id.split("|||");
    if (partes.length !== 3) return null;

    const [nota, idItem, lote] = partes;
    return (
      entradasEstoquePrimario.find(
        (e) =>
          e.nota.toString() === nota &&
          e.idItem.toString() === idItem &&
          e.lote === lote
      ) || null
    );
  };

  // Obter entradas disponíveis para movimentação (apenas ativas com saldo > 0)
  // Filtrar por idItem se estiver movimentando um item específico
  const entradasDisponiveisMovimentacao = entradasEstoquePrimario
    .filter((e) => {
      const ativoComSaldo = e.ativo && e.saldoAtual > 0;
      if (idItemMovimentacao !== null) {
        return ativoComSaldo && e.idItem === idItemMovimentacao;
      }
      return ativoComSaldo;
    })
    .sort((a, b) => {
      // Ordenar por data de validade (mais próximo a vencer primeiro)
      const dataA = new Date(a.validade).getTime();
      const dataB = new Date(b.validade).getTime();
      return dataA - dataB;
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
    {
      id: 3,
      tipo: "estoque_baixo",
      produto: "HERBICIDA SELECT",
      mensagem: "Estoque crítico - reabastecer urgente",
      dataAlerta: "2024-01-22",
      prioridade: "alta",
    },
    {
      id: 4,
      tipo: "vencimento",
      produto: "ADUBO NPK 10-10-10",
      mensagem: "Produto vence em 15 dias",
      dataAlerta: "2024-01-19",
      prioridade: "alta",
    },
    {
      id: 5,
      tipo: "estoque_baixo",
      produto: "INSETICIDA BIOLÓGICO",
      mensagem: "Estoque abaixo do ponto de pedido",
      dataAlerta: "2024-01-18",
      prioridade: "media",
    },
    {
      id: 6,
      tipo: "vencimento",
      produto: "FUNGICIDA SISTÊMICO",
      mensagem: "Produto vence em 45 dias",
      dataAlerta: "2024-01-17",
      prioridade: "baixa",
    },
    {
      id: 7,
      tipo: "estoque_baixo",
      produto: "CORRETIVO DE SOLO",
      mensagem: "Estoque mínimo atingido",
      dataAlerta: "2024-01-23",
      prioridade: "media",
    },
    {
      id: 8,
      tipo: "vencimento",
      produto: "BIOESTIMULANTE",
      mensagem: "Produto vence em 7 dias",
      dataAlerta: "2024-01-24",
      prioridade: "alta",
    },
    {
      id: 9,
      tipo: "estoque_baixo",
      produto: "MICRONUTRIENTES",
      mensagem: "Estoque abaixo do mínimo",
      dataAlerta: "2024-01-16",
      prioridade: "media",
    },
    {
      id: 10,
      tipo: "vencimento",
      produto: "ADITIVO PARA CALDA",
      mensagem: "Produto vence em 20 dias",
      dataAlerta: "2024-01-15",
      prioridade: "baixa",
    },
    {
      id: 11,
      tipo: "estoque_baixo",
      produto: "DEFENSIVO AGRÍCOLA",
      mensagem: "Estoque crítico",
      dataAlerta: "2024-01-25",
      prioridade: "alta",
    },
    {
      id: 12,
      tipo: "vencimento",
      produto: "FERTILIZANTE LÍQUIDO",
      mensagem: "Produto vence em 10 dias",
      dataAlerta: "2024-01-14",
      prioridade: "alta",
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

  // Usar entradas do estado diretamente (status já é atualizado nas operações)
  const filteredEntradasRaw = entradasEstoquePrimario.filter((entrada) => {
    if (!searchTerm) return entrada.ativo; // Por padrão mostrar apenas ativos

    const material = materiaisAgricolas[entrada.idItem];
    const materialNome = material?.nomeComercial || material?.descricao || "";
    const materialCodigo = material?.codigo || "";
    const categoria = material?.categoriaId
      ? categorias[material.categoriaId]
      : null;
    const categoriaNome = categoria?.descricaoResumida || "";
    const categoriaCodigo = categoria?.codigo || "";
    const classe = categoria?.classeId ? classes[categoria.classeId] : null;
    const classeNome = classe?.nomeClasse || "";
    const classeIdentificacao = classe?.identificacao || "";

    const termoLower = searchTerm.toLowerCase();

    // Buscar por classe
    const matchesClasse =
      classeNome.toLowerCase().includes(termoLower) ||
      classeIdentificacao.toLowerCase().includes(termoLower);

    // Buscar por grupo/categoria
    const matchesGrupo =
      categoriaNome.toLowerCase().includes(termoLower) ||
      categoriaCodigo.toLowerCase().includes(termoLower);

    // Buscar por item
    const matchesItem =
      materialNome.toLowerCase().includes(termoLower) ||
      materialCodigo.toLowerCase().includes(termoLower) ||
      entrada.idItem.toString().includes(searchTerm);

    return (matchesClasse || matchesGrupo || matchesItem) && entrada.ativo;
  });

  const filteredEntradas = getSortedAndFilteredData(
    entradasEstoquePrimario,
    filteredEntradasRaw,
    "primario"
  );

  // Função para agrupar entradas por item
  const agruparEntradasPorItem = (entradas: EntradaNotaFiscal[]) => {
    const agrupadas: { [key: number]: EntradaNotaFiscal[] } = {};
    entradas.forEach((entrada) => {
      if (!agrupadas[entrada.idItem]) {
        agrupadas[entrada.idItem] = [];
      }
      agrupadas[entrada.idItem].push(entrada);
    });
    return agrupadas;
  };

  // Função para verificar se um item tem alguma entrada ativa
  const itemTemEntradaAtiva = (entradas: EntradaNotaFiscal[]): boolean => {
    return entradas.some((entrada) => entrada.ativo);
  };

  // Função para verificar se busca corresponde a um lote específico
  const buscaCorrespondeLote = (searchTerm: string): string | null => {
    if (!searchTerm) return null;
    const termoLower = searchTerm.toLowerCase();
    // Verificar se algum lote corresponde exatamente ou parcialmente
    const loteEncontrado = entradasEstoquePrimario.find((entrada) =>
      entrada.lote.toLowerCase().includes(termoLower)
    );
    return loteEncontrado ? loteEncontrado.lote : null;
  };

  // Função para calcular saldo total por item
  const calcularSaldoTotalPorItem = (entradas: EntradaNotaFiscal[]) => {
    return entradas.reduce((total, entrada) => total + entrada.saldoAtual, 0);
  };

  // Função para calcular saldo total por item (Estoque Técnico/Fracionário)
  const calcularSaldoTotalPorItemTecnicoFracionario = (
    itens: EstoqueTecnicoFracionario[]
  ) => {
    return itens.reduce((total, item) => total + item.saldoDispon, 0);
  };

  // Função para agrupar itens técnicos/fracionários por item
  const agruparItensPorItem = (itens: EstoqueTecnicoFracionario[]) => {
    const agrupadas: { [key: number]: EstoqueTecnicoFracionario[] } = {};
    itens.forEach((item) => {
      if (!agrupadas[item.idItem]) {
        agrupadas[item.idItem] = [];
      }
      agrupadas[item.idItem].push(item);
    });
    return agrupadas;
  };

  // Função para toggle de item expandido no estoque técnico
  const toggleItemTecnicoExpansao = (idItem: number) => {
    const novosExpandidos = new Set(expandedItemsTecnico);
    if (novosExpandidos.has(idItem)) {
      novosExpandidos.delete(idItem);
    } else {
      novosExpandidos.add(idItem);
    }
    setExpandedItemsTecnico(novosExpandidos);
  };

  // Função para toggle de item expandido no estoque fracionário
  const toggleItemFracionarioExpansao = (idItem: number) => {
    const novosExpandidos = new Set(expandedItemsFracionario);
    if (novosExpandidos.has(idItem)) {
      novosExpandidos.delete(idItem);
    } else {
      novosExpandidos.add(idItem);
    }
    setExpandedItemsFracionario(novosExpandidos);
  };

  // Função para toggle de item expandido no estoque primário
  const toggleItemEstoqueExpansao = (idItem: number) => {
    const novosExpandidos = new Set(expandedItems);
    if (novosExpandidos.has(idItem)) {
      novosExpandidos.delete(idItem);
    } else {
      novosExpandidos.add(idItem);
    }
    setExpandedItems(novosExpandidos);
  };

  // Obter entradas agrupadas por item
  const entradasAgrupadas = agruparEntradasPorItem(filteredEntradas);

  // Se busca por lote, mostrar apenas o item que contém esse lote
  const loteBuscado = buscaCorrespondeLote(searchTerm);
  let itensUnicos = Object.keys(entradasAgrupadas).map(Number);

  if (loteBuscado) {
    // Filtrar apenas itens que têm o lote buscado
    itensUnicos = itensUnicos.filter((idItem) =>
      entradasAgrupadas[idItem].some((entrada) =>
        entrada.lote.toLowerCase().includes(loteBuscado.toLowerCase())
      )
    );
  }

  // Expandir automaticamente os itens que contêm o lote buscado
  useEffect(() => {
    if (!searchTerm) return;

    const loteBuscadoLocal = buscaCorrespondeLote(searchTerm);
    if (!loteBuscadoLocal) return;

    // Recalcular entradas agrupadas e itens únicos
    const entradasAgrupadasLocal = agruparEntradasPorItem(filteredEntradas);
    const itensComLote = Object.keys(entradasAgrupadasLocal)
      .map(Number)
      .filter((idItem) =>
        entradasAgrupadasLocal[idItem].some((entrada) =>
          entrada.lote.toLowerCase().includes(loteBuscadoLocal.toLowerCase())
        )
      );

    if (itensComLote.length > 0) {
      setExpandedItems((prev) => {
        const novosExpandidos = new Set(prev);
        itensComLote.forEach((idItem) => {
          novosExpandidos.add(idItem);
        });
        // Só atualizar se houver mudança
        if (novosExpandidos.size !== prev.size) {
          return novosExpandidos;
        }
        return prev;
      });
    }
  }, [searchTerm, filteredEntradas.length]); // Depender do termo de busca e número de entradas

  const filteredEstoqueTecnicoRaw = estoqueTecnico.filter((item) => {
    if (!searchTermTecnico) return true;

    const material = materiaisAgricolas[item.idItem];
    const materialNome = material?.nomeComercial || material?.descricao || "";
    const materialCodigo = material?.codigo || "";
    const categoria = material?.categoriaId
      ? categorias[material.categoriaId]
      : null;
    const categoriaNome = categoria?.descricaoResumida || "";
    const categoriaCodigo = categoria?.codigo || "";
    const classe = categoria?.classeId ? classes[categoria.classeId] : null;
    const classeNome = classe?.nomeClasse || "";
    const classeIdentificacao = classe?.identificacao || "";

    const termoLower = searchTermTecnico.toLowerCase();

    // Buscar por classe
    const matchesClasse =
      classeNome.toLowerCase().includes(termoLower) ||
      classeIdentificacao.toLowerCase().includes(termoLower);

    // Buscar por grupo/categoria
    const matchesGrupo =
      categoriaNome.toLowerCase().includes(termoLower) ||
      categoriaCodigo.toLowerCase().includes(termoLower);

    // Buscar por item
    const matchesItem =
      materialNome.toLowerCase().includes(termoLower) ||
      materialCodigo.toLowerCase().includes(termoLower) ||
      item.idItem.toString().includes(searchTermTecnico);

    return matchesClasse || matchesGrupo || matchesItem;
  });

  const filteredEstoqueTecnico = getSortedAndFilteredData(
    estoqueTecnico,
    filteredEstoqueTecnicoRaw,
    "tecnico"
  );

  // Agrupar estoque técnico por item
  const estoqueTecnicoAgrupado = agruparItensPorItem(filteredEstoqueTecnico);
  const itensUnicosTecnico = Object.keys(estoqueTecnicoAgrupado).map(Number);

  const filteredEstoqueFracionarioRaw = estoqueFracionario.filter((item) => {
    if (!searchTermFracionario) return true;

    const material = materiaisAgricolas[item.idItem];
    const materialNome = material?.nomeComercial || material?.descricao || "";
    const materialCodigo = material?.codigo || "";
    const categoria = material?.categoriaId
      ? categorias[material.categoriaId]
      : null;
    const categoriaNome = categoria?.descricaoResumida || "";
    const categoriaCodigo = categoria?.codigo || "";
    const classe = categoria?.classeId ? classes[categoria.classeId] : null;
    const classeNome = classe?.nomeClasse || "";
    const classeIdentificacao = classe?.identificacao || "";

    const termoLower = searchTermFracionario.toLowerCase();

    // Buscar por classe
    const matchesClasse =
      classeNome.toLowerCase().includes(termoLower) ||
      classeIdentificacao.toLowerCase().includes(termoLower);

    // Buscar por grupo/categoria
    const matchesGrupo =
      categoriaNome.toLowerCase().includes(termoLower) ||
      categoriaCodigo.toLowerCase().includes(termoLower);

    // Buscar por item
    const matchesItem =
      materialNome.toLowerCase().includes(termoLower) ||
      materialCodigo.toLowerCase().includes(termoLower) ||
      item.idItem.toString().includes(searchTermFracionario);

    return matchesClasse || matchesGrupo || matchesItem;
  });

  const filteredEstoqueFracionario = getSortedAndFilteredData(
    estoqueFracionario,
    filteredEstoqueFracionarioRaw,
    "fracionario"
  );

  // Agrupar estoque fracionário por item
  const estoqueFracionarioAgrupado = agruparItensPorItem(
    filteredEstoqueFracionario
  );
  const itensUnicosFracionario = Object.keys(estoqueFracionarioAgrupado).map(
    Number
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

  const handleMovimentarItem = (entrada: EntradaNotaFiscal) => {
    setTipoEstoqueMovimentando("primario");
    // Armazenar o idItem para filtrar apenas entradas do mesmo item
    setIdItemMovimentacao(entrada.idItem);

    // Obter todas as entradas do mesmo item, ordenadas por validade
    const entradasDoItem = entradasEstoquePrimario
      .filter((e) => e.idItem === entrada.idItem && e.ativo && e.saldoAtual > 0)
      .sort((a, b) => {
        const dataA = new Date(a.validade).getTime();
        const dataB = new Date(b.validade).getTime();
        return dataA - dataB;
      });

    // Selecionar a primeira entrada (mais próxima a vencer) por padrão
    const primeiraEntrada = entradasDoItem[0] || entrada;
    setEntradaMovimentando(primeiraEntrada);
    const entradaId = gerarIdEntrada(primeiraEntrada);
    setMovimentacaoForm({
      entradaId: entradaId,
      tipoMovimento: "",
      idLocDestino: "",
      qtde: "",
      observacoes: "",
    });
    setMovimentarDialogOpen(true);
  };

  const handleMovimentarItemTecnico = (item: EstoqueTecnicoFracionario) => {
    setTipoEstoqueMovimentando("tecnico");
    setItemMovimentandoTecnicoFracionario(item);
    setMovimentacaoForm({
      entradaId: "",
      tipoMovimento: "",
      idLocDestino: "",
      qtde: "",
      observacoes: "",
    });
    setMovimentarDialogOpen(true);
  };

  const handleMovimentarItemFracionario = (item: EstoqueTecnicoFracionario) => {
    setTipoEstoqueMovimentando("fracionario");
    setItemMovimentandoTecnicoFracionario(item);
    setMovimentacaoForm({
      entradaId: "",
      tipoMovimento: "",
      idLocDestino: "",
      qtde: "",
      observacoes: "",
    });
    setMovimentarDialogOpen(true);
  };

  const handleSalvarMovimentacao = () => {
    // Movimentação de estoque primário
    if (tipoEstoqueMovimentando === "primario") {
      if (!movimentacaoForm.entradaId) {
        toast.error("Selecione uma entrada para movimentar");
        return;
      }

      const entradaSelecionada = obterEntradaPorId(movimentacaoForm.entradaId);
      if (!entradaSelecionada) {
        toast.error("Entrada não encontrada");
        return;
      }

      if (!movimentacaoForm.tipoMovimento || !movimentacaoForm.qtde) {
        toast.error("Preencha o tipo de movimentação e a quantidade");
        return;
      }

      // Verificar se precisa de localização de destino
      const tipoMov = tiposMovimentacoes.find(
        (t) => t.nome === movimentacaoForm.tipoMovimento
      );
      const locsDestino = getLocalizacoesDestino(
        movimentacaoForm.tipoMovimento
      );
      if (locsDestino.length > 0 && !movimentacaoForm.idLocDestino) {
        toast.error("Selecione a localização de destino");
        return;
      }

      const quantidade = Number(movimentacaoForm.qtde);
      if (quantidade > entradaSelecionada.saldoAtual) {
        toast.error("Quantidade não pode ser maior que o saldo atual");
        return;
      }

      if (quantidade <= 0) {
        toast.error("Quantidade deve ser maior que zero");
        return;
      }

      // Verificar se saldo ficaria negativo
      const saldoRestante = entradaSelecionada.saldoAtual - quantidade;
      if (saldoRestante < 0) {
        toast.error("Saldo não pode ficar negativo");
        return;
      }

      // Atualizar saldo atual da entrada
      setEntradasEstoquePrimario((prev) =>
        prev.map((e) => {
          if (
            e.nota === entradaSelecionada.nota &&
            e.idItem === entradaSelecionada.idItem &&
            e.lote === entradaSelecionada.lote
          ) {
            const novoSaldo = e.saldoAtual - quantidade;
            return {
              ...e,
              saldoAtual: novoSaldo,
              ativo: novoSaldo > 0, // Desativar automaticamente se saldo = 0
            };
          }
          return e;
        })
      );
    }
    // Movimentação entre técnico e fracionário
    else if (
      tipoEstoqueMovimentando === "tecnico" ||
      tipoEstoqueMovimentando === "fracionario"
    ) {
      if (!itemMovimentandoTecnicoFracionario) {
        toast.error("Item não encontrado");
        return;
      }

      if (!movimentacaoForm.tipoMovimento || !movimentacaoForm.qtde) {
        toast.error("Preencha o tipo de movimentação e a quantidade");
        return;
      }

      // Verificar se precisa de localização de destino
      const tipoMov = tiposMovimentacoesTecnicoFracionario.find(
        (t) => t.nome === movimentacaoForm.tipoMovimento
      );
      if (!tipoMov) {
        toast.error("Tipo de movimentação inválido");
        return;
      }

      const locsDestino = getLocalizacoesDestinoTecnicoFracionario(
        movimentacaoForm.tipoMovimento
      );
      if (locsDestino.length > 0 && !movimentacaoForm.idLocDestino) {
        toast.error("Selecione a localização de destino");
        return;
      }

      const quantidade = Number(movimentacaoForm.qtde);
      const saldoDisponivel = itemMovimentandoTecnicoFracionario.saldoDispon;

      if (quantidade > saldoDisponivel) {
        toast.error("Quantidade não pode ser maior que o saldo disponível");
        return;
      }

      if (quantidade <= 0) {
        toast.error("Quantidade deve ser maior que zero");
        return;
      }

      // Atualizar estoque técnico ou fracionário
      if (tipoEstoqueMovimentando === "tecnico") {
        // Remover do técnico e adicionar ao fracionário
        setEstoqueTecnico((prev) =>
          prev.map((item) => {
            if (
              item.idEstoque === itemMovimentandoTecnicoFracionario.idEstoque
            ) {
              return {
                ...item,
                saldoDispon: item.saldoDispon - quantidade,
              };
            }
            return item;
          })
        );

        // Adicionar ao fracionário
        const novaIdEstoque =
          Math.max(...estoqueFracionario.map((e) => e.idEstoque), 0) + 1;
        const novaLocalizacao = Number(movimentacaoForm.idLocDestino);
        setEstoqueFracionario((prev) => [
          ...prev,
          {
            idEstoque: novaIdEstoque,
            idItem: itemMovimentandoTecnicoFracionario.idItem,
            nLote: itemMovimentandoTecnicoFracionario.nLote,
            idLocalizacao: novaLocalizacao,
            saldoMovimentacao: quantidade,
            unidade: itemMovimentandoTecnicoFracionario.unidade,
            saldoDispon: quantidade,
            dataUso: null,
          },
        ]);
      } else {
        // Remover do fracionário e adicionar ao técnico
        setEstoqueFracionario((prev) =>
          prev.map((item) => {
            if (
              item.idEstoque === itemMovimentandoTecnicoFracionario.idEstoque
            ) {
              return {
                ...item,
                saldoDispon: item.saldoDispon - quantidade,
              };
            }
            return item;
          })
        );

        // Adicionar ao técnico
        const novaIdEstoque =
          Math.max(...estoqueTecnico.map((e) => e.idEstoque), 0) + 1;
        const novaLocalizacao = Number(movimentacaoForm.idLocDestino);
        setEstoqueTecnico((prev) => [
          ...prev,
          {
            idEstoque: novaIdEstoque,
            idItem: itemMovimentandoTecnicoFracionario.idItem,
            nLote: itemMovimentandoTecnicoFracionario.nLote,
            idLocalizacao: novaLocalizacao,
            saldoMovimentacao: quantidade,
            unidade: itemMovimentandoTecnicoFracionario.unidade,
            saldoDispon: quantidade,
            dataUso: null,
          },
        ]);
      }
    }

    toast.success("Movimentação realizada com sucesso!");
    setMovimentarDialogOpen(false);
    setEntradaMovimentando(null);
    setItemMovimentandoTecnicoFracionario(null);
    setIdItemMovimentacao(null);
    setTipoEstoqueMovimentando("primario");
    setMovimentacaoForm({
      entradaId: "",
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

  // Obter localizações de destino para movimentações entre técnico e fracionário
  const getLocalizacoesDestinoTecnicoFracionario = (tipoMovimento: string) => {
    const tipoMov = tiposMovimentacoesTecnicoFracionario.find(
      (t) => t.nome === tipoMovimento
    );
    if (!tipoMov) return [];

    if (tipoMov.destino === "TÉCNICO" || tipoMov.destino === "SMARTCALDA") {
      // Localizações TÉCNICO (SMARTCALDA)
      return Object.entries(localizacoes)
        .filter(([_, loc]) => loc.tipoEstoque === "SMARTCALDA")
        .map(([id, loc]) => ({ id: Number(id), ...loc }));
    } else if (tipoMov.destino === "FRACIONÁRIO") {
      // Localizações FRACIONÁRIO
      return Object.entries(localizacoes)
        .filter(([_, loc]) => loc.tipoEstoque === "FRACIONÁRIO")
        .map(([id, loc]) => ({ id: Number(id), ...loc }));
    }
    return [];
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
            Controle de estoques
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle de estoque e movimentação de produtos
          </p>
        </div>
      </div>

      {/* Alertas Ativos */}
      {alertasAtivos.length > 0 &&
        (() => {
          // Ordenar alertas por prioridade (alta > media > baixa) e depois por data (mais recente primeiro)
          const alertasOrdenados = [...alertasAtivos].sort((a, b) => {
            const prioridadeOrder = { alta: 3, media: 2, baixa: 1 };
            const prioridadeDiff =
              (prioridadeOrder[b.prioridade as keyof typeof prioridadeOrder] ||
                0) -
              (prioridadeOrder[a.prioridade as keyof typeof prioridadeOrder] ||
                0);

            if (prioridadeDiff !== 0) return prioridadeDiff;

            // Se mesma prioridade, ordenar por data (mais recente primeiro)
            return (
              new Date(b.dataAlerta).getTime() -
              new Date(a.dataAlerta).getTime()
            );
          });

          return (
            <Card className="border-warning bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  Alertas Ativos ({alertasAtivos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {alertasOrdenados.map((alerta) => (
                    <div
                      key={alerta.id}
                      className="flex flex-col p-2.5 bg-background rounded-lg border border-border hover:border-warning/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-warning flex-shrink-0" />
                          <Badge
                            variant={getPrioridadeBadge(alerta.prioridade)}
                            className="text-xs h-5"
                          >
                            {alerta.prioridade}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-sm truncate mb-0.5"
                          title={alerta.produto}
                        >
                          {alerta.produto}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {alerta.mensagem}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })()}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">
              {new Set(entradasEstoquePrimario.map((e) => e.idItem)).size}
            </p>
            <p className="text-sm text-muted-foreground">Est. Primário</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">
              {new Set(estoqueTecnico.map((e) => e.idItem)).size}
            </p>
            <p className="text-sm text-muted-foreground">Est. Técnico</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-warning">
              {new Set(estoqueFracionario.map((e) => e.idItem)).size}
            </p>
            <p className="text-sm text-muted-foreground">Est. Fracionário</p>
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
                    placeholder="Buscar por classe, grupo ou item"
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
          </div>

          {/* Tabela de Entradas */}
          <Card>
            <CardHeader>
              <CardTitle>Estoque Primário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {itensUnicos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">
                      Nenhum item encontrado
                    </p>
                    <p className="text-sm">
                      {searchTerm
                        ? "Tente ajustar os termos de busca"
                        : "Comece adicionando uma entrada"}
                    </p>
                  </div>
                ) : (
                  itensUnicos.map((idItem) => {
                    const entradasDoItem = entradasAgrupadas[idItem];
                    const material = materiaisAgricolas[idItem];
                    const categoria = material?.categoriaId
                      ? categorias[material.categoriaId]
                      : null;
                    const classe = categoria?.classeId
                      ? classes[categoria.classeId]
                      : null;
                    const saldoTotal =
                      calcularSaldoTotalPorItem(entradasDoItem);
                    const unidade = entradasDoItem[0]?.unidade || "";
                    const isExpanded = expandedItems.has(idItem);

                    // Verificar se o item tem entradas inativas
                    const itemTemInativos = entradasDoItem.some(
                      (e) => !e.ativo
                    );
                    const itemTemAtivos = entradasDoItem.some((e) => e.ativo);
                    const isItemInativo = !itemTemAtivos && itemTemInativos;

                    return (
                      <div
                        key={idItem}
                        className={`border rounded-lg ${
                          isItemInativo ? "opacity-60 grayscale" : ""
                        }`}
                      >
                        {/* Linha do Item */}
                        <div
                          className={`p-4 border-b ${
                            isItemInativo ? "bg-muted/30" : "bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleItemEstoqueExpansao(idItem)
                                }
                                className="p-1 h-8 w-8"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              <div className="flex items-center gap-4 flex-1">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-lg">
                                      {material?.nomeComercial ||
                                        material?.descricao ||
                                        "Item não encontrado"}
                                    </h3>
                                    {classe && (
                                      <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                                        {classe.nomeClasse}
                                      </Badge>
                                    )}
                                    {categoria && (
                                      <Badge className="text-xs">
                                        {categoria.descricaoResumida}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-sm font-medium">
                                      Saldo Total: {saldoTotal} {unidade}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {entradasDoItem.length} entrada(s)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Visualizar primeira entrada como representante
                                  handleVerDetalhes(entradasDoItem[0]);
                                }}
                                title="Visualizar Item"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Movimentar primeira entrada como representante
                                  handleMovimentarItem(entradasDoItem[0]);
                                }}
                                title="Movimentar Item"
                              >
                                <ArrowUpDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Subgrid de Entradas */}
                        {isExpanded && (
                          <div className="p-4">
                            {entradasDoItem.length > 0 ? (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground mb-3">
                                  Entradas deste item:
                                </h4>
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Fornecedor</TableHead>
                                        <TableHead>Nota</TableHead>
                                        <TableHead>Data de Entrada</TableHead>
                                        <TableHead>Lote</TableHead>
                                        <TableHead>Validade</TableHead>
                                        <TableHead>
                                          Quantidade de Entrada
                                        </TableHead>
                                        <TableHead>Saldo Atual</TableHead>
                                        <TableHead>Localização</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {entradasDoItem.map((entrada, index) => {
                                        // Verificar se esta entrada corresponde ao lote buscado
                                        const correspondeLoteBuscado =
                                          loteBuscado &&
                                          entrada.lote
                                            .toLowerCase()
                                            .includes(
                                              loteBuscado.toLowerCase()
                                            );

                                        return (
                                          <TableRow
                                            key={index}
                                            className={`${
                                              !entrada.ativo
                                                ? "opacity-60 grayscale"
                                                : ""
                                            } ${
                                              correspondeLoteBuscado
                                                ? "bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-l-yellow-500"
                                                : ""
                                            }`}
                                          >
                                            <TableCell>
                                              {fornecedores[
                                                entrada.idFornecedor
                                              ] ||
                                                `Fornecedor ${entrada.idFornecedor}`}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                              {entrada.nota}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                              {new Date(
                                                entrada.dataEntrada
                                              ).toLocaleDateString("pt-BR")}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                              {entrada.lote}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                              {new Date(
                                                entrada.validade
                                              ).toLocaleDateString("pt-BR")}
                                            </TableCell>
                                            <TableCell>
                                              <span className="font-medium">
                                                {entrada.qtde} {entrada.unidade}
                                              </span>
                                            </TableCell>
                                            <TableCell>
                                              {entrada.saldoAtual > 0 ? (
                                                <span className="font-medium">
                                                  {entrada.saldoAtual}{" "}
                                                  {entrada.unidade}
                                                </span>
                                              ) : (
                                                <span className="text-muted-foreground">
                                                  -
                                                </span>
                                              )}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                              {entrada.localizacao}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Nenhuma entrada encontrada para este item</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
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
                    placeholder="Buscar por classe, grupo ou item"
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

          {/* Grid Hierárquico de Estoque Técnico */}
          <Card>
            <CardHeader>
              <CardTitle>Estoque Técnico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {itensUnicosTecnico.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">
                      Nenhum item encontrado
                    </p>
                    <p className="text-sm">
                      {searchTermTecnico
                        ? "Tente ajustar os termos de busca"
                        : "Nenhum item no estoque técnico"}
                    </p>
                  </div>
                ) : (
                  itensUnicosTecnico.map((idItem) => {
                    const itensDoItem = estoqueTecnicoAgrupado[idItem];
                    const material = materiaisAgricolas[idItem];
                    const categoria = material?.categoriaId
                      ? categorias[material.categoriaId]
                      : null;
                    const classe = categoria?.classeId
                      ? classes[categoria.classeId]
                      : null;
                    const saldoTotal =
                      calcularSaldoTotalPorItemTecnicoFracionario(itensDoItem);
                    const unidade = itensDoItem[0]?.unidade || "";
                    const isExpanded = expandedItemsTecnico.has(idItem);

                    return (
                      <div key={idItem} className="border rounded-lg">
                        {/* Linha do Item */}
                        <div className="p-4 bg-muted/50 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleItemTecnicoExpansao(idItem)
                                }
                                className="p-1 h-8 w-8"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              <div className="flex items-center gap-4 flex-1">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-lg">
                                      {material?.nomeComercial ||
                                        material?.descricao ||
                                        "Item não encontrado"}
                                    </h3>
                                    {classe && (
                                      <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                                        {classe.nomeClasse}
                                      </Badge>
                                    )}
                                    {categoria && (
                                      <Badge className="text-xs">
                                        {categoria.descricaoResumida}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-sm text-muted-foreground">
                                      ID: {idItem}
                                    </span>
                                    <span className="text-sm font-medium">
                                      Saldo Total: {saldoTotal} {unidade}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {itensDoItem.length} registro(s)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleVerDetalhesTecnico(itensDoItem[0])
                                }
                                title="Visualizar Item"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  handleMovimentarItemTecnico(itensDoItem[0]);
                                }}
                                title="Movimentar Item"
                              >
                                <ArrowUpDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Subgrid de Itens */}
                        {isExpanded && (
                          <div className="p-4">
                            {itensDoItem.length > 0 ? (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground mb-3">
                                  Registros deste item:
                                </h4>
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Nº Lote</TableHead>
                                        <TableHead>Localização</TableHead>
                                        <TableHead>
                                          Saldo Movimentação
                                        </TableHead>
                                        <TableHead>Saldo Disponível</TableHead>
                                        <TableHead>Unidade</TableHead>
                                        <TableHead>Data de Uso</TableHead>
                                        <TableHead>Ações</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {itensDoItem.map((item) => {
                                        const loc =
                                          localizacoes[item.idLocalizacao];
                                        return (
                                          <TableRow key={item.idEstoque}>
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
                                                {item.saldoMovimentacao}{" "}
                                                {item.unidade}
                                              </span>
                                            </TableCell>
                                            <TableCell>
                                              <span className="font-medium">
                                                {item.saldoDispon}{" "}
                                                {item.unidade}
                                              </span>
                                            </TableCell>
                                            <TableCell>
                                              {item.unidade}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                              {item.dataUso
                                                ? new Date(
                                                    item.dataUso
                                                  ).toLocaleDateString("pt-BR")
                                                : "-"}
                                            </TableCell>
                                            <TableCell className="text-left">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  handleVerDetalhesTecnico(item)
                                                }
                                              >
                                                <Eye className="h-4 w-4" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Nenhum registro encontrado para este item</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
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
                    placeholder="Buscar por classe, grupo ou item"
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

          {/* Grid Hierárquico de Estoque Fracionário */}
          <Card>
            <CardHeader>
              <CardTitle>Estoque Fracionário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {itensUnicosFracionario.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">
                      Nenhum item encontrado
                    </p>
                    <p className="text-sm">
                      {searchTermFracionario
                        ? "Tente ajustar os termos de busca"
                        : "Nenhum item no estoque fracionário"}
                    </p>
                  </div>
                ) : (
                  itensUnicosFracionario.map((idItem) => {
                    const itensDoItem = estoqueFracionarioAgrupado[idItem];
                    const material = materiaisAgricolas[idItem];
                    const categoria = material?.categoriaId
                      ? categorias[material.categoriaId]
                      : null;
                    const classe = categoria?.classeId
                      ? classes[categoria.classeId]
                      : null;
                    const saldoTotal =
                      calcularSaldoTotalPorItemTecnicoFracionario(itensDoItem);
                    const unidade = itensDoItem[0]?.unidade || "";
                    const isExpanded = expandedItemsFracionario.has(idItem);

                    return (
                      <div key={idItem} className="border rounded-lg">
                        {/* Linha do Item */}
                        <div className="p-4 bg-muted/50 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleItemFracionarioExpansao(idItem)
                                }
                                className="p-1 h-8 w-8"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              <div className="flex items-center gap-4 flex-1">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-lg">
                                      {material?.nomeComercial ||
                                        material?.descricao ||
                                        "Item não encontrado"}
                                    </h3>
                                    {classe && (
                                      <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                                        {classe.nomeClasse}
                                      </Badge>
                                    )}
                                    {categoria && (
                                      <Badge className="text-xs">
                                        {categoria.descricaoResumida}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-sm text-muted-foreground">
                                      ID: {idItem}
                                    </span>
                                    <span className="text-sm font-medium">
                                      Saldo Total: {saldoTotal} {unidade}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {itensDoItem.length} registro(s)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleVerDetalhesFracionario(itensDoItem[0])
                                }
                                title="Visualizar Item"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  handleMovimentarItemFracionario(
                                    itensDoItem[0]
                                  );
                                }}
                                title="Movimentar Item"
                              >
                                <ArrowUpDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Subgrid de Itens */}
                        {isExpanded && (
                          <div className="p-4">
                            {itensDoItem.length > 0 ? (
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm text-muted-foreground mb-3">
                                  Registros deste item:
                                </h4>
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Nº Lote</TableHead>
                                        <TableHead>Localização</TableHead>
                                        <TableHead>
                                          Saldo Movimentação
                                        </TableHead>
                                        <TableHead>Saldo Disponível</TableHead>
                                        <TableHead>Unidade</TableHead>
                                        <TableHead>Data de Uso</TableHead>
                                        <TableHead>Ações</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {itensDoItem.map((item) => {
                                        const loc =
                                          localizacoes[item.idLocalizacao];
                                        return (
                                          <TableRow key={item.idEstoque}>
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
                                                {item.saldoMovimentacao}{" "}
                                                {item.unidade}
                                              </span>
                                            </TableCell>
                                            <TableCell>
                                              <span className="font-medium">
                                                {item.saldoDispon}{" "}
                                                {item.unidade}
                                              </span>
                                            </TableCell>
                                            <TableCell>
                                              {item.unidade}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                              {item.dataUso
                                                ? new Date(
                                                    item.dataUso
                                                  ).toLocaleDateString("pt-BR")
                                                : "-"}
                                            </TableCell>
                                            <TableCell className="text-left">
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  handleVerDetalhesFracionario(
                                                    item
                                                  )
                                                }
                                              >
                                                <Eye className="h-4 w-4" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Nenhum registro encontrado para este item</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

      {/* Dialog de Movimentação */}
      <Dialog
        open={movimentarDialogOpen}
        onOpenChange={setMovimentarDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Movimentar Item -{" "}
              {tipoEstoqueMovimentando === "primario"
                ? "Estoque Primário"
                : tipoEstoqueMovimentando === "tecnico"
                ? "Estoque Técnico"
                : "Estoque Fracionário"}
            </DialogTitle>
            <DialogDescription>
              {tipoEstoqueMovimentando === "primario"
                ? "Selecione a entrada e realize uma movimentação de estoque"
                : "Realize uma movimentação entre estoques técnico e fracionário"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Select de Entrada - Apenas para estoque primário */}
            {tipoEstoqueMovimentando === "primario" && (
              <div className="space-y-2">
                <Label htmlFor="mov-entrada">Selecionar Entrada *</Label>
                <Select
                  value={movimentacaoForm.entradaId}
                  onValueChange={(value) => {
                    // Verificar se não é a primeira entrada (mais próxima a vencer)
                    const primeiraEntradaId = entradasDisponiveisMovimentacao[0]
                      ? gerarIdEntrada(entradasDisponiveisMovimentacao[0])
                      : null;

                    if (
                      primeiraEntradaId &&
                      value !== primeiraEntradaId &&
                      entradasDisponiveisMovimentacao.length > 1
                    ) {
                      // Mostrar alerta se não for a primeira entrada
                      setEntradaSelecionadaAlerta(value);
                      setMostrarAlertaVencimento(true);
                    } else {
                      // Selecionar diretamente se for a primeira ou única entrada
                      const entrada = obterEntradaPorId(value);
                      setEntradaMovimentando(entrada);
                      setMovimentacaoForm({
                        ...movimentacaoForm,
                        entradaId: value,
                        qtde: "", // Resetar quantidade ao mudar entrada
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione Item + Nota + Lote + Validade" />
                  </SelectTrigger>
                  <SelectContent>
                    {entradasDisponiveisMovimentacao.map((entrada) => {
                      const material = materiaisAgricolas[entrada.idItem];
                      const nomeItem =
                        material?.nomeComercial ||
                        material?.descricao ||
                        `Item ${entrada.idItem}`;
                      const dataValidade = new Date(
                        entrada.validade
                      ).toLocaleDateString("pt-BR");
                      const entradaId = gerarIdEntrada(entrada);
                      return (
                        <SelectItem key={entradaId} value={entradaId}>
                          {nomeItem} | NF: {entrada.nota} | Lote: {entrada.lote}{" "}
                          | Validade: {dataValidade}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Resumo do Item Selecionado - Estoque Primário */}
            {tipoEstoqueMovimentando === "primario" && entradaMovimentando && (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h4 className="font-semibold text-sm mb-3">
                  Resumo da Entrada
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Nome do Item
                    </Label>
                    <p className="text-sm font-medium">
                      {materiaisAgricolas[entradaMovimentando.idItem]
                        ?.nomeComercial ||
                        materiaisAgricolas[entradaMovimentando.idItem]
                          ?.descricao ||
                        "Item não encontrado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Lote
                    </Label>
                    <p className="text-sm font-mono font-medium">
                      {entradaMovimentando.lote}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Data de Validade
                    </Label>
                    <p className="text-sm font-medium">
                      {new Date(
                        entradaMovimentando.validade
                      ).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Quantidade de Embalagens
                    </Label>
                    <p className="text-sm font-medium">
                      {entradaMovimentando.qtdeEmbalagem}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Capacidade da Embalagem
                    </Label>
                    <p className="text-sm font-medium">
                      {entradaMovimentando.capEmbalagem}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Saldo Atual
                    </Label>
                    <p className="text-sm font-medium">
                      {entradaMovimentando.saldoAtual}{" "}
                      {entradaMovimentando.unidade}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Resumo do Item - Técnico/Fracionário */}
            {(tipoEstoqueMovimentando === "tecnico" ||
              tipoEstoqueMovimentando === "fracionario") &&
              itemMovimentandoTecnicoFracionario && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <h4 className="font-semibold text-sm mb-3">Resumo do Item</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Nome do Item
                      </Label>
                      <p className="text-sm font-medium">
                        {materiaisAgricolas[
                          itemMovimentandoTecnicoFracionario.idItem
                        ]?.nomeComercial ||
                          materiaisAgricolas[
                            itemMovimentandoTecnicoFracionario.idItem
                          ]?.descricao ||
                          "Item não encontrado"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Lote
                      </Label>
                      <p className="text-sm font-mono font-medium">
                        {itemMovimentandoTecnicoFracionario.nLote}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Saldo Disponível
                      </Label>
                      <p className="text-sm font-medium">
                        {itemMovimentandoTecnicoFracionario.saldoDispon}{" "}
                        {itemMovimentandoTecnicoFracionario.unidade}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Localização Atual
                      </Label>
                      <p className="text-sm font-medium">
                        {localizacoes[
                          itemMovimentandoTecnicoFracionario.idLocalizacao
                        ]?.codigo || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Tipo de Movimentação */}
            {((tipoEstoqueMovimentando === "primario" && entradaMovimentando) ||
              (tipoEstoqueMovimentando !== "primario" &&
                itemMovimentandoTecnicoFracionario)) && (
              <>
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
                      {tipoEstoqueMovimentando === "primario"
                        ? tiposMovimentacoes.map((tipo, index) => (
                            <SelectItem key={index} value={tipo.nome}>
                              {tipo.nome} ({tipo.origem} → {tipo.destino})
                            </SelectItem>
                          ))
                        : tiposMovimentacoesTecnicoFracionario.map(
                            (tipo, index) => (
                              <SelectItem key={index} value={tipo.nome}>
                                {tipo.nome} ({tipo.origem} → {tipo.destino})
                              </SelectItem>
                            )
                          )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Localização de Destino */}
                {movimentacaoForm.tipoMovimento &&
                  (tipoEstoqueMovimentando === "primario"
                    ? getLocalizacoesDestino(movimentacaoForm.tipoMovimento)
                    : getLocalizacoesDestinoTecnicoFracionario(
                        movimentacaoForm.tipoMovimento
                      )
                  ).length > 0 && (
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
                          {(tipoEstoqueMovimentando === "primario"
                            ? getLocalizacoesDestino(
                                movimentacaoForm.tipoMovimento
                              )
                            : getLocalizacoesDestinoTecnicoFracionario(
                                movimentacaoForm.tipoMovimento
                              )
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
                    min={0}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Saldo disponível: {entradaMovimentando.saldoAtual}{" "}
                      {entradaMovimentando.unidade}
                    </span>
                    {movimentacaoForm.qtde && (
                      <span
                        className={`font-medium ${
                          entradaMovimentando.saldoAtual -
                            Number(movimentacaoForm.qtde) <
                          0
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        Saldo restante:{" "}
                        {entradaMovimentando.saldoAtual -
                          Number(movimentacaoForm.qtde || 0)}{" "}
                        {entradaMovimentando.unidade}
                      </span>
                    )}
                  </div>
                </div>

                {/* Cálculo de Embalagens */}
                {movimentacaoForm.qtde &&
                  entradaMovimentando.capEmbalagem > 0 && (
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-sm mb-3">
                          Cálculo de Embalagens
                        </h4>
                        {(() => {
                          const quantidadeSolicitada = Number(
                            movimentacaoForm.qtde || 0
                          );
                          const capacidadeEmbalagem =
                            entradaMovimentando.capEmbalagem;
                          const embalagensTotais =
                            entradaMovimentando.qtdeEmbalagem;
                          const saldoAtual = entradaMovimentando.saldoAtual;

                          // Calcular quantas embalagens a quantidade solicitada representa
                          const embalagensMovimentadas = Math.ceil(
                            quantidadeSolicitada / capacidadeEmbalagem
                          );

                          // Calcular quantidade total em embalagens (arredondado para cima)
                          const quantidadeTotalEmbalagens =
                            embalagensMovimentadas * capacidadeEmbalagem;

                          // Calcular diferença (sobra)
                          const diferenca =
                            quantidadeTotalEmbalagens - quantidadeSolicitada;

                          // Calcular embalagens restantes
                          const saldoRestante =
                            saldoAtual - quantidadeSolicitada;
                          const embalagensRestantes = Math.floor(
                            saldoRestante / capacidadeEmbalagem
                          );
                          const quantidadeRestanteEmbalagens =
                            embalagensRestantes * capacidadeEmbalagem;
                          const diferencaRestante =
                            saldoRestante - quantidadeRestanteEmbalagens;

                          return (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Quantidade Solicitada
                                </Label>
                                <p className="font-medium">
                                  {quantidadeSolicitada.toLocaleString("pt-BR")}{" "}
                                  {entradaMovimentando.unidade}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Embalagens a Movimentar
                                </Label>
                                <p className="font-medium">
                                  {embalagensMovimentadas} unidade(s)
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Total em Embalagens
                                </Label>
                                <p className="font-medium">
                                  {quantidadeTotalEmbalagens.toLocaleString(
                                    "pt-BR"
                                  )}{" "}
                                  {entradaMovimentando.unidade}
                                </p>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Diferença (Sobra)
                                </Label>
                                <p
                                  className={`font-medium ${
                                    diferenca > 0
                                      ? "text-warning"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {diferenca > 0 ? "+" : ""}
                                  {diferenca.toLocaleString("pt-BR")}{" "}
                                  {entradaMovimentando.unidade}
                                </p>
                              </div>
                              <div className="col-span-2 pt-2 border-t">
                                <Label className="text-xs text-muted-foreground">
                                  Embalagens Restantes
                                </Label>
                                <p className="font-medium">
                                  {embalagensRestantes} unidade(s) ={" "}
                                  {quantidadeRestanteEmbalagens.toLocaleString(
                                    "pt-BR"
                                  )}{" "}
                                  {entradaMovimentando.unidade}
                                  {diferencaRestante > 0 && (
                                    <span className="text-muted-foreground ml-1">
                                      (+{" "}
                                      {diferencaRestante.toLocaleString(
                                        "pt-BR"
                                      )}{" "}
                                      {entradaMovimentando.unidade} solto)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}
              </>
            )}

            {entradaMovimentando && (
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
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setMovimentarDialogOpen(false);
                setEntradaMovimentando(null);
                setIdItemMovimentacao(null);
                setMovimentacaoForm({
                  entradaId: "",
                  tipoMovimento: "",
                  idLocDestino: "",
                  qtde: "",
                  observacoes: "",
                });
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSalvarMovimentacao}
              disabled={
                !entradaMovimentando ||
                !movimentacaoForm.entradaId ||
                !movimentacaoForm.tipoMovimento ||
                !movimentacaoForm.qtde ||
                (entradaMovimentando &&
                  entradaMovimentando.saldoAtual -
                    Number(movimentacaoForm.qtde || 0) <
                    0)
              }
            >
              Confirmar Movimentação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog para avisar sobre vencimento */}
      <AlertDialog
        open={mostrarAlertaVencimento}
        onOpenChange={setMostrarAlertaVencimento}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atenção</AlertDialogTitle>
            <AlertDialogDescription>
              Existe um item mais próximo ao vencimento. Deseja prosseguir?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const entrada = obterEntradaPorId(entradaSelecionadaAlerta);
                if (entrada) {
                  setEntradaMovimentando(entrada);
                  setMovimentacaoForm({
                    ...movimentacaoForm,
                    entradaId: entradaSelecionadaAlerta,
                    qtde: "", // Resetar quantidade ao mudar entrada
                  });
                }
                setMostrarAlertaVencimento(false);
                setEntradaSelecionadaAlerta("");
              }}
            >
              Prosseguir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

export default Estoques;
