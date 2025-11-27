import { useState, useRef, useCallback } from "react";
import { ScadaComponent as ScadaComponentType, PLCVariable } from "@/types/supervisorio";
import { ScadaComponent } from "./ScadaComponent";

interface ScadaCanvasProps {
  components: ScadaComponentType[];
  backgroundImage?: string;
  plcVariables: PLCVariable[];
  onComponentsChange: (components: ScadaComponentType[]) => void;
  selectedComponentId?: string;
  onSelectComponent: (id: string | undefined) => void;
}

export const ScadaCanvas = ({
  components,
  backgroundImage,
  plcVariables,
  onComponentsChange,
  selectedComponentId,
  onSelectComponent
}: ScadaCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    setDraggedComponent(componentId);
    onSelectComponent(componentId);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - component.position.x,
        y: e.clientY - rect.top - component.position.y
      });
    }
  }, [components, onSelectComponent]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedComponent || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    onComponentsChange(
      components.map(c => 
        c.id === draggedComponent 
          ? { ...c, position: { x: newX, y: newY } }
          : c
      )
    );
  }, [draggedComponent, dragOffset, components, onComponentsChange]);

  const handleMouseUp = useCallback(() => {
    setDraggedComponent(null);
  }, []);

  const handleCanvasClick = useCallback(() => {
    onSelectComponent(undefined);
  }, [onSelectComponent]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-muted/20 border-2 border-dashed border-border rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '600px'
      }}
    >
      {components.map(component => {
        const plcVariable = plcVariables.find(v => v.endereco === component.plcVariable);
        
        return (
          <div
            key={component.id}
            onMouseDown={(e) => handleMouseDown(component.id, e)}
          >
            <ScadaComponent
              id={component.id}
              type={component.type}
              position={component.position}
              label={component.label}
              plcVariable={plcVariable}
              isSelected={selectedComponentId === component.id}
              isDragging={draggedComponent === component.id}
              onSelect={() => onSelectComponent(component.id)}
            />
          </div>
        );
      })}
      
      {components.length === 0 && !backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <p>Arraste componentes aqui ou faça upload de uma imagem de fundo</p>
        </div>
      )}
    </div>
  );
};
