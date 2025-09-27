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
  ChevronRight,
  FileText,
  FileType,
  X,
  Upload,
  Download,
  ChevronRight as ChevronRightIcon,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema de validação para Categoria
const categoriaSchema = z.object({
  codigo: z
    .string()
    .min(1, "Código é obrigatório")
    .max(20, "Código deve ter no máximo 20 caracteres"),
  descricaoResumida: z
    .string()
    .min(1, "Descrição resumida é obrigatória")
    .max(100, "Descrição resumida deve ter no máximo 100 caracteres"),
  descricaoCompleta: z
    .string()
    .min(1, "Descrição completa é obrigatória")
    .max(500, "Descrição completa deve ter no máximo 500 caracteres"),
  mt: z.string().min(1, "MT é obrigatório"),
});

// Schema de validação para Material Agrícola
const materialSchema = z.object({
  codigo: z
    .string()
    .min(1, "Código é obrigatório")
    .max(20, "Código deve ter no máximo 20 caracteres"),
  descricao: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
  codigoFabricante: z
    .string()
    .min(1, "Código do fabricante é obrigatório")
    .max(50, "Código do fabricante deve ter no máximo 50 caracteres"),
  nomeFabricante: z
    .string()
    .min(1, "Nome do fabricante é obrigatório")
    .max(100, "Nome do fabricante deve ter no máximo 100 caracteres"),
  nomeComercial: z
    .string()
    .min(1, "Nome comercial é obrigatório")
    .max(200, "Nome comercial deve ter no máximo 200 caracteres"),
  principioAtivo: z.string().optional(),
  categoriaId: z.number().min(1, "Categoria é obrigatória").optional(),
});

// Tipos
type Categoria = {
  id: number;
  codigo: string;
  descricaoResumida: string;
  descricaoCompleta: string;
  mt: string;
  ativo: boolean;
};

type MaterialAgricola = {
  id: number;
  codigo: string;
  descricao: string;
  codigoFabricante: string;
  nomeFabricante: string;
  nomeComercial: string;
  principioAtivo?: string;
  categoriaId: number;
  ativo: boolean;
};

type MaterialComCategoria = MaterialAgricola & {
  categoria: Categoria;
};

const InsumosAgricolas = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialAgricola | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null
  );
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCategoriaDialog, setShowCategoriaDialog] = useState(false);
  const [showCategoriaEditDialog, setShowCategoriaEditDialog] = useState(false);
  const [showCategoriaAddDialog, setShowCategoriaAddDialog] = useState(false);
  const [showCategoriaDeleteDialog, setShowCategoriaDeleteDialog] =
    useState(false);
  const [showImportCSVDialog, setShowImportCSVDialog] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [isProcessingCSV, setIsProcessingCSV] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );

  // Formulário para cadastro/edição de material
  const materialForm = useForm<z.infer<typeof materialSchema>>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      codigo: "",
      descricao: "",
      codigoFabricante: "",
      nomeFabricante: "",
      nomeComercial: "",
      principioAtivo: "",
      categoriaId: undefined,
    },
  });

  // Formulário para cadastro/edição de categoria
  const categoriaForm = useForm<z.infer<typeof categoriaSchema>>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      codigo: "",
      descricaoResumida: "",
      descricaoCompleta: "",
      mt: "",
    },
  });

  // Dados simulados de categorias
  const [categorias, setCategorias] = useState<Categoria[]>([
    {
      id: 1,
      codigo: "HERB",
      descricaoResumida: "Herbicidas",
      descricaoCompleta:
        "Produtos químicos utilizados para controle de plantas daninhas",
      mt: "MT-001",
      ativo: true,
    },
    {
      id: 2,
      codigo: "INSET",
      descricaoResumida: "Inseticidas",
      descricaoCompleta:
        "Produtos químicos utilizados para controle de insetos",
      mt: "MT-002",
      ativo: true,
    },
    {
      id: 3,
      codigo: "FUNG",
      descricaoResumida: "Fungicidas",
      descricaoCompleta: "Produtos químicos utilizados para controle de fungos",
      mt: "MT-003",
      ativo: true,
    },
    {
      id: 4,
      codigo: "FERT",
      descricaoResumida: "Fertilizantes",
      descricaoCompleta:
        "Produtos utilizados para nutrição e adubação das plantas",
      mt: "MT-004",
      ativo: true,
    },
  ]);

  // Dados simulados de materiais agrícolas
  const [materiais, setMateriais] = useState<MaterialAgricola[]>([
    {
      id: 1,
      codigo: "NAPTOL",
      descricao: "Herbicida sistêmico",
      codigoFabricante: "AGT-001",
      nomeFabricante: "AgroTech",
      nomeComercial: "ACETRPILUNAS - BULK",
      principioAtivo: "Glifosato",
      categoriaId: 1,
      ativo: true,
    },
    {
      id: 2,
      codigo: "D",
      descricao: "Herbicida seletivo",
      codigoFabricante: "CC-002",
      nomeFabricante: "ChemCorp",
      nomeComercial: "ABCD",
      principioAtivo: "2,4-D",
      categoriaId: 1,
      ativo: true,
    },
    {
      id: 3,
      codigo: "STITSTE",
      descricao: "Inseticida de contato",
      codigoFabricante: "BA-003",
      nomeFabricante: "BioAgro",
      nomeComercial: "COLADA CD",
      principioAtivo: "Atrazina",
      categoriaId: 2,
      ativo: true,
    },
    {
      id: 4,
      codigo: "2T",
      descricao: "Herbicida de ação rápida",
      codigoFabricante: "AS-004",
      nomeFabricante: "AgroSolutions",
      nomeComercial: "HERBICIDA CABDI ULTRASLOW ADOBE - FUSITRAT BOOX",
      principioAtivo: "Paraquat",
      categoriaId: 1,
      ativo: true,
    },
    {
      id: 5,
      codigo: "SEITSA",
      descricao: "Inseticida sistêmico",
      codigoFabricante: "PC-005",
      nomeFabricante: "PestControl",
      nomeComercial: "INSARA CELAO",
      principioAtivo: "Imidacloprido",
      categoriaId: 2,
      ativo: true,
    },
    {
      id: 6,
      codigo: "PHSOLS",
      descricao: "Fungicida preventivo",
      codigoFabricante: "FP-006",
      nomeFabricante: "FungiPro",
      nomeComercial: "PHU BEEF",
      principioAtivo: "Tiofanato-metílico",
      categoriaId: 3,
      ativo: true,
    },
    {
      id: 7,
      codigo: "FERT-001",
      descricao: "Fertilizante NPK",
      codigoFabricante: "AC-007",
      nomeFabricante: "AgriChem",
      nomeComercial: "FERTILIZANTE COMPLETO 20-10-10",
      categoriaId: 4,
      ativo: true,
    },
  ]);

  const itemsPerPage = 10;

  // Função para obter categoria por ID
  const getCategoriaById = (id: number) => {
    return categorias.find((cat) => cat.id === id);
  };

  // Combinar materiais com suas categorias
  const materiaisComCategoria: MaterialComCategoria[] = materiais
    .filter((material) => material.ativo)
    .map((material) => ({
      ...material,
      categoria: getCategoriaById(material.categoriaId) || {
        id: 0,
        codigo: "N/A",
        descricaoResumida: "Categoria não encontrada",
        descricaoCompleta: "",
        mt: "",
        ativo: false,
      },
    }));

  // Filtros e busca para materiais
  // Filtros unificados para categorias e materiais
  const filteredCategorias = categorias.filter((categoria) => {
    if (!categoria.ativo) return false;

    const matchesSearch =
      searchTerm === "" ||
      categoria.descricaoResumida
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      categoria.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoria.descricaoCompleta
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const filteredMateriais = materiaisComCategoria.filter((material) => {
    const matchesSearch =
      searchTerm === "" ||
      material.nomeComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.nomeFabricante
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      material.categoria.descricaoResumida
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Função para obter materiais de uma categoria
  const getMateriaisByCategoria = (categoriaId: number) => {
    return filteredMateriais.filter(
      (material) => material.categoriaId === categoriaId
    );
  };

  // Função para toggle de categoria expandida
  const toggleCategoria = (categoriaId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoriaId)) {
      newExpanded.delete(categoriaId);
    } else {
      newExpanded.add(categoriaId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleViewMaterial = (material: MaterialAgricola) => {
    setSelectedMaterial(material);
    setShowViewDialog(true);
  };

  const handleEditMaterial = (material: MaterialAgricola) => {
    setSelectedMaterial(material);
    materialForm.reset({
      ...material,
      categoriaId: material.categoriaId,
    });
    setShowEditDialog(true);
  };

  const handleDeleteMaterial = (material: MaterialAgricola) => {
    setSelectedMaterial(material);
    setShowDeleteDialog(true);
  };

  const confirmDeleteMaterial = () => {
    if (selectedMaterial) {
      setMateriais((prev) =>
        prev.map((m) =>
          m.id === selectedMaterial.id ? { ...m, ativo: false } : m
        )
      );
      toast({
        title: "Sucesso",
        description: "Material agrícola desativado com sucesso!",
      });
      setShowDeleteDialog(false);
      setSelectedMaterial(null);
    }
  };

  const handleAddNewMaterial = () => {
    setSelectedMaterial(null);
    materialForm.reset();
    setShowAddDialog(true);
  };

  // Handlers para categorias
  const handleViewCategoria = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setShowCategoriaDialog(true);
  };

  const handleEditCategoria = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    categoriaForm.reset(categoria);
    setShowCategoriaEditDialog(true);
  };

  const handleDeleteCategoria = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setShowCategoriaDeleteDialog(true);
  };

  const confirmDeleteCategoria = () => {
    if (selectedCategoria) {
      setCategorias((prev) =>
        prev.map((c) =>
          c.id === selectedCategoria.id ? { ...c, ativo: false } : c
        )
      );
      toast({
        title: "Sucesso",
        description: "Categoria desativada com sucesso!",
      });
      setShowCategoriaDeleteDialog(false);
      setSelectedCategoria(null);
    }
  };

  const handleAddNewCategoria = () => {
    setSelectedCategoria(null);
    categoriaForm.reset();
    setShowCategoriaAddDialog(true);
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
    setExpandedCategories(new Set());
  };

  // Funções do formulário de material
  const onSubmitMaterial = (values: z.infer<typeof materialSchema>) => {
    try {
      // Validar se categoriaId foi selecionado
      if (!values.categoriaId) {
        toast({
          title: "Erro",
          description: "Selecione uma categoria para o material.",
          variant: "destructive",
        });
        return;
      }

      if (selectedMaterial) {
        // Editar material existente
        setMateriais((prev) =>
          prev.map((m) =>
            m.id === selectedMaterial.id
              ? { ...m, ...values, categoriaId: values.categoriaId! }
              : m
          )
        );
        toast({
          title: "Sucesso",
          description: "Material agrícola editado com sucesso!",
        });
        setShowEditDialog(false);
      } else {
        // Adicionar novo material
        const newMaterial: MaterialAgricola = {
          id: Math.max(...materiais.map((m) => m.id), 0) + 1,
          codigo: values.codigo,
          descricao: values.descricao,
          codigoFabricante: values.codigoFabricante,
          nomeFabricante: values.nomeFabricante,
          nomeComercial: values.nomeComercial,
          principioAtivo: values.principioAtivo,
          categoriaId: values.categoriaId,
          ativo: true,
        };
        setMateriais((prev) => [...prev, newMaterial]);
        toast({
          title: "Sucesso",
          description: "Material agrícola cadastrado com sucesso!",
        });
        setShowAddDialog(false);
      }
      materialForm.reset();
      setSelectedMaterial(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar material agrícola. Verifique os dados.",
        variant: "destructive",
      });
    }
  };

  // Funções do formulário de categoria
  const onSubmitCategoria = (values: z.infer<typeof categoriaSchema>) => {
    try {
      if (selectedCategoria) {
        // Editar categoria existente
        setCategorias((prev) =>
          prev.map((c) =>
            c.id === selectedCategoria.id ? { ...c, ...values } : c
          )
        );
        toast({
          title: "Sucesso",
          description: "Categoria editada com sucesso!",
        });
        setShowCategoriaEditDialog(false);
      } else {
        // Adicionar nova categoria
        const newCategoria: Categoria = {
          id: Math.max(...categorias.map((c) => c.id), 0) + 1,
          codigo: values.codigo,
          descricaoResumida: values.descricaoResumida,
          descricaoCompleta: values.descricaoCompleta,
          mt: values.mt,
          ativo: true,
        };
        setCategorias((prev) => [...prev, newCategoria]);
        toast({
          title: "Sucesso",
          description: "Categoria cadastrada com sucesso!",
        });
        setShowCategoriaAddDialog(false);
      }
      categoriaForm.reset();
      setSelectedCategoria(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar categoria. Verifique os dados.",
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
        "descricao",
        "codigoFabricante",
        "nomeFabricante",
        "nomeComercial",
        "categoriaId",
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

        const newMateriais: MaterialAgricola[] = [];
        let errors = 0;

        lines.slice(1).forEach((line, index) => {
          try {
            const values = line.split(",").map((v) => v.trim());
            const row: any = {};
            headers.forEach((header, idx) => {
              row[header] = values[idx] || "";
            });

            // Validar e converter dados
            const newMaterial: MaterialAgricola = {
              id:
                Math.max(...materiais.map((m) => m.id), 0) +
                newMateriais.length +
                1,
              codigo: row.codigo,
              descricao: row.descricao,
              codigoFabricante: row.codigoFabricante,
              nomeFabricante: row.nomeFabricante,
              nomeComercial: row.nomeComercial,
              principioAtivo: row.principioAtivo || undefined,
              categoriaId: parseInt(row.categoriaId) || 0,
              ativo: true,
            };

            // Validação básica
            if (
              !newMaterial.codigo ||
              !newMaterial.nomeComercial ||
              !newMaterial.categoriaId
            ) {
              errors++;
              return;
            }

            newMateriais.push(newMaterial);
          } catch (error) {
            errors++;
          }
        });

        setMateriais((prev) => [...prev, ...newMateriais]);
        toast({
          title: "Sucesso",
          description: `${
            newMateriais.length
          } materiais agrícolas importados com sucesso!${
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
      "descricao",
      "codigoFabricante",
      "nomeFabricante",
      "nomeComercial",
      "principioAtivo",
      "categoriaId",
    ];
    const csvContent =
      headers.join(",") +
      "\n" +
      "EXEMPLO1,Herbicida sistêmico,FAB-001,FabricanteA,Produto Exemplo 1,Glifosato,1\n" +
      "EXEMPLO2,Inseticida de contato,FAB-002,FabricanteB,Produto Exemplo 2,Atrazina,2";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template_materiais_agricolas.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Insumos Agrícolas
          </h1>
          <p className="text-muted-foreground mt-1">
            Cadastro e gerenciamento de categorias e materiais agrícolas
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddNewCategoria} variant="outline">
            <Folder className="h-4 w-4 mr-2" />
            Adicionar Categoria
          </Button>
          <Button onClick={handleAddNewMaterial}>
            <Package className="h-4 w-4 mr-2" />
            Adicionar Material
          </Button>
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
        </div>
      </div>

      {/* Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Busca
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Busca geral (categorias, materiais, códigos, descrições, fabricantes...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {materiais.filter((m) => m.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Materiais Ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Folder className="h-8 w-8 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {categorias.filter((c) => c.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Categorias Ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs font-bold text-white">H</span>
            </div>
            <p className="text-2xl font-bold">
              {materiais.filter((m) => m.categoriaId === 1 && m.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Herbicidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs font-bold text-white">I</span>
            </div>
            <p className="text-2xl font-bold">
              {materiais.filter((m) => m.categoriaId === 2 && m.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Inseticidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Hierárquico de Categorias e Materiais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Categorias e Materiais Agrícolas
            </div>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredCategorias.length} categoria(s) encontrada(s)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCategorias.map((categoria) => {
              const materiaisDaCategoria = getMateriaisByCategoria(
                categoria.id
              );
              const isExpanded = expandedCategories.has(categoria.id);

              return (
                <div key={categoria.id} className="border rounded-lg">
                  {/* Linha da Categoria */}
                  <div className="p-4 bg-muted/50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategoria(categoria.id)}
                          className="p-1 h-8 w-8"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="flex items-center gap-4 flex-1">
                          <Badge variant="default" className="text-xs">
                            {categoria.codigo}
                          </Badge>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {categoria.descricaoResumida}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {categoria.descricaoCompleta}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-muted-foreground">
                                MT: {categoria.mt}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Materiais: {materiaisDaCategoria.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCategoria(categoria)}
                          title="Consultar Categoria"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCategoria(categoria)}
                          title="Editar Categoria"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategoria(categoria)}
                          title="Desativar Categoria"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Subgrid de Materiais */}
                  {isExpanded && (
                    <div className="p-4">
                      {materiaisDaCategoria.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground mb-3">
                            Materiais desta categoria:
                          </h4>
                          <div className="grid gap-2">
                            {materiaisDaCategoria.map((material) => (
                              <div
                                key={material.id}
                                className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium">
                                        {material.nomeComercial}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {material.codigo}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                      {material.descricao}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span>
                                        Fabricante: {material.nomeFabricante}
                                      </span>
                                      <span>
                                        Cód: {material.codigoFabricante}
                                      </span>
                                      {material.principioAtivo && (
                                        <span>
                                          Princípio: {material.principioAtivo}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewMaterial(material)}
                                    title="Consultar Material"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditMaterial(material)}
                                    title="Editar Material"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteMaterial(material)
                                    }
                                    title="Desativar Material"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Nenhum material encontrado nesta categoria</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredCategorias.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  Nenhuma categoria encontrada
                </p>
                <p className="text-sm">
                  {searchTerm
                    ? "Tente ajustar os termos de busca"
                    : "Comece adicionando uma categoria"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modais */}

      {/* Modal de Visualização de Material */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consultar Material Agrícola</DialogTitle>
            <DialogDescription>
              Visualização completa dos dados do material agrícola
            </DialogDescription>
          </DialogHeader>
          {selectedMaterial && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <p className="text-sm font-medium">{selectedMaterial.id}</p>
              </div>
              <div>
                <Label>Código</Label>
                <p className="text-sm font-medium">{selectedMaterial.codigo}</p>
              </div>
              <div className="col-span-2">
                <Label>Nome Comercial</Label>
                <p className="text-sm font-medium">
                  {selectedMaterial.nomeComercial}
                </p>
              </div>
              <div className="col-span-2">
                <Label>Descrição</Label>
                <p className="text-sm font-medium">
                  {selectedMaterial.descricao}
                </p>
              </div>
              <div>
                <Label>Código do Fabricante</Label>
                <p className="text-sm font-medium">
                  {selectedMaterial.codigoFabricante}
                </p>
              </div>
              <div>
                <Label>Nome do Fabricante</Label>
                <p className="text-sm font-medium">
                  {selectedMaterial.nomeFabricante}
                </p>
              </div>
              <div>
                <Label>Princípio Ativo</Label>
                <p className="text-sm font-medium">
                  {selectedMaterial.principioAtivo || "-"}
                </p>
              </div>
              <div>
                <Label>Categoria</Label>
                <p className="text-sm font-medium">
                  {getCategoriaById(selectedMaterial.categoriaId)
                    ?.descricaoResumida || "N/A"}
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  variant={selectedMaterial.ativo ? "default" : "destructive"}
                >
                  {selectedMaterial.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Material */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Material Agrícola</DialogTitle>
            <DialogDescription>
              Edite as informações do material agrícola selecionado
            </DialogDescription>
          </DialogHeader>

          <Form {...materialForm}>
            <form
              onSubmit={materialForm.handleSubmit(onSubmitMaterial)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={materialForm.control}
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
                  control={materialForm.control}
                  name="categoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categorias
                            .filter((cat) => cat.ativo)
                            .map((categoria) => (
                              <SelectItem
                                key={categoria.id}
                                value={categoria.id.toString()}
                              >
                                {categoria.descricaoResumida}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={materialForm.control}
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
                  control={materialForm.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Herbicida sistêmico"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={materialForm.control}
                  name="codigoFabricante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código do Fabricante *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AGT-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={materialForm.control}
                  name="nomeFabricante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Fabricante *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AgroTech" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={materialForm.control}
                  name="principioAtivo"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Princípio Ativo (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Glifosato" {...field} />
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
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar Material */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Material Agrícola</DialogTitle>
            <DialogDescription>
              Preencha todas as informações obrigatórias do novo material
              agrícola
            </DialogDescription>
          </DialogHeader>

          <Form {...materialForm}>
            <form
              onSubmit={materialForm.handleSubmit(onSubmitMaterial)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={materialForm.control}
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
                  control={materialForm.control}
                  name="categoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categorias
                            .filter((cat) => cat.ativo)
                            .map((categoria) => (
                              <SelectItem
                                key={categoria.id}
                                value={categoria.id.toString()}
                              >
                                {categoria.descricaoResumida}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={materialForm.control}
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
                  control={materialForm.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Herbicida sistêmico"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={materialForm.control}
                  name="codigoFabricante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código do Fabricante *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AGT-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={materialForm.control}
                  name="nomeFabricante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Fabricante *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AgroTech" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={materialForm.control}
                  name="principioAtivo"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Princípio Ativo (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Glifosato" {...field} />
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
                <Button type="submit">Cadastrar Material</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal de Importação CSV */}
      <Dialog open={showImportCSVDialog} onOpenChange={setShowImportCSVDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Materiais Agrícolas via CSV</DialogTitle>
            <DialogDescription>
              Faça upload de um arquivo CSV com os dados dos materiais agrícolas
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
                          <th className="p-2 text-left">Descrição</th>
                          <th className="p-2 text-left">Nome Comercial</th>
                          <th className="p-2 text-left">Fabricante</th>
                          <th className="p-2 text-left">Princípio Ativo</th>
                          <th className="p-2 text-left">Categoria ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.map((row, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{row.codigo}</td>
                            <td className="p-2">{row.descricao}</td>
                            <td className="p-2">{row.nomeComercial}</td>
                            <td className="p-2">{row.nomeFabricante}</td>
                            <td className="p-2">{row.principioAtivo || "-"}</td>
                            <td className="p-2">{row.categoriaId}</td>
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
                  • O arquivo deve conter as colunas: codigo, descricao,
                  codigoFabricante, nomeFabricante, nomeComercial,
                  principioAtivo, categoriaId
                </li>
                <li>• A primeira linha deve conter os cabeçalhos</li>
                <li>• Use vírgula (,) como separador</li>
                <li>
                  • categoriaId deve ser um número válido de categoria existente
                </li>
                <li>• principioAtivo é opcional (pode ficar vazio)</li>
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

      {/* Modais de Categoria */}

      {/* Modal de Visualização de Categoria */}
      <Dialog open={showCategoriaDialog} onOpenChange={setShowCategoriaDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consultar Categoria</DialogTitle>
            <DialogDescription>
              Visualização completa dos dados da categoria
            </DialogDescription>
          </DialogHeader>
          {selectedCategoria && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <p className="text-sm font-medium">{selectedCategoria.id}</p>
              </div>
              <div>
                <Label>Código</Label>
                <p className="text-sm font-medium">
                  {selectedCategoria.codigo}
                </p>
              </div>
              <div className="col-span-2">
                <Label>Descrição Resumida</Label>
                <p className="text-sm font-medium">
                  {selectedCategoria.descricaoResumida}
                </p>
              </div>
              <div className="col-span-2">
                <Label>Descrição Completa</Label>
                <p className="text-sm font-medium">
                  {selectedCategoria.descricaoCompleta}
                </p>
              </div>
              <div>
                <Label>MT</Label>
                <p className="text-sm font-medium">{selectedCategoria.mt}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  variant={selectedCategoria.ativo ? "default" : "destructive"}
                >
                  {selectedCategoria.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Categoria */}
      <Dialog
        open={showCategoriaEditDialog}
        onOpenChange={setShowCategoriaEditDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Edite as informações da categoria selecionada
            </DialogDescription>
          </DialogHeader>

          <Form {...categoriaForm}>
            <form
              onSubmit={categoriaForm.handleSubmit(onSubmitCategoria)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={categoriaForm.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: HERB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoriaForm.control}
                  name="mt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MT *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: MT-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoriaForm.control}
                  name="descricaoResumida"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição Resumida *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Herbicidas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoriaForm.control}
                  name="descricaoCompleta"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição Completa *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Produtos químicos utilizados para controle de plantas daninhas"
                          {...field}
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
                  onClick={() => setShowCategoriaEditDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar Categoria */}
      <Dialog
        open={showCategoriaAddDialog}
        onOpenChange={setShowCategoriaAddDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Categoria</DialogTitle>
            <DialogDescription>
              Preencha todas as informações obrigatórias da nova categoria
            </DialogDescription>
          </DialogHeader>

          <Form {...categoriaForm}>
            <form
              onSubmit={categoriaForm.handleSubmit(onSubmitCategoria)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={categoriaForm.control}
                  name="codigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: HERB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoriaForm.control}
                  name="mt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MT *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: MT-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoriaForm.control}
                  name="descricaoResumida"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição Resumida *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Herbicidas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoriaForm.control}
                  name="descricaoCompleta"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descrição Completa *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Produtos químicos utilizados para controle de plantas daninhas"
                          {...field}
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
                  onClick={() => setShowCategoriaAddDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar Categoria</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Alertas de Confirmação */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar o material agrícola "
              {selectedMaterial?.nomeComercial}"? Esta ação não pode ser
              desfeita e o produto não aparecerá mais nas consultas ativas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMaterial}>
              Confirmar Desativação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showCategoriaDeleteDialog}
        onOpenChange={setShowCategoriaDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar a categoria "
              {selectedCategoria?.descricaoResumida}"? Esta ação não pode ser
              desfeita e a categoria não aparecerá mais nas consultas ativas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategoria}>
              Confirmar Desativação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InsumosAgricolas;
