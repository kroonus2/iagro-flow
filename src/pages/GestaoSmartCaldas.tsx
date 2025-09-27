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
      sensorNivel: "nivel_saida_1" 
    },
    tanqueArmazenamento: { 
      nome: "ARM-001", 
      capacidade: 2000, 
      sensorVazao: "vazao_arm_1" 
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
      sensorNivel: "nivel_saida_2" 
    },
    tanqueArmazenamento: { 
      nome: "ARM-002", 
      capacidade: 1500, 
      sensorVazao: "vazao_arm_2" 
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
      sensorNivel: "nivel_saida_3" 
    },
    tanqueArmazenamento: { 
      nome: "ARM-003", 
      capacidade: 3000, 
      sensorVazao: "vazao_arm_3" 
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

const GestaoSmartCaldas = () => {
  const { toast } = useToast();
  const [smartCaldas, setSmartCaldas] = useState<SmartCalda[]>(mockSmartCaldas);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [dialogDetalhes, setDialogDetalhes] = useState(false);
  const [smartCaldaEditando, setSmartCaldaEditando] =
    useState<SmartCalda | null>(null);
  const [smartCaldaDetalhes, setSmartCaldaDetalhes] =
    useState<SmartCalda | null>(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [testConnectionId, setTestConnectionId] = useState<number | null>(null);

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
    setSmartCaldaEditando(null);
  };

  // Funções para gerenciar IBCs
  const adicionarIBC = () => {
    const novoId = Math.max(0, ...novaSmartCalda.ibcs.map((ibc) => ibc.id)) + 1;
    setNovaSmartCalda({
      ...novaSmartCalda,
      ibcs: [...novaSmartCalda.ibcs, { id: novoId, nome: "", capacidade: 0, vazao: "" }],
    });
  };

  const removerIBC = (id: number) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      ibcs: novaSmartCalda.ibcs.filter((ibc) => ibc.id !== id),
    });
  };

  const atualizarIBC = (id: number, field: keyof IBC, value: string | number) => {
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

  const atualizarSilo = (id: number, field: keyof Silo, value: string | number) => {
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

  const atualizarFracionado = (id: number, field: keyof Fracionado, value: string | number) => {
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

  const atualizarBalanca = (id: number, field: keyof Balanca, value: string | string[]) => {
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
    novaSmartCalda.silos.forEach(silo => {
      if (silo.nome) opcoes.push(silo.nome);
    });
    novaSmartCalda.fracionados.forEach(frac => {
      if (frac.nome) opcoes.push(frac.nome);
    });
    return opcoes;
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
                Configure os parâmetros de conexão e operação da Smart Calda.
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
                    <Label htmlFor="dataInstalacao">Data da Instalação *</Label>
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
                    <div key={ibc.id} className="space-y-2 p-3 border rounded">
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
                            atualizarIBC(ibc.id, "capacidade", parseInt(e.target.value) || 0)
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Vazão (CLP)"
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
                    <div key={frac.id} className="space-y-2 p-3 border rounded">
                      <div className="flex gap-2 items-center">
                        <Label className="min-w-16">Nome:</Label>
                        <Input
                          placeholder="Ex: FRAC-001"
                          value={frac.nome}
                          onChange={(e) =>
                            atualizarFracionado(frac.id, "nome", e.target.value)
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
                            atualizarFracionado(frac.id, "capacidade", parseInt(e.target.value) || 0)
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Peso/Vazão (CLP)"
                          value={frac.pesoVazao}
                          onChange={(e) =>
                            atualizarFracionado(frac.id, "pesoVazao", e.target.value)
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
                    <div key={silo.id} className="space-y-2 p-3 border rounded">
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
                            atualizarSilo(silo.id, "capacidade", parseInt(e.target.value) || 0)
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Peso (CLP)"
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
                      Adicione silos ou fracionados primeiro para criar balanças
                    </p>
                  )}
                  {novaSmartCalda.balancas.map((balanca) => (
                    <div key={balanca.id} className="space-y-2 p-3 border rounded">
                      <div className="flex gap-2 items-center">
                        <Label className="min-w-16">Nome:</Label>
                        <Input
                          placeholder="Ex: BAL-001"
                          value={balanca.nome}
                          onChange={(e) =>
                            atualizarBalanca(balanca.id, "nome", e.target.value)
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
                        <Label className="text-sm">Vinculação aos silos/fracionados:</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {getOpcoesVinculacao().map((opcao) => (
                            <label key={opcao} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={balanca.vinculacao.includes(opcao)}
                                onChange={(e) => {
                                  const novasVinculacoes = e.target.checked
                                    ? [...balanca.vinculacao, opcao]
                                    : balanca.vinculacao.filter(v => v !== opcao);
                                  atualizarBalanca(balanca.id, "vinculacao", novasVinculacoes);
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
                        placeholder="Sensor de Vazão (CLP)"
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
                        placeholder="Sensor de Nível"
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
                        value={novaSmartCalda.tanqueArmazenamento.capacidade || ""}
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
                        placeholder="Sensor de Vazão (CLP)"
                        value={novaSmartCalda.tanqueArmazenamento.sensorVazao}
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
                          checked={novaSmartCalda.configuracoes.alertasAtivos}
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
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
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
                  {smartCaldas.filter((sc) => sc.status === "online").length}
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
                  {smartCaldas.filter((sc) => sc.status === "offline").length}
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
                  <TableHead>Usina</TableHead>
                  <TableHead>Número de Série</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Conexão</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {smartCaldasFiltradas.map((smartCalda) => (
                  <TableRow key={smartCalda.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{smartCalda.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {smartCalda.versaoFirmware}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{smartCalda.usinaVinculada}</TableCell>
                    <TableCell>{smartCalda.numeroSerie}</TableCell>
                    <TableCell>{smartCalda.localizacao}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(smartCalda.status)}
                        <Badge variant={getStatusBadge(smartCalda.status)}>
                          {smartCalda.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{smartCalda.ultimaConexao}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVisualizarDetalhes(smartCalda)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditarSmartCalda(smartCalda)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
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
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Smart Calda</DialogTitle>
            <DialogDescription>
              Visualização completa das configurações e capacidades
            </DialogDescription>
          </DialogHeader>

          {smartCaldaDetalhes && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Informações Básicas</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Nome:</strong> {smartCaldaDetalhes.nome}
                    </p>
                    <p>
                      <strong>Usina:</strong>{" "}
                      {smartCaldaDetalhes.usinaVinculada}
                    </p>
                    <p>
                      <strong>Série:</strong> {smartCaldaDetalhes.numeroSerie}
                    </p>
                    <p>
                      <strong>Instalação:</strong>{" "}
                      {smartCaldaDetalhes.dataInstalacao}
                    </p>
                    <p>
                      <strong>Localização:</strong>{" "}
                      {smartCaldaDetalhes.localizacao}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(smartCaldaDetalhes.status)}
                      <Badge
                        variant={getStatusBadge(smartCaldaDetalhes.status)}
                      >
                        {smartCaldaDetalhes.status}
                      </Badge>
                    </div>
                    <p>
                      <strong>Última Conexão:</strong>{" "}
                      {smartCaldaDetalhes.ultimaConexao}
                    </p>
                    <p>
                      <strong>Firmware:</strong>{" "}
                      {smartCaldaDetalhes.versaoFirmware}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">
                  Capacidades dos Equipamentos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {smartCaldaDetalhes.ibcs.length > 0 && (
                    <div>
                      <p className="font-medium">IBCs:</p>
                      {smartCaldaDetalhes.ibcs.map((ibc) => (
                        <p key={ibc.id}>
                          IBC {ibc.id}: {ibc.capacidade}L
                        </p>
                      ))}
                    </div>
                  )}

                  {smartCaldaDetalhes.silos.length > 0 && (
                    <div>
                      <p className="font-medium">Silos:</p>
                      {smartCaldaDetalhes.silos.map((silo) => (
                        <p key={silo.id}>
                          {silo.nome}: {silo.capacidade}kg (CLP: {silo.peso})
                        </p>
                      ))}
                    </div>
                  )}

                  {smartCaldaDetalhes.fracionados.length > 0 && (
                    <div>
                      <p className="font-medium">Fracionados:</p>
                      {smartCaldaDetalhes.fracionados.map((frac) => (
                        <p key={frac.id}>
                          {frac.nome}: {frac.capacidade}kg/L (CLP: {frac.pesoVazao})
                        </p>
                      ))}
                    </div>
                  )}

                  {smartCaldaDetalhes.balancas.length > 0 && (
                    <div>
                      <p className="font-medium">Balanças:</p>
                      {smartCaldaDetalhes.balancas.map((balanca) => (
                        <p key={balanca.id}>
                          {balanca.nome}: vinculada a {balanca.vinculacao.join(", ")}
                        </p>
                      ))}
                    </div>
                  )}

                  <div>
                    <p className="font-medium">Tanques:</p>
                    {smartCaldaDetalhes.tanqueSaida.capacidade > 0 && (
                      <p>
                        Saída {smartCaldaDetalhes.tanqueSaida.nome}:{" "}
                        {smartCaldaDetalhes.tanqueSaida.capacidade}L
                      </p>
                    )}
                    {smartCaldaDetalhes.tanqueArmazenamento.capacidade > 0 && (
                      <p>
                        Armazenamento {smartCaldaDetalhes.tanqueArmazenamento.nome}:{" "}
                        {smartCaldaDetalhes.tanqueArmazenamento.capacidade}L
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {smartCaldaDetalhes.observacoes && (
                <div>
                  <h4 className="font-medium mb-2">Observações</h4>
                  <p className="text-sm">{smartCaldaDetalhes.observacoes}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setDialogDetalhes(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestaoSmartCaldas;
