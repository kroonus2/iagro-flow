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
  capacidade: number;
}

interface Silo {
  id: number;
  capacidade: number;
  balancas: number;
}

interface Tanque {
  id: string;
  capacidade: number;
}

interface SmartCalda {
  id: number;
  nome: string;
  usinaVinculada: string;
  numeroSerie: string;
  dataInstalacao: string;
  geoLocalizacao: string;
  identificacaoEquipamento: string;
  localizacao: string;
  ibcs: IBC[];
  fracionado: { ativo: boolean; quantidade: number; capacidade: number };
  silos: Silo[];
  tanqueCalda: Tanque;
  tanqueArmazenamento: Tanque;
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
    geoLocalizacao: "-23.5505, -46.6333",
    identificacaoEquipamento: "Caldas automática para defensivos agrícolas",
    localizacao: "Estufa A - Setor 1",
    ibcs: [
      { id: 1, capacidade: 300 },
      { id: 2, capacidade: 250 }
    ],
    fracionado: { ativo: true, quantidade: 2, capacidade: 100 },
    silos: [
      { id: 1, capacidade: 500, balancas: 1 },
      { id: 2, capacidade: 300, balancas: 2 }
    ],
    tanqueCalda: { id: "TC-001", capacidade: 1000 },
    tanqueArmazenamento: { id: "TA-001", capacidade: 2000 },
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
    geoLocalizacao: "-22.9068, -43.1729",
    identificacaoEquipamento: "Caldas manual com controle semi-automático",
    localizacao: "Estufa B - Setor 2",
    ibcs: [
      { id: 1, capacidade: 200 }
    ],
    fracionado: { ativo: false, quantidade: 0, capacidade: 0 },
    silos: [
      { id: 1, capacidade: 400, balancas: 1 }
    ],
    tanqueCalda: { id: "TC-002", capacidade: 800 },
    tanqueArmazenamento: { id: "TA-002", capacidade: 1500 },
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
    geoLocalizacao: "-20.4697, -54.6201",
    identificacaoEquipamento: "Caldas automática de alta capacidade",
    localizacao: "Estufa C - Setor 1",
    ibcs: [
      { id: 1, capacidade: 400 },
      { id: 2, capacidade: 350 },
      { id: 3, capacidade: 300 }
    ],
    fracionado: { ativo: true, quantidade: 4, capacidade: 50 },
    silos: [
      { id: 1, capacidade: 600, balancas: 2 },
      { id: 2, capacidade: 500, balancas: 1 }
    ],
    tanqueCalda: { id: "TC-003", capacidade: 1500 },
    tanqueArmazenamento: { id: "TA-003", capacidade: 3000 },
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
  const [smartCaldaEditando, setSmartCaldaEditando] = useState<SmartCalda | null>(null);
  const [smartCaldaDetalhes, setSmartCaldaDetalhes] = useState<SmartCalda | null>(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [testConnectionId, setTestConnectionId] = useState<number | null>(null);

  const [novaSmartCalda, setNovaSmartCalda] = useState<Omit<SmartCalda, 'id' | 'status' | 'ultimaConexao' | 'versaoFirmware'>>({
    nome: "",
    usinaVinculada: "",
    numeroSerie: "",
    dataInstalacao: "",
    geoLocalizacao: "",
    identificacaoEquipamento: "",
    localizacao: "",
    ibcs: [],
    fracionado: { ativo: false, quantidade: 0, capacidade: 0 },
    silos: [],
    tanqueCalda: { id: "", capacidade: 0 },
    tanqueArmazenamento: { id: "", capacidade: 0 },
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
      { campo: novaSmartCalda.geoLocalizacao, nome: "Geo Localização" },
      { campo: novaSmartCalda.url, nome: "URL de Conexão" },
      { campo: novaSmartCalda.token, nome: "Token de Acesso" },
    ];

    const camposFaltantes = camposObrigatorios.filter(item => !item.campo?.trim()).map(item => item.nome);

    if (camposFaltantes.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Preencha os seguintes campos: ${camposFaltantes.join(", ")}`,
        variant: "destructive"
      });
      return false;
    }

    // Verificar se pelo menos um tipo de capacidade foi informado
    const temIBCs = novaSmartCalda.ibcs.length > 0;
    const temSilos = novaSmartCalda.silos.length > 0;
    const temTanques = novaSmartCalda.tanqueCalda.capacidade > 0 || novaSmartCalda.tanqueArmazenamento.capacidade > 0;

    if (!temIBCs && !temSilos && !temTanques) {
      toast({
        title: "Configurações de capacidade obrigatórias",
        description: "É necessário informar as configurações de capacidade (IBCs, silos ou tanques) desta Smart Calda.",
        variant: "destructive"
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
      geoLocalizacao: smartCalda.geoLocalizacao,
      identificacaoEquipamento: smartCalda.identificacaoEquipamento,
      localizacao: smartCalda.localizacao,
      ibcs: [...smartCalda.ibcs],
      fracionado: { ...smartCalda.fracionado },
      silos: [...smartCalda.silos],
      tanqueCalda: { ...smartCalda.tanqueCalda },
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

    setSmartCaldas(smartCaldas.map(sc => 
      sc.id === smartCaldaEditando?.id 
        ? { ...smartCaldaEditando, ...novaSmartCalda }
        : sc
    ));
    resetarFormulario();
    setDialogAberto(false);
    toast({ title: "Smart Calda atualizada com sucesso!", variant: "default" });
  };

  const handleExcluirSmartCalda = (id: number) => {
    setSmartCaldas(smartCaldas.map(sc => 
      sc.id === id ? { ...sc, status: "desativado" } : sc
    ));
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
      geoLocalizacao: "",
      identificacaoEquipamento: "",
      localizacao: "",
      ibcs: [],
      fracionado: { ativo: false, quantidade: 0, capacidade: 0 },
      silos: [],
      tanqueCalda: { id: "", capacidade: 0 },
      tanqueArmazenamento: { id: "", capacidade: 0 },
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
    const novoId = Math.max(0, ...novaSmartCalda.ibcs.map(ibc => ibc.id)) + 1;
    setNovaSmartCalda({
      ...novaSmartCalda,
      ibcs: [...novaSmartCalda.ibcs, { id: novoId, capacidade: 0 }]
    });
  };

  const removerIBC = (id: number) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      ibcs: novaSmartCalda.ibcs.filter(ibc => ibc.id !== id)
    });
  };

  const atualizarIBC = (id: number, capacidade: number) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      ibcs: novaSmartCalda.ibcs.map(ibc => 
        ibc.id === id ? { ...ibc, capacidade } : ibc
      )
    });
  };

  // Funções para gerenciar Silos
  const adicionarSilo = () => {
    const novoId = Math.max(0, ...novaSmartCalda.silos.map(silo => silo.id)) + 1;
    setNovaSmartCalda({
      ...novaSmartCalda,
      silos: [...novaSmartCalda.silos, { id: novoId, capacidade: 0, balancas: 1 }]
    });
  };

  const removerSilo = (id: number) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      silos: novaSmartCalda.silos.filter(silo => silo.id !== id)
    });
  };

  const atualizarSilo = (id: number, field: keyof Silo, value: number) => {
    setNovaSmartCalda({
      ...novaSmartCalda,
      silos: novaSmartCalda.silos.map(silo => 
        silo.id === id ? { ...silo, [field]: value } : silo
      )
    });
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
                        setNovaSmartCalda({ ...novaSmartCalda, usinaVinculada: value })
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
                        setNovaSmartCalda({ ...novaSmartCalda, numeroSerie: e.target.value })
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
                        setNovaSmartCalda({ ...novaSmartCalda, dataInstalacao: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="geoLocalizacao">Geo Localização *</Label>
                    <Input
                      id="geoLocalizacao"
                      value={novaSmartCalda.geoLocalizacao}
                      onChange={(e) =>
                        setNovaSmartCalda({ ...novaSmartCalda, geoLocalizacao: e.target.value })
                      }
                      placeholder="-23.5505, -46.6333"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="identificacaoEquipamento">Características do Equipamento</Label>
                    <Textarea
                      id="identificacaoEquipamento"
                      value={novaSmartCalda.identificacaoEquipamento}
                      onChange={(e) =>
                        setNovaSmartCalda({ ...novaSmartCalda, identificacaoEquipamento: e.target.value })
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
                    <Button type="button" onClick={adicionarIBC} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar IBC
                    </Button>
                  </div>
                  {novaSmartCalda.ibcs.map((ibc) => (
                    <div key={ibc.id} className="flex gap-2 items-center">
                      <Label>IBC {ibc.id}:</Label>
                      <Input
                        type="number"
                        placeholder="Capacidade (L)"
                        value={ibc.capacidade || ''}
                        onChange={(e) => atualizarIBC(ibc.id, parseInt(e.target.value) || 0)}
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
                  ))}
                </div>

                {/* Fracionado */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={novaSmartCalda.fracionado.ativo}
                      onCheckedChange={(checked) =>
                        setNovaSmartCalda({
                          ...novaSmartCalda,
                          fracionado: { ...novaSmartCalda.fracionado, ativo: checked }
                        })
                      }
                    />
                    <Label>Fracionado</Label>
                  </div>
                  {novaSmartCalda.fracionado.ativo && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          value={novaSmartCalda.fracionado.quantidade || ''}
                          onChange={(e) =>
                            setNovaSmartCalda({
                              ...novaSmartCalda,
                              fracionado: { ...novaSmartCalda.fracionado, quantidade: parseInt(e.target.value) || 0 }
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Capacidade (L)</Label>
                        <Input
                          type="number"
                          value={novaSmartCalda.fracionado.capacidade || ''}
                          onChange={(e) =>
                            setNovaSmartCalda({
                              ...novaSmartCalda,
                              fracionado: { ...novaSmartCalda.fracionado, capacidade: parseInt(e.target.value) || 0 }
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Silos */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Silos e suas capacidades</Label>
                    <Button type="button" onClick={adicionarSilo} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Silo
                    </Button>
                  </div>
                  {novaSmartCalda.silos.map((silo) => (
                    <div key={silo.id} className="flex gap-2 items-center">
                      <Label>Silo {silo.id}:</Label>
                      <Input
                        type="number"
                        placeholder="Capacidade (kg)"
                        value={silo.capacidade || ''}
                        onChange={(e) => atualizarSilo(silo.id, 'capacidade', parseInt(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Balanças"
                        value={silo.balancas || ''}
                        onChange={(e) => atualizarSilo(silo.id, 'balancas', parseInt(e.target.value) || 0)}
                        className="w-24"
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
                  ))}
                </div>

                {/* Tanques */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tanque de Calda Pronta</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="ID"
                        value={novaSmartCalda.tanqueCalda.id}
                        onChange={(e) =>
                          setNovaSmartCalda({
                            ...novaSmartCalda,
                            tanqueCalda: { ...novaSmartCalda.tanqueCalda, id: e.target.value }
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Capacidade (L)"
                        value={novaSmartCalda.tanqueCalda.capacidade || ''}
                        onChange={(e) =>
                          setNovaSmartCalda({
                            ...novaSmartCalda,
                            tanqueCalda: { ...novaSmartCalda.tanqueCalda, capacidade: parseInt(e.target.value) || 0 }
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tanque de Armazenamento</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="ID"
                        value={novaSmartCalda.tanqueArmazenamento.id}
                        onChange={(e) =>
                          setNovaSmartCalda({
                            ...novaSmartCalda,
                            tanqueArmazenamento: { ...novaSmartCalda.tanqueArmazenamento, id: e.target.value }
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Capacidade (L)"
                        value={novaSmartCalda.tanqueArmazenamento.capacidade || ''}
                        onChange={(e) =>
                          setNovaSmartCalda({
                            ...novaSmartCalda,
                            tanqueArmazenamento: { ...novaSmartCalda.tanqueArmazenamento, capacidade: parseInt(e.target.value) || 0 }
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
                      setNovaSmartCalda({ ...novaSmartCalda, observacoes: e.target.value })
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
                        setNovaSmartCalda({ ...novaSmartCalda, url: e.target.value })
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
                        setNovaSmartCalda({ ...novaSmartCalda, token: e.target.value })
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
                          checked={novaSmartCalda.configuracoes.backupAutomatico}
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
              <Button onClick={smartCaldaEditando ? handleSalvarEdicao : handleCriarSmartCalda}>
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
                <p className="text-2xl font-bold">{smartCaldas.filter(sc => sc.status !== "desativado").length}</p>
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
              : `${smartCaldasFiltradas.length} Smart Calda(s) encontrada(s)`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {smartCaldasFiltradas.length === 0 && smartCaldas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma Smart Calda cadastrada</p>
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
                              <AlertDialogTitle>Confirmar desativação</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja desativar esta Smart Calda? Ela não será mais exibida na lista principal, mas os dados serão mantidos no sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleExcluirSmartCalda(smartCalda.id)}>
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
                    <p><strong>Nome:</strong> {smartCaldaDetalhes.nome}</p>
                    <p><strong>Usina:</strong> {smartCaldaDetalhes.usinaVinculada}</p>
                    <p><strong>Série:</strong> {smartCaldaDetalhes.numeroSerie}</p>
                    <p><strong>Instalação:</strong> {smartCaldaDetalhes.dataInstalacao}</p>
                    <p><strong>Localização:</strong> {smartCaldaDetalhes.localizacao}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(smartCaldaDetalhes.status)}
                      <Badge variant={getStatusBadge(smartCaldaDetalhes.status)}>
                        {smartCaldaDetalhes.status}
                      </Badge>
                    </div>
                    <p><strong>Última Conexão:</strong> {smartCaldaDetalhes.ultimaConexao}</p>
                    <p><strong>Firmware:</strong> {smartCaldaDetalhes.versaoFirmware}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Capacidades dos Equipamentos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {smartCaldaDetalhes.ibcs.length > 0 && (
                    <div>
                      <p className="font-medium">IBCs:</p>
                      {smartCaldaDetalhes.ibcs.map((ibc) => (
                        <p key={ibc.id}>IBC {ibc.id}: {ibc.capacidade}L</p>
                      ))}
                    </div>
                  )}
                  
                  {smartCaldaDetalhes.silos.length > 0 && (
                    <div>
                      <p className="font-medium">Silos:</p>
                      {smartCaldaDetalhes.silos.map((silo) => (
                        <p key={silo.id}>Silo {silo.id}: {silo.capacidade}kg ({silo.balancas} balanças)</p>
                      ))}
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium">Tanques:</p>
                    {smartCaldaDetalhes.tanqueCalda.capacidade > 0 && (
                      <p>Calda {smartCaldaDetalhes.tanqueCalda.id}: {smartCaldaDetalhes.tanqueCalda.capacidade}L</p>
                    )}
                    {smartCaldaDetalhes.tanqueArmazenamento.capacidade > 0 && (
                      <p>Armazenamento {smartCaldaDetalhes.tanqueArmazenamento.id}: {smartCaldaDetalhes.tanqueArmazenamento.capacidade}L</p>
                    )}
                  </div>
                </div>
              </div>

              {smartCaldaDetalhes.fracionado.ativo && (
                <div>
                  <h4 className="font-medium mb-2">Fracionado</h4>
                  <p className="text-sm">
                    {smartCaldaDetalhes.fracionado.quantidade} unidades de {smartCaldaDetalhes.fracionado.capacidade}L cada
                  </p>
                </div>
              )}

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