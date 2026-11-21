export type ChangeDetectionMode = 'zone-js' | 'zoneless';

export type StrategyKind = 'eager' | 'on-push';

export type ZoneScenarioId = 'click' | 'timeout';

export type ZonelessScenarioId = 'local-signal' | 'shared-signal';

export type ChangeDetectionScenarioId = ZoneScenarioId | ZonelessScenarioId;

export interface ScenarioByMode {
  'zone-js': ZoneScenarioId;
  zoneless: ZonelessScenarioId;
}

export type SimulationProfile =
  | { readonly mode: 'zone-js'; readonly scenario: ZoneScenarioId }
  | { readonly mode: 'zoneless'; readonly scenario: ZonelessScenarioId };

export type TreeNodeId =
  | 'app'
  | 'dashboard'
  | 'sidebar'
  | 'counter'
  | 'stats'
  | 'profile'
  | 'alerts';

export type CdPhaseId = 'trigger' | 'schedule' | 'root' | 'branch' | 'leaf' | 'summary';

export type TraversalPhaseId = 'root' | 'branch' | 'leaf';

export type NodeVisualStatus =
  | 'idle'
  | 'triggered'
  | 'dirty'
  | 'traversal'
  | 'checking'
  | 'checked-wasted'
  | 'updated'
  | 'skipped'
  | 'stale';

export type EdgeVisualStatus = 'idle' | 'dirty' | 'traversal' | 'checking' | 'updated' | 'skipped';

export type PhaseThemeKey = 'info' | 'warning' | 'purple' | 'primary' | 'success' | 'error';

export type ScenarioButtonVariant = 'emerald' | 'rose' | 'gradient';

export interface TreeNodeDefinition {
  id: TreeNodeId;
  label: string;
  selector: string;
  parent: TreeNodeId | null;
  children: readonly TreeNodeId[];
  depth: 0 | 1 | 2;
}

export interface NodeRuntimeSnapshot {
  status: NodeVisualStatus;
  flagLabel: string;
  memoryValue: number;
  domValue: number;
  isTarget: boolean;
  granularityNote: string;
}

export interface TreeMetrics {
  checked: number;
  wasted: number;
  updated: number;
  skipped: number;
  traversalOnly: number;
  stale: number;
  total: number;
}

export interface TreeStepState {
  strategy: StrategyKind;
  nodes: Record<TreeNodeId, NodeRuntimeSnapshot>;
  edges: Record<TreeNodeId, EdgeVisualStatus>;
  metrics: TreeMetrics;
  summaryNote: string;
}

export interface CdDebugStep {
  phase: CdPhaseId;
  shortLabel: string;
  title: string;
  badgeText: string;
  themeKey: PhaseThemeKey;
  explanation: string;
  trees: Record<StrategyKind, TreeStepState>;
  staleAlert?: string;
}

export interface ScenarioOption<
  TScenario extends ChangeDetectionScenarioId = ChangeDetectionScenarioId,
> {
  id: TScenario;
  label: string;
  shortHint: string;
  buttonVariant: ScenarioButtonVariant;
}

export interface ModeMetadata<M extends ChangeDetectionMode = ChangeDetectionMode> {
  mode: M;
  title: string;
  subtitle: string;
  runtimeBadge: string;
  defaultScenario: ScenarioByMode[M];
  scenarios: readonly ScenarioOption<ScenarioByMode[M]>[];
}

export interface StatusVisualMeta {
  status: NodeVisualStatus;
  badgeLabel: string;
  cardClasses: string;
  badgeClasses: string;
  dotClass: string;
  legendLabel: string;
}

export interface PhaseThemeClasses {
  badge: string;
  dot: string;
}

export interface StrategyVisualMeta {
  strategy: StrategyKind;
  decoratorValue: string;
  pillClasses: string;
  dotClass: string;
}

export interface OnPushErrorLink {
  route: string;
  label: string;
}

export interface OnPushErrorCard {
  id: string;
  tag: string;
  title: string;
  analogy: string;
  symptom: string;
  fixHint: string;
  exampleLink?: OnPushErrorLink;
}

export interface ComparisonRow {
  id: string;
  mode: string;
  analogy: string;
  trigger: string;
  checkedScope: string;
  commonTrap: string;
}

export interface SummaryTextSegment {
  text: string;
  isCode?: boolean;
}

export interface SummaryLabCta {
  id: string;
  route: string;
  testId: string;
  badge: string;
  badgeClasses: string;
  title: string;
  segments: readonly SummaryTextSegment[];
}
