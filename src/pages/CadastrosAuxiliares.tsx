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
  MoreVertical,
  Search,
  Filter,
  Building2,
  Truck,
  User,
  Settings,
  DollarSign,
  Users,
  Activity,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Interfaces
interface Localizacao {
  id: string;
  codigo: string;
  descricao: string;
  tipo_estoque: string;
  capacidade: string;
}

interface Caminhao {
  id: string;
  placa: string;
  patrimonio: string;
  volume: string;
  modelo: string;
  marca: string;
  ano: string;
}

interface Motorista {
  id: string;
  codigo: string;
  matricula: string;
  nome: string;
  contato: string;
}

interface Operacao {
  id: string;
  codigo: string;
  descricao: string;
}

interface CentroCusto {
  id: string;
  codigo: string;
  descricao: string;
}

interface Responsavel {
  id: string;
  codigo: string;
  nome: string;
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
  const [filteredData, setFilteredData] = useState({
    localizacoes: [] as Localizacao[],
    caminhoes: [] as Caminhao[],
    motoristas: [] as Motorista[],
    operacoes: [] as Operacao[],
    centrosCusto: [] as CentroCusto[],
    responsaveis: [] as Responsavel[],
  });

  // Função para filtrar dados
  const filterData = (
    data: any[],
    searchTerm: string,
    searchFields: string[]
  ) => {
    if (!searchTerm) return data;

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        return (
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  };

  // Estados para Localização
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([
    {
      id: "1",
      codigo: "ARM-001",
      descricao: "Armazém Principal - Área A",
      tipo_estoque: "PRIMÁRIO",
      capacidade: "50 IBCs",
    },
    {
      id: "2",
      codigo: "ARM-002",
      descricao: "Armazém Principal - Área B",
      tipo_estoque: "SECUNDÁRIO",
      capacidade: "30 IBCs",
    },
    {
      id: "3",
      codigo: "EST-001",
      descricao: "Estoque Externo - Pátio 1",
      tipo_estoque: "PRIMÁRIO",
      capacidade: "100 IBCs",
    },
    {
      id: "4",
      codigo: "SIL-001",
      descricao: "Silos - Área Norte",
      tipo_estoque: "TERCIÁRIO",
      capacidade: "25 Silos",
    },
    {
      id: "5",
      codigo: "DEP-001",
      descricao: "Depósito Central",
      tipo_estoque: "PRIMÁRIO",
      capacidade: "75 IBCs",
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
    },
    {
      id: "2",
      placa: "ABC-1234",
      patrimonio: "888888",
      volume: "15000",
      modelo: "FH16",
      marca: "Volvo",
      ano: "2022",
    },
    {
      id: "3",
      placa: "DEF-5678",
      patrimonio: "777777",
      volume: "12000",
      modelo: "Actros",
      marca: "Mercedes-Benz",
      ano: "2024",
    },
    {
      id: "4",
      placa: "GHI-9012",
      patrimonio: "666666",
      volume: "14000",
      modelo: "Scania R",
      marca: "Scania",
      ano: "2023",
    },
    {
      id: "5",
      placa: "JKL-3456",
      patrimonio: "555555",
      volume: "11000",
      modelo: "Constellation",
      marca: "Volkswagen",
      ano: "2021",
    },
  ]);
  const [showCaminhaoDialog, setShowCaminhaoDialog] = useState(false);
  const [editingCaminhao, setEditingCaminhao] = useState<Caminhao | null>(null);
  const [caminhaoForm, setCaminhaoForm] = useState({
    placa: "",
    patrimonio: "",
    volume: "",
    modelo: "",
    marca: "",
    ano: "",
  });

  // Estados para Motorista
  const [motoristas, setMotoristas] = useState<Motorista[]>([
    {
      id: "1",
      codigo: "1",
      matricula: "9999999",
      nome: "Ze",
      contato: "3499999999",
    },
    {
      id: "2",
      codigo: "2",
      matricula: "8888888",
      nome: "João Silva",
      contato: "3498888888",
    },
    {
      id: "3",
      codigo: "3",
      matricula: "7777777",
      nome: "Maria Santos",
      contato: "3497777777",
    },
    {
      id: "4",
      codigo: "4",
      matricula: "6666666",
      nome: "Carlos Oliveira",
      contato: "3496666666",
    },
    {
      id: "5",
      codigo: "5",
      matricula: "5555555",
      nome: "Ana Costa",
      contato: "3495555555",
    },
  ]);
  const [showMotoristaDialog, setShowMotoristaDialog] = useState(false);
  const [editingMotorista, setEditingMotorista] = useState<Motorista | null>(
    null
  );
  const [motoristaForm, setMotoristaForm] = useState({
    codigo: "",
    matricula: "",
    nome: "",
    contato: "",
  });

  // Estados para Operação
  const [operacoes, setOperacoes] = useState<Operacao[]>([
    { id: "1", codigo: "225", descricao: "COMBATE A BROCA AVIÃO" },
    { id: "2", codigo: "226", descricao: "APLICAÇÃO HERBICIDA ÁREA A" },
    { id: "3", codigo: "227", descricao: "PULVERIZAÇÃO FUNGICIDA" },
    { id: "4", codigo: "228", descricao: "CONTROLE DE PRAGAS SOLO" },
    { id: "5", codigo: "229", descricao: "APLICAÇÃO FERTILIZANTE FOLIAR" },
  ]);
  const [showOperacaoDialog, setShowOperacaoDialog] = useState(false);
  const [editingOperacao, setEditingOperacao] = useState<Operacao | null>(null);
  const [operacaoForm, setOperacaoForm] = useState({
    codigo: "",
    descricao: "",
  });

  // Estados para Centro de Custo
  const [centrosCusto, setCentrosCusto] = useState<CentroCusto[]>([
    { id: "1", codigo: "3101020605", descricao: "Combate Prag Doe C Soca" },
    {
      id: "2",
      codigo: "3101020606",
      descricao: "Aplicação Defensivos Área Norte",
    },
    {
      id: "3",
      codigo: "3101020607",
      descricao: "Manutenção Preventiva Equipamentos",
    },
    { id: "4", codigo: "3101020608", descricao: "Pulverização Área Sul" },
    { id: "5", codigo: "3101020609", descricao: "Controle Fitossanitário" },
  ]);
  const [showCentroCustoDialog, setShowCentroCustoDialog] = useState(false);
  const [editingCentroCusto, setEditingCentroCusto] =
    useState<CentroCusto | null>(null);
  const [centroCustoForm, setCentroCustoForm] = useState({
    codigo: "",
    descricao: "",
  });

  // Estados para Responsável
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([
    { id: "1", codigo: "3103590", nome: "LUCIANO APARECIDO GRAÇAS" },
    { id: "2", codigo: "3103591", nome: "FERNANDO HENRIQUE SILVA" },
    { id: "3", codigo: "3103592", nome: "ROBERTO CARLOS SANTOS" },
    { id: "4", codigo: "3103593", nome: "PATRICIA MARIA OLIVEIRA" },
    { id: "5", codigo: "3103594", nome: "ANDERSON LUIZ COSTA" },
  ]);
  const [showResponsavelDialog, setShowResponsavelDialog] = useState(false);
  const [editingResponsavel, setEditingResponsavel] =
    useState<Responsavel | null>(null);
  const [responsavelForm, setResponsavelForm] = useState({
    codigo: "",
    nome: "",
  });

  // Efeito para aplicar filtros
  useEffect(() => {
    setFilteredData({
      localizacoes: filterData(localizacoes, searchTerms.localizacao, [
        "codigo",
        "descricao",
        "tipo_estoque",
      ]),
      caminhoes: filterData(caminhoes, searchTerms.caminhao, [
        "placa",
        "patrimonio",
        "modelo",
        "marca",
      ]),
      motoristas: filterData(motoristas, searchTerms.motorista, [
        "codigo",
        "matricula",
        "nome",
        "contato",
      ]),
      operacoes: filterData(operacoes, searchTerms.operacao, [
        "codigo",
        "descricao",
      ]),
      centrosCusto: filterData(centrosCusto, searchTerms.centroCusto, [
        "codigo",
        "descricao",
      ]),
      responsaveis: filterData(responsaveis, searchTerms.responsavel, [
        "codigo",
        "nome",
      ]),
    });
  }, [
    searchTerms,
    localizacoes,
    caminhoes,
    motoristas,
    operacoes,
    centrosCusto,
    responsaveis,
  ]);

  // Funções de Localização
  const handleSaveLocalizacao = () => {
    if (editingLocalizacao) {
      setLocalizacoes(
        localizacoes.map((loc) =>
          loc.id === editingLocalizacao.id
            ? { ...editingLocalizacao, ...localizacaoForm }
            : loc
        )
      );
      toast({ title: "Localização atualizada com sucesso!" });
    } else {
      const newLocalizacao: Localizacao = {
        id: Date.now().toString(),
        ...localizacaoForm,
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
    });
  };

  // Funções de Caminhão
  const handleSaveCaminhao = () => {
    if (editingCaminhao) {
      setCaminhoes(
        caminhoes.map((cam) =>
          cam.id === editingCaminhao.id
            ? { ...editingCaminhao, ...caminhaoForm }
            : cam
        )
      );
      toast({ title: "Caminhão atualizado com sucesso!" });
    } else {
      const newCaminhao: Caminhao = {
        id: Date.now().toString(),
        ...caminhaoForm,
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
    });
  };

  // Funções de Motorista
  const handleSaveMotorista = () => {
    if (editingMotorista) {
      setMotoristas(
        motoristas.map((mot) =>
          mot.id === editingMotorista.id
            ? { ...editingMotorista, ...motoristaForm }
            : mot
        )
      );
      toast({ title: "Motorista atualizado com sucesso!" });
    } else {
      const newMotorista: Motorista = {
        id: Date.now().toString(),
        ...motoristaForm,
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
    });
  };

  // Funções de Operação
  const handleSaveOperacao = () => {
    if (editingOperacao) {
      setOperacoes(
        operacoes.map((op) =>
          op.id === editingOperacao.id
            ? { ...editingOperacao, ...operacaoForm }
            : op
        )
      );
      toast({ title: "Operação atualizada com sucesso!" });
    } else {
      const newOperacao: Operacao = {
        id: Date.now().toString(),
        ...operacaoForm,
      };
      setOperacoes([...operacoes, newOperacao]);
      toast({ title: "Operação cadastrada com sucesso!" });
    }
    handleCloseOperacaoDialog();
  };

  const handleEditOperacao = (operacao: Operacao) => {
    setEditingOperacao(operacao);
    setOperacaoForm({
      codigo: operacao.codigo,
      descricao: operacao.descricao,
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
      codigo: "",
      descricao: "",
    });
  };

  // Funções de Centro de Custo
  const handleSaveCentroCusto = () => {
    if (editingCentroCusto) {
      setCentrosCusto(
        centrosCusto.map((cc) =>
          cc.id === editingCentroCusto.id
            ? { ...editingCentroCusto, ...centroCustoForm }
            : cc
        )
      );
      toast({ title: "Centro de Custo atualizado com sucesso!" });
    } else {
      const newCentroCusto: CentroCusto = {
        id: Date.now().toString(),
        ...centroCustoForm,
      };
      setCentrosCusto([...centrosCusto, newCentroCusto]);
      toast({ title: "Centro de Custo cadastrado com sucesso!" });
    }
    handleCloseCentroCustoDialog();
  };

  const handleEditCentroCusto = (centroCusto: CentroCusto) => {
    setEditingCentroCusto(centroCusto);
    setCentroCustoForm({
      codigo: centroCusto.codigo,
      descricao: centroCusto.descricao,
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
      codigo: "",
      descricao: "",
    });
  };

  // Funções de Responsável
  const handleSaveResponsavel = () => {
    if (editingResponsavel) {
      setResponsaveis(
        responsaveis.map((resp) =>
          resp.id === editingResponsavel.id
            ? { ...editingResponsavel, ...responsavelForm }
            : resp
        )
      );
      toast({ title: "Responsável atualizado com sucesso!" });
    } else {
      const newResponsavel: Responsavel = {
        id: Date.now().toString(),
        ...responsavelForm,
      };
      setResponsaveis([...responsaveis, newResponsavel]);
      toast({ title: "Responsável cadastrado com sucesso!" });
    }
    handleCloseResponsavelDialog();
  };

  const handleEditResponsavel = (responsavel: Responsavel) => {
    setEditingResponsavel(responsavel);
    setResponsavelForm({
      codigo: responsavel.codigo,
      nome: responsavel.nome,
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
      codigo: "",
      nome: "",
    });
  };

  // Funções de Importação
  const handleImportCSV = (tipo: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        toast({ title: `Importando ${tipo} do arquivo ${file.name}...` });
      }
    };
    input.click();
  };

  // Funções de Exportação
  const handleExport = (tipo: string, formato: "csv" | "pdf") => {
    toast({
      title: `Exportando ${tipo} em formato ${formato.toUpperCase()}...`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cadastros Auxiliares
          </h1>
          <p className="text-muted-foreground">
            Gerencie os cadastros auxiliares do sistema
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="localizacao">Localização</TabsTrigger>
          <TabsTrigger value="caminhao">Caminhão</TabsTrigger>
          <TabsTrigger value="motorista">Motorista</TabsTrigger>
          <TabsTrigger value="operacoes">Operações</TabsTrigger>
          <TabsTrigger value="centro-custo">Centro de Custo</TabsTrigger>
          <TabsTrigger value="responsavel">Responsável</TabsTrigger>
        </TabsList>

        {/* Aba Localização */}
        <TabsContent value="localizacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Localizações</CardTitle>
              <CardDescription>
                {filteredData.localizacoes.length} localização(ões)
                encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtro específico para Localização */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código, descrição ou tipo de estoque..."
                    value={searchTerms.localizacao}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        localizacao: e.target.value,
                      })
                    }
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleImportCSV("Localização")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar CSV
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
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
                <Button onClick={() => setShowLocalizacaoDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Localização
                </Button>
              </div>

              {filteredData.localizacoes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.localizacao
                    ? "Nenhuma localização encontrada com os filtros aplicados."
                    : "Nenhuma localização cadastrada."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Tipo de Estoque</TableHead>
                        <TableHead>Capacidade</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
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
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditLocalizacao(loc)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteLocalizacao(loc.id)
                                  }
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
          <Card>
            <CardHeader>
              <CardTitle>Caminhões</CardTitle>
              <CardDescription>
                {filteredData.caminhoes.length} caminhão(ões) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtro específico para Caminhão */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por placa, patrimônio, modelo ou marca..."
                    value={searchTerms.caminhao}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        caminhao: e.target.value,
                      })
                    }
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleImportCSV("Caminhão")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar CSV
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
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
                <Button onClick={() => setShowCaminhaoDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Caminhão
                </Button>
              </div>

              {filteredData.caminhoes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.caminhao
                    ? "Nenhum caminhão encontrado com os filtros aplicados."
                    : "Nenhum caminhão cadastrado."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Placa</TableHead>
                        <TableHead>Patrimônio</TableHead>
                        <TableHead>Volume (L)</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Ano</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
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
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditCaminhao(cam)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCaminhao(cam.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
          <Card>
            <CardHeader>
              <CardTitle>Motoristas</CardTitle>
              <CardDescription>
                {filteredData.motoristas.length} motorista(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtro específico para Motorista */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código, matrícula, nome ou contato..."
                    value={searchTerms.motorista}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        motorista: e.target.value,
                      })
                    }
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleImportCSV("Motorista")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar CSV
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
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
                <Button onClick={() => setShowMotoristaDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Motorista
                </Button>
              </div>

              {filteredData.motoristas.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.motorista
                    ? "Nenhum motorista encontrado com os filtros aplicados."
                    : "Nenhum motorista cadastrado."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Matrícula</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
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
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditMotorista(mot)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteMotorista(mot.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
          <Card>
            <CardHeader>
              <CardTitle>Operações</CardTitle>
              <CardDescription>
                {filteredData.operacoes.length} operação(ões) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtro específico para Operações */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código ou descrição..."
                    value={searchTerms.operacao}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        operacao: e.target.value,
                      })
                    }
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleImportCSV("Operação")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar CSV
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
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
                <Button onClick={() => setShowOperacaoDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Operação
                </Button>
              </div>

              {filteredData.operacoes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.operacao
                    ? "Nenhuma operação encontrada com os filtros aplicados."
                    : "Nenhuma operação cadastrada."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.operacoes.map((op) => (
                        <TableRow key={op.id}>
                          <TableCell className="font-medium">
                            {op.codigo}
                          </TableCell>
                          <TableCell>{op.descricao}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditOperacao(op)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteOperacao(op.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
          <Card>
            <CardHeader>
              <CardTitle>Centros de Custo</CardTitle>
              <CardDescription>
                {filteredData.centrosCusto.length} centro(s) de custo
                encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtro específico para Centro de Custo */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código ou descrição..."
                    value={searchTerms.centroCusto}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        centroCusto: e.target.value,
                      })
                    }
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleImportCSV("Centro de Custo")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar CSV
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
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
                <Button onClick={() => setShowCentroCustoDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Centro de Custo
                </Button>
              </div>

              {filteredData.centrosCusto.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.centroCusto
                    ? "Nenhum centro de custo encontrado com os filtros aplicados."
                    : "Nenhum centro de custo cadastrado."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.centrosCusto.map((cc) => (
                        <TableRow key={cc.id}>
                          <TableCell className="font-medium">
                            {cc.codigo}
                          </TableCell>
                          <TableCell>{cc.descricao}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditCentroCusto(cc)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCentroCusto(cc.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
          <Card>
            <CardHeader>
              <CardTitle>Responsáveis</CardTitle>
              <CardDescription>
                {filteredData.responsaveis.length} responsável(is) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtro específico para Responsável */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código ou nome..."
                    value={searchTerms.responsavel}
                    onChange={(e) =>
                      setSearchTerms({
                        ...searchTerms,
                        responsavel: e.target.value,
                      })
                    }
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleImportCSV("Responsável")}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar CSV
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
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
                <Button onClick={() => setShowResponsavelDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Responsável
                </Button>
              </div>

              {filteredData.responsaveis.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {searchTerms.responsavel
                    ? "Nenhum responsável encontrado com os filtros aplicados."
                    : "Nenhum responsável cadastrado."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.responsaveis.map((resp) => (
                        <TableRow key={resp.id}>
                          <TableCell className="font-medium">
                            {resp.codigo}
                          </TableCell>
                          <TableCell>{resp.nome}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditResponsavel(resp)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteResponsavel(resp.id)
                                  }
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
              <Label htmlFor="op-codigo">Código</Label>
              <Input
                id="op-codigo"
                value={operacaoForm.codigo}
                onChange={(e) =>
                  setOperacaoForm({ ...operacaoForm, codigo: e.target.value })
                }
              />
            </div>
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
              <Label htmlFor="cc-codigo">Código</Label>
              <Input
                id="cc-codigo"
                value={centroCustoForm.codigo}
                onChange={(e) =>
                  setCentroCustoForm({
                    ...centroCustoForm,
                    codigo: e.target.value,
                  })
                }
              />
            </div>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCentroCustoDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCentroCusto}>Salvar</Button>
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
              <Label htmlFor="resp-codigo">Código</Label>
              <Input
                id="resp-codigo"
                value={responsavelForm.codigo}
                onChange={(e) =>
                  setResponsavelForm({
                    ...responsavelForm,
                    codigo: e.target.value,
                  })
                }
              />
            </div>
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
