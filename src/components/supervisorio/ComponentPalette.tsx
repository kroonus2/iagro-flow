import { ComponentType } from "@/types/supervisorio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Thermometer, 
  Droplet, 
  Wind, 
  Gauge, 
  Power, 
  Fan,
  Circle,
  ToggleLeft
} from "lucide-react";

interface ComponentPaletteProps {
  onAddComponent: (type: ComponentType) => void;
}

const componentTypes: { type: ComponentType; icon: any; label: string }[] = [
  { type: "thermometer", icon: Thermometer, label: "Termômetro" },
  { type: "tank", icon: Droplet, label: "Tanque" },
  { type: "gauge", icon: Gauge, label: "Medidor" },
  { type: "pump", icon: Power, label: "Bomba" },
  { type: "motor", icon: Power, label: "Motor" },
  { type: "fan", icon: Fan, label: "Ventilador" },
  { type: "valve", icon: Circle, label: "Válvula" },
  { type: "switch", icon: ToggleLeft, label: "Chave" },
  { type: "indicator", icon: Circle, label: "Indicador" },
];

export const ComponentPalette = ({ onAddComponent }: ComponentPaletteProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Componentes</CardTitle>
        <CardDescription>Clique para adicionar ao canvas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {componentTypes.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant="outline"
              className="h-auto flex-col gap-2 p-3"
              onClick={() => onAddComponent(type)}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
