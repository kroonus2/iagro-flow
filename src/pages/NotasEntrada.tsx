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
  Upload,
  Download,
  FileText,
  ChevronDown,
  ChevronRight,
  Trash2,
  Eye,
  Edit,
  Receipt,
  Boxes,
  Store,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

// Tipos e dados compartilhados (mesmos de EstoquesGerais)
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

// Dados simulados de materiais agrícolas
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

// Mapeamento de categorias
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
};

// Mapeamento de fornecedores
const fornecedores: { [key: number]: string } = {
  1: "Fornecedor A",
  2: "Fornecedor B",
  3: "Fornecedor C",
};

// Mapeamento de localizações
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
};

// Mapeamento de tipos de embalagem
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

// Tipo para itens do formulário
type ItemFormulario = {
  id: string;
  idItem: string;
  lote: string;
  qtde: string;
  unidade: string;
  validade: string;
  idTipoEmbalagem: string;
  qtdeEmbalagem: string;
  capEmbalagem: string;
  saldoAtual: string;
  idLocalizacao: string;
};

const NotasEntrada = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [xmlDialogOpen, setXmlDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [editarDialogOpen, setEditarDialogOpen] = useState(false);
  const [entradaSelecionada, setEntradaSelecionada] =
    useState<EntradaNotaFiscal | null>(null);
  const [entradaEditando, setEntradaEditando] =
    useState<EntradaNotaFiscal | null>(null);

  // Estado para controlar quais notas estão expandidas
  const [expandedNotas, setExpandedNotas] = useState<Set<string>>(new Set());

  // Estado para dados comuns da nota fiscal
  const [dadosComunsNota, setDadosComunsNota] = useState({
    nota: "",
    idFornecedor: "",
    dataEntrada: "",
  });

  // Estado para lista de itens do formulário
  const [itensFormulario, setItensFormulario] = useState<ItemFormulario[]>([
    {
      id: Date.now().toString(),
      idItem: "",
      lote: "",
      qtde: "",
      unidade: "LITROS",
      validade: "",
      idTipoEmbalagem: "",
      qtdeEmbalagem: "",
      capEmbalagem: "",
      saldoAtual: "",
      idLocalizacao: "",
    },
  ]);

  // Estado para controlar quais itens estão expandidos no formulário
  const [itensExpandidos, setItensExpandidos] = useState<Set<string>>(
    new Set([itensFormulario[0]?.id || ""])
  );

  // Estado para entradas (simulando dados - em produção viria de um contexto/API)
  const [entradasNotas, setEntradasNotas] = useState<EntradaNotaFiscal[]>([
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
    // Nota Fiscal 1000123 - Fornecedor A
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
  ]);

  // Função para alternar expansão de um item no formulário
  const toggleItemExpansao = (id: string) => {
    const novosExpandidos = new Set(itensExpandidos);
    if (novosExpandidos.has(id)) {
      novosExpandidos.delete(id);
    } else {
      novosExpandidos.add(id);
    }
    setItensExpandidos(novosExpandidos);
  };

  // Função para toggle de nota expandida
  const toggleNotaExpansao = (notaKey: string) => {
    const novosExpandidos = new Set(expandedNotas);
    if (novosExpandidos.has(notaKey)) {
      novosExpandidos.delete(notaKey);
    } else {
      novosExpandidos.add(notaKey);
    }
    setExpandedNotas(novosExpandidos);
  };

  // Função para adicionar novo item ao formulário
  const adicionarItem = () => {
    const novoId = Date.now().toString();
    setItensFormulario([
      ...itensFormulario,
      {
        id: novoId,
        idItem: "",
        lote: "",
        qtde: "",
        unidade: "LITROS",
        validade: "",
        idTipoEmbalagem: "",
        qtdeEmbalagem: "",
        capEmbalagem: "",
        saldoAtual: "",
        idLocalizacao: "",
      },
    ]);
    setItensExpandidos(new Set([...itensExpandidos, novoId]));
  };

  // Função para remover item do formulário
  const removerItem = (id: string) => {
    if (itensFormulario.length > 1) {
      setItensFormulario(itensFormulario.filter((item) => item.id !== id));
    } else {
      toast.error("É necessário ter pelo menos um item");
    }
  };

  // Função para atualizar um item específico
  const atualizarItem = (
    id: string,
    campo: keyof ItemFormulario,
    valor: string
  ) => {
    setItensFormulario(
      itensFormulario.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item
      )
    );
  };

  const handleIncluirCarga = () => {
    // Validar dados comuns
    if (
      !dadosComunsNota.nota ||
      !dadosComunsNota.idFornecedor ||
      !dadosComunsNota.dataEntrada
    ) {
      toast.error("Preencha os dados comuns da nota fiscal");
      return;
    }

    // Validar itens
    const itensValidos = itensFormulario.filter(
      (item) => item.idItem && item.qtde && item.unidade
    );

    if (itensValidos.length === 0) {
      toast.error("Adicione pelo menos um item válido");
      return;
    }

    // Criar entradas para cada item
    const novasEntradas: EntradaNotaFiscal[] = itensValidos.map((item) => {
      const tipoEmb = tiposEmbalagem[Number(item.idTipoEmbalagem)];
      const loc = localizacoes[Number(item.idLocalizacao)];
      return {
        nota: Number(dadosComunsNota.nota),
        idFornecedor: Number(dadosComunsNota.idFornecedor),
        dataEntrada: dadosComunsNota.dataEntrada,
        idItem: Number(item.idItem),
        lote: item.lote || "",
        qtde: Number(item.qtde),
        unidade: item.unidade,
        validade: item.validade || "",
        tipoEmbalagem: tipoEmb?.codigo || "",
        qtdeEmbalagem: item.qtdeEmbalagem ? Number(item.qtdeEmbalagem) : 0,
        capEmbalagem: item.capEmbalagem
          ? Number(item.capEmbalagem)
          : tipoEmb?.capacidade || 0,
        saldoAtual: item.saldoAtual
          ? Number(item.saldoAtual)
          : Number(item.qtde),
        localizacao: loc?.codigo || "",
        ativo: true,
      };
    });

    setEntradasNotas([...entradasNotas, ...novasEntradas]);
    toast.success(
      `${novasEntradas.length} entrada(s) registrada(s) com sucesso!`
    );
    setDialogOpen(false);

    // Resetar formulário
    setDadosComunsNota({
      nota: "",
      idFornecedor: "",
      dataEntrada: "",
    });
    const primeiroId = Date.now().toString();
    setItensFormulario([
      {
        id: primeiroId,
        idItem: "",
        lote: "",
        qtde: "",
        unidade: "LITROS",
        validade: "",
        idTipoEmbalagem: "",
        qtdeEmbalagem: "",
        capEmbalagem: "",
        saldoAtual: "",
        idLocalizacao: "",
      },
    ]);
    setItensExpandidos(new Set([primeiroId]));
  };

  const handleImportarXML = () => {
    toast.success("XML importado com sucesso!");
    setXmlDialogOpen(false);
  };

  const handleImportarCSV = () => {
    toast.success("CSV importado com sucesso!");
    setCsvDialogOpen(false);
  };

  const handleExportar = (tipo: "csv" | "pdf") => {
    if (tipo === "csv") {
      toast.success("Exportando notas de entrada em formato CSV...");
      // Aqui você pode implementar a lógica de exportação CSV
    } else {
      toast.success("Exportando notas de entrada em formato PDF...");
      // Aqui você pode implementar a lógica de exportação PDF
    }
  };

  const handleVerDetalhes = (entrada: EntradaNotaFiscal) => {
    setEntradaSelecionada(entrada);
    setDetalhesDialogOpen(true);
  };

  const handleEditarEntrada = (entrada: EntradaNotaFiscal) => {
    setEntradaEditando(entrada);
    setEditarDialogOpen(true);
  };

  const handleSalvarEdicao = () => {
    if (!entradaEditando) return;

    setEntradasNotas((prev) =>
      prev.map((e) => {
        if (
          e.nota === entradaEditando.nota &&
          e.idItem === entradaEditando.idItem &&
          e.lote === entradaEditando.lote
        ) {
          return {
            ...entradaEditando,
            ativo: entradaEditando.saldoAtual > 0,
          };
        }
        return e;
      })
    );
    toast.success("Entrada atualizada com sucesso!");
    setEditarDialogOpen(false);
    setEntradaEditando(null);
  };

  // Função para agrupar entradas por nota/fornecedor
  const agruparEntradasPorNota = (entradas: EntradaNotaFiscal[]) => {
    const agrupadas: {
      [key: string]: EntradaNotaFiscal[];
    } = {};
    entradas.forEach((entrada) => {
      const key = `${entrada.nota}-${entrada.idFornecedor}`;
      if (!agrupadas[key]) {
        agrupadas[key] = [];
      }
      agrupadas[key].push(entrada);
    });
    return agrupadas;
  };

  // Filtrar entradas
  const filteredEntradas = entradasNotas.filter((entrada) => {
    const material = materiaisAgricolas[entrada.idItem];
    const materialNome = material?.nomeComercial || material?.descricao || "";
    const fornecedorNome = fornecedores[entrada.idFornecedor] || "";

    const matchesSearch =
      entrada.nota.toString().includes(searchTerm) ||
      materialNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrada.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrada.localizacao.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Agrupar entradas por nota/fornecedor
  const entradasAgrupadas = agruparEntradasPorNota(filteredEntradas);
  const notasUnicas = Object.keys(entradasAgrupadas);

  // Calcular estatísticas
  const totalNotas = new Set(entradasNotas.map((e) => e.nota)).size;
  const totalEntradas = entradasNotas.length;
  const totalFornecedores = new Set(entradasNotas.map((e) => e.idFornecedor))
    .size;
  const totalQuantidade = entradasNotas.reduce((sum, e) => sum + e.qtde, 0);

  // Notas do mês atual
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const notasMesAtual = entradasNotas.filter((e) => {
    const dataEntrada = new Date(e.dataEntrada);
    return (
      dataEntrada.getMonth() === mesAtual &&
      dataEntrada.getFullYear() === anoAtual
    );
  }).length;

  // Última nota cadastrada
  const ultimaNota =
    entradasNotas.length > 0
      ? entradasNotas.reduce((latest, current) => {
          const latestDate = new Date(latest.dataEntrada);
          const currentDate = new Date(current.dataEntrada);
          return currentDate > latestDate ? current : latest;
        })
      : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Notas de Entrada
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento de notas fiscais e entradas de produtos
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Receipt className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-primary">{totalNotas}</p>
            <p className="text-sm text-muted-foreground">Total de Notas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Boxes className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">{totalEntradas}</p>
            <p className="text-sm text-muted-foreground">Total de Entradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Store className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-warning">
              {totalFornecedores}
            </p>
            <p className="text-sm text-muted-foreground">Fornecedores</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-500">{notasMesAtual}</p>
            <p className="text-sm text-muted-foreground">Notas do Mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Secundárias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Quantidade Total Recebida
                </p>
                <p className="text-2xl font-bold mt-1">
                  {totalQuantidade.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Soma de todas as entradas
                </p>
              </div>
              <Package className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Última Nota Cadastrada
                </p>
                <p className="text-lg font-bold mt-1">
                  {ultimaNota ? `NF ${ultimaNota.nota}` : "Nenhuma nota"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {ultimaNota
                    ? new Date(ultimaNota.dataEntrada).toLocaleDateString(
                        "pt-BR"
                      )
                    : "-"}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                placeholder="Buscar por nota, fornecedor, item, lote ou localização"
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
                <span className="hidden sm:inline">Nova Entrada</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nova Entrada</DialogTitle>
                <DialogDescription>
                  Registre uma nova entrada de produto no estoque. Você pode
                  adicionar múltiplos itens para a mesma nota fiscal.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Dados Comuns da Nota Fiscal */}
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <h3 className="text-lg font-semibold">
                      Dados da Nota Fiscal
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Informações comuns para todos os itens
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nota">Número da Nota *</Label>
                      <Input
                        id="nota"
                        type="number"
                        value={dadosComunsNota.nota}
                        onChange={(e) =>
                          setDadosComunsNota({
                            ...dadosComunsNota,
                            nota: e.target.value,
                          })
                        }
                        placeholder="999999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idFornecedor">Fornecedor *</Label>
                      <Select
                        value={dadosComunsNota.idFornecedor}
                        onValueChange={(value) =>
                          setDadosComunsNota({
                            ...dadosComunsNota,
                            idFornecedor: value,
                          })
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
                        value={dadosComunsNota.dataEntrada}
                        onChange={(e) =>
                          setDadosComunsNota({
                            ...dadosComunsNota,
                            dataEntrada: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Lista de Itens */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="text-lg font-semibold">Itens da Nota</h3>
                      <p className="text-sm text-muted-foreground">
                        Adicione os produtos desta nota fiscal
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={adicionarItem}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Item
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {itensFormulario.map((item, index) => {
                      const material = materiaisAgricolas[Number(item.idItem)];
                      const nomeProduto =
                        material?.nomeComercial ||
                        material?.descricao ||
                        "Selecione um item";
                      const isExpandido = itensExpandidos.has(item.id);

                      return (
                        <Card key={item.id} className="overflow-hidden">
                          {/* Header do Item - Clicável para expandir/recolher */}
                          <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleItemExpansao(item.id)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {isExpandido ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div className="flex-1">
                                <h4 className="font-semibold">
                                  Item {index + 1}
                                  {item.idItem && (
                                    <span className="text-muted-foreground font-normal ml-2">
                                      - {nomeProduto}
                                    </span>
                                  )}
                                </h4>
                                {!isExpandido && item.idItem && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {item.qtde && (
                                      <>
                                        Qtd: {item.qtde} {item.unidade}
                                        {item.lote && ` • Lote: ${item.lote}`}
                                      </>
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                            {itensFormulario.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removerItem(item.id);
                                }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {/* Conteúdo do Item - Mostrado apenas se expandido */}
                          {isExpandido && (
                            <div className="p-4 pt-0 border-t">
                              <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`item-${item.id}-idItem`}>
                                      Item *
                                    </Label>
                                    <Select
                                      value={item.idItem}
                                      onValueChange={(value) =>
                                        atualizarItem(item.id, "idItem", value)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o item" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1005392">
                                          U 46 BR (1005392)
                                        </SelectItem>
                                        <SelectItem value="1027638">
                                          DEZ (1027638)
                                        </SelectItem>
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
                                    <Label htmlFor={`item-${item.id}-lote`}>
                                      Número do Lote
                                    </Label>
                                    <Input
                                      id={`item-${item.id}-lote`}
                                      value={item.lote}
                                      onChange={(e) =>
                                        atualizarItem(
                                          item.id,
                                          "lote",
                                          e.target.value
                                        )
                                      }
                                      placeholder="NR42123259600"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`item-${item.id}-qtde`}>
                                      Quantidade *
                                    </Label>
                                    <Input
                                      id={`item-${item.id}-qtde`}
                                      type="number"
                                      value={item.qtde}
                                      onChange={(e) =>
                                        atualizarItem(
                                          item.id,
                                          "qtde",
                                          e.target.value
                                        )
                                      }
                                      placeholder="0"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`item-${item.id}-unidade`}>
                                      Unidade *
                                    </Label>
                                    <Select
                                      value={item.unidade}
                                      onValueChange={(value) =>
                                        atualizarItem(item.id, "unidade", value)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="LITROS">
                                          Litros (LITROS)
                                        </SelectItem>
                                        <SelectItem value="KILOS">
                                          Quilos (KILOS)
                                        </SelectItem>
                                        <SelectItem value="UNIDADES">
                                          Unidades (UNIDADES)
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`item-${item.id}-validade`}>
                                      Data de Validade
                                    </Label>
                                    <Input
                                      id={`item-${item.id}-validade`}
                                      type="date"
                                      value={item.validade}
                                      onChange={(e) =>
                                        atualizarItem(
                                          item.id,
                                          "validade",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`item-${item.id}-idTipoEmbalagem`}
                                    >
                                      Tipo de Embalagem
                                    </Label>
                                    <Select
                                      value={item.idTipoEmbalagem}
                                      onValueChange={(value) => {
                                        atualizarItem(
                                          item.id,
                                          "idTipoEmbalagem",
                                          value
                                        );
                                        const tipoEmb =
                                          tiposEmbalagem[Number(value)];
                                        if (tipoEmb && !item.capEmbalagem) {
                                          atualizarItem(
                                            item.id,
                                            "capEmbalagem",
                                            tipoEmb.capacidade.toString()
                                          );
                                        }
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(tiposEmbalagem).map(
                                          ([id, emb]) => (
                                            <SelectItem key={id} value={id}>
                                              {emb.codigo} - {emb.descricao}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`item-${item.id}-qtdeEmbalagem`}
                                    >
                                      Quantidade de Embalagens
                                    </Label>
                                    <Input
                                      id={`item-${item.id}-qtdeEmbalagem`}
                                      type="number"
                                      value={item.qtdeEmbalagem}
                                      onChange={(e) =>
                                        atualizarItem(
                                          item.id,
                                          "qtdeEmbalagem",
                                          e.target.value
                                        )
                                      }
                                      placeholder="5"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`item-${item.id}-capEmbalagem`}
                                    >
                                      Capacidade da Embalagem
                                    </Label>
                                    <Input
                                      id={`item-${item.id}-capEmbalagem`}
                                      type="number"
                                      value={item.capEmbalagem}
                                      onChange={(e) =>
                                        atualizarItem(
                                          item.id,
                                          "capEmbalagem",
                                          e.target.value
                                        )
                                      }
                                      placeholder="1000"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`item-${item.id}-saldoAtual`}
                                    >
                                      Saldo Atual
                                    </Label>
                                    <Input
                                      id={`item-${item.id}-saldoAtual`}
                                      type="number"
                                      value={item.saldoAtual}
                                      onChange={(e) =>
                                        atualizarItem(
                                          item.id,
                                          "saldoAtual",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Deixe vazio para usar a quantidade"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`item-${item.id}-idLocalizacao`}
                                    >
                                      Localização
                                    </Label>
                                    <Select
                                      value={item.idLocalizacao}
                                      onValueChange={(value) =>
                                        atualizarItem(
                                          item.id,
                                          "idLocalizacao",
                                          value
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione a localização" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(localizacoes)
                                          .filter(
                                            ([_, loc]) =>
                                              loc.tipoEstoque === "PRIMÁRIO"
                                          )
                                          .map(([id, loc]) => (
                                            <SelectItem key={id} value={id}>
                                              {loc.codigo} - {loc.descricao}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setDadosComunsNota({
                      nota: "",
                      idFornecedor: "",
                      dataEntrada: "",
                    });
                    const primeiroId = Date.now().toString();
                    setItensFormulario([
                      {
                        id: primeiroId,
                        idItem: "",
                        lote: "",
                        qtde: "",
                        unidade: "LITROS",
                        validade: "",
                        idTipoEmbalagem: "",
                        qtdeEmbalagem: "",
                        capEmbalagem: "",
                        saldoAtual: "",
                        idLocalizacao: "",
                      },
                    ]);
                    setItensExpandidos(new Set([primeiroId]));
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" onClick={handleIncluirCarga}>
                  Registrar{" "}
                  {itensFormulario.length > 1 ? "Entradas" : "Entrada"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid Hierárquico de Notas */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Fiscais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notasUnicas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  Nenhuma nota encontrada
                </p>
                <p className="text-sm">
                  {searchTerm
                    ? "Tente ajustar os termos de busca"
                    : "Comece adicionando uma nota de entrada"}
                </p>
              </div>
            ) : (
              notasUnicas.map((notaKey) => {
                const entradasDaNota = entradasAgrupadas[notaKey];
                const primeiraEntrada = entradasDaNota[0];
                const fornecedorNome =
                  fornecedores[primeiraEntrada.idFornecedor] ||
                  `Fornecedor ${primeiraEntrada.idFornecedor}`;
                const isExpanded = expandedNotas.has(notaKey);

                // Calcular totais
                const totalItens = entradasDaNota.length;
                const totalQuantidade = entradasDaNota.reduce(
                  (sum, e) => sum + e.qtde,
                  0
                );
                const totalSaldo = entradasDaNota.reduce(
                  (sum, e) => sum + e.saldoAtual,
                  0
                );

                return (
                  <div key={notaKey} className="border rounded-lg">
                    {/* Linha da Nota */}
                    <div className="p-4 bg-muted/50 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleNotaExpansao(notaKey)}
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
                                  Nota Fiscal: {primeiraEntrada.nota}
                                </h3>
                                <Badge variant="outline">
                                  {fornecedorNome}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-muted-foreground">
                                  Data de Entrada:{" "}
                                  {new Date(
                                    primeiraEntrada.dataEntrada
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                                <span className="text-sm font-medium">
                                  {totalItens} item(ns)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subgrid de Itens */}
                    {isExpanded && (
                      <div className="p-4">
                        {entradasDaNota.length > 0 ? (
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground mb-3">
                              Itens desta nota:
                            </h4>
                            <div className="rounded-md border">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Lote</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                    <TableHead>Unidade</TableHead>
                                    <TableHead>Validade</TableHead>
                                    <TableHead>Saldo Atual</TableHead>
                                    <TableHead>Localização</TableHead>
                                    <TableHead>Ações</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {entradasDaNota.map((entrada, index) => {
                                    const material =
                                      materiaisAgricolas[entrada.idItem];
                                    return (
                                      <TableRow key={index}>
                                        <TableCell>
                                          <div>
                                            <p className="font-medium">
                                              {material?.nomeComercial ||
                                                material?.descricao ||
                                                "Item não encontrado"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              ID: {entrada.idItem}
                                            </p>
                                          </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                          {entrada.lote}
                                        </TableCell>
                                        <TableCell>
                                          <span className="font-medium">
                                            {entrada.qtde}
                                          </span>
                                        </TableCell>
                                        <TableCell>{entrada.unidade}</TableCell>
                                        <TableCell className="text-sm">
                                          {new Date(
                                            entrada.validade
                                          ).toLocaleDateString("pt-BR")}
                                        </TableCell>
                                        <TableCell>
                                          <span className="font-medium">
                                            {entrada.saldoAtual}{" "}
                                            {entrada.unidade}
                                          </span>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                          {entrada.localizacao}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                handleVerDetalhes(entrada)
                                              }
                                              title="Visualizar"
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                handleEditarEntrada(entrada)
                                              }
                                              title="Editar"
                                            >
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                          </div>
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
                            <p>Nenhum item encontrado para esta nota</p>
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

      {/* Modal de Detalhes */}
      <Dialog open={detalhesDialogOpen} onOpenChange={setDetalhesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Entrada</DialogTitle>
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
                <Label className="text-muted-foreground">Fornecedor</Label>
                <p className="text-sm font-medium">
                  {fornecedores[entradaSelecionada.idFornecedor] ||
                    `Fornecedor ${entradaSelecionada.idFornecedor}`}
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
                <Label className="text-muted-foreground">Localização</Label>
                <p className="text-sm font-medium font-mono">
                  {entradaSelecionada.localizacao}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={editarDialogOpen} onOpenChange={setEditarDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Entrada</DialogTitle>
            <DialogDescription>
              Edite as informações da entrada de produto no estoque.
            </DialogDescription>
          </DialogHeader>
          {entradaEditando && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};

export default NotasEntrada;
