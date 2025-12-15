import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Search,
  ArrowDown,
  ArrowUp,
  HelpCircle,
  Plus,
  Minus,
  Eye,
  X,
  Calendar as CalendarIcon,
  Package,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { cn } from "@/lib/utils";

// Dados simulados de materiais agrícolas (vinculados ao InsumosAgricolas.tsx)
// Em produção, isso viria de uma API ou contexto compartilhado
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

// Mapeamento de IDs de localização para nomes
const localizacoes: { [key: number]: string } = {
  1: "PRIMÁRIO",
  2: "FRACIONÁRIO",
  3: "TÉCNICO",
  4: "SUPERVISÓRIO",
  5: "DESCARTE",
  6: "RESERVA",
  8: "TÉCNICO-RESERVA",
  9: "FRACIONÁRIO-RESERVA",
};

// Mapeamento de usuários
const usuarios: {
  [key: number]: { nome: string; email: string };
} = {
  1: { nome: "João Silva", email: "joao.silva@iagro.com.br" },
  2: { nome: "Maria Santos", email: "maria.santos@iagro.com.br" },
  3: { nome: "Carlos Oliveira", email: "carlos.oliveira@iagro.com.br" },
};

type Movimentacao = {
  data: string;
  hora?: string; // Hora da movimentação (opcional)
  idItem: number;
  nLote: string;
  tipoMovimento: string;
  idLocOrigem: number;
  idLocDestino: number | null;
  qtde: number;
  unidade: string;
  idUsuario: number;
  notaEntrada?: number; // Nota de entrada associada (opcional)
  observacoes?: string; // Observações registradas (opcional)
};

const Movimentacoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [origemFilter, setOrigemFilter] = useState("todas");
  const [destinoFilter, setDestinoFilter] = useState("todos");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [tipoMovimentoFilter, setTipoMovimentoFilter] = useState("todos");
  const [tiposDialogOpen, setTiposDialogOpen] = useState(false);
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false);
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] =
    useState<Movimentacao | null>(null);

  // Tipos de movimentações do sistema
  const tiposMovimentacoes = [
    {
      nome: "PRODUÇÃO-TÉCNICO",
      origem: "PRIMÁRIO",
      destino: "TÉCNICO",
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
    {
      nome: "PERDA FRACIONÁRIO",
      origem: "FRACIONÁRIO",
      destino: "DESCARTE",
      acao: "SUBTRAIR",
      tipo: "saida",
    },
    {
      nome: "PERDA TECNICO",
      origem: "TÉCNICO",
      destino: "DESCARTE",
      acao: "SUBTRAIR",
      tipo: "saida",
    },
    {
      nome: "DEVOLUÇÃO",
      origem: "FRACIONÁRIO",
      destino: "PRIMÁRIO",
      acao: "SOMAR",
      tipo: "entrada",
    },
    {
      nome: "DEVOLUÇÃO",
      origem: "FRACIONÁRIO",
      destino: "FRACIONÁRIO",
      acao: "SOMAR",
      tipo: "entrada",
    },
    {
      nome: "CALDA TECNICO",
      origem: "SUPERVISÓRIO",
      destino: "TÉCNICO",
      acao: "SUBTRAIR",
      tipo: "saida",
    },
    {
      nome: "CALDA FRACIONÁRIO",
      origem: "SUPERVISÓRIO",
      destino: "FRACIONÁRIO",
      acao: "SUBTRAIR",
      tipo: "saida",
    },
  ];

  // Dados simulados de movimentações baseados na imagem
  const movimentacoes = [
    {
      data: "2025-10-15",
      hora: "14:30",
      idItem: 1005392,
      nLote: "NR42123259600",
      tipoMovimento: "PRODUÇÃO",
      idLocOrigem: 1,
      idLocDestino: 4,
      qtde: 1000,
      unidade: "L",
      idUsuario: 1,
      notaEntrada: 999999,
      observacoes: "Movimentação para produção de calda",
    },
    {
      data: "2025-10-16",
      hora: "09:15",
      idItem: 1027638,
      nLote: "SY003-24-20-160",
      tipoMovimento: "PERDA TECNICO",
      idLocOrigem: 5,
      idLocDestino: 5,
      qtde: 100,
      unidade: "L",
      idUsuario: 1,
      observacoes: "Perda por vazamento",
    },
    {
      data: "2025-10-17",
      hora: "16:45",
      idItem: 1027636,
      nLote: "027-25-24-60",
      tipoMovimento: "FRACIONÁRIO",
      idLocOrigem: 2,
      idLocDestino: null,
      qtde: 50,
      unidade: "L",
      idUsuario: 1,
    },
    {
      data: "2025-10-18",
      hora: "11:20",
      idItem: 1003390,
      nLote: "NR99999999999",
      tipoMovimento: "TECNICO-RESERVA",
      idLocOrigem: 3,
      idLocDestino: 6,
      qtde: 15,
      unidade: "L",
      idUsuario: 1,
    },
    {
      data: "2025-10-20",
      hora: "13:00",
      idItem: 1005392,
      nLote: "005-22-12000",
      tipoMovimento: "CALDA TÉCNICO",
      idLocOrigem: 4,
      idLocDestino: 3,
      qtde: 900,
      unidade: "L",
      idUsuario: 1,
    },
    {
      data: "2025-10-22",
      hora: "10:30",
      idItem: 1027638,
      nLote: "SY003-24-20-160",
      tipoMovimento: "PRODUÇÃO-FRACIONÁRIO",
      idLocOrigem: 1,
      idLocDestino: 2,
      qtde: 950,
      unidade: "L",
      idUsuario: 1,
      notaEntrada: 1000123,
      observacoes: "Movimentação para fracionamento",
    },
    {
      data: "2025-10-13",
      hora: "08:00",
      idItem: 1005392,
      nLote: "NR42123259600",
      tipoMovimento: "PRODUÇÃO",
      idLocOrigem: 1,
      idLocDestino: 4,
      qtde: 67.25,
      unidade: "KG",
      idUsuario: 1,
      notaEntrada: 999999,
    },
  ];

  // Determinar tipo (entrada/saída) baseado no tipo de movimentação
  const getTipoMovimentacao = (tipoMov: string): "entrada" | "saida" => {
    const tiposEntrada = ["DEVOLUÇÃO"];
    return tiposEntrada.includes(tipoMov) ? "entrada" : "saida";
  };

  // Função para obter categoria por ID
  const getCategoriaById = (id?: number) => {
    if (!id) return null;
    return categorias[id] || null;
  };

  // Função para obter classe por ID
  const getClasseById = (id: number) => {
    return classes[id] || null;
  };

  const filteredMovimentacoes = movimentacoes.filter((mov) => {
    const material = materiaisAgricolas[mov.idItem];
    const materialNome = material?.nomeComercial || material?.descricao || "";
    const materialCodigo = material?.codigo || "";
    const categoria = material?.categoriaId
      ? getCategoriaById(material.categoriaId)
      : null;
    const categoriaNome = categoria?.descricaoResumida || "";
    const categoriaCodigo = categoria?.codigo || "";
    const classe = categoria?.classeId
      ? getClasseById(categoria.classeId)
      : null;
    const classeNome = classe?.nomeClasse || "";
    const classeIdentificacao = classe?.identificacao || "";

    const termoLower = searchTerm.toLowerCase();

    // Buscar por código externo, nome do item, grupo, classe, lote ou localização
    const matchesSearch =
      !searchTerm ||
      materialCodigo.toLowerCase().includes(termoLower) ||
      materialNome.toLowerCase().includes(termoLower) ||
      categoriaNome.toLowerCase().includes(termoLower) ||
      categoriaCodigo.toLowerCase().includes(termoLower) ||
      classeNome.toLowerCase().includes(termoLower) ||
      classeIdentificacao.toLowerCase().includes(termoLower) ||
      mov.nLote.toLowerCase().includes(termoLower) ||
      (localizacoes[mov.idLocOrigem] || "")
        .toLowerCase()
        .includes(termoLower) ||
      (mov.idLocDestino &&
        (localizacoes[mov.idLocDestino] || "")
          .toLowerCase()
          .includes(termoLower));

    // Filtro de origem
    const origemMov = localizacoes[mov.idLocOrigem] || "";
    const matchesOrigem =
      origemFilter === "todas" ||
      origemMov.toUpperCase() === origemFilter.toUpperCase();

    // Filtro de destino
    const destinoMov = mov.idLocDestino
      ? localizacoes[mov.idLocDestino] || ""
      : null;
    const matchesDestino =
      destinoFilter === "todos" ||
      (destinoMov && destinoMov.toUpperCase() === destinoFilter.toUpperCase());

    // Filtro de período
    const dataMov = new Date(mov.data);
    const matchesPeriodo =
      (!dateRange?.from || dataMov >= dateRange.from) &&
      (!dateRange?.to || dataMov <= dateRange.to);

    // Filtro de tipo de movimentação
    const matchesTipoMovimento =
      tipoMovimentoFilter === "todos" ||
      mov.tipoMovimento === tipoMovimentoFilter;

    return (
      matchesSearch &&
      matchesOrigem &&
      matchesDestino &&
      matchesPeriodo &&
      matchesTipoMovimento
    );
  });

  const hasActiveFilters = () => {
    return (
      searchTerm !== "" ||
      origemFilter !== "todas" ||
      destinoFilter !== "todos" ||
      dateRange !== undefined ||
      tipoMovimentoFilter !== "todos"
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setOrigemFilter("todas");
    setDestinoFilter("todos");
    setDateRange(undefined);
    setTipoMovimentoFilter("todos");
  };

  const handleVerDetalhes = (mov: Movimentacao) => {
    setMovimentacaoSelecionada(mov);
    setDetalhesDialogOpen(true);
  };

  const handleExportar = () => {
    // Simular exportação
    const dados = filteredMovimentacoes.map((mov) => {
      const material = materiaisAgricolas[mov.idItem];
      const tipo = getTipoMovimentacao(mov.tipoMovimento);
      return {
        Data: mov.data,
        Tipo: tipo === "entrada" ? "Entrada" : "Saída",
        "ID Item": mov.idItem,
        Item: material?.nomeComercial || material?.descricao || "",
        "Tipo Movimento": mov.tipoMovimento,
        Origem: localizacoes[mov.idLocOrigem] || mov.idLocOrigem,
        Destino: mov.idLocDestino
          ? localizacoes[mov.idLocDestino] || mov.idLocDestino
          : "-",
        Quantidade: mov.qtde,
        Unidade: mov.unidade,
        Lote: mov.nLote,
        Usuário: mov.idUsuario,
      };
    });

    const csv =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(dados[0]).join(";"),
        ...dados.map((row) => Object.values(row).join(";")),
      ].join("\n");

    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `movimentacoes_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Histórico de Movimentações
            </h1>
            <p className="text-muted-foreground mt-1">
              Registro completo de entradas e saídas de produtos
            </p>
          </div>
          <Dialog open={tiposDialogOpen} onOpenChange={setTiposDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="mt-1">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tipos de Movimentações do Sistema</DialogTitle>
                <DialogDescription>
                  Lista completa dos tipos de movimentações disponíveis no
                  sistema e suas configurações
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Est. Origem</TableHead>
                        <TableHead>Est. Destino</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tiposMovimentacoes.map((tipo, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {tipo.nome}
                          </TableCell>
                          <TableCell>{tipo.origem}</TableCell>
                          <TableCell>{tipo.destino}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tipo.acao === "SOMAR" ? "default" : "secondary"
                              }
                              className="flex items-center gap-1 w-fit"
                            >
                              {tipo.acao === "SOMAR" ? (
                                <>
                                  <Plus className="h-3 w-3" />
                                  {tipo.acao}
                                </>
                              ) : (
                                <>
                                  <Minus className="h-3 w-3" />
                                  {tipo.acao}
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tipo.tipo === "entrada"
                                  ? "default"
                                  : "secondary"
                              }
                              className="flex items-center gap-1 w-fit"
                            >
                              {tipo.tipo === "entrada" ? (
                                <>
                                  <ArrowUp className="h-3 w-3" />
                                  Entrada
                                </>
                              ) : (
                                <>
                                  <ArrowDown className="h-3 w-3" />
                                  Saída
                                </>
                              )}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Legenda:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="flex items-center gap-1 w-fit"
                      >
                        <Plus className="h-3 w-3" />
                        SOMAR
                      </Badge>
                      <span className="text-muted-foreground">
                        = Movimentação de Entrada (adiciona ao estoque)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1 w-fit"
                      >
                        <Minus className="h-3 w-3" />
                        SUBTRAIR
                      </Badge>
                      <span className="text-muted-foreground">
                        = Movimentação de Saída (remove do estoque)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Est. Primário
                </p>
                <p className="text-2xl font-bold text-primary">
                  {
                    filteredMovimentacoes.filter(
                      (m) => localizacoes[m.idLocOrigem] === "PRIMÁRIO"
                    ).length
                  }
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Est. Técnico
                </p>
                <p className="text-2xl font-bold text-success">
                  {
                    filteredMovimentacoes.filter(
                      (m) => localizacoes[m.idLocOrigem] === "TÉCNICO"
                    ).length
                  }
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Est. Fracionário
                </p>
                <p className="text-2xl font-bold text-warning">
                  {
                    filteredMovimentacoes.filter(
                      (m) => localizacoes[m.idLocOrigem] === "FRACIONÁRIO"
                    ).length
                  }
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
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
          <div className="space-y-4">
            {/* Campo de busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código externo, nome do item, grupo, classe, lote ou localização"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtros em grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <Select value={origemFilter} onValueChange={setOrigemFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">TODAS AS ORIGENS</SelectItem>
                  <SelectItem value="PRIMÁRIO">PRIMÁRIO</SelectItem>
                  <SelectItem value="TÉCNICO">TÉCNICO</SelectItem>
                  <SelectItem value="FRACIONÁRIO">FRACIONÁRIO</SelectItem>
                </SelectContent>
              </Select>

              <Select value={destinoFilter} onValueChange={setDestinoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">TODOS OS DESTINOS</SelectItem>
                  <SelectItem value="PRIMÁRIO">PRIMÁRIO</SelectItem>
                  <SelectItem value="TÉCNICO">TÉCNICO</SelectItem>
                  <SelectItem value="FRACIONÁRIO">FRACIONÁRIO</SelectItem>
                </SelectContent>
              </Select>

              {/* <Select
                value={tipoMovimentoFilter}
                onValueChange={setTipoMovimentoFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Movimentação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">TODOS</SelectItem>
                  {Array.from(
                    new Set(tiposMovimentacoes.map((t) => t.nome))
                  ).map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

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
                          -{" "}
                          {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      <span>Período da movimentação</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0"
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
          </div>
        </CardContent>
        {hasActiveFilters() && (
          <div className="px-6 pb-6 flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={clearFilters}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar filtros
            </Button>
          </div>
        )}
      </Card>

      {/* Ações */}
      <div className="flex justify-start">
        <Button variant="outline" onClick={handleExportar}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Tabela de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Tipo de Movimentação</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovimentacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhuma movimentação encontrada para os filtros
                        informados.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMovimentacoes.map((mov, index) => {
                    const material = materiaisAgricolas[mov.idItem];
                    const tipo = getTipoMovimentacao(mov.tipoMovimento);
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-sm">
                          {new Date(mov.data).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {material?.nomeComercial ||
                                material?.descricao ||
                                "Item não encontrado"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {mov.idItem}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tipo === "entrada" ? "default" : "secondary"
                            }
                            className="flex items-center gap-1 w-fit"
                          >
                            {tipo === "entrada" ? (
                              <>
                                <ArrowUp className="h-3 w-3" />
                                {mov.tipoMovimento}
                              </>
                            ) : (
                              <>
                                <ArrowDown className="h-3 w-3" />
                                {mov.tipoMovimento}
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {localizacoes[mov.idLocOrigem] || mov.idLocOrigem}
                        </TableCell>
                        <TableCell>
                          {mov.idLocDestino
                            ? localizacoes[mov.idLocDestino] || mov.idLocDestino
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{mov.qtde}</span>
                        </TableCell>
                        <TableCell className="text-left">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerDetalhes(mov)}
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

      {/* Modal de Detalhes */}
      <Dialog open={detalhesDialogOpen} onOpenChange={setDetalhesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Movimentação</DialogTitle>
            <DialogDescription>
              Informações completas da movimentação selecionada
            </DialogDescription>
          </DialogHeader>
          {movimentacaoSelecionada && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Data/hora da movimentação */}
              <div>
                <Label className="text-muted-foreground">
                  Data/hora da movimentação
                </Label>
                <p className="text-sm font-medium">
                  {new Date(movimentacaoSelecionada.data).toLocaleDateString(
                    "pt-BR"
                  )}
                  {movimentacaoSelecionada.hora &&
                    ` às ${movimentacaoSelecionada.hora}`}
                </p>
              </div>

              {/* Nota de entrada associada (se houver) */}
              <div>
                <Label className="text-muted-foreground">
                  Nota de entrada associada
                </Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.notaEntrada
                    ? movimentacaoSelecionada.notaEntrada
                    : "-"}
                </p>
              </div>

              {/* Item (Nome e Código Externo) */}
              <div className="col-span-2">
                <Label className="text-muted-foreground">Item</Label>
                <div>
                  <p className="text-sm font-medium">
                    {materiaisAgricolas[movimentacaoSelecionada.idItem]
                      ?.nomeComercial ||
                      materiaisAgricolas[movimentacaoSelecionada.idItem]
                        ?.descricao ||
                      "Item não encontrado"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Código Externo:{" "}
                    {materiaisAgricolas[movimentacaoSelecionada.idItem]
                      ?.codigo || "-"}
                  </p>
                </div>
              </div>

              {/* Unidade */}
              <div>
                <Label className="text-muted-foreground">Unidade</Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.unidade}
                </p>
              </div>

              {/* Quantidade movimentada + unidade */}
              <div>
                <Label className="text-muted-foreground">
                  Quantidade movimentada
                </Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.qtde}{" "}
                  {movimentacaoSelecionada.unidade}
                </p>
              </div>

              {/* Número do Lote */}
              <div>
                <Label className="text-muted-foreground">Número do Lote</Label>
                <p className="text-sm font-medium font-mono">
                  {movimentacaoSelecionada.nLote}
                </p>
              </div>

              {/* Tipo de Movimentação */}
              <div>
                <Label className="text-muted-foreground">
                  Tipo de Movimentação
                </Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.tipoMovimento}
                </p>
              </div>

              {/* Estoque de Origem */}
              <div>
                <Label className="text-muted-foreground">
                  Estoque de Origem
                </Label>
                <p className="text-sm font-medium">
                  {localizacoes[movimentacaoSelecionada.idLocOrigem] ||
                    "Não identificado"}
                </p>
              </div>

              {/* Estoque de Destino (se aplicável) */}
              <div>
                <Label className="text-muted-foreground">
                  Estoque de Destino
                </Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.idLocDestino
                    ? localizacoes[movimentacaoSelecionada.idLocDestino] ||
                      "Não identificado"
                    : "-"}
                </p>
              </div>

              {/* Usuário que realizou a movimentação */}
              <div>
                <Label className="text-muted-foreground">
                  Usuário que realizou a movimentação
                </Label>
                <div>
                  <p className="text-sm font-medium">
                    {usuarios[movimentacaoSelecionada.idUsuario]?.nome ||
                      "Usuário não encontrado"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {usuarios[movimentacaoSelecionada.idUsuario]?.email || "-"}
                  </p>
                </div>
              </div>

              {/* Observações registradas na operação */}
              <div className="col-span-2">
                <Label className="text-muted-foreground">
                  Observações registradas na operação
                </Label>
                <p className="text-sm font-medium whitespace-pre-wrap">
                  {movimentacaoSelecionada.observacoes || "-"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Movimentacoes;
