import {
  ComponentType,
  DomainSupervisoryComponent,
  DomainSupervisoryView,
  MockPLC,
  MockSmartCalda,
  PLCVariable,
  Supervisory,
  SupervisoryAlarm,
  SupervisoryAlarmStatus,
} from "@/types/supervisorio";

// ------------------------
// Estado em memória (mock)
// ------------------------

let plcVariableIdCounter = 1;
let supervisoryIdCounter = 1;
let viewIdCounter = 1;
let componentIdCounter = 1;
let alarmIdCounter = 1;

// Smart Caldas/CLPs mockados
export const mockSmartCaldas: MockSmartCalda[] = [
  { id: "SC-001", name: "Smart Calda 01", connected: true },
  { id: "SC-002", name: "Smart Calda 02", connected: true },
  { id: "SC-003", name: "Smart Calda 03", connected: false },
];

// Variáveis de CLP mockadas, associadas às Smart Caldas
export const mockPLCs: MockPLC[] = [
  {
    id: "SC-001",
    name: "Smart Calda 01",
    connected: true,
    variables: [
      {
        id: plcVariableIdCounter++,
        endereco: "AI001",
        nome: "Temperatura",
        tipo: "analogico",
        valor: 65.2,
        unidade: "°C",
        smartCaldaId: "SC-001",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "AI002",
        nome: "Pressão",
        tipo: "analogico",
        valor: 2.1,
        unidade: "bar",
        smartCaldaId: "SC-001",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "AI003",
        nome: "Nível",
        tipo: "analogico",
        valor: 78,
        unidade: "%",
        smartCaldaId: "SC-001",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "AI004",
        nome: "Vazão",
        tipo: "analogico",
        valor: 120.5,
        unidade: "L/min",
        smartCaldaId: "SC-001",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "DI001",
        nome: "Sensor Nível Alto",
        tipo: "digital",
        valor: true,
        smartCaldaId: "SC-001",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "DI002",
        nome: "Sensor Nível Baixo",
        tipo: "digital",
        valor: false,
        smartCaldaId: "SC-001",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "DO001",
        nome: "Bomba Principal",
        tipo: "digital",
        valor: true,
        smartCaldaId: "SC-001",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "DO002",
        nome: "Válvula Entrada",
        tipo: "digital",
        valor: true,
        smartCaldaId: "SC-001",
      },
    ],
  },
  {
    id: "SC-002",
    name: "Smart Calda 02",
    connected: true,
    variables: [
      {
        id: plcVariableIdCounter++,
        endereco: "AI005",
        nome: "Temperatura",
        tipo: "analogico",
        valor: 22.1,
        unidade: "°C",
        smartCaldaId: "SC-002",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "AI006",
        nome: "Pressão",
        tipo: "analogico",
        valor: 0.0,
        unidade: "bar",
        smartCaldaId: "SC-002",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "AI007",
        nome: "Nível",
        tipo: "analogico",
        valor: 15,
        unidade: "%",
        smartCaldaId: "SC-002",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "DI005",
        nome: "Sensor Nível Alto",
        tipo: "digital",
        valor: false,
        smartCaldaId: "SC-002",
      },
      {
        id: plcVariableIdCounter++,
        endereco: "DO005",
        nome: "Bomba Principal",
        tipo: "digital",
        valor: false,
        smartCaldaId: "SC-002",
      },
    ],
  },
  {
    id: "SC-003",
    name: "Smart Calda 03",
    connected: false,
    variables: [],
  },
];

// Supervisórios, views, componentes e alarmes mockados
const supervisories: Supervisory[] = [
  {
    id: `sup-${supervisoryIdCounter++}`,
    smartCaldaId: "SC-001",
    name: "Supervisório Smart Calda 01",
    description: "Vista geral da Smart Calda 01",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const supervisoryViews: DomainSupervisoryView[] = [
  {
    id: `view-${viewIdCounter++}`,
    supervisoryId: supervisories[0].id,
    name: "Vista Geral",
    description: "Monitoramento geral da linha",
    backgroundImage: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Layout de exemplo pré-configurado para a primeira view
const getVariableId = (endereco: string): number | undefined => {
  const plc = mockPLCs.find(
    (p) => p.id === supervisories[0].smartCaldaId
  );
  return plc?.variables.find((v) => v.endereco === endereco)?.id;
};

const supervisoryComponents: DomainSupervisoryComponent[] = [
  {
    id: `comp-${componentIdCounter++}`,
    viewId: supervisoryViews[0].id,
    type: "thermometer" as ComponentType,
    x: 650,
    y: 260,
    variableId: getVariableId("AI001"),
    width: undefined,
    height: undefined,
    label: "Temp. Tanque",
    config: { min: 0, max: 100 },
  },
  {
    id: `comp-${componentIdCounter++}`,
    viewId: supervisoryViews[0].id,
    type: "gauge" as ComponentType,
    x: 520,
    y: 220,
    variableId: getVariableId("AI002"),
    width: undefined,
    height: undefined,
    label: "Pressão Linha",
    config: { min: 0, max: 5 },
  },
  {
    id: `comp-${componentIdCounter++}`,
    viewId: supervisoryViews[0].id,
    type: "tank" as ComponentType,
    x: 650,
    y: 330,
    variableId: getVariableId("AI003"),
    width: undefined,
    height: undefined,
    label: "Nível Tanque",
    config: { min: 0, max: 100 },
  },
  {
    id: `comp-${componentIdCounter++}`,
    viewId: supervisoryViews[0].id,
    type: "pump" as ComponentType,
    x: 460,
    y: 360,
    variableId: getVariableId("DO001"),
    width: undefined,
    height: undefined,
    label: "Bomba Principal",
    config: {},
  },
  {
    id: `comp-${componentIdCounter++}`,
    viewId: supervisoryViews[0].id,
    type: "valve" as ComponentType,
    x: 560,
    y: 280,
    variableId: getVariableId("DO002"),
    width: undefined,
    height: undefined,
    label: "Válvula Entrada",
    config: {},
  },
  {
    id: `comp-${componentIdCounter++}`,
    viewId: supervisoryViews[0].id,
    type: "indicator" as ComponentType,
    x: 740,
    y: 260,
    variableId: getVariableId("DI001"),
    width: undefined,
    height: undefined,
    label: "Nível Alto",
    config: {},
  },
];

const supervisoryAlarms: SupervisoryAlarm[] = [
  {
    id: `alarm-${alarmIdCounter++}`,
    smartCaldaId: "SC-001",
    tipo: "Temperatura Alta",
    mensagem: "Temperatura acima do limite no tanque principal",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: `alarm-${alarmIdCounter++}`,
    smartCaldaId: "SC-002",
    tipo: "Nível Baixo",
    mensagem: "Nível abaixo do mínimo na Smart Calda 02",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: "acknowledged",
    acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000),
    acknowledgedBy: "operador@iagro.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ------------------------
// Helpers
// ------------------------

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateLatency = async () => {
  const jitter = 100 + Math.random() * 200;
  await delay(jitter);
};

const nextId = (prefix: string, counterRef: { value: number }) => {
  return `${prefix}-${counterRef.value++}`;
};

// ------------------------
// Serviços mockados (REST-like)
// ------------------------

export async function listSupervisories(): Promise<Supervisory[]> {
  await simulateLatency();
  return [...supervisories];
}

export async function createSupervisory(
  data: Pick<Supervisory, "name" | "description" | "smartCaldaId">
): Promise<Supervisory> {
  await simulateLatency();
  const now = new Date();
  const supervisory: Supervisory = {
    id: `sup-${supervisoryIdCounter++}`,
    smartCaldaId: data.smartCaldaId,
    name: data.name,
    description: data.description,
    createdAt: now,
    updatedAt: now,
  };
  supervisories.push(supervisory);
  return supervisory;
}

export async function updateSupervisory(
  id: string,
  data: Partial<Pick<Supervisory, "name" | "description" | "smartCaldaId">>
): Promise<Supervisory | null> {
  await simulateLatency();
  const idx = supervisories.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const updated: Supervisory = {
    ...supervisories[idx],
    ...data,
    updatedAt: new Date(),
  };
  supervisories[idx] = updated;
  return updated;
}

export async function deleteSupervisory(id: string): Promise<void> {
  await simulateLatency();
  const index = supervisories.findIndex((s) => s.id === id);
  if (index !== -1) {
    supervisories.splice(index, 1);
  }
}

export async function listViewsBySupervisory(
  supervisoryId: string
): Promise<DomainSupervisoryView[]> {
  await simulateLatency();
  return supervisoryViews.filter((v) => v.supervisoryId === supervisoryId);
}

export async function createView(
  supervisoryId: string,
  data: Pick<DomainSupervisoryView, "name" | "description">
): Promise<DomainSupervisoryView> {
  await simulateLatency();
  const now = new Date();
  const view: DomainSupervisoryView = {
    id: `view-${viewIdCounter++}`,
    supervisoryId,
    name: data.name,
    description: data.description,
    backgroundImage: undefined,
    createdAt: now,
    updatedAt: now,
  };
  supervisoryViews.push(view);
  return view;
}

export async function updateView(
  id: string,
  data: Partial<Pick<DomainSupervisoryView, "name" | "description" | "backgroundImage">>
): Promise<DomainSupervisoryView | null> {
  await simulateLatency();
  const idx = supervisoryViews.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  const updated: DomainSupervisoryView = {
    ...supervisoryViews[idx],
    ...data,
    updatedAt: new Date(),
  };
  supervisoryViews[idx] = updated;
  return updated;
}

export async function deleteView(id: string): Promise<void> {
  await simulateLatency();
  const idx = supervisoryViews.findIndex((v) => v.id === id);
  if (idx !== -1) {
    supervisoryViews.splice(idx, 1);
  }
}

// Equivalente ao PUT /supervisory/views/:viewId/components
export async function upsertViewComponents(
  viewId: string,
  components: Omit<DomainSupervisoryComponent, "id" | "viewId">[]
): Promise<DomainSupervisoryComponent[]> {
  await simulateLatency();

  // Remove componentes antigos da view
  for (let i = supervisoryComponents.length - 1; i >= 0; i--) {
    if (supervisoryComponents[i].viewId === viewId) {
      supervisoryComponents.splice(i, 1);
    }
  }

  const created = components.map((c) => {
    const component: DomainSupervisoryComponent = {
      id: `comp-${componentIdCounter++}`,
      viewId,
      ...c,
    };
    supervisoryComponents.push(component);
    return component;
  });

  return created;
}

export async function listComponentsByView(
  viewId: string
): Promise<DomainSupervisoryComponent[]> {
  await simulateLatency();
  return supervisoryComponents.filter((c) => c.viewId === viewId);
}

// ------------------------
// Alarmes
// ------------------------

export interface AlarmFilters {
  smartCaldaId?: string;
  tipo?: string;
  status?: SupervisoryAlarmStatus;
}

export async function listAlarms(
  filters: AlarmFilters = {}
): Promise<SupervisoryAlarm[]> {
  await simulateLatency();
  return supervisoryAlarms.filter((a) => {
    if (filters.smartCaldaId && a.smartCaldaId !== filters.smartCaldaId) {
      return false;
    }
    if (filters.tipo && a.tipo !== filters.tipo) {
      return false;
    }
    if (filters.status && a.status !== filters.status) {
      return false;
    }
    return true;
  });
}

export async function acknowledgeAlarm(id: string): Promise<SupervisoryAlarm | null> {
  await simulateLatency();
  const idx = supervisoryAlarms.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const now = new Date();
  const updated: SupervisoryAlarm = {
    ...supervisoryAlarms[idx],
    status: "acknowledged",
    acknowledgedAt: now,
    acknowledgedBy: "operador.mock@iagro.com",
    updatedAt: now,
  };
  supervisoryAlarms[idx] = updated;
  return updated;
}

// ------------------------
// Mock de realtime (WebSocket-like)
// ------------------------

export interface RealtimeDataPayload {
  smartCaldaId: string;
  variables: PLCVariable[];
}

type RealtimeCallback = (payload: RealtimeDataPayload) => void;

let realtimeInterval: number | null = null;
const realtimeSubscribers = new Map<string, RealtimeCallback>();

export function subscribeRealtime(
  smartCaldaIds: string[],
  cb: RealtimeCallback
): () => void {
  const key = `${Date.now()}-${Math.random()}`;
  realtimeSubscribers.set(key, cb);

  if (realtimeInterval === null) {
    // A cada 2s, atualiza levemente valores analógicos e notifica assinantes
    realtimeInterval = window.setInterval(() => {
      mockPLCs.forEach((plc) => {
        plc.variables = plc.variables.map((v) => {
          if (v.tipo === "analogico" && v.endereco.startsWith("AI")) {
            return {
              ...v,
              valor: Number(v.valor) + (Math.random() - 0.5) * 2,
            };
          }
          return v;
        });
        const payload: RealtimeDataPayload = {
          smartCaldaId: plc.id,
          variables: plc.variables,
        };
        realtimeSubscribers.forEach((callback) => callback(payload));
      });
    }, 2000);
  }

  return () => {
    realtimeSubscribers.delete(key);
    if (realtimeSubscribers.size === 0 && realtimeInterval !== null) {
      window.clearInterval(realtimeInterval);
      realtimeInterval = null;
    }
  };
}



