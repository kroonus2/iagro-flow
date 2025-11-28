import { useState } from "react";
import {
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { ComponentType, PLCVariable, ScadaComponent as ScadaComponentModel } from "@/types/supervisorio";
import { cn } from "@/lib/utils";

interface ScadaComponentProps {
  id: string;
  type: ComponentType;
  position: { x: number; y: number };
  label: string;
  plcVariable?: PLCVariable;
  config?: ScadaComponentModel["config"];
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
  config,
  isSelected,
  isDragging,
  onSelect
}: ScadaComponentProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const rotation = config?.rotation ?? 0;
  const scale = config?.size ?? 1;
  const showCaption = config?.showCaption ?? true;

  const getIcon = () => {
    switch (type) {
      case "thermometer":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-6 rounded-full border-2 border-current bg-red-500/10" />
              <div className="w-3 h-3 rounded-full border-2 border-current bg-red-500" />
            </div>
          </div>
        );
      case "tank":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-7 h-9 rounded-md border-2 border-current bg-blue-500/10 flex flex-col justify-end overflow-hidden">
              <div className="w-full h-2 bg-blue-500" />
            </div>
          </div>
        );
      case "fan":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative w-8 h-8 rounded-full border-2 border-current">
              <div className="absolute inset-1 rounded-full border-t-2 border-current" />
              <div className="absolute inset-2 rounded-full border-b-2 border-current rotate-45" />
            </div>
          </div>
        );
      case "pump":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative w-8 h-8 rounded-full border-2 border-current">
              <div className="absolute inset-2 border-l-2 border-current rounded-full" />
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-4 h-1.5 bg-current rounded-sm" />
            </div>
          </div>
        );
      case "motor":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-9 h-6 rounded-md border-2 border-current flex items-center justify-center text-[10px] font-bold">
              M
            </div>
          </div>
        );
      case "gauge":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative w-8 h-8 rounded-full border-2 border-current">
              <div className="absolute inset-2 border-t-2 border-current rounded-full" />
              <div className="absolute bottom-1 left-1/2 w-0.5 h-3 bg-current origin-bottom rotate-[-40deg]" />
            </div>
          </div>
        );
      case "valve":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-5 bg-current rounded-sm" />
              <div className="w-5 h-3 border-y-2 border-current rounded-sm" />
              <div className="w-1.5 h-5 bg-current rounded-sm" />
            </div>
          </div>
        );
      case "switch":
        return plcVariable?.valor ? (
          <ToggleRight className="w-full h-full" strokeWidth={1.5} />
        ) : (
          <ToggleLeft className="w-full h-full" strokeWidth={1.5} />
        );
      case "indicator":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div
              className={cn(
                "w-3.5 h-3.5 rounded-full border-2 border-current",
                plcVariable?.valor && "bg-current"
              )}
            />
          </div>
        );
      case "line":
        const length = config?.length ?? 80;
        return (
          <div
            className="h-1 rounded-full bg-current"
            style={{
              width: `${length}px`,
            }}
          />
        );
      case "button":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <div className="px-3 py-1 rounded-full border-2 border-current text-[10px] font-semibold">
              {label}
            </div>
          </div>
        );
      case "textLabel":
        return (
          <div className="flex items-center justify-center w-full h-full text-xs font-medium">
            {label}
          </div>
        );
      case "textInput":
        return (
          <div className="flex items-center justify-center w-full h-full">
            <input
              className="w-20 px-2 py-1 text-[10px] rounded border border-current bg-background/80"
              placeholder={plcVariable?.endereco ?? label}
              readOnly
            />
          </div>
        );
      default:
        return null;
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
        isSelected && type !== "line" && "ring-2 ring-primary ring-offset-2 rounded-lg",
        isDragging && "opacity-50",
        isHovered && "scale-110"
      )}
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        pointerEvents: 'auto'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {type === "line" ? (
        <div className={cn("flex items-center justify-center", getColor())}>
          {getIcon()}
        </div>
      ) : (
        <div className={cn("w-12 h-12", getColor())}>
          {getIcon()}
        </div>
      )}
      {showCaption && type !== "button" && type !== "textLabel" && type !== "textInput" && (
        <div className="flex flex-col items-center gap-0 bg-transparent px-2 py-1 text-xs whitespace-nowrap">
          <span className="font-semibold">{label}</span>
          {plcVariable && (
            <span className={cn("text-[10px] font-medium", getColor())}>
              {getDisplayValue()}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
