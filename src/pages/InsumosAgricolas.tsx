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

// Schema de validação para Classe
const classeSchema = z.object({
  identificacao: z
    .string()
    .min(1, "Identificação da classe é obrigatória")
    .max(50, "Identificação deve ter no máximo 50 caracteres"),
  codigoERP: z
    .string()
    .min(1, "Código ERP é obrigatório")
    .max(50, "Código ERP deve ter no máximo 50 caracteres"),
  nomeClasse: z
    .string()
    .min(1, "Nome da classe é obrigatório")
    .max(200, "Nome da classe deve ter no máximo 200 caracteres"),
});

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
  classeId: z.number().min(1, "Classe é obrigatória").optional(),
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
  categoriaId: z.number().min(1, "Grupo é obrigatório").optional(),
});

// Tipos
type Classe = {
  id: number;
  identificacao: string;
  codigoERP: string;
  nomeClasse: string;
  ativo: boolean;
};

type Categoria = {
  id: number;
  codigo: string;
  descricaoResumida: string;
  descricaoCompleta: string;
  classeId: number;
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
  const [showAddSelectionDialog, setShowAddSelectionDialog] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [showClasseDialog, setShowClasseDialog] = useState(false);
  const [showClasseEditDialog, setShowClasseEditDialog] = useState(false);
  const [showClasseAddDialog, setShowClasseAddDialog] = useState(false);
  const [showClasseDeleteDialog, setShowClasseDeleteDialog] = useState(false);
  const [showManageClassesDialog, setShowManageClassesDialog] = useState(false);
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
      classeId: undefined,
    },
  });

  // Formulário para cadastro/edição de classe
  const classeForm = useForm<z.infer<typeof classeSchema>>({
    resolver: zodResolver(classeSchema),
    defaultValues: {
      identificacao: "",
      codigoERP: "",
      nomeClasse: "",
    },
  });

  // Dados simulados de classes
  const [classes, setClasses] = useState<Classe[]>([
    {
      id: 1,
      identificacao: "CLS-001",
      codigoERP: "ERP-001",
      nomeClasse: "Herbicidas",
      ativo: true,
    },
    {
      id: 2,
      identificacao: "CLS-002",
      codigoERP: "ERP-002",
      nomeClasse: "Fertilizantes",
      ativo: true,
    },
    {
      id: 3,
      identificacao: "CLS-003",
      codigoERP: "ERP-003",
      nomeClasse: "Inseticidas",
      ativo: true,
    },
  ]);

  // Dados simulados de categorias
  const [categorias, setCategorias] = useState<Categoria[]>([
    {
      id: 69,
      codigo: "69",
      descricaoResumida: "Herbicida 2,4 D-DIMETILAM 806 G/L",
      descricaoCompleta:
        "HERBICIDA CONCENTRADO SOLUVEL; PRINCIPIO ATIVO 2,4-D-DIMETILAMINA 80,60% (806 G/L); EQUIVALENTE ACIDO 2,4-D 67% (670 G/L); CLASSIFICACAO TOXICOLOGICA CATEGORIA 4 (PRODUTO POUCO TOXICO) AZUL",
      classeId: 1,
      ativo: true,
    },
    {
      id: 617,
      codigo: "617",
      descricaoResumida: "Fertilizante (Adubo)",
      descricaoCompleta:
        "FERTILIZANTE (ADUBO) GRANULADO; CONCENTRACAO NITROGENIO (N) 20%; FOSFORO (P) 05%; POTASSIO (K) ACIMA 20%; PRODUTO SUJEITO INSPECAO; ACOMPANHAR CERTIFICADO QUALIDADE",
      classeId: 2,
      ativo: true,
    },
    {
      id: 3001,
      codigo: "3001",
      descricaoResumida: "Herbicida Tebuthiuron 500 G/L",
      descricaoCompleta:
        "HERBICIDA SUSPENSAO CONCENTRADA (SC); INGREDIENTE ATIVO TEBUTHIURON; CON CENTRACAO 500 G/L; CLASSIFICACAO TOXICOLOGICA CATEGORIA 4 (PRODUTO POUCO TOXICO) AZUL; CLASSIFICACAO AMBIENTAL CLAS",
      classeId: 1,
      ativo: true,
    },
    {
      id: 5027,
      codigo: "5027",
      descricaoResumida: "Formicida Isca Sulfluramida",
      descricaoCompleta:
        "FORMICIDA ISCA GRANULADO; PRINCIPIO ATIVO SULFLURAMIDA; CONCENTRACAO (3 G/KG); CLASSE TOXICOLOGICA IV (POUCO TOXICO); PRODUTO SUJEITO INSPECAO; ACOMPANHAR CERTIFICADO QUALIDADE",
      classeId: 3,
      ativo: true,
    },
  ]);

  // Dados simulados de materiais agrícolas
  const [materiais, setMateriais] = useState<MaterialAgricola[]>([
    // Herbicida 2,4 D-DIMETILAM 806 G (Categoria 69)
    {
      id: 1005392,
      codigo: "1005392",
      descricao: "HERBICIDA NUFARM U 46 BR",
      codigoFabricante: "100240",
      nomeFabricante: "NUFARM",
      nomeComercial: "U 46 BR",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1027638,
      codigo: "1027638",
      descricao: "HERBICIDA UPL DEZ",
      codigoFabricante: "100339",
      nomeFabricante: "UPL",
      nomeComercial: "DEZ",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1002695,
      codigo: "1002695",
      descricao: "HERBICIDA MILENIA AMINOL 806",
      codigoFabricante: "100477",
      nomeFabricante: "MILENIA",
      nomeComercial: "AMINOL 806",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1027637,
      codigo: "1027637",
      descricao: "HERBICIDA ADAMA AMINOL 806 BR",
      codigoFabricante: "100493",
      nomeFabricante: "ADAMA BRASIL",
      nomeComercial: "AMINOL 806 BR",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1027636,
      codigo: "1027636",
      descricao: "HERBICIDA IHARA MIRANT",
      codigoFabricante: "100605",
      nomeFabricante: "IHARABRAS",
      nomeComercial: "MIRANT",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1027945,
      codigo: "1027945",
      descricao: "HERBICIDA DOW AGRO DMA 806 BR",
      codigoFabricante: "100857",
      nomeFabricante: "DOW AGROSCIENCES",
      nomeComercial: "DMA 806 BR",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1131649,
      codigo: "1131649",
      descricao: "HERBICIDA 2,4-D ALTA",
      codigoFabricante: "101725",
      nomeFabricante: "ALTA",
      nomeComercial: "2,4-D",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1117134,
      codigo: "1117134",
      descricao: "HERBICIDA ALAMOS 2,4-D 806 SL ALAMOS",
      codigoFabricante: "101726",
      nomeFabricante: "ALAMOS",
      nomeComercial: "2.4-D 806 SL ALAMOS",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1122614,
      codigo: "1122614",
      descricao: "HERBICIDA 2,4-DTECNOMYL",
      codigoFabricante: "103551",
      nomeFabricante: "TECNOMYL",
      nomeComercial: "2,4-DTECNOMYL",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1067369,
      codigo: "1067369",
      descricao: "HERBICIDA ALBAUGH 2,4-D AMIANA",
      codigoFabricante: "103614",
      nomeFabricante: "ALBAUGH",
      nomeComercial: "2.4.D AMIANA",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1067368,
      codigo: "1067368",
      descricao: "HERBICIDA ALBAUGH EXEMPLO",
      codigoFabricante: "103614",
      nomeFabricante: "ALBAUGH",
      nomeComercial: "EXEMPLO",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1090157,
      codigo: "1090157",
      descricao: "HERBICIDA BRA BRATT",
      codigoFabricante: "104766",
      nomeFabricante: "BRA AGROQUIMICA",
      nomeComercial: "BRATT",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    {
      id: 1137291,
      codigo: "1137291",
      descricao: "HERBICIDA DECORUM",
      codigoFabricante: "106514",
      nomeFabricante: "DECORUM",
      nomeComercial: "DECORUM",
      principioAtivo: "2,4-D-DIMETILAMINA",
      categoriaId: 69,
      ativo: true,
    },
    // Fertilizante (Adubo) (Categoria 617)
    {
      id: 1046912,
      codigo: "1046912",
      descricao: "FERTILIZANTE (ADUBO) HERINGER 20.05.20",
      codigoFabricante: "100703",
      nomeFabricante: "HERINGER",
      nomeComercial: "20.05.20",
      principioAtivo: "NPK 20-05-20",
      categoriaId: 617,
      ativo: true,
    },
    {
      id: 1046908,
      codigo: "1046908",
      descricao: "FERTILIZANTE (ADUBO) SERRANA 20.05.20",
      codigoFabricante: "102153",
      nomeFabricante: "SERRANA FERTILIZANTES",
      nomeComercial: "20.05.20",
      principioAtivo: "NPK 20-05-20",
      categoriaId: 617,
      ativo: true,
    },
    {
      id: 1046907,
      codigo: "1046907",
      descricao: "FERTILIZANTE (ADUBO) OURO VERDE 20.05.20",
      codigoFabricante: "102154",
      nomeFabricante: "OURO VERDE FERTILIZANTES",
      nomeComercial: "20.05.20",
      principioAtivo: "NPK 20-05-20",
      categoriaId: 617,
      ativo: true,
    },
    {
      id: 1046909,
      codigo: "1046909",
      descricao: "FERTILIZANTE (ADUBO) IAP 20.05.20",
      codigoFabricante: "102155",
      nomeFabricante: "IAP - FERTILIZANTES",
      nomeComercial: "20.05.20",
      principioAtivo: "NPK 20-05-20",
      categoriaId: 617,
      ativo: true,
    },
    {
      id: 1046913,
      codigo: "1046913",
      descricao: "FERTILIZANTE (ADUBO) FERTIBRAS 20.05.20",
      codigoFabricante: "102156",
      nomeFabricante: "FERTIBRAS",
      nomeComercial: "20.05.20",
      principioAtivo: "NPK 20-05-20",
      categoriaId: 617,
      ativo: true,
    },
    {
      id: 1046906,
      codigo: "1046906",
      descricao: "FERTILIZANTE (ADUBO) MANAH 20.05.20",
      codigoFabricante: "102157",
      nomeFabricante: "MANAH",
      nomeComercial: "20.05.20",
      principioAtivo: "NPK 20-05-20",
      categoriaId: 617,
      ativo: true,
    },
    // Herbicida Tebuthiuron 500 G/L (Categoria 3001)
    {
      id: 1001280,
      codigo: "1001280",
      descricao: "HERBICIDA SANACHEM SANACHEM 500 SC",
      codigoFabricante: "100307",
      nomeFabricante: "SANACHEM",
      nomeComercial: "SANACHEM 500 SC",
      principioAtivo: "Tebuthiuron",
      categoriaId: 3001,
      ativo: true,
    },
    {
      id: 1006356,
      codigo: "1006356",
      descricao: "HERBICIDA OURO FINO FORTALEZA BR",
      codigoFabricante: "100421",
      nomeFabricante: "OURO FINO QUIMICA",
      nomeComercial: "FORTALEZA BR",
      principioAtivo: "Tebuthiuron",
      categoriaId: 3001,
      ativo: true,
    },
    {
      id: 1027946,
      codigo: "1027946",
      descricao: "HERBICIDA MILENIA BUTIRON",
      codigoFabricante: "100477",
      nomeFabricante: "MILENIA",
      nomeComercial: "BUTIRON",
      principioAtivo: "Tebuthiuron",
      categoriaId: 3001,
      ativo: true,
    },
    {
      id: 1004995,
      codigo: "1004995",
      descricao: "HERBICIDA ADAMA BUTIRON",
      codigoFabricante: "100493",
      nomeFabricante: "ADAMA BRASIL",
      nomeComercial: "BUTIRON",
      principioAtivo: "Tebuthiuron",
      categoriaId: 3001,
      ativo: true,
    },
    {
      id: 1027947,
      codigo: "1027947",
      descricao: "HERBICIDA DOW COMBINE 500 SC",
      codigoFabricante: "100857",
      nomeFabricante: "DOW AGROSCIENCES",
      nomeComercial: "COMBINE 500 SC",
      principioAtivo: "Tebuthiuron",
      categoriaId: 3001,
      ativo: true,
    },
    {
      id: 1146846,
      codigo: "1146846",
      descricao: "HERBICIDA DOW SPIKE",
      codigoFabricante: "100857",
      nomeFabricante: "DOW AGROSCIENCES",
      nomeComercial: "SPIKE",
      principioAtivo: "Tebuthiuron",
      categoriaId: 3001,
      ativo: true,
    },
    {
      id: 1027639,
      codigo: "1027639",
      descricao: "HERBICIDA ALTA AMERIS",
      codigoFabricante: "101725",
      nomeFabricante: "ALTA",
      nomeComercial: "AMERIS",
      principioAtivo: "Tebuthiuron",
      categoriaId: 3001,
      ativo: true,
    },
    // Formicida Isca Sulfluramida (Categoria 5027)
    {
      id: 1090158,
      codigo: "1090158",
      descricao: "FORMICIDA BIO SOJA TAMANDUA BANDEIRA S",
      codigoFabricante: "100565",
      nomeFabricante: "BIO SOJA",
      nomeComercial: "TAMANDUA BANDEIRA S",
      principioAtivo: "Sulfluramida",
      categoriaId: 5027,
      ativo: true,
    },
    {
      id: 1013096,
      codigo: "1013096",
      descricao: "FORMICIDA ATTA-KILL MIREX-S 3 G/KG-500G",
      codigoFabricante: "101026",
      nomeFabricante: "ATTA-KILL",
      nomeComercial: "MIREX-S",
      principioAtivo: "Sulfluramida",
      categoriaId: 5027,
      ativo: true,
    },
  ]);

  const itemsPerPage = 10;

  // Função para obter classe por ID
  const getClasseById = (id: number) => {
    return classes.find((classe) => classe.id === id);
  };

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
        classeId: 0,
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
    categoriaForm.reset({
      codigo: categoria.codigo,
      descricaoResumida: categoria.descricaoResumida,
      descricaoCompleta: categoria.descricaoCompleta,
      classeId: categoria.classeId,
    });
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

  // Handler para abrir modal de seleção
  const handleOpenAddSelection = () => {
    setShowAddSelectionDialog(true);
  };

  // Handlers para seleção no modal
  const handleSelectCreateItem = () => {
    setShowAddSelectionDialog(false);
    handleAddNewMaterial();
  };

  const handleSelectCreateGroup = () => {
    setShowAddSelectionDialog(false);
    handleAddNewCategoria();
  };

  // Handlers para classes
  const handleViewClasse = (classe: Classe) => {
    setSelectedClasse(classe);
    setShowClasseDialog(true);
  };

  const handleEditClasse = (classe: Classe) => {
    setSelectedClasse(classe);
    classeForm.reset(classe);
    setShowClasseEditDialog(true);
  };

  const handleDeleteClasse = (classe: Classe) => {
    setSelectedClasse(classe);
    setShowClasseDeleteDialog(true);
  };

  const confirmDeleteClasse = () => {
    if (selectedClasse) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === selectedClasse.id ? { ...c, ativo: false } : c
        )
      );
      toast({
        title: "Sucesso",
        description: "Classe desativada com sucesso!",
      });
      setShowClasseDeleteDialog(false);
      setSelectedClasse(null);
    }
  };

  const handleAddNewClasse = () => {
    setSelectedClasse(null);
    classeForm.reset();
    setShowClasseAddDialog(true);
    setShowManageClassesDialog(false);
  };

  const handleOpenManageClasses = () => {
    setShowManageClassesDialog(true);
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
          description: "Selecione um grupo para o material.",
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
      // Validar se classeId foi selecionado
      if (!values.classeId) {
        toast({
          title: "Erro",
          description: "Selecione uma classe para o grupo.",
          variant: "destructive",
        });
        return;
      }

      if (selectedCategoria) {
        // Editar categoria existente
        setCategorias((prev) =>
          prev.map((c) =>
            c.id === selectedCategoria.id
              ? { ...c, ...values, classeId: values.classeId! }
              : c
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
          classeId: values.classeId!,
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

  // Funções do formulário de classe
  const onSubmitClasse = (values: z.infer<typeof classeSchema>) => {
    try {
      if (selectedClasse) {
        // Editar classe existente
        setClasses((prev) =>
          prev.map((c) =>
            c.id === selectedClasse.id ? { ...c, ...values } : c
          )
        );
        toast({
          title: "Sucesso",
          description: "Classe editada com sucesso!",
        });
        setShowClasseEditDialog(false);
      } else {
        // Adicionar nova classe
        const newClasse: Classe = {
          id: Math.max(...classes.map((c) => c.id), 0) + 1,
          identificacao: values.identificacao,
          codigoERP: values.codigoERP,
          nomeClasse: values.nomeClasse,
          ativo: true,
        };
        setClasses((prev) => [...prev, newClasse]);
        toast({
          title: "Sucesso",
          description: "Classe cadastrada com sucesso!",
        });
        setShowClasseAddDialog(false);
      }
      classeForm.reset();
      setSelectedClasse(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar classe. Verifique os dados.",
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Gerenciamento de Itens Agrícolas
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie itens agrícolas e seus detalhes
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Folder className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-500">
              {categorias.filter((c) => c.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Grupos de Itens</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Folder className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-500">
              {categorias.filter((c) => !c.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Grupos de Itens Inativo(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-500">
              {materiais.filter((m) => m.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Itens Agrícolas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-500">
              {materiais.filter((m) => !m.ativo).length}
            </p>
            <p className="text-sm text-muted-foreground">Itens Agrícolas Inativo(s)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Pesquisa
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
                placeholder="Buscar grupos e itens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex items-center justify-between">
        <Button onClick={handleImportCSV} variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Importar CSV
        </Button>
        <div className="flex gap-2">
          <Button onClick={handleOpenManageClasses} variant="outline">
            <Folder className="h-4 w-4 mr-2" />
            Gerenciar Classes
          </Button>
          <Button onClick={handleOpenAddSelection}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Material
          </Button>
        </div>
      </div>

      {/* Grid Hierárquico de Categorias e Materiais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Grupos e Itens Agrícolas
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-normal text-muted-foreground">
                {filteredCategorias.length} grupo(s) total - Página 1 de {Math.ceil(filteredCategorias.length / itemsPerPage)}
              </span>
              <Select defaultValue="10">
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {categoria.descricaoResumida}
                              </h3>
                              {getClasseById(categoria.classeId) && (
                                <Badge 
                                  className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700"
                                >
                                  {getClasseById(categoria.classeId)?.nomeClasse}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {categoria.descricaoCompleta}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
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

      {/* Modal de Seleção - Adicionar Material */}
      <Dialog open={showAddSelectionDialog} onOpenChange={setShowAddSelectionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Material</DialogTitle>
            <DialogDescription>
              Escolha o que deseja criar
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button
              onClick={handleSelectCreateItem}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start justify-start"
            >
              <div className="flex items-center gap-3 w-full">
                <Package className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">Criar Item</p>
                  <p className="text-sm text-muted-foreground">
                    Adicionar um novo item agrícola
                  </p>
                </div>
              </div>
            </Button>
            <Button
              onClick={handleSelectCreateGroup}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start justify-start"
            >
              <div className="flex items-center gap-3 w-full">
                <Folder className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <p className="font-semibold">Criar Grupo</p>
                  <p className="text-sm text-muted-foreground">
                    Adicionar um novo grupo de itens
                  </p>
                </div>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddSelectionDialog(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <Label>Grupo</Label>
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
                      <FormLabel>Grupo *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um grupo" />
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
                      <FormLabel>Grupo *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um grupo" />
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

      {/* Modais de Classe */}

      {/* Modal de Gerenciamento de Classes */}
      <Dialog
        open={showManageClassesDialog}
        onOpenChange={setShowManageClassesDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Classes</DialogTitle>
            <DialogDescription>
              Gerencie as classes de itens agrícolas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAddNewClasse}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Classe
              </Button>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identificação</TableHead>
                    <TableHead>Código ERP</TableHead>
                    <TableHead>Nome da Classe</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-left">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes
                    .filter((classe) => classe.ativo)
                    .map((classe) => (
                      <TableRow key={classe.id}>
                        <TableCell>{classe.identificacao}</TableCell>
                        <TableCell>{classe.codigoERP}</TableCell>
                        <TableCell>{classe.nomeClasse}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              classe.ativo ? "default" : "destructive"
                            }
                          >
                            {classe.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="flex items-center justify-start gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleViewClasse(classe);
                                setShowManageClassesDialog(false);
                              }}
                              title="Consultar Classe"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleEditClasse(classe);
                                setShowManageClassesDialog(false);
                              }}
                              title="Editar Classe"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                handleDeleteClasse(classe);
                                setShowManageClassesDialog(false);
                              }}
                              title="Desativar Classe"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  {classes.filter((classe) => classe.ativo).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className="text-muted-foreground">
                          Nenhuma classe encontrada
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowManageClassesDialog(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Visualização de Classe */}
      <Dialog open={showClasseDialog} onOpenChange={setShowClasseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consultar Classe</DialogTitle>
            <DialogDescription>
              Visualização completa dos dados da classe
            </DialogDescription>
          </DialogHeader>
          {selectedClasse && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <p className="text-sm font-medium">{selectedClasse.id}</p>
              </div>
              <div>
                <Label>Identificação da Classe</Label>
                <p className="text-sm font-medium">
                  {selectedClasse.identificacao}
                </p>
              </div>
              <div>
                <Label>Código ERP</Label>
                <p className="text-sm font-medium">
                  {selectedClasse.codigoERP}
                </p>
              </div>
              <div>
                <Label>Nome da Classe</Label>
                <p className="text-sm font-medium">
                  {selectedClasse.nomeClasse}
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  variant={selectedClasse.ativo ? "default" : "destructive"}
                >
                  {selectedClasse.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Classe */}
      <Dialog
        open={showClasseEditDialog}
        onOpenChange={setShowClasseEditDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Classe</DialogTitle>
            <DialogDescription>
              Edite as informações da classe selecionada
            </DialogDescription>
          </DialogHeader>

          <Form {...classeForm}>
            <form
              onSubmit={classeForm.handleSubmit(onSubmitClasse)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={classeForm.control}
                  name="identificacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identificação da Classe *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: CLS-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={classeForm.control}
                  name="codigoERP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código ERP *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: ERP-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={classeForm.control}
                  name="nomeClasse"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome da Classe *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Herbicidas" {...field} />
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
                  onClick={() => setShowClasseEditDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar Classe */}
      <Dialog
        open={showClasseAddDialog}
        onOpenChange={setShowClasseAddDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Classe</DialogTitle>
            <DialogDescription>
              Preencha todas as informações obrigatórias da nova classe
            </DialogDescription>
          </DialogHeader>

          <Form {...classeForm}>
            <form
              onSubmit={classeForm.handleSubmit(onSubmitClasse)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={classeForm.control}
                  name="identificacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identificação da Classe *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: CLS-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={classeForm.control}
                  name="codigoERP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código ERP *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: ERP-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={classeForm.control}
                  name="nomeClasse"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Nome da Classe *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Herbicidas" {...field} />
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
                  onClick={() => setShowClasseAddDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar Classe</Button>
              </DialogFooter>
            </form>
          </Form>
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
                <Label>Classe</Label>
                <p className="text-sm font-medium">
                  {getClasseById(selectedCategoria.classeId)?.nomeClasse || "N/A"}
                </p>
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
                  name="classeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma classe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes
                            .filter((classe) => classe.ativo)
                            .map((classe) => (
                              <SelectItem
                                key={classe.id}
                                value={classe.id.toString()}
                              >
                                {classe.nomeClasse}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoriaForm.control}
                  name="descricaoResumida"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
                  name="classeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe *</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma classe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes
                            .filter((classe) => classe.ativo)
                            .map((classe) => (
                              <SelectItem
                                key={classe.id}
                                value={classe.id.toString()}
                              >
                                {classe.nomeClasse}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} //TAYAR PASSOU POR AQUI
                />

                <FormField
                  control={categoriaForm.control}
                  name="descricaoResumida"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
      <AlertDialog
        open={showClasseDeleteDialog}
        onOpenChange={setShowClasseDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Desativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar a classe "
              {selectedClasse?.nomeClasse}"? Esta ação não pode ser
              desfeita e a classe não aparecerá mais nas consultas ativas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteClasse}>
              Confirmar Desativação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
