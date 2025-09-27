import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Server,
  Wifi,
  WifiOff,
  Activity,
  AlertTriangle,
  CheckCircle,
  Eye,
  MapPin,
  Calendar,
  Minus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interfaces
interface IBC {
  id: number;
  nome: string;
  capacidade: number;
  vazao: string;
}

interface Silo {
  id: number;
  nome: string;
  capacidade: number;
  peso: string;
}

interface Fracionado {
  id: number;
  nome: string;
  capacidade: number;
  pesoVazao: string;
}

interface Balanca {
  id: number;
  nome: string;
  vinculacao: string[];
}

interface TanqueSaida {
  nome: string;
  capacidade: number;
  sensorVazao: string;
  sensorNivel: string;
}

interface TanqueArmazenamento {
  nome: string;
  capacidade: number;
  sensorVazao: string;
}

interface SmartCalda {
  id: number;
  nome: string;
  usinaVinculada: string;
  numeroSerie: string;
  dataInstalacao: string;
  latitude: string;
  longitude: string;
  identificacaoEquipamento: string;
  localizacao: string;
  ibcs: IBC[];
  fracionados: Fracionado[];
  silos: Silo[];
  balancas: Balanca[];
  tanqueSaida: TanqueSaida;
  tanqueArmazenamento: TanqueArmazenamento;
  observacoes: string;
  url: string;
  token: string;
  status: string;
  ultimaConexao: string;
  versaoFirmware: string;
  configuracoes: {
    intervaloLeitura: number;
    alertasAtivos: boolean;
    backupAutomatico: boolean;
  };
}

interface Manutencao {
  id: number;
  smartCaldaId: number;
  identificacaoEquipamento: string;
  numeroSerie: string;
  dataManutencao: string;
  tipoManutencao: string;
  responsavel: string;
  resumo: string;
  status: "pendente" | "concluido";
  arquivos: ArquivoManutencao[];
  dataCriacao: string;
  dataAtualizacao: string;
  geradaAutomaticamente: boolean;
}

interface ArquivoManutencao {
  id: number;
  nome: string;
  tamanho: number;
  tipo: string;
  url: string;
  dataUpload: string;
}

interface Unidade {
  id: number;
  nome: string;
  tipo: "matriz" | "filial";
}

// Mock data para demonstração
const mockSmartCaldas: SmartCalda[] = [
  {
    id: 1,
    nome: "Smart Calda #001",
    usinaVinculada: "Usina São João",
    numeroSerie: "SC-2024-001",
    dataInstalacao: "2024-01-10",
    latitude: "-23.5505",
    longitude: "-46.6333",
    identificacaoEquipamento: "Caldas automática para defensivos agrícolas",
    localizacao: "Estufa A - Setor 1",
    ibcs: [
      { id: 1, nome: "IBC-001", capacidade: 300, vazao: "vazao_ibc_1" },
      { id: 2, nome: "IBC-002", capacidade: 250, vazao: "vazao_ibc_2" },
    ],
    fracionados: [
      { id: 1, nome: "FRAC-001", capacidade: 100, pesoVazao: "peso_frac_1" },
      { id: 2, nome: "FRAC-002", capacidade: 100, pesoVazao: "peso_frac_2" },
    ],
    silos: [
      { id: 1, nome: "SILO-001", capacidade: 500, peso: "peso_silo_1" },
      { id: 2, nome: "SILO-002", capacidade: 300, peso: "peso_silo_2" },
    ],
    balancas: [
      { id: 1, nome: "BAL-001", vinculacao: ["SILO-001"] },
      { id: 2, nome: "BAL-002", vinculacao: ["SILO-002", "FRAC-001"] },
    ],
    tanqueSaida: {
      nome: "SAIDA-001",
      capacidade: 1000,
      sensorVazao: "vazao_saida_1",
      sensorNivel: "nivel_saida_1",
    },
    tanqueArmazenamento: {
      nome: "ARM-001",
      capacidade: 2000,
      sensorVazao: "vazao_arm_1",
    },
    observacoes: "Equipamento instalado com sucesso",
    url: "https://smartcalda-001.iagro.local:8080",
    token: "sk_abc123...",
    status: "online",
    ultimaConexao: "2024-01-15 14:30",
    versaoFirmware: "v2.1.3",
    configuracoes: {
      intervaloLeitura: 30,
      alertasAtivos: true,
      backupAutomatico: true,
    },
  },
  {
    id: 2,
    nome: "Smart Calda #002",
    usinaVinculada: "Usina Boa Vista",
    numeroSerie: "SC-2024-002",
    dataInstalacao: "2024-01-05",
    latitude: "-22.9068",
    longitude: "-43.1729",
    identificacaoEquipamento: "Caldas manual com controle semi-automático",
    localizacao: "Estufa B - Setor 2",
    ibcs: [{ id: 1, nome: "IBC-001", capacidade: 200, vazao: "vazao_ibc_1" }],
    fracionados: [],
    silos: [{ id: 1, nome: "SILO-001", capacidade: 400, peso: "peso_silo_1" }],
    balancas: [{ id: 1, nome: "BAL-001", vinculacao: ["SILO-001"] }],
    tanqueSaida: {
      nome: "SAIDA-002",
      capacidade: 800,
      sensorVazao: "vazao_saida_2",
      sensorNivel: "nivel_saida_2",
    },
    tanqueArmazenamento: {
      nome: "ARM-002",
      capacidade: 1500,
      sensorVazao: "vazao_arm_2",
    },
    observacoes: "Necessita calibração mensal",
    url: "https://smartcalda-002.iagro.local:8080",
    token: "sk_def456...",
    status: "offline",
    ultimaConexao: "2024-01-14 16:45",
    versaoFirmware: "v2.0.8",
    configuracoes: {
      intervaloLeitura: 60,
      alertasAtivos: false,
      backupAutomatico: true,
    },
  },
  {
    id: 3,
    nome: "Smart Calda #003",
    usinaVinculada: "Usina Verde Campo",
    numeroSerie: "SC-2024-003",
    dataInstalacao: "2023-12-20",
    latitude: "-20.4697",
    longitude: "-54.6201",
    identificacaoEquipamento: "Caldas automática de alta capacidade",
    localizacao: "Estufa C - Setor 1",
    ibcs: [
      { id: 1, nome: "IBC-001", capacidade: 400, vazao: "vazao_ibc_1" },
      { id: 2, nome: "IBC-002", capacidade: 350, vazao: "vazao_ibc_2" },
      { id: 3, nome: "IBC-003", capacidade: 300, vazao: "vazao_ibc_3" },
    ],
    fracionados: [
      { id: 1, nome: "FRAC-001", capacidade: 50, pesoVazao: "peso_frac_1" },
      { id: 2, nome: "FRAC-002", capacidade: 50, pesoVazao: "peso_frac_2" },
      { id: 3, nome: "FRAC-003", capacidade: 50, pesoVazao: "peso_frac_3" },
      { id: 4, nome: "FRAC-004", capacidade: 50, pesoVazao: "peso_frac_4" },
    ],
    silos: [
      { id: 1, nome: "SILO-001", capacidade: 600, peso: "peso_silo_1" },
      { id: 2, nome: "SILO-002", capacidade: 500, peso: "peso_silo_2" },
    ],
    balancas: [
      { id: 1, nome: "BAL-001", vinculacao: ["SILO-001"] },
      { id: 2, nome: "BAL-002", vinculacao: ["SILO-002"] },
      { id: 3, nome: "BAL-003", vinculacao: ["FRAC-001", "FRAC-002"] },
    ],
    tanqueSaida: {
      nome: "SAIDA-003",
      capacidade: 1500,
      sensorVazao: "vazao_saida_3",
      sensorNivel: "nivel_saida_3",
    },
    tanqueArmazenamento: {
      nome: "ARM-003",
      capacidade: 3000,
      sensorVazao: "vazao_arm_3",
    },
    observacoes: "Em manutenção preventiva",
    url: "https://smartcalda-003.iagro.local:8080",
    token: "sk_ghi789...",
    status: "manutencao",
    ultimaConexao: "2024-01-13 09:15",
    versaoFirmware: "v2.1.1",
    configuracoes: {
      intervaloLeitura: 15,
      alertasAtivos: true,
      backupAutomatico: false,
    },
  },
];

const usinas = [
  { value: "Usina São João", label: "Usina São João" },
  { value: "Usina Boa Vista", label: "Usina Boa Vista" },
  { value: "Usina Verde Campo", label: "Usina Verde Campo" },
];

// Mock data para manutenções
const mockManutencoes: Manutencao[] = [
  {
    id: 1,
    smartCaldaId: 1,
    identificacaoEquipamento: "Caldas automática para defensivos agrícolas",
    numeroSerie: "SC-2024-001",
    dataManutencao: "2024-01-15",
    tipoManutencao: "Preventiva",
    responsavel: "João Silva",
    resumo:
      "Calibração dos sensores de vazão e verificação do sistema de bombeamento",
    status: "concluido",
    arquivos: [
      {
        id: 1,
        nome: "relatorio_manutencao_001.pdf",
        tamanho: 2048576,
        tipo: "application/pdf",
        url: "/arquivos/relatorio_manutencao_001.pdf",
        dataUpload: "2024-01-15T10:30:00Z",
      },
    ],
    dataCriacao: "2024-01-15T08:00:00Z",
    dataAtualizacao: "2024-01-15T16:30:00Z",
    geradaAutomaticamente: false,
  },
  {
    id: 2,
    smartCaldaId: 1,
    identificacaoEquipamento: "Caldas automática para defensivos agrícolas",
    numeroSerie: "SC-2024-001",
    dataManutencao: "2024-01-20",
    tipoManutencao: "Corretiva",
    responsavel: "",
    resumo: "",
    status: "pendente",
    arquivos: [],
    dataCriacao: "2024-01-20T14:00:00Z",
    dataAtualizacao: "2024-01-20T14:00:00Z",
    geradaAutomaticamente: true,
  },
  {
    id: 3,
    smartCaldaId: 2,
    identificacaoEquipamento: "Caldas manual com controle semi-automático",
    numeroSerie: "SC-2024-002",
    dataManutencao: "2024-01-10",
    tipoManutencao: "Preventiva",
    responsavel: "Maria Santos",
    resumo: "Substituição de válvulas e limpeza do sistema de filtros",
    status: "concluido",
    arquivos: [],
    dataCriacao: "2024-01-10T09:00:00Z",
    dataAtualizacao: "2024-01-10T17:00:00Z",
    geradaAutomaticamente: false,
  },
];

const unidades: Unidade[] = [
  { id: 1, nome: "Usina Central", tipo: "matriz" },
  { id: 2, nome: "Filial Norte", tipo: "filial" },
  { id: 3, nome: "Filial Sul", tipo: "filial" },
];

const tiposManutencao = [
  { value: "Preventiva", label: "Preventiva" },
  { value: "Corretiva", label: "Corretiva" },
  { value: "Preditiva", label: "Preditiva" },
  { value: "Emergencial", label: "Emergencial" },
];

// Configurações de arquivo
const CONFIG_ARQUIVO = {
  TAMANHO_MAXIMO_MB: 10,
  TAMANHO_MAXIMO_BYTES: 10 * 1024 * 1024, // 10MB em bytes
  TIPOS_PERMITIDOS: [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

const GestaoSmartCaldas = () => {
  const { toast } = useToast();
  const [smartCaldas, setSmartCaldas] = useState<SmartCalda[]>(mockSmartCaldas);
  const [manutencoes, setManutencoes] = useState<Manutencao[]>(mockManutencoes);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [dialogDetalhes, setDialogDetalhes] = useState(false);
  const [dialogManutencao, setDialogManutencao] = useState(false);
  const [dialogHistorico, setDialogHistorico] = useState(false);
  const [dialogDetalhesManutencao, setDialogDetalhesManutencao] =
    useState(false);
  const [smartCaldaEditando, setSmartCaldaEditando] =
    useState<SmartCalda | null>(null);
  const [smartCaldaDetalhes, setSmartCaldaDetalhes] =
    useState<SmartCalda | null>(null);
  const [manutencaoEditando, setManutencaoEditando] =
    useState<Manutencao | null>(null);
  const [manutencaoDetalhes, setManutencaoDetalhes] =
    useState<Manutencao | null>(null);
  const [smartCaldaHistorico, setSmartCaldaHistorico] =
    useState<SmartCalda | null>(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroUnidade, setFiltroUnidade] = useState("todos");
  const [filtroStatusManutencao, setFiltroStatusManutencao] = useState("todos");
  const [testConnectionId, setTestConnectionId] = useState<number | null>(null);
  const [abaAtiva, setAbaAtiva] = useState("cadastros");

  const [novaSmartCalda, setNovaSmartCalda] = useState<
    Omit<SmartCalda, "id" | "status" | "ultimaConexao" | "versaoFirmware">
  >({
    nome: "",
    usinaVinculada: "",
    numeroSerie: "",
    dataInstalacao: "",
    latitude: "",
    longitude: "",
    identificacaoEquipamento: "",
    localizacao: "",
    ibcs: [],
    fracionados: [],
    silos: [],
    balancas: [],
    tanqueSaida: { nome: "", capacidade: 0, sensorVazao: "", sensorNivel: "" },
    tanqueArmazenamento: { nome: "", capacidade: 0, sensorVazao: "" },
    observacoes: "",
    url: "",
    token: "",
    configuracoes: {
      intervaloLeitura: 30,
      alertasAtivos: true,
      backupAutomatico: true,
    },
  });

  const [novaManutencao, setNovaManutencao] = useState<
    Omit<
      Manutencao,
      | "id"
      | "status"
      | "arquivos"
      | "dataCriacao"
      | "dataAtualizacao"
      | "geradaAutomaticamente"
    >
  >({
    smartCaldaId: 0,
    identificacaoEquipamento: "",
    numeroSerie: "",
    dataManutencao: "",
    tipoManutencao: "",
    responsavel: "",
    resumo: "",
  });

  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);
  const [arquivosPreview, setArquivosPreview] = useState<ArquivoManutencao[]>(
    []
  );

  const smartCaldasFiltradas = smartCaldas.filter((sc) => {
    const matchPesquisa =
      sc.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      sc.localizacao.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      sc.usinaVinculada.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      sc.numeroSerie.toLowerCase().includes(termoPesquisa.toLowerCase());
    const matchStatus = filtroStatus === "todos" || sc.status === filtroStatus;

    return matchPesquisa && matchStatus;
  });

  const validarFormulario = () => {
    const camposObrigatorios = [
      { campo: novaSmartCalda.usinaVinculada, nome: "Usina Vinculada" },
      { campo: novaSmartCalda.numeroSerie, nome: "Número de Série" },
      { campo: novaSmartCalda.dataInstalacao, nome: "Data da Instalação" },
      { campo: novaSmartCalda.latitude, nome: "Latitude" },
      { campo: novaSmartCalda.longitude, nome: "Longitude" },
      { campo: novaSmartCalda.url, nome: "URL de Conexão" },
      { campo: novaSmartCalda.token, nome: "Token de Acesso" },
    ];

    const camposFaltantes = camposObrigatorios
      .filter((item) => !item.campo?.trim())
      .map((item) => item.nome);

    if (camposFaltantes.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Preencha os seguintes campos: ${camposFaltantes.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return false;
    }

    // Verificar se pelo menos um tipo de capacidade foi informado
    const temIBCs = novaSmartCalda.ibcs.length > 0;
    const temSilos = novaSmartCalda.silos.length > 0;
    const temFracionados = novaSmartCalda.fracionados.length > 0;
    const temTanques =
      novaSmartCalda.tanqueSaida.capacidade > 0 ||
      novaSmartCalda.tanqueArmazenamento.capacidade > 0;

    if (!temIBCs && !temSilos && !temFracionados && !temTanques) {
      toast({
        title: "Configurações de capacidade obrigatórias",
        description:
          "É necessário informar as configurações de capacidade (IBCs, silos, fracionados ou tanques) desta Smart Calda.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCriarSmartCalda = () => {
    if (!validarFormulario()) return;

    const smartCalda: SmartCalda = {
      id: smartCaldas.length + 1,
      ...novaSmartCalda,
      status: "offline",
      ultimaConexao: "Nunca",
      versaoFirmware: "v2.1.3",
    };

    setSmartCaldas([...smartCaldas, smartCalda]);
    resetarFormulario();
    setDialogAberto(false);
    toast({ title: "Smart Calda cadastrada com sucesso!", variant: "default" });
  };

  const handleEditarSmartCalda = (smartCalda: SmartCalda) => {
    setSmartCaldaEditando(smartCalda);
    setNovaSmartCalda({
      nome: smartCalda.nome,
      usinaVinculada: smartCalda.usinaVinculada,
      numeroSerie: smartCalda.numeroSerie,
      dataInstalacao: smartCalda.dataInstalacao,
      latitude: smartCalda.latitude,
      longitude: smartCalda.longitude,
      identificacaoEquipamento: smartCalda.identificacaoEquipamento,
      localizacao: smartCalda.localizacao,
      ibcs: [...smartCalda.ibcs],
      fracionados: [...smartCalda.fracionados],
      silos: [...smartCalda.silos],
      balancas: [...smartCalda.balancas],
      tanqueSaida: { ...smartCalda.tanqueSaida },
      tanqueArmazenamento: { ...smartCalda.tanqueArmazenamento },
      observacoes: smartCalda.observacoes,
      url: smartCalda.url,
      token: smartCalda.token,
      configuracoes: { ...smartCalda.configuracoes },
    });
    setDialogAberto(true);
  };

  const handleSalvarEdicao = () => {
    if (!validarFormulario()) return;

    setSmartCaldas(
      smartCaldas.map((sc) =>
        sc.id === smartCaldaEditando?.id
          ? { ...smartCaldaEditando, ...novaSmartCalda }
          : sc
      )
    );
    resetarFormulario();
    setDialogAberto(false);
    toast({ title: "Smart Calda atualizada com sucesso!", variant: "default" });
  };

  const handleExcluirSmartCalda = (id: number) => {
    setSmartCaldas(
      smartCaldas.map((sc) =>
        sc.id === id ? { ...sc, status: "desativado" } : sc
      )
    );
    toast({ title: "Smart Calda desativada com sucesso!", variant: "default" });
  };

  const handleVisualizarDetalhes = (smartCalda: SmartCalda) => {
    setSmartCaldaDetalhes(smartCalda);
    setDialogDetalhes(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: "default",
      offline: "secondary",
      manutencao: "destructive",
      desativado: "outline",
    };
    return (variants[status as keyof typeof variants] || "outline") as
      | "default"
      | "destructive"
      | "secondary"
      | "outline";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-muted-foreground" />;
      case "manutencao":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const resetarFormulario = () => {
    setNovaSmartCalda({
      nome: "",
      usinaVinculada: "",
      numeroSerie: "",
      dataInstalacao: "",
      latitude: "",
      longitude: "",
      identificacaoEquipamento: "",
      localizacao: "",
      ibcs: [],
      fracionados: [],
      silos: [],
      balancas: [],
      tanqueSaida: {
        nome: "",
        capacidade: 0,
        sensorVazao: "",
        sensorNivel: "",
      },
      tanqueArmazenamento: { nome: "", capacidade: 0, sensorVazao: "" },
      observacoes: "",
      url: "",
      token: "",
      configuracoes: {
        intervaloLeitura: 30,
        alertasAtivos: true,
        backupAutomatico: true,
      },
    });
    setSmartCaldaEditando(null);
  };

  // Funções para gerenciar IBCs
  const adicionarIBC = () => {
    const novoId = Math.max(0, ...novaSmartCalda.ibcs.map((ibc) => ibc.id)) + 1;
    setNovaSmartCalda({
      ...novaSmartCalda,
      ibcs: [
        ...novaSmartCalda.ibcs,
        { id: novoId, nome: "", capacidade: 0, vazao: "" },
      ],
    });
  };

  const removerIBC = (id: number) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      ibcs: novaSmartCalda.ibcs.filter((ibc) => ibc.id !== id),
    });
  };

  const atualizarIBC = (
    id: number,
    field: keyof IBC,
    value: string | number
  ) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      ibcs: novaSmartCalda.ibcs.map((ibc) =>
        ibc.id === id ? { ...ibc, [field]: value } : ibc
      ),
    });
  };

  // Funções para gerenciar Silos
  const adicionarSilo = () => {
    const novoId =
      Math.max(0, ...novaSmartCalda.silos.map((silo) => silo.id)) + 1;
    setNovaSmartCalda({
      ...novaSmartCalda,
      silos: [
        ...novaSmartCalda.silos,
        { id: novoId, nome: "", capacidade: 0, peso: "" },
      ],
    });
  };

  const removerSilo = (id: number) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      silos: novaSmartCalda.silos.filter((silo) => silo.id !== id),
    });
  };

  const atualizarSilo = (
    id: number,
    field: keyof Silo,
    value: string | number
  ) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      silos: novaSmartCalda.silos.map((silo) =>
        silo.id === id ? { ...silo, [field]: value } : silo
      ),
    });
  };

  // Funções para gerenciar Fracionados
  const adicionarFracionado = () => {
    const novoId =
      Math.max(0, ...novaSmartCalda.fracionados.map((frac) => frac.id)) + 1;
    setNovaSmartCalda({
      ...novaSmartCalda,
      fracionados: [
        ...novaSmartCalda.fracionados,
        { id: novoId, nome: "", capacidade: 0, pesoVazao: "" },
      ],
    });
  };

  const removerFracionado = (id: number) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      fracionados: novaSmartCalda.fracionados.filter((frac) => frac.id !== id),
    });
  };

  const atualizarFracionado = (
    id: number,
    field: keyof Fracionado,
    value: string | number
  ) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      fracionados: novaSmartCalda.fracionados.map((frac) =>
        frac.id === id ? { ...frac, [field]: value } : frac
      ),
    });
  };

  // Funções para gerenciar Balanças
  const adicionarBalanca = () => {
    const novoId =
      Math.max(0, ...novaSmartCalda.balancas.map((bal) => bal.id)) + 1;
    setNovaSmartCalda({
      ...novaSmartCalda,
      balancas: [
        ...novaSmartCalda.balancas,
        { id: novoId, nome: "", vinculacao: [] },
      ],
    });
  };

  const removerBalanca = (id: number) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      balancas: novaSmartCalda.balancas.filter((bal) => bal.id !== id),
    });
  };

  const atualizarBalanca = (
    id: number,
    field: keyof Balanca,
    value: string | string[]
  ) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      balancas: novaSmartCalda.balancas.map((bal) =>
        bal.id === id ? { ...bal, [field]: value } : bal
      ),
    });
  };

  // Obter opções disponíveis para vinculação de balanças
  const getOpcoesVinculacao = () => {
    const opcoes: string[] = [];
    novaSmartCalda.silos.forEach((silo) => {
      if (silo.nome) opcoes.push(silo.nome);
    });
    novaSmartCalda.fracionados.forEach((frac) => {
      if (frac.nome) opcoes.push(frac.nome);
    });
    return opcoes;
  };

  // Funções para manutenções
  const manutencoesFiltradas = manutencoes.filter((manutencao) => {
    const smartCalda = smartCaldas.find(
      (sc) => sc.id === manutencao.smartCaldaId
    );
    const matchPesquisa =
      manutencao.identificacaoEquipamento
        .toLowerCase()
        .includes(termoPesquisa.toLowerCase()) ||
      manutencao.numeroSerie
        .toLowerCase()
        .includes(termoPesquisa.toLowerCase()) ||
      manutencao.responsavel
        .toLowerCase()
        .includes(termoPesquisa.toLowerCase()) ||
      manutencao.tipoManutencao
        .toLowerCase()
        .includes(termoPesquisa.toLowerCase());
    const matchStatus =
      filtroStatusManutencao === "todos" ||
      manutencao.status === filtroStatusManutencao;
    const matchUnidade =
      filtroUnidade === "todos" || smartCalda?.usinaVinculada === filtroUnidade;

    return matchPesquisa && matchStatus && matchUnidade;
  });

  const validarFormularioManutencao = () => {
    const camposObrigatorios = [
      { campo: novaManutencao.smartCaldaId, nome: "Smart Calda" },
      { campo: novaManutencao.dataManutencao, nome: "Data da Manutenção" },
      { campo: novaManutencao.tipoManutencao, nome: "Tipo de Manutenção" },
      { campo: novaManutencao.responsavel, nome: "Responsável" },
      { campo: novaManutencao.resumo, nome: "Resumo da Manutenção" },
    ];

    const camposFaltantes = camposObrigatorios
      .filter(
        (item) =>
          !item.campo || (typeof item.campo === "string" && !item.campo.trim())
      )
      .map((item) => item.nome);

    if (camposFaltantes.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Preencha os seguintes campos: ${camposFaltantes.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleCriarManutencao = () => {
    if (!validarFormularioManutencao()) return;

    const manutencao: Manutencao = {
      id: manutencoes.length + 1,
      ...novaManutencao,
      status: "concluido",
      arquivos: arquivosPreview,
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      geradaAutomaticamente: false,
    };

    setManutencoes([...manutencoes, manutencao]);
    resetarFormularioManutencao();
    setDialogManutencao(false);
    toast({ title: "Manutenção registrada com sucesso!", variant: "default" });
  };

  const handleEditarManutencao = (manutencao: Manutencao) => {
    if (manutencao.status === "concluido") {
      toast({
        title: "Manutenção concluída",
        description: "Não é possível editar manutenções concluídas.",
        variant: "destructive",
      });
      return;
    }

    setManutencaoEditando(manutencao);
    setNovaManutencao({
      smartCaldaId: manutencao.smartCaldaId,
      identificacaoEquipamento: manutencao.identificacaoEquipamento,
      numeroSerie: manutencao.numeroSerie,
      dataManutencao: manutencao.dataManutencao,
      tipoManutencao: manutencao.tipoManutencao,
      responsavel: manutencao.responsavel,
      resumo: manutencao.resumo,
    });
    setArquivosPreview(manutencao.arquivos);
    setArquivosSelecionados([]);
    setDialogManutencao(true);
  };

  const handleSalvarEdicaoManutencao = () => {
    if (!validarFormularioManutencao()) return;

    setManutencoes(
      manutencoes.map((m) =>
        m.id === manutencaoEditando?.id
          ? {
              ...m,
              ...novaManutencao,
              status: "concluido",
              arquivos: arquivosPreview,
              dataAtualizacao: new Date().toISOString(),
            }
          : m
      )
    );
    resetarFormularioManutencao();
    setDialogManutencao(false);
    toast({ title: "Manutenção atualizada com sucesso!", variant: "default" });
  };

  const handleExcluirManutencao = (id: number) => {
    setManutencoes(manutencoes.filter((m) => m.id !== id));
    toast({ title: "Manutenção excluída com sucesso!", variant: "default" });
  };

  const handleVisualizarDetalhesManutencao = (manutencao: Manutencao) => {
    setManutencaoDetalhes(manutencao);
    setDialogDetalhesManutencao(true);
  };

  const handleVisualizarHistorico = (smartCalda: SmartCalda) => {
    setSmartCaldaHistorico(smartCalda);
    setDialogHistorico(true);
  };

  const resetarFormularioManutencao = () => {
    setNovaManutencao({
      smartCaldaId: 0,
      identificacaoEquipamento: "",
      numeroSerie: "",
      dataManutencao: "",
      tipoManutencao: "",
      responsavel: "",
      resumo: "",
    });
    setArquivosSelecionados([]);
    setArquivosPreview([]);
    setManutencaoEditando(null);
  };

  const getStatusBadgeManutencao = (status: string) => {
    const variants = {
      pendente: "destructive",
      concluido: "default",
    };
    return (variants[status as keyof typeof variants] || "outline") as
      | "default"
      | "destructive"
      | "secondary"
      | "outline";
  };

  const getManutencoesPorSmartCalda = (smartCaldaId: number) => {
    return manutencoes
      .filter((m) => m.smartCaldaId === smartCaldaId)
      .sort(
        (a, b) =>
          new Date(b.dataManutencao).getTime() -
          new Date(a.dataManutencao).getTime()
      );
  };

  // Funções para gerenciar arquivos
  const validarArquivo = (arquivo: File): string | null => {
    if (arquivo.size > CONFIG_ARQUIVO.TAMANHO_MAXIMO_BYTES) {
      return `Arquivo "${arquivo.name}" excede o tamanho máximo de ${CONFIG_ARQUIVO.TAMANHO_MAXIMO_MB}MB`;
    }

    if (!CONFIG_ARQUIVO.TIPOS_PERMITIDOS.includes(arquivo.type)) {
      return `Tipo de arquivo "${arquivo.type}" não é permitido`;
    }

    return null;
  };

  const handleSelecionarArquivos = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const erros: string[] = [];
    const arquivosValidos: File[] = [];

    files.forEach((arquivo) => {
      const erro = validarArquivo(arquivo);
      if (erro) {
        erros.push(erro);
      } else {
        arquivosValidos.push(arquivo);
      }
    });

    if (erros.length > 0) {
      toast({
        title: "Erro na seleção de arquivos",
        description: erros.join(", "),
        variant: "destructive",
      });
    }

    if (arquivosValidos.length > 0) {
      setArquivosSelecionados((prev) => [...prev, ...arquivosValidos]);

      // Criar preview dos arquivos
      const novosArquivosPreview = arquivosValidos.map((arquivo, index) => ({
        id: Date.now() + index,
        nome: arquivo.name,
        tamanho: arquivo.size,
        tipo: arquivo.type,
        url: URL.createObjectURL(arquivo),
        dataUpload: new Date().toISOString(),
      }));

      setArquivosPreview((prev) => [...prev, ...novosArquivosPreview]);

      toast({
        title: "Arquivos selecionados",
        description: `${arquivosValidos.length} arquivo(s) adicionado(s) com sucesso`,
        variant: "default",
      });
    }
  };

  const removerArquivo = (index: number) => {
    setArquivosSelecionados((prev) => prev.filter((_, i) => i !== index));
    setArquivosPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const formatarTamanhoArquivo = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Smart Caldas
          </h1>
          <p className="text-muted-foreground">
            Configure e monitore suas Smart Caldas conectadas
          </p>
        </div>
      </div>

      <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cadastros">Cadastros</TabsTrigger>
          <TabsTrigger value="manutencoes">Manutenções</TabsTrigger>
        </TabsList>

        <TabsContent value="cadastros" className="space-y-6">
          <div className="flex justify-end">
            <Dialog
              open={dialogAberto}
              onOpenChange={(open) => {
                setDialogAberto(open);
                if (!open) resetarFormulario();
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Smart Calda
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {smartCaldaEditando
                      ? "Editar Smart Calda"
                      : "Cadastrar Nova Smart Calda"}
                  </DialogTitle>
                  <DialogDescription>
                    Configure os parâmetros de conexão e operação da Smart
                    Calda.
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basico" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basico">Dados Básicos</TabsTrigger>
                    <TabsTrigger value="conexao">
                      Conexão & Configurações
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basico" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="usina">Usina Vinculada *</Label>
                        <Select
                          value={novaSmartCalda.usinaVinculada}
                          onValueChange={(value) =>
                            setNovaSmartCalda({
                              ...novaSmartCalda,
                              usinaVinculada: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a usina" />
                          </SelectTrigger>
                          <SelectContent>
                            {usinas.map((usina) => (
                              <SelectItem key={usina.value} value={usina.value}>
                                {usina.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numeroSerie">Número de Série *</Label>
                        <Input
                          id="numeroSerie"
                          value={novaSmartCalda.numeroSerie}
                          onChange={(e) =>
                            setNovaSmartCalda({
                              ...novaSmartCalda,
                              numeroSerie: e.target.value,
                            })
                          }
                          placeholder="SC-2024-001"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dataInstalacao">
                          Data da Instalação *
                        </Label>
                        <Input
                          id="dataInstalacao"
                          type="date"
                          value={novaSmartCalda.dataInstalacao}
                          onChange={(e) =>
                            setNovaSmartCalda({
                              ...novaSmartCalda,
                              dataInstalacao: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Geo Localização *</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            placeholder="Latitude (ex: -23.5505)"
                            value={novaSmartCalda.latitude}
                            onChange={(e) =>
                              setNovaSmartCalda({
                                ...novaSmartCalda,
                                latitude: e.target.value,
                              })
                            }
                          />
                          <Input
                            placeholder="Longitude (ex: -46.6333)"
                            value={novaSmartCalda.longitude}
                            onChange={(e) =>
                              setNovaSmartCalda({
                                ...novaSmartCalda,
                                longitude: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="identificacaoEquipamento">
                          Características do Equipamento
                        </Label>
                        <Textarea
                          id="identificacaoEquipamento"
                          value={novaSmartCalda.identificacaoEquipamento}
                          onChange={(e) =>
                            setNovaSmartCalda({
                              ...novaSmartCalda,
                              identificacaoEquipamento: e.target.value,
                            })
                          }
                          placeholder="Caldas automática para defensivos agrícolas"
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* IBCs */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>IBCs e suas capacidades</Label>
                        <Button
                          type="button"
                          onClick={adicionarIBC}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar IBC
                        </Button>
                      </div>
                      {novaSmartCalda.ibcs.map((ibc) => (
                        <div
                          key={ibc.id}
                          className="space-y-2 p-3 border rounded"
                        >
                          <div className="flex gap-2 items-center">
                            <Label className="min-w-16">Nome:</Label>
                            <Input
                              placeholder="Ex: IBC-001"
                              value={ibc.nome}
                              onChange={(e) =>
                                atualizarIBC(ibc.id, "nome", e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={() => removerIBC(ibc.id)}
                              size="sm"
                              variant="outline"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Capacidade (L)"
                              value={ibc.capacidade || ""}
                              onChange={(e) =>
                                atualizarIBC(
                                  ibc.id,
                                  "capacidade",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="flex-1"
                            />
                            <Input
                              placeholder="Porta do sensor de vazão"
                              value={ibc.vazao}
                              onChange={(e) =>
                                atualizarIBC(ibc.id, "vazao", e.target.value)
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Fracionado */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Fracionados (quantidade dinâmica)</Label>
                        <Button
                          type="button"
                          onClick={adicionarFracionado}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Fracionado
                        </Button>
                      </div>
                      {novaSmartCalda.fracionados.map((frac) => (
                        <div
                          key={frac.id}
                          className="space-y-2 p-3 border rounded"
                        >
                          <div className="flex gap-2 items-center">
                            <Label className="min-w-16">Nome:</Label>
                            <Input
                              placeholder="Ex: FRAC-001"
                              value={frac.nome}
                              onChange={(e) =>
                                atualizarFracionado(
                                  frac.id,
                                  "nome",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={() => removerFracionado(frac.id)}
                              size="sm"
                              variant="outline"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Capacidade (kg/L)"
                              value={frac.capacidade || ""}
                              onChange={(e) =>
                                atualizarFracionado(
                                  frac.id,
                                  "capacidade",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="flex-1"
                            />
                            <Input
                              placeholder="Porta do sensor de peso/vazão"
                              value={frac.pesoVazao}
                              onChange={(e) =>
                                atualizarFracionado(
                                  frac.id,
                                  "pesoVazao",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Silos */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Silos e suas capacidades</Label>
                        <Button
                          type="button"
                          onClick={adicionarSilo}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Silo
                        </Button>
                      </div>
                      {novaSmartCalda.silos.map((silo) => (
                        <div
                          key={silo.id}
                          className="space-y-2 p-3 border rounded"
                        >
                          <div className="flex gap-2 items-center">
                            <Label className="min-w-16">Nome:</Label>
                            <Input
                              placeholder="Ex: SILO-001"
                              value={silo.nome}
                              onChange={(e) =>
                                atualizarSilo(silo.id, "nome", e.target.value)
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={() => removerSilo(silo.id)}
                              size="sm"
                              variant="outline"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Capacidade (kg)"
                              value={silo.capacidade || ""}
                              onChange={(e) =>
                                atualizarSilo(
                                  silo.id,
                                  "capacidade",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="flex-1"
                            />
                            <Input
                              placeholder="Porta do sensor de peso"
                              value={silo.peso}
                              onChange={(e) =>
                                atualizarSilo(silo.id, "peso", e.target.value)
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Balanças */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Balanças</Label>
                        <Button
                          type="button"
                          onClick={adicionarBalanca}
                          size="sm"
                          variant="outline"
                          disabled={getOpcoesVinculacao().length === 0}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Balança
                        </Button>
                      </div>
                      {getOpcoesVinculacao().length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Adicione silos ou fracionados primeiro para criar
                          balanças
                        </p>
                      )}
                      {novaSmartCalda.balancas.map((balanca) => (
                        <div
                          key={balanca.id}
                          className="space-y-2 p-3 border rounded"
                        >
                          <div className="flex gap-2 items-center">
                            <Label className="min-w-16">Nome:</Label>
                            <Input
                              placeholder="Ex: BAL-001"
                              value={balanca.nome}
                              onChange={(e) =>
                                atualizarBalanca(
                                  balanca.id,
                                  "nome",
                                  e.target.value
                                )
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              onClick={() => removerBalanca(balanca.id)}
                              size="sm"
                              variant="outline"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">
                              Vinculação aos silos/fracionados:
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              {getOpcoesVinculacao().map((opcao) => (
                                <label
                                  key={opcao}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={balanca.vinculacao.includes(opcao)}
                                    onChange={(e) => {
                                      const novasVinculacoes = e.target.checked
                                        ? [...balanca.vinculacao, opcao]
                                        : balanca.vinculacao.filter(
                                            (v) => v !== opcao
                                          );
                                      atualizarBalanca(
                                        balanca.id,
                                        "vinculacao",
                                        novasVinculacoes
                                      );
                                    }}
                                  />
                                  <span className="text-sm">{opcao}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tanques */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label>Tanque de Saída</Label>
                        <div className="space-y-2">
                          <Input
                            placeholder="Nome"
                            value={novaSmartCalda.tanqueSaida.nome}
                            onChange={(e) =>
                              setNovaSmartCalda({
                                ...novaSmartCalda,
                                tanqueSaida: {
                                  ...novaSmartCalda.tanqueSaida,
                                  nome: e.target.value,
                                },
                              })
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Capacidade (L)"
                            value={novaSmartCalda.tanqueSaida.capacidade || ""}
                            onChange={(e) =>
                              setNovaSmartCalda({
                                ...novaSmartCalda,
                                tanqueSaida: {
                                  ...novaSmartCalda.tanqueSaida,
                                  capacidade: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                          />
                          <Input
                            placeholder="Porta do sensor de vazão"
                            value={novaSmartCalda.tanqueSaida.sensorVazao}
                            onChange={(e) =>
                              setNovaSmartCalda({
                                ...novaSmartCalda,
                                tanqueSaida: {
                                  ...novaSmartCalda.tanqueSaida,
                                  sensorVazao: e.target.value,
                                },
                              })
                            }
                          />
                          <Input
                            placeholder="Porta do sensor de nível"
                            value={novaSmartCalda.tanqueSaida.sensorNivel}
                            onChange={(e) =>
                              setNovaSmartCalda({
                                ...novaSmartCalda,
                                tanqueSaida: {
                                  ...novaSmartCalda.tanqueSaida,
                                  sensorNivel: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Tanque de Armazenamento</Label>
                        <div className="space-y-2">
                          <Input
                            placeholder="Nome"
                            value={novaSmartCalda.tanqueArmazenamento.nome}
                            onChange={(e) =>
                              setNovaSmartCalda({
                                ...novaSmartCalda,
                                tanqueArmazenamento: {
                                  ...novaSmartCalda.tanqueArmazenamento,
                                  nome: e.target.value,
                                },
                              })
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Capacidade (L)"
                            value={
                              novaSmartCalda.tanqueArmazenamento.capacidade ||
                              ""
                            }
                            onChange={(e) =>
                              setNovaSmartCalda({
                                ...novaSmartCalda,
                                tanqueArmazenamento: {
                                  ...novaSmartCalda.tanqueArmazenamento,
                                  capacidade: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                          />
                          <Input
                            placeholder="Porta do sensor de vazão"
                            value={
                              novaSmartCalda.tanqueArmazenamento.sensorVazao
                            }
                            onChange={(e) =>
                              setNovaSmartCalda({
                                ...novaSmartCalda,
                                tanqueArmazenamento: {
                                  ...novaSmartCalda.tanqueArmazenamento,
                                  sensorVazao: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={novaSmartCalda.observacoes}
                        onChange={(e) =>
                          setNovaSmartCalda({
                            ...novaSmartCalda,
                            observacoes: e.target.value,
                          })
                        }
                        placeholder="Informações adicionais..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="conexao" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="url">URL de Conexão *</Label>
                        <Input
                          id="url"
                          value={novaSmartCalda.url}
                          onChange={(e) =>
                            setNovaSmartCalda({
                              ...novaSmartCalda,
                              url: e.target.value,
                            })
                          }
                          placeholder="https://smartcalda-001.iagro.local:8080"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="token">Token de Acesso *</Label>
                        <Input
                          id="token"
                          type="password"
                          value={novaSmartCalda.token}
                          onChange={(e) =>
                            setNovaSmartCalda({
                              ...novaSmartCalda,
                              token: e.target.value,
                            })
                          }
                          placeholder="sk_abc123..."
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">
                          Configurações de Operação
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="intervalo">
                              Intervalo de Leitura (segundos)
                            </Label>
                            <Select
                              value={novaSmartCalda.configuracoes.intervaloLeitura.toString()}
                              onValueChange={(value) =>
                                setNovaSmartCalda({
                                  ...novaSmartCalda,
                                  configuracoes: {
                                    ...novaSmartCalda.configuracoes,
                                    intervaloLeitura: parseInt(value),
                                  },
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 segundos</SelectItem>
                                <SelectItem value="30">30 segundos</SelectItem>
                                <SelectItem value="60">1 minuto</SelectItem>
                                <SelectItem value="300">5 minutos</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="alertas">Alertas Automáticos</Label>
                            <Switch
                              id="alertas"
                              checked={
                                novaSmartCalda.configuracoes.alertasAtivos
                              }
                              onCheckedChange={(checked) =>
                                setNovaSmartCalda({
                                  ...novaSmartCalda,
                                  configuracoes: {
                                    ...novaSmartCalda.configuracoes,
                                    alertasAtivos: checked,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="backup">Backup Automático</Label>
                            <Switch
                              id="backup"
                              checked={
                                novaSmartCalda.configuracoes.backupAutomatico
                              }
                              onCheckedChange={(checked) =>
                                setNovaSmartCalda({
                                  ...novaSmartCalda,
                                  configuracoes: {
                                    ...novaSmartCalda.configuracoes,
                                    backupAutomatico: checked,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDialogAberto(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={
                      smartCaldaEditando
                        ? handleSalvarEdicao
                        : handleCriarSmartCalda
                    }
                  >
                    {smartCaldaEditando ? "Atualizar" : "Cadastrar"} Smart Calda
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pesquisa">Pesquisar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pesquisa"
                      placeholder="Nome, localização, usina ou série..."
                      value={termoPesquisa}
                      onChange={(e) => setTermoPesquisa(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="desativado">Desativado</SelectItem>
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
                      setFiltroStatus("todos");
                      toast({ title: "Filtros limpos!", variant: "default" });
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Server className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        smartCaldas.filter((sc) => sc.status !== "desativado")
                          .length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Smart Caldas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        smartCaldas.filter((sc) => sc.status === "online")
                          .length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <WifiOff className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        smartCaldas.filter((sc) => sc.status === "offline")
                          .length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Offline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-8 w-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">
                      {
                        smartCaldas.filter((sc) => sc.status === "manutencao")
                          .length
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Manutenção</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Smart Caldas */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Caldas Cadastradas</CardTitle>
              <CardDescription>
                {smartCaldasFiltradas.length === 0 && smartCaldas.length === 0
                  ? "Nenhuma Smart Calda cadastrada"
                  : `${smartCaldasFiltradas.length} Smart Calda(s) encontrada(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {smartCaldasFiltradas.length === 0 && smartCaldas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhuma Smart Calda cadastrada
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Identificação</TableHead>
                      <TableHead>N° Série</TableHead>
                      <TableHead>Data de Instalação</TableHead>
                      <TableHead>Qtd de IBCs</TableHead>
                      <TableHead>Qtd de Silos</TableHead>
                      <TableHead>Fracionados</TableHead>
                      <TableHead>Tanque Calda</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {smartCaldasFiltradas.map((smartCalda) => (
                      <TableRow key={smartCalda.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {smartCalda.identificacaoEquipamento ||
                                smartCalda.nome}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {smartCalda.usinaVinculada}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {smartCalda.numeroSerie}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(
                              smartCalda.dataInstalacao
                            ).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {smartCalda.ibcs.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {smartCalda.silos.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {smartCalda.fracionados.length}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {smartCalda.tanqueSaida.capacidade > 0 && (
                              <div>
                                Saída: {smartCalda.tanqueSaida.capacidade}L
                              </div>
                            )}
                            {smartCalda.tanqueArmazenamento.capacidade > 0 && (
                              <div>
                                Arm.:{" "}
                                {smartCalda.tanqueArmazenamento.capacidade}L
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(smartCalda.status)}
                            <Badge variant={getStatusBadge(smartCalda.status)}>
                              {smartCalda.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleVisualizarDetalhes(smartCalda)
                              }
                              title="Visualizar detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditarSmartCalda(smartCalda)}
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleVisualizarHistorico(smartCalda)
                              }
                              title="Histórico de manutenções"
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                  title="Remover"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar desativação
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja desativar esta Smart
                                    Calda? Ela não será mais exibida na lista
                                    principal, mas os dados serão mantidos no
                                    sistema.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleExcluirSmartCalda(smartCalda.id)
                                    }
                                  >
                                    Desativar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Dialog de Detalhes */}
          <Dialog open={dialogDetalhes} onOpenChange={setDialogDetalhes}>
            <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] 2xl:max-w-[50vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">
                  Detalhes da Smart Calda
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Visualização completa das configurações e capacidades
                </DialogDescription>
              </DialogHeader>

              {smartCaldaDetalhes && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-base">
                        Informações Básicas
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <strong className="min-w-[80px]">Nome:</strong>
                          <span className="break-words">
                            {smartCaldaDetalhes.nome}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <strong className="min-w-[80px]">Usina:</strong>
                          <span className="break-words">
                            {smartCaldaDetalhes.usinaVinculada}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <strong className="min-w-[80px]">Série:</strong>
                          <span className="font-mono break-all">
                            {smartCaldaDetalhes.numeroSerie}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <strong className="min-w-[80px]">Instalação:</strong>
                          <span>{smartCaldaDetalhes.dataInstalacao}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <strong className="min-w-[80px]">Localização:</strong>
                          <span className="break-words">
                            {smartCaldaDetalhes.localizacao}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-base">Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(smartCaldaDetalhes.status)}
                          <Badge
                            variant={getStatusBadge(smartCaldaDetalhes.status)}
                            className="text-xs"
                          >
                            {smartCaldaDetalhes.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <strong className="min-w-[100px]">
                            Última Conexão:
                          </strong>
                          <span className="break-words">
                            {smartCaldaDetalhes.ultimaConexao}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <strong className="min-w-[100px]">Firmware:</strong>
                          <span className="font-mono">
                            {smartCaldaDetalhes.versaoFirmware}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-base">
                      Capacidades dos Equipamentos
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {smartCaldaDetalhes.ibcs.length > 0 && (
                        <div className="p-3 border rounded-lg">
                          <h5 className="font-medium text-primary mb-2 text-sm">
                            IBCs ({smartCaldaDetalhes.ibcs.length})
                          </h5>
                          <div className="space-y-2">
                            {smartCaldaDetalhes.ibcs.map((ibc) => (
                              <div
                                key={ibc.id}
                                className="text-xs sm:text-sm bg-muted p-2 rounded break-words"
                              >
                                <strong>{ibc.nome}:</strong> {ibc.capacidade}L
                                <span className="block sm:inline sm:ml-1">
                                  (Vazão: {ibc.vazao})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {smartCaldaDetalhes.silos.length > 0 && (
                        <div className="p-3 border rounded-lg">
                          <h5 className="font-medium text-primary mb-2 text-sm">
                            Silos ({smartCaldaDetalhes.silos.length})
                          </h5>
                          <div className="space-y-2">
                            {smartCaldaDetalhes.silos.map((silo) => (
                              <div
                                key={silo.id}
                                className="text-xs sm:text-sm bg-muted p-2 rounded break-words"
                              >
                                <strong>{silo.nome}:</strong> {silo.capacidade}
                                kg
                                <span className="block sm:inline sm:ml-1">
                                  (Porta do sensor de peso: {silo.peso})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {smartCaldaDetalhes.fracionados.length > 0 && (
                        <div className="p-3 border rounded-lg">
                          <h5 className="font-medium text-primary mb-2 text-sm">
                            Fracionados ({smartCaldaDetalhes.fracionados.length}
                            )
                          </h5>
                          <div className="space-y-2">
                            {smartCaldaDetalhes.fracionados.map((frac) => (
                              <div
                                key={frac.id}
                                className="text-xs sm:text-sm bg-muted p-2 rounded break-words"
                              >
                                <strong>{frac.nome}:</strong> {frac.capacidade}
                                kg/L
                                <span className="block sm:inline sm:ml-1">
                                  (Porta do sensor de peso/vazão:{" "}
                                  {frac.pesoVazao})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {smartCaldaDetalhes.balancas.length > 0 && (
                        <div className="p-3 border rounded-lg">
                          <h5 className="font-medium text-primary mb-2 text-sm">
                            Balanças ({smartCaldaDetalhes.balancas.length})
                          </h5>
                          <div className="space-y-2">
                            {smartCaldaDetalhes.balancas.map((balanca) => (
                              <div
                                key={balanca.id}
                                className="text-xs sm:text-sm bg-muted p-2 rounded break-words"
                              >
                                <strong>{balanca.nome}:</strong> vinculada a{" "}
                                {balanca.vinculacao.join(", ")}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(smartCaldaDetalhes.tanqueSaida.capacidade > 0 ||
                        smartCaldaDetalhes.tanqueArmazenamento.capacidade >
                          0) && (
                        <div className="p-3 border rounded-lg lg:col-span-2">
                          <h5 className="font-medium text-primary mb-2 text-sm">
                            Tanques de Calda
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {smartCaldaDetalhes.tanqueSaida.capacidade > 0 && (
                              <div className="text-xs sm:text-sm bg-muted p-2 rounded">
                                <div className="font-medium">
                                  Saída - {smartCaldaDetalhes.tanqueSaida.nome}:
                                </div>
                                <div className="mt-1">
                                  {smartCaldaDetalhes.tanqueSaida.capacidade}L
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  <div>
                                    Vazão:{" "}
                                    {smartCaldaDetalhes.tanqueSaida.sensorVazao}
                                  </div>
                                  <div>
                                    Nível:{" "}
                                    {smartCaldaDetalhes.tanqueSaida.sensorNivel}
                                  </div>
                                </div>
                              </div>
                            )}
                            {smartCaldaDetalhes.tanqueArmazenamento.capacidade >
                              0 && (
                              <div className="text-xs sm:text-sm bg-muted p-2 rounded">
                                <div className="font-medium">
                                  Armazenamento -{" "}
                                  {smartCaldaDetalhes.tanqueArmazenamento.nome}:
                                </div>
                                <div className="mt-1">
                                  {
                                    smartCaldaDetalhes.tanqueArmazenamento
                                      .capacidade
                                  }
                                  L
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Vazão:{" "}
                                  {
                                    smartCaldaDetalhes.tanqueArmazenamento
                                      .sensorVazao
                                  }
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {smartCaldaDetalhes.observacoes && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-base">Observações</h4>
                      <p className="text-sm break-words bg-muted p-3 rounded-lg">
                        {smartCaldaDetalhes.observacoes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setDialogDetalhes(false)}
                  className="w-full sm:w-auto"
                >
                  Fechar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="manutencoes" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Manutenções</h2>
              <p className="text-muted-foreground">
                Gerencie as manutenções das Smart Caldas
              </p>
            </div>
            <Dialog
              open={dialogManutencao}
              onOpenChange={(open) => {
                setDialogManutencao(open);
                if (!open) resetarFormularioManutencao();
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Registrar Manutenção Manual
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {manutencaoEditando
                      ? "Editar Manutenção"
                      : "Registrar Manutenção Manual"}
                  </DialogTitle>
                  <DialogDescription>
                    {manutencaoEditando
                      ? "Complete as informações da manutenção pendente."
                      : "Registre uma nova manutenção manualmente."}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smartCalda">Smart Calda *</Label>
                    <Select
                      value={novaManutencao.smartCaldaId.toString()}
                      onValueChange={(value) => {
                        const smartCalda = smartCaldas.find(
                          (sc) => sc.id === parseInt(value)
                        );
                        setNovaManutencao({
                          ...novaManutencao,
                          smartCaldaId: parseInt(value),
                          identificacaoEquipamento:
                            smartCalda?.identificacaoEquipamento || "",
                          numeroSerie: smartCalda?.numeroSerie || "",
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a Smart Calda" />
                      </SelectTrigger>
                      <SelectContent>
                        {smartCaldas.map((sc) => (
                          <SelectItem key={sc.id} value={sc.id.toString()}>
                            {sc.identificacaoEquipamento || sc.nome} -{" "}
                            {sc.numeroSerie}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataManutencao">Data da Manutenção *</Label>
                    <Input
                      id="dataManutencao"
                      type="date"
                      value={novaManutencao.dataManutencao}
                      onChange={(e) =>
                        setNovaManutencao({
                          ...novaManutencao,
                          dataManutencao: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoManutencao">Tipo de Manutenção *</Label>
                    <Select
                      value={novaManutencao.tipoManutencao}
                      onValueChange={(value) =>
                        setNovaManutencao({
                          ...novaManutencao,
                          tipoManutencao: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposManutencao.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsavel">Responsável *</Label>
                    <Input
                      id="responsavel"
                      value={novaManutencao.responsavel}
                      onChange={(e) =>
                        setNovaManutencao({
                          ...novaManutencao,
                          responsavel: e.target.value,
                        })
                      }
                      placeholder="Nome do responsável pela manutenção"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resumo">Resumo da Manutenção *</Label>
                    <Textarea
                      id="resumo"
                      value={novaManutencao.resumo}
                      onChange={(e) =>
                        setNovaManutencao({
                          ...novaManutencao,
                          resumo: e.target.value,
                        })
                      }
                      placeholder="Descreva os procedimentos realizados..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Anexar Arquivos</Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          multiple
                          accept=".pdf,.zip,.doc,.docx,.txt"
                          onChange={handleSelecionarArquivos}
                          className="flex-1"
                        />
                        <div className="text-xs text-muted-foreground">
                          Máx: {CONFIG_ARQUIVO.TAMANHO_MAXIMO_MB}MB
                        </div>
                      </div>

                      {arquivosPreview.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Arquivos Selecionados ({arquivosPreview.length})
                          </Label>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {arquivosPreview.map((arquivo, index) => (
                              <div
                                key={arquivo.id}
                                className="flex items-center justify-between p-2 border rounded-lg bg-muted/50"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="text-sm">
                                    <div className="font-medium truncate">
                                      {arquivo.nome}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatarTamanhoArquivo(arquivo.tamanho)}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removerArquivo(index)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDialogManutencao(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={
                      manutencaoEditando
                        ? handleSalvarEdicaoManutencao
                        : handleCriarManutencao
                    }
                  >
                    {manutencaoEditando ? "Atualizar" : "Registrar"} Manutenção
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filtros para Manutenções */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros e Pesquisa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pesquisaManutencao">Pesquisar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pesquisaManutencao"
                      placeholder="Equipamento, série, responsável..."
                      value={termoPesquisa}
                      onChange={(e) => setTermoPesquisa(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select
                    value={filtroUnidade}
                    onValueChange={setFiltroUnidade}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as unidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas as unidades</SelectItem>
                      {usinas.map((usina) => (
                        <SelectItem key={usina.value} value={usina.value}>
                          {usina.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filtroStatusManutencao}
                    onValueChange={setFiltroStatusManutencao}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
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
                      setFiltroUnidade("todos");
                      setFiltroStatusManutencao("todos");
                      toast({ title: "Filtros limpos!", variant: "default" });
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Manutenções */}
          <Card>
            <CardHeader>
              <CardTitle>Manutenções Registradas</CardTitle>
              <CardDescription>
                {manutencoesFiltradas.length === 0 && manutencoes.length === 0
                  ? "Nenhuma manutenção registrada"
                  : `${manutencoesFiltradas.length} manutenção(ões) encontrada(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {manutencoesFiltradas.length === 0 && manutencoes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhuma manutenção registrada
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipamento</TableHead>
                      <TableHead>N° Série</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manutencoesFiltradas.map((manutencao) => (
                      <TableRow key={manutencao.id}>
                        <TableCell>
                          <div className="font-medium">
                            {manutencao.identificacaoEquipamento}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {manutencao.numeroSerie}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(
                              manutencao.dataManutencao
                            ).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {manutencao.tipoManutencao}
                          </Badge>
                        </TableCell>
                        <TableCell>{manutencao.responsavel || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeManutencao(
                              manutencao.status
                            )}
                          >
                            {manutencao.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleVisualizarDetalhesManutencao(manutencao)
                              }
                              title="Visualizar detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {manutencao.status === "pendente" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditarManutencao(manutencao)
                                }
                                title="Editar"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    ⚠️ Confirmar Exclusão
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Você está prestes a excluir uma manutenção.
                                    Essa ação é irreversível. Deseja realmente
                                    prosseguir?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleExcluirManutencao(manutencao.id)
                                    }
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Confirmar Exclusão
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de Detalhes da Manutenção */}
      <Dialog
        open={dialogDetalhesManutencao}
        onOpenChange={setDialogDetalhesManutencao}
      >
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Manutenção</DialogTitle>
            <DialogDescription>
              Informações completas da manutenção
            </DialogDescription>
          </DialogHeader>

          {manutencaoDetalhes && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Equipamento</h4>
                  <p className="text-sm">
                    {manutencaoDetalhes.identificacaoEquipamento}
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {manutencaoDetalhes.numeroSerie}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Data da Manutenção</h4>
                  <p className="text-sm">
                    {new Date(
                      manutencaoDetalhes.dataManutencao
                    ).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Tipo</h4>
                  <Badge variant="outline">
                    {manutencaoDetalhes.tipoManutencao}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <Badge
                    variant={getStatusBadgeManutencao(
                      manutencaoDetalhes.status
                    )}
                  >
                    {manutencaoDetalhes.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Responsável</h4>
                <p className="text-sm">
                  {manutencaoDetalhes.responsavel || "-"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Resumo da Manutenção</h4>
                <p className="text-sm bg-muted p-3 rounded-lg">
                  {manutencaoDetalhes.resumo}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Arquivos Anexados</h4>
                {manutencaoDetalhes.arquivos.length > 0 ? (
                  <div className="space-y-2">
                    {manutencaoDetalhes.arquivos.map((arquivo) => (
                      <div
                        key={arquivo.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-sm">
                            <div className="font-medium truncate">
                              {arquivo.nome}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatarTamanhoArquivo(arquivo.tamanho)} •{" "}
                              {arquivo.tipo}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Simular download do arquivo
                            const link = document.createElement("a");
                            link.href = arquivo.url;
                            link.download = arquivo.nome;
                            link.click();
                          }}
                        >
                          Baixar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Não há arquivos vinculados.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setDialogDetalhesManutencao(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Histórico de Manutenções */}
      <Dialog open={dialogHistorico} onOpenChange={setDialogHistorico}>
        <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Histórico de Manutenções</DialogTitle>
            <DialogDescription>
              Histórico completo de manutenções da Smart Calda
            </DialogDescription>
          </DialogHeader>

          {smartCaldaHistorico && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium">
                  {smartCaldaHistorico.identificacaoEquipamento ||
                    smartCaldaHistorico.nome}
                </h4>
                <p className="text-sm text-muted-foreground font-mono">
                  {smartCaldaHistorico.numeroSerie}
                </p>
              </div>

              <div className="space-y-2">
                {getManutencoesPorSmartCalda(smartCaldaHistorico.id).map(
                  (manutencao) => (
                    <div key={manutencao.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {manutencao.tipoManutencao}
                          </Badge>
                          <Badge
                            variant={getStatusBadgeManutencao(
                              manutencao.status
                            )}
                          >
                            {manutencao.status}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setManutencaoDetalhes(manutencao);
                            setDialogDetalhesManutencao(true);
                            setDialogHistorico(false);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Data:</strong>{" "}
                          {new Date(
                            manutencao.dataManutencao
                          ).toLocaleDateString("pt-BR")}
                        </div>
                        <div>
                          <strong>Responsável:</strong>{" "}
                          {manutencao.responsavel || "-"}
                        </div>
                      </div>
                      <div className="mt-2">
                        <strong>Resumo:</strong>
                        <p className="text-sm text-muted-foreground mt-1">
                          {manutencao.resumo}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setDialogHistorico(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestaoSmartCaldas;
