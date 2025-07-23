import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { 
  Activity, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Gauge,
  TrendingUp
} from "lucide-react";

const DashboardOperacional = () => {
  // Dados simulados baseados na imagem do dashboard operacional
  const metricas = [
    { titulo: "Receitas Pendentes", valor: "71", icone: AlertCircle, cor: "text-yellow-500", status: "warning" },
    { titulo: "Receitas Concluídas", valor: "323", icone: CheckCircle2, cor: "text-success", status: "success" },
    { titulo: "Ordens Bloqueadas", valor: "0", icone: AlertCircle, cor: "text-muted-foreground", status: "default" }
  ];

  // Dados do carregamento atual Smart Calda A32485
  const carregamentoAtual = [
    { bulk: "BULK 1", status: "100%", tipo: "HERBICIDA QUEIMA" },
    { bulk: "BULK 2", status: "0.0%", tipo: "VAZIO" },
    { bulk: "BULK 3", status: "95.0%", tipo: "FERTILIZANTE OPÇÃO" },
    { bulk: "BULK 4", status: "85.4%", tipo: "NUTRITON" },
    { bulk: "BULK 5", status: "50%", tipo: "HERBICIDA PRE EMER" },
    { bulk: "BULK 6", status: "100%", tipo: "HERBICIDA METHOXIL" },
    { bulk: "MAC 1", status: "0.0%", tipo: "VAZIO" }
  ];

  // Dados de receitas no período (24h)
  const receitasPeriodo = [
    { hora: "00", receitas: 2 },
    { hora: "02", receitas: 1 },
    { hora: "04", receitas: 3 },
    { hora: "06", receitas: 5 },
    { hora: "08", receitas: 8 },
    { hora: "10", receitas: 6 },
    { hora: "12", receitas: 4 },
    { hora: "14", receitas: 7 },
    { hora: "16", receitas: 9 },
    { hora: "18", receitas: 6 },
    { hora: "20", receitas: 3 },
    { hora: "22", receitas: 2 }
  ];

  // Dados de receitas no período (visão geral)
  const receitasVisaoGeral = [
    { periodo: "S1", receitas: 45 },
    { periodo: "S2", receitas: 52 },
    { periodo: "S3", receitas: 38 },
    { periodo: "S4", receitas: 61 },
    { periodo: "S5", receitas: 43 },
    { periodo: "S6", receitas: 55 },
    { periodo: "S7", receitas: 48 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Operacional</h1>
        <p className="text-muted-foreground mt-1">
          Monitoramento em tempo real das operações
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricas.map((metrica, index) => {
          const IconComponent = metrica.icone;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metrica.titulo}</p>
                    <p className="text-3xl font-bold">{metrica.valor}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-8 w-8 ${metrica.cor}`} />
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Carregamento Atual Smart Calda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Carregamento atual Smart Calda A32485
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {carregamentoAtual.map((bulk, index) => {
              const percentage = parseFloat(bulk.status);
              const isEmpty = percentage === 0;
              const isFull = percentage === 100;
              
              return (
                <div key={index} className="text-center space-y-2">
                  <div className={`
                    p-4 rounded-lg border-2 
                    ${isFull ? 'bg-primary text-primary-foreground border-primary' : 
                      isEmpty ? 'bg-muted text-muted-foreground border-muted' : 
                      'bg-primary/10 text-primary border-primary/30'}
                  `}>
                    <div className="text-2xl font-bold">{bulk.status}</div>
                    <div className="text-xs opacity-75">{bulk.bulk}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {bulk.tipo}
                  </div>
                  {!isEmpty && !isFull && (
                    <Progress value={percentage} className="h-2" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receitas no período (24h) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Receitas no período (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={receitasPeriodo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="receitas" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Receitas no período (visão geral) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Receitas no período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={receitasVisaoGeral}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="receitas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Operacionais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">3.2h</p>
            <p className="text-sm text-muted-foreground">Tempo Médio por Receita</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">92%</p>
            <p className="text-sm text-muted-foreground">Eficiência Operacional</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold">6</p>
            <p className="text-sm text-muted-foreground">Receitas em Andamento</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">47</p>
            <p className="text-sm text-muted-foreground">Receitas Hoje</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOperacional;