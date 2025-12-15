import { useState, useMemo } from "react";
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
  Plus,
  Search,
  FileText,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Download,
  ChevronDown,
  ChevronRight,
  X,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
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

interface CaminhaoSelecionado {
  caminhaoId: string;
  ordem: number;
}

interface BulkSelecionado {
  bulkId: string;
  ordem: number;
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
  status: "aguardando" | "em_producao" | "pausada" | "concluida" | "cancelada";
  progresso: number;
  iniciado?: string | null;
  previsaoTermino?: string | null;
}

const OrdensServicos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedOrdens, setExpandedOrdens] = useState<Set<string>>(new Set());
  const [dialogIniciarOpen, setDialogIniciarOpen] = useState(false);
  const [ordemIniciando, setOrdemIniciando] = useState<string | null>(null);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [caminhoesSelecionados, setCaminhoesSelecionados] = useState<
    CaminhaoSelecionado[]
  >([]);
  const [bulksSelecionados, setBulksSelecionados] = useState<BulkSelecionado[]>(
    []
  );
  const [buscaCaminhoes, setBuscaCaminhoes] = useState("");
  const [buscaBulks, setBuscaBulks] = useState("");

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
  };

  // Mapeamento de categorias (baseado em InsumosAgricolas.tsx)
  const categorias: {
    [key: number]: { codigo: string; descricaoResumida: string };
  } = {
    69: {
      codigo: "69",
      descricaoResumida: "Herbicida 2,4 D-DIMETILAM 806 G/L",
    },
    617: {
      codigo: "617",
      descricaoResumida: "Fertilizante (Adubo)",
    },
    3001: {
      codigo: "3001",
      descricaoResumida: "Herbicida Tebuthiuron 500 G/L",
    },
    5027: {
      codigo: "5027",
      descricaoResumida: "Formicida Isca Sulfluramida",
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
  const [buscaTalhoes, setBuscaTalhoes] = useState("");
  const [buscaInsumos, setBuscaInsumos] = useState("");
  const [filtroTipoEstoqueInsumos, setFiltroTipoEstoqueInsumos] = useState<
    "TODOS" | "TÉCNICO" | "FRACIONÁRIO"
  >("TODOS");

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
      status: "em_producao",
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
      observacoes: "Aguardando liberação de matéria-prima",
      responsavelId: "2",
      fazendaId: "2",
      secao: "Seção B",
      talhoes: [{ fazendaId: "2", talhaoId: "4" }],
      insumos: [],
      caldaHA: "3.0",
      status: "aguardando",
      progresso: 0,
      iniciado: null,
      previsaoTermino: "2024-01-21 12:00",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aguardando":
        return "outline";
      case "em_producao":
        return "default";
      case "pausada":
        return "secondary";
      case "concluida":
        return "default";
      case "cancelada":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aguardando":
        return "Aguardando";
      case "em_producao":
        return "Em Serviços";
      case "pausada":
        return "Pausada";
      case "concluida":
        return "Concluída";
      case "cancelada":
        return "Cancelada";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aguardando":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case "em_producao":
        return <Play className="h-4 w-4 text-primary" />;
      case "pausada":
        return <Pause className="h-4 w-4 text-warning" />;
      case "concluida":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "cancelada":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredOrdens = ordensServicos.filter((ordem) => {
    const matchesSearch =
      ordem.numeroOS.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || ordem.status === statusFilter;
    return matchesSearch && matchesStatus;
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
      status: "aguardando",
      progresso: 0,
      iniciado: null,
      previsaoTermino: null,
    };

    setOrdensServicos([...ordensServicos, novaOS]);
    toast.success("Ordem de serviços criada com sucesso!");
    setDialogOpen(false);
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
    setBuscaTalhoes("");
    setBuscaInsumos("");
    setFiltroTipoEstoqueInsumos("TODOS");
  };

  const handleIniciarOrdem = (id: string) => {
    setOrdemIniciando(id);
    setCaminhoesSelecionados([]);
    setBulksSelecionados([]);
    setBuscaCaminhoes("");
    setBuscaBulks("");
    setEtapaAtual(1);
    setDialogIniciarOpen(true);
  };

  const handleProximaEtapa = () => {
    if (etapaAtual === 1) {
      if (bulksSelecionados.length === 0) {
        toast.error("Selecione pelo menos um BULK");
        return;
      }
      setEtapaAtual(2);
    } else if (etapaAtual === 2) {
      if (caminhoesSelecionados.length === 0) {
        toast.error("Selecione pelo menos um caminhão");
        return;
      }
      setEtapaAtual(3);
    }
  };

  const handleEtapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const handleFecharModal = () => {
    setDialogIniciarOpen(false);
    setOrdemIniciando(null);
    setEtapaAtual(1);
    setCaminhoesSelecionados([]);
    setBulksSelecionados([]);
    setBuscaCaminhoes("");
    setBuscaBulks("");
  };

  const handleConfirmarIniciar = () => {
    if (caminhoesSelecionados.length === 0) {
      toast.error("Selecione pelo menos um caminhão");
      return;
    }
    if (bulksSelecionados.length === 0) {
      toast.error("Selecione pelo menos um BULK");
      return;
    }

    // Aqui você pode salvar os parâmetros de iniciação
    toast.success(
      `Ordem ${ordemIniciando} iniciada com ${caminhoesSelecionados.length} caminhão(ões) e ${bulksSelecionados.length} BULK(s)!`
    );
    setDialogIniciarOpen(false);
    setOrdemIniciando(null);
  };

  const handleToggleCaminhao = (caminhaoId: string) => {
    const index = caminhoesSelecionados.findIndex(
      (c) => c.caminhaoId === caminhaoId
    );
    if (index >= 0) {
      // Remove o caminhão e reordena
      const novos = caminhoesSelecionados
        .filter((c) => c.caminhaoId !== caminhaoId)
        .map((c, i) => ({ ...c, ordem: i + 1 }));
      setCaminhoesSelecionados(novos);
    } else {
      // Adiciona o caminhão
      const novaOrdem = caminhoesSelecionados.length + 1;
      setCaminhoesSelecionados([
        ...caminhoesSelecionados,
        { caminhaoId, ordem: novaOrdem },
      ]);
    }
  };

  const handleMoverCaminhao = (index: number, direcao: "up" | "down") => {
    const novos = [...caminhoesSelecionados];
    if (direcao === "up" && index > 0) {
      [novos[index - 1], novos[index]] = [novos[index], novos[index - 1]];
      novos.forEach((c, i) => (c.ordem = i + 1));
      setCaminhoesSelecionados(novos);
    } else if (direcao === "down" && index < novos.length - 1) {
      [novos[index], novos[index + 1]] = [novos[index + 1], novos[index]];
      novos.forEach((c, i) => (c.ordem = i + 1));
      setCaminhoesSelecionados(novos);
    }
  };

  const handleToggleBulk = (bulkId: string) => {
    const index = bulksSelecionados.findIndex((b) => b.bulkId === bulkId);
    if (index >= 0) {
      // Remove o bulk e reordena
      const novos = bulksSelecionados
        .filter((b) => b.bulkId !== bulkId)
        .map((b, i) => ({ ...b, ordem: i + 1 }));
      setBulksSelecionados(novos);
    } else {
      // Adiciona o bulk
      const novaOrdem = bulksSelecionados.length + 1;
      setBulksSelecionados([
        ...bulksSelecionados,
        { bulkId, ordem: novaOrdem },
      ]);
    }
  };

  const handleMoverBulk = (index: number, direcao: "up" | "down") => {
    const novos = [...bulksSelecionados];
    if (direcao === "up" && index > 0) {
      [novos[index - 1], novos[index]] = [novos[index], novos[index - 1]];
      novos.forEach((b, i) => (b.ordem = i + 1));
      setBulksSelecionados(novos);
    } else if (direcao === "down" && index < novos.length - 1) {
      [novos[index], novos[index + 1]] = [novos[index + 1], novos[index]];
      novos.forEach((b, i) => (b.ordem = i + 1));
      setBulksSelecionados(novos);
    }
  };

  // Filtrar caminhões
  const caminhoesFiltrados = useMemo(() => {
    const termoLower = buscaCaminhoes.toLowerCase().trim();
    if (!termoLower) {
      return caminhoes.filter((c) => c.status === "Ativo");
    }
    return caminhoes.filter(
      (c) =>
        c.status === "Ativo" &&
        (c.placa.toLowerCase().includes(termoLower) ||
          c.patrimonio.toLowerCase().includes(termoLower) ||
          c.modelo.toLowerCase().includes(termoLower) ||
          c.marca.toLowerCase().includes(termoLower))
    );
  }, [buscaCaminhoes, caminhoes]);

  // Filtrar bulks
  const bulksFiltrados = useMemo(() => {
    const termoLower = buscaBulks.toLowerCase().trim();
    if (!termoLower) {
      return bulks;
    }
    return bulks.filter(
      (b) =>
        b.nome.toLowerCase().includes(termoLower) ||
        b.smartCaldaNome.toLowerCase().includes(termoLower) ||
        b.localizacao.toLowerCase().includes(termoLower) ||
        b.tipo.toLowerCase().includes(termoLower)
    );
  }, [buscaBulks, bulks]);

  const handlePausarOrdem = (id: string) => {
    toast.warning(`Ordem ${id} pausada!`);
  };

  const handleConcluirOrdem = (id: string) => {
    toast.success(`Ordem ${id} concluída!`);
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

  // Filtrar talhões com busca (otimizado com useMemo) - apenas da fazenda selecionada
  const talhoesFiltrados = useMemo(() => {
    const termoLower = buscaTalhoes.toLowerCase().trim();
    const fazendaSelecionada = fazendas.find(
      (f) => f.id === novaOrdem.fazendaId
    );

    // Se não houver fazenda selecionada, não mostrar talhões
    if (!fazendaSelecionada) {
      return [];
    }

    const talhoesDaFazenda = fazendaSelecionada.talhoes
      .filter((t) => t.tipo === "Talhão" && t.status === "Ativo")
      .map((talhao) => ({
        fazenda: fazendaSelecionada,
        talhao,
        key: `${fazendaSelecionada.id}-${talhao.id}`,
      }));

    // Se não houver termo de busca, retornar todos os talhões da fazenda
    if (!termoLower) {
      return talhoesDaFazenda;
    }

    // Filtrar por termo de busca
    return talhoesDaFazenda.filter((item) => {
      const fazendaNome = item.fazenda.descricao.toLowerCase();
      const talhaoObs = item.talhao.observacoes?.toLowerCase() || "";
      const talhaoArea = item.talhao.area.toLowerCase();
      const talhaoId = item.talhao.id.toLowerCase();

      return (
        fazendaNome.includes(termoLower) ||
        talhaoObs.includes(termoLower) ||
        talhaoArea.includes(termoLower) ||
        talhaoId.includes(termoLower)
      );
    });
  }, [buscaTalhoes, fazendas, novaOrdem.fazendaId]);

  // Filtrar insumos com busca (otimizado com useMemo)
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
        const materialNome =
          material?.nomeComercial?.toLowerCase() ||
          material?.descricao?.toLowerCase() ||
          "";
        const materialCodigo = material?.codigo?.toLowerCase() || "";
        const categoria = material?.categoriaId
          ? categorias[material.categoriaId]
          : null;
        const categoriaNome = categoria?.descricaoResumida?.toLowerCase() || "";
        const categoriaCodigo = categoria?.codigo?.toLowerCase() || "";
        const lote = insumo.nLote?.toLowerCase() || "";

        return (
          materialNome.includes(termoLower) ||
          materialCodigo.includes(termoLower) ||
          categoriaNome.includes(termoLower) ||
          categoriaCodigo.includes(termoLower) ||
          lote.includes(termoLower) ||
          insumo.idItem.toString().includes(termoLower)
        );
      })
      .slice(0, 100); // Limitar a 100 resultados para performance
  }, [buscaInsumos, filtroTipoEstoqueInsumos, insumos]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Ordens de Serviços
        </h1>
        <p className="text-muted-foreground mt-1">
          Controle e acompanhamento das ordens de serviços
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {ordensServicos.filter((o) => o.status === "aguardando").length}
            </p>
            <p className="text-sm text-muted-foreground">Aguardando</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Play className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">
              {ordensServicos.filter((o) => o.status === "em_producao").length}
            </p>
            <p className="text-sm text-muted-foreground">Em Serviços</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Pause className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-warning">
              {ordensServicos.filter((o) => o.status === "pausada").length}
            </p>
            <p className="text-sm text-muted-foreground">Pausadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">
              {ordensServicos.filter((o) => o.status === "concluida").length}
            </p>
            <p className="text-sm text-muted-foreground">Concluídas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número da OS"
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
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="em_producao">Em Serviços</SelectItem>
                <SelectItem value="pausada">Pausada</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                Importar Ordens
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
                <DialogTitle>Criar Nova Ordem de Serviços</DialogTitle>
                <DialogDescription>
                  Preencha os dados da ordem de serviços
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
                  <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="fazenda">Seção (Fazenda) *</Label>
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
                        <SelectValue placeholder="Selecione a fazenda" />
                      </SelectTrigger>
                      <SelectContent>
                        {fazendas
                          .filter((f) => !f.status || f.status === "Ativo")
                          .map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.descricao}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Seção é a mesma coisa que fazenda
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caldaHA">Calda/Ha</Label>
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
                    <Label htmlFor="producao">Produção</Label>
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

                {/* Seleção de Talhões */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Talhões</Label>
                    {talhoesSelecionados.size > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {talhoesSelecionados.size} selecionado(s)
                      </span>
                    )}
                  </div>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por fazenda, talhão ou área..."
                      value={buscaTalhoes}
                      onChange={(e) => setBuscaTalhoes(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="border rounded-lg p-2 max-h-64 overflow-y-auto">
                    {talhoesFiltrados.length === 0 ? (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        Nenhum talhão encontrado
                      </div>
                    ) : (
                      talhoesFiltrados.map((item) => {
                        const isSelected = talhoesSelecionados.has(item.key);
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
                              <span className="font-medium">
                                {item.fazenda.descricao}
                              </span>
                              {" - "}
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
                </div>

                {/* Seleção de Insumos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Insumos</Label>
                    {insumosSelecionados.size > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {insumosSelecionados.size} selecionado(s)
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <div className="relative md:col-span-3">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por código, nome, grupo, classe ou lote..."
                        value={buscaInsumos}
                        onChange={(e) => setBuscaInsumos(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={filtroTipoEstoqueInsumos}
                      onValueChange={(
                        value: "TODOS" | "TÉCNICO" | "FRACIONÁRIO"
                      ) => setFiltroTipoEstoqueInsumos(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODOS">Todos os estoques</SelectItem>
                        <SelectItem value="TÉCNICO">Estoque Técnico</SelectItem>
                        <SelectItem value="FRACIONÁRIO">
                          Estoque Fracionário
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {material?.nomeComercial ||
                                    `Item ${insumo.idItem}`}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {material?.codigo || insumo.idItem}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {insumo.tipoEstoque}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {categoria?.descricaoResumida ||
                                  "Sem descrição"}{" "}
                                • Lote: {insumo.nLote} • Disponível:{" "}
                                {insumo.saldoDispon} {insumo.unidade}
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
                </div>

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
                <Button type="submit" onClick={handleIncluirOrdem}>
                  Criar Ordem
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
                          {ordem.status === "aguardando" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleIniciarOrdem(ordem.id)}
                              title="Iniciar Ordem"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {ordem.status === "em_producao" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePausarOrdem(ordem.id)}
                                title="Pausar Ordem"
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleConcluirOrdem(ordem.id)}
                                title="Concluir Ordem"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {ordem.status === "pausada" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleIniciarOrdem(ordem.id)}
                              title="Retomar Ordem"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">
                              Número da OS
                            </Label>
                            <p className="text-sm font-medium">
                              {ordem.numeroOS}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Data da Geração
                            </Label>
                            <p className="text-sm font-medium">
                              {new Date(ordem.dataGeracao).toLocaleDateString(
                                "pt-BR"
                              )}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Centro de Custo
                            </Label>
                            <p className="text-sm font-medium">
                              {centroCusto?.descricao || "-"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Operação
                            </Label>
                            <p className="text-sm font-medium">
                              {operacao?.descricao || "-"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Responsável
                            </Label>
                            <p className="text-sm font-medium">
                              {responsavel?.nome || "-"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Seção
                            </Label>
                            <p className="text-sm font-medium">
                              {ordem.secao || "-"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Calda/Ha
                            </Label>
                            <p className="text-sm font-medium">
                              {ordem.caldaHA || "-"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Status
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(ordem.status)}
                              <Badge variant={getStatusBadge(ordem.status)}>
                                {getStatusLabel(ordem.status)}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">
                              Progresso
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress
                                value={ordem.progresso}
                                className="h-2 flex-1"
                              />
                              <span className="text-sm font-medium">
                                {ordem.progresso}%
                              </span>
                            </div>
                          </div>
                          {ordem.iniciado && (
                            <div>
                              <Label className="text-muted-foreground">
                                Iniciado em
                              </Label>
                              <p className="text-sm font-medium">
                                {ordem.iniciado}
                              </p>
                            </div>
                          )}
                          {ordem.previsaoTermino && (
                            <div>
                              <Label className="text-muted-foreground">
                                Previsão de Término
                              </Label>
                              <p className="text-sm font-medium">
                                {ordem.previsaoTermino}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Talhões */}
                        {ordem.talhoes.length > 0 && (
                          <div className="mt-4">
                            <Label className="text-muted-foreground mb-2 block">
                              Talhões
                            </Label>
                            <div className="space-y-2">
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
                                          {fazenda?.descricao ||
                                            "Fazenda não encontrada"}{" "}
                                          -{" "}
                                          {talhaoObj?.observacoes ||
                                            `Talhão ${talhao.talhaoId}`}
                                        </p>
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {talhaoObj?.tipo || "Talhão"} • Área:{" "}
                                        {talhaoObj?.area || "-"} ha
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
                          </div>
                        )}

                        {/* Insumos */}
                        {ordem.insumos.length > 0 && (
                          <div className="mt-4">
                            <Label className="text-muted-foreground mb-2 block">
                              Insumos
                            </Label>
                            <div className="space-y-2">
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
                                          {material?.codigo || insumo.idItem}
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
                                          const areaTotal =
                                            ordem.talhoes.reduce(
                                              (sum, talhao) => {
                                                const fazenda = fazendas.find(
                                                  (f) =>
                                                    f.id === talhao.fazendaId
                                                );
                                                const talhaoObj =
                                                  fazenda?.talhoes.find(
                                                    (t) =>
                                                      t.id === talhao.talhaoId
                                                  );
                                                return (
                                                  sum +
                                                  (Number(talhaoObj?.area) || 0)
                                                );
                                              },
                                              0
                                            );
                                          const quantidadeTotal =
                                            areaTotal * insumo.doseHA;
                                          return quantidadeTotal.toFixed(2);
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
                          </div>
                        )}

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
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Modal de Iniciação da OS */}
      <Dialog open={dialogIniciarOpen} onOpenChange={handleFecharModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Iniciar Ordem de Serviço</DialogTitle>
            <DialogDescription>
              Configure os parâmetros de iniciação da OS em etapas
            </DialogDescription>
          </DialogHeader>

          {/* Indicador de Etapas */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  etapaAtual >= 1
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-muted-foreground"
                }`}
              >
                1
              </div>
              <div
                className={`flex-1 h-1 ${
                  etapaAtual >= 2 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  etapaAtual >= 2
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-muted-foreground"
                }`}
              >
                2
              </div>
              <div
                className={`flex-1 h-1 ${
                  etapaAtual >= 3 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  etapaAtual >= 3
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-muted-foreground"
                }`}
              >
                3
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6 -mt-4">
            <span className="text-xs text-muted-foreground">BULKS</span>
            <span className="text-xs text-muted-foreground">Caminhões</span>
            <span className="text-xs text-muted-foreground">Confirmação</span>
          </div>

          <div className="space-y-6">
            {/* Etapa 1: Seleção de BULKS */}
            {etapaAtual === 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    BULKS e Ordem de Liberação
                  </Label>
                  {bulksSelecionados.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {bulksSelecionados.length} selecionado(s)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, Smart Calda ou localização..."
                    value={buscaBulks}
                    onChange={(e) => setBuscaBulks(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="border rounded-lg p-2 max-h-48 overflow-y-auto space-y-2">
                  {bulksFiltrados.length === 0 ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Nenhum BULK encontrado
                    </div>
                  ) : (
                    bulksFiltrados.map((bulk) => {
                      const isSelected = bulksSelecionados.some(
                        (b) => b.bulkId === bulk.id
                      );
                      const ordemSelecionada = bulksSelecionados.find(
                        (b) => b.bulkId === bulk.id
                      )?.ordem;

                      return (
                        <div
                          key={bulk.id}
                          className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded transition-colors"
                        >
                          <Checkbox
                            id={`bulk-${bulk.id}`}
                            checked={isSelected}
                            onCheckedChange={() => handleToggleBulk(bulk.id)}
                          />
                          <Label
                            htmlFor={`bulk-${bulk.id}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{bulk.nome}</span>
                              <Badge
                                variant={
                                  bulk.tipo === "IBC"
                                    ? "default"
                                    : bulk.tipo === "SILO"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="text-xs"
                              >
                                {bulk.tipo}
                              </Badge>
                              {isSelected && (
                                <Badge variant="default" className="text-xs">
                                  Ordem: {ordemSelecionada}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {bulk.smartCaldaNome} • {bulk.localizacao} • Cap:{" "}
                              {bulk.capacidade}L
                            </div>
                          </Label>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Lista de BULKS Selecionados com Ordem */}
                {bulksSelecionados.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Ordem de Liberação dos BULKS
                    </Label>
                    <div className="border rounded-lg p-3 space-y-2">
                      {bulksSelecionados
                        .sort((a, b) => a.ordem - b.ordem)
                        .map((item, index) => {
                          const bulk = bulks.find((b) => b.id === item.bulkId);
                          return (
                            <div
                              key={item.bulkId}
                              className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <Badge
                                variant="default"
                                className="w-8 text-center"
                              >
                                {item.ordem}
                              </Badge>
                              <div className="flex-1">
                                <span className="text-sm font-medium">
                                  {bulk?.nome}
                                </span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({bulk?.tipo}) - {bulk?.smartCaldaNome}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMoverBulk(index, "up")}
                                  disabled={index === 0}
                                  className="h-7 w-7 p-0"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMoverBulk(index, "down")}
                                  disabled={
                                    index === bulksSelecionados.length - 1
                                  }
                                  className="h-7 w-7 p-0"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Etapa 2: Seleção de Caminhões */}
            {etapaAtual === 2 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    Caminhões e Ordem de Saída
                  </Label>
                  {caminhoesSelecionados.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {caminhoesSelecionados.length} selecionado(s)
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por placa, patrimônio, modelo ou marca..."
                    value={buscaCaminhoes}
                    onChange={(e) => setBuscaCaminhoes(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="border rounded-lg p-2 max-h-48 overflow-y-auto space-y-2">
                  {caminhoesFiltrados.length === 0 ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Nenhum caminhão encontrado
                    </div>
                  ) : (
                    caminhoesFiltrados.map((caminhao) => {
                      const isSelected = caminhoesSelecionados.some(
                        (c) => c.caminhaoId === caminhao.id
                      );
                      const ordemSelecionada = caminhoesSelecionados.find(
                        (c) => c.caminhaoId === caminhao.id
                      )?.ordem;

                      return (
                        <div
                          key={caminhao.id}
                          className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded transition-colors"
                        >
                          <Checkbox
                            id={`caminhao-${caminhao.id}`}
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleToggleCaminhao(caminhao.id)
                            }
                          />
                          <Label
                            htmlFor={`caminhao-${caminhao.id}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {caminhao.placa}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {caminhao.modelo} - {caminhao.marca}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Volume: {caminhao.volume}L
                              </span>
                              {isSelected && (
                                <Badge variant="default" className="text-xs">
                                  Ordem: {ordemSelecionada}
                                </Badge>
                              )}
                            </div>
                          </Label>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Lista de Caminhões Selecionados com Ordem */}
                {caminhoesSelecionados.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Ordem de Saída dos Caminhões
                    </Label>
                    <div className="border rounded-lg p-3 space-y-2">
                      {caminhoesSelecionados
                        .sort((a, b) => a.ordem - b.ordem)
                        .map((item, index) => {
                          const caminhao = caminhoes.find(
                            (c) => c.id === item.caminhaoId
                          );
                          return (
                            <div
                              key={item.caminhaoId}
                              className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <Badge
                                variant="default"
                                className="w-8 text-center"
                              >
                                {item.ordem}
                              </Badge>
                              <span className="flex-1 text-sm font-medium">
                                {caminhao?.placa} - {caminhao?.modelo} (
                                {caminhao?.volume}L)
                              </span>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleMoverCaminhao(index, "up")
                                  }
                                  disabled={index === 0}
                                  className="h-7 w-7 p-0"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleMoverCaminhao(index, "down")
                                  }
                                  disabled={
                                    index === caminhoesSelecionados.length - 1
                                  }
                                  className="h-7 w-7 p-0"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Etapa 3: Confirmação */}
            {etapaAtual === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Resumo da Configuração
                  </h3>

                  {/* Resumo BULKS */}
                  <div className="mb-4">
                    <Label className="text-sm font-medium mb-2 block">
                      Ordem de Liberação dos BULKS ({bulksSelecionados.length})
                    </Label>
                    <div className="space-y-2">
                      {bulksSelecionados
                        .sort((a, b) => a.ordem - b.ordem)
                        .map((item) => {
                          const bulk = bulks.find((b) => b.id === item.bulkId);
                          return (
                            <div
                              key={item.bulkId}
                              className="flex items-center gap-2 p-2 bg-background rounded border"
                            >
                              <Badge
                                variant="default"
                                className="w-8 text-center"
                              >
                                {item.ordem}
                              </Badge>
                              <span className="text-sm font-medium">
                                {bulk?.nome}
                              </span>
                              <Badge
                                variant={
                                  bulk?.tipo === "IBC"
                                    ? "default"
                                    : bulk?.tipo === "SILO"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="text-xs"
                              >
                                {bulk?.tipo}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {bulk?.smartCaldaNome}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Resumo Caminhões */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Ordem de Saída dos Caminhões (
                      {caminhoesSelecionados.length})
                    </Label>
                    <div className="space-y-2">
                      {caminhoesSelecionados
                        .sort((a, b) => a.ordem - b.ordem)
                        .map((item) => {
                          const caminhao = caminhoes.find(
                            (c) => c.id === item.caminhaoId
                          );
                          return (
                            <div
                              key={item.caminhaoId}
                              className="flex items-center gap-2 p-2 bg-background rounded border"
                            >
                              <Badge
                                variant="default"
                                className="w-8 text-center"
                              >
                                {item.ordem}
                              </Badge>
                              <span className="text-sm font-medium">
                                {caminhao?.placa}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {caminhao?.modelo} - {caminhao?.marca}
                              </span>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {caminhao?.volume}L
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {etapaAtual === 1 && (
              <>
                <Button variant="outline" onClick={handleFecharModal}>
                  Cancelar
                </Button>
                <Button onClick={handleProximaEtapa}>Próximo</Button>
              </>
            )}
            {etapaAtual === 2 && (
              <>
                <Button variant="outline" onClick={handleEtapaAnterior}>
                  Anterior
                </Button>
                <Button variant="outline" onClick={handleFecharModal}>
                  Cancelar
                </Button>
                <Button onClick={handleProximaEtapa}>Próximo</Button>
              </>
            )}
            {etapaAtual === 3 && (
              <>
                <Button variant="outline" onClick={handleEtapaAnterior}>
                  Anterior
                </Button>
                <Button variant="outline" onClick={handleFecharModal}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmarIniciar}>
                  Confirmar e Iniciar OS
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
