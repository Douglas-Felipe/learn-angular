import {
  NodeRuntimeSnapshot,
  TreeNodeId,
} from '../interfaces/change-detection.interface';
import {
  buildEdges,
  buildNodeMap,
  computeAncestorSet,
  computeTreeMetrics,
  formatTargetLabels,
  getAncestors,
  resolveEdgeStatus,
  resolveTargetNodes,
} from './cd-tree.util';

describe('cd-tree.util', () => {
  it('should resolve ancestors from node to root', () => {
    expect(getAncestors('app')).toEqual([]);
    expect(getAncestors('dashboard')).toEqual(['app']);
    expect(getAncestors('counter')).toEqual(['dashboard', 'app']);
    expect(getAncestors('profile')).toEqual(['sidebar', 'app']);
  });

  it('should compute ancestor set excluding nodes that are themselves targets', () => {
    expect(Array.from(computeAncestorSet(['counter']))).toEqual(['dashboard', 'app']);
    expect(Array.from(computeAncestorSet(['app', 'profile'])).sort()).toEqual(['sidebar']);
    expect(Array.from(computeAncestorSet(['dashboard', 'counter'])).sort()).toEqual(['app']);
  });

  it('should resolve target nodes based on simulation profile', () => {
    expect(resolveTargetNodes({ mode: 'zone-js', scenario: 'click' }, 'counter')).toEqual([
      'counter',
    ]);
    expect(resolveTargetNodes({ mode: 'zone-js', scenario: 'timeout' }, 'profile')).toEqual([
      'profile',
    ]);
    expect(resolveTargetNodes({ mode: 'zoneless', scenario: 'local-signal' }, 'stats')).toEqual([
      'stats',
    ]);
    expect(
      resolveTargetNodes({ mode: 'zoneless', scenario: 'shared-signal' }, 'counter')
    ).toEqual(['counter', 'profile']);
    expect(resolveTargetNodes({ mode: 'zoneless', scenario: 'shared-signal' }, 'app')).toEqual([
      'app',
      'profile',
    ]);
  });

  it('should map every NodeVisualStatus to the expected EdgeVisualStatus', () => {
    expect(resolveEdgeStatus('idle')).toBe('idle');
    expect(resolveEdgeStatus('triggered')).toBe('idle');
    expect(resolveEdgeStatus('stale')).toBe('idle');
    expect(resolveEdgeStatus('dirty')).toBe('dirty');
    expect(resolveEdgeStatus('traversal')).toBe('traversal');
    expect(resolveEdgeStatus('checking')).toBe('checking');
    expect(resolveEdgeStatus('checked-wasted')).toBe('checking');
    expect(resolveEdgeStatus('updated')).toBe('updated');
    expect(resolveEdgeStatus('skipped')).toBe('skipped');
  });

  it('should build node maps, edges keeping root idle, metrics, and formatted labels', () => {
    const base: NodeRuntimeSnapshot = {
      status: 'idle',
      flagLabel: '',
      memoryValue: 1,
      domValue: 1,
      isTarget: false,
      granularityNote: '',
    };

    const statusByNode: Record<TreeNodeId, NodeRuntimeSnapshot['status']> = {
      app: 'traversal',
      dashboard: 'checking',
      sidebar: 'checked-wasted',
      counter: 'updated',
      stats: 'skipped',
      profile: 'stale',
      alerts: 'dirty',
    };

    const nodes = buildNodeMap((id) => ({
      ...base,
      status: statusByNode[id],
      isTarget: id === 'counter' || id === 'profile',
    }));

    expect(buildEdges(nodes)).toEqual({
      app: 'idle',
      dashboard: 'checking',
      sidebar: 'checking',
      counter: 'updated',
      stats: 'skipped',
      profile: 'idle',
      alerts: 'dirty',
    });

    expect(computeTreeMetrics(nodes)).toEqual({
      checked: 3,
      wasted: 1,
      updated: 1,
      skipped: 1,
      traversalOnly: 1,
      stale: 1,
      total: 7,
    });

    expect(formatTargetLabels(['counter'])).toBe('Counter');
    expect(formatTargetLabels(['counter', 'profile'])).toBe('Counter + Profile');
  });
});
