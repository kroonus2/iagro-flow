import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gauge,
  ThermometerSun,
  Droplets,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import smartCaldaPreview from "@/assets/smart-calda-img-base.jpg";

const Home = () => {
  const { t } = useLanguage();

  // Dados simulados do sistema
  const systemStatus = {
    operacional: true,
    temperatura: "24°C",
    pressao: "1.2 bar",
    fluxo: "150 L/min",
    ultimaAtualizacao: "Há 2 minutos",
  };

  const alertas = [
    {
      tipo: "warning",
      mensagem: "Nível baixo no tanque BULK 02",
      tempo: "5 min",
    },
    {
      tipo: "info",
      mensagem: "Receita #1234 concluída com sucesso",
      tempo: "15 min",
    },
    {
      tipo: "warning",
      mensagem: "Manutenção programada Smart Calda A32",
      tempo: "1 hora",
    },
  ];

  const estatisticasRapidas = [
    {
      titulo: t("home.recipesToday"),
      valor: "12",
      variacao: "+3",
      icon: Activity,
    },
    {
      titulo: t("home.activeProducts"),
      valor: "8",
      variacao: "=",
      icon: CheckCircle,
    },
    {
      titulo: t("home.pendingAlerts"),
      valor: "3",
      variacao: "+1",
      icon: AlertTriangle,
    },
    {
      titulo: t("home.averageTime"),
      valor: "45min",
      variacao: "-5min",
      icon: Clock,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("home.title")}
          </h1>
          <p className="text-muted-foreground mt-1">{t("home.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={systemStatus.operacional ? "default" : "destructive"}
            className="text-sm px-3 py-1"
          >
            {systemStatus.operacional
              ? t("home.systemOperational")
              : t("home.systemInactive")}
          </Badge>
          <LanguageSelector />
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticasRapidas.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.titulo}
                    </p>
                    <p className="text-2xl font-bold">{stat.valor}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.variacao}
                    </p>
                  </div>
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Esquemático 3D da Planta */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              {t("home.3dVisualization")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden relative bg-gradient-to-br from-slate-50 to-slate-100">
              <img
                src={smartCaldaPreview}
                alt="Modelo 3D da Planta Industrial Smart Calda"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                    <RotateCcw className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {t("home.interactive3d")}
                    </p>
                    <p className="text-sm text-white/90">
                      {t("home.completeVisualization")}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    {t("home.load3d")}
                  </Button>
                </div>
              </div>
              <Badge className="absolute top-4 right-4 bg-primary/90">
                {t("home.3dPreview")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Status do Sistema */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("home.systemStatus")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">{t("home.temperature")}</span>
                </div>
                <span className="font-medium">{systemStatus.temperatura}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{t("home.pressure")}</span>
                </div>
                <span className="font-medium">{systemStatus.pressao}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm">{t("home.flow")}</span>
                </div>
                <span className="font-medium">{systemStatus.fluxo}</span>
              </div>

              <div className="pt-2 text-xs text-muted-foreground">
                {t("home.lastUpdate")} {systemStatus.ultimaAtualizacao}
              </div>
            </CardContent>
          </Card>

          {/* Alertas Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("home.recentAlerts")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertas.map((alerta, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <AlertTriangle
                      className={`h-4 w-4 mt-0.5 ${
                        alerta.tipo === "warning"
                          ? "text-yellow-500"
                          : "text-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm">{alerta.mensagem}</p>
                      <p className="text-xs text-muted-foreground">
                        {alerta.tempo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
