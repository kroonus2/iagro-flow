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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Building,
  MapPin,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data para demonstração
const mockFornecedores = [
  {
    id: 1,
    nome: "AgroQuímica Brasil Ltda",
    cnpj: "12.345.678/0001-90",
    contato: "João Silva",
    telefone: "(11) 99999-9999",
    email: "contato@agroquimica.com.br",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    categoria: "defensivos",
    status: "ativo",
    ultimaCompra: "2024-01-10",
    observacoes: "Fornecedor principal de defensivos",
  },
  {
    id: 2,
    nome: "Fertilizantes do Norte S.A",
    cnpj: "98.765.432/0001-10",
    contato: "Maria Santos",
    telefone: "(85) 88888-8888",
    email: "vendas@fertilnorte.com.br",
    endereco: "Av. Industrial, 456 - Fortaleza/CE",
    categoria: "fertilizantes",
    status: "ativo",
    ultimaCompra: "2024-01-08",
    observacoes: "Ótimo prazo de entrega",
  },
  {
    id: 3,
    nome: "Sementes Premium",
    cnpj: "11.222.333/0001-44",
    contato: "Pedro Costa",
    telefone: "(62) 77777-7777",
    email: "comercial@sementespremium.com.br",
    endereco: "Rod. GO-060, Km 15 - Goiânia/GO",
    categoria: "sementes",
    status: "inativo",
    ultimaCompra: "2023-12-20",
    observacoes: "Verificar documentação pendente",
  },
];

const categoriasFornecedor = [
  { value: "defensivos", label: "Defensivos Agrícolas" },
  { value: "fertilizantes", label: "Fertilizantes" },
  { value: "sementes", label: "Sementes" },
  { value: "equipamentos", label: "Equipamentos" },
  { value: "servicos", label: "Serviços" },
  { value: "outros", label: "Outros" },
];

const Fornecedores = () => {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState(mockFornecedores);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState<any>(null);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: "",
    cnpj: "",
    contato: "",
    telefone: "",
    email: "",
    endereco: "",
    categoria: "",
    observacoes: "",
  });

  const fornecedoresFiltrados = fornecedores.filter((fornecedor) => {
    const matchPesquisa =
      fornecedor.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      fornecedor.cnpj.includes(termoPesquisa) ||
      fornecedor.contato.toLowerCase().includes(termoPesquisa.toLowerCase());
    const matchCategoria =
      filtroCategoria === "todos" || fornecedor.categoria === filtroCategoria;
    const matchStatus =
      filtroStatus === "todos" || fornecedor.status === filtroStatus;

    return matchPesquisa && matchCategoria && matchStatus;
  });

  const handleCriarFornecedor = () => {
    const fornecedor = {
      id: fornecedores.length + 1,
      ...novoFornecedor,
      status: "ativo",
      ultimaCompra: "Nunca",
    };
    setFornecedores([...fornecedores, fornecedor]);
    setNovoFornecedor({
      nome: "",
      cnpj: "",
      contato: "",
      telefone: "",
      email: "",
      endereco: "",
      categoria: "",
      observacoes: "",
    });
    setDialogAberto(false);
    toast({ title: "Fornecedor cadastrado com sucesso!", variant: "default" });
  };

  const handleEditarFornecedor = (fornecedor: any) => {
    setFornecedorEditando(fornecedor);
    setNovoFornecedor(fornecedor);
    setDialogAberto(true);
  };

  const handleExcluirFornecedor = (id: number) => {
    setFornecedores(fornecedores.filter((f) => f.id !== id));
    toast({ title: "Fornecedor removido com sucesso!", variant: "default" });
  };

  const getStatusBadge = (status: string) => {
    return status === "ativo" ? "default" : "secondary";
  };

  const getCategoriaBadge = (categoria: string) => {
    const cores = {
      defensivos: "destructive",
      fertilizantes: "default",
      sementes: "secondary",
      equipamentos: "outline",
      servicos: "outline",
      outros: "outline",
    };
    return (cores[categoria as keyof typeof cores] || "outline") as
      | "default"
      | "destructive"
      | "secondary"
      | "outline";
  };

  const getCategoriaLabel = (categoria: string) => {
    const cat = categoriasFornecedor.find((c) => c.value === categoria);
    return cat ? cat.label : categoria;
  };

  const resetarFormulario = () => {
    setNovoFornecedor({
      nome: "",
      cnpj: "",
      contato: "",
      telefone: "",
      email: "",
      endereco: "",
      categoria: "",
      observacoes: "",
    });
    setFornecedorEditando(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Fornecedores
          </h1>
          <p className="text-muted-foreground">
            Gerencie fornecedores de defensivos, fertilizantes e outros insumos
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
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {fornecedorEditando
                  ? "Editar Fornecedor"
                  : "Cadastrar Novo Fornecedor"}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do fornecedor.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="nome">Razão Social / Nome da Empresa</Label>
                  <Input
                    id="nome"
                    value={novoFornecedor.nome}
                    onChange={(e) =>
                      setNovoFornecedor({
                        ...novoFornecedor,
                        nome: e.target.value,
                      })
                    }
                    placeholder="Nome da empresa fornecedora"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={novoFornecedor.cnpj}
                    onChange={(e) =>
                      setNovoFornecedor({
                        ...novoFornecedor,
                        cnpj: e.target.value,
                      })
                    }
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={novoFornecedor.categoria}
                    onValueChange={(value) =>
                      setNovoFornecedor({ ...novoFornecedor, categoria: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasFornecedor.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contato">Pessoa de Contato</Label>
                  <Input
                    id="contato"
                    value={novoFornecedor.contato}
                    onChange={(e) =>
                      setNovoFornecedor({
                        ...novoFornecedor,
                        contato: e.target.value,
                      })
                    }
                    placeholder="Nome do responsável"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={novoFornecedor.telefone}
                    onChange={(e) =>
                      setNovoFornecedor({
                        ...novoFornecedor,
                        telefone: e.target.value,
                      })
                    }
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoFornecedor.email}
                    onChange={(e) =>
                      setNovoFornecedor({
                        ...novoFornecedor,
                        email: e.target.value,
                      })
                    }
                    placeholder="contato@fornecedor.com.br"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input
                    id="endereco"
                    value={novoFornecedor.endereco}
                    onChange={(e) =>
                      setNovoFornecedor({
                        ...novoFornecedor,
                        endereco: e.target.value,
                      })
                    }
                    placeholder="Rua, número, bairro, cidade/estado"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={novoFornecedor.observacoes}
                    onChange={(e) =>
                      setNovoFornecedor({
                        ...novoFornecedor,
                        observacoes: e.target.value,
                      })
                    }
                    placeholder="Informações adicionais sobre o fornecedor..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCriarFornecedor}>
                {fornecedorEditando ? "Atualizar" : "Cadastrar"} Fornecedor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros e Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pesquisa">Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pesquisa"
                  placeholder="Nome, CNPJ ou contato..."
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={filtroCategoria}
                onValueChange={setFiltroCategoria}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as categorias</SelectItem>
                  {categoriasFornecedor.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
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
                  setFiltroCategoria("todos");
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
              <Building className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{fornecedores.length}</p>
                <p className="text-xs text-muted-foreground">
                  Total Fornecedores
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Badge className="h-8 w-8 text-success bg-success/10">A</Badge>
              <div>
                <p className="text-2xl font-bold">
                  {fornecedores.filter((f) => f.status === "ativo").length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fornecedores Ativos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">
                  {categoriasFornecedor.length}
                </p>
                <p className="text-xs text-muted-foreground">Categorias</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Badge className="h-8 w-8 text-muted-foreground bg-muted">
                I
              </Badge>
              <div>
                <p className="text-2xl font-bold">
                  {fornecedores.filter((f) => f.status === "inativo").length}
                </p>
                <p className="text-xs text-muted-foreground">Inativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Fornecedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>
            {fornecedoresFiltrados.length} fornecedor(es) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedoresFiltrados.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{fornecedor.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {fornecedor.cnpj}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{fornecedor.contato}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {fornecedor.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCategoriaBadge(fornecedor.categoria)}>
                      {getCategoriaLabel(fornecedor.categoria)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {fornecedor.telefone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(fornecedor.status)}>
                      {fornecedor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{fornecedor.ultimaCompra}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditarFornecedor(fornecedor)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleExcluirFornecedor(fornecedor.id)}
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

export default Fornecedores;
