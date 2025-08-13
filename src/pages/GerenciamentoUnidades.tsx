import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Calendar,
  Activity,
  Eye
} from 'lucide-react';

interface Unidade {
  id: string;
  nome: string;
  codigo: string;
  tipo: 'Matriz' | 'Filial';
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavel: string;
  telefone: string;
  email: string;
  status: 'Ativa' | 'Inativa' | 'Manutenção';
  capacidadeProducao: number;
  area: number;
  dataCriacao: string;
  observacoes?: string;
}

const mockUnidades: Unidade[] = [
  {
    id: '1',
    nome: 'Usina Central - Matriz',
    codigo: 'UC-001',
    tipo: 'Matriz',
    endereco: 'Rodovia SP-310, Km 245',
    cidade: 'Ribeirão Preto',
    estado: 'SP',
    cep: '14000-000',
    responsavel: 'João Silva Santos',
    telefone: '(16) 3456-7890',
    email: 'matriz@usina.com.br',
    status: 'Ativa',
    capacidadeProducao: 50000,
    area: 1200,
    dataCriacao: '2020-01-15',
    observacoes: 'Unidade principal com laboratório central'
  },
  {
    id: '2',
    nome: 'Filial Norte',
    codigo: 'FN-002',
    tipo: 'Filial',
    endereco: 'Fazenda Santa Rita, s/n',
    cidade: 'Sertãozinho',
    estado: 'SP',
    cep: '14160-000',
    responsavel: 'Maria Oliveira',
    telefone: '(16) 3234-5678',
    email: 'norte@usina.com.br',
    status: 'Ativa',
    capacidadeProducao: 25000,
    area: 800,
    dataCriacao: '2021-03-20'
  },
  {
    id: '3',
    nome: 'Filial Sul',
    codigo: 'FS-003',
    tipo: 'Filial',
    endereco: 'Estrada Municipal, Km 12',
    cidade: 'Jaboticabal',
    estado: 'SP',
    cep: '14870-000',
    responsavel: 'Pedro Costa',
    telefone: '(16) 3345-6789',
    email: 'sul@usina.com.br',
    status: 'Manutenção',
    capacidadeProducao: 30000,
    area: 950,
    dataCriacao: '2021-08-10',
    observacoes: 'Em reforma da área de produção'
  },
  {
    id: '4',
    nome: 'Filial Oeste',
    codigo: 'FO-004',
    tipo: 'Filial',
    endereco: 'Av. Industrial, 1500',
    cidade: 'Barretos',
    estado: 'SP',
    cep: '14780-000',
    responsavel: 'Ana Santos',
    telefone: '(17) 3456-7890',
    email: 'oeste@usina.com.br',
    status: 'Ativa',
    capacidadeProducao: 20000,
    area: 600,
    dataCriacao: '2022-01-05'
  }
];

const GerenciamentoUnidades = () => {
  const [unidades, setUnidades] = useState<Unidade[]>(mockUnidades);
  const [filteredUnidades, setFilteredUnidades] = useState<Unidade[]>(mockUnidades);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [selectedUnidade, setSelectedUnidade] = useState<Unidade | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Formulário para nova unidade
  const [formData, setFormData] = useState<Partial<Unidade>>({
    nome: '',
    codigo: '',
    tipo: 'Filial',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    responsavel: '',
    telefone: '',
    email: '',
    status: 'Ativa',
    capacidadeProducao: 0,
    area: 0,
    observacoes: ''
  });

  // Filtrar unidades
  React.useEffect(() => {
    let filtered = unidades.filter(unidade => {
      const matchesSearch = unidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           unidade.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           unidade.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           unidade.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'todos' || unidade.status === statusFilter;
      const matchesTipo = tipoFilter === 'todos' || unidade.tipo === tipoFilter;
      
      return matchesSearch && matchesStatus && matchesTipo;
    });
    
    setFilteredUnidades(filtered);
  }, [searchTerm, statusFilter, tipoFilter, unidades]);

  const handleCreateUnidade = () => {
    const newUnidade: Unidade = {
      id: Date.now().toString(),
      ...formData as Unidade,
      dataCriacao: new Date().toISOString().split('T')[0]
    };
    
    setUnidades([...unidades, newUnidade]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast({
      title: "Unidade criada",
      description: `A unidade ${newUnidade.nome} foi criada com sucesso.`,
    });
  };

  const handleEditUnidade = () => {
    if (!selectedUnidade) return;
    
    const updatedUnidades = unidades.map(u => 
      u.id === selectedUnidade.id ? { ...selectedUnidade, ...formData } : u
    );
    
    setUnidades(updatedUnidades);
    setIsEditDialogOpen(false);
    setSelectedUnidade(null);
    resetForm();
    toast({
      title: "Unidade atualizada",
      description: "Os dados da unidade foram atualizados com sucesso.",
    });
  };

  const handleDeleteUnidade = () => {
    if (!selectedUnidade) return;
    
    const updatedUnidades = unidades.filter(u => u.id !== selectedUnidade.id);
    setUnidades(updatedUnidades);
    setIsDeleteDialogOpen(false);
    setSelectedUnidade(null);
    toast({
      title: "Unidade removida",
      description: `A unidade ${selectedUnidade.nome} foi removida com sucesso.`,
    });
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      codigo: '',
      tipo: 'Filial',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      responsavel: '',
      telefone: '',
      email: '',
      status: 'Ativa',
      capacidadeProducao: 0,
      area: 0,
      observacoes: ''
    });
  };

  const openEditDialog = (unidade: Unidade) => {
    setSelectedUnidade(unidade);
    setFormData(unidade);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (unidade: Unidade) => {
    setSelectedUnidade(unidade);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (unidade: Unidade) => {
    setSelectedUnidade(unidade);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Ativa': 'default',
      'Inativa': 'secondary',
      'Manutenção': 'destructive'
    } as const;
    
    return variants[status as keyof typeof variants] || 'default';
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'Matriz' ? 'default' : 'outline';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Unidades</h1>
          <p className="text-muted-foreground">
            Gerencie as unidades e filiais da usina
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Unidade
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Unidades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unidades.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades Ativas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {unidades.filter(u => u.status === 'Ativa').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacidade Total</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unidades.reduce((acc, u) => acc + u.capacidadeProducao, 0).toLocaleString()}L
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Área Total</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unidades.reduce((acc, u) => acc + u.area, 0).toLocaleString()}m²
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, código, cidade ou responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Ativa">Ativa</SelectItem>
                <SelectItem value="Inativa">Inativa</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="Matriz">Matriz</SelectItem>
                <SelectItem value="Filial">Filial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Unidades */}
      <Card>
        <CardHeader>
          <CardTitle>Unidades Cadastradas</CardTitle>
          <CardDescription>
            {filteredUnidades.length} unidade(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cidade/Estado</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnidades.map((unidade) => (
                  <TableRow key={unidade.id}>
                    <TableCell className="font-medium">{unidade.codigo}</TableCell>
                    <TableCell>{unidade.nome}</TableCell>
                    <TableCell>
                      <Badge variant={getTipoBadge(unidade.tipo)}>
                        {unidade.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{unidade.cidade}/{unidade.estado}</TableCell>
                    <TableCell>{unidade.responsavel}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(unidade.status)}>
                        {unidade.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{unidade.capacidadeProducao.toLocaleString()}L</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openViewDialog(unidade)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(unidade)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDeleteDialog(unidade)}
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

      {/* Dialog de Criação */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Unidade</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar uma nova unidade
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Unidade</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Filial Norte"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  placeholder="Ex: FN-001"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => setFormData({...formData, tipo: value as 'Matriz' | 'Filial'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matriz">Matriz</SelectItem>
                    <SelectItem value="Filial">Filial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value as 'Ativa' | 'Inativa' | 'Manutenção'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativa">Ativa</SelectItem>
                    <SelectItem value="Inativa">Inativa</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                placeholder="Ex: Rodovia SP-310, Km 245"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  placeholder="Ex: Ribeirão Preto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  placeholder="Ex: SP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData({...formData, cep: e.target.value})}
                  placeholder="Ex: 14000-000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                  placeholder="Ex: João Silva Santos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="Ex: (16) 3456-7890"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Ex: unidade@usina.com.br"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacidadeProducao">Capacidade de Produção (L)</Label>
                <Input
                  id="capacidadeProducao"
                  type="number"
                  value={formData.capacidadeProducao}
                  onChange={(e) => setFormData({...formData, capacidadeProducao: parseInt(e.target.value) || 0})}
                  placeholder="Ex: 50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Área (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: parseInt(e.target.value) || 0})}
                  placeholder="Ex: 1200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUnidade}>
              Criar Unidade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Unidade</DialogTitle>
            <DialogDescription>
              Edite os dados da unidade {selectedUnidade?.nome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* ... mesmo conteúdo do form de criação ... */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nome">Nome da Unidade</Label>
                <Input
                  id="edit-nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Filial Norte"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-codigo">Código</Label>
                <Input
                  id="edit-codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  placeholder="Ex: FN-001"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tipo">Tipo</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => setFormData({...formData, tipo: value as 'Matriz' | 'Filial'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matriz">Matriz</SelectItem>
                    <SelectItem value="Filial">Filial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({...formData, status: value as 'Ativa' | 'Inativa' | 'Manutenção'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativa">Ativa</SelectItem>
                    <SelectItem value="Inativa">Inativa</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-endereco">Endereço</Label>
              <Input
                id="edit-endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                placeholder="Ex: Rodovia SP-310, Km 245"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-cidade">Cidade</Label>
                <Input
                  id="edit-cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  placeholder="Ex: Ribeirão Preto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado</Label>
                <Input
                  id="edit-estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  placeholder="Ex: SP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cep">CEP</Label>
                <Input
                  id="edit-cep"
                  value={formData.cep}
                  onChange={(e) => setFormData({...formData, cep: e.target.value})}
                  placeholder="Ex: 14000-000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-responsavel">Responsável</Label>
                <Input
                  id="edit-responsavel"
                  value={formData.responsavel}
                  onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                  placeholder="Ex: João Silva Santos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-telefone">Telefone</Label>
                <Input
                  id="edit-telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="Ex: (16) 3456-7890"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Ex: unidade@usina.com.br"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-capacidadeProducao">Capacidade de Produção (L)</Label>
                <Input
                  id="edit-capacidadeProducao"
                  type="number"
                  value={formData.capacidadeProducao}
                  onChange={(e) => setFormData({...formData, capacidadeProducao: parseInt(e.target.value) || 0})}
                  placeholder="Ex: 50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-area">Área (m²)</Label>
                <Input
                  id="edit-area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: parseInt(e.target.value) || 0})}
                  placeholder="Ex: 1200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-observacoes">Observações</Label>
              <Textarea
                id="edit-observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditUnidade}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Visualização */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Unidade</DialogTitle>
            <DialogDescription>
              Informações completas da unidade {selectedUnidade?.nome}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUnidade && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                  <p className="text-sm">{selectedUnidade.nome}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Código</Label>
                  <p className="text-sm">{selectedUnidade.codigo}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                  <Badge variant={getTipoBadge(selectedUnidade.tipo)}>
                    {selectedUnidade.tipo}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={getStatusBadge(selectedUnidade.status)}>
                    {selectedUnidade.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Endereço Completo</Label>
                <p className="text-sm">
                  {selectedUnidade.endereco}<br/>
                  {selectedUnidade.cidade}/{selectedUnidade.estado} - {selectedUnidade.cep}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Responsável</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{selectedUnidade.responsavel}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Telefone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{selectedUnidade.telefone}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{selectedUnidade.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Capacidade de Produção</Label>
                  <p className="text-sm font-semibold">{selectedUnidade.capacidadeProducao.toLocaleString()} L</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Área</Label>
                  <p className="text-sm font-semibold">{selectedUnidade.area.toLocaleString()} m²</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Data de Criação</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{new Date(selectedUnidade.dataCriacao).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              {selectedUnidade.observacoes && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
                  <p className="text-sm">{selectedUnidade.observacoes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a unidade "{selectedUnidade?.nome}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteUnidade}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciamentoUnidades;