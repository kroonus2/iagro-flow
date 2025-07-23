import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, User, Edit, Trash2, Shield, UserCheck } from "lucide-react";
import { toast } from "sonner";

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [nivelFilter, setNivelFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    nivel: "",
    unidade: "",
    status: "ativo"
  });

  // Dados simulados dos usuários
  const usuarios = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@iagro.com",
      nivel: "Administrador",
      unidade: "Unidade Principal",
      status: "ativo",
      ultimoAcesso: "2024-01-20 14:30",
      criadoEm: "2024-01-01"
    },
    {
      id: 2,
      nome: "Maria Santos", 
      email: "maria.santos@iagro.com",
      nivel: "Operador",
      unidade: "Unidade A",
      status: "ativo",
      ultimoAcesso: "2024-01-20 09:15",
      criadoEm: "2024-01-05"
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@iagro.com", 
      nivel: "Supervisor",
      unidade: "Unidade B",
      status: "inativo",
      ultimoAcesso: "2024-01-18 16:45",
      criadoEm: "2024-01-10"
    },
    {
      id: 4,
      nome: "Ana Costa",
      email: "ana.costa@iagro.com",
      nivel: "Operador",
      unidade: "Unidade Principal", 
      status: "ativo",
      ultimoAcesso: "2024-01-20 11:20",
      criadoEm: "2024-01-15"
    },
    {
      id: 5,
      nome: "Roberto Lima",
      email: "roberto.lima@iagro.com",
      nivel: "Visualizador",
      unidade: "Unidade C",
      status: "ativo", 
      ultimoAcesso: "2024-01-19 13:10",
      criadoEm: "2024-01-12"
    }
  ];

  const niveisAcesso = [
    { value: "administrador", label: "Administrador", cor: "default" },
    { value: "supervisor", label: "Supervisor", cor: "secondary" },
    { value: "operador", label: "Operador", cor: "outline" },
    { value: "visualizador", label: "Visualizador", cor: "secondary" }
  ];

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNivel = nivelFilter === "todos" || usuario.nivel.toLowerCase() === nivelFilter;
    return matchesSearch && matchesNivel;
  });

  const getStatusBadge = (status: string) => {
    return status === "ativo" ? "default" : "secondary";
  };

  const getNivelBadge = (nivel: string): "default" | "secondary" | "destructive" | "outline" => {
    const nivelData = niveisAcesso.find(n => n.label === nivel);
    return (nivelData?.cor as "default" | "secondary" | "destructive" | "outline") || "outline";
  };

  const handleIncluirUsuario = () => {
    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.nivel) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    toast.success("Usuário criado com sucesso!");
    setDialogOpen(false);
    setNovoUsuario({ nome: "", email: "", senha: "", nivel: "", unidade: "", status: "ativo" });
  };

  const handleEditarUsuario = (id: number) => {
    toast.info(`Editando usuário ID: ${id}`);
  };

  const handleExcluirUsuario = (id: number) => {
    toast.error(`Excluindo usuário ID: ${id}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground mt-1">
            Controle de acesso e permissões do sistema IAGRO
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-iagro-dark hover:bg-iagro-dark/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo usuário do sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoUsuario.email}
                  onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                  placeholder="usuario@iagro.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha">Senha Inicial</Label>
                <Input
                  id="senha"
                  type="password"
                  value={novoUsuario.senha}
                  onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                  placeholder="Senha temporária"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivel">Nível de Acesso</Label>
                <Select value={novoUsuario.nivel} onValueChange={(value) => setNovoUsuario({...novoUsuario, nivel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {niveisAcesso.map((nivel) => (
                      <SelectItem key={nivel.value} value={nivel.value}>
                        {nivel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Select value={novoUsuario.unidade} onValueChange={(value) => setNovoUsuario({...novoUsuario, unidade: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principal">Unidade Principal</SelectItem>
                    <SelectItem value="unidade-a">Unidade A</SelectItem>
                    <SelectItem value="unidade-b">Unidade B</SelectItem>
                    <SelectItem value="unidade-c">Unidade C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleIncluirUsuario}>
                Criar Usuário
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <SelectValue placeholder="Filtrar por nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os níveis</SelectItem>
                {niveisAcesso.map((nivel) => (
                  <SelectItem key={nivel.value} value={nivel.value}>
                    {nivel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{usuario.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            Criado em {usuario.criadoEm}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <Badge variant={getNivelBadge(usuario.nivel)}>
                        {usuario.nivel}
                      </Badge>
                    </TableCell>
                    <TableCell>{usuario.unidade}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(usuario.status)}>
                        {usuario.status === "ativo" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {usuario.ultimoAcesso}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditarUsuario(usuario.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExcluirUsuario(usuario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
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
              {usuarios.filter(u => u.nivel === "Administrador").length}
            </p>
            <p className="text-sm text-muted-foreground">Administradores</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <User className="h-8 w-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {usuarios.filter(u => u.nivel === "Operador").length}
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
    </div>
  );
};

export default Usuarios;