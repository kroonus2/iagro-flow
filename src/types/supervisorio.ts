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
  | "switch"
  | "line" // usado como encanamento/fios, com rotação
  | "button" // botão de comando
  | "textLabel" // label de texto livre
  | "textInput"; // caixa de texto para entrada do usuário

export interface PLCVariable {
  id: number;
  endereco: string;
  nome: string;
  tipo: "digital" | "analogico";
  valor: number | boolean;
  unidade?: string;
  smartCaldaId: string;
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
    rotation?: number; // graus, usado para o componente de encanamento/fios
    length?: number; // comprimento em pixels para o componente de encanamento/fios
    showCaption?: boolean; // exibir ou não o texto abaixo do componente
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

// ------------------------
// Tipos de domínio (backend)
// ------------------------

// Entidade de domínio do backend: Supervisory
export interface Supervisory {
  id: string;
  smartCaldaId: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Entidade de domínio do backend: SupervisoryView
// (mantemos separado da interface usada hoje no canvas para evitar quebra brusca)
export interface DomainSupervisoryView {
  id: string;
  supervisoryId: string;
  name: string;
  description?: string;
  // Campo extra de frontend para permitir imagem de fundo no canvas
  backgroundImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Entidade de domínio do backend: SupervisoryComponent
export interface DomainSupervisoryComponent {
  id: string;
  viewId: string;
  type: ComponentType;
  // Posição no canvas (equivalente a x/y do backend)
  x: number;
  y: number;
  width?: number;
  height?: number;
  // Binding com variável de CLP (id numérico)
  variableId?: number;
  // Configuração específica do componente (cores, ranges, etc.)
  label: string;
  config?: {
    color?: string;
    size?: number;
    min?: number;
    max?: number;
    length?: number;
    showCaption?: boolean;
  } & Record<string, unknown>;
}

// Entidade de domínio do backend: SupervisoryAlarm
export type SupervisoryAlarmStatus = "active" | "acknowledged";

export interface SupervisoryAlarm {
  id: string;
  smartCaldaId: string;
  tipo: string;
  mensagem: string;
  timestamp: Date;
  status: SupervisoryAlarmStatus;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock de Smart Calda/CLP usado apenas no frontend
export interface MockSmartCalda {
  id: string;
  name: string;
  connected: boolean;
}
