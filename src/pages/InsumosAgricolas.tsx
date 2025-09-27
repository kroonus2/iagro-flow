import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Package,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileType,
  X,
  Upload,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema de validação
const defensivoSchema = z.object({
  codigo: z
    .string()
    .min(1, "Código é obrigatório")
    .max(20, "Código deve ter no máximo 20 caracteres"),
  nomeComercial: z
    .string()
    .min(1, "Nome comercial é obrigatório")
    .max(200, "Nome deve ter no máximo 200 caracteres"),
  unidade: z.string().min(1, "Unidade é obrigatória"),
  principioAtivo: z.string().min(1, "Princípio ativo é obrigatório"),
  fabricante: z.string().min(1, "Fabricante é obrigatório"),
  indice: z.number().min(0, "Índice deve ser positivo"),
  embalagem: z.string().min(1, "Embalagem é obrigatória"),
  maximo: z.number().min(0, "Valor máximo deve ser positivo"),
  minimo: z.number().min(0, "Valor mínimo deve ser positivo"),
});
import { toast } from "sonner";

// Tipo para o defensivo
type Defensivo = {
  id: number;
  codigo: string;
  nomeComercial: string;
  unidade: string;
  principioAtivo: string;
  fabricante: string;
  indice: number;
  embalagem: string;
  maximo: number;
  minimo: number;
  ativo: boolean;
};

const InsumosAgricolas = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Defensivo | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedDefensivo, setSelectedDefensivo] = useState<Defensivo | null>(
    null
  );
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportCSVDialog, setShowImportCSVDialog] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [isProcessingCSV, setIsProcessingCSV] = useState(false);
  const [filters, setFilters] = useState({
    nomeComercial: "",
    fabricante: "",
    embalagem: "",
    unidade: "",
  });

  // Formulário para cadastro/edição
  const form = useForm<z.infer<typeof defensivoSchema>>({
    resolver: zodResolver(defensivoSchema),
    defaultValues: {
      codigo: "",
      nomeComercial: "",
      unidade: "",
      principioAtivo: "",
      fabricante: "",
      indice: 0,
      embalagem: "",
      maximo: 0,
      minimo: 0,
    },
  });

  // Dados simulados expandidos
  const [defensivos, setDefensivos] = useState<Defensivo[]>([
    {
      id: 1,
      codigo: "NAPTOL",
      nomeComercial: "ACETRPILUNAS - BULK",
      unidade: "L",
      principioAtivo: "Glifosato",
      fabricante: "AgroTech",
      indice: 1.2,
      embalagem: "BULK",
      maximo: 1000,
      minimo: 100,
      ativo: true,
    },
    {
      id: 2,
      codigo: "D",
      nomeComercial: "ABCD",
      unidade: "L",
      principioAtivo: "2,4-D",
      fabricante: "ChemCorp",
      indice: 0.8,
      embalagem: "BULK",
      maximo: 500,
      minimo: 50,
      ativo: true,
    },
    {
      id: 3,
      codigo: "STITSTE",
      nomeComercial: "COLADA CD",
      unidade: "L",
      principioAtivo: "Atrazina",
      fabricante: "BioAgro",
      indice: 1.5,
      embalagem: "Fracionado",
      maximo: 200,
      minimo: 20,
      ativo: true,
    },
    {
      id: 4,
      codigo: "2T",
      nomeComercial: "HERBICIDA CABDI ULTRASLOW ADOBE - FUSITRAT BOOX",
      unidade: "L",
      principioAtivo: "Paraquat",
      fabricante: "AgroSolutions",
      indice: 2.1,
      embalagem: "Fracionado",
      maximo: 300,
      minimo: 30,
      ativo: true,
    },
    {
      id: 5,
      codigo: "SEITSA",
      nomeComercial: "INSARA CELAO",
      unidade: "L",
      principioAtivo: "Imidacloprido",
      fabricante: "PestControl",
      indice: 1.8,
      embalagem: "Fracionado",
      maximo: 150,
      minimo: 15,
      ativo: true,
    },
    {
      id: 6,
      codigo: "STITSTR",
      nomeComercial: "STRUSTON",
      unidade: "L",
      principioAtivo: "Glifosato",
      fabricante: "AgroTech",
      indice: 1.0,
      embalagem: "BULK",
      maximo: 800,
      minimo: 80,
      ativo: true,
    },
    {
      id: 7,
      codigo: "SITNSA",
      nomeComercial: "HERBICIDA PREPARA TOSIA SOL GR - FUMANA FD",
      unidade: "L",
      principioAtivo: "Dicamba",
      fabricante: "ChemCorp",
      indice: 1.3,
      embalagem: "Fracionado",
      maximo: 250,
      minimo: 25,
      ativo: true,
    },
    {
      id: 8,
      codigo: "SAETHS",
      nomeComercial: "PACLAM",
      unidade: "L",
      principioAtivo: "Metribuzin",
      fabricante: "BioAgro",
      indice: 0.9,
      embalagem: "Fracionado",
      maximo: 180,
      minimo: 18,
      ativo: true,
    },
    {
      id: 9,
      codigo: "PHSOLS",
      nomeComercial: "PHU BEEF",
      unidade: "KG",
      principioAtivo: "Tiofanato-metílico",
      fabricante: "FungiPro",
      indice: 2.5,
      embalagem: "Fracionado",
      maximo: 100,
      minimo: 10,
      ativo: true,
    },
    {
      id: 10,
      codigo: "ED",
      nomeComercial:
        "CHARLIE CAUSTIC CONCENTRADO FOL DE CRANTE NATURAL CANTAL CASCO",
      unidade: "KG",
      principioAtivo: "Mancozebe",
      fabricante: "AgriChem",
      indice: 1.7,
      embalagem: "Fracionado",
      maximo: 120,
      minimo: 12,
      ativo: true,
    },
    {
      id: 11,
      codigo: "TEST1",
      nomeComercial: "PRODUTO TESTE 1",
      unidade: "L",
      principioAtivo: "Substância A",
      fabricante: "TestCorp",
      indice: 1.1,
      embalagem: "BULK",
      maximo: 600,
      minimo: 60,
      ativo: true,
    },
    {
      id: 12,
      codigo: "TEST2",
      nomeComercial: "PRODUTO TESTE 2",
      unidade: "KG",
      principioAtivo: "Substância B",
      fabricante: "TestCorp",
      indice: 1.4,
      embalagem: "Fracionado",
      maximo: 90,
      minimo: 9,
      ativo: true,
    },
  ]);

  const itemsPerPage = 10;

  // Filtros e busca
  const filteredDefensivos = defensivos.filter((defensivo) => {
    if (!defensivo.ativo) return false;

    const matchesSearch =
      searchTerm === "" ||
      defensivo.nomeComercial
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      defensivo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defensivo.principioAtivo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      defensivo.fabricante.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (filters.nomeComercial === "" ||
        defensivo.nomeComercial
          .toLowerCase()
          .includes(filters.nomeComercial.toLowerCase())) &&
      (filters.fabricante === "" ||
        defensivo.fabricante
          .toLowerCase()
          .includes(filters.fabricante.toLowerCase())) &&
      (filters.embalagem === "" || defensivo.embalagem === filters.embalagem) &&
      (filters.unidade === "" || defensivo.unidade === filters.unidade);

    return matchesSearch && matchesFilters;
  });

  // Ordenação
  const sortedDefensivos = [...filteredDefensivos].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Paginação
  const totalPages = Math.ceil(sortedDefensivos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedDefensivos.slice(startIndex, endIndex);

  // Handlers
  const handleSort = (field: keyof Defensivo) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleView = (defensivo: Defensivo) => {
    setSelectedDefensivo(defensivo);
    setShowViewDialog(true);
  };

  const handleEdit = (defensivo: Defensivo) => {
    setSelectedDefensivo(defensivo);
    setShowEditDialog(true);
  };

  const handleDelete = (defensivo: Defensivo) => {
    setSelectedDefensivo(defensivo);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedDefensivo) {
      setDefensivos((prev) =>
        prev.map((d) =>
          d.id === selectedDefensivo.id ? { ...d, ativo: false } : d
        )
      );
      toast({
        title: "Sucesso",
        description: "Defensivo desativado com sucesso!",
      });
      setShowDeleteDialog(false);
      setSelectedDefensivo(null);
    }
  };

  const handleAddNew = () => {
    setSelectedDefensivo(null);
    form.reset();
    setShowAddDialog(true);
  };

  const handleImportCSV = () => {
    setShowImportCSVDialog(true);
  };

  const handleImportXML = () => {
    toast({
      title: "Info",
      description: "Funcionalidade de importação XML em desenvolvimento",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      nomeComercial: "",
      fabricante: "",
      embalagem: "",
      unidade: "",
    });
    setCurrentPage(1);
  };

  const getSortIcon = (field: keyof Defensivo) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // Funções do formulário
  const onSubmit = (values: z.infer<typeof defensivoSchema>) => {
    try {
      if (selectedDefensivo) {
        // Editar defensivo existente
        setDefensivos((prev) =>
          prev.map((d) =>
            d.id === selectedDefensivo.id ? { ...d, ...values } : d
          )
        );
        toast({
          title: "Sucesso",
          description: "Defensivo editado com sucesso!",
        });
        setShowEditDialog(false);
      } else {
        // Adicionar novo defensivo
        const newDefensivo: Defensivo = {
          id: Math.max(...defensivos.map((d) => d.id)) + 1,
          codigo: values.codigo,
          nomeComercial: values.nomeComercial,
          unidade: values.unidade,
          principioAtivo: values.principioAtivo,
          fabricante: values.fabricante,
          indice: values.indice,
          embalagem: values.embalagem,
          maximo: values.maximo,
          minimo: values.minimo,
          ativo: true,
        };
        setDefensivos((prev) => [...prev, newDefensivo]);
        toast({
          title: "Sucesso",
          description: "Defensivo cadastrado com sucesso!",
        });
        setShowAddDialog(false);
      }
      form.reset();
      setSelectedDefensivo(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar defensivo. Verifique os dados.",
        variant: "destructive",
      });
    }
  };

  // Funções de importação CSV
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      previewCSV(file);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV válido.",
        variant: "destructive",
      });
    }
  };

  const previewCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",").map((h) => h.trim());

      // Verificar se as colunas obrigatórias estão presentes
      const requiredColumns = [
        "codigo",
        "nomeComercial",
        "unidade",
        "principioAtivo",
        "fabricante",
        "indice",
        "embalagem",
        "maximo",
        "minimo",
      ];
      const missingColumns = requiredColumns.filter(
        (col) => !headers.includes(col)
      );

      if (missingColumns.length > 0) {
        toast({
          title: "Erro",
          description: `Colunas obrigatórias ausentes: ${missingColumns.join(
            ", "
          )}`,
          variant: "destructive",
        });
        return;
      }

      // Processar primeiras 5 linhas para preview
      const preview = lines.slice(1, 6).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        return row;
      });

      setCsvPreview(preview);
    };
    reader.readAsText(file);
  };

  const processCSVImport = async () => {
    if (!csvFile) return;

    setIsProcessingCSV(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());
        const headers = lines[0].split(",").map((h) => h.trim());

        const newDefensivos: Defensivo[] = [];
        let errors = 0;

        lines.slice(1).forEach((line, index) => {
          try {
            const values = line.split(",").map((v) => v.trim());
            const row: any = {};
            headers.forEach((header, idx) => {
              row[header] = values[idx] || "";
            });

            // Validar e converter dados
            const newDefensivo: Defensivo = {
              id:
                Math.max(...defensivos.map((d) => d.id), 0) +
                newDefensivos.length +
                1,
              codigo: row.codigo,
              nomeComercial: row.nomeComercial,
              unidade: row.unidade,
              principioAtivo: row.principioAtivo,
              fabricante: row.fabricante,
              indice: parseFloat(row.indice) || 0,
              embalagem: row.embalagem,
              maximo: parseFloat(row.maximo) || 0,
              minimo: parseFloat(row.minimo) || 0,
              ativo: true,
            };

            // Validação básica
            if (!newDefensivo.codigo || !newDefensivo.nomeComercial) {
              errors++;
              return;
            }

            newDefensivos.push(newDefensivo);
          } catch (error) {
            errors++;
          }
        });

        setDefensivos((prev) => [...prev, ...newDefensivos]);
        toast({
          title: "Sucesso",
          description: `${
            newDefensivos.length
          } defensivos importados com sucesso!${
            errors > 0 ? ` ${errors} linhas com erro foram ignoradas.` : ""
          }`,
        });
        setShowImportCSVDialog(false);
        setCsvFile(null);
        setCsvPreview([]);
      };
      reader.readAsText(csvFile);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar arquivo CSV.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingCSV(false);
    }
  };

  const downloadCSVTemplate = () => {
    const headers = [
      "codigo",
      "nomeComercial",
      "unidade",
      "principioAtivo",
      "fabricante",
      "indice",
      "embalagem",
      "maximo",
      "minimo",
    ];
    const csvContent =
      headers.join(",") +
      "\n" +
      "EXEMPLO1,Produto Exemplo 1,L,Glifosato,FabricanteA,1.2,BULK,1000,100\n" +
      "EXEMPLO2,Produto Exemplo 2,KG,Atrazina,FabricanteB,0.8,Fracionado,500,50";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_defensivos.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Defensivos</h1>
          <p className="text-muted-foreground mt-1">
            Cadastro e gerenciamento de defensivos agrícolas
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Importar
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleImportCSV}>
                <FileText className="h-4 w-4 mr-2" />
                Importar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportXML}>
                <FileType className="h-4 w-4 mr-2" />
                Importar XML
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Filtros e Busca
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Busca Geral */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Busca geral (nome, código, princípio ativo, fabricante...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtros por Coluna */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="filter-nome">Nome Comercial</Label>
                <Input
                  id="filter-nome"
                  placeholder="Filtrar por nome..."
                  value={filters.nomeComercial}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      nomeComercial: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="filter-fabricante">Fabricante</Label>
                <Input
                  id="filter-fabricante"
                  placeholder="Filtrar por fabricante..."
                  value={filters.fabricante}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      fabricante: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="filter-embalagem">Embalagem</Label>
                <Input
                  id="filter-embalagem"
                  placeholder="Ex: BULK, Fracionado"
                  value={filters.embalagem}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      embalagem: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="filter-unidade">Unidade</Label>
                <Input
                  id="filter-unidade"
                  placeholder="Ex: L, KG"
                  value={filters.unidade}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, unidade: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Defensivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Lista de Defensivos Cadastrados
            <span className="text-sm font-normal text-muted-foreground">
              {sortedDefensivos.length} registro(s) encontrado(s)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-2">
                      ID {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("nomeComercial")}
                  >
                    <div className="flex items-center gap-2">
                      Nome Comercial {getSortIcon("nomeComercial")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("unidade")}
                  >
                    <div className="flex items-center gap-2">
                      Unidade {getSortIcon("unidade")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("principioAtivo")}
                  >
                    <div className="flex items-center gap-2">
                      Princípio Ativo {getSortIcon("principioAtivo")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("fabricante")}
                  >
                    <div className="flex items-center gap-2">
                      Fabricante {getSortIcon("fabricante")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("indice")}
                  >
                    <div className="flex items-center gap-2">
                      Índice {getSortIcon("indice")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("embalagem")}
                  >
                    <div className="flex items-center gap-2">
                      Embalagem {getSortIcon("embalagem")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("maximo")}
                  >
                    <div className="flex items-center gap-2">
                      Máximo {getSortIcon("maximo")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("minimo")}
                  >
                    <div className="flex items-center gap-2">
                      Mínimo {getSortIcon("minimo")}
                    </div>
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((defensivo) => (
                  <TableRow key={defensivo.id}>
                    <TableCell className="font-medium">
                      {defensivo.id}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="truncate" title={defensivo.nomeComercial}>
                          {defensivo.nomeComercial}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cód: {defensivo.codigo}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{defensivo.unidade}</TableCell>
                    <TableCell>{defensivo.principioAtivo}</TableCell>
                    <TableCell>{defensivo.fabricante}</TableCell>
                    <TableCell>{defensivo.indice}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          defensivo.embalagem === "BULK"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {defensivo.embalagem}
                      </Badge>
                    </TableCell>
                    <TableCell>{defensivo.maximo}</TableCell>
                    <TableCell>{defensivo.minimo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(defensivo)}
                          title="Consultar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(defensivo)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(defensivo)}
                          title="Desativar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {currentItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum defensivo encontrado com os filtros aplicados.
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a{" "}
                {Math.min(endIndex, sortedDefensivos.length)} de{" "}
                {sortedDefensivos.length} registros
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {defensivos.filter((d) => d.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Defensivos Ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">
                B
              </span>
            </div>
            <p className="text-2xl font-bold">
              {
                defensivos.filter((d) => d.embalagem === "BULK" && d.ativo)
                  .length
              }
            </p>
            <p className="text-sm text-muted-foreground">Produtos BULK</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-secondary rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs font-bold text-secondary-foreground">
                F
              </span>
            </div>
            <p className="text-2xl font-bold">
              {
                defensivos.filter(
                  (d) => d.embalagem === "Fracionado" && d.ativo
                ).length
              }
            </p>
            <p className="text-sm text-muted-foreground">
              Produtos Fracionados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modais */}

      {/* Modal de Visualização */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consultar Defensivo</DialogTitle>
            <DialogDescription>
              Visualização completa dos dados do defensivo
            </DialogDescription>
          </DialogHeader>
          {selectedDefensivo && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <p className="text-sm font-medium">{selectedDefensivo.id}</p>
              </div>
              <div>
                <Label>Código</Label>
                <p className="text-sm font-medium">
                  {selectedDefensivo.codigo}
                </p>
              </div>
              <div className="col-span-2">
                <Label>Nome Comercial</Label>
                <p className="text-sm font-medium">
                  {selectedDefensivo.nomeComercial}
                </p>
              </div>
              <div>
                <Label>Unidade</Label>
                <p className="text-sm font-medium">
                  {selectedDefensivo.unidade}
                </p>
              </div>
              <div>
                <Label>Princípio Ativo</Label>
                <p className="text-sm font-medium">
                  {selectedDefensivo.principioAtivo}
                </p>
              </div>
              <div>
                <Label>Fabricante</Label>
                <p className="text-sm font-medium">
                  {selectedDefensivo.fabricante}
                </p>
              </div>
              <div>
                <Label>Índice</Label>
                <p className="text-sm font-medium">
                  {selectedDefensivo.indice}
                </p>
              </div>
              <div>
                <Label>Embalagem</Label>
                <p className="text-sm font-medium">
                  {selectedDefensivo.embalagem}
                </p>
              </div>
              <div>
                <Label>Máximo</Label>
                <p className="text-sm font-medium">
                  {selectedDefensivo.maximo}
                </p>
              </div>
              <div>
                <Label>Mínimo</Label>
                <p className="text-sm font-medium">
                  {selectedDefensivo.minimo}
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  variant={selectedDefensivo.ativo ? "default" : "destructive"}
                >
                  {selectedDefensivo.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Defensivo</DialogTitle>
            <DialogDescription>
              Edite as informações do defensivo selecionado
            </DialogDescription>
          </DialogHeader>
          {/* Form fields would go here - simplified for demo */}
          <div className="text-center py-8 text-muted-foreground">
            Formulário de edição em desenvolvimento
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Sucesso",
                  description: "Defensivo editado com sucesso!",
                });
                setShowEditDialog(false);
              }}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Defensivo</DialogTitle>
            <DialogDescription>
              Preencha todas as informações obrigatórias do novo defensivo
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: NAPTOL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="L">Litros (L)</SelectItem>
                          <SelectItem value="KG">Quilogramas (KG)</SelectItem>
                          <SelectItem value="ML">Mililitros (ML)</SelectItem>
                          <SelectItem value="G">Gramas (G)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nomeComercial"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome Comercial *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: ACETRPILUNAS - BULK"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="principioAtivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Princípio Ativo *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Glifosato" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fabricante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fabricante *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AgroTech" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="embalagem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Embalagem *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a embalagem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BULK">BULK</SelectItem>
                          <SelectItem value="Fracionado">Fracionado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="indice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Índice *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Ex: 1.2"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maximo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Máximo *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 1000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minimo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Mínimo *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 100"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar Defensivo</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal de Importação CSV */}
      <Dialog open={showImportCSVDialog} onOpenChange={setShowImportCSVDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Defensivos via CSV</DialogTitle>
            <DialogDescription>
              Faça upload de um arquivo CSV com os dados dos defensivos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Template Download */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Precisa de um modelo?</p>
                <p className="text-sm text-muted-foreground">
                  Baixe o template CSV com a estrutura correta
                </p>
              </div>
              <Button variant="outline" onClick={downloadCSVTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Template
              </Button>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <Label htmlFor="csv-upload">Arquivo CSV</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                {csvFile && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCsvFile(null);
                      setCsvPreview([]);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {csvFile && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {csvFile.name}
                </p>
              )}
            </div>

            {/* Preview */}
            {csvPreview.length > 0 && (
              <div className="space-y-2">
                <Label>Preview dos Dados (primeiras 5 linhas)</Label>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left">Código</th>
                          <th className="p-2 text-left">Nome Comercial</th>
                          <th className="p-2 text-left">Unidade</th>
                          <th className="p-2 text-left">Princípio Ativo</th>
                          <th className="p-2 text-left">Fabricante</th>
                          <th className="p-2 text-left">Embalagem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.map((row, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{row.codigo}</td>
                            <td className="p-2">{row.nomeComercial}</td>
                            <td className="p-2">{row.unidade}</td>
                            <td className="p-2">{row.principioAtivo}</td>
                            <td className="p-2">{row.fabricante}</td>
                            <td className="p-2">{row.embalagem}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-medium mb-2">
                Instruções para o arquivo CSV:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • O arquivo deve conter as colunas: codigo, nomeComercial,
                  unidade, principioAtivo, fabricante, indice, embalagem,
                  maximo, minimo
                </li>
                <li>• A primeira linha deve conter os cabeçalhos</li>
                <li>• Use vírgula (,) como separador</li>
                <li>• Valores numéricos para indice, maximo e minimo</li>
                <li>• Embalagem deve ser "BULK" ou "Fracionado"</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImportCSVDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={processCSVImport}
              disabled={!csvFile || isProcessingCSV}
            >
              {isProcessingCSV ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Dados
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar o defensivo "
              {selectedDefensivo?.nomeComercial}"? Esta ação não pode ser
              desfeita e o produto não aparecerá mais nas consultas ativas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Confirmar Desativação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InsumosAgricolas;
