import { useState, useMemo, useEffect } from "react";
import type { DateRange } from "react-day-picker";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Plus,
  Search,
  FileText,
  Play,
  CheckCircle,
  Clock,
  Activity,
  AlertCircle,
  Upload,
  Download,
  ChevronDown,
  ChevronRight,
  X,
  Calendar as CalendarIcon,
  Filter,
  Edit,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Interfaces
interface CentroCusto {
  id: string;
  descricao: string;
  status: "Ativo" | "Inativo";
}

interface Operacao {
  id: string;
  descricao: string;
  status: "Ativo" | "Inativo";
}

interface Responsavel {
  id: string;
  nome: string;
  status: "Ativo" | "Inativo";
}

interface Fazenda {
  id: string;
  codigoExterno?: string; // Código externo da fazenda (será implementado futuramente)
  descricao: string;
  status?: "Ativo" | "Inativo";
  talhoes: Talhao[];
}

interface Talhao {
  id: string;
  area: string;
  tipo: "Talhão" | "Carreador";
  status: "Ativo" | "Inativo";
  observacoes?: string;
}

interface Insumo {
  idEstoque: number;
  idItem: number;
  nLote: string;
  unidade: string;
  saldoDispon: number;
  tipoEstoque: "TÉCNICO" | "FRACIONÁRIO";
}

interface SmartCalda {
  id: number;
  nome: string;
  numeroSerie: string;
  status: string;
}

interface ParcelaCalda {
  id: string;
  ordemServicoId: string;
  smartCaldaId: number; // Smart Calda que irá bater a calda
  caminhaoId: string;
  capacidadeCaminhao: number; // Capacidade editada pelo usuário
  proporcaoCalda: number; // % da calda total que será batida nesta parcela
  insumosMovimentados: {
    idEstoque: number;
    idItem: number;
    quantidade: number;
    origem: "PRIMÁRIO" | "FRACIONÁRIO";
    destino: "TÉCNICO";
  }[];
  status:
    | "na_maquina"
    | "em_producao"
    | "processada"
    | "pausado"
    | "bloqueado"
    | "cancelado";
  progressoOS: number; // % que esta parcela representa na OS
  dataCriacao: string;
  dataInicio?: string | null;
  dataFinalizacao?: string | null;
}

interface InsumoSelecionado {
  idEstoque: number;
  idItem: number;
  doseHA: number; // Dose/Ha do insumo
}

interface TalhaoSelecionado {
  fazendaId: string;
  talhaoId: string;
}

interface Caminhao {
  id: string;
  placa: string;
  patrimonio: string;
  volume: string;
  modelo: string;
  marca: string;
  ano: string;
  status: "Ativo" | "Inativo";
}

interface Bulk {
  id: string;
  nome: string;
  tipo: "IBC" | "SILO" | "FRACIONADO";
  capacidade: number;
  smartCaldaId: number;
  smartCaldaNome: string;
  localizacao: string;
}

interface ParcelaCalda {
  id: string;
  ordemServicoId: string;
  smartCaldaId: number; // Smart Calda que irá bater a calda
  caminhaoId: string;
  capacidadeCaminhao: number; // Capacidade editada pelo usuário
  proporcaoCalda: number; // % da calda total que será batida nesta parcela
  insumosMovimentados: {
    idEstoque: number;
    idItem: number;
    quantidade: number;
    origem: "PRIMÁRIO" | "FRACIONÁRIO";
    destino: "TÉCNICO";
  }[];
  status:
    | "na_maquina"
    | "em_producao"
    | "processada"
    | "pausado"
    | "bloqueado"
    | "cancelado";
  progressoOS: number; // % que esta parcela representa na OS
  dataCriacao: string;
  dataInicio?: string | null;
  dataFinalizacao?: string | null;
}

interface OrdemServico {
  id: string;
  numeroOS: string;
  centroCustoId: string;
  operacaoId: string;
  dataGeracao: string;
  observacoes: string;
  responsavelId: string;
  fazendaId: string; // Fazenda selecionada (seção)
  secao: string; // Mesmo que fazenda
  talhoes: TalhaoSelecionado[];
  insumos: InsumoSelecionado[];
  caldaHA: string; // Calda/Ha
  status:
    | "aguardando_informacoes"
    | "pendente"
    | "em_preparo"
    | "nao_totalizada"
    | "finalizada";
  progresso: number;
  iniciado?: string | null;
  previsaoTermino?: string | null;
}

const OrdensServicos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [ordemEditando, setOrdemEditando] = useState<OrdemServico | null>(null);
  const [expandedOrdens, setExpandedOrdens] = useState<Set<string>>(new Set());
  const [expandedTalhoes, setExpandedTalhoes] = useState<Set<string>>(
    new Set()
  );
  const [expandedInsumos, setExpandedInsumos] = useState<Set<string>>(
    new Set()
  );
  const [expandedParcelas, setExpandedParcelas] = useState<Set<string>>(
    new Set()
  );
  const [dialogParametrizacaoOpen, setDialogParametrizacaoOpen] =
    useState(false);
  const [ordemParametrizando, setOrdemParametrizando] =
    useState<OrdemServico | null>(null);
  const [parcelaEditando, setParcelaEditando] = useState<ParcelaCalda | null>(
    null
  );
  const [smartCaldaSelecionada, setSmartCaldaSelecionada] =
    useState<string>("");
  const [caminhaoSelecionado, setCaminhaoSelecionado] = useState<string>("");
  const [capacidadeEditada, setCapacidadeEditada] = useState<string>("");
  const [proporcaoCalda, setProporcaoCalda] = useState<number>(0);
  const [insumosMovimentacao, setInsumosMovimentacao] = useState<
    Map<
      number,
      { idItem: number; quantidade: number; origem: "PRIMÁRIO" | "FRACIONÁRIO" }
    >
  >(new Map());
  const [parcelasCalda, setParcelasCalda] = useState<ParcelaCalda[]>([
    // Parcelas mockadas para OS-2024-006 (Não totalizada - 60%)
    {
      id: "PARCELA001",
      ordemServicoId: "OS006",
      smartCaldaId: 1,
      caminhaoId: "1",
      capacidadeCaminhao: 13000,
      proporcaoCalda: 60,
      insumosMovimentados: [
        {
          idEstoque: 3,
          idItem: 1027636,
          quantidade: 75.04,
          origem: "FRACIONÁRIO",
          destino: "TÉCNICO",
        },
      ],
      status: "processada",
      progressoOS: 60,
      dataCriacao: "2024-01-25T08:00:00",
      dataInicio: "2024-01-25T08:15:00",
      dataFinalizacao: "2024-01-25T10:30:00",
    },
    // Parcelas mockadas para OS-2024-007 (Finalizada - 100%)
    {
      id: "PARCELA002",
      ordemServicoId: "OS007",
      smartCaldaId: 1,
      caminhaoId: "2",
      capacidadeCaminhao: 8000,
      proporcaoCalda: 50,
      insumosMovimentados: [
        {
          idEstoque: 1,
          idItem: 1005392,
          quantidade: 30.0,
          origem: "PRIMÁRIO",
          destino: "TÉCNICO",
        },
      ],
      status: "processada",
      progressoOS: 50,
      dataCriacao: "2024-01-26T08:00:00",
      dataInicio: "2024-01-26T08:20:00",
      dataFinalizacao: "2024-01-26T11:45:00",
    },
    {
      id: "PARCELA003",
      ordemServicoId: "OS007",
      smartCaldaId: 1,
      caminhaoId: "1",
      capacidadeCaminhao: 13000,
      proporcaoCalda: 50,
      insumosMovimentados: [
        {
          idEstoque: 1,
          idItem: 1005392,
          quantidade: 30.0,
          origem: "PRIMÁRIO",
          destino: "TÉCNICO",
        },
      ],
      status: "processada",
      progressoOS: 50,
      dataCriacao: "2024-01-26T12:00:00",
      dataInicio: "2024-01-26T12:15:00",
      dataFinalizacao: "2024-01-26T15:30:00",
    },
    // Parcelas mockadas para OS-2024-005 (Finalizada - 100%)
    {
      id: "PARCELA004",
      ordemServicoId: "OS005",
      smartCaldaId: 1,
      caminhaoId: "3",
      capacidadeCaminhao: 10000,
      proporcaoCalda: 40,
      insumosMovimentados: [
        {
          idEstoque: 1,
          idItem: 1005392,
          quantidade: 45.0,
          origem: "PRIMÁRIO",
          destino: "TÉCNICO",
        },
      ],
      status: "processada",
      progressoOS: 40,
      dataCriacao: "2024-01-24T07:00:00",
      dataInicio: "2024-01-24T07:15:00",
      dataFinalizacao: "2024-01-24T10:00:00",
    },
    {
      id: "PARCELA005",
      ordemServicoId: "OS005",
      smartCaldaId: 1,
      caminhaoId: "2",
      capacidadeCaminhao: 8000,
      proporcaoCalda: 35,
      insumosMovimentados: [
        {
          idEstoque: 1,
          idItem: 1005392,
          quantidade: 39.38,
          origem: "PRIMÁRIO",
          destino: "TÉCNICO",
        },
      ],
      status: "processada",
      progressoOS: 35,
      dataCriacao: "2024-01-24T10:30:00",
      dataInicio: "2024-01-24T10:45:00",
      dataFinalizacao: "2024-01-24T13:20:00",
    },
    {
      id: "PARCELA006",
      ordemServicoId: "OS005",
      smartCaldaId: 1,
      caminhaoId: "1",
      capacidadeCaminhao: 13000,
      proporcaoCalda: 25,
      insumosMovimentados: [
        {
          idEstoque: 1,
          idItem: 1005392,
          quantidade: 28.13,
          origem: "PRIMÁRIO",
          destino: "TÉCNICO",
        },
      ],
      status: "processada",
      progressoOS: 25,
      dataCriacao: "2024-01-24T13:45:00",
      dataInicio: "2024-01-24T14:00:00",
      dataFinalizacao: "2024-01-24T15:00:00",
    },
    // Parcelas mockadas para OS-2024-001 (Não totalizada - 75%)
    {
      id: "PARCELA007",
      ordemServicoId: "OS001",
      smartCaldaId: 1,
      caminhaoId: "1",
      capacidadeCaminhao: 13000,
      proporcaoCalda: 45,
      insumosMovimentados: [
        {
          idEstoque: 1,
          idItem: 1005392,
          quantidade: 50.0,
          origem: "PRIMÁRIO",
          destino: "TÉCNICO",
        },
      ],
      status: "processada",
      progressoOS: 45,
      dataCriacao: "2024-01-20T08:00:00",
      dataInicio: "2024-01-20T08:15:00",
      dataFinalizacao: "2024-01-20T11:30:00",
    },
    {
      id: "PARCELA008",
      ordemServicoId: "OS001",
      smartCaldaId: 1,
      caminhaoId: "2",
      capacidadeCaminhao: 8000,
      proporcaoCalda: 30,
      insumosMovimentados: [
        {
          idEstoque: 1,
          idItem: 1005392,
          quantidade: 33.33,
          origem: "PRIMÁRIO",
          destino: "TÉCNICO",
        },
      ],
      status: "em_producao",
      progressoOS: 30,
      dataCriacao: "2024-01-20T12:00:00",
      dataInicio: "2024-01-20T12:20:00",
      dataFinalizacao: null,
    },
    // Parcelas mockadas para OS-2024-009 (Não totalizada - parcela em processo para demonstrar cancelamento)
    {
      id: "PARCELA010",
      ordemServicoId: "OS009",
      smartCaldaId: 1,
      caminhaoId: "1",
      capacidadeCaminhao: 12000,
      proporcaoCalda: 65,
      insumosMovimentados: [
        {
          idEstoque: 1,
          idItem: 1005392,
          quantidade: 45.5,
          origem: "PRIMÁRIO",
          destino: "TÉCNICO",
        },
        {
          idEstoque: 3,
          idItem: 1027636,
          quantidade: 30.2,
          origem: "FRACIONÁRIO",
          destino: "TÉCNICO",
        },
      ],
      status: "em_producao",
      progressoOS: 65,
      dataCriacao: "2024-01-28T08:00:00",
      dataInicio: "2024-01-28T08:30:00",
      dataFinalizacao: null,
    },
    // Parcelas mockadas para OS-2024-003 (Na máquina - parcela salva para depois)
    {
      id: "PARCELA009",
      ordemServicoId: "OS003",
      smartCaldaId: 1,
      caminhaoId: "3",
      capacidadeCaminhao: 12000,
      proporcaoCalda: 55,
      insumosMovimentados: [
        {
          idEstoque: 1,
          idItem: 1005392,
          quantidade: 40.0,
          origem: "PRIMÁRIO",
          destino: "TÉCNICO",
        },
      ],
      status: "na_maquina",
      progressoOS: 55,
      dataCriacao: "2024-01-22T14:30:00",
      dataInicio: null,
      dataFinalizacao: null,
    },
  ]);

  // Dados simulados - Centros de Custo
  const centrosCusto: CentroCusto[] = [
    { id: "1", descricao: "Combate Prag Doe C Soca", status: "Ativo" },
    { id: "2", descricao: "Aplicação Defensivos Área Norte", status: "Ativo" },
    {
      id: "3",
      descricao: "Manutenção Preventiva Equipamentos",
      status: "Inativo",
    },
    { id: "4", descricao: "Pulverização Área Sul", status: "Ativo" },
    { id: "5", descricao: "Controle Fitossanitário", status: "Ativo" },
  ];

  // Dados simulados - Operações
  const operacoes: Operacao[] = [
    { id: "1", descricao: "COMBATE A BROCA AVIÃO", status: "Ativo" },
    { id: "2", descricao: "APLICAÇÃO HERBICIDA ÁREA A", status: "Ativo" },
    { id: "3", descricao: "PULVERIZAÇÃO FUNGICIDA", status: "Inativo" },
    { id: "4", descricao: "CONTROLE DE PRAGAS SOLO", status: "Ativo" },
    { id: "5", descricao: "APLICAÇÃO FERTILIZANTE FOLIAR", status: "Ativo" },
  ];

  // Dados simulados - Responsáveis
  const responsaveis: Responsavel[] = [
    { id: "1", nome: "LUCIANO APARECIDO GRAÇAS", status: "Ativo" },
    { id: "2", nome: "FERNANDO HENRIQUE SILVA", status: "Ativo" },
    { id: "3", nome: "ROBERTO CARLOS SANTOS", status: "Inativo" },
    { id: "4", nome: "PATRICIA MARIA OLIVEIRA", status: "Ativo" },
    { id: "5", nome: "ANDERSON LUIZ COSTA", status: "Ativo" },
  ];

  // Dados simulados - Fazendas e Talhões
  const fazendas: Fazenda[] = [
    {
      id: "1",
      codigoExterno: "FAZ001",
      descricao: "Fazenda São José",
      talhoes: [
        {
          id: "1",
          area: "250.25",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão principal para soja",
        },
        {
          id: "2",
          area: "300.50",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão para milho",
        },
      ],
    },
    {
      id: "2",
      codigoExterno: "FAZ002",
      descricao: "Fazenda Boa Vista",
      talhoes: [
        {
          id: "4",
          area: "500.25",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão A - Soja",
        },
      ],
    },
    {
      id: "3",
      codigoExterno: "FAZ003",
      descricao: "Fazenda Vista Alegre",
      talhoes: [
        {
          id: "6",
          area: "800.25",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão principal",
        },
      ],
    },
    {
      id: "4",
      codigoExterno: "FAZ004",
      descricao: "Fazenda São Pedro",
      talhoes: [
        {
          id: "8",
          area: "500.00",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão A",
        },
        {
          id: "9",
          area: "500.00",
          tipo: "Talhão",
          status: "Ativo",
          observacoes: "Talhão B",
        },
      ],
    },
  ];

  // Dados simulados - Smart Caldas (baseado em GestaoSmartCaldas.tsx)
  const smartCaldas: SmartCalda[] = [
    {
      id: 1,
      nome: "Smart Calda #001",
      numeroSerie: "SC-2024-001",
      status: "online",
    },
    {
      id: 2,
      nome: "Smart Calda #002",
      numeroSerie: "SC-2024-002",
      status: "online",
    },
    {
      id: 3,
      nome: "Smart Calda #003",
      numeroSerie: "SC-2024-003",
      status: "online",
    },
  ];

  // Dados simulados - Caminhões (baseado em CadastrosAuxiliares.tsx)
  const caminhoes: Caminhao[] = [
    {
      id: "1",
      placa: "GNN-1010",
      patrimonio: "999999",
      volume: "13000",
      modelo: "F32",
      marca: "Volvo",
      ano: "2023",
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
      status: "Ativo",
    },
    {
      id: "4",
      placa: "GHI-9012",
      patrimonio: "666666",
      volume: "14000",
      modelo: "Scania R",
      marca: "Scania",
      ano: "2023",
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
      status: "Ativo",
    },
  ];

  // Dados simulados - BULKS (baseado em GestaoSmartCaldas.tsx)
  const bulks: Bulk[] = [
    {
      id: "1",
      nome: "IBC-001",
      tipo: "IBC",
      capacidade: 300,
      smartCaldaId: 1,
      smartCaldaNome: "Smart Calda #001",
      localizacao: "Estufa A - Setor 1",
    },
    {
      id: "2",
      nome: "IBC-002",
      tipo: "IBC",
      capacidade: 250,
      smartCaldaId: 1,
      smartCaldaNome: "Smart Calda #001",
      localizacao: "Estufa A - Setor 1",
    },
    {
      id: "3",
      nome: "SILO-001",
      tipo: "SILO",
      capacidade: 500,
      smartCaldaId: 1,
      smartCaldaNome: "Smart Calda #001",
      localizacao: "Estufa A - Setor 1",
    },
    {
      id: "4",
      nome: "SILO-002",
      tipo: "SILO",
      capacidade: 300,
      smartCaldaId: 1,
      smartCaldaNome: "Smart Calda #001",
      localizacao: "Estufa A - Setor 1",
    },
    {
      id: "5",
      nome: "FRAC-001",
      tipo: "FRACIONADO",
      capacidade: 100,
      smartCaldaId: 1,
      smartCaldaNome: "Smart Calda #001",
      localizacao: "Estufa A - Setor 1",
    },
    {
      id: "6",
      nome: "FRAC-002",
      tipo: "FRACIONADO",
      capacidade: 100,
      smartCaldaId: 1,
      smartCaldaNome: "Smart Calda #001",
      localizacao: "Estufa A - Setor 1",
    },
    {
      id: "7",
      nome: "IBC-001",
      tipo: "IBC",
      capacidade: 200,
      smartCaldaId: 2,
      smartCaldaNome: "Smart Calda #002",
      localizacao: "Estufa B - Setor 2",
    },
    {
      id: "8",
      nome: "SILO-001",
      tipo: "SILO",
      capacidade: 400,
      smartCaldaId: 2,
      smartCaldaNome: "Smart Calda #002",
      localizacao: "Estufa B - Setor 2",
    },
  ];

  // Dados simulados - Insumos (Estoque Técnico e Fracionário)
  const insumos: Insumo[] = [
    {
      idEstoque: 1,
      idItem: 1005392,
      nLote: "NR42123259600",
      unidade: "L",
      saldoDispon: 100,
      tipoEstoque: "TÉCNICO",
    },
    {
      idEstoque: 2,
      idItem: 1027638,
      nLote: "SY003-24-20-160",
      unidade: "KG",
      saldoDispon: 100,
      tipoEstoque: "TÉCNICO",
    },
    {
      idEstoque: 3,
      idItem: 1027636,
      nLote: "005-22-12000",
      unidade: "L",
      saldoDispon: 50,
      tipoEstoque: "FRACIONÁRIO",
    },
  ];

  // Mapeamento de materiais agrícolas (simulado)
  const materiaisAgricolas: {
    [key: number]: {
      codigo: string;
      descricao: string;
      nomeComercial: string;
      categoriaId?: number;
      capacidadeEmbalagem?: number; // Capacidade da embalagem em L ou unidade do produto
    };
  } = {
    1005392: {
      codigo: "1005392",
      descricao: "HERBICIDA NUFARM U 46 BR",
      nomeComercial: "U 46 BR",
      categoriaId: 69,
      capacidadeEmbalagem: 30, // 30L por embalagem
    },
    1027638: {
      codigo: "1027638",
      descricao: "HERBICIDA UPL DEZ",
      nomeComercial: "DEZ",
      categoriaId: 69,
      capacidadeEmbalagem: 20, // 20L por embalagem
    },
    1027636: {
      codigo: "1027636",
      descricao: "HERBICIDA IHARA MIRANT",
      nomeComercial: "MIRANT",
      categoriaId: 69,
      capacidadeEmbalagem: 25, // 25L por embalagem
    },
  };

  // Mapeamento de categorias (baseado em InsumosAgricolas.tsx)
  const categorias: {
    [key: number]: {
      codigo: string;
      descricaoResumida: string;
      descricaoCompleta?: string;
    };
  } = {
    69: {
      codigo: "69",
      descricaoResumida: "Herbicida 2,4 D-DIMETILAM 806 G/L",
      descricaoCompleta:
        "Herbicida 2,4 D-DIMETILAM 806 G/L - Descrição completa do grupo",
    },
    617: {
      codigo: "617",
      descricaoResumida: "Fertilizante (Adubo)",
      descricaoCompleta: "Fertilizante (Adubo) - Descrição completa do grupo",
    },
    3001: {
      codigo: "3001",
      descricaoResumida: "Herbicida Tebuthiuron 500 G/L",
      descricaoCompleta:
        "Herbicida Tebuthiuron 500 G/L - Descrição completa do grupo",
    },
    5027: {
      codigo: "5027",
      descricaoResumida: "Formicida Isca Sulfluramida",
      descricaoCompleta:
        "Formicida Isca Sulfluramida - Descrição completa do grupo",
    },
  };

  // Estado do formulário
  const [novaOrdem, setNovaOrdem] = useState({
    numeroOS: "",
    centroCustoId: "",
    operacaoId: "",
    dataGeracao: "",
    observacoes: "",
    responsavelId: "",
    fazendaId: "",
    secao: "",
    talhoesSelecionados: [] as TalhaoSelecionado[],
    insumosSelecionados: [] as InsumoSelecionado[],
    caldaHA: "",
  });

  // Estados para seleção múltipla
  const [talhoesSelecionados, setTalhoesSelecionados] = useState<Set<string>>(
    new Set()
  );
  const [insumosSelecionados, setInsumosSelecionados] = useState<
    Map<number, { idItem: number; doseHA: number }>
  >(new Map());

  // Estados para busca/filtro
  const [buscaInsumos, setBuscaInsumos] = useState("");
  const [filtroTipoEstoqueInsumos, setFiltroTipoEstoqueInsumos] = useState<
    "TODOS" | "TÉCNICO" | "FRACIONÁRIO"
  >("TODOS");

  // Estados para controlar expansão das seções
  const [talhoesExpanded, setTalhoesExpanded] = useState(false);
  const [insumosExpanded, setInsumosExpanded] = useState(false);

  // Dados simulados das ordens de serviços
  const [ordensServicos, setOrdensServicos] = useState<OrdemServico[]>([
    {
      id: "OS001",
      numeroOS: "OS-2024-001",
      centroCustoId: "1",
      operacaoId: "1",
      dataGeracao: "2024-01-20",
      observacoes: "Serviços normal, sem intercorrências",
      responsavelId: "1",
      fazendaId: "1",
      secao: "Seção A",
      talhoes: [{ fazendaId: "1", talhaoId: "1" }],
      insumos: [{ idEstoque: 1, idItem: 1005392, doseHA: 0.12 }],
      caldaHA: "2.5",
      status: "nao_totalizada",
      progresso: 75,
      iniciado: "2024-01-20 08:00",
      previsaoTermino: "2024-01-20 16:00",
    },
    {
      id: "OS002",
      numeroOS: "OS-2024-002",
      centroCustoId: "2",
      operacaoId: "2",
      dataGeracao: "2024-01-21",
      observacoes: "OS importada sem calda/HA",
      responsavelId: "2",
      fazendaId: "2",
      secao: "Seção B",
      talhoes: [{ fazendaId: "2", talhaoId: "4" }],
      insumos: [{ idEstoque: 2, idItem: 1027638, doseHA: 0.15 }],
      caldaHA: "",
      status: "aguardando_informacoes",
      progresso: 0,
      iniciado: null,
      previsaoTermino: null,
    },
    {
      id: "OS003",
      numeroOS: "OS-2024-003",
      centroCustoId: "1",
      operacaoId: "3",
      dataGeracao: "2024-01-22",
      observacoes: "OS totalmente preenchida e pronta para iniciar",
      responsavelId: "1",
      fazendaId: "1",
      secao: "Seção A",
      talhoes: [
        { fazendaId: "1", talhaoId: "1" },
        { fazendaId: "1", talhaoId: "2" },
      ],
      insumos: [
        { idEstoque: 1, idItem: 1005392, doseHA: 0.12 },
        { idEstoque: 3, idItem: 1027636, doseHA: 0.08 },
      ],
      caldaHA: "3.5",
      status: "em_preparo",
      progresso: 55,
      iniciado: null,
      previsaoTermino: null,
    },
    {
      id: "OS004",
      numeroOS: "OS-2024-004",
      centroCustoId: "4",
      operacaoId: "4",
      dataGeracao: "2024-01-23",
      observacoes: "OS em preparo - configurações sendo feitas",
      responsavelId: "4",
      fazendaId: "3",
      secao: "Seção C",
      talhoes: [{ fazendaId: "3", talhaoId: "6" }],
      insumos: [{ idEstoque: 1, idItem: 1005392, doseHA: 0.1 }],
      caldaHA: "2.8",
      status: "em_preparo",
      progresso: 0,
      iniciado: null,
      previsaoTermino: null,
    },
    {
      id: "OS005",
      numeroOS: "OS-2024-005",
      centroCustoId: "5",
      operacaoId: "5",
      dataGeracao: "2024-01-24",
      observacoes: "OS processada com sucesso",
      responsavelId: "5",
      fazendaId: "4",
      secao: "Seção D",
      talhoes: [
        { fazendaId: "4", talhaoId: "8" },
        { fazendaId: "4", talhaoId: "9" },
      ],
      insumos: [{ idEstoque: 2, idItem: 1027638, doseHA: 0.2 }],
      caldaHA: "4.0",
      status: "finalizada",
      progresso: 100,
      iniciado: "2024-01-24 07:00",
      previsaoTermino: "2024-01-24 15:00",
    },
    {
      id: "OS006",
      numeroOS: "OS-2024-006",
      centroCustoId: "2",
      operacaoId: "2",
      dataGeracao: "2024-01-25",
      observacoes: "OS não totalizada - pendências",
      responsavelId: "2",
      fazendaId: "2",
      secao: "Seção B",
      talhoes: [{ fazendaId: "2", talhaoId: "4" }],
      insumos: [{ idEstoque: 3, idItem: 1027636, doseHA: 0.15 }],
      caldaHA: "2.2",
      status: "nao_totalizada",
      progresso: 60,
      iniciado: "2024-01-25 08:00",
      previsaoTermino: null,
    },
    {
      id: "OS007",
      numeroOS: "OS-2024-007",
      centroCustoId: "1",
      operacaoId: "1",
      dataGeracao: "2024-01-26",
      observacoes: "OS finalizada com sucesso",
      responsavelId: "1",
      fazendaId: "1",
      secao: "Seção A",
      talhoes: [{ fazendaId: "1", talhaoId: "2" }],
      insumos: [{ idEstoque: 1, idItem: 1005392, doseHA: 0.12 }],
      caldaHA: "2.5",
      status: "finalizada",
      progresso: 100,
      iniciado: "2024-01-26 08:00",
      previsaoTermino: "2024-01-26 16:00",
    },
    {
      id: "OS008",
      numeroOS: "OS-2024-008",
      centroCustoId: "3",
      operacaoId: "3",
      dataGeracao: "2024-01-27",
      observacoes: "OS importada - falta preencher calda/HA",
      responsavelId: "3",
      fazendaId: "3",
      secao: "Seção C",
      talhoes: [{ fazendaId: "3", talhaoId: "6" }],
      insumos: [{ idEstoque: 2, idItem: 1027638, doseHA: 0.18 }],
      caldaHA: "",
      status: "aguardando_informacoes",
      progresso: 0,
      iniciado: null,
      previsaoTermino: null,
    },
    {
      id: "OS009",
      numeroOS: "OS-2024-009",
      centroCustoId: "1",
      operacaoId: "1",
      dataGeracao: "2024-01-28",
      observacoes: "OS com parcela em processo para demonstrar cancelamento",
      responsavelId: "1",
      fazendaId: "1",
      secao: "Seção A",
      talhoes: [
        { fazendaId: "1", talhaoId: "1" },
        { fazendaId: "1", talhaoId: "2" },
      ],
      insumos: [
        { idEstoque: 1, idItem: 1005392, doseHA: 0.12 },
        { idEstoque: 3, idItem: 1027636, doseHA: 0.08 },
      ],
      caldaHA: "3.5",
      status: "nao_totalizada",
      progresso: 65,
      iniciado: "2024-01-28T08:30:00",
      previsaoTermino: null,
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aguardando_informacoes":
        return "outline";
      case "pendente":
        return "outline";
      case "em_preparo":
        return "secondary";
      case "nao_totalizada":
        return "destructive";
      case "finalizada":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aguardando_informacoes":
        return "Aguardando informações";
      case "pendente":
        return "Pendente";
      case "em_preparo":
        return "Em Preparo";
      case "nao_totalizada":
        return "Não totalizada";
      case "finalizada":
        return "Finalizada";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aguardando_informacoes":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      case "pendente":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "em_preparo":
        return <Settings className="h-4 w-4 text-blue-500" />;
      case "nao_totalizada":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "finalizada":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredOrdens = ordensServicos.filter((ordem) => {
    // Filtro de busca: número da OS e nome da fazenda
    const fazenda = fazendas.find((f) => f.id === ordem.fazendaId);
    const nomeFazenda = fazenda?.descricao || "";
    const matchesSearch =
      !searchTerm ||
      ordem.numeroOS.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nomeFazenda.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de status
    const matchesStatus =
      statusFilter === "todos" || ordem.status === statusFilter;

    // Filtro de período (data de geração)
    const dataGeracao = new Date(ordem.dataGeracao);
    const matchesPeriodo =
      (!dateRange?.from || dataGeracao >= dateRange.from) &&
      (!dateRange?.to || dataGeracao <= dateRange.to);

    return matchesSearch && matchesStatus && matchesPeriodo;
  });

  const handleToggleTalhao = (fazendaId: string, talhaoId: string) => {
    const key = `${fazendaId}-${talhaoId}`;
    const newSet = new Set(talhoesSelecionados);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setTalhoesSelecionados(newSet);
  };

  const handleToggleInsumo = (idEstoque: number, idItem: number) => {
    const newMap = new Map(insumosSelecionados);
    if (newMap.has(idEstoque)) {
      newMap.delete(idEstoque);
    } else {
      newMap.set(idEstoque, { idItem, doseHA: 0 });
    }
    setInsumosSelecionados(newMap);
  };

  const handleDoseHAInsumo = (
    idEstoque: number,
    idItem: number,
    doseHA: number
  ) => {
    const newMap = new Map(insumosSelecionados);
    if (newMap.has(idEstoque)) {
      newMap.set(idEstoque, { idItem, doseHA });
      setInsumosSelecionados(newMap);
    }
  };

  const handleIncluirOrdem = () => {
    if (
      !novaOrdem.numeroOS ||
      !novaOrdem.centroCustoId ||
      !novaOrdem.operacaoId ||
      !novaOrdem.dataGeracao
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const talhoes: TalhaoSelecionado[] = Array.from(talhoesSelecionados).map(
      (key) => {
        const [fazendaId, talhaoId] = key.split("-");
        return { fazendaId, talhaoId };
      }
    );

    const insumos: InsumoSelecionado[] = Array.from(
      insumosSelecionados.entries()
    ).map(([idEstoque, dados]) => {
      return {
        idEstoque,
        idItem: dados.idItem,
        doseHA: dados.doseHA,
      };
    });

    const fazendaSelecionada = fazendas.find(
      (f) => f.id === novaOrdem.fazendaId
    );

    if (ordemEditando) {
      // Modo de edição
      const ordemAtualizada: OrdemServico = {
        ...ordemEditando,
        numeroOS: novaOrdem.numeroOS,
        centroCustoId: novaOrdem.centroCustoId,
        operacaoId: novaOrdem.operacaoId,
        dataGeracao: novaOrdem.dataGeracao,
        observacoes: novaOrdem.observacoes,
        responsavelId: novaOrdem.responsavelId,
        fazendaId: novaOrdem.fazendaId,
        secao: novaOrdem.secao || fazendaSelecionada?.descricao || "",
        talhoes,
        insumos,
        caldaHA: novaOrdem.caldaHA,
        // Se estava aguardando informações e agora tem todos os dados, mudar para pendente
        status:
          ordemEditando.status === "aguardando_informacoes" && novaOrdem.caldaHA
            ? "pendente"
            : ordemEditando.status,
      };

      setOrdensServicos(
        ordensServicos.map((o) =>
          o.id === ordemEditando.id ? ordemAtualizada : o
        )
      );
      toast.success("Ordem de serviços atualizada com sucesso!");
    } else {
      // Modo de criação
      const novaOS: OrdemServico = {
        id: `OS${Date.now()}`,
        numeroOS: novaOrdem.numeroOS,
        centroCustoId: novaOrdem.centroCustoId,
        operacaoId: novaOrdem.operacaoId,
        dataGeracao: novaOrdem.dataGeracao,
        observacoes: novaOrdem.observacoes,
        responsavelId: novaOrdem.responsavelId,
        fazendaId: novaOrdem.fazendaId,
        secao: novaOrdem.secao || fazendaSelecionada?.descricao || "",
        talhoes,
        insumos,
        caldaHA: novaOrdem.caldaHA,
        status: novaOrdem.caldaHA ? "pendente" : "aguardando_informacoes",
        progresso: 0,
        iniciado: null,
        previsaoTermino: null,
      };

      setOrdensServicos([...ordensServicos, novaOS]);
      toast.success("Ordem de serviços criada com sucesso!");
    }

    // Limpar formulário
    setDialogOpen(false);
    setOrdemEditando(null);
    setNovaOrdem({
      numeroOS: "",
      centroCustoId: "",
      operacaoId: "",
      dataGeracao: "",
      observacoes: "",
      responsavelId: "",
      fazendaId: "",
      secao: "",
      talhoesSelecionados: [],
      insumosSelecionados: [],
      caldaHA: "",
    });
    setTalhoesSelecionados(new Set());
    setInsumosSelecionados(new Map());
    setBuscaInsumos("");
    setFiltroTipoEstoqueInsumos("TODOS");
  };

  const handleParametrizarOrdem = (id: string) => {
    const ordem = ordensServicos.find((o) => o.id === id);
    if (!ordem) return;

    setOrdemParametrizando(ordem);
    setParcelaEditando(null);
    setCaminhaoSelecionado("");
    setCapacidadeEditada("");
    setProporcaoCalda(0);
    setInsumosMovimentacao(new Map());
    setDialogParametrizacaoOpen(true);
  };

  const handleEditarParcela = (parcela: ParcelaCalda) => {
    // Encontrar a ordem de serviço relacionada à parcela
    const ordem = ordensServicos.find((o) => o.id === parcela.ordemServicoId);
    if (!ordem) return;

    // Configurar a ordem para parametrização
    setOrdemParametrizando(ordem);

    // Configurar os dados da parcela para edição
    setParcelaEditando(parcela);
    setSmartCaldaSelecionada(parcela.smartCaldaId.toString());
    setCaminhaoSelecionado(parcela.caminhaoId);
    setCapacidadeEditada(parcela.capacidadeCaminhao.toString());

    // Abrir o modal
    setDialogParametrizacaoOpen(true);

    // Os cálculos serão feitos automaticamente pelo useEffect
  };

  const handleCancelarEdicaoParcela = () => {
    setParcelaEditando(null);
    setSmartCaldaSelecionada("");
    setCaminhaoSelecionado("");
    setCapacidadeEditada("");
    setProporcaoCalda(0);
    setInsumosMovimentacao(new Map());
  };

  const handleSalvarAlteracoesParcela = () => {
    if (
      !ordemParametrizando ||
      !parcelaEditando ||
      !smartCaldaSelecionada ||
      !caminhaoSelecionado ||
      !capacidadeEditada
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const caminhao = caminhoes.find((c) => c.id === caminhaoSelecionado);
    if (!caminhao) {
      toast.error("Caminhão não encontrado. Selecione um caminhão válido.");
      return;
    }

    // Validação: capacidade editada não pode ser maior que a capacidade original do caminhão
    const capacidadeOriginal = Number(caminhao.volume) || 0;
    const capacidadeEditadaNum = Number(capacidadeEditada) || 0;
    if (capacidadeEditadaNum > capacidadeOriginal) {
      toast.error(
        `A capacidade não pode ser maior que ${capacidadeOriginal}L (capacidade original do caminhão)`
      );
      return;
    }

    if (insumosMovimentacao.size === 0) {
      toast.error("Nenhum insumo calculado. Verifique os dados.");
      return;
    }

    // Atualizar a parcela existente
    setParcelasCalda(
      parcelasCalda.map((p) =>
        p.id === parcelaEditando.id
          ? {
              ...p,
              smartCaldaId: Number(smartCaldaSelecionada),
              caminhaoId: caminhaoSelecionado,
              capacidadeCaminhao: Number(capacidadeEditada),
              proporcaoCalda,
              insumosMovimentados: Array.from(
                insumosMovimentacao.entries()
              ).map(([idEstoque, dados]) => ({
                idEstoque,
                idItem: dados.idItem,
                quantidade: dados.quantidade,
                origem: dados.origem,
                destino: "TÉCNICO",
              })),
              progressoOS: proporcaoCalda,
            }
          : p
      )
    );

    // Recalcular progresso da OS
    const parcelasDaOS = parcelasCalda
      .map((p) =>
        p.id === parcelaEditando.id
          ? {
              ...p,
              smartCaldaId: Number(smartCaldaSelecionada),
              caminhaoId: caminhaoSelecionado,
              capacidadeCaminhao: Number(capacidadeEditada),
              proporcaoCalda,
              progressoOS: proporcaoCalda,
            }
          : p
      )
      .filter((p) => p.ordemServicoId === ordemParametrizando.id);

    const progressoTotal = parcelasDaOS.reduce(
      (sum, p) => sum + p.progressoOS,
      0
    );

    setOrdensServicos(
      ordensServicos.map((o) =>
        o.id === ordemParametrizando.id
          ? {
              ...o,
              progresso: Math.min(progressoTotal, 100),
            }
          : o
      )
    );

    toast.success("Parcela atualizada com sucesso!");
    handleCancelarEdicaoParcela();
  };

  const handleEnviarParcelaAoSupervisorio = (parcelaId: string) => {
    const parcela = parcelasCalda.find((p) => p.id === parcelaId);
    if (!parcela || !ordemParametrizando) return;

    // Atualizar status da parcela para em_producao
    const parcelasAtualizadas = parcelasCalda.map((p) =>
      p.id === parcelaId
        ? {
            ...p,
            status: "em_producao" as const,
            dataInicio: new Date().toISOString(),
          }
        : p
    );
    setParcelasCalda(parcelasAtualizadas);

    // Calcular progresso total da OS
    const parcelasDaOS = parcelasAtualizadas.filter(
      (p) => p.ordemServicoId === ordemParametrizando.id
    );
    const progressoTotal = parcelasDaOS.reduce(
      (sum, p) => sum + p.progressoOS,
      0
    );

    // Atualizar status da OS para NÃO TOTALIZADA e progresso
    setOrdensServicos(
      ordensServicos.map((o) =>
        o.id === ordemParametrizando.id
          ? {
              ...o,
              status: progressoTotal >= 100 ? "finalizada" : "nao_totalizada",
              progresso: Math.min(progressoTotal, 100),
            }
          : o
      )
    );

    // Fechar modal e redirecionar para o supervisorio
    setDialogParametrizacaoOpen(false);
    setOrdemParametrizando(null);
    handleAbrirSupervisorio(parcelaId);
    toast.success("Calda parametrizada! Redirecionando para o supervisorio.");
  };

  // Função para calcular movimentações detalhadas baseadas na capacidade da embalagem
  const calcularMovimentacoesDetalhadas = (
    quantidadeNecessaria: number,
    capacidadeEmbalagem: number,
    origem: "PRIMÁRIO" | "FRACIONÁRIO",
    unidade: string
  ) => {
    const movimentacoes: {
      origem: "PRIMÁRIO" | "FRACIONÁRIO" | "TÉCNICO";
      destino: "TÉCNICO" | "FRACIONÁRIO";
      quantidade: number;
      unidade: string;
    }[] = [];

    if (!capacidadeEmbalagem || capacidadeEmbalagem <= 0) {
      // Se não há capacidade definida, retorna uma movimentação simples
      movimentacoes.push({
        origem,
        destino: "TÉCNICO",
        quantidade: quantidadeNecessaria,
        unidade,
      });
      return movimentacoes;
    }

    // Calcular quantas embalagens completas são necessárias
    const embalagensCompletas = Math.floor(
      quantidadeNecessaria / capacidadeEmbalagem
    );
    const resto = quantidadeNecessaria % capacidadeEmbalagem;

    // Adicionar movimentações de embalagens completas (ORIGEM -> TÉCNICO)
    for (let i = 0; i < embalagensCompletas; i++) {
      movimentacoes.push({
        origem,
        destino: "TÉCNICO",
        quantidade: capacidadeEmbalagem,
        unidade,
      });
    }

    // Se houver resto, adicionar movimentação parcial (FRACIONÁRIO -> TÉCNICO)
    // O estoque usado no Smart Calda sempre será o TÉCNICO
    if (resto > 0) {
      movimentacoes.push({
        origem: "FRACIONÁRIO",
        destino: "TÉCNICO",
        quantidade: resto,
        unidade,
      });
    }

    return movimentacoes;
  };

  // Atualizar proporção quando caminhão ou capacidade mudar
  useEffect(() => {
    if (ordemParametrizando && caminhaoSelecionado && capacidadeEditada) {
      const caminhao = caminhoes.find((c) => c.id === caminhaoSelecionado);
      if (!caminhao) return;

      // Calcular área total dos talhões
      const areaTotal = ordemParametrizando.talhoes.reduce((sum, talhao) => {
        const fazenda = fazendas.find((f) => f.id === talhao.fazendaId);
        const talhaoObj = fazenda?.talhoes.find(
          (t) => t.id === talhao.talhaoId
        );
        return sum + (Number(talhaoObj?.area) || 0);
      }, 0);

      // Calcular total de calda necessário
      const caldaHA = Number(ordemParametrizando.caldaHA) || 0;
      const totalCaldaNecessario = caldaHA * areaTotal;

      // Calcular proporção baseada na capacidade do caminhão
      const capacidade = Number(capacidadeEditada) || 0;
      const proporcao =
        totalCaldaNecessario > 0
          ? (capacidade / totalCaldaNecessario) * 100
          : 0;

      const proporcaoLimitada = Math.min(proporcao, 100); // Máximo 100%
      setProporcaoCalda(proporcaoLimitada);

      // Calcular quantidades de insumos necessárias para esta parcela
      const novosInsumos = new Map<
        number,
        {
          idItem: number;
          quantidade: number;
          origem: "PRIMÁRIO" | "FRACIONÁRIO";
        }
      >();

      ordemParametrizando.insumos.forEach((insumo) => {
        const insumoEstoque = insumos.find(
          (i) => i.idEstoque === insumo.idEstoque
        );
        if (!insumoEstoque) return;

        // Quantidade total do insumo para a OS completa
        const quantidadeTotal = areaTotal * insumo.doseHA;
        // Quantidade para esta parcela (proporcional)
        const quantidadeParcela = (quantidadeTotal * proporcaoLimitada) / 100;

        // Determinar origem: se está em estoque TÉCNICO, vem de PRIMÁRIO
        // Se está em FRACIONÁRIO, vem de FRACIONÁRIO
        const origem =
          insumoEstoque.tipoEstoque === "TÉCNICO" ? "PRIMÁRIO" : "FRACIONÁRIO";

        novosInsumos.set(insumo.idEstoque, {
          idItem: insumo.idItem,
          quantidade: quantidadeParcela,
          origem,
        });
      });

      setInsumosMovimentacao(novosInsumos);
    } else {
      setProporcaoCalda(0);
      setInsumosMovimentacao(new Map());
    }
  }, [
    caminhaoSelecionado,
    capacidadeEditada,
    ordemParametrizando,
    parcelaEditando,
  ]);

  const handleSalvarContinuarDepois = () => {
    if (
      !ordemParametrizando ||
      !smartCaldaSelecionada ||
      !caminhaoSelecionado ||
      !capacidadeEditada
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (insumosMovimentacao.size === 0) {
      toast.error("Nenhum insumo calculado. Verifique os dados.");
      return;
    }

    const caminhao = caminhoes.find((c) => c.id === caminhaoSelecionado);
    if (!caminhao) {
      toast.error("Caminhão não encontrado. Selecione um caminhão válido.");
      return;
    }

    // Validação: capacidade editada não pode ser maior que a capacidade original do caminhão
    const capacidadeOriginal = Number(caminhao.volume) || 0;
    const capacidadeEditadaNum = Number(capacidadeEditada) || 0;
    if (capacidadeEditadaNum > capacidadeOriginal) {
      toast.error(
        `A capacidade não pode ser maior que ${capacidadeOriginal}L (capacidade original do caminhão)`
      );
      return;
    }

    // Criar nova parcela
    const novaParcela: ParcelaCalda = {
      id: `PARCELA${Date.now()}`,
      ordemServicoId: ordemParametrizando.id,
      smartCaldaId: Number(smartCaldaSelecionada),
      caminhaoId: caminhaoSelecionado,
      capacidadeCaminhao: Number(capacidadeEditada),
      proporcaoCalda,
      insumosMovimentados: Array.from(insumosMovimentacao.entries()).map(
        ([idEstoque, dados]) => ({
          idEstoque,
          idItem: dados.idItem,
          quantidade: dados.quantidade,
          origem: dados.origem,
          destino: "TÉCNICO",
        })
      ),
      status: "na_maquina",
      progressoOS: proporcaoCalda,
      dataCriacao: new Date().toISOString(),
      dataInicio: null,
      dataFinalizacao: null,
    };

    setParcelasCalda([...parcelasCalda, novaParcela]);

    // Atualizar status da OS para NA MÁQUINA
    setOrdensServicos(
      ordensServicos.map((o) =>
        o.id === ordemParametrizando.id ? { ...o, status: "em_preparo" } : o
      )
    );

    toast.success("Parcela salva! OS está em preparo.");
    // Limpar campos mas manter o modal aberto para adicionar mais parcelas
    setSmartCaldaSelecionada("");
    setCaminhaoSelecionado("");
    setCapacidadeEditada("");
    setProporcaoCalda(0);
    setInsumosMovimentacao(new Map());
  };

  const handleEnviarAoSupervisorio = () => {
    if (
      !ordemParametrizando ||
      !smartCaldaSelecionada ||
      !caminhaoSelecionado ||
      !capacidadeEditada
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (insumosMovimentacao.size === 0) {
      toast.error("Nenhum insumo calculado. Verifique os dados.");
      return;
    }

    const caminhao = caminhoes.find((c) => c.id === caminhaoSelecionado);
    if (!caminhao) {
      toast.error("Caminhão não encontrado. Selecione um caminhão válido.");
      return;
    }

    // Validação: capacidade editada não pode ser maior que a capacidade original do caminhão
    const capacidadeOriginal = Number(caminhao.volume) || 0;
    const capacidadeEditadaNum = Number(capacidadeEditada) || 0;
    if (capacidadeEditadaNum > capacidadeOriginal) {
      toast.error(
        `A capacidade não pode ser maior que ${capacidadeOriginal}L (capacidade original do caminhão)`
      );
      return;
    }

    // Criar nova parcela
    const novaParcela: ParcelaCalda = {
      id: `PARCELA${Date.now()}`,
      ordemServicoId: ordemParametrizando.id,
      smartCaldaId: Number(smartCaldaSelecionada),
      caminhaoId: caminhaoSelecionado,
      capacidadeCaminhao: Number(capacidadeEditada),
      proporcaoCalda,
      insumosMovimentados: Array.from(insumosMovimentacao.entries()).map(
        ([idEstoque, dados]) => ({
          idEstoque,
          idItem: dados.idItem,
          quantidade: dados.quantidade,
          origem: dados.origem,
          destino: "TÉCNICO",
        })
      ),
      status: "em_producao",
      progressoOS: proporcaoCalda,
      dataCriacao: new Date().toISOString(),
      dataInicio: new Date().toISOString(),
      dataFinalizacao: null,
    };

    const novasParcelas = [...parcelasCalda, novaParcela];
    setParcelasCalda(novasParcelas);

    // Calcular progresso total da OS
    const parcelasDaOS = novasParcelas.filter(
      (p) => p.ordemServicoId === ordemParametrizando.id
    );
    const progressoTotal = parcelasDaOS.reduce(
      (sum, p) => sum + p.progressoOS,
      0
    );

    // Atualizar status da OS para NÃO TOTALIZADA e progresso
    setOrdensServicos(
      ordensServicos.map((o) =>
        o.id === ordemParametrizando.id
          ? {
              ...o,
              status: progressoTotal >= 100 ? "finalizada" : "nao_totalizada",
              progresso: Math.min(progressoTotal, 100),
            }
          : o
      )
    );

    // Fechar modal e redirecionar para o supervisorio
    const parcelaId = novaParcela.id;
    setDialogParametrizacaoOpen(false);
    setOrdemParametrizando(null);
    setCaminhaoSelecionado("");
    setCapacidadeEditada("");
    setProporcaoCalda(0);
    setInsumosMovimentacao(new Map());
    handleAbrirSupervisorio(parcelaId);
    toast.success("Calda parametrizada! Redirecionando para o supervisorio.");
  };

  const handleAbrirSupervisorio = (parcelaId: string) => {
    // TODO: Redirecionar para o supervisório da parcela específica
    // Exemplo: window.location.href = `/supervisorio/parcela/${parcelaId}`;
    // Ou usar navegação do React Router: navigate(`/supervisorio/parcela/${parcelaId}`);
    toast.info(`Redirecionando para o supervisório da parcela ${parcelaId}`);
    // Por enquanto apenas mostra um toast, mas aqui deve redirecionar
  };

  const handleCancelarParcela = (parcelaId: string) => {
    const parcela = parcelasCalda.find((p) => p.id === parcelaId);
    if (!parcela) return;

    // Validar que a parcela está na máquina (único status que permite cancelamento)
    if (parcela.status !== "na_maquina") {
      toast.error(
        "Apenas parcelas na máquina podem ser canceladas. Parcelas em produção devem ser pausadas ou finalizadas."
      );
      return;
    }

    // Confirmar cancelamento
    if (
      !confirm(
        "Tem certeza que deseja cancelar esta parcela? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    // Atualizar status da parcela para cancelado
    const parcelasAtualizadas = parcelasCalda.map((p) =>
      p.id === parcelaId
        ? {
            ...p,
            status: "cancelado" as const,
          }
        : p
    );
    setParcelasCalda(parcelasAtualizadas);

    // Recalcular progresso da OS (remover a parcela cancelada do progresso)
    const ordem = ordensServicos.find((o) => o.id === parcela.ordemServicoId);
    if (ordem) {
      const parcelasDaOS = parcelasAtualizadas.filter(
        (p) => p.ordemServicoId === ordem.id && p.status !== "cancelado"
      );
      const progressoTotal = parcelasDaOS.reduce(
        (sum, p) => sum + p.progressoOS,
        0
      );

      // Atualizar status e progresso da OS
      setOrdensServicos(
        ordensServicos.map((o) =>
          o.id === ordem.id
            ? {
                ...o,
                progresso: Math.min(progressoTotal, 100),
                status:
                  progressoTotal >= 100
                    ? "finalizada"
                    : progressoTotal > 0
                    ? "nao_totalizada"
                    : o.status,
              }
            : o
        )
      );
    }

    toast.success("Parcela cancelada com sucesso!");
  };

  const handleImportarOrdens = () => {
    toast.info("Funcionalidade de importação em desenvolvimento");
  };

  const handleExportar = (tipo: "csv" | "pdf") => {
    toast.info(`Exportando como ${tipo.toUpperCase()}...`);
  };

  const getTalhaoLabel = (fazendaId: string, talhaoId: string) => {
    const fazenda = fazendas.find((f) => f.id === fazendaId);
    if (!fazenda) return "";
    const talhao = fazenda.talhoes.find((t) => t.id === talhaoId);
    if (!talhao) return "";
    return `${fazenda.descricao} - ${
      talhao.observacoes || `Talhão ${talhaoId}`
    } (${talhao.area} ha)`;
  };

  const getInsumoLabel = (idItem: number) => {
    const material = materiaisAgricolas[idItem];
    return material
      ? `${material.nomeComercial} (${material.codigo})`
      : `Item ${idItem}`;
  };

  const toggleOrdemExpansao = (ordemId: string) => {
    const novosExpandidos = new Set(expandedOrdens);
    if (novosExpandidos.has(ordemId)) {
      novosExpandidos.delete(ordemId);
    } else {
      novosExpandidos.add(ordemId);
    }
    setExpandedOrdens(novosExpandidos);
  };

  // Filtrar talhões da fazenda selecionada (otimizado com useMemo)
  const talhoesFiltrados = useMemo(() => {
    const fazendaSelecionada = fazendas.find(
      (f) => f.id === novaOrdem.fazendaId
    );

    // Se não houver fazenda selecionada, não mostrar talhões
    if (!fazendaSelecionada) {
      return [];
    }

    return fazendaSelecionada.talhoes
      .filter((t) => t.tipo === "Talhão" && t.status === "Ativo")
      .map((talhao) => ({
        fazenda: fazendaSelecionada,
        talhao,
        key: `${fazendaSelecionada.id}-${talhao.id}`,
      }));
  }, [fazendas, novaOrdem.fazendaId]);

  // Filtrar insumos com busca (otimizado com useMemo)
  // Função para formatar data no formato DD/MM/YYYY - hh:mm:ss
  const formatarDataHora = (dataHora: string | null | undefined): string => {
    if (!dataHora) return "";
    try {
      // Tenta parsear a data/hora
      const data = new Date(dataHora);
      if (isNaN(data.getTime())) return dataHora; // Se não conseguir parsear, retorna o valor original

      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const ano = data.getFullYear();
      const horas = String(data.getHours()).padStart(2, "0");
      const minutos = String(data.getMinutes()).padStart(2, "0");
      const segundos = String(data.getSeconds()).padStart(2, "0");

      return `${dia}/${mes}/${ano} - ${horas}:${minutos}:${segundos}`;
    } catch {
      return dataHora;
    }
  };

  const insumosFiltrados = useMemo(() => {
    const termoLower = buscaInsumos.toLowerCase().trim();
    const filtroEstoque =
      filtroTipoEstoqueInsumos === "TODOS" ? null : filtroTipoEstoqueInsumos;

    return insumos
      .filter((insumo) => {
        // Filtro por tipo de estoque
        if (filtroEstoque && insumo.tipoEstoque !== filtroEstoque) {
          return false;
        }

        // Filtro por busca
        if (!termoLower) return true;

        const material = materiaisAgricolas[insumo.idItem];
        const categoria = material?.categoriaId
          ? categorias[material.categoriaId]
          : null;
        const categoriaCodigo = categoria?.codigo?.toLowerCase() || "";
        const categoriaDescricaoResumida =
          categoria?.descricaoResumida?.toLowerCase() || "";
        const categoriaDescricaoCompleta =
          categoria?.descricaoCompleta?.toLowerCase() || "";

        return (
          categoriaCodigo.includes(termoLower) ||
          categoriaDescricaoResumida.includes(termoLower) ||
          categoriaDescricaoCompleta.includes(termoLower) ||
          insumo.idItem.toString().includes(termoLower)
        );
      })
      .slice(0, 100); // Limitar a 100 resultados para performance
  }, [buscaInsumos, filtroTipoEstoqueInsumos, insumos]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Ordens de Serviços
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle e acompanhamento das ordens de serviços
          </p>
        </div>
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="mt-1">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Status das Ordens de Serviços e Parcelas
              </DialogTitle>
              <DialogDescription>
                Descrição completa dos status disponíveis no sistema
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              {/* Tabela de Status da OS */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Status da Ordem de Serviço (OS)
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="outline">
                            Aguardando informações
                          </Badge>
                        </TableCell>
                        <TableCell>
                          Quando os dados obrigatórios ainda não foram todos
                          preenchidos
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="outline">Pendente</Badge>
                        </TableCell>
                        <TableCell>
                          Quando os dados obrigatórios foram preenchidos, mas
                          nenhuma ação foi realizada
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="secondary">Em Preparo</Badge>
                        </TableCell>
                        <TableCell>
                          Quando o operador está realizando as configurações de
                          movimentação para iniciar a execução, mas clicou em
                          "salvar e continuar depois"
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="destructive">Não totalizada</Badge>
                        </TableCell>
                        <TableCell>
                          Quando pelo menos 1 parcela foi executada
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="default" className="bg-success">
                            Finalizada
                          </Badge>
                        </TableCell>
                        <TableCell>Quando 100% da OS foi executada</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Tabela de Status da Parcela */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Status da Parcela da OS
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge
                            variant="default"
                            className="bg-blue-500 text-white"
                          >
                            Na máquina
                          </Badge>
                        </TableCell>
                        <TableCell>
                          Quando o operador registrou a parcela, mas não a
                          iniciou
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge
                            variant="default"
                            className="bg-primary text-white"
                          >
                            Em Produção
                          </Badge>
                        </TableCell>
                        <TableCell>
                          Quando está no processo de batida no smartcalda
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge
                            variant="default"
                            className="bg-green-500 text-white"
                          >
                            Processada
                          </Badge>
                        </TableCell>
                        <TableCell>
                          Quando a batida da parcela estiver concluída
                          (informado pelo supervisório)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge
                            variant="default"
                            className="bg-yellow-500 text-white"
                          >
                            Pausado
                          </Badge>
                        </TableCell>
                        <TableCell>
                          Quando a batida é pausada (informado pelo
                          supervisório)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge
                            variant="default"
                            className="bg-orange-500 text-white"
                          >
                            Bloqueado
                          </Badge>
                        </TableCell>
                        <TableCell>
                          Quando uma OS é iniciada, mas a Smart Calda já está
                          ocupada. Neste caso, o CLP impede (bloqueia) a
                          execução dessa parcela de receita
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge
                            variant="default"
                            className="bg-red-500 text-white"
                          >
                            Cancelado
                          </Badge>
                        </TableCell>
                        <TableCell>
                          Quando a produção da calda é cancelada pelo operador
                          na tela de OS
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {
                ordensServicos.filter(
                  (o) => o.status === "aguardando_informacoes"
                ).length
              }
            </p>
            <p className="text-sm text-muted-foreground">
              Aguardando informações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {ordensServicos.filter((o) => o.status === "pendente").length}
            </p>
            <p className="text-sm text-muted-foreground">Pendente</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Settings className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-500">
              {ordensServicos.filter((o) => o.status === "em_preparo").length}
            </p>
            <p className="text-sm text-muted-foreground">Em Preparo</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Busca por número da OS e nome da fazenda */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número da OS ou fazenda"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtro de Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="aguardando_informacoes">
                  Aguardando informações
                </SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_preparo">Em Preparo</SelectItem>
                <SelectItem value="nao_totalizada">Não totalizada</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>

            {/* Período (Cadastro da OS) */}
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange?.from &&
                      !dateRange?.to &&
                      "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", {
                          locale: ptBR,
                        })}{" "}
                        - {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione o período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                sideOffset={4}
              >
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Botão Limpar Filtros - só aparece quando há filtros aplicados */}
          {(searchTerm !== "" ||
            statusFilter !== "todos" ||
            dateRange !== undefined) && (
            <div className="flex justify-end mt-4">
              <Button
                variant="destructive"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("todos");
                  setDateRange(undefined);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
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
              <DropdownMenuItem onClick={handleImportarOrdens}>
                <Upload className="h-4 w-4 mr-2" />
                PIMS
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
              <DropdownMenuItem onClick={() => handleExportar("csv")}>
                <FileText className="h-4 w-4 mr-2" />
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportar("pdf")}>
                <FileText className="h-4 w-4 mr-2" />
                Exportar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nova Ordem</span>
                <span className="sm:hidden">Nova Ordem</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {ordemEditando
                    ? "Editar Ordem de Serviço"
                    : "Criar Nova Ordem de Serviço"}
                </DialogTitle>
                <DialogDescription>
                  {ordemEditando
                    ? "Atualize os dados da ordem de serviço"
                    : "Preencha os dados da ordem de serviço"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Campos básicos */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroOS">Número da OS *</Label>
                    <Input
                      id="numeroOS"
                      value={novaOrdem.numeroOS}
                      onChange={(e) =>
                        setNovaOrdem({ ...novaOrdem, numeroOS: e.target.value })
                      }
                      placeholder="Ex: OS-2024-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataGeracao">Data da Geração *</Label>
                    <Input
                      id="dataGeracao"
                      type="date"
                      value={novaOrdem.dataGeracao}
                      onChange={(e) =>
                        setNovaOrdem({
                          ...novaOrdem,
                          dataGeracao: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="centroCusto">Centro de Custo *</Label>
                    <Select
                      value={novaOrdem.centroCustoId}
                      onValueChange={(value) =>
                        setNovaOrdem({ ...novaOrdem, centroCustoId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o centro de custo" />
                      </SelectTrigger>
                      <SelectContent>
                        {centrosCusto
                          .filter((cc) => cc.status === "Ativo")
                          .map((cc) => (
                            <SelectItem key={cc.id} value={cc.id}>
                              {cc.descricao}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operacao">Operação *</Label>
                    <Select
                      value={novaOrdem.operacaoId}
                      onValueChange={(value) =>
                        setNovaOrdem({ ...novaOrdem, operacaoId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a operação" />
                      </SelectTrigger>
                      <SelectContent>
                        {operacoes
                          .filter((op) => op.status === "Ativo")
                          .map((op) => (
                            <SelectItem key={op.id} value={op.id}>
                              {op.descricao}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="responsavel">Responsável</Label>
                    <Select
                      value={novaOrdem.responsavelId}
                      onValueChange={(value) =>
                        setNovaOrdem({ ...novaOrdem, responsavelId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        {responsaveis
                          .filter((r) => r.status === "Ativo")
                          .map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Seleção de Fazenda - Ocupa linha inteira */}
                <div className="space-y-2">
                  <Label htmlFor="fazenda">(Seção)Fazenda/Talhões</Label>
                  <Select
                    value={novaOrdem.fazendaId}
                    onValueChange={(value) => {
                      const fazenda = fazendas.find((f) => f.id === value);
                      setNovaOrdem({
                        ...novaOrdem,
                        fazendaId: value,
                        secao: fazenda?.descricao || "",
                      });
                      // Limpar talhões selecionados ao trocar fazenda
                      setTalhoesSelecionados(new Set());
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a fazenda">
                        {novaOrdem.fazendaId
                          ? (() => {
                              const fazenda = fazendas.find(
                                (f) => f.id === novaOrdem.fazendaId
                              );
                              return fazenda?.codigoExterno
                                ? `${fazenda.codigoExterno} - ${fazenda.descricao}`
                                : fazenda?.descricao || "";
                            })()
                          : "Selecione a fazenda"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {fazendas
                        .filter((f) => !f.status || f.status === "Ativo")
                        .map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.codigoExterno
                              ? `${f.codigoExterno} - ${f.descricao}`
                              : f.descricao}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Seção é a mesma coisa que fazenda
                  </p>
                </div>

                {/* Seleção de Talhões - Mostra apenas se fazenda estiver selecionada */}
                {novaOrdem.fazendaId && (
                  <Collapsible
                    open={talhoesExpanded}
                    onOpenChange={setTalhoesExpanded}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Label>Talhões</Label>
                      <div className="flex items-center gap-2">
                        {talhoesSelecionados.size > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {talhoesSelecionados.size} selecionado(s)
                          </span>
                        )}
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            {talhoesExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>

                    {/* Lista de Talhões Selecionados */}
                    {talhoesSelecionados.size > 0 && (
                      <div className="border rounded-lg p-3 bg-muted/30">
                        <p className="text-sm font-medium mb-2">
                          Talhões Selecionados:
                        </p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {Array.from(talhoesSelecionados).map((key) => {
                            const [fazendaId, talhaoId] = key.split("-");
                            const fazenda = fazendas.find(
                              (f) => f.id === fazendaId
                            );
                            const talhao = fazenda?.talhoes.find(
                              (t) => t.id === talhaoId
                            );
                            if (!talhao) return null;
                            return (
                              <div
                                key={key}
                                className="flex items-center justify-between text-sm py-1 px-2 bg-background rounded"
                              >
                                <span>
                                  {talhao.observacoes || `Talhão ${talhao.id}`}{" "}
                                  <span className="text-muted-foreground">
                                    ({talhao.area} ha)
                                  </span>
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  onClick={() =>
                                    handleToggleTalhao(fazendaId, talhaoId)
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <CollapsibleContent>
                      <div className="border rounded-lg p-2 max-h-80 overflow-y-auto">
                        {talhoesFiltrados.length === 0 ? (
                          <div className="text-center py-4 text-sm text-muted-foreground">
                            Nenhum talhão encontrado
                          </div>
                        ) : (
                          talhoesFiltrados.map((item) => {
                            const isSelected = talhoesSelecionados.has(
                              item.key
                            );
                            return (
                              <div
                                key={item.key}
                                className="flex items-center space-x-2 py-2 px-2 hover:bg-muted/50 rounded transition-colors"
                              >
                                <Checkbox
                                  id={item.key}
                                  checked={isSelected}
                                  onCheckedChange={() =>
                                    handleToggleTalhao(
                                      item.fazenda.id,
                                      item.talhao.id
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={item.key}
                                  className="text-sm font-normal cursor-pointer flex-1"
                                >
                                  {item.talhao.observacoes ||
                                    `Talhão ${item.talhao.id}`}
                                  {" ("}
                                  {item.talhao.area} ha)
                                </Label>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caldaHA">Calda/Ha (L)</Label>
                    <Input
                      id="caldaHA"
                      type="number"
                      step="0.01"
                      value={novaOrdem.caldaHA}
                      onChange={(e) =>
                        setNovaOrdem({ ...novaOrdem, caldaHA: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="producao">Área Total de Aplicação</Label>
                    <Input
                      id="producao"
                      type="number"
                      step="0.01"
                      value={(() => {
                        // Calcular soma das áreas dos talhões selecionados
                        const somaAreas = Array.from(
                          talhoesSelecionados
                        ).reduce((sum, key) => {
                          const [fazendaId, talhaoId] = key.split("-");
                          const fazenda = fazendas.find(
                            (f) => f.id === fazendaId
                          );
                          const talhao = fazenda?.talhoes.find(
                            (t) => t.id === talhaoId
                          );
                          return sum + (Number(talhao?.area) || 0);
                        }, 0);
                        return somaAreas.toFixed(2);
                      })()}
                      readOnly
                      disabled
                      className="bg-muted cursor-not-allowed"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-muted-foreground">
                      Soma das áreas dos talhões selecionados
                    </p>
                  </div>
                </div>

                {/* Seleção de Insumos */}
                <Collapsible
                  open={insumosExpanded}
                  onOpenChange={setInsumosExpanded}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label>Insumos</Label>
                    <div className="flex items-center gap-2">
                      {insumosSelecionados.size > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {insumosSelecionados.size} selecionado(s)
                        </span>
                      )}
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          {insumosExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  {/* Lista de Insumos Selecionados */}
                  {insumosSelecionados.size > 0 && (
                    <div className="border rounded-lg p-3 bg-muted/30">
                      <p className="text-sm font-medium mb-2">
                        Insumos Selecionados:
                      </p>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {Array.from(insumosSelecionados.entries()).map(
                          ([idEstoque, dados]) => {
                            const insumo = insumos.find(
                              (i) => i.idEstoque === idEstoque
                            );
                            if (!insumo) return null;
                            const material = materiaisAgricolas[insumo.idItem];
                            const categoria = material?.categoriaId
                              ? categorias[material.categoriaId]
                              : null;
                            return (
                              <div
                                key={idEstoque}
                                className="flex items-center justify-between text-sm py-1 px-2 bg-background rounded"
                              >
                                <div className="flex-1">
                                  <span className="font-medium">
                                    {categoria?.codigo || "N/A"} -{" "}
                                    {categoria?.descricaoResumida ||
                                      "Sem descrição"}
                                  </span>
                                  <span className="text-muted-foreground ml-2">
                                    • Dose/Ha: {dados.doseHA.toFixed(2)}{" "}
                                    {insumo.unidade}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  onClick={() =>
                                    handleToggleInsumo(idEstoque, dados.idItem)
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  <CollapsibleContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="relative md:col-span-2 w-full">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar por código do grupo, descrição resumida ou descrição completa."
                          value={buscaInsumos}
                          onChange={(e) => setBuscaInsumos(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="border rounded-lg p-2 max-h-64 overflow-y-auto space-y-2">
                      {insumosFiltrados.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          Nenhum insumo encontrado
                        </div>
                      ) : (
                        insumosFiltrados.map((insumo) => {
                          const material = materiaisAgricolas[insumo.idItem];
                          const categoria = material?.categoriaId
                            ? categorias[material.categoriaId]
                            : null;
                          const isSelected = insumosSelecionados.has(
                            insumo.idEstoque
                          );
                          const dadosInsumo = insumosSelecionados.get(
                            insumo.idEstoque
                          ) || {
                            idItem: insumo.idItem,
                            doseHA: 0,
                          };

                          return (
                            <div
                              key={insumo.idEstoque}
                              className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded transition-colors"
                            >
                              <Checkbox
                                id={`insumo-${insumo.idEstoque}`}
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleToggleInsumo(
                                    insumo.idEstoque,
                                    insumo.idItem
                                  )
                                }
                              />
                              <Label
                                htmlFor={`insumo-${insumo.idEstoque}`}
                                className="text-sm font-normal cursor-pointer flex-1"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {categoria?.codigo || "N/A"} -{" "}
                                    {categoria?.descricaoResumida ||
                                      "Sem descrição"}
                                  </span>
                                </div>
                              </Label>
                              {isSelected && (
                                <div className="flex items-center gap-2 ml-2">
                                  <Input
                                    type="number"
                                    placeholder="Dose/Ha"
                                    value={dadosInsumo.doseHA}
                                    onChange={(e) =>
                                      handleDoseHAInsumo(
                                        insumo.idEstoque,
                                        insumo.idItem,
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-24"
                                    min={0}
                                    step="0.01"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                                    Dose/Ha
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={novaOrdem.observacoes}
                    onChange={(e) =>
                      setNovaOrdem({
                        ...novaOrdem,
                        observacoes: e.target.value,
                      })
                    }
                    placeholder="Observações sobre a ordem de serviços"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setOrdemEditando(null);
                    setNovaOrdem({
                      numeroOS: "",
                      centroCustoId: "",
                      operacaoId: "",
                      dataGeracao: "",
                      observacoes: "",
                      responsavelId: "",
                      fazendaId: "",
                      secao: "",
                      talhoesSelecionados: [],
                      insumosSelecionados: [],
                      caldaHA: "",
                    });
                    setTalhoesSelecionados(new Set());
                    setInsumosSelecionados(new Map());
                    setBuscaInsumos("");
                    setFiltroTipoEstoqueInsumos("TODOS");
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" onClick={handleIncluirOrdem}>
                  {ordemEditando ? "Salvar Alterações" : "Criar Ordem"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Listagem Hierárquica de Ordens */}
      <Card>
        <CardHeader>
          <CardTitle>Ordens de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrdens.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  Nenhuma ordem de serviços encontrada
                </p>
                <p className="text-sm">
                  {searchTerm || statusFilter !== "todos"
                    ? "Tente ajustar os termos de busca"
                    : "Comece criando uma nova ordem de serviços"}
                </p>
              </div>
            ) : (
              filteredOrdens.map((ordem) => {
                const centroCusto = centrosCusto.find(
                  (cc) => cc.id === ordem.centroCustoId
                );
                const operacao = operacoes.find(
                  (op) => op.id === ordem.operacaoId
                );
                const responsavel = responsaveis.find(
                  (r) => r.id === ordem.responsavelId
                );
                const isExpanded = expandedOrdens.has(ordem.id);

                return (
                  <div key={ordem.id} className="border rounded-lg">
                    {/* Header da Ordem */}
                    <div className="p-4 bg-muted/50 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleOrdemExpansao(ordem.id)}
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
                                  {ordem.numeroOS}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(ordem.status)}
                                  <Badge variant={getStatusBadge(ordem.status)}>
                                    {getStatusLabel(ordem.status)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-1 flex-wrap">
                                <span className="text-sm text-muted-foreground">
                                  <span className="font-medium">Operação:</span>{" "}
                                  {operacao?.descricao || "-"}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  <span className="font-medium">
                                    Centro de Custo:
                                  </span>{" "}
                                  {centroCusto?.descricao || "-"}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  <span className="font-medium">Data:</span>{" "}
                                  {new Date(
                                    ordem.dataGeracao
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                                {responsavel && (
                                  <span className="text-sm text-muted-foreground">
                                    <span className="font-medium">
                                      Responsável:
                                    </span>{" "}
                                    {responsavel.nome}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    Progresso: {ordem.progresso}%
                                  </span>
                                  <Progress
                                    value={ordem.progresso}
                                    className="h-2 w-32"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Botão de Editar - para OS que não iniciaram */}
                          {(ordem.status === "aguardando_informacoes" ||
                            ordem.status === "pendente") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Preencher o formulário com os dados da OS
                                const ordemParaEditar = ordensServicos.find(
                                  (o) => o.id === ordem.id
                                );
                                if (ordemParaEditar) {
                                  setOrdemEditando(ordemParaEditar);

                                  // Preencher campos básicos
                                  setNovaOrdem({
                                    numeroOS: ordemParaEditar.numeroOS,
                                    centroCustoId:
                                      ordemParaEditar.centroCustoId,
                                    operacaoId: ordemParaEditar.operacaoId,
                                    dataGeracao: ordemParaEditar.dataGeracao,
                                    observacoes: ordemParaEditar.observacoes,
                                    responsavelId:
                                      ordemParaEditar.responsavelId,
                                    fazendaId: ordemParaEditar.fazendaId,
                                    secao: ordemParaEditar.secao,
                                    talhoesSelecionados:
                                      ordemParaEditar.talhoes,
                                    insumosSelecionados:
                                      ordemParaEditar.insumos,
                                    caldaHA: ordemParaEditar.caldaHA || "",
                                  });

                                  // Preencher talhões selecionados
                                  const talhoesSet = new Set<string>();
                                  ordemParaEditar.talhoes.forEach((t) => {
                                    talhoesSet.add(
                                      `${t.fazendaId}-${t.talhaoId}`
                                    );
                                  });
                                  setTalhoesSelecionados(talhoesSet);

                                  // Preencher insumos selecionados
                                  const insumosMap = new Map<
                                    number,
                                    { idItem: number; doseHA: number }
                                  >();
                                  ordemParaEditar.insumos.forEach((i) => {
                                    insumosMap.set(i.idEstoque, {
                                      idItem: i.idItem,
                                      doseHA: i.doseHA,
                                    });
                                  });
                                  setInsumosSelecionados(insumosMap);

                                  setDialogOpen(true);
                                }
                              }}
                              title="Editar Ordem"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {/* Botão de Play - apenas para OS pendente (totalmente preenchida, não aguardando informações) */}
                          {ordem.status === "pendente" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleParametrizarOrdem(ordem.id)}
                              title="Parametrizar Calda"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {(ordem.status === "em_preparo" ||
                            ordem.status === "nao_totalizada") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleParametrizarOrdem(ordem.id)}
                              title="Parametrizar Parcela"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detalhes Expandidos */}
                    {isExpanded && (
                      <div className="p-4">
                        <div>
                          <Label className="text-muted-foreground">
                            Período de execução da Calda:
                          </Label>
                          <div className="flex items-center gap-2 mt-1 flex-nowrap">
                            {!ordem.iniciado ? (
                              <span className="text-sm font-medium text-muted-foreground italic whitespace-nowrap">
                                Não iniciada.
                              </span>
                            ) : (
                              <div className="flex items-center gap-2 flex-nowrap">
                                <span className="text-sm font-medium whitespace-nowrap">
                                  Iniciada em:{" "}
                                  {formatarDataHora(ordem.iniciado)}
                                </span>
                                {!ordem.previsaoTermino && (
                                  <>
                                    <span className="text-muted-foreground">
                                      •
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground italic whitespace-nowrap">
                                      Não finalizada
                                    </span>
                                  </>
                                )}
                                {ordem.previsaoTermino && (
                                  <>
                                    <span className="text-muted-foreground">
                                      •
                                    </span>
                                    <span className="text-sm font-medium whitespace-nowrap">
                                      Finalizada em:{" "}
                                      {formatarDataHora(ordem.previsaoTermino)}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Talhões - Expansível */}
                        {ordem.talhoes.length > 0 &&
                          (() => {
                            const isTalhoesExpanded = expandedTalhoes.has(
                              ordem.id
                            );
                            const areaTotalTalhoes = ordem.talhoes.reduce(
                              (sum, talhao) => {
                                const fazenda = fazendas.find(
                                  (f) => f.id === talhao.fazendaId
                                );
                                const talhaoObj = fazenda?.talhoes.find(
                                  (t) => t.id === talhao.talhaoId
                                );
                                return sum + (Number(talhaoObj?.area) || 0);
                              },
                              0
                            );

                            // Obter a primeira fazenda dos talhões para exibir no título
                            const primeiraFazendaId =
                              ordem.talhoes[0]?.fazendaId;
                            const primeiraFazenda = fazendas.find(
                              (f) => f.id === primeiraFazendaId
                            );
                            const codigoExterno =
                              primeiraFazenda?.codigoExterno || "";
                            const nomeFazenda =
                              primeiraFazenda?.descricao || "";

                            return (
                              <div className="mt-4 border rounded-lg">
                                <div
                                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => {
                                    const novos = new Set(expandedTalhoes);
                                    if (novos.has(ordem.id)) {
                                      novos.delete(ordem.id);
                                    } else {
                                      novos.add(ordem.id);
                                    }
                                    setExpandedTalhoes(novos);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    {isTalhoesExpanded ? (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <Label className="text-muted-foreground cursor-pointer">
                                      {codigoExterno
                                        ? `${codigoExterno} - ${nomeFazenda}: Talhões (${ordem.talhoes.length})`
                                        : nomeFazenda
                                        ? `${nomeFazenda}: Talhões (${ordem.talhoes.length})`
                                        : `Talhões (${ordem.talhoes.length})`}
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">
                                      Área Total: {areaTotalTalhoes.toFixed(2)}{" "}
                                      ha
                                    </span>
                                  </div>
                                </div>
                                {isTalhoesExpanded && (
                                  <div className="border-t p-3 space-y-2">
                                    {ordem.talhoes.map((talhao, index) => {
                                      const fazenda = fazendas.find(
                                        (f) => f.id === talhao.fazendaId
                                      );
                                      const talhaoObj = fazenda?.talhoes.find(
                                        (t) => t.id === talhao.talhaoId
                                      );
                                      return (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                                        >
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <p className="text-sm font-medium">
                                                {talhaoObj?.observacoes ||
                                                  `Talhão ${talhao.talhaoId}`}
                                              </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                              {talhaoObj?.tipo || "Talhão"} •
                                              Área: {talhaoObj?.area || "-"} ha
                                            </p>
                                          </div>
                                          <div className="text-right ml-4">
                                            <p className="text-sm font-medium">
                                              {talhaoObj?.area || "-"} ha
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                        {/* Insumos - Expansível */}
                        {ordem.insumos.length > 0 &&
                          (() => {
                            const isInsumosExpanded = expandedInsumos.has(
                              ordem.id
                            );
                            const areaTotal = ordem.talhoes.reduce(
                              (sum, talhao) => {
                                const fazenda = fazendas.find(
                                  (f) => f.id === talhao.fazendaId
                                );
                                const talhaoObj = fazenda?.talhoes.find(
                                  (t) => t.id === talhao.talhaoId
                                );
                                return sum + (Number(talhaoObj?.area) || 0);
                              },
                              0
                            );
                            const totalInsumos = ordem.insumos.reduce(
                              (sum, insumo) => {
                                return sum + areaTotal * insumo.doseHA;
                              },
                              0
                            );

                            return (
                              <div className="mt-4 border rounded-lg">
                                <div
                                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => {
                                    const novos = new Set(expandedInsumos);
                                    if (novos.has(ordem.id)) {
                                      novos.delete(ordem.id);
                                    } else {
                                      novos.add(ordem.id);
                                    }
                                    setExpandedInsumos(novos);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    {isInsumosExpanded ? (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <Label className="text-muted-foreground cursor-pointer">
                                      Insumos ({ordem.insumos.length})
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">
                                      Total: {totalInsumos.toFixed(2)} L
                                    </span>
                                  </div>
                                </div>
                                {isInsumosExpanded && (
                                  <div className="border-t p-3 space-y-2">
                                    {ordem.insumos.map((insumo, index) => {
                                      const material =
                                        materiaisAgricolas[insumo.idItem];
                                      const categoria = material?.categoriaId
                                        ? categorias[material.categoriaId]
                                        : null;
                                      const insumoEstoque = insumos.find(
                                        (i) => i.idEstoque === insumo.idEstoque
                                      );
                                      return (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                                        >
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <p className="text-sm font-medium">
                                                {material?.nomeComercial ||
                                                  `Item ${insumo.idItem}`}
                                              </p>
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {material?.codigo ||
                                                  insumo.idItem}
                                              </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                              {categoria?.descricaoResumida ||
                                                "Descrição não disponível"}
                                              {insumoEstoque?.nLote &&
                                                ` • Lote: ${insumoEstoque.nLote}`}
                                            </p>
                                          </div>
                                          <div className="text-right ml-4">
                                            <p className="text-sm font-medium">
                                              {(() => {
                                                // Calcular quantidade total do insumo
                                                const quantidadeTotal =
                                                  areaTotal * insumo.doseHA;
                                                return quantidadeTotal.toFixed(
                                                  2
                                                );
                                              })()}{" "}
                                              {insumoEstoque?.unidade || ""}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              Dose/Ha: {insumo.doseHA}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                        {/* Parcelas - Expansível */}
                        {(() => {
                          const parcelasDaOS = parcelasCalda.filter(
                            (p) => p.ordemServicoId === ordem.id
                          );

                          if (parcelasDaOS.length === 0) return null;

                          const isParcelasExpanded = expandedParcelas.has(
                            ordem.id
                          );
                          const progressoTotalParcelas = parcelasDaOS.reduce(
                            (sum, p) => sum + p.progressoOS,
                            0
                          );

                          const getStatusParcelaLabel = (
                            status:
                              | "na_maquina"
                              | "em_producao"
                              | "processada"
                              | "pausado"
                              | "bloqueado"
                              | "cancelado"
                          ) => {
                            switch (status) {
                              case "na_maquina":
                                return "Na máquina";
                              case "em_producao":
                                return "Em Produção";
                              case "processada":
                                return "Processada";
                              case "pausado":
                                return "Pausado";
                              case "bloqueado":
                                return "Bloqueado";
                              case "cancelado":
                                return "Cancelado";
                              default:
                                return status;
                            }
                          };

                          const getStatusParcelaBadge = (
                            status:
                              | "na_maquina"
                              | "em_producao"
                              | "processada"
                              | "pausado"
                              | "bloqueado"
                              | "cancelado"
                          ) => {
                            switch (status) {
                              case "na_maquina":
                                return (
                                  <Badge
                                    variant="default"
                                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white"
                                  >
                                    Na máquina
                                  </Badge>
                                );
                              case "em_producao":
                                return (
                                  <Badge
                                    variant="default"
                                    className="text-xs bg-primary hover:bg-primary/90 text-white"
                                  >
                                    Em Produção
                                  </Badge>
                                );
                              case "processada":
                                return (
                                  <Badge
                                    variant="default"
                                    className="text-xs bg-green-500 hover:bg-green-600 text-white"
                                  >
                                    Processada
                                  </Badge>
                                );
                              case "pausado":
                                return (
                                  <Badge
                                    variant="default"
                                    className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white"
                                  >
                                    Pausado
                                  </Badge>
                                );
                              case "bloqueado":
                                return (
                                  <Badge
                                    variant="default"
                                    className="text-xs bg-orange-500 hover:bg-orange-600 text-white"
                                  >
                                    Bloqueado
                                  </Badge>
                                );
                              case "cancelado":
                                return (
                                  <Badge
                                    variant="default"
                                    className="text-xs bg-red-500 hover:bg-red-600 text-white"
                                  >
                                    Cancelado
                                  </Badge>
                                );
                              default:
                                return null;
                            }
                          };

                          return (
                            <div className="mt-4 border rounded-lg">
                              <div
                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => {
                                  const novos = new Set(expandedParcelas);
                                  if (novos.has(ordem.id)) {
                                    novos.delete(ordem.id);
                                  } else {
                                    novos.add(ordem.id);
                                  }
                                  setExpandedParcelas(novos);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  {isParcelasExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <Label className="text-muted-foreground cursor-pointer">
                                    Parcelas ({parcelasDaOS.length})
                                  </Label>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-muted-foreground">
                                    Progresso:{" "}
                                    {progressoTotalParcelas.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                              {isParcelasExpanded && (
                                <div className="border-t p-3 space-y-2">
                                  {parcelasDaOS.map((parcela, index) => {
                                    const caminhao = caminhoes.find(
                                      (c) => c.id === parcela.caminhaoId
                                    );
                                    const totalInsumosParcela =
                                      parcela.insumosMovimentados.reduce(
                                        (sum, insumo) =>
                                          sum + insumo.quantidade,
                                        0
                                      );

                                    return (
                                      <div
                                        key={parcela.id}
                                        className="flex flex-col gap-3 p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              Parcela {index + 1}
                                            </Badge>
                                            {getStatusParcelaBadge(
                                              parcela.status
                                            )}
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                              {parcela.proporcaoCalda.toFixed(
                                                2
                                              )}
                                              % da calda
                                            </span>
                                            {/* Botões de ação - apenas para parcelas em produção */}
                                            {parcela.status ===
                                              "em_producao" && (
                                              <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() =>
                                                  handleAbrirSupervisorio(
                                                    parcela.id
                                                  )
                                                }
                                                title="Abrir Supervisório"
                                                className="bg-primary hover:bg-primary/90"
                                              >
                                                <Activity className="h-4 w-4" />
                                              </Button>
                                            )}
                                            {/* Botão Cancelar - apenas para parcelas na máquina */}
                                            {parcela.status ===
                                              "na_maquina" && (
                                              <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                  handleCancelarParcela(
                                                    parcela.id
                                                  )
                                                }
                                                title="Cancelar Parcela"
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            )}
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                          <div>
                                            <Label className="text-xs text-muted-foreground">
                                              Caminhão
                                            </Label>
                                            <p className="text-sm font-medium">
                                              {caminhao
                                                ? `${caminhao.placa} - ${caminhao.modelo}`
                                                : "Caminhão não encontrado"}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-xs text-muted-foreground">
                                              Capacidade
                                            </Label>
                                            <p className="text-sm font-medium">
                                              {parcela.capacidadeCaminhao.toFixed(
                                                2
                                              )}{" "}
                                              L
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-xs text-muted-foreground">
                                              Insumos Movimentados
                                            </Label>
                                            <p className="text-sm font-medium">
                                              {totalInsumosParcela.toFixed(2)} L
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-xs text-muted-foreground">
                                              Progresso na OS
                                            </Label>
                                            <p className="text-sm font-medium">
                                              {parcela.progressoOS.toFixed(2)}%
                                            </p>
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground border-t pt-2">
                                          <div>
                                            <Label className="text-xs">
                                              Criada em:
                                            </Label>
                                            <p>
                                              {new Date(
                                                parcela.dataCriacao
                                              ).toLocaleString("pt-BR")}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-xs">
                                              Iniciada em:
                                            </Label>
                                            <p>
                                              {parcela.dataInicio
                                                ? new Date(
                                                    parcela.dataInicio
                                                  ).toLocaleString("pt-BR")
                                                : "Ainda não iniciada"}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-xs">
                                              Finalizada em:
                                            </Label>
                                            <p>
                                              {parcela.dataFinalizacao
                                                ? new Date(
                                                    parcela.dataFinalizacao
                                                  ).toLocaleString("pt-BR")
                                                : "Ainda não finalizada"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Cálculos e Gráfico */}
                        {(() => {
                          // Calcular área total dos talhões
                          const areaTotal = ordem.talhoes.reduce(
                            (sum, talhao) => {
                              const fazenda = fazendas.find(
                                (f) => f.id === talhao.fazendaId
                              );
                              const talhaoObj = fazenda?.talhoes.find(
                                (t) => t.id === talhao.talhaoId
                              );
                              return sum + (Number(talhaoObj?.area) || 0);
                            },
                            0
                          );

                          // Calcular total de insumos (área * dose/ha de cada insumo)
                          const totalInsumos = ordem.insumos.reduce(
                            (sum, insumo) => {
                              return sum + areaTotal * insumo.doseHA;
                            },
                            0
                          );

                          // Calcular total de calda (Calda/Ha * área total)
                          const caldaHA = Number(ordem.caldaHA) || 0;
                          const totalCalda = caldaHA * areaTotal;

                          // Calcular total de água (Total de Calda - Total de Insumos)
                          const totalAgua = totalCalda - totalInsumos;

                          return (
                            <div className="mt-4 space-y-4">
                              {/* Cards de Cálculos */}
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                      Calda/Ha
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-2xl font-bold">
                                      {ordem.caldaHA || "0.00"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Litros por hectare
                                    </p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                      Total de Insumos
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-2xl font-bold">
                                      {totalInsumos.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Área × Dose/Ha de cada insumo
                                    </p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                      Total de Calda
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-2xl font-bold">
                                      {totalCalda.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Calda/Ha × Área total
                                    </p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">
                                      Total de Água
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-2xl font-bold">
                                      {totalAgua.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Total de Calda - Total de Insumos
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Gráfico de Composição da Calda */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-base">
                                    Composição da Calda
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  {/* Barra Horizontal */}
                                  <div className="w-full">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium">
                                        Total de Calda: {totalCalda.toFixed(2)}{" "}
                                        L
                                      </span>
                                    </div>
                                    <div className="w-full h-12 bg-muted rounded-lg overflow-hidden flex">
                                      {/* Porcentagem de Insumos */}
                                      {totalCalda > 0 && (
                                        <div
                                          className="bg-blue-500 flex items-center justify-center text-white text-sm font-medium transition-all"
                                          style={{
                                            width: `${
                                              (totalInsumos / totalCalda) * 100
                                            }%`,
                                            minWidth:
                                              (totalInsumos / totalCalda) *
                                                100 >
                                              5
                                                ? "auto"
                                                : "0%",
                                          }}
                                        >
                                          {(totalInsumos / totalCalda) * 100 >
                                            5 && (
                                            <span>
                                              {(
                                                (totalInsumos / totalCalda) *
                                                100
                                              ).toFixed(1)}
                                              %
                                            </span>
                                          )}
                                        </div>
                                      )}
                                      {/* Porcentagem de Água */}
                                      {totalCalda > 0 && (
                                        <div
                                          className="bg-orange-500 flex items-center justify-center text-white text-sm font-medium transition-all"
                                          style={{
                                            width: `${
                                              (totalAgua / totalCalda) * 100
                                            }%`,
                                            minWidth:
                                              (totalAgua / totalCalda) * 100 > 5
                                                ? "auto"
                                                : "0%",
                                          }}
                                        >
                                          {(totalAgua / totalCalda) * 100 >
                                            5 && (
                                            <span>
                                              {(
                                                (totalAgua / totalCalda) *
                                                100
                                              ).toFixed(1)}
                                              %
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Legenda */}
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                      <span className="text-sm">
                                        Insumos: {totalInsumos.toFixed(2)} L (
                                        {totalCalda > 0
                                          ? (
                                              (totalInsumos / totalCalda) *
                                              100
                                            ).toFixed(1)
                                          : "0"}
                                        %)
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                      <span className="text-sm">
                                        Água: {totalAgua.toFixed(2)} L (
                                        {totalCalda > 0
                                          ? (
                                              (totalAgua / totalCalda) *
                                              100
                                            ).toFixed(1)
                                          : "0"}
                                        %)
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          );
                        })()}

                        {/* Observações */}
                        {ordem.observacoes && (
                          <div className="mt-4">
                            <Label className="text-muted-foreground mb-2 block">
                              Observações
                            </Label>
                            <p className="text-sm bg-muted/50 p-3 rounded-lg">
                              {ordem.observacoes}
                            </p>
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

      {/* Modal de Parametrização da OS */}
      <Dialog
        open={dialogParametrizacaoOpen}
        onOpenChange={(open) => {
          setDialogParametrizacaoOpen(open);
          if (!open) {
            setOrdemParametrizando(null);
            setParcelaEditando(null);
            setCaminhaoSelecionado("");
            setCapacidadeEditada("");
            setProporcaoCalda(0);
            setInsumosMovimentacao(new Map());
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Parametrização da OS</DialogTitle>
            <DialogDescription>
              Configure o caminhão e movimente os insumos necessários
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {ordemParametrizando && (
              <>
                {/* Informações da OS */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">
                        Número da OS
                      </Label>
                      <p className="font-medium">
                        {ordemParametrizando.numeroOS}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Calda/Ha</Label>
                      <p className="font-medium">
                        {ordemParametrizando.caldaHA} L
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Área Total
                      </Label>
                      <p className="font-medium">
                        {(() => {
                          // Calcular área total dos talhões
                          const areaTotal = ordemParametrizando.talhoes.reduce(
                            (sum, talhao) => {
                              const fazenda = fazendas.find(
                                (f) => f.id === talhao.fazendaId
                              );
                              const talhaoObj = fazenda?.talhoes.find(
                                (t) => t.id === talhao.talhaoId
                              );
                              return sum + (Number(talhaoObj?.area) || 0);
                            },
                            0
                          );
                          return areaTotal.toFixed(2);
                        })()}{" "}
                        ha
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Total da Calda
                      </Label>
                      <p className="font-medium">
                        {(() => {
                          // Calcular área total dos talhões
                          const areaTotal = ordemParametrizando.talhoes.reduce(
                            (sum, talhao) => {
                              const fazenda = fazendas.find(
                                (f) => f.id === talhao.fazendaId
                              );
                              const talhaoObj = fazenda?.talhoes.find(
                                (t) => t.id === talhao.talhaoId
                              );
                              return sum + (Number(talhaoObj?.area) || 0);
                            },
                            0
                          );
                          // Calcular total de calda (Calda/Ha × área total)
                          const caldaHA =
                            Number(ordemParametrizando.caldaHA) || 0;
                          const totalCalda = caldaHA * areaTotal;
                          return totalCalda.toFixed(2);
                        })()}{" "}
                        L
                      </p>
                    </div>
                  </div>
                </div>

                {/* Parcelas Pendentes */}
                {(() => {
                  const parcelasNaMaquina = parcelasCalda.filter(
                    (p) =>
                      p.ordemServicoId === ordemParametrizando.id &&
                      p.status === "na_maquina"
                  );

                  if (parcelasNaMaquina.length === 0 && !parcelaEditando) {
                    return null;
                  }

                  return (
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        Parcelas na Máquina
                      </Label>
                      <div className="border rounded-lg p-3 space-y-2">
                        {parcelasNaMaquina.map((parcela) => {
                          const caminhao = caminhoes.find(
                            (c) => c.id === parcela.caminhaoId
                          );
                          const totalInsumosParcela =
                            parcela.insumosMovimentados.reduce(
                              (sum, insumo) => sum + insumo.quantidade,
                              0
                            );

                          return (
                            <div
                              key={parcela.id}
                              className="flex items-center justify-between p-3 border rounded-lg bg-background"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {parcela.proporcaoCalda.toFixed(2)}% da
                                    calda
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Pendente
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">
                                      Caminhão:{" "}
                                    </span>
                                    <span className="font-medium">
                                      {caminhao?.placa || "Não encontrado"} -{" "}
                                      {caminhao?.modelo || "-"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Capacidade:{" "}
                                    </span>
                                    <span className="font-medium">
                                      {parcela.capacidadeCaminhao.toFixed(2)} L
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Insumos:{" "}
                                    </span>
                                    <span className="font-medium">
                                      {totalInsumosParcela.toFixed(2)} L
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Criada em:{" "}
                                    </span>
                                    <span className="font-medium">
                                      {new Date(
                                        parcela.dataCriacao
                                      ).toLocaleString("pt-BR")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditarParcela(parcela)}
                                  disabled={!!parcelaEditando}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() =>
                                    handleEnviarParcelaAoSupervisorio(
                                      parcela.id
                                    )
                                  }
                                  disabled={!!parcelaEditando}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Enviar ao Supervisório
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Formulário de Edição/Criação de Parcela */}
                {parcelaEditando && (
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-semibold">
                        Editando Parcela (
                        {parcelaEditando.proporcaoCalda.toFixed(2)}% da calda)
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelarEdicaoParcela}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Seleção de Smart Calda - Mostra se OS não está finalizada */}
                {ordemParametrizando.status !== "finalizada" && (
                  <div className="space-y-2">
                    <Label>
                      {parcelaEditando ? "Editar Smart Calda" : "Smart Calda"} *
                    </Label>
                    <Select
                      value={smartCaldaSelecionada}
                      onValueChange={setSmartCaldaSelecionada}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a Smart Calda" />
                      </SelectTrigger>
                      <SelectContent>
                        {smartCaldas
                          .filter((sc) => sc.status === "online")
                          .map((sc) => (
                            <SelectItem key={sc.id} value={sc.id.toString()}>
                              {sc.nome} - {sc.numeroSerie}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Seleção de Caminhão - Mostra se OS não está finalizada */}
                {ordemParametrizando.status !== "finalizada" && (
                  <div className="space-y-2">
                    <Label>
                      {parcelaEditando ? "Editar Caminhão" : "Caminhão"} *
                    </Label>
                    <Select
                      value={caminhaoSelecionado}
                      onValueChange={(value) => {
                        setCaminhaoSelecionado(value);
                        const caminhao = caminhoes.find((c) => c.id === value);
                        if (caminhao) {
                          setCapacidadeEditada(caminhao.volume);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o caminhão" />
                      </SelectTrigger>
                      <SelectContent>
                        {caminhoes
                          .filter((c) => c.status === "Ativo")
                          .map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.placa} - {c.modelo} ({c.volume}L)
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Capacidade Editável - Mostra se há caminhão selecionado e OS não está finalizada */}
                {ordemParametrizando.status !== "finalizada" &&
                  caminhaoSelecionado && (
                    <div className="space-y-2">
                      <Label>Capacidade do Caminhão (L) *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={capacidadeEditada}
                          onChange={(e) => {
                            const valor = e.target.value;
                            const caminhao = caminhoes.find(
                              (c) => c.id === caminhaoSelecionado
                            );
                            if (caminhao) {
                              const capacidadeOriginal =
                                Number(caminhao.volume) || 0;
                              const valorNum = Number(valor) || 0;
                              if (valorNum > capacidadeOriginal) {
                                toast.error(
                                  `A capacidade não pode ser maior que ${capacidadeOriginal}L (capacidade original do caminhão)`
                                );
                                return;
                              }
                            }
                            setCapacidadeEditada(valor);
                          }}
                          placeholder="Capacidade"
                          min={0}
                          step="0.01"
                        />
                        <span className="text-sm text-muted-foreground">
                          Capacidade original:{" "}
                          {
                            caminhoes.find((c) => c.id === caminhaoSelecionado)
                              ?.volume
                          }
                          L
                        </span>
                      </div>
                    </div>
                  )}

                {/* Proporção de Calda Calculada */}
                {proporcaoCalda > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">
                          Proporção de Calda
                        </Label>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {proporcaoCalda.toFixed(2)}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Essa parcela representa {proporcaoCalda.toFixed(2)}%
                          do total da calda
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lista de Insumos com Quantidades */}
                {insumosMovimentacao.size > 0 && (
                  <div className="space-y-2">
                    <Label>Insumos para Movimentação</Label>
                    <div className="border rounded-lg p-3 space-y-3">
                      {(() => {
                        // Agrupar insumos por categoriaId (grupo)
                        const insumosPorGrupo = new Map<
                          number,
                          Array<{
                            idEstoque: number;
                            dados: {
                              idItem: number;
                              quantidade: number;
                              origem: "PRIMÁRIO" | "FRACIONÁRIO";
                            };
                            material: {
                              codigo: string;
                              descricao: string;
                              nomeComercial: string;
                              categoriaId?: number;
                              capacidadeEmbalagem?: number;
                            };
                            insumoEstoque: {
                              idEstoque: number;
                              idItem: number;
                              nLote: string;
                              unidade: string;
                              saldoDispon: number;
                              tipoEstoque: string;
                            };
                          }>
                        >();

                        // Agrupar insumos
                        Array.from(insumosMovimentacao.entries()).forEach(
                          ([idEstoque, dados]) => {
                            const material = materiaisAgricolas[dados.idItem];
                            const insumoEstoque = insumos.find(
                              (i) => i.idEstoque === idEstoque
                            );
                            if (!material || !insumoEstoque) return;

                            const categoriaId = material.categoriaId || 0;
                            if (!insumosPorGrupo.has(categoriaId)) {
                              insumosPorGrupo.set(categoriaId, []);
                            }
                            insumosPorGrupo.get(categoriaId)?.push({
                              idEstoque,
                              dados,
                              material,
                              insumoEstoque,
                            });
                          }
                        );

                        // Renderizar grupos
                        return Array.from(insumosPorGrupo.entries()).map(
                          ([categoriaId, produtos]) => {
                            const categoria = categorias[categoriaId];
                            const codigoGrupo = categoria?.codigo || "N/A";
                            const descricaoGrupo =
                              categoria?.descricaoResumida || "Sem descrição";

                            return (
                              <div
                                key={categoriaId}
                                className="space-y-2 p-3 border rounded-lg bg-background"
                              >
                                {/* Título do Grupo */}
                                <div className="mb-3 pb-2 border-b">
                                  <p className="text-sm font-semibold">
                                    {codigoGrupo} - {descricaoGrupo}
                                  </p>
                                </div>

                                {/* Lista de Produtos do Grupo */}
                                <div className="space-y-2">
                                  {produtos.map(
                                    ({
                                      idEstoque,
                                      dados,
                                      material,
                                      insumoEstoque,
                                    }) => {
                                      const origemAtual =
                                        insumosMovimentacao.get(
                                          idEstoque
                                        )?.origem;
                                      const capacidadeEmbalagem =
                                        material.capacidadeEmbalagem || 0;
                                      const unidade = insumoEstoque.unidade;

                                      // Calcular movimentações detalhadas
                                      const movimentacoes =
                                        calcularMovimentacoesDetalhadas(
                                          dados.quantidade,
                                          capacidadeEmbalagem,
                                          origemAtual || "PRIMÁRIO",
                                          unidade
                                        );

                                      return (
                                        <div
                                          key={idEstoque}
                                          className="space-y-1 pl-2 border-l-2 border-muted"
                                        >
                                          {/* Cabeçalho do Produto */}
                                          <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                              <p className="text-sm font-medium">
                                                {material.codigo} -{" "}
                                                {material.nomeComercial}
                                              </p>
                                            </div>
                                            <div className="text-right">
                                              <p className="text-sm font-medium">
                                                {dados.quantidade.toFixed(2)}{" "}
                                                {unidade}
                                              </p>
                                              <p className="text-xs text-muted-foreground">
                                                Necessário para esta parcela
                                              </p>
                                            </div>
                                          </div>

                                          {/* Lista de movimentações detalhadas */}
                                          <div className="space-y-1">
                                            {movimentacoes.map((mov, index) => (
                                              <p
                                                key={index}
                                                className="text-xs text-muted-foreground"
                                              >
                                                {material.codigo} -{" "}
                                                {material.nomeComercial} •
                                                Origem: {mov.origem} → Destino:{" "}
                                                {mov.destino} (
                                                {mov.quantidade.toFixed(2)}{" "}
                                                {mov.unidade})
                                              </p>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            );
                          }
                        );
                      })()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      * A movimentação será registrada automaticamente ao salvar
                      ou enviar ao supervisorio
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDialogParametrizacaoOpen(false);
                setOrdemParametrizando(null);
                setParcelaEditando(null);
                setCaminhaoSelecionado("");
                setCapacidadeEditada("");
                setProporcaoCalda(0);
                setInsumosMovimentacao(new Map());
              }}
            >
              Cancelar
            </Button>
            {parcelaEditando ? (
              <>
                <Button variant="outline" onClick={handleCancelarEdicaoParcela}>
                  Cancelar Edição
                </Button>
                <Button onClick={handleSalvarAlteracoesParcela}>
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={handleSalvarContinuarDepois}
                  disabled={
                    !smartCaldaSelecionada ||
                    !caminhaoSelecionado ||
                    !capacidadeEditada
                  }
                >
                  Salvar e continuar depois
                </Button>
                <Button
                  onClick={handleEnviarAoSupervisorio}
                  disabled={
                    !smartCaldaSelecionada ||
                    !caminhaoSelecionado ||
                    !capacidadeEditada
                  }
                >
                  Enviar ao Supervisório
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdensServicos;
