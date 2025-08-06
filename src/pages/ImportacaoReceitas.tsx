import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Download, Upload, FileText, ExternalLink, CheckCircle, AlertTriangle, Clock, RefreshCw, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data para demonstração
const mockPlataformas = [
  { 
    id: 1, 
    nome: "AgroTech Solutions", 
    url: "https://agrotech.com.br", 
    apiKey: "at_123...", 
    status: "conectado", 
    ultimaSync: "2024-01-15 14:30",
    totalReceitas: 245,
    receitasImportadas: 12
  },
  { 
    id: 2, 
    nome: "Campo Digital", 
    url: "https://campodigital.agr.br", 
    apiKey: "cd_456...", 
    status: "desconectado", 
    ultimaSync: "2024-01-10 09:15",
    totalReceitas: 189,
    receitasImportadas: 8
  },
  { 
    id: 3, 
    nome: "Agro Expert", 
    url: "https://agroexpert.com", 
    apiKey: "", 
    status: "pendente", 
    ultimaSync: "Nunca",
    totalReceitas: 0,
    receitasImportadas: 0
  }
];

const mockReceitasDisponiveis = [
  {
    id: 1,
    nome: "Controle de Pragas em Tomate",
    categoria: "defensivo",
    cultura: "tomate",
    plataforma: "AgroTech Solutions",
    autor: "Dr. João Agrônomo",
    descricao: "Receita para controle eficaz de pragas em cultura de tomate",
    componentes: ["Glifosato 480g/L", "Adjuvante", "Água"],
    dosagem: "2L/ha",
    aplicacao: "Pulverização foliar",
    importado: false,
    avaliacoes: 4.8,
    utilizacoes: 156
  },
  {
    id: 2,
    nome: "Fertilização NPK Alface",
    categoria: "fertilizante",
    cultura: "alface",
    plataforma: "Campo Digital",
    autor: "Eng. Maria Silva",
    descricao: "Programa de fertilização balanceada para alface hidropônica",
    componentes: ["NPK 20-05-20", "Micronutrientes", "Água"],
    dosagem: "1.5kg/1000L",
    aplicacao: "Fertirrigação",
    importado: true,
    avaliacoes: 4.5,
    utilizacoes: 89
  },
  {
    id: 3,
    nome: "Bioestimulante para Milho",
    categoria: "bioestimulante",
    cultura: "milho",
    plataforma: "AgroTech Solutions",
    autor: "Prof. Carlos Santos",
    descricao: "Bioestimulante natural para desenvolvimento radicular do milho",
    componentes: ["Bioestimulante", "Surfactante", "Água"],
    dosagem: "500ml/ha",
    aplicacao: "Pulverização",
    importado: false,
    avaliacoes: 4.9,
    utilizacoes: 234
  }
];

const ImportacaoReceitas = () => {
  const { toast } = useToast();
  const [plataformas, setPlataformas] = useState(mockPlataformas);
  const [receitasDisponiveis, setReceitasDisponiveis] = useState(mockReceitasDisponiveis);
  const [dialogPlataformaAberto, setDialogPlataformaAberto] = useState(false);
  const [dialogImportacaoAberto, setDialogImportacaoAberto] = useState(false);
  const [plataformaEditando, setPlataformaEditando] = useState<any>(null);
  const [importandoReceitas, setImportandoReceitas] = useState(false);
  const [progressoImportacao, setProgressoImportacao] = useState(0);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroCultura, setFiltroCultura] = useState("");
  const [filtroPlataforma, setFiltroPlataforma] = useState("");
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [receitasSelecionadas, setReceitasSelecionadas] = useState<number[]>([]);

  const [novaPlataforma, setNovaPlataforma] = useState({
    nome: "",
    url: "",
    apiKey: "",
    configuracoes: {
      importacaoAutomatica: false,
      filtrarPorCultura: true,
      aprovarAutomaticamente: false
    }
  });

  const receitasFiltradas = receitasDisponiveis.filter(receita => {
    const matchPesquisa = receita.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
                         receita.autor.toLowerCase().includes(termoPesquisa.toLowerCase());
    const matchCategoria = !filtroCategoria || receita.categoria === filtroCategoria;
    const matchCultura = !filtroCultura || receita.cultura === filtroCultura;
    const matchPlataforma = !filtroPlataforma || receita.plataforma === filtroPlataforma;
    
    return matchPesquisa && matchCategoria && matchCultura && matchPlataforma;
  });

  const handleConectarPlataforma = async (plataforma: any) => {
    // Simular conexão
    setPlataformas(prev => prev.map(p => 
      p.id === plataforma.id 
        ? { ...p, status: "conectado", ultimaSync: new Date().toLocaleString('pt-BR') }
        : p
    ));
    toast({ title: "Plataforma conectada com sucesso!", variant: "default" });
  };

  const handleAdicionarPlataforma = () => {
    const plataforma = {
      id: plataformas.length + 1,
      ...novaPlataforma,
      status: "pendente",
      ultimaSync: "Nunca",
      totalReceitas: 0,
      receitasImportadas: 0
    };
    setPlataformas([...plataformas, plataforma]);
    setNovaPlataforma({
      nome: "",
      url: "",
      apiKey: "",
      configuracoes: {
        importacaoAutomatica: false,
        filtrarPorCultura: true,
        aprovarAutomaticamente: false
      }
    });
    setDialogPlataformaAberto(false);
    toast({ title: "Plataforma adicionada com sucesso!", variant: "default" });
  };

  const handleImportarReceitas = async () => {
    if (receitasSelecionadas.length === 0) {
      toast({ title: "Selecione pelo menos uma receita para importar", variant: "destructive" });
      return;
    }

    setImportandoReceitas(true);
    setDialogImportacaoAberto(true);
    setProgressoImportacao(0);

    // Simular importação
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgressoImportacao(i);
    }

    // Marcar receitas como importadas
    setReceitasDisponiveis(prev => prev.map(receita => 
      receitasSelecionadas.includes(receita.id) 
        ? { ...receita, importado: true }
        : receita
    ));

    setImportandoReceitas(false);
    setReceitasSelecionadas([]);
    
    setTimeout(() => {
      setDialogImportacaoAberto(false);
      toast({ 
        title: `${receitasSelecionadas.length} receita(s) importada(s) com sucesso!`, 
        variant: "default" 
      });
    }, 1000);
  };

  const handleSelecionarReceita = (receitaId: number) => {
    setReceitasSelecionadas(prev => 
      prev.includes(receitaId) 
        ? prev.filter(id => id !== receitaId)
        : [...prev, receitaId]
    );
  };

  const handleSelecionarTodas = () => {
    if (receitasSelecionadas.length === receitasFiltradas.filter(r => !r.importado).length) {
      setReceitasSelecionadas([]);
    } else {
      setReceitasSelecionadas(receitasFiltradas.filter(r => !r.importado).map(r => r.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      conectado: "default",
      desconectado: "secondary",
      pendente: "outline"
    };
    return (variants[status as keyof typeof variants] || "outline") as "default" | "destructive" | "secondary" | "outline";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "conectado": return <CheckCircle className="h-4 w-4 text-success" />;
      case "desconectado": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "pendente": return <Clock className="h-4 w-4 text-warning" />;
      default: return null;
    }
  };

  const getCategoriaBadge = (categoria: string) => {
    const cores = {
      defensivo: "destructive",
      fertilizante: "default",
      bioestimulante: "secondary"
    };
    return (cores[categoria as keyof typeof cores] || "outline") as "default" | "destructive" | "secondary" | "outline";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Importação de Receitas</h1>
          <p className="text-muted-foreground">
            Conecte-se a plataformas de agronomia e importe receitas de caldas defensivas
          </p>
        </div>
        <Dialog open={dialogPlataformaAberto} onOpenChange={setDialogPlataformaAberto}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Conectar Plataforma
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Conectar Nova Plataforma</DialogTitle>
              <DialogDescription>
                Configure uma nova plataforma de agronomia para importar receitas.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomePlataforma">Nome da Plataforma</Label>
                  <Input
                    id="nomePlataforma"
                    value={novaPlataforma.nome}
                    onChange={(e) => setNovaPlataforma({ ...novaPlataforma, nome: e.target.value })}
                    placeholder="Ex: AgroTech Solutions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urlPlataforma">URL da API</Label>
                  <Input
                    id="urlPlataforma"
                    value={novaPlataforma.url}
                    onChange={(e) => setNovaPlataforma({ ...novaPlataforma, url: e.target.value })}
                    placeholder="https://api.agrotech.com.br"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Chave da API</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={novaPlataforma.apiKey}
                    onChange={(e) => setNovaPlataforma({ ...novaPlataforma, apiKey: e.target.value })}
                    placeholder="Chave de acesso fornecida pela plataforma"
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Configurações de Importação</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="importacaoAuto">Importação Automática</Label>
                      <Switch
                        id="importacaoAuto"
                        checked={novaPlataforma.configuracoes.importacaoAutomatica}
                        onCheckedChange={(checked) => setNovaPlataforma({ 
                          ...novaPlataforma, 
                          configuracoes: { 
                            ...novaPlataforma.configuracoes, 
                            importacaoAutomatica: checked 
                          } 
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="filtrarCultura">Filtrar por Cultura Local</Label>
                      <Switch
                        id="filtrarCultura"
                        checked={novaPlataforma.configuracoes.filtrarPorCultura}
                        onCheckedChange={(checked) => setNovaPlataforma({ 
                          ...novaPlataforma, 
                          configuracoes: { 
                            ...novaPlataforma.configuracoes, 
                            filtrarPorCultura: checked 
                          } 
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="aprovarAuto">Aprovar Automaticamente</Label>
                      <Switch
                        id="aprovarAuto"
                        checked={novaPlataforma.configuracoes.aprovarAutomaticamente}
                        onCheckedChange={(checked) => setNovaPlataforma({ 
                          ...novaPlataforma, 
                          configuracoes: { 
                            ...novaPlataforma.configuracoes, 
                            aprovarAutomaticamente: checked 
                          } 
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogPlataformaAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdicionarPlataforma}>
                Adicionar Plataforma
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="plataformas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plataformas" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Plataformas Conectadas
          </TabsTrigger>
          <TabsTrigger value="receitas" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Receitas Disponíveis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plataformas" className="space-y-6">
          {/* Estatísticas das Plataformas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{plataformas.length}</p>
                    <p className="text-xs text-muted-foreground">Plataformas Cadastradas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{plataformas.filter(p => p.status === "conectado").length}</p>
                    <p className="text-xs text-muted-foreground">Conectadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{plataformas.reduce((acc, p) => acc + p.totalReceitas, 0)}</p>
                    <p className="text-xs text-muted-foreground">Receitas Disponíveis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Download className="h-8 w-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">{plataformas.reduce((acc, p) => acc + p.receitasImportadas, 0)}</p>
                    <p className="text-xs text-muted-foreground">Receitas Importadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Plataformas */}
          <Card>
            <CardHeader>
              <CardTitle>Plataformas Cadastradas</CardTitle>
              <CardDescription>
                Gerencie suas conexões com plataformas de agronomia
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Receitas</TableHead>
                    <TableHead>Última Sync</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plataformas.map((plataforma) => (
                    <TableRow key={plataforma.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plataforma.nome}</div>
                          <div className="text-sm text-muted-foreground">{plataforma.url}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(plataforma.status)}
                          <Badge variant={getStatusBadge(plataforma.status)}>
                            {plataforma.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plataforma.totalReceitas} disponíveis</div>
                          <div className="text-sm text-muted-foreground">{plataforma.receitasImportadas} importadas</div>
                        </div>
                      </TableCell>
                      <TableCell>{plataforma.ultimaSync}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {plataforma.status === "pendente" && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleConectarPlataforma(plataforma)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receitas" className="space-y-6">
          {/* Dialog de Importação */}
          <Dialog open={dialogImportacaoAberto} onOpenChange={setDialogImportacaoAberto}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Importando Receitas</DialogTitle>
                <DialogDescription>
                  Aguarde enquanto as receitas são importadas...
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Progress value={progressoImportacao} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {progressoImportacao}% concluído
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Filtros e Controles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros e Controles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pesquisa">Pesquisar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pesquisa"
                      placeholder="Nome ou autor..."
                      value={termoPesquisa}
                      onChange={(e) => setTermoPesquisa(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="defensivo">Defensivo</SelectItem>
                      <SelectItem value="fertilizante">Fertilizante</SelectItem>
                      <SelectItem value="bioestimulante">Bioestimulante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cultura</Label>
                  <Select value={filtroCultura} onValueChange={setFiltroCultura}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="tomate">Tomate</SelectItem>
                      <SelectItem value="alface">Alface</SelectItem>
                      <SelectItem value="milho">Milho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Plataforma</Label>
                  <Select value={filtroPlataforma} onValueChange={setFiltroPlataforma}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {plataformas.map((plataforma) => (
                        <SelectItem key={plataforma.id} value={plataforma.nome}>
                          {plataforma.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleSelecionarTodas}
                    >
                      {receitasSelecionadas.length === receitasFiltradas.filter(r => !r.importado).length ? "Desmarcar" : "Selecionar"} Todas
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleImportarReceitas}
                      disabled={receitasSelecionadas.length === 0 || importandoReceitas}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Importar ({receitasSelecionadas.length})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Receitas */}
          <Card>
            <CardHeader>
              <CardTitle>Receitas Disponíveis para Importação</CardTitle>
              <CardDescription>
                {receitasFiltradas.length} receita(s) encontrada(s) • {receitasSelecionadas.length} selecionada(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={receitasSelecionadas.length === receitasFiltradas.filter(r => !r.importado).length && receitasFiltradas.filter(r => !r.importado).length > 0}
                        onCheckedChange={handleSelecionarTodas}
                      />
                    </TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Cultura</TableHead>
                    <TableHead>Plataforma</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receitasFiltradas.map((receita) => (
                    <TableRow key={receita.id} className={receita.importado ? "opacity-50" : ""}>
                      <TableCell>
                        {!receita.importado && (
                          <Checkbox
                            checked={receitasSelecionadas.includes(receita.id)}
                            onCheckedChange={() => handleSelecionarReceita(receita.id)}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{receita.nome}</div>
                          <div className="text-sm text-muted-foreground">por {receita.autor}</div>
                          <div className="text-xs text-muted-foreground mt-1">{receita.descricao}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getCategoriaBadge(receita.categoria)}>
                          {receita.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{receita.cultura}</TableCell>
                      <TableCell>{receita.plataforma}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">⭐ {receita.avaliacoes}</span>
                          <span className="text-xs text-muted-foreground">({receita.utilizacoes})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {receita.importado ? (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Importado
                          </Badge>
                        ) : (
                          <Badge variant="outline">Disponível</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportacaoReceitas;