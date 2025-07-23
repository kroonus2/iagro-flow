import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { TrendingUp, Package, DollarSign, Target } from "lucide-react";

const DashboardGerencial = () => {
  // Dados simulados baseados na imagem fornecida
  const metricas = [
    { titulo: "Receitas", valor: "200", tipo: "Total", status: "success" },
    { titulo: "Tipos de Produtos", valor: "60", tipo: "Ativos", status: "warning" }
  ];

  const produtosMaisUtilizados = [
    { nome: "Fumax", valor: 45, cor: "#3B82F6" },
    { nome: "Effect Maxx", valor: 35, cor: "#10B981" },
    { nome: "Viridian", valor: 25, cor: "#F59E0B" },
    { nome: "Actara", valor: 20, cor: "#EF4444" },
    { nome: "Outros", valor: 15, cor: "#8B5CF6" }
  ];

  const dadosEstoque = [
    { categoria: "Bulk Cheio", valor: 65, total: 100 },
    { categoria: "Bulk Vazio", valor: 35, total: 100 }
  ];

  const consumoPorPeriodo = [
    { mes: "Jan", fumax: 30, effectMaxx: 25, actara: 20, viridian: 15 },
    { mes: "Fev", fumax: 35, effectMaxx: 30, actara: 22, viridian: 18 },
    { mes: "Mar", fumax: 40, effectMaxx: 35, actara: 25, viridian: 20 },
    { mes: "Abr", fumax: 45, effectMaxx: 32, actara: 23, viridian: 19 }
  ];

  const COLORS = ["#3B82F6", "#EF4444"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard de Receita</h1>
        <p className="text-muted-foreground mt-1">
          Visão gerencial dos principais indicadores
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metricas.map((metrica, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metrica.titulo}</p>
                  <p className="text-3xl font-bold text-primary">{metrica.valor}</p>
                  <p className="text-xs text-muted-foreground">{metrica.tipo}</p>
                </div>
                <Badge variant={metrica.status === "success" ? "default" : "secondary"}>
                  {metrica.tipo}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Cards de Produtos Principais */}
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="text-sm text-success font-medium">Pronto Estoque</p>
            <p className="text-2xl font-bold text-success">Effect Maxx</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-primary font-medium">Urgent Estoque</p>
            <p className="text-2xl font-bold text-primary">Fumax</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Produtos Mais Utilizados */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Top 5 Produtos mais utilizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consumoPorPeriodo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="fumax" stroke="#3B82F6" strokeWidth={2} name="Fumax" />
                <Line type="monotone" dataKey="effectMaxx" stroke="#10B981" strokeWidth={2} name="Effect Maxx" />
                <Line type="monotone" dataKey="actara" stroke="#F59E0B" strokeWidth={2} name="Actara" />
                <Line type="monotone" dataKey="viridian" stroke="#EF4444" strokeWidth={2} name="Viridian" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Estoque */}
        <Card>
          <CardHeader>
            <CardTitle>Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dadosEstoque}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="valor"
                >
                  {dadosEstoque.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {dadosEstoque.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span>{item.categoria}</span>
                  </div>
                  <span className="font-medium">{item.valor}%</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">52%</p>
                <p className="text-sm text-muted-foreground">Eficiência Geral</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Produtos Principais */}
      <Card>
        <CardHeader>
          <CardTitle>Principais Produtos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["Effect Maxx", "Fumax", "Actara", "Viridian"].map((produto, index) => (
              <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold text-primary">{produto}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {index === 0 ? "Mais Consumido" : 
                   index === 1 ? "Maior Estoque" : 
                   index === 2 ? "Maior Demanda" : "Menor Quantidade"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardGerencial;