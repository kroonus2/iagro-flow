import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Edit2, Trash2, Shield, Eye, Settings, Users, Search, User, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data para demonstração
const mockUsuarios = [
  { id: 1, nome: "João Silva", email: "joao@iagro.com", perfil: "administrador", unidade: "Sede", status: "ativo", ultimoAcesso: "2024-01-15", permissoes: ["dashboard", "usuarios", "configuracoes"] },
  { id: 2, nome: "Maria Santos", email: "maria@iagro.com", perfil: "operador", unidade: "Filial A", status: "ativo", ultimoAcesso: "2024-01-14", permissoes: ["dashboard", "cargas", "supervisorio"] },
  { id: 3, nome: "Pedro Costa", email: "pedro@iagro.com", perfil: "visualizador", unidade: "Filial B", status: "inativo", ultimoAcesso: "2024-01-10", permissoes: ["dashboard"] }
];

const mockPerfis = [
  { 
    id: 1, 
    nome: "Administrador", 
    descricao: "Acesso completo ao sistema",
    permissoes: {
      dashboard: { ler: true, escrever: true, excluir: true },
      usuarios: { ler: true, escrever: true, excluir: true },
      cargas: { ler: true, escrever: true, excluir: true },
      estoque: { ler: true, escrever: true, excluir: true },
      configuracoes: { ler: true, escrever: true, excluir: true }
    }
  },
  {
    id: 2,
    nome: "Operador", 
    descricao: "Acesso às operações do dia a dia",
    permissoes: {
      dashboard: { ler: true, escrever: false, excluir: false },
      usuarios: { ler: false, escrever: false, excluir: false },
      cargas: { ler: true, escrever: true, excluir: false },
      estoque: { ler: true, escrever: true, excluir: false },
      configuracoes: { ler: false, escrever: false, excluir: false }
    }
  },
  {
    id: 3,
    nome: "Visualizador",
    descricao: "Apenas visualização de dashboards",
    permissoes: {
      dashboard: { ler: true, escrever: false, excluir: false },
      usuarios: { ler: false, escrever: false, excluir: false },
      cargas: { ler: true, escrever: false, excluir: false },
      estoque: { ler: true, escrever: false, excluir: false },
      configuracoes: { ler: false, escrever: false, excluir: false }
    }
  }
];

const GerenciamentoUsuarios = () => {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState(mockUsuarios);
  const [perfis, setPerfis] = useState(mockPerfis);
  const [searchTerm, setSearchTerm] = useState("");
  const [nivelFilter, setNivelFilter] = useState("todos");
  const [dialogUsuarioAberto, setDialogUsuarioAberto] = useState(false);
  const [dialogPerfilAberto, setDialogPerfilAberto] = useState(false);
  const [dialogEditarPerfilAberto, setDialogEditarPerfilAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<any>(null);
  const [perfilEditando, setPerfilEditando] = useState<any>(null);

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    perfil: "",
    unidade: "",
    senha: ""
  });

  const [novoPerfil, setNovoPerfil] = useState({
    nome: "",
    descricao: "",
    permissoes: {
      dashboard: { ler: false, escrever: false, excluir: false },
      usuarios: { ler: false, escrever: false, excluir: false },
      cargas: { ler: false, escrever: false, excluir: false },
      estoque: { ler: false, escrever: false, excluir: false },
      configuracoes: { ler: false, escrever: false, excluir: false }
    }
  });

  const [perfilEditandoDados, setPerfilEditandoDados] = useState({
    id: 0,
    nome: "",
    descricao: "",
    permissoes: {
      dashboard: { ler: false, escrever: false, excluir: false },
      usuarios: { ler: false, escrever: false, excluir: false },
      cargas: { ler: false, escrever: false, excluir: false },
      estoque: { ler: false, escrever: false, excluir: false },
      configuracoes: { ler: false, escrever: false, excluir: false }
    }
  });

  const handleCriarUsuario = () => {
    const usuario = {
      id: usuarios.length + 1,
      ...novoUsuario,
      status: "ativo",
      ultimoAcesso: new Date().toISOString().split('T')[0],
      permissoes: []
    };
    setUsuarios([...usuarios, usuario]);
    setNovoUsuario({ nome: "", email: "", perfil: "", unidade: "", senha: "" });
    setDialogUsuarioAberto(false);
    toast({ title: "Usuário criado com sucesso!", variant: "default" });
  };

  const handleCriarPerfil = () => {
    const perfil = {
      id: perfis.length + 1,
      ...novoPerfil
    };
    setPerfis([...perfis, perfil]);
    setNovoPerfil({
      nome: "",
      descricao: "",
      permissoes: {
        dashboard: { ler: false, escrever: false, excluir: false },
        usuarios: { ler: false, escrever: false, excluir: false },
        cargas: { ler: false, escrever: false, excluir: false },
        estoque: { ler: false, escrever: false, excluir: false },
        configuracoes: { ler: false, escrever: false, excluir: false }
      }
    });
    setDialogPerfilAberto(false);
    toast({ title: "Perfil criado com sucesso!", variant: "default" });
  };

  const atualizarPermissaoPerfil = (modulo: string, tipo: string, valor: boolean) => {
    setNovoPerfil(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [modulo]: {
          ...prev.permissoes[modulo as keyof typeof prev.permissoes],
          [tipo]: valor
        }
      }
    }));
  };

  const abrirEdicaoPerfil = (perfil: any) => {
    setPerfilEditandoDados({
      id: perfil.id,
      nome: perfil.nome,
      descricao: perfil.descricao,
      permissoes: { ...perfil.permissoes }
    });
    setDialogEditarPerfilAberto(true);
  };

  const handleSalvarEdicaoPerfil = () => {
    const perfisAtualizados = perfis.map(perfil => 
      perfil.id === perfilEditandoDados.id ? { ...perfilEditandoDados } : perfil
    );
    setPerfis(perfisAtualizados);
    setDialogEditarPerfilAberto(false);
    toast({ title: "Perfil atualizado com sucesso!", variant: "default" });
  };

  const atualizarPermissaoEdicao = (modulo: string, tipo: string, valor: boolean) => {
    setPerfilEditandoDados(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [modulo]: {
          ...prev.permissoes[modulo as keyof typeof prev.permissoes],
          [tipo]: valor
        }
      }
    }));
  };

  const getStatusBadge = (status: string) => {
    return status === "ativo" ? "default" : "secondary";
  };

  const getPerfilBadge = (perfil: string) => {
    switch (perfil) {
      case "administrador": return "destructive";
      case "operador": return "default";
      case "visualizador": return "secondary";
      default: return "outline";
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNivel = nivelFilter === "todos" || usuario.perfil.toLowerCase() === nivelFilter;
    return matchesSearch && matchesNivel;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, perfis e permissões do sistema IAGRO
          </p>
        </div>
      </div>

      <Tabs defaultValue="usuarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="perfis" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Perfis e Permissões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <UserCheck className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-success">
                  {usuarios.filter(u => u.status === "ativo").length}
                </p>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.perfil === "administrador").length}
                </p>
                <p className="text-sm text-muted-foreground">Administradores</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <User className="h-8 w-8 text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.perfil === "operador").length}
                </p>
                <p className="text-sm text-muted-foreground">Operadores</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold">{usuarios.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Filtros de Pesquisa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou e-mail"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={nivelFilter} onValueChange={setNivelFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os perfis</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="operador">Operador</SelectItem>
                    <SelectItem value="visualizador">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lista de Usuários</h2>
            <Dialog open={dialogUsuarioAberto} onOpenChange={setDialogUsuarioAberto}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do novo usuário do sistema.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={novoUsuario.nome}
                      onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                      placeholder="Nome do usuário"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={novoUsuario.email}
                      onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="perfil">Perfil de Acesso</Label>
                    <Select value={novoUsuario.perfil} onValueChange={(value) => setNovoUsuario({ ...novoUsuario, perfil: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {perfis.map((perfil) => (
                          <SelectItem key={perfil.id} value={perfil.nome.toLowerCase()}>
                            {perfil.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade</Label>
                    <Select value={novoUsuario.unidade} onValueChange={(value) => setNovoUsuario({ ...novoUsuario, unidade: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sede">Sede</SelectItem>
                        <SelectItem value="filial-a">Filial A</SelectItem>
                        <SelectItem value="filial-b">Filial B</SelectItem>
                        <SelectItem value="filial-c">Filial C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="senha">Senha Inicial</Label>
                    <Input
                      id="senha"
                      type="password"
                      value={novoUsuario.senha}
                      onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                      placeholder="Senha temporária"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogUsuarioAberto(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCriarUsuario}>
                    Criar Usuário
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant={getPerfilBadge(usuario.perfil)}>
                          {usuario.perfil}
                        </Badge>
                      </TableCell>
                      <TableCell>{usuario.unidade}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(usuario.status)}>
                          {usuario.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{usuario.ultimoAcesso}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="perfis" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Perfis de Acesso</h2>
            <Dialog open={dialogPerfilAberto} onOpenChange={setDialogPerfilAberto}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Novo Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Perfil de Acesso</DialogTitle>
                  <DialogDescription>
                    Configure as permissões para o novo perfil de usuário.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomePerfil">Nome do Perfil</Label>
                      <Input
                        id="nomePerfil"
                        value={novoPerfil.nome}
                        onChange={(e) => setNovoPerfil({ ...novoPerfil, nome: e.target.value })}
                        placeholder="Ex: Supervisor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descricaoPerfil">Descrição</Label>
                      <Input
                        id="descricaoPerfil"
                        value={novoPerfil.descricao}
                        onChange={(e) => setNovoPerfil({ ...novoPerfil, descricao: e.target.value })}
                        placeholder="Breve descrição do perfil"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Permissões por Módulo</h3>
                    
                    {Object.entries(novoPerfil.permissoes).map(([modulo, perms]) => (
                      <Card key={modulo}>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base capitalize">{modulo}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${modulo}-ler`}
                                checked={perms.ler}
                                onCheckedChange={(checked) => 
                                  atualizarPermissaoPerfil(modulo, 'ler', checked as boolean)
                                }
                              />
                              <Label htmlFor={`${modulo}-ler`}>Visualizar</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${modulo}-escrever`}
                                checked={perms.escrever}
                                onCheckedChange={(checked) => 
                                  atualizarPermissaoPerfil(modulo, 'escrever', checked as boolean)
                                }
                              />
                              <Label htmlFor={`${modulo}-escrever`}>Editar</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${modulo}-excluir`}
                                checked={perms.excluir}
                                onCheckedChange={(checked) => 
                                  atualizarPermissaoPerfil(modulo, 'excluir', checked as boolean)
                                }
                              />
                              <Label htmlFor={`${modulo}-excluir`}>Excluir</Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogPerfilAberto(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCriarPerfil}>
                    Criar Perfil
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perfis.map((perfil) => (
              <Card key={perfil.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{perfil.nome}</CardTitle>
                      <CardDescription>{perfil.descricao}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => abrirEdicaoPerfil(perfil)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Permissões:</h4>
                    {Object.entries(perfil.permissoes).map(([modulo, perms]) => (
                      <div key={modulo} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{modulo}</span>
                        <div className="flex gap-1">
                          {perms.ler && <Badge variant="outline" className="text-xs">Ver</Badge>}
                          {perms.escrever && <Badge variant="outline" className="text-xs">Editar</Badge>}
                          {perms.excluir && <Badge variant="outline" className="text-xs">Excluir</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dialog para Editar Perfil */}
          <Dialog open={dialogEditarPerfilAberto} onOpenChange={setDialogEditarPerfilAberto}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Perfil de Acesso</DialogTitle>
                <DialogDescription>
                  Modifique as configurações e permissões do perfil selecionado.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomePerfilEdicao">Nome do Perfil</Label>
                    <Input
                      id="nomePerfilEdicao"
                      value={perfilEditandoDados.nome}
                      onChange={(e) => setPerfilEditandoDados({ ...perfilEditandoDados, nome: e.target.value })}
                      placeholder="Ex: Supervisor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricaoPerfilEdicao">Descrição</Label>
                    <Input
                      id="descricaoPerfilEdicao"
                      value={perfilEditandoDados.descricao}
                      onChange={(e) => setPerfilEditandoDados({ ...perfilEditandoDados, descricao: e.target.value })}
                      placeholder="Breve descrição do perfil"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Permissões por Módulo</h3>
                  
                  {Object.entries(perfilEditandoDados.permissoes).map(([modulo, perms]) => (
                    <Card key={modulo}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base capitalize">{modulo}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${modulo}-ler-edicao`}
                              checked={perms.ler}
                              onCheckedChange={(checked) => 
                                atualizarPermissaoEdicao(modulo, 'ler', checked as boolean)
                              }
                            />
                            <Label htmlFor={`${modulo}-ler-edicao`}>Visualizar</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${modulo}-escrever-edicao`}
                              checked={perms.escrever}
                              onCheckedChange={(checked) => 
                                atualizarPermissaoEdicao(modulo, 'escrever', checked as boolean)
                              }
                            />
                            <Label htmlFor={`${modulo}-escrever-edicao`}>Editar</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${modulo}-excluir-edicao`}
                              checked={perms.excluir}
                              onCheckedChange={(checked) => 
                                atualizarPermissaoEdicao(modulo, 'excluir', checked as boolean)
                              }
                            />
                            <Label htmlFor={`${modulo}-excluir-edicao`}>Excluir</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogEditarPerfilAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSalvarEdicaoPerfil}>
                  Salvar Alterações
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GerenciamentoUsuarios;