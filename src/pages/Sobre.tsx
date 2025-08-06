import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  Shield, 
  Database, 
  Workflow, 
  Monitor,
  Truck,
  Package,
  FileText,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Target,
  Layers,
  Globe
} from "lucide-react";

const Sobre = () => {
  const [videoAtivo, setVideoAtivo] = useState<string | null>(null);

  const funcionalidades = [
    {
      icone: <Users className="h-6 w-6" />,
      titulo: "Gestão de Usuários",
      descricao: "Controle completo de perfis e permissões",
      categoria: "gerenciamento"
    },
    {
      icone: <BarChart3 className="h-6 w-6" />,
      titulo: "Dashboards Inteligentes",
      descricao: "Visualização de dados operacionais e gerenciais",
      categoria: "analytics"
    },
    {
      icone: <Package className="h-6 w-6" />,
      titulo: "Controle de Estoque",
      descricao: "Gestão avançada de insumos com notas fiscais",
      categoria: "operacional"
    },
    {
      icone: <Workflow className="h-6 w-6" />,
      titulo: "Ordens de Produção",
      descricao: "Planejamento e controle de produção",
      categoria: "operacional"
    },
    {
      icone: <Monitor className="h-6 w-6" />,
      titulo: "Sistema Supervisório",
      descricao: "Monitoramento em tempo real das Smart Caldas",
      categoria: "monitoramento"
    },
    {
      icone: <FileText className="h-6 w-6" />,
      titulo: "Receitas Inteligentes",
      descricao: "Biblioteca de receitas com importação de terceiros",
      categoria: "operacional"
    },
    {
      icone: <Truck className="h-6 w-6" />,
      titulo: "Gestão de Entregas",
      descricao: "Controle completo de entregas e logística",
      categoria: "logistica"
    },
    {
      icone: <Settings className="h-6 w-6" />,
      titulo: "Configurações Avançadas",
      descricao: "Personalização completa do sistema",
      categoria: "configuracao"
    }
  ];

  const tutoriais = [
    {
      id: "login",
      titulo: "Como fazer Login",
      duracao: "2 min",
      categoria: "basico",
      descricao: "Aprenda como acessar o sistema IAGRO",
      passos: [
        "Acesse a tela de login",
        "Digite suas credenciais (consulte as credenciais de teste na tela de login)",
        "Para acesso master, use: master, admin ou sede",
        "Para acesso normal, use: operador ou usuario",
        "Clique em 'Entrar' para acessar o sistema"
      ]
    },
    {
      id: "navegacao",
      titulo: "Navegação no Sistema",
      duracao: "3 min",
      categoria: "basico",
      descricao: "Como navegar entre as diferentes seções",
      passos: [
        "Use o menu lateral para navegar entre módulos",
        "Dashboard Operacional: Visão geral das operações",
        "Dashboard Gerencial: Relatórios e análises",
        "Cada módulo tem suas próprias funcionalidades específicas",
        "Use o botão de perfil para fazer logout"
      ]
    },
    {
      id: "usuarios",
      titulo: "Gestão de Usuários",
      duracao: "5 min",
      categoria: "gerenciamento",
      descricao: "Como gerenciar usuários e permissões",
      passos: [
        "Acesse 'Gestão de Usuários' no menu lateral",
        "Visualize a lista de usuários existentes",
        "Clique em 'Novo Usuário' para adicionar",
        "Configure perfis e permissões na aba 'Perfis'",
        "Defina permissões específicas para cada módulo"
      ]
    },
    {
      id: "estoque",
      titulo: "Controle de Estoque",
      duracao: "4 min",
      categoria: "operacional",
      descricao: "Como gerenciar o estoque de insumos",
      passos: [
        "Acesse 'Estoque Avançado' no menu",
        "Use as abas para separar estoque normal e intermediário",
        "Adicione novos itens com informações da nota fiscal",
        "Configure alertas de estoque baixo",
        "Acompanhe validades e lotes dos produtos"
      ]
    },
    {
      id: "smartcaldas",
      titulo: "Smart Caldas",
      duracao: "6 min",
      categoria: "monitoramento",
      descricao: "Como configurar e monitorar Smart Caldas",
      passos: [
        "Acesse 'Gestão de Smart Caldas'",
        "Cadastre novas Smart Caldas com URL e token",
        "Configure parâmetros de operação",
        "Teste a conexão com o equipamento",
        "Monitore status em tempo real"
      ]
    },
    {
      id: "receitas",
      titulo: "Importação de Receitas",
      duracao: "5 min",
      categoria: "operacional",
      descricao: "Como importar receitas de plataformas externas",
      passos: [
        "Acesse 'Importação de Receitas'",
        "Conecte plataformas de agronomia",
        "Configure filtros de importação",
        "Selecione receitas para importar",
        "Aprove e integre ao sistema"
      ]
    }
  ];

  const fluxoTrabalho = [
    {
      etapa: 1,
      titulo: "Planejamento",
      descricao: "Criação de ordens de produção baseadas na demanda",
      modulos: ["Ordens de Produção", "Estoque"]
    },
    {
      etapa: 2,
      titulo: "Preparação",
      descricao: "Seleção de receitas e verificação de estoque",
      modulos: ["Receitas Smart Calda", "Estoque", "Smart Caldas"]
    },
    {
      etapa: 3,
      titulo: "Produção",
      descricao: "Execução das receitas nas Smart Caldas",
      modulos: ["Sistema Supervisório", "Smart Caldas"]
    },
    {
      etapa: 4,
      titulo: "Controle",
      descricao: "Monitoramento em tempo real da produção",
      modulos: ["Dashboard Operacional", "Sistema Supervisório"]
    },
    {
      etapa: 5,
      titulo: "Entrega",
      descricao: "Logística e controle de entregas",
      modulos: ["Gestão de Entregas", "Dashboard Gerencial"]
    }
  ];

  const getCategoriaColor = (categoria: string) => {
    const cores = {
      basico: "default",
      gerenciamento: "destructive",
      operacional: "default",
      monitoramento: "secondary",
      configuracao: "outline"
    };
    return (cores[categoria as keyof typeof cores] || "outline") as "default" | "destructive" | "secondary" | "outline";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Sistema IAGRO</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Plataforma inteligente para gestão completa de produção agrícola com Smart Caldas
        </p>
        <Badge variant="default" className="text-sm px-4 py-2">
          Versão 2.1.0 - Protótipo
        </Badge>
      </div>

      <Tabs defaultValue="visao-geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="funcionalidades">Funcionalidades</TabsTrigger>
          <TabsTrigger value="tutoriais">Tutoriais</TabsTrigger>
          <TabsTrigger value="fluxo">Fluxo de Trabalho</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivo do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  O IAGRO é uma plataforma completa para automação e controle de produção agrícola, 
                  integrando Smart Caldas, gestão de estoque, receitas inteligentes e monitoramento em tempo real.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Automação de processos de produção</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Controle inteligente de estoque</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Monitoramento em tempo real</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Integração com plataformas externas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Arquitetura do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Frontend - Interface Web</div>
                    <div className="text-xs text-muted-foreground">React + TypeScript + Tailwind CSS</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Smart Caldas - Dispositivos IoT</div>
                    <div className="text-xs text-muted-foreground">Conexão via API REST</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Integração Externa</div>
                    <div className="text-xs text-muted-foreground">APIs de plataformas de agronomia</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="font-medium text-sm">Banco de Dados</div>
                    <div className="text-xs text-muted-foreground">Supabase (PostgreSQL)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Tecnologias Utilizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="font-medium">React 18</div>
                  <div className="text-sm text-muted-foreground">Framework Frontend</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="font-medium">TypeScript</div>
                  <div className="text-sm text-muted-foreground">Tipagem Estática</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="font-medium">Tailwind CSS</div>
                  <div className="text-sm text-muted-foreground">Framework CSS</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="font-medium">Shadcn/ui</div>
                  <div className="text-sm text-muted-foreground">Componentes UI</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="font-medium">Vite</div>
                  <div className="text-sm text-muted-foreground">Build Tool</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="font-medium">Supabase</div>
                  <div className="text-sm text-muted-foreground">Backend & DB</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="font-medium">React Query</div>
                  <div className="text-sm text-muted-foreground">Data Fetching</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="font-medium">React Router</div>
                  <div className="text-sm text-muted-foreground">Roteamento</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funcionalidades" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funcionalidades.map((func, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {func.icone}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{func.titulo}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {func.categoria}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{func.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutoriais" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Guias de Uso</h2>
            <p className="text-muted-foreground">
              Aprenda a usar todas as funcionalidades do sistema IAGRO
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {tutoriais.map((tutorial) => (
              <AccordionItem key={tutorial.id} value={tutorial.id}>
                <Card>
                  <AccordionTrigger className="hover:no-underline">
                    <CardHeader className="flex-row items-center space-y-0 space-x-4 pb-2">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Play className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <CardTitle className="text-lg">{tutorial.titulo}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getCategoriaColor(tutorial.categoria)} className="text-xs">
                            {tutorial.categoria}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{tutorial.duracao}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{tutorial.descricao}</p>
                      <div className="space-y-3">
                        <h4 className="font-medium">Passos:</h4>
                        <ol className="space-y-2">
                          {tutorial.passos.map((passo, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <Badge variant="outline" className="text-xs min-w-[24px] h-6 rounded-full">
                                {index + 1}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{passo}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="fluxo" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Fluxo de Trabalho</h2>
            <p className="text-muted-foreground">
              Entenda como os módulos se integram no processo produtivo
            </p>
          </div>

          <div className="space-y-8">
            {fluxoTrabalho.map((etapa, index) => (
              <div key={etapa.etapa} className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {etapa.etapa}
                  </div>
                  {index < fluxoTrabalho.length - 1 && (
                    <div className="w-0.5 h-16 bg-border mt-4"></div>
                  )}
                </div>
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle className="text-xl">{etapa.titulo}</CardTitle>
                    <CardDescription>{etapa.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {etapa.modulos.map((modulo) => (
                        <Badge key={modulo} variant="secondary">
                          {modulo}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Benefícios da Integração
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Eficiência Operacional</h4>
                  <p className="text-sm text-muted-foreground">
                    Redução de tempo e erros através da automação de processos
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Controle Total</h4>
                  <p className="text-sm text-muted-foreground">
                    Visibilidade completa de todo o processo produtivo
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Qualidade Garantida</h4>
                  <p className="text-sm text-muted-foreground">
                    Padronização de receitas e controle de qualidade
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Escalabilidade</h4>
                  <p className="text-sm text-muted-foreground">
                    Sistema preparado para crescimento da operação
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sobre;