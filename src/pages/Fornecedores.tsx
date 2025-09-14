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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  Eye,
  ChevronDown,
  Upload,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Tipos
interface Fornecedor {
  id: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpjCpf: string;
  inscricaoEstadual: string;
  endereco: string;
  telefone: string;
  email: string;
  status: "ativo" | "inativo";
  ultimaCompra: string;
  categoria: string;
  observacoes: string;
}

type SortField = keyof Fornecedor;
type SortDirection = "asc" | "desc";

// Mock data para demonstração
const mockFornecedores: Fornecedor[] = [
  {
    id: 1,
    razaoSocial: "AgroQuímica Brasil Ltda",
    nomeFantasia: "Agro Brasil",
    cnpjCpf: "12.345.678/0001-90",
    inscricaoEstadual: "123.456.789.110",
    endereco: "Rua das Flores, 123 - São Paulo/SP",
    telefone: "(11) 99999-9999",
    email: "contato@agroquimica.com.br",
    status: "ativo",
    ultimaCompra: "2024-01-10",
    categoria: "defensivos",
    observacoes: "Fornecedor principal de defensivos",
  },
  {
    id: 2,
    razaoSocial: "Fertilizantes do Norte S.A",
    nomeFantasia: "FertilNorte",
    cnpjCpf: "98.765.432/0001-10",
    inscricaoEstadual: "987.654.321.001",
    endereco: "Av. Industrial, 456 - Fortaleza/CE",
    telefone: "(85) 88888-8888",
    email: "vendas@fertilnorte.com.br",
    status: "ativo",
    ultimaCompra: "2024-01-08",
    categoria: "fertilizantes",
    observacoes: "Ótimo prazo de entrega",
  },
  {
    id: 3,
    razaoSocial: "Sementes Premium Ltda",
    nomeFantasia: "Premium Seeds",
    cnpjCpf: "11.222.333/0001-44",
    inscricaoEstadual: "111.222.333.444",
    endereco: "Rod. GO-060, Km 15 - Goiânia/GO",
    telefone: "(62) 77777-7777",
    email: "comercial@sementespremium.com.br",
    status: "inativo",
    ultimaCompra: "2023-12-20",
    categoria: "sementes",
    observacoes: "Verificar documentação pendente",
  },
  {
    id: 4,
    razaoSocial: "Tecnologia Agrícola EIRELI",
    nomeFantasia: "TecAgro",
    cnpjCpf: "44.555.666/0001-77",
    inscricaoEstadual: "444.555.666.777",
    endereco: "Av. Brasil, 789 - Brasília/DF",
    telefone: "(61) 66666-6666",
    email: "suporte@tecagro.com.br",
    status: "ativo",
    ultimaCompra: "2024-01-05",
    categoria: "equipamentos",
    observacoes: "Fornecedor de equipamentos de alta tecnologia",
  },
  {
    id: 5,
    razaoSocial: "Insumos Rurais ME",
    nomeFantasia: "Rural Insumos",
    cnpjCpf: "777.888.999/0001-10",
    inscricaoEstadual: "777.888.999.000",
    endereco: "Rua do Campo, 321 - Ribeirão Preto/SP",
    telefone: "(16) 55555-5555",
    email: "vendas@ruralinsumos.com.br",
    status: "ativo",
    ultimaCompra: "2024-01-12",
    categoria: "fertilizantes",
    observacoes: "Fornecedor regional com boa qualidade",
  },
  {
    id: 6,
    razaoSocial: "Serviços Agrícolas do Sul Ltda",
    nomeFantasia: "Agro Sul",
    cnpjCpf: "99.888.777/0001-66",
    inscricaoEstadual: "999.888.777.666",
    endereco: "Rua Gaúcha, 654 - Porto Alegre/RS",
    telefone: "(51) 44444-4444",
    email: "comercial@agrosul.com.br",
    status: "ativo",
    ultimaCompra: "2024-01-15",
    categoria: "servicos",
    observacoes: "Serviços de consultoria e aplicação",
  },
  {
    id: 7,
    razaoSocial: "Equipamentos Rurais Nordeste Ltda",
    nomeFantasia: "EquipNordeste",
    cnpjCpf: "55.666.777/0001-88",
    inscricaoEstadual: "555.666.777.888",
    endereco: "Av. Nordeste, 987 - Recife/PE",
    telefone: "(81) 33333-3333",
    email: "vendas@equipnordeste.com.br",
    status: "inativo",
    ultimaCompra: "2023-11-30",
    categoria: "equipamentos",
    observacoes: "Revisar contrato de fornecimento",
  },
  {
    id: 8,
    razaoSocial: "Bio Defensivos Orgânicos Ltda",
    nomeFantasia: "Bio Organic",
    cnpjCpf: "33.444.555/0001-22",
    inscricaoEstadual: "333.444.555.222",
    endereco: "Fazenda Orgânica, s/n - Campo Grande/MS",
    telefone: "(67) 22222-2222",
    email: "contato@bioorganic.com.br",
    status: "ativo",
    ultimaCompra: "2024-01-18",
    categoria: "defensivos",
    observacoes: "Especializado em produtos orgânicos",
  },
  {
    id: 9,
    razaoSocial: "Sementes Híbridas Centro-Oeste ME",
    nomeFantasia: "Híbridas CO",
    cnpjCpf: "66.777.888/0001-99",
    inscricaoEstadual: "666.777.888.999",
    endereco: "Rod. BR-364, Km 50 - Cuiabá/MT",
    telefone: "(65) 11111-1111",
    email: "vendas@hibridasc.com.br",
    status: "ativo",
    ultimaCompra: "2024-01-20",
    categoria: "sementes",
    observacoes: "Variedades adaptadas ao cerrado",
  },
  {
    id: 10,
    razaoSocial: "Fertilizantes Especiais Ltda",
    nomeFantasia: "FertilEspecial",
    cnpjCpf: "88.999.000/0001-11",
    inscricaoEstadual: "888.999.000.111",
    endereco: "Distrito Industrial, 111 - Uberlândia/MG",
    telefone: "(34) 99999-0000",
    email: "comercial@fertilespecial.com.br",
    status: "ativo",
    ultimaCompra: "2024-01-22",
    categoria: "fertilizantes",
    observacoes: "Fertilizantes de liberação controlada",
  },
  {
    id: 11,
    razaoSocial: "Consultoria Agrícola Avançada EIRELI",
    nomeFantasia: "Agro Consultoria",
    cnpjCpf: "22.333.444/0001-55",
    inscricaoEstadual: "222.333.444.555",
    endereco: "Centro Empresarial, 777 - Campinas/SP",
    telefone: "(19) 88888-7777",
    email: "contato@agroconsultoria.com.br",
    status: "inativo",
    ultimaCompra: "2023-10-15",
    categoria: "servicos",
    observacoes: "Contrato suspenso temporariamente",
  },
  {
    id: 12,
    razaoSocial: "Máquinas Agrícolas Oeste Ltda",
    nomeFantasia: "MaqOeste",
    cnpjCpf: "77.888.999/0001-00",
    inscricaoEstadual: "777.888.999.000",
    endereco: "Parque Industrial, 888 - Rondonópolis/MT",
    telefone: "(66) 77777-6666",
    email: "vendas@maqoeste.com.br",
    status: "ativo",
    ultimaCompra: "2024-01-25",
    categoria: "equipamentos",
    observacoes: "Equipamentos de grande porte",
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
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(mockFornecedores);
  
  // Estados para modais
  const [dialogCadastroAberto, setDialogCadastroAberto] = useState(false);
  const [dialogConsultaAberto, setDialogConsultaAberto] = useState(false);
  const [dialogImportAberto, setDialogImportAberto] = useState(false);
  
  // Estados para edição e consulta
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);
  const [fornecedorConsultando, setFornecedorConsultando] = useState<Fornecedor | null>(null);
  
  // Estados para filtros e busca
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  
  // Estados para ordenação
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  
  // Estados para importação CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvPreview, setCsvPreview] = useState(false);

  // Formulário
  const [formulario, setFormulario] = useState<Partial<Fornecedor>>({
    razaoSocial: "",
    nomeFantasia: "",
    cnpjCpf: "",
    inscricaoEstadual: "",
    endereco: "",
    telefone: "",
    email: "",
    categoria: "",
    observacoes: "",
  });

  // Função para ordenação
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Função para filtrar e ordenar dados
  const getFornecedoresFiltradosEOrdenados = () => {
    let filtrados = fornecedores.filter((fornecedor) => {
      const matchPesquisa =
        fornecedor.razaoSocial.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        fornecedor.nomeFantasia.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
        fornecedor.cnpjCpf.includes(termoPesquisa) ||
        fornecedor.email.toLowerCase().includes(termoPesquisa.toLowerCase());
      
      const matchCategoria =
        filtroCategoria === "todos" || fornecedor.categoria === filtroCategoria;
      
      const matchStatus =
        filtroStatus === "todos" || fornecedor.status === filtroStatus;

      return matchPesquisa && matchCategoria && matchStatus;
    });

    // Ordenação
    filtrados.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        const comparison = aVal.localeCompare(bVal);
        return sortDirection === "asc" ? comparison : -comparison;
      }
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

    return filtrados;
  };

  // Dados paginados
  const fornecedoresFiltrados = getFornecedoresFiltradosEOrdenados();
  const totalPaginas = Math.ceil(fornecedoresFiltrados.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const fornecedoresPaginados = fornecedoresFiltrados.slice(indiceInicial, indiceFinal);

  // Funções CRUD
  const handleCriarFornecedor = () => {
    if (!formulario.razaoSocial || !formulario.cnpjCpf || !formulario.endereco || !formulario.telefone) {
      toast({ 
        title: "Erro de Validação", 
        description: "Preencha todos os campos obrigatórios: Razão Social, CNPJ/CPF, Endereço e Telefone.",
        variant: "destructive" 
      });
      return;
    }

    const novoFornecedor: Fornecedor = {
      id: Math.max(...fornecedores.map(f => f.id)) + 1,
      razaoSocial: formulario.razaoSocial || "",
      nomeFantasia: formulario.nomeFantasia || "",
      cnpjCpf: formulario.cnpjCpf || "",
      inscricaoEstadual: formulario.inscricaoEstadual || "",
      endereco: formulario.endereco || "",
      telefone: formulario.telefone || "",
      email: formulario.email || "",
      categoria: formulario.categoria || "",
      observacoes: formulario.observacoes || "",
      status: "ativo",
      ultimaCompra: "Nunca",
    };

    if (fornecedorEditando) {
      setFornecedores(prev => prev.map(f => f.id === fornecedorEditando.id ? { ...novoFornecedor, id: fornecedorEditando.id } : f));
      toast({ title: "Fornecedor atualizado com sucesso!", variant: "default" });
    } else {
      setFornecedores(prev => [...prev, novoFornecedor]);
      toast({ title: "Fornecedor cadastrado com sucesso!", variant: "default" });
    }

    resetarFormulario();
    setDialogCadastroAberto(false);
  };

  const handleEditarFornecedor = (fornecedor: Fornecedor) => {
    setFornecedorEditando(fornecedor);
    setFormulario(fornecedor);
    setDialogCadastroAberto(true);
  };

  const handleConsultarFornecedor = (fornecedor: Fornecedor) => {
    setFornecedorConsultando(fornecedor);
    setDialogConsultaAberto(true);
  };

  const handleDesativarFornecedor = (id: number) => {
    setFornecedores(prev => prev.map(f => 
      f.id === id ? { ...f, status: f.status === "ativo" ? "inativo" : "ativo" } : f
    ));
    const fornecedor = fornecedores.find(f => f.id === id);
    const novoStatus = fornecedor?.status === "ativo" ? "inativo" : "ativo";
    toast({ 
      title: `Fornecedor ${novoStatus === "inativo" ? "desativado" : "reativado"} com sucesso!`, 
      variant: "default" 
    });
  };

  // Função para limpar filtros
  const limparFiltros = () => {
    setTermoPesquisa("");
    setFiltroCategoria("todos");
    setFiltroStatus("todos");
    setPaginaAtual(1);
    toast({ title: "Filtros limpos!", variant: "default" });
  };

  // Função para resetar formulário
  const resetarFormulario = () => {
    setFormulario({
      razaoSocial: "",
      nomeFantasia: "",
      cnpjCpf: "",
      inscricaoEstadual: "",
      endereco: "",
      telefone: "",
      email: "",
      categoria: "",
      observacoes: "",
    });
    setFornecedorEditando(null);
  };

  // Funções para importação CSV
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        }).filter(row => row.razaoSocial); // Remove linhas vazias
        
        setCsvData(data);
        setCsvPreview(true);
      };
      reader.readAsText(file);
    } else {
      toast({ 
        title: "Erro", 
        description: "Por favor, selecione um arquivo CSV válido.", 
        variant: "destructive" 
      });
    }
  };

  const importarCSV = () => {
    const novosIds = csvData.map((_, index) => Math.max(...fornecedores.map(f => f.id)) + index + 1);
    const novosFornecedores: Fornecedor[] = csvData.map((item, index) => ({
      id: novosIds[index],
      razaoSocial: item.razaoSocial || "",
      nomeFantasia: item.nomeFantasia || "",
      cnpjCpf: item.cnpjCpf || "",
      inscricaoEstadual: item.inscricaoEstadual || "",
      endereco: item.endereco || "",
      telefone: item.telefone || "",
      email: item.email || "",
      categoria: item.categoria || "outros",
      observacoes: item.observacoes || "",
      status: "ativo",
      ultimaCompra: "Nunca",
    }));

    setFornecedores(prev => [...prev, ...novosFornecedores]);
    toast({ 
      title: "Importação concluída!", 
      description: `${novosFornecedores.length} fornecedores importados com sucesso.`,
      variant: "default" 
    });
    
    setCsvFile(null);
    setCsvData([]);
    setCsvPreview(false);
    setDialogImportAberto(false);
  };

  const downloadTemplate = () => {
    const csvContent = "razaoSocial,nomeFantasia,cnpjCpf,inscricaoEstadual,endereco,telefone,email,categoria,observacoes\n" +
                     "Exemplo Fornecedor Ltda,Exemplo,12.345.678/0001-90,123.456.789.110,Rua Exemplo 123,11999999999,contato@exemplo.com,defensivos,Observações do fornecedor";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'template_fornecedores.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Funções auxiliares
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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestão de Fornecedores
          </h1>
          <p className="text-muted-foreground">
            Gerencie fornecedores de defensivos, fertilizantes e outros insumos
          </p>
        </div>
        <div className="flex gap-2">
          {/* Botão Importar */}
          <Dialog open={dialogImportAberto} onOpenChange={setDialogImportAberto}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Importar Fornecedores</DialogTitle>
                <DialogDescription>
                  Importe fornecedores através de arquivo CSV. Baixe o template para o formato correto.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Template CSV</h4>
                    <p className="text-sm text-muted-foreground">
                      Baixe o modelo com o formato correto para importação
                    </p>
                  </div>
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Template
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="csvFile">Arquivo CSV</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </div>

                {csvPreview && csvData.length > 0 && (
                  <div className="space-y-2">
                    <Label>Prévia dos Dados ({csvData.length} registros)</Label>
                    <div className="max-h-60 overflow-auto border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Razão Social</TableHead>
                            <TableHead>Nome Fantasia</TableHead>
                            <TableHead>CNPJ/CPF</TableHead>
                            <TableHead>Categoria</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {csvData.slice(0, 5).map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.razaoSocial}</TableCell>
                              <TableCell>{item.nomeFantasia}</TableCell>
                              <TableCell>{item.cnpjCpf}</TableCell>
                              <TableCell>{item.categoria}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {csvData.length > 5 && (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          ... e mais {csvData.length - 5} registros
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogImportAberto(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={importarCSV} 
                  disabled={!csvPreview || csvData.length === 0}
                >
                  Importar {csvData.length} Fornecedores
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Botão Adicionar */}
          <Dialog
            open={dialogCadastroAberto}
            onOpenChange={(open) => {
              setDialogCadastroAberto(open);
              if (!open) resetarFormulario();
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {fornecedorEditando ? "Editar Fornecedor" : "Cadastrar Novo Fornecedor"}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do fornecedor. Campos marcados com * são obrigatórios.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="razaoSocial">Razão Social *</Label>
                    <Input
                      id="razaoSocial"
                      value={formulario.razaoSocial || ""}
                      onChange={(e) =>
                        setFormulario(prev => ({ ...prev, razaoSocial: e.target.value }))
                      }
                      placeholder="Nome da empresa fornecedora"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                    <Input
                      id="nomeFantasia"
                      value={formulario.nomeFantasia || ""}
                      onChange={(e) =>
                        setFormulario(prev => ({ ...prev, nomeFantasia: e.target.value }))
                      }
                      placeholder="Nome fantasia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpjCpf">CNPJ/CPF *</Label>
                    <Input
                      id="cnpjCpf"
                      value={formulario.cnpjCpf || ""}
                      onChange={(e) =>
                        setFormulario(prev => ({ ...prev, cnpjCpf: e.target.value }))
                      }
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                    <Input
                      id="inscricaoEstadual"
                      value={formulario.inscricaoEstadual || ""}
                      onChange={(e) =>
                        setFormulario(prev => ({ ...prev, inscricaoEstadual: e.target.value }))
                      }
                      placeholder="000.000.000.000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select
                      value={formulario.categoria || ""}
                      onValueChange={(value) =>
                        setFormulario(prev => ({ ...prev, categoria: value }))
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
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="endereco">Endereço Completo *</Label>
                    <Input
                      id="endereco"
                      value={formulario.endereco || ""}
                      onChange={(e) =>
                        setFormulario(prev => ({ ...prev, endereco: e.target.value }))
                      }
                      placeholder="Rua, número, bairro, cidade/estado"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formulario.telefone || ""}
                      onChange={(e) =>
                        setFormulario(prev => ({ ...prev, telefone: e.target.value }))
                      }
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formulario.email || ""}
                      onChange={(e) =>
                        setFormulario(prev => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="contato@fornecedor.com.br"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formulario.observacoes || ""}
                      onChange={(e) =>
                        setFormulario(prev => ({ ...prev, observacoes: e.target.value }))
                      }
                      placeholder="Informações adicionais sobre o fornecedor..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogCadastroAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCriarFornecedor}>
                  {fornecedorEditando ? "Atualizar" : "Cadastrar"} Fornecedor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros e Pesquisa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pesquisa">Busca Geral</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pesquisa"
                  placeholder="Razão social, nome fantasia, CNPJ..."
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
                onClick={limparFiltros}
              >
                <X className="h-4 w-4 mr-2" />
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
            {fornecedoresFiltrados.length > itensPorPagina && 
              ` - Página ${paginaAtual} de ${totalPaginas}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("razaoSocial")}>
                  <div className="flex items-center gap-2">
                    Razão Social
                    {getSortIcon("razaoSocial")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("nomeFantasia")}>
                  <div className="flex items-center gap-2">
                    Nome Fantasia
                    {getSortIcon("nomeFantasia")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("cnpjCpf")}>
                  <div className="flex items-center gap-2">
                    CNPJ/CPF
                    {getSortIcon("cnpjCpf")}
                  </div>
                </TableHead>
                <TableHead>Inscrição Estadual</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("telefone")}>
                  <div className="flex items-center gap-2">
                    Telefone
                    {getSortIcon("telefone")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                  <div className="flex items-center gap-2">
                    E-mail
                    {getSortIcon("email")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-2">
                    Status
                    {getSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("ultimaCompra")}>
                  <div className="flex items-center gap-2">
                    Última Compra
                    {getSortIcon("ultimaCompra")}
                  </div>
                </TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedoresPaginados.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell>
                    <div className="font-medium">{fornecedor.razaoSocial}</div>
                    <div className="text-sm text-muted-foreground">
                      <Badge variant={getCategoriaBadge(fornecedor.categoria)} className="text-xs">
                        {getCategoriaLabel(fornecedor.categoria)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{fornecedor.nomeFantasia}</TableCell>
                  <TableCell className="font-mono text-sm">{fornecedor.cnpjCpf}</TableCell>
                  <TableCell className="font-mono text-sm">{fornecedor.inscricaoEstadual}</TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {fornecedor.endereco.length > 30 
                        ? `${fornecedor.endereco.substring(0, 30)}...` 
                        : fornecedor.endereco
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {fornecedor.telefone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {fornecedor.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(fornecedor.status)}>
                      {fornecedor.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{fornecedor.ultimaCompra}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConsultarFornecedor(fornecedor)}
                        title="Consultar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditarFornecedor(fornecedor)}
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            title={fornecedor.status === "ativo" ? "Desativar" : "Reativar"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {fornecedor.status === "ativo" ? "Desativar" : "Reativar"} Fornecedor
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja {fornecedor.status === "ativo" ? "desativar" : "reativar"} o fornecedor "{fornecedor.razaoSocial}"?
                              {fornecedor.status === "ativo" && " Fornecedores desativados não aparecerão em consultas padrão."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDesativarFornecedor(fornecedor.id)}
                              className={fornecedor.status === "ativo" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                            >
                              {fornecedor.status === "ativo" ? "Desativar" : "Reativar"}
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

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
                      }}
                      className={paginaAtual === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                    <PaginationItem key={pagina}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPaginaAtual(pagina);
                        }}
                        isActive={pagina === paginaAtual}
                        className="cursor-pointer"
                      >
                        {pagina}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
                      }}
                      className={paginaAtual === totalPaginas ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Consulta */}
      <Dialog open={dialogConsultaAberto} onOpenChange={setDialogConsultaAberto}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Consultar Fornecedor</DialogTitle>
            <DialogDescription>
              Visualização completa dos dados do fornecedor (somente leitura).
            </DialogDescription>
          </DialogHeader>
          {fornecedorConsultando && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>ID</Label>
                  <div className="p-2 bg-muted rounded-md text-sm">
                    {fornecedorConsultando.id}
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Razão Social</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {fornecedorConsultando.razaoSocial}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nome Fantasia</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {fornecedorConsultando.nomeFantasia}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>CNPJ/CPF</Label>
                  <div className="p-2 bg-muted rounded-md font-mono">
                    {fornecedorConsultando.cnpjCpf}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Inscrição Estadual</Label>
                  <div className="p-2 bg-muted rounded-md font-mono">
                    {fornecedorConsultando.inscricaoEstadual}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <div className="p-2 bg-muted rounded-md">
                    <Badge variant={getCategoriaBadge(fornecedorConsultando.categoria)}>
                      {getCategoriaLabel(fornecedorConsultando.categoria)}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Endereço</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {fornecedorConsultando.endereco}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {fornecedorConsultando.telefone}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {fornecedorConsultando.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="p-2 bg-muted rounded-md">
                    <Badge variant={getStatusBadge(fornecedorConsultando.status)}>
                      {fornecedorConsultando.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Última Compra</Label>
                  <div className="p-2 bg-muted rounded-md">
                    {fornecedorConsultando.ultimaCompra}
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Observações</Label>
                  <div className="p-2 bg-muted rounded-md min-h-[80px]">
                    {fornecedorConsultando.observacoes || "Nenhuma observação cadastrada"}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogConsultaAberto(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fornecedores;