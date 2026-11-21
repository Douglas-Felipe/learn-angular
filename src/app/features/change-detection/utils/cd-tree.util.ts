import { SHARED_SIGNAL_PARTNER, TREE_NODE_IDS, TREE_NODES } from '../data/cd-tree.data';
import {
  EdgeVisualStatus,
  NodeRuntimeSnapshot,
  NodeVisualStatus,
  SimulationProfile,
  TreeMetrics,
  TreeNodeId,
} from '../interfaces/change-detection.interface';

const EDGE_STATUS_MAP: Partial<Record<NodeVisualStatus, EdgeVisualStatus>> = {
  dirty: 'dirty',
  traversal: 'traversal',
  checking: 'checking',
  'checked-wasted': 'checking',
  updated: 'updated',
  skipped: 'skipped',
};

export function getAncestors(nodeId: TreeNodeId): TreeNodeId[] {
  const ancestors: TreeNodeId[] = [];
  let currentParent = TREE_NODES[nodeId].parent;
  while (currentParent !== null) {
    ancestors.push(currentParent);
    currentParent = TREE_NODES[currentParent].parent;
  }
  return ancestors;
}

export function computeAncestorSet(targets: readonly TreeNodeId[]): Set<TreeNodeId> {
  const targetSet = new Set(targets);
  const ancestors = new Set<TreeNodeId>();
  for (const target of targets) {
    for (const ancestor of getAncestors(target)) {
      if (!targetSet.has(ancestor)) {
        ancestors.add(ancestor);
      }
    }
  }
  return ancestors;
}

export function resolveTargetNodes(
  profile: SimulationProfile,
  clickedNode: TreeNodeId
): TreeNodeId[] {
  if (profile.scenario === 'shared-signal') {
    return [clickedNode, SHARED_SIGNAL_PARTNER[clickedNode]];
  }
  return [clickedNode];
}

export function resolveEdgeStatus(childStatus: NodeVisualStatus): EdgeVisualStatus {
  return EDGE_STATUS_MAP[childStatus] ?? 'idle';
}

export function buildEdges(
  nodes: Record<TreeNodeId, NodeRuntimeSnapshot>
): Record<TreeNodeId, EdgeVisualStatus> {
  const edges = {} as Record<TreeNodeId, EdgeVisualStatus>;
  for (const id of TREE_NODE_IDS) {
    edges[id] = id === 'app' ? 'idle' : resolveEdgeStatus(nodes[id].status);
  }
  return edges;
}

export function computeTreeMetrics(nodes: Record<TreeNodeId, NodeRuntimeSnapshot>): TreeMetrics {
  let checked = 0;
  let wasted = 0;
  let updated = 0;
  let skipped = 0;
  let traversalOnly = 0;
  let stale = 0;

  for (const id of TREE_NODE_IDS) {
    const status = nodes[id].status;
    if (status === 'checking' || status === 'checked-wasted' || status === 'updated') {
      checked++;
    }
    if (status === 'checked-wasted') {
      wasted++;
    } else if (status === 'updated') {
      updated++;
    } else if (status === 'skipped') {
      skipped++;
    } else if (status === 'traversal') {
      traversalOnly++;
    } else if (status === 'stale') {
      stale++;
    }
  }

  return {
    checked,
    wasted,
    updated,
    skipped,
    traversalOnly,
    stale,
    total: TREE_NODE_IDS.length,
  };
}

export function buildNodeMap(
  resolver: (id: TreeNodeId) => NodeRuntimeSnapshot
): Record<TreeNodeId, NodeRuntimeSnapshot> {
  const map = {} as Record<TreeNodeId, NodeRuntimeSnapshot>;
  for (const id of TREE_NODE_IDS) {
    map[id] = resolver(id);
  }
  return map;
}

export function formatTargetLabels(targets: readonly TreeNodeId[]): string {
  return targets.map((id) => TREE_NODES[id].label).join(' + ');
}
