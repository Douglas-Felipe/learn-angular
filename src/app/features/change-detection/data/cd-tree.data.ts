import {
  CdPhaseId,
  TraversalPhaseId,
  TreeNodeDefinition,
  TreeNodeId,
} from '../interfaces/change-detection.interface';

export const PLAYBACK_INTERVAL_MS = 1300;
export const ROOT_NODE_ID: TreeNodeId = 'app';
export const DEFAULT_TARGET_NODE: TreeNodeId = 'counter';
export const INITIAL_NODE_VALUE = 1;

export const TREE_NODE_IDS: readonly TreeNodeId[] = [
  'app',
  'dashboard',
  'sidebar',
  'counter',
  'stats',
  'profile',
  'alerts',
];

export const LEAF_NODE_IDS: readonly TreeNodeId[] = ['counter', 'stats', 'profile', 'alerts'];

export const TREE_NODES: Record<TreeNodeId, TreeNodeDefinition> = {
  app: {
    id: 'app',
    label: 'AppRoot',
    selector: 'app-root',
    parent: null,
    children: ['dashboard', 'sidebar'],
    depth: 0,
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    selector: 'app-dashboard',
    parent: 'app',
    children: ['counter', 'stats'],
    depth: 1,
  },
  sidebar: {
    id: 'sidebar',
    label: 'Sidebar',
    selector: 'app-sidebar-panel',
    parent: 'app',
    children: ['profile', 'alerts'],
    depth: 1,
  },
  counter: {
    id: 'counter',
    label: 'Counter',
    selector: 'app-counter',
    parent: 'dashboard',
    children: [],
    depth: 2,
  },
  stats: {
    id: 'stats',
    label: 'Stats',
    selector: 'app-stats',
    parent: 'dashboard',
    children: [],
    depth: 2,
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    selector: 'app-profile',
    parent: 'sidebar',
    children: [],
    depth: 2,
  },
  alerts: {
    id: 'alerts',
    label: 'Alerts',
    selector: 'app-alerts',
    parent: 'sidebar',
    children: [],
    depth: 2,
  },
};

export const SHARED_SIGNAL_PARTNER: Record<TreeNodeId, TreeNodeId> = {
  counter: 'profile',
  stats: 'alerts',
  profile: 'counter',
  alerts: 'stats',
  dashboard: 'sidebar',
  sidebar: 'dashboard',
  app: 'profile',
};

export const CD_PHASES: readonly CdPhaseId[] = [
  'trigger',
  'schedule',
  'root',
  'branch',
  'leaf',
  'summary',
];

export const PHASE_SHORT_LABELS: Record<CdPhaseId, string> = {
  trigger: '1. Gatilho',
  schedule: '2. Marcação',
  root: '3. Raiz',
  branch: '4. Ramos',
  leaf: '5. Folhas',
  summary: '6. Resumo',
};

export const PHASE_DEPTH: Record<TraversalPhaseId, 0 | 1 | 2> = {
  root: 0,
  branch: 1,
  leaf: 2,
};
