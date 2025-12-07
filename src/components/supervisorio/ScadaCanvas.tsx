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
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback((componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    setDraggedComponent(componentId);
    onSelectComponent(componentId);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - (component.position.x + origin.x),
        y: e.clientY - rect.top - (component.position.y + origin.y)
      });
    }
  }, [components, onSelectComponent, origin.x, origin.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && panStartRef.current) {
      const deltaX = e.clientX - panStartRef.current.x;
      const deltaY = e.clientY - panStartRef.current.y;
      setOrigin(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      panStartRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!draggedComponent || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const canvasMouseX = e.clientX - rect.left;
    const canvasMouseY = e.clientY - rect.top;

    const newX = canvasMouseX - dragOffset.x - origin.x;
    const newY = canvasMouseY - dragOffset.y - origin.y;

    onComponentsChange(
      components.map(c => 
        c.id === draggedComponent 
          ? { ...c, position: { x: newX, y: newY } }
          : c
      )
    );
  }, [draggedComponent, dragOffset, components, onComponentsChange, isPanning, origin.x, origin.y]);

  const handleMouseUp = useCallback(() => {
    setDraggedComponent(null);
    setIsPanning(false);
    panStartRef.current = null;
  }, []);

  const handleCanvasClick = useCallback(() => {
    onSelectComponent(undefined);
  }, [onSelectComponent]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Inicia pan se clicar no fundo (não em um componente)
    if (e.button !== 0) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-muted/20 border-2 border-border rounded-lg overflow-hidden"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '700px',
        backgroundColor: backgroundImage ? '#2a2a2a' : undefined
      }}
    >
      {components.map(component => {
        const plcVariable = plcVariables.find(v => v.endereco === component.plcVariable);
        
        return (
          <div
            key={component.id}
            onMouseDown={(e) => handleMouseDown(component.id, e)}
            style={{ position: 'relative', zIndex: 10 }}
          >
            <ScadaComponent
              id={component.id}
              type={component.type}
              position={{
                x: component.position.x + origin.x,
                y: component.position.y + origin.y,
              }}
              label={component.label}
              config={component.config}
              plcVariable={plcVariable}
              isSelected={selectedComponentId === component.id}
              isDragging={draggedComponent === component.id}
              onSelect={() => onSelectComponent(component.id)}
            />
          </div>
        );
      })}
      
      {components.length === 0 && !backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground pointer-events-none">
          <p>Arraste componentes aqui ou faça upload de uma imagem de fundo</p>
        </div>
      )}
    </div>
  );
};
