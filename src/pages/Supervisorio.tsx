import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Power, 
  StopCircle, 
  Play, 
  Pause, 
  Settings, 
  Activity,
  Thermometer,
  Gauge,
  Zap,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

// Dados simulados dos Smart Caldas
const smartCaldasData = [
  {
    id: "SC001",
    nome: "Smart Calda 01",
    status: "operando",
    comunicacao: true,
    localizacao: "Setor A - Linha 1",
    temperatura: 65.2,
    pressao: 2.1,
    nivel: 78,
    vazao: 120.5,
    velocidadeMotor: 1750,
    corrente: 8.2,
    voltagem: 380,
    ultimaManutencao: "2024-01-15",
    tempoOperacao: 245,
    ios: {
      entradasDigitais: [
        { nome: "Sensor Nivel Alto", estado: true, endereco: "DI001" },
        { nome: "Sensor Nivel Baixo", estado: false, endereco: "DI002" },
        { nome: "Botão Emergência", estado: false, endereco: "DI003" },
        { nome: "Sensor Porta", estado: true, endereco: "DI004" }
      ],
      saidasDigitais: [
        { nome: "Bomba Principal", estado: true, endereco: "DO001" },
        { nome: "Válvula Entrada", estado: true, endereco: "DO002" },
        { nome: "Sinaleiro Verde", estado: true, endereco: "DO003" },
        { nome: "Sirene Alarme", estado: false, endereco: "DO004" }
      ],
      entradasAnalogicas: [
        { nome: "Temperatura", valor: 65.2, unidade: "°C", endereco: "AI001" },
        { nome: "Pressão", valor: 2.1, unidade: "bar", endereco: "AI002" },
        { nome: "Nivel", valor: 78, unidade: "%", endereco: "AI003" },
        { nome: "Vazão", valor: 120.5, unidade: "L/min", endereco: "AI004" }
      ],
      saidasAnalogicas: [
        { nome: "Velocidade Motor", valor: 1750, unidade: "RPM", endereco: "AO001" },
        { nome: "Abertura Válvula", valor: 65, unidade: "%", endereco: "AO002" }
      ]
    }
  },
  {
    id: "SC002",
    nome: "Smart Calda 02",
    status: "parado",
    comunicacao: true,
    localizacao: "Setor B - Linha 2",
    temperatura: 22.1,
    pressao: 0.0,
    nivel: 15,
    vazao: 0,
    velocidadeMotor: 0,
    corrente: 0,
    voltagem: 380,
    ultimaManutencao: "2024-01-10",
    tempoOperacao: 0,
    ios: {
      entradasDigitais: [
        { nome: "Sensor Nivel Alto", estado: false, endereco: "DI005" },
        { nome: "Sensor Nivel Baixo", estado: true, endereco: "DI006" },
        { nome: "Botão Emergência", estado: false, endereco: "DI007" },
        { nome: "Sensor Porta", estado: true, endereco: "DI008" }
      ],
      saidasDigitais: [
        { nome: "Bomba Principal", estado: false, endereco: "DO005" },
        { nome: "Válvula Entrada", estado: false, endereco: "DO006" },
        { nome: "Sinaleiro Verde", estado: false, endereco: "DO007" },
        { nome: "Sirene Alarme", estado: false, endereco: "DO008" }
      ],
      entradasAnalogicas: [
        { nome: "Temperatura", valor: 22.1, unidade: "°C", endereco: "AI005" },
        { nome: "Pressão", valor: 0.0, unidade: "bar", endereco: "AI006" },
        { nome: "Nivel", valor: 15, unidade: "%", endereco: "AI007" },
        { nome: "Vazão", valor: 0, unidade: "L/min", endereco: "AI008" }
      ],
      saidasAnalogicas: [
        { nome: "Velocidade Motor", valor: 0, unidade: "RPM", endereco: "AO003" },
        { nome: "Abertura Válvula", valor: 0, unidade: "%", endereco: "AO004" }
      ]
    }
  },
  {
    id: "SC003",
    nome: "Smart Calda 03",
    status: "manutencao",
    comunicacao: false,
    localizacao: "Setor C - Linha 3",
    temperatura: 0,
    pressao: 0,
    nivel: 0,
    vazao: 0,
    velocidadeMotor: 0,
    corrente: 0,
    voltagem: 0,
    ultimaManutencao: "2024-01-25",
    tempoOperacao: 0,
    ios: {
      entradasDigitais: [
        { nome: "Sensor Nivel Alto", estado: false, endereco: "DI009" },
        { nome: "Sensor Nivel Baixo", estado: false, endereco: "DI010" },
        { nome: "Botão Emergência", estado: true, endereco: "DI011" },
        { nome: "Sensor Porta", estado: false, endereco: "DI012" }
      ],
      saidasDigitais: [
        { nome: "Bomba Principal", estado: false, endereco: "DO009" },
        { nome: "Válvula Entrada", estado: false, endereco: "DO010" },
        { nome: "Sinaleiro Verde", estado: false, endereco: "DO011" },
        { nome: "Sirene Alarme", estado: true, endereco: "DO012" }
      ],
      entradasAnalogicas: [
        { nome: "Temperatura", valor: 0, unidade: "°C", endereco: "AI009" },
        { nome: "Pressão", valor: 0, unidade: "bar", endereco: "AI010" },
        { nome: "Nivel", valor: 0, unidade: "%", endereco: "AI011" },
        { nome: "Vazão", valor: 0, unidade: "L/min", endereco: "AI012" }
      ],
      saidasAnalogicas: [
        { nome: "Velocidade Motor", valor: 0, unidade: "RPM", endereco: "AO005" },
        { nome: "Abertura Válvula", valor: 0, unidade: "%", endereco: "AO006" }
      ]
    }
  }
];

const alarmes = [
  { id: 1, equipamento: "SC001", tipo: "warning", mensagem: "Temperatura alta detectada", timestamp: "2024-01-30 14:23:15" },
  { id: 2, equipamento: "SC002", tipo: "info", mensagem: "Equipamento parado por operador", timestamp: "2024-01-30 13:45:32" },
  { id: 3, equipamento: "SC003", tipo: "error", mensagem: "Falha de comunicação", timestamp: "2024-01-30 12:15:08" },
  { id: 4, equipamento: "SC001", tipo: "warning", mensagem: "Nível baixo no tanque", timestamp: "2024-01-30 11:30:45" }
];

const Supervisorio = () => {
  const [smartCaldas, setSmartCaldas] = useState(smartCaldasData);
  const [selectedEquipment, setSelectedEquipment] = useState(smartCaldasData[0]);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Simulação de atualização em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setSmartCaldas(prev => prev.map(sc => {
        if (sc.status === "operando") {
          return {
            ...sc,
            temperatura: sc.temperatura + (Math.random() - 0.5) * 2,
            pressao: Math.max(0, sc.pressao + (Math.random() - 0.5) * 0.2),
            nivel: Math.max(0, Math.min(100, sc.nivel + (Math.random() - 0.5) * 5)),
            vazao: Math.max(0, sc.vazao + (Math.random() - 0.5) * 10),
            corrente: Math.max(0, sc.corrente + (Math.random() - 0.5) * 1)
          };
        }
        return sc;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operando": return "default";
      case "parado": return "secondary";
      case "manutencao": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operando": return <Play className="h-4 w-4" />;
      case "parado": return <Pause className="h-4 w-4" />;
      case "manutencao": return <Settings className="h-4 w-4" />;
      default: return <Pause className="h-4 w-4" />;
    }
  };

  const handleEmergencyStop = (equipmentId: string) => {
    setSmartCaldas(prev => prev.map(sc => 
      sc.id === equipmentId 
        ? { ...sc, status: "parado", temperatura: 0, pressao: 0, vazao: 0, velocidadeMotor: 0, corrente: 0 }
        : sc
    ));
    toast.error(`Parada de emergência acionada para ${equipmentId}`);
  };

  const handleStart = (equipmentId: string) => {
    setSmartCaldas(prev => prev.map(sc => 
      sc.id === equipmentId 
        ? { ...sc, status: "operando" }
        : sc
    ));
    toast.success(`Equipamento ${equipmentId} iniciado`);
  };

  const handleStop = (equipmentId: string) => {
    setSmartCaldas(prev => prev.map(sc => 
      sc.id === equipmentId 
        ? { ...sc, status: "parado" }
        : sc
    ));
    toast.info(`Equipamento ${equipmentId} parado`);
  };

  const toggleDigitalOutput = (equipmentId: string, outputIndex: number) => {
    setSmartCaldas(prev => prev.map(sc => {
      if (sc.id === equipmentId) {
        const newOutputs = [...sc.ios.saidasDigitais];
        newOutputs[outputIndex] = {
          ...newOutputs[outputIndex],
          estado: !newOutputs[outputIndex].estado
        };
        return {
          ...sc,
          ios: {
            ...sc.ios,
            saidasDigitais: newOutputs
          }
        };
      }
      return sc;
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supervisório Smart Calda</h1>
          <p className="text-muted-foreground">
            Monitoramento e controle em tempo real dos equipamentos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={emergencyMode ? "destructive" : "outline"}
            onClick={() => {
              setEmergencyMode(!emergencyMode);
              if (!emergencyMode) {
                toast.error("Modo de emergência ativado!");
              } else {
                toast.info("Modo de emergência desativado");
              }
            }}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            {emergencyMode ? "Emergência Ativa" : "Modo Emergência"}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {smartCaldas.map((sc) => (
          <Card key={sc.id} className={`cursor-pointer transition-all hover:shadow-md ${selectedEquipment?.id === sc.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedEquipment(sc)}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{sc.nome}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(sc.status)} className="flex items-center gap-1">
                    {getStatusIcon(sc.status)}
                    {sc.status}
                  </Badge>
                  {sc.comunicacao ? 
                    <Wifi className="h-4 w-4 text-green-500" /> : 
                    <WifiOff className="h-4 w-4 text-red-500" />
                  }
                </div>
              </div>
              <CardDescription>{sc.localizacao}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  <span>{sc.temperatura.toFixed(1)}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gauge className="h-3 w-3" />
                  <span>{sc.pressao.toFixed(1)} bar</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  <span>{sc.vazao.toFixed(0)} L/min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  <span>{sc.corrente.toFixed(1)} A</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Nível</span>
                  <span>{sc.nivel}%</span>
                </div>
                <Progress value={sc.nivel} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Equipment Control */}
      {selectedEquipment && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equipment Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {selectedEquipment.nome}
                    <Badge variant={getStatusColor(selectedEquipment.status)}>
                      {selectedEquipment.status}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStart(selectedEquipment.id)}
                      disabled={selectedEquipment.status === "operando" || emergencyMode}
                    >
                      <Play className="h-4 w-4" />
                      Iniciar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStop(selectedEquipment.id)}
                      disabled={selectedEquipment.status === "parado" || emergencyMode}
                    >
                      <StopCircle className="h-4 w-4" />
                      Parar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleEmergencyStop(selectedEquipment.id)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Emergência
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ios" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ios">I/O Status</TabsTrigger>
                    <TabsTrigger value="parametros">Parâmetros</TabsTrigger>
                    <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ios" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Entradas Digitais */}
                      <div>
                        <h4 className="font-semibold mb-2">Entradas Digitais</h4>
                        <div className="space-y-2">
                          {selectedEquipment.ios.entradasDigitais.map((entrada, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <span className="text-sm font-medium">{entrada.nome}</span>
                                <span className="text-xs text-muted-foreground ml-2">({entrada.endereco})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {entrada.estado ? 
                                  <CheckCircle className="h-4 w-4 text-green-500" /> : 
                                  <XCircle className="h-4 w-4 text-red-500" />
                                }
                                <span className="text-xs">{entrada.estado ? "ON" : "OFF"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Saídas Digitais */}
                      <div>
                        <h4 className="font-semibold mb-2">Saídas Digitais</h4>
                        <div className="space-y-2">
                          {selectedEquipment.ios.saidasDigitais.map((saida, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <span className="text-sm font-medium">{saida.nome}</span>
                                <span className="text-xs text-muted-foreground ml-2">({saida.endereco})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={saida.estado}
                                  onCheckedChange={() => toggleDigitalOutput(selectedEquipment.id, index)}
                                  disabled={emergencyMode}
                                />
                                <span className="text-xs">{saida.estado ? "ON" : "OFF"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Entradas Analógicas */}
                      <div>
                        <h4 className="font-semibold mb-2">Entradas Analógicas</h4>
                        <div className="space-y-2">
                          {selectedEquipment.ios.entradasAnalogicas.map((entrada, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <span className="text-sm font-medium">{entrada.nome}</span>
                                <span className="text-xs text-muted-foreground ml-2">({entrada.endereco})</span>
                              </div>
                              <span className="text-sm font-mono">
                                {entrada.valor.toFixed(1)} {entrada.unidade}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Saídas Analógicas */}
                      <div>
                        <h4 className="font-semibold mb-2">Saídas Analógicas</h4>
                        <div className="space-y-2">
                          {selectedEquipment.ios.saidasAnalogicas.map((saida, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <span className="text-sm font-medium">{saida.nome}</span>
                                <span className="text-xs text-muted-foreground ml-2">({saida.endereco})</span>
                              </div>
                              <span className="text-sm font-mono">
                                {saida.valor.toFixed(0)} {saida.unidade}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="parametros" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted rounded">
                          <span className="font-medium">Temperatura</span>
                          <span className="text-lg font-mono">{selectedEquipment.temperatura.toFixed(1)}°C</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded">
                          <span className="font-medium">Pressão</span>
                          <span className="text-lg font-mono">{selectedEquipment.pressao.toFixed(1)} bar</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded">
                          <span className="font-medium">Vazão</span>
                          <span className="text-lg font-mono">{selectedEquipment.vazao.toFixed(0)} L/min</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted rounded">
                          <span className="font-medium">Velocidade Motor</span>
                          <span className="text-lg font-mono">{selectedEquipment.velocidadeMotor} RPM</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded">
                          <span className="font-medium">Corrente</span>
                          <span className="text-lg font-mono">{selectedEquipment.corrente.toFixed(1)} A</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded">
                          <span className="font-medium">Voltagem</span>
                          <span className="text-lg font-mono">{selectedEquipment.voltagem} V</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="manutencao" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted rounded">
                        <span className="font-medium">Última Manutenção</span>
                        <span className="text-sm">{selectedEquipment.ultimaManutencao}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded">
                        <span className="font-medium">Tempo de Operação</span>
                        <span className="text-sm">{selectedEquipment.tempoOperacao} horas</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded">
                        <span className="font-medium">Status Comunicação</span>
                        <div className="flex items-center gap-2">
                          {selectedEquipment.comunicacao ? 
                            <CheckCircle className="h-4 w-4 text-green-500" /> : 
                            <XCircle className="h-4 w-4 text-red-500" />
                          }
                          <span className="text-sm">
                            {selectedEquipment.comunicacao ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Alarmes e Eventos */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alarmes e Eventos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alarmes.map((alarme) => (
                    <div key={alarme.id} className="p-3 rounded border">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={
                          alarme.tipo === "error" ? "destructive" : 
                          alarme.tipo === "warning" ? "secondary" : "outline"
                        }>
                          {alarme.tipo === "error" ? "Erro" : 
                           alarme.tipo === "warning" ? "Aviso" : "Info"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alarme.equipamento}
                        </span>
                      </div>
                      <p className="text-sm mb-1">{alarme.mensagem}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {alarme.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Supervisorio;