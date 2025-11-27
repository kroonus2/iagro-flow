import { ScadaComponent, PLCVariable } from "@/types/supervisorio";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ComponentPropertiesProps {
  component: ScadaComponent | null;
  plcVariables: PLCVariable[];
  onUpdate: (component: ScadaComponent) => void;
  onDelete: () => void;
}

export const ComponentProperties = ({
  component,
  plcVariables,
  onUpdate,
  onDelete
}: ComponentPropertiesProps) => {
  if (!component) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Propriedades</CardTitle>
          <CardDescription>Selecione um componente</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Clique em um componente no canvas para editar suas propriedades
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propriedades</CardTitle>
        <CardDescription>{component.label}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Nome do Componente</Label>
          <Input
            id="label"
            value={component.label}
            onChange={(e) => onUpdate({ ...component, label: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plcVariable">Variável do CLP</Label>
          <Select
            value={component.plcVariable || ""}
            onValueChange={(value) => onUpdate({ ...component, plcVariable: value })}
          >
            <SelectTrigger id="plcVariable">
              <SelectValue placeholder="Selecione uma variável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhuma</SelectItem>
              {plcVariables.map((variable) => (
                <SelectItem key={variable.endereco} value={variable.endereco}>
                  {variable.nome} ({variable.endereco})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="posX">Posição X</Label>
            <Input
              id="posX"
              type="number"
              value={Math.round(component.position.x)}
              onChange={(e) => onUpdate({ 
                ...component, 
                position: { ...component.position, x: Number(e.target.value) }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="posY">Posição Y</Label>
            <Input
              id="posY"
              type="number"
              value={Math.round(component.position.y)}
              onChange={(e) => onUpdate({ 
                ...component, 
                position: { ...component.position, y: Number(e.target.value) }
              })}
            />
          </div>
        </div>

        <Button 
          variant="destructive" 
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Remover Componente
        </Button>
      </CardContent>
    </Card>
  );
};
