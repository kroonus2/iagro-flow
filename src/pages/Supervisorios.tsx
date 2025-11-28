import { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  AlertTriangle,
  ArrowLeft,
  Bell,
  Database,
  Eye,
  Layout,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  ComponentType,
  DomainSupervisoryComponent,
  DomainSupervisoryView,
  PLCVariable,
  ScadaComponent as VisualComponent,
  Supervisory,
  SupervisoryAlarm,
  SupervisoryAlarmStatus,
} from "@/types/supervisorio";
import {
  acknowledgeAlarm,
  AlarmFilters,
  createSupervisory,
  createView,
  deleteSupervisory,
  deleteView,
  listAlarms,
  listSupervisories,
  listViewsBySupervisory,
  mockPLCs,
  mockSmartCaldas,
  subscribeRealtime,
  upsertViewComponents,
  listComponentsByView,
} from "@/lib/supervisory-mock";
import { ScadaCanvas } from "@/components/supervisorio/ScadaCanvas";
import { ComponentPalette } from "@/components/supervisorio/ComponentPalette";
import { ComponentProperties } from "@/components/supervisorio/ComponentProperties";

type DetailTab = "views" | "settings" | "alarms";
type ViewEditorTab = "view" | "components";

const mapDomainToVisual = (
  components: DomainSupervisoryComponent[],
  plcVariables: PLCVariable[]
): VisualComponent[] => {
  return components.map((c) => {
    const variable = plcVariables.find((v) => v.id === c.variableId);
    return {
      id: c.id,
      type: c.type as ComponentType,
      position: { x: c.x, y: c.y },
      plcVariable: variable?.endereco,
      label: c.label,
      config: c.config as VisualComponent["config"],
    };
  });
};

const mapVisualToDomain = (
  components: VisualComponent[],
  viewId: string,
  plcVariables: PLCVariable[]
): DomainSupervisoryComponent[] => {
  return components.map((c) => {
    const variable = plcVariables.find((v) => v.endereco === c.plcVariable);
    return {
      id: c.id,
      viewId,
      type: c.type,
      x: c.position.x,
      y: c.position.y,
      width: undefined,
      height: undefined,
      variableId: variable?.id,
      label: c.label,
      config: c.config ?? {},
    };
  });
};

const statusToBadgeVariant = (status: SupervisoryAlarmStatus) => {
  if (status === "active") return "destructive" as const;
  return "outline" as const;
};

const formatDateTime = (value?: Date | null) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("pt-BR");
  } catch {
    return "-";
  }
};

const Supervisorios = () => {
  const [supervisories, setSupervisories] = useState<Supervisory[]>([]);
  const [loadingSupervisories, setLoadingSupervisories] = useState(false);
  const [selectedSupervisoryId, setSelectedSupervisoryId] = useState<
    string | null
  >(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("views");

  const [views, setViews] = useState<DomainSupervisoryView[]>([]);
  const [loadingViews, setLoadingViews] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);
  const [viewEditorTab, setViewEditorTab] =
    useState<ViewEditorTab>("view");
  const [isViewEditorFullscreen, setIsViewEditorFullscreen] =
    useState(false);

  const [visualComponents, setVisualComponents] = useState<
    VisualComponent[]
  >([]);
  const [selectedComponentId, setSelectedComponentId] = useState<
    string | undefined
  >(undefined);

  const [plcVariables, setPlcVariables] = useState<PLCVariable[]>([]);

  const [alarms, setAlarms] = useState<SupervisoryAlarm[]>([]);
  const [loadingAlarms, setLoadingAlarms] = useState(false);
  const [alarmFilters, setAlarmFilters] = useState<AlarmFilters>({
    status: undefined,
  });

  const [createSupDialogOpen, setCreateSupDialogOpen] = useState(false);
  const [newSupName, setNewSupName] = useState("");
  const [newSupDescription, setNewSupDescription] = useState("");
  const [newSupSmartCaldaId, setNewSupSmartCaldaId] = useState("");

  const [createViewDialogOpen, setCreateViewDialogOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [newViewDescription, setNewViewDescription] = useState("");

  const selectedSupervisory = useMemo(
    () => supervisories.find((s) => s.id === selectedSupervisoryId) || null,
    [supervisories, selectedSupervisoryId]
  );

  const selectedView = useMemo(
    () => views.find((v) => v.id === selectedViewId) || null,
    [views, selectedViewId]
  );

  const selectedVisualComponent = useMemo(
    () =>
      visualComponents.find((c) => c.id === selectedComponentId) || null,
    [visualComponents, selectedComponentId]
  );

  // Carregar lista inicial de supervisórios
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingSupervisories(true);
        const data = await listSupervisories();
        setSupervisories(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar supervisórios");
      } finally {
        setLoadingSupervisories(false);
      }
    };
    void load();
  }, []);

  // Atualizar PLCs e realtime quando muda o supervisório selecionado
  useEffect(() => {
    if (!selectedSupervisory) return;
    const plc = mockPLCs.find(
      (p) => p.id === selectedSupervisory.smartCaldaId
    );
    if (plc) {
      setPlcVariables(plc.variables);
    }

    const unsubscribe = subscribeRealtime(
      [selectedSupervisory.smartCaldaId],
      (payload) => {
        if (payload.smartCaldaId === selectedSupervisory.smartCaldaId) {
          setPlcVariables(payload.variables);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedSupervisory]);

  // Carregar views quando muda o supervisório
  useEffect(() => {
    if (!selectedSupervisory) {
      setViews([]);
      setSelectedViewId(null);
      return;
    }
    const loadViews = async () => {
      try {
        setLoadingViews(true);
        const data = await listViewsBySupervisory(selectedSupervisory.id);
        setViews(data);
        setSelectedViewId(data[0]?.id ?? null);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar views");
      } finally {
        setLoadingViews(false);
      }
    };
    void loadViews();
  }, [selectedSupervisory]);

  // Carregar componentes da view selecionada
  useEffect(() => {
    if (!selectedView) {
      setVisualComponents([]);
      setSelectedComponentId(undefined);
      return;
    }

    const loadComponents = async () => {
      try {
        const comps = await listComponentsByView(selectedView.id);
        setVisualComponents(mapDomainToVisual(comps, plcVariables));
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar componentes da view");
      }
    };
    void loadComponents();
  }, [selectedView?.id]);

  // Carregar alarmes quando aba de alarmes estiver ativa
  useEffect(() => {
    if (detailTab !== "alarms" || !selectedSupervisory) return;
    const loadAlarms = async () => {
      try {
        setLoadingAlarms(true);
        const data = await listAlarms({
          smartCaldaId: selectedSupervisory.smartCaldaId,
          status: alarmFilters.status,
        });
        setAlarms(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar alarmes");
      } finally {
        setLoadingAlarms(false);
      }
    };
    void loadAlarms();
  }, [detailTab, selectedSupervisory, alarmFilters.status]);

  const handleCreateSupervisory = async () => {
    if (!newSupName || !newSupSmartCaldaId) {
      toast.error("Preencha nome e Smart Calda");
      return;
    }
    try {
      const sup = await createSupervisory({
        name: newSupName,
        description: newSupDescription,
        smartCaldaId: newSupSmartCaldaId,
      });
      setSupervisories((prev) => [...prev, sup]);
      setNewSupName("");
      setNewSupDescription("");
      setNewSupSmartCaldaId("");
      setCreateSupDialogOpen(false);
      toast.success("Supervisório criado com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar supervisório");
    }
  };

  const handleDeleteSupervisory = async (id: string) => {
    try {
      await deleteSupervisory(id);
      setSupervisories((prev) => prev.filter((s) => s.id !== id));
      if (selectedSupervisoryId === id) {
        setSelectedSupervisoryId(null);
      }
      toast.success("Supervisório removido");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover supervisório");
    }
  };

  const handleCreateView = async () => {
    if (!selectedSupervisory) return;
    if (!newViewName) {
      toast.error("Informe o nome da view");
      return;
    }
    try {
      const view = await createView(selectedSupervisory.id, {
        name: newViewName,
        description: newViewDescription,
      });
      setViews((prev) => [...prev, view]);
      setSelectedViewId(view.id);
      setNewViewName("");
      setNewViewDescription("");
      setCreateViewDialogOpen(false);
      toast.success("View criada");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar view");
    }
  };

  const handleDeleteView = async (id: string) => {
    try {
      await deleteView(id);
      setViews((prev) => prev.filter((v) => v.id !== id));
      if (selectedViewId === id) {
        setSelectedViewId(null);
        setVisualComponents([]);
      }
      toast.success("View removida");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover view");
    }
  };

  const handleAddComponent = (type: ComponentType) => {
    if (!selectedViewId) {
      toast.error("Selecione uma view primeiro");
      return;
    }
    const newComponent: VisualComponent = {
      id: `comp-${Date.now()}`,
      type,
      position: { x: 300, y: 300 },
      label:
        type === "button"
          ? "Enviar"
          : type === "textLabel"
          ? "Texto"
          : type === "textInput"
          ? "Entrada"
          : `${type}-${visualComponents.length + 1}`,
      config:
        type === "line"
          ? { rotation: 0, length: 80 }
          : type === "button" || type === "textLabel" || type === "textInput"
          ? { rotation: 0, size: 1 }
          : undefined,
    };
    const updatedVisual = [...visualComponents, newComponent];
    setVisualComponents(updatedVisual);
    setSelectedComponentId(newComponent.id);
    toast.success("Componente adicionado");
  };

  const handleUpdateComponent = (updated: VisualComponent) => {
    if (!selectedViewId) return;
    const updatedVisual = visualComponents.map((c) =>
      c.id === updated.id ? updated : c
    );
    setVisualComponents(updatedVisual);
  };

  const handleDeleteComponent = () => {
    if (!selectedViewId || !selectedComponentId) return;
    const updatedVisual = visualComponents.filter(
      (c) => c.id !== selectedComponentId
    );
    setVisualComponents(updatedVisual);
    setSelectedComponentId(undefined);
    toast.success("Componente removido");
  };

  const handleComponentsChangeFromCanvas = (
    updatedVisual: VisualComponent[]
  ) => {
    setVisualComponents(updatedVisual);
  };

  const handleSaveLayout = async () => {
    if (!selectedViewId) return;
    const domainComponents: DomainSupervisoryComponent[] =
      mapVisualToDomain(visualComponents, selectedViewId, plcVariables);
    try {
      await upsertViewComponents(
        selectedViewId,
        domainComponents.map(
          ({ id: _id, viewId: _viewId, ...rest }) => rest
        )
      );
      toast.success("Layout salvo (mock)");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar layout");
    }
  };

  const handleAcknowledgeAlarm = async (alarmId: string) => {
    try {
      await acknowledgeAlarm(alarmId);
      setAlarms((prev) =>
        prev.map((a) =>
          a.id === alarmId ? { ...a, status: "acknowledged" } : a
        )
      );
      toast.success("Alarme reconhecido");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao reconhecer alarme");
    }
  };

  // ---------- Render helpers ----------

  const renderSupervisoryList = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Supervisórios
            </h1>
            <p className="text-muted-foreground">
              Configure supervisórios, views e layouts de supervisão.
            </p>
          </div>
          <Dialog
            open={createSupDialogOpen}
            onOpenChange={setCreateSupDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Supervisório
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Supervisório</DialogTitle>
                <DialogDescription>
                  Vincule a uma Smart Calda e defina nome e descrição.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sup-smartcalda">
                    Smart Calda
                  </Label>
                  <Select
                    value={newSupSmartCaldaId}
                    onValueChange={setNewSupSmartCaldaId}
                  >
                    <SelectTrigger id="sup-smartcalda">
                      <SelectValue placeholder="Selecione uma Smart Calda" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSmartCaldas.map((sc) => (
                        <SelectItem key={sc.id} value={sc.id}>
                          {sc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sup-name">Nome</Label>
                  <Input
                    id="sup-name"
                    value={newSupName}
                    onChange={(e) => setNewSupName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sup-description">
                    Descrição (opcional)
                  </Label>
                  <Input
                    id="sup-description"
                    value={newSupDescription}
                    onChange={(e) =>
                      setNewSupDescription(e.target.value)
                    }
                  />
                </div>
                <Button className="w-full" onClick={handleCreateSupervisory}>
                  Criar Supervisório
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Supervisórios</CardTitle>
            <CardDescription>
              Supervisórios configurados para as Smart Caldas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSupervisories ? (
              <p className="text-sm text-muted-foreground">
                Carregando...
              </p>
            ) : supervisories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum supervisório cadastrado.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Smart Calda</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[120px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supervisories.map((s) => {
                    const sc = mockSmartCaldas.find(
                      (m) => m.id === s.smartCaldaId
                    );
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">
                          {s.name}
                        </TableCell>
                        <TableCell>
                          {sc ? sc.name : s.smartCaldaId}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {s.description || "-"}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(s.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedSupervisoryId(s.id);
                              setDetailTab("views");
                            }}
                            aria-label="Abrir supervisório"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() =>
                              handleDeleteSupervisory(s.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderViewEditor = () => {
    if (!selectedView || !selectedSupervisory) return null;

    const editorCard = (
      <Card className={isViewEditorFullscreen ? "flex-1 flex flex-col rounded-none border-0 shadow-none" : "mt-4"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout className="h-6 w-6" />
              <div>
                <CardTitle>{selectedView.name}</CardTitle>
                {selectedView.description && (
                  <CardDescription>
                    {selectedView.description}
                  </CardDescription>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {viewEditorTab === "components" && (
                <Button variant="outline" size="sm" onClick={handleSaveLayout}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar layout (mock)
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsViewEditorFullscreen((prev) => !prev)}
              >
                {isViewEditorFullscreen ? "Sair tela cheia" : "Tela cheia"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent
          className={
            isViewEditorFullscreen ? "flex-1 flex flex-col p-0" : ""
          }
        >
          <Tabs
            value={viewEditorTab}
            onValueChange={(v) => setViewEditorTab(v as ViewEditorTab)}
            className={
              isViewEditorFullscreen ? "space-y-4 flex flex-col h-full" : "space-y-4"
            }
          >
            <TabsList>
              <TabsTrigger value="view">Visualização</TabsTrigger>
              <TabsTrigger value="components">
                Gerenciar Componentes
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="view"
              className={isViewEditorFullscreen ? "flex-1" : "mt-4"}
            >
              <div className={isViewEditorFullscreen ? "flex-1" : ""}>
                <ScadaCanvas
                  components={visualComponents}
                  backgroundImage={selectedView.backgroundImage}
                  plcVariables={plcVariables}
                  onComponentsChange={handleComponentsChangeFromCanvas}
                  selectedComponentId={selectedComponentId}
                  onSelectComponent={setSelectedComponentId}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="components"
              className={
                isViewEditorFullscreen ? "mt-4 flex-1 flex flex-col" : "mt-4"
              }
            >
              <div
                className={
                  isViewEditorFullscreen ? "flex flex-1 gap-6" : "flex gap-6"
                }
              >
                <div className="basis-[15%] shrink-0 space-y-4">
                  <ComponentPalette onAddComponent={handleAddComponent} />
                </div>

                <div className="basis-[70%]">
                  <ScadaCanvas
                    components={visualComponents}
                    backgroundImage={selectedView.backgroundImage}
                    plcVariables={plcVariables}
                    onComponentsChange={
                      handleComponentsChangeFromCanvas
                    }
                    selectedComponentId={selectedComponentId}
                    onSelectComponent={setSelectedComponentId}
                  />
                </div>

                <div className="basis-[15%] shrink-0">
                  <ComponentProperties
                    component={selectedVisualComponent}
                    plcVariables={plcVariables}
                    onUpdate={handleUpdateComponent}
                    onDelete={handleDeleteComponent}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );

    if (!isViewEditorFullscreen) {
      return editorCard;
    }

    // Modo tela cheia: ocupa a viewport (acima do footer)
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {editorCard}
      </div>
    );
  };

  const renderViewsTab = () => {
    if (!selectedSupervisory) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Views do Supervisório
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure múltiplas telas (views) para este supervisório.
            </p>
          </div>
          <Dialog
            open={createViewDialogOpen}
            onOpenChange={setCreateViewDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova View
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova View</DialogTitle>
                <DialogDescription>
                  Crie uma nova tela dentro deste supervisório.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="view-name">Nome</Label>
                  <Input
                    id="view-name"
                    value={newViewName}
                    onChange={(e) => setNewViewName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="view-description">
                    Descrição (opcional)
                  </Label>
                  <Input
                    id="view-description"
                    value={newViewDescription}
                    onChange={(e) =>
                      setNewViewDescription(e.target.value)
                    }
                  />
                </div>
                <Button className="w-full" onClick={handleCreateView}>
                  Criar View
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Views</CardTitle>
            <CardDescription>
              Selecione uma view para editar o layout ou visualizar em
              tempo real.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingViews ? (
              <p className="text-sm text-muted-foreground">
                Carregando views...
              </p>
            ) : views.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma view cadastrada.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[160px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {views.map((v) => (
                    <TableRow
                      key={v.id}
                      className={
                        selectedViewId === v.id
                          ? "bg-muted/60"
                          : undefined
                      }
                    >
                      <TableCell className="font-medium">
                        {v.name}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {v.description || "-"}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(v.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={
                            selectedViewId === v.id
                              ? "default"
                              : "outline"
                          }
                          onClick={() => {
                            setSelectedViewId(v.id);
                            setViewEditorTab("view");
                          }}
                          aria-label="Abrir view"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDeleteView(v.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {renderViewEditor()}
      </div>
    );
  };

  const renderSettingsTab = () => {
    if (!selectedSupervisory) return null;
    const sc = mockSmartCaldas.find(
      (m) => m.id === selectedSupervisory.smartCaldaId
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle>Informações do Supervisório</CardTitle>
          <CardDescription>
            Dados gerais e vínculo com Smart Calda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">ID</p>
            <p className="text-sm text-muted-foreground">
              {selectedSupervisory.id}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Smart Calda</p>
            <p className="text-sm text-muted-foreground">
              {sc ? `${sc.name} (${sc.id})` : selectedSupervisory.smartCaldaId}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Nome</p>
            <p className="text-sm text-muted-foreground">
              {selectedSupervisory.name}
            </p>
          </div>
          {selectedSupervisory.description && (
            <div>
              <p className="text-sm font-medium">Descrição</p>
              <p className="text-sm text-muted-foreground">
                {selectedSupervisory.description}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Criado em</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(selectedSupervisory.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Atualizado em</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(selectedSupervisory.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAlarmsTab = () => {
    if (!selectedSupervisory) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <div>
              <h2 className="text-lg font-semibold">Alarmes</h2>
              <p className="text-sm text-muted-foreground">
                Alarmes associados à Smart Calda deste supervisório.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={alarmFilters.status ?? "all"}
              onValueChange={(value) =>
                setAlarmFilters((prev) => ({
                  ...prev,
                  status:
                    value === "all"
                      ? undefined
                      : (value as SupervisoryAlarmStatus),
                }))
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="acknowledged">
                  Reconhecidos
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Alarmes</CardTitle>
            <CardDescription>
              Alarmes retornados pelo backend de supervisório (mockado
              aqui).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAlarms ? (
              <p className="text-sm text-muted-foreground">
                Carregando alarmes...
              </p>
            ) : alarms.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum alarme encontrado para este supervisório.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <AlarmClock className="h-4 w-4" />
                        <span>Quando</span>
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reconhecido em</TableHead>
                    <TableHead>Por</TableHead>
                    <TableHead className="w-[140px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alarms.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">
                        {a.tipo}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {a.mensagem}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(a.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusToBadgeVariant(a.status)}
                          className="flex items-center gap-1"
                        >
                          {a.status === "active" ? (
                            <AlertTriangle className="h-3 w-3" />
                          ) : (
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                          {a.status === "active"
                            ? "Ativo"
                            : "Reconhecido"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDateTime(a.acknowledgedAt ?? null)}
                      </TableCell>
                      <TableCell>{a.acknowledgedBy || "-"}</TableCell>
                      <TableCell className="text-right">
                        {a.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleAcknowledgeAlarm(a.id)
                            }
                          >
                            Reconhecer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (!selectedSupervisory) {
    return (
      <div className="container mx-auto p-6">
        {renderSupervisoryList()}
      </div>
    );
  }

  const sc = mockSmartCaldas.find(
    (m) => m.id === selectedSupervisory.smartCaldaId
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-7 w-7" />
          {selectedSupervisory.name}
        </h1>
        <p className="text-muted-foreground">
          Supervisório vinculado à Smart Calda{" "}
          {sc ? sc.name : selectedSupervisory.smartCaldaId}
        </p>
      </div>

      <Tabs
        value={detailTab}
        onValueChange={(v) => setDetailTab(v as DetailTab)}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="alarms">Alarmes</TabsTrigger>
        </TabsList>

        <TabsContent value="views">{renderViewsTab()}</TabsContent>
        <TabsContent value="settings">{renderSettingsTab()}</TabsContent>
        <TabsContent value="alarms">{renderAlarmsTab()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default Supervisorios;


