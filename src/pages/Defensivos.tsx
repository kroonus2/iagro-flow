import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Package } from "lucide-react";
import { toast } from "sonner";

const Defensivos = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dados simulados baseados na imagem fornecida
  const defensivos = [
    {
      codigo: "NAPTOL",
      nomeComercial: "ACETRPILUNAS - BULK",
      embalagem: "BULK",
      unidade: "L"
    },
    {
      codigo: "D",
      nomeComercial: "ABCD",
      embalagem: "BULK", 
      unidade: "L"
    },
    {
      codigo: "STITSTE",
      nomeComercial: "COLADA CD",
      embalagem: "Fracionado",
      unidade: "L"
    },
    {
      codigo: "2T",
      nomeComercial: "HERBICIDA CABDI ULTRASLOW ADOBE - FUSITRAT BOOX",
      embalagem: "Fracionado",
      unidade: "L"
    },
    {
      codigo: "SEITSA",
      nomeComercial: "INSARA CELAO",
      embalagem: "Fracionado",
      unidade: "L"
    },
    {
      codigo: "STITSTR",
      nomeComercial: "STRUSTON",
      embalagem: "BULK",
      unidade: "L"
    },
    {
      codigo: "SITNSA",
      nomeComercial: "HERBICIDA PREPARA TOSIA SOL GR - FUMANA FD",
      embalagem: "Fracionado",
      unidade: "L"
    },
    {
      codigo: "SAETHS",
      nomeComercial: "PACLAM",
      embalagem: "Fracionado",
      unidade: "L"
    },
    {
      codigo: "PHSOLS",
      nomeComercial: "PHU BEEF",
      embalagem: "Fracionado",
      unidade: "KG"
    },
    {
      codigo: "ED",
      nomeComercial: "CHARLIE CAUSTIC CONCENTRADO FOL DE CRANTE NATURAL CANTAL CASCO",
      embalagem: "Fracionado",
      unidade: "KG"
    }
  ];

  const filteredDefensivos = defensivos.filter(defensivo =>
    defensivo.nomeComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    defensivo.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIncluirDefensivo = () => {
    toast.info("Funcionalidade de inclusão em desenvolvimento");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Defensivos</h1>
          <p className="text-muted-foreground mt-1">
            Cadastro e gerenciamento de defensivos agrícolas
          </p>
        </div>
        <Button onClick={handleIncluirDefensivo} className="bg-iagro-dark hover:bg-iagro-dark/90">
          <Plus className="h-4 w-4 mr-2" />
          Incluir Defensivo
        </Button>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Buscar Defensivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquise no conteúdo"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Defensivos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Defensivos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cód. CAtivo</TableHead>
                  <TableHead>Nome Comercial</TableHead>
                  <TableHead>Embalagem</TableHead>
                  <TableHead>Unidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDefensivos.map((defensivo, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {defensivo.codigo}
                    </TableCell>
                    <TableCell>
                      {defensivo.nomeComercial}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={defensivo.embalagem === "BULK" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {defensivo.embalagem}
                      </Badge>
                    </TableCell>
                    <TableCell>{defensivo.unidade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredDefensivos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum defensivo encontrado com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{defensivos.length}</p>
            <p className="text-sm text-muted-foreground">Total de Defensivos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">B</span>
            </div>
            <p className="text-2xl font-bold">
              {defensivos.filter(d => d.embalagem === "BULK").length}
            </p>
            <p className="text-sm text-muted-foreground">Produtos BULK</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-secondary rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs font-bold text-secondary-foreground">F</span>
            </div>
            <p className="text-2xl font-bold">
              {defensivos.filter(d => d.embalagem === "Fracionado").length}
            </p>
            <p className="text-sm text-muted-foreground">Produtos Fracionados</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Defensivos;