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
  Settings,
  Key,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data para demonstração
const mockSmartCaldas = [
  {
    id: 1,
    nome: "Smart Calda #001",
    localizacao: "Estufa A - Setor 1",
    url: "https://smartcalda-001.iagro.local:8080",
    token: "sk_abc123...",
    status: "online",
    ultimaConexao: "2024-01-15 14:30",
    versaoFirmware: "v2.1.3",
    capacidade: "500L",
    tipo: "automatica",
    configuracoes: {
      intervaloLeitura: 30,
      alertasAtivos: true,
      backupAutomatico: true,
    },
  },
  {
    id: 2,
    nome: "Smart Calda #002",
    localizacao: "Estufa B - Setor 2",
    url: "https://smartcalda-002.iagro.local:8080",
    token: "sk_def456...",
    status: "offline",
    ultimaConexao: "2024-01-14 16:45",
    versaoFirmware: "v2.0.8",
    capacidade: "300L",
    tipo: "manual",
    configuracoes: {
      intervaloLeitura: 60,
      alertasAtivos: false,
      backupAutomatico: true,
    },
  },
  {
    id: 3,
    nome: "Smart Calda #003",
    localizacao: "Estufa C - Setor 1",
    url: "https://smartcalda-003.iagro.local:8080",
    token: "sk_ghi789...",
    status: "manutencao",
    ultimaConexao: "2024-01-13 09:15",
    versaoFirmware: "v2.1.1",
    capacidade: "750L",
    tipo: "automatica",
    configuracoes: {
      intervaloLeitura: 15,
      alertasAtivos: true,
      backupAutomatico: false,
    },
  },
];

const tiposSmartCalda = [
  { value: "automatica", label: "Automática" },
  { value: "manual", label: "Manual" },
  { value: "hibrida", label: "Híbrida" },
];

const GestaoSmartCaldas = () => {
  const { toast } = useToast();
  const [smartCaldas, setSmartCaldas] = useState(mockSmartCaldas);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [smartCaldaEditando, setSmartCaldaEditando] = useState<any>(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [testConnectionId, setTestConnectionId] = useState<number | null>(null);

  const [novaSmartCalda, setNovaSmartCalda] = useState({
    nome: "",
    localizacao: "",
    url: "",
    token: "",
    tipo: "",
    capacidade: "",
    observacoes: "",
    configuracoes: {
      intervaloLeitura: 30,
      alertasAtivos: true,
      backupAutomatico: true,
    },
  });

  const smartCaldasFiltradas = smartCaldas.filter((sc) => {
    const matchPesquisa =
      sc.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      sc.localizacao.toLowerCase().includes(termoPesquisa.toLowerCase());
    const matchStatus = filtroStatus === "todos" || sc.status === filtroStatus;

    return matchPesquisa && matchStatus;
  });

  const handleCriarSmartCalda = () => {
    const smartCalda = {
      id: smartCaldas.length + 1,
      ...novaSmartCalda,
      status: "offline",
      ultimaConexao: "Nunca",
      versaoFirmware: "v2.1.3",
    };
    setSmartCaldas([...smartCaldas, smartCalda]);
    setNovaSmartCalda({
      nome: "",
      localizacao: "",
      url: "",
      token: "",
      tipo: "",
      capacidade: "",
      observacoes: "",
      configuracoes: {
        intervaloLeitura: 30,
        alertasAtivos: true,
        backupAutomatico: true,
      },
    });
    setDialogAberto(false);
    toast({ title: "Smart Calda cadastrada com sucesso!", variant: "default" });
  };

  const handleEditarSmartCalda = (smartCalda: any) => {
    setSmartCaldaEditando(smartCalda);
    setNovaSmartCalda(smartCalda);
    setDialogAberto(true);
  };

  const handleExcluirSmartCalda = (id: number) => {
    setSmartCaldas(smartCaldas.filter((sc) => sc.id !== id));
    toast({ title: "Smart Calda removida com sucesso!", variant: "default" });
  };

  const handleTestarConexao = async (id: number) => {
    setTestConnectionId(id);
    // Simular teste de conexão
    setTimeout(() => {
      const sucesso = Math.random() > 0.3; // 70% de chance de sucesso
      setTestConnectionId(null);

      if (sucesso) {
        toast({
          title: "Conexão estabelecida com sucesso!",
          description: "Smart Calda está respondendo normalmente.",
          variant: "default",
        });
        // Atualizar status para online
        setSmartCaldas((prev) =>
          prev.map((sc) =>
            sc.id === id
              ? {
                  ...sc,
                  status: "online",
                  ultimaConexao: new Date().toLocaleString("pt-BR"),
                }
              : sc
          )
        );
      } else {
        toast({
          title: "Falha na conexão",
          description: "Verifique URL e token de acesso.",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: "default",
      offline: "secondary",
      manutencao: "destructive",
      erro: "destructive",
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

  const getTipoLabel = (tipo: string) => {
    const tipoObj = tiposSmartCalda.find((t) => t.value === tipo);
    return tipoObj ? tipoObj.label : tipo;
  };

  const resetarFormulario = () => {
    setNovaSmartCalda({
      nome: "",
      localizacao: "",
      url: "",
      token: "",
      tipo: "",
      capacidade: "",
      observacoes: "",
      configuracoes: {
        intervaloLeitura: 30,
        alertasAtivos: true,
        backupAutomatico: true,
      },
    });
    setSmartCaldaEditando(null);
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
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
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
                    <Label htmlFor="nome">Nome/Identificação</Label>
                    <Input
                      id="nome"
                      value={novaSmartCalda.nome}
                      onChange={(e) =>
                        setNovaSmartCalda({
                          ...novaSmartCalda,
                          nome: e.target.value,
                        })
                      }
                      placeholder="Smart Calda #001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input
                      id="localizacao"
                      value={novaSmartCalda.localizacao}
                      onChange={(e) =>
                        setNovaSmartCalda({
                          ...novaSmartCalda,
                          localizacao: e.target.value,
                        })
                      }
                      placeholder="Estufa A - Setor 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Operação</Label>
                    <Select
                      value={novaSmartCalda.tipo}
                      onValueChange={(value) =>
                        setNovaSmartCalda({ ...novaSmartCalda, tipo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposSmartCalda.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacidade">Capacidade</Label>
                    <Input
                      id="capacidade"
                      value={novaSmartCalda.capacidade}
                      onChange={(e) =>
                        setNovaSmartCalda({
                          ...novaSmartCalda,
                          capacidade: e.target.value,
                        })
                      }
                      placeholder="500L"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
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
                </div>
              </TabsContent>

              <TabsContent value="conexao" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">URL de Conexão</Label>
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
                    <Label htmlFor="token">Token de Acesso</Label>
                    <div className="flex gap-2">
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
                      <Button variant="outline" size="icon">
                        <Key className="h-4 w-4" />
                      </Button>
                    </div>
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
              <Button onClick={handleCriarSmartCalda}>
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
                  placeholder="Nome ou localização..."
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
                <p className="text-2xl font-bold">{smartCaldas.length}</p>
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
            {smartCaldasFiltradas.length} Smart Calda(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Identificação</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Tipo</TableHead>
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
                        {smartCalda.capacidade} • {smartCalda.versaoFirmware}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{smartCalda.localizacao}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTipoLabel(smartCalda.tipo)}
                    </Badge>
                  </TableCell>
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
                        onClick={() => handleTestarConexao(smartCalda.id)}
                        disabled={testConnectionId === smartCalda.id}
                      >
                        <Wifi className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditarSmartCalda(smartCalda)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleExcluirSmartCalda(smartCalda.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestaoSmartCaldas;
