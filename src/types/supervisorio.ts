// Tipos para o sistema supervisório visual

export type ComponentType = 
  | "thermometer" 
  | "tank" 
  | "valve" 
  | "pump" 
  | "fan" 
  | "motor"
  | "gauge"
  | "indicator"
  | "switch";

export interface PLCVariable {
  endereco: string;
  nome: string;
  tipo: "digital" | "analogico";
  valor: number | boolean;
  unidade?: string;
}

export interface ScadaComponent {
  id: string;
  type: ComponentType;
  position: { x: number; y: number };
  plcVariable?: string; // endereco da variavel
  label: string;
  config?: {
    color?: string;
    size?: number;
    min?: number;
    max?: number;
  };
}

export interface SupervisoryView {
  id: string;
  name: string;
  plcId: string;
  backgroundImage?: string;
  components: ScadaComponent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MockPLC {
  id: string;
  name: string;
  connected: boolean;
  variables: PLCVariable[];
}
