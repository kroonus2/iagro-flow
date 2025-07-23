import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Database, 
  Wifi, 
  Bell, 
  Shield, 
  Users,
  Gauge,
  Wrench,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

const Configuracoes = () => {
  const [configuracoes, setConfiguracoes] = useState({
    // Configurações de Sistema
    backupAutomatico: true,
    notificacoesPush: true,
    modoManutencao: false,
    logDetalhado: false,
    
    // Configurações de Smart Calda
    tempoLimpeza: "15",
    pressaoMaxima: "3.5",
    temperaturaMaxima: "40",
    alertaEstoqueBaixo: "20",
    
    // Configurações de Rede
    servidorAPI: "https://api.iagro.com",
    timeoutConexao: "30",
    tentativasReconexao: "3",
    
    // Configurações de Usuário
    sessaoExpira: "480",
    senhaComplexidade: true,
    loginDuploFator: false
  });

  const [smartCaldasStatus] = useState([
    { id: "A32485", nome: "Smart Calda A32485", status: "online", versao: "2.1.4", ip: "192.168.1.10" },
    { id: "A32486", nome: "Smart Calda A32486", status: "online", versao: "2.1.4", ip: "192.168.1.11" },
    { id: "A32487", nome: "Smart Calda A32487", status: "offline", versao: "2.1.3", ip: "192.168.1.12" },
  ]);

  const handleSalvarConfiguracoes = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const handleTestarConexao = () => {
    toast.info("Testando conexão com o servidor...");
    setTimeout(() => {
      toast.success("Conexão estabelecida com sucesso!");
    }, 2000);
  };

  const handleBackupManual = () => {
    toast.info("Iniciando backup manual...");
    setTimeout(() => {
      toast.success("Backup concluído com sucesso!");
    }, 3000);
  };

  const handleReiniciarSmartCalda = (id: string) => {
    toast.info(`Reiniciando Smart Calda ${id}...`);
    setTimeout(() => {
      toast.success(`Smart Calda ${id} reiniciado com sucesso!`);
    }, 2000);
  };

  const updateConfiguracao = (key: string, value: any) => {
    setConfiguracoes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações do Sistema</h1>
          <p className="text-muted-foreground mt-1">
            Configurações gerais e parâmetros do sistema IAGRO
          </p>
        </div>
        
        <Button onClick={handleSalvarConfiguracoes} className="bg-iagro-dark hover:bg-iagro-dark/90">
          <Settings className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="sistema" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="smart-calda">Smart Calda</TabsTrigger>
          <TabsTrigger value="rede">Rede</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="dispositivos">Dispositivos</TabsTrigger>
        </TabsList>

        {/* Configurações de Sistema */}
        <TabsContent value="sistema">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup e Armazenamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="backup-auto">Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Backup diário às 02:00
                    </p>
                  </div>
                  <Switch
                    id="backup-auto"
                    checked={configuracoes.backupAutomatico}
                    onCheckedChange={(value) => updateConfiguracao('backupAutomatico', value)}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Último Backup</Label>
                  <p className="text-sm text-muted-foreground">20/01/2024 às 02:00</p>
                  <Button variant="outline" size="sm" onClick={handleBackupManual}>
                    Backup Manual
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notif-push">Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas em tempo real
                    </p>
                  </div>
                  <Switch
                    id="notif-push"
                    checked={configuracoes.notificacoesPush}
                    onCheckedChange={(value) => updateConfiguracao('notificacoesPush', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="log-detalhado">Log Detalhado</Label>
                    <p className="text-sm text-muted-foreground">
                      Registros completos de operações
                    </p>
                  </div>
                  <Switch
                    id="log-detalhado"
                    checked={configuracoes.logDetalhado}
                    onCheckedChange={(value) => updateConfiguracao('logDetalhado', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="modo-manutencao">Modo Manutenção</Label>
                    <p className="text-sm text-muted-foreground">
                      Desabilita operações críticas
                    </p>
                  </div>
                  <Switch
                    id="modo-manutencao"
                    checked={configuracoes.modoManutencao}
                    onCheckedChange={(value) => updateConfiguracao('modoManutencao', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações Smart Calda */}
        <TabsContent value="smart-calda">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Parâmetros Operacionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tempo-limpeza">Tempo de Limpeza (minutos)</Label>
                  <Input
                    id="tempo-limpeza"
                    type="number"
                    value={configuracoes.tempoLimpeza}
                    onChange={(e) => updateConfiguracao('tempoLimpeza', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pressao-maxima">Pressão Máxima (bar)</Label>
                  <Input
                    id="pressao-maxima"
                    type="number"
                    step="0.1"
                    value={configuracoes.pressaoMaxima}
                    onChange={(e) => updateConfiguracao('pressaoMaxima', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperatura-maxima">Temperatura Máxima (°C)</Label>
                  <Input
                    id="temperatura-maxima"
                    type="number"
                    value={configuracoes.temperaturaMaxima}
                    onChange={(e) => updateConfiguracao('temperaturaMaxima', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alerta-estoque">Alerta Estoque Baixo (%)</Label>
                  <Input
                    id="alerta-estoque"
                    type="number"
                    value={configuracoes.alertaEstoqueBaixo}
                    onChange={(e) => updateConfiguracao('alertaEstoqueBaixo', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Manutenção Preventiva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Próxima Manutenção</Label>
                  <p className="text-sm text-muted-foreground">25/01/2024</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Horas de Operação</Label>
                  <p className="text-sm text-muted-foreground">2,450 horas</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Ciclos de Limpeza</Label>
                  <p className="text-sm text-muted-foreground">1,234 ciclos</p>
                </div>
                
                <Button variant="outline" size="sm">
                  Agendar Manutenção
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações de Rede */}
        <TabsContent value="rede">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Conectividade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="servidor-api">Servidor API</Label>
                  <Input
                    id="servidor-api"
                    value={configuracoes.servidorAPI}
                    onChange={(e) => updateConfiguracao('servidorAPI', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeout">Timeout Conexão (segundos)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={configuracoes.timeoutConexao}
                    onChange={(e) => updateConfiguracao('timeoutConexao', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tentativas">Tentativas de Reconexão</Label>
                  <Input
                    id="tentativas"
                    type="number"
                    value={configuracoes.tentativasReconexao}
                    onChange={(e) => updateConfiguracao('tentativasReconexao', e.target.value)}
                  />
                </div>
                
                <Button variant="outline" onClick={handleTestarConexao}>
                  Testar Conexão
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status da Rede</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status do Servidor</span>
                  <Badge variant="default">Online</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Latência</span>
                  <span className="text-sm">45ms</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Última Sincronização</span>
                  <span className="text-sm text-muted-foreground">Há 2 minutos</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Qualidade da Conexão</span>
                  <Badge variant="default">Excelente</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configurações de Usuários */}
        <TabsContent value="usuarios">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessao-expira">Sessão Expira (minutos)</Label>
                  <Input
                    id="sessao-expira"
                    type="number"
                    value={configuracoes.sessaoExpira}
                    onChange={(e) => updateConfiguracao('sessaoExpira', e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="senha-complexa">Senha Complexa</Label>
                    <p className="text-sm text-muted-foreground">
                      Exige letras, números e símbolos
                    </p>
                  </div>
                  <Switch
                    id="senha-complexa"
                    checked={configuracoes.senhaComplexidade}
                    onCheckedChange={(value) => updateConfiguracao('senhaComplexidade', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa">Autenticação 2FA</Label>
                    <p className="text-sm text-muted-foreground">
                      Duplo fator de autenticação
                    </p>
                  </div>
                  <Switch
                    id="2fa"
                    checked={configuracoes.loginDuploFator}
                    onCheckedChange={(value) => updateConfiguracao('loginDuploFator', value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Usuários Ativos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">João Silva</p>
                      <p className="text-sm text-muted-foreground">Administrador</p>
                    </div>
                    <Badge variant="default">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maria Santos</p>
                      <p className="text-sm text-muted-foreground">Operador</p>
                    </div>
                    <Badge variant="default">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Carlos Oliveira</p>
                      <p className="text-sm text-muted-foreground">Supervisor</p>
                    </div>
                    <Badge variant="secondary">Offline</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Status dos Dispositivos */}
        <TabsContent value="dispositivos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Status dos Smart Caldas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smartCaldasStatus.map((dispositivo) => (
                  <div key={dispositivo.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Gauge className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{dispositivo.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          IP: {dispositivo.ip} | Versão: {dispositivo.versao}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {dispositivo.status === "online" ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                        <Badge 
                          variant={dispositivo.status === "online" ? "default" : "destructive"}
                        >
                          {dispositivo.status === "online" ? "Online" : "Offline"}
                        </Badge>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReiniciarSmartCalda(dispositivo.id)}
                      >
                        <Wrench className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;