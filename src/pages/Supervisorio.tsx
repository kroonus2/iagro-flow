import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

import { SupervisoryView, MockPLC, ComponentType, PLCVariable, ScadaComponent } from "@/types/supervisorio";
import { ScadaCanvas } from "@/components/supervisorio/ScadaCanvas";
import { ComponentPalette } from "@/components/supervisorio/ComponentPalette";
import { ComponentProperties } from "@/components/supervisorio/ComponentProperties";

// Mock de PLCs e suas variáveis
const mockPLCs: MockPLC[] = [
  {
    id: "CLP001",
    name: "Smart Calda 01",
    connected: true,
    variables: [
      { endereco: "AI001", nome: "Temperatura", tipo: "analogico", valor: 65.2, unidade: "°C" },
      { endereco: "AI002", nome: "Pressão", tipo: "analogico", valor: 2.1, unidade: "bar" },
      { endereco: "AI003", nome: "Nível", tipo: "analogico", valor: 78, unidade: "%" },
      { endereco: "AI004", nome: "Vazão", tipo: "analogico", valor: 120.5, unidade: "L/min" },
      { endereco: "DI001", nome: "Sensor Nível Alto", tipo: "digital", valor: true },
      { endereco: "DI002", nome: "Sensor Nível Baixo", tipo: "digital", valor: false },
      { endereco: "DO001", nome: "Bomba Principal", tipo: "digital", valor: true },
      { endereco: "DO002", nome: "Válvula Entrada", tipo: "digital", valor: true },
    ]
  },
  {
    id: "CLP002",
    name: "Smart Calda 02",
    connected: true,
    variables: [
      { endereco: "AI005", nome: "Temperatura", tipo: "analogico", valor: 22.1, unidade: "°C" },
      { endereco: "AI006", nome: "Pressão", tipo: "analogico", valor: 0.0, unidade: "bar" },
      { endereco: "AI007", nome: "Nível", tipo: "analogico", valor: 15, unidade: "%" },
      { endereco: "DI005", nome: "Sensor Nível Alto", tipo: "digital", valor: false },
      { endereco: "DO005", nome: "Bomba Principal", tipo: "digital", valor: false },
    ]
  },
  {
    id: "CLP003",
    name: "Smart Calda 03",
    connected: false,
    variables: []
  }
];

const Supervisorio = () => {
  const [views, setViews] = useState<SupervisoryView[]>([
    {
      id: "view1",
      name: "Vista Geral - CLP 01",
      plcId: "CLP001",
      components: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  const [selectedViewId, setSelectedViewId] = useState<string>("view1");
  const [selectedComponentId, setSelectedComponentId] = useState<string>();
  const [newViewName, setNewViewName] = useState("");
  const [newViewPLC, setNewViewPLC] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [plcVariables, setPlcVariables] = useState<PLCVariable[]>(mockPLCs[0].variables);

  const selectedView = views.find(v => v.id === selectedViewId);
  const selectedComponent = selectedView?.components.find(c => c.id === selectedComponentId);

  // Simular atualização em tempo real das variáveis
  useEffect(() => {
    const interval = setInterval(() => {
      setPlcVariables(prev => prev.map(v => {
        if (v.tipo === "analogico" && v.endereco.startsWith("AI")) {
          return {
            ...v,
            valor: Number(v.valor) + (Math.random() - 0.5) * 2
          };
        }
        return v;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Atualizar variáveis ao trocar de view
  useEffect(() => {
    if (selectedView) {
      const plc = mockPLCs.find(p => p.id === selectedView.plcId);
      if (plc) {
        setPlcVariables(plc.variables);
      }
    }
  }, [selectedViewId, selectedView]);

  const handleCreateView = () => {
    if (!newViewName || !newViewPLC) {
      toast.error("Preencha todos os campos");
      return;
    }

    const newView: SupervisoryView = {
      id: `view${Date.now()}`,
      name: newViewName,
      plcId: newViewPLC,
      components: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setViews([...views, newView]);
    setSelectedViewId(newView.id);
    setNewViewName("");
    setNewViewPLC("");
    setIsCreateDialogOpen(false);
    toast.success("View criada com sucesso!");
  };

  const handleDeleteView = () => {
    if (views.length === 1) {
      toast.error("Não é possível excluir a última view");
      return;
    }

    setViews(views.filter(v => v.id !== selectedViewId));
    setSelectedViewId(views[0].id);
    toast.success("View removida com sucesso!");
  };

  const handleAddComponent = (type: ComponentType) => {
    if (!selectedView) return;

    const newComponent: ScadaComponent = {
      id: `comp${Date.now()}`,
      type,
      position: { x: 300, y: 300 },
      label: `${type}-${selectedView.components.length + 1}`,
    };

    updateViewComponents([...selectedView.components, newComponent]);
    setSelectedComponentId(newComponent.id);
    toast.success("Componente adicionado!");
  };

  const handleUpdateComponent = (updatedComponent: ScadaComponent) => {
    if (!selectedView) return;
    
    updateViewComponents(
      selectedView.components.map(c => 
        c.id === updatedComponent.id ? updatedComponent : c
      )
    );
  };

  const handleDeleteComponent = () => {
    if (!selectedView || !selectedComponentId) return;
    
    updateViewComponents(
      selectedView.components.filter(c => c.id !== selectedComponentId)
    );
    setSelectedComponentId(undefined);
    toast.success("Componente removido!");
  };

  const updateViewComponents = (components: ScadaComponent[]) => {
    setViews(views.map(v => 
      v.id === selectedViewId 
        ? { ...v, components, updatedAt: new Date() }
        : v
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setViews(views.map(v => 
        v.id === selectedViewId 
          ? { ...v, backgroundImage: imageUrl }
          : v
      ));
      toast.success("Imagem de fundo carregada!");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supervisório SCADA</h1>
          <p className="text-muted-foreground">
            Sistema de supervisão e controle visual
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova View
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova View</DialogTitle>
                <DialogDescription>
                  Configure uma nova visualização do supervisório
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="viewName">Nome da View</Label>
                  <Input
                    id="viewName"
                    placeholder="Ex: Vista Geral"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="viewPLC">CLP</Label>
                  <Select value={newViewPLC} onValueChange={setNewViewPLC}>
                    <SelectTrigger id="viewPLC">
                      <SelectValue placeholder="Selecione um CLP" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPLCs.map((plc) => (
                        <SelectItem key={plc.id} value={plc.id}>
                          {plc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateView} className="w-full">
                  Criar View
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar esquerda - Paleta de componentes */}
        <div className="space-y-4">
          <ComponentPalette onAddComponent={handleAddComponent} />
          
          <Card>
            <CardHeader>
              <CardTitle>Imagem de Fundo</CardTitle>
              <CardDescription>Faça upload de uma imagem</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="background" className="cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-4 hover:bg-muted/50 transition-colors flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Clique para fazer upload</span>
                </div>
                <Input
                  id="background"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
              {selectedView?.backgroundImage && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    setViews(views.map(v => 
                      v.id === selectedViewId 
                        ? { ...v, backgroundImage: undefined }
                        : v
                    ));
                    toast.success("Imagem removida!");
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Imagem
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Canvas central */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Views</CardTitle>
                  <CardDescription>Selecione ou crie uma visualização</CardDescription>
                </div>
                {views.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteView}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedViewId} onValueChange={setSelectedViewId}>
                <TabsList className="w-full justify-start overflow-x-auto">
                  {views.map((view) => (
                    <TabsTrigger key={view.id} value={view.id}>
                      {view.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {selectedView && (
            <ScadaCanvas
              components={selectedView.components}
              backgroundImage={selectedView.backgroundImage}
              plcVariables={plcVariables}
              onComponentsChange={updateViewComponents}
              selectedComponentId={selectedComponentId}
              onSelectComponent={setSelectedComponentId}
            />
          )}
        </div>

        {/* Sidebar direita - Propriedades */}
        <div>
          <ComponentProperties
            component={selectedComponent || null}
            plcVariables={plcVariables}
            onUpdate={handleUpdateComponent}
            onDelete={handleDeleteComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default Supervisorio;
