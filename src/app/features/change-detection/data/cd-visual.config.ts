import {
  ChangeDetectionMode,
  EdgeVisualStatus,
  ModeMetadata,
  NodeVisualStatus,
  PhaseThemeClasses,
  PhaseThemeKey,
  ScenarioButtonVariant,
  StatusVisualMeta,
  StrategyKind,
  StrategyVisualMeta,
} from '../interfaces/change-detection.interface';

export const MODE_METADATA: { readonly [M in ChangeDetectionMode]: ModeMetadata<M> } = {
  'zone-js': {
    mode: 'zone-js',
    title: 'Detecção de Mudanças • Zone.js',
    subtitle:
      'Angular clássico com Zone.js interceptando eventos assíncronos e disparando ApplicationRef.tick() a partir da raiz. Compare Eager vs OnPush na mesma árvore.',
    runtimeBadge: 'Zone.js (Clássico)',
    defaultScenario: 'click',
    scenarios: [
      {
        id: 'click',
        label: 'Evento (click)',
        shortHint: 'markViewDirty sobe até a raiz',
        buttonVariant: 'emerald',
      },
      {
        id: 'timeout',
        label: 'setTimeout (sem markForCheck)',
        shortHint: 'Tick global sem marcar OnPush',
        buttonVariant: 'rose',
      },
    ],
  },
  zoneless: {
    mode: 'zoneless',
    title: 'Detecção de Mudanças • Zoneless + Signals',
    subtitle:
      'Angular v22 sem Zone.js: Signals notificam apenas as views consumidoras via marcação direcionada, evitando percorrer ou reavaliar componentes intactos.',
    runtimeBadge: 'Zoneless + Signals (v22)',
    defaultScenario: 'local-signal',
    scenarios: [
      {
        id: 'local-signal',
        label: 'signal.update() local',
        shortHint: 'Atualiza só a view consumidora',
        buttonVariant: 'emerald',
      },
      {
        id: 'shared-signal',
        label: 'Signal compartilhado (Serviço)',
        shortHint: 'Atualiza 2 nós em ramos distintos',
        buttonVariant: 'gradient',
      },
    ],
  },
};

export const STRATEGY_META: Record<StrategyKind, StrategyVisualMeta> = {
  eager: {
    strategy: 'eager',
    decoratorValue: 'ChangeDetectionStrategy.Eager',
    pillClasses: 'border-ng-warning/50 bg-ng-warning/15 text-ng-warning',
    dotClass: 'bg-ng-warning',
  },
  'on-push': {
    strategy: 'on-push',
    decoratorValue: 'ChangeDetectionStrategy.OnPush',
    pillClasses: 'border-ng-purple/50 bg-ng-purple/15 text-ng-purple',
    dotClass: 'bg-ng-purple',
  },
};

export const SCENARIO_VARIANT_CLASSES: Record<ScenarioButtonVariant, string> = {
  emerald: 'cyber-button-emerald',
  rose: 'cyber-button-rose',
  gradient: 'cyber-button-gradient',
};

export const STATUS_VISUAL_META: Record<NodeVisualStatus, StatusVisualMeta> = {
  idle: {
    status: 'idle',
    badgeLabel: 'Limpo',
    cardClasses: 'border-ng-border bg-ng-bg text-ng-text-muted',
    badgeClasses: 'border-ng-border bg-ng-surface text-ng-text-subtle',
    dotClass: 'bg-zinc-400 dark:bg-zinc-500',
    legendLabel: 'Intacto (Clean)',
  },
  triggered: {
    status: 'triggered',
    badgeLabel: 'Origem',
    cardClasses: 'border-ng-info bg-ng-info/15 text-ng-text',
    badgeClasses: 'border-ng-info/50 bg-ng-info/20 text-ng-info',
    dotClass: 'bg-ng-info',
    legendLabel: 'Evento / Mutação',
  },
  dirty: {
    status: 'dirty',
    badgeLabel: 'Dirty',
    cardClasses: 'border-ng-warning bg-ng-warning/15 text-ng-text',
    badgeClasses: 'border-ng-warning/50 bg-ng-warning/20 text-ng-warning',
    dotClass: 'bg-ng-warning',
    legendLabel: 'Marcado Dirty',
  },
  traversal: {
    status: 'traversal',
    badgeLabel: 'Passa direto',
    cardClasses: 'border-ng-purple/60 border-dashed bg-ng-purple/10 text-ng-text',
    badgeClasses: 'border-ng-purple/40 bg-ng-purple/15 text-ng-purple',
    dotClass: 'bg-ng-purple',
    legendLabel: 'Traversal (sem check)',
  },
  checking: {
    status: 'checking',
    badgeLabel: 'Verificando',
    cardClasses: 'border-ng-primary bg-ng-primary/15 text-ng-text',
    badgeClasses: 'border-ng-primary/50 bg-ng-primary/20 text-ng-primary',
    dotClass: 'bg-ng-primary',
    legendLabel: 'Verificando template',
  },
  'checked-wasted': {
    status: 'checked-wasted',
    badgeLabel: 'Re-check',
    cardClasses: 'border-ng-warning/70 bg-ng-warning/10 text-ng-text',
    badgeClasses: 'border-ng-warning/40 bg-ng-warning/15 text-ng-warning',
    dotClass: 'bg-ng-warning',
    legendLabel: 'Verificado sem mudança',
  },
  updated: {
    status: 'updated',
    badgeLabel: 'Atualizado',
    cardClasses: 'border-ng-success bg-ng-success/15 text-ng-text',
    badgeClasses: 'border-ng-success/50 bg-ng-success/20 text-ng-success',
    dotClass: 'bg-ng-success',
    legendLabel: 'DOM atualizado',
  },
  skipped: {
    status: 'skipped',
    badgeLabel: 'Pulado',
    cardClasses: 'border-ng-border/70 border-dashed bg-ng-bg/60 text-ng-text-subtle opacity-65',
    badgeClasses: 'border-ng-border bg-ng-surface text-ng-text-subtle',
    dotClass: 'bg-zinc-400 dark:bg-zinc-600',
    legendLabel: 'Pulado (subárvore podada)',
  },
  stale: {
    status: 'stale',
    badgeLabel: 'Dessincronizado',
    cardClasses: 'border-ng-error bg-ng-error/15 text-ng-text',
    badgeClasses: 'border-ng-error/50 bg-ng-error/20 text-ng-error',
    dotClass: 'bg-ng-error',
    legendLabel: 'Memória != DOM (stale)',
  },
};

export const PHASE_THEME_CLASSES: Record<PhaseThemeKey, PhaseThemeClasses> = {
  info: {
    badge: 'border-2 border-ng-info bg-ng-info/20 text-ng-info',
    dot: 'bg-ng-info',
  },
  warning: {
    badge: 'border-2 border-ng-warning bg-ng-warning/20 text-ng-warning',
    dot: 'bg-ng-warning',
  },
  purple: {
    badge: 'border-2 border-ng-purple bg-ng-purple/20 text-ng-purple',
    dot: 'bg-ng-purple',
  },
  primary: {
    badge: 'border-2 border-ng-primary bg-ng-primary/20 text-ng-primary',
    dot: 'bg-ng-primary',
  },
  success: {
    badge: 'border-2 border-ng-success bg-ng-success/20 text-ng-success',
    dot: 'bg-ng-success',
  },
  error: {
    badge: 'border-2 border-ng-error bg-ng-error/20 text-ng-error',
    dot: 'bg-ng-error',
  },
};

export const EDGE_CLASSES: Record<EdgeVisualStatus, string> = {
  idle: 'border-ng-border',
  dirty: 'border-ng-warning',
  traversal: 'border-ng-purple border-dashed',
  checking: 'border-ng-primary',
  updated: 'border-ng-success',
  skipped: 'border-ng-border/50 border-dashed opacity-50',
};

export const LEGEND_STATUS_ORDER: Record<ChangeDetectionMode, readonly NodeVisualStatus[]> = {
  'zone-js': [
    'triggered',
    'dirty',
    'checking',
    'checked-wasted',
    'updated',
    'skipped',
    'stale',
  ],
  zoneless: ['triggered', 'dirty', 'traversal', 'checked-wasted', 'updated', 'skipped'],
};
