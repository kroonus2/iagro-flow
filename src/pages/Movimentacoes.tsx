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
  Download,
  Search,
  ArrowDown,
  ArrowUp,
  HelpCircle,
  Plus,
  Minus,
  Eye,
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

// Dados simulados de materiais agrícolas (vinculados ao InsumosAgricolas.tsx)
// Em produção, isso viria de uma API ou contexto compartilhado
const materiaisAgricolas: {
  [key: number]: { codigo: string; descricao: string; nomeComercial: string };
} = {
  1005392: {
    codigo: "1005392",
    descricao: "HERBICIDA NUFARM U 46 BR",
    nomeComercial: "U 46 BR",
  },
  1027638: {
    codigo: "1027638",
    descricao: "HERBICIDA UPL DEZ",
    nomeComercial: "DEZ",
  },
  1027636: {
    codigo: "1027636",
    descricao: "HERBICIDA IHARA MIRANT",
    nomeComercial: "MIRANT",
  },
  1003390: {
    codigo: "1003390",
    descricao: "FERTILIZANTE",
    nomeComercial: "FERTILIZANTE",
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
  idItem: number;
  nLote: string;
  tipoMovimento: string;
  idLocOrigem: number;
  idLocDestino: number | null;
  qtde: number;
  unidade: string;
  idUsuario: number;
};

const Movimentacoes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [dataFilter, setDataFilter] = useState("");
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
      idItem: 1005392,
      nLote: "NR42123259600",
      tipoMovimento: "PRODUÇÃO",
      idLocOrigem: 1,
      idLocDestino: 4,
      qtde: 1000,
      unidade: "L",
      idUsuario: 1,
    },
    {
      data: "2025-10-16",
      idItem: 1027638,
      nLote: "SY003-24-20-160",
      tipoMovimento: "PERDA TECNICO",
      idLocOrigem: 5,
      idLocDestino: 5,
      qtde: 100,
      unidade: "L",
      idUsuario: 1,
    },
    {
      data: "2025-10-17",
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
      idItem: 1027638,
      nLote: "SY003-24-20-160",
      tipoMovimento: "PRODUÇÃO-FRACIONÁRIO",
      idLocOrigem: 1,
      idLocDestino: 2,
      qtde: 950,
      unidade: "L",
      idUsuario: 1,
    },
    {
      data: "2025-10-13",
      idItem: 1005392,
      nLote: "NR42123259600",
      tipoMovimento: "PRODUÇÃO",
      idLocOrigem: 1,
      idLocDestino: 4,
      qtde: 67.25,
      unidade: "KG",
      idUsuario: 1,
    },
  ];

  // Determinar tipo (entrada/saída) baseado no tipo de movimentação
  const getTipoMovimentacao = (tipoMov: string): "entrada" | "saida" => {
    const tiposEntrada = ["DEVOLUÇÃO"];
    return tiposEntrada.includes(tipoMov) ? "entrada" : "saida";
  };

  const filteredMovimentacoes = movimentacoes.filter((mov) => {
    const material = materiaisAgricolas[mov.idItem];
    const materialNome = material?.nomeComercial || material?.descricao || "";
    const matchesSearch =
      mov.idItem.toString().includes(searchTerm) ||
      materialNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.nLote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.tipoMovimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (localizacoes[mov.idLocOrigem] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (mov.idLocDestino &&
        (localizacoes[mov.idLocDestino] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const tipo = getTipoMovimentacao(mov.tipoMovimento);
    const matchesTipo = tipoFilter === "todos" || tipo === tipoFilter;
    const matchesData = !dataFilter || mov.data === dataFilter;

    return matchesSearch && matchesTipo && matchesData;
  });

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

        <Button variant="outline" onClick={handleExportar}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID item, produto, lote, tipo ou localização"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              placeholder="Filtrar por data"
              value={dataFilter}
              onChange={(e) => setDataFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total de Movimentações
                </p>
                <p className="text-2xl font-bold">
                  {filteredMovimentacoes.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Entradas</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    filteredMovimentacoes.filter(
                      (m) => getTipoMovimentacao(m.tipoMovimento) === "entrada"
                    ).length
                  }
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saídas</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    filteredMovimentacoes.filter(
                      (m) => getTipoMovimentacao(m.tipoMovimento) === "saida"
                    ).length
                  }
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ArrowDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
                  <TableHead>Tipo Movimento</TableHead>
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
                        Nenhuma movimentação encontrada
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
              <div>
                <Label className="text-muted-foreground">Data</Label>
                <p className="text-sm font-medium">
                  {new Date(movimentacaoSelecionada.data).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">ID Item</Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.idItem}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Item</Label>
                <p className="text-sm font-medium">
                  {materiaisAgricolas[movimentacaoSelecionada.idItem]
                    ?.nomeComercial ||
                    materiaisAgricolas[movimentacaoSelecionada.idItem]
                      ?.descricao ||
                    "Item não encontrado"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">
                  Tipo de Movimento
                </Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.tipoMovimento}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Quantidade</Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.qtde}{" "}
                  {movimentacaoSelecionada.unidade}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Origem (ID)</Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.idLocOrigem} -{" "}
                  {localizacoes[movimentacaoSelecionada.idLocOrigem] ||
                    "Não identificado"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Destino (ID)</Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.idLocDestino
                    ? `${movimentacaoSelecionada.idLocDestino} - ${
                        localizacoes[movimentacaoSelecionada.idLocDestino] ||
                        "Não identificado"
                      }`
                    : "-"}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Número do Lote</Label>
                <p className="text-sm font-medium font-mono">
                  {movimentacaoSelecionada.nLote}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Unidade</Label>
                <p className="text-sm font-medium">
                  {movimentacaoSelecionada.unidade}
                </p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Usuário</Label>
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Movimentacoes;
