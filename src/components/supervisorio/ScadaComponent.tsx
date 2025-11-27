import { useState } from "react";
import { 
  Thermometer, 
  Droplet, 
  Wind, 
  Gauge, 
  Power, 
  Fan,
  Circle,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { ComponentType, PLCVariable } from "@/types/supervisorio";
import { cn } from "@/lib/utils";

interface ScadaComponentProps {
  id: string;
  type: ComponentType;
  position: { x: number; y: number };
  label: string;
  plcVariable?: PLCVariable;
  isSelected?: boolean;
  isDragging?: boolean;
  onSelect?: () => void;
}

export const ScadaComponent = ({
  id,
  type,
  position,
  label,
  plcVariable,
  isSelected,
  isDragging,
  onSelect
}: ScadaComponentProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    const iconProps = { 
      className: "w-full h-full",
      strokeWidth: 1.5
    };

    switch (type) {
      case "thermometer":
        return <Thermometer {...iconProps} />;
      case "tank":
        return <Droplet {...iconProps} />;
      case "fan":
        return <Fan {...iconProps} />;
      case "pump":
        return <Power {...iconProps} />;
      case "motor":
        return <Power {...iconProps} />;
      case "gauge":
        return <Gauge {...iconProps} />;
      case "valve":
        return <Circle {...iconProps} />;
      case "switch":
        return plcVariable?.valor ? <ToggleRight {...iconProps} /> : <ToggleLeft {...iconProps} />;
      case "indicator":
        return <Circle {...iconProps} fill={plcVariable?.valor ? "currentColor" : "none"} />;
      default:
        return <Circle {...iconProps} />;
    }
  };

  const getColor = () => {
    if (!plcVariable) return "text-muted-foreground";
    
    if (plcVariable.tipo === "digital") {
      return plcVariable.valor ? "text-primary" : "text-muted-foreground";
    }
    
    // Para analógicos, cor baseada no valor
    const valor = Number(plcVariable.valor);
    if (type === "thermometer") {
      if (valor > 70) return "text-destructive";
      if (valor > 50) return "text-yellow-500";
      return "text-primary";
    }
    
    return "text-primary";
  };

  const getDisplayValue = () => {
    if (!plcVariable) return "";
    
    if (plcVariable.tipo === "digital") {
      return plcVariable.valor ? "ON" : "OFF";
    }
    
    return `${Number(plcVariable.valor).toFixed(1)}${plcVariable.unidade || ""}`;
  };

  return (
    <div
      className={cn(
        "absolute flex flex-col items-center gap-1 cursor-move select-none transition-all z-10",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded-lg",
        isDragging && "opacity-50",
        isHovered && "scale-110"
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'auto'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      <div className={cn("w-12 h-12 drop-shadow-lg", getColor())}>
        {getIcon()}
      </div>
      <div className="flex flex-col items-center gap-0 bg-background/95 backdrop-blur-sm px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap border border-border/50">
        <span className="font-semibold">{label}</span>
        {plcVariable && (
          <span className={cn("text-[10px] font-medium", getColor())}>
            {getDisplayValue()}
          </span>
        )}
      </div>
    </div>
  );
};
