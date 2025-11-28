import { useMemo, useState } from "react";
import { ScadaComponent, PLCVariable } from "@/types/supervisorio";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Switch } from "@/components/ui/switch";

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
  const tagOptions = useMemo(
    () =>
      plcVariables.map((variable) => ({
        value: variable.endereco,
        label: `${variable.nome} (${variable.endereco})`,
      })),
    [plcVariables]
  );

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

        <div className="flex items-center justify-between space-y-0 rounded-md border px-3 py-2">
          <div className="space-y-0.5">
            <Label htmlFor="showCaption" className="text-sm font-medium">
              Mostrar texto abaixo
            </Label>
            <p className="text-xs text-muted-foreground">
              Exibe o nome e o valor do componente sob o ícone.
            </p>
          </div>
          <Switch
            id="showCaption"
            checked={component.config?.showCaption ?? true}
            onCheckedChange={(checked) =>
              onUpdate({
                ...component,
                config: { ...component.config, showCaption: checked },
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="plcVariable">Tag / Variável do CLP</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="plcVariable"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {component.plcVariable
                  ? tagOptions.find((t) => t.value === component.plcVariable)?.label ??
                    component.plcVariable
                  : "Selecione uma tag/variável"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <Command>
                <CommandInput placeholder="Buscar tag/variável..." />
                <CommandEmpty>Nenhuma tag encontrada.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      value="Nenhuma"
                      onSelect={() =>
                        onUpdate({
                          ...component,
                          plcVariable: undefined,
                        })
                      }
                    >
                      <Check
                        className={
                          !component.plcVariable
                            ? "mr-2 h-4 w-4 opacity-100"
                            : "mr-2 h-4 w-4 opacity-0"
                        }
                      />
                      Nenhuma
                    </CommandItem>
                    {tagOptions.map((tag) => (
                      <CommandItem
                        key={tag.value}
                        value={tag.label}
                        onSelect={() =>
                          onUpdate({
                            ...component,
                            plcVariable: tag.value,
                          })
                        }
                      >
                        <Check
                          className={
                            component.plcVariable === tag.value
                              ? "mr-2 h-4 w-4 opacity-100"
                              : "mr-2 h-4 w-4 opacity-0"
                          }
                        />
                        {tag.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="rotation">Rotação (graus)</Label>
            <Input
              id="rotation"
              type="number"
              value={component.config?.rotation ?? 0}
              onChange={(e) =>
                onUpdate({
                  ...component,
                  config: {
                    ...component.config,
                    rotation: Number(e.target.value) || 0,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Tamanho (escala)</Label>
            <Input
              id="size"
              type="number"
              step="0.1"
              value={component.config?.size ?? 1}
              onChange={(e) =>
                onUpdate({
                  ...component,
                  config: {
                    ...component.config,
                    size: Math.max(0.2, Number(e.target.value) || 1),
                  },
                })
              }
            />
          </div>
        </div>

        {component.type === "line" && (
          <div className="space-y-2">
            <Label htmlFor="length">Comprimento (px)</Label>
            <Input
              id="length"
              type="number"
              value={component.config?.length ?? 80}
              onChange={(e) =>
                onUpdate({
                  ...component,
                  config: {
                    ...component.config,
                    length: Math.max(10, Number(e.target.value) || 10),
                  },
                })
              }
            />
          </div>
        )}

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
