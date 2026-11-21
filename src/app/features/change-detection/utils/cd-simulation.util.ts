import {
  CD_PHASES,
  LEAF_NODE_IDS,
  PHASE_DEPTH,
  PHASE_SHORT_LABELS,
  ROOT_NODE_ID,
  TREE_NODE_IDS,
  TREE_NODES,
} from '../data/cd-tree.data';
import {
  CdDebugStep,
  CdPhaseId,
  ChangeDetectionMode,
  ChangeDetectionScenarioId,
  NodeRuntimeSnapshot,
  NodeVisualStatus,
  PhaseThemeKey,
  SimulationProfile,
  StrategyKind,
  TreeMetrics,
  TreeNodeId,
  TreeStepState,
} from '../interfaces/change-detection.interface';
import {
  buildEdges,
  buildNodeMap,
  computeAncestorSet,
  computeTreeMetrics,
  formatTargetLabels,
  resolveTargetNodes,
} from './cd-tree.util';

const GRANULARITY_NOTES = {
  eager: 'Template inteiro avaliado (Eager)',
  zoneOnPush: 'Template inteiro reavaliado (Zone.js)',
  timeoutOnPush: 'Sem markForCheck() — template congelado',
  zonelessOnPush: 'Cirúrgico: apenas {{ count() }} atualizado',
} as const;

type SimulationProfileKey = 'zone-click' | 'zone-timeout' | 'zoneless';

interface SimulationContext {
  readonly profile: SimulationProfile;
  readonly targets: readonly TreeNodeId[];
  readonly targetSet: ReadonlySet<TreeNodeId>;
  readonly ancestorSet: ReadonlySet<TreeNodeId>;
  readonly targetLabels: string;
  readonly prevValue: number;
  readonly nextValue: number;
  readonly totalNodes: number;
  readonly totalLeaves: number;
  readonly targetLeafCount: number;
}

interface StepPhaseMeta {
  readonly title: string;
  readonly badgeText: string;
  readonly themeKey: PhaseThemeKey;
  readonly explanation: string;
  readonly staleAlert?: string;
}

interface ProfileStrategy {
  buildOnPushNodes(
    ctx: SimulationContext,
    phase: CdPhaseId
  ): Record<TreeNodeId, NodeRuntimeSnapshot>;
  buildOnPushSummaryNote(ctx: SimulationContext, phase: CdPhaseId, metrics: TreeMetrics): string;
  buildPhaseMeta(
    ctx: SimulationContext,
    phase: CdPhaseId,
    eagerMetrics: TreeMetrics,
    onPushMetrics: TreeMetrics
  ): StepPhaseMeta;
}

function createNodeSnapshot(
  ctx: SimulationContext,
  id: TreeNodeId,
  status: NodeVisualStatus,
  flagLabel: string,
  domSynced: boolean,
  granularityNote: string
): NodeRuntimeSnapshot {
  const isTarget = ctx.targetSet.has(id);
  return {
    status,
    flagLabel,
    memoryValue: isTarget ? ctx.nextValue : ctx.prevValue,
    domValue: domSynced && isTarget ? ctx.nextValue : ctx.prevValue,
    isTarget,
    granularityNote,
  };
}

function makeTreeState(
  strategy: StrategyKind,
  nodes: Record<TreeNodeId, NodeRuntimeSnapshot>,
  summaryNote: string,
  metrics: TreeMetrics
): TreeStepState {
  return {
    strategy,
    nodes,
    edges: buildEdges(nodes),
    metrics,
    summaryNote,
  };
}

function buildStaleAlert(ctx: SimulationContext): string {
  return `Bug clássico do OnPush + Zone.js: setTimeout() mudou a memória de ${ctx.targetLabels} para ${ctx.nextValue}, mas o DOM ficou travado em ${ctx.prevValue} porque faltou chamar ChangeDetectorRef.markForCheck() (ou usar Signal).`;
}

function resolveEagerPendingSnapshot(
  ctx: SimulationContext,
  id: TreeNodeId,
  isSchedulePhase: boolean
): NodeRuntimeSnapshot {
  const isZoneless = ctx.profile.mode === 'zoneless';
  const isTarget = ctx.targetSet.has(id);
  const isAncestor = ctx.ancestorSet.has(id);

  let status: NodeVisualStatus = 'idle';
  let flagLabel = isZoneless
    ? 'CheckAlways (Eager)'
    : isSchedulePhase
      ? 'Será verificado (Eager)'
      : 'Aguardando descida';

  if (isTarget) {
    status = 'dirty';
    flagLabel = isZoneless
      ? 'RefreshView'
      : isSchedulePhase
        ? 'Evento na Zone'
        : 'Dirty';
  } else if (isZoneless && isAncestor) {
    status = 'traversal';
    flagLabel = 'HasChildViews';
  }

  return createNodeSnapshot(ctx, id, status, flagLabel, false, GRANULARITY_NOTES.eager);
}

function buildEagerNodes(
  ctx: SimulationContext,
  phase: CdPhaseId
): Record<TreeNodeId, NodeRuntimeSnapshot> {
  return buildNodeMap((id) => {
    const def = TREE_NODES[id];
    const isTarget = ctx.targetSet.has(id);

    if (phase === 'trigger') {
      const triggerLabel =
        ctx.profile.mode === 'zoneless'
          ? 'signal.update()'
          : ctx.profile.scenario === 'timeout'
            ? 'setTimeout()'
            : 'Evento (click)';
      return createNodeSnapshot(
        ctx,
        id,
        isTarget ? 'triggered' : 'idle',
        isTarget ? triggerLabel : 'Aguardando',
        false,
        GRANULARITY_NOTES.eager
      );
    }

    if (phase === 'schedule') {
      return resolveEagerPendingSnapshot(ctx, id, true);
    }

    if (phase === 'summary') {
      return createNodeSnapshot(
        ctx,
        id,
        isTarget ? 'updated' : 'checked-wasted',
        isTarget ? 'DOM atualizado' : 'Re-check desnecessário',
        true,
        GRANULARITY_NOTES.eager
      );
    }

    const phaseDepth = PHASE_DEPTH[phase];

    if (def.depth < phaseDepth) {
      return createNodeSnapshot(
        ctx,
        id,
        isTarget ? 'updated' : 'checked-wasted',
        isTarget ? 'DOM atualizado' : 'Verificado s/ mudança',
        true,
        GRANULARITY_NOTES.eager
      );
    }

    if (def.depth === phaseDepth) {
      return createNodeSnapshot(
        ctx,
        id,
        isTarget ? 'updated' : 'checking',
        isTarget ? 'DOM atualizado' : 'Verificando template',
        true,
        GRANULARITY_NOTES.eager
      );
    }

    return resolveEagerPendingSnapshot(ctx, id, false);
  });
}

function buildEagerSummaryNote(
  ctx: SimulationContext,
  phase: CdPhaseId,
  metrics: TreeMetrics
): string {
  switch (phase) {
    case 'summary':
      return `Eager verificou ${metrics.checked}/${metrics.total} componentes para atualizar ${ctx.targetLabels} (${metrics.wasted} re-checks sem mudança).`;
    case 'trigger':
      return `Mudança iniciada em ${ctx.targetLabels}; Eager ainda não iniciou a travessia.`;
    case 'schedule':
      return ctx.profile.mode === 'zone-js'
        ? 'Zone.js dispara tick() global; componentes Eager são marcados para verificação irrestrita.'
        : 'Signal notificou mudança, mas componentes Eager ignoram a poda e verificam toda a árvore.';
    default:
      return 'Travessia CheckAlways percorrendo todos os nós nível a nível, independente de quem mudou.';
  }
}

function resolveZoneClickPendingSnapshot(
  ctx: SimulationContext,
  id: TreeNodeId
): NodeRuntimeSnapshot {
  const isTarget = ctx.targetSet.has(id);
  const isAncestor = ctx.ancestorSet.has(id);
  return createNodeSnapshot(
    ctx,
    id,
    isTarget || isAncestor ? 'dirty' : 'idle',
    isTarget ? 'Dirty (alvo)' : isAncestor ? 'Dirty (ancestral)' : 'Clean',
    false,
    GRANULARITY_NOTES.zoneOnPush
  );
}

const ZONE_CLICK_STRATEGY: ProfileStrategy = {
  buildOnPushNodes(ctx, phase) {
    return buildNodeMap((id) => {
      const def = TREE_NODES[id];
      const isTarget = ctx.targetSet.has(id);
      const isAncestor = ctx.ancestorSet.has(id);

      if (phase === 'trigger') {
        return createNodeSnapshot(
          ctx,
          id,
          isTarget ? 'triggered' : 'idle',
          isTarget ? 'Evento (click)' : 'Clean',
          false,
          GRANULARITY_NOTES.zoneOnPush
        );
      }

      if (phase === 'schedule') {
        return resolveZoneClickPendingSnapshot(ctx, id);
      }

      if (phase === 'summary') {
        return createNodeSnapshot(
          ctx,
          id,
          isTarget ? 'updated' : isAncestor ? 'checked-wasted' : 'skipped',
          isTarget
            ? 'DOM atualizado'
            : isAncestor
              ? 'Re-check p/ propagar'
              : 'Pulado (Clean)',
          true,
          GRANULARITY_NOTES.zoneOnPush
        );
      }

      const phaseDepth = PHASE_DEPTH[phase];

      if (def.depth < phaseDepth) {
        return createNodeSnapshot(
          ctx,
          id,
          isTarget ? 'updated' : isAncestor ? 'checked-wasted' : 'skipped',
          isTarget
            ? 'DOM atualizado'
            : isAncestor
              ? 'Ancestral verificado'
              : 'Pulado (Clean)',
          true,
          GRANULARITY_NOTES.zoneOnPush
        );
      }

      if (def.depth === phaseDepth) {
        return createNodeSnapshot(
          ctx,
          id,
          isTarget ? 'updated' : isAncestor ? 'checking' : 'skipped',
          isTarget
            ? 'DOM atualizado'
            : isAncestor
              ? 'Verificando ancestral Dirty'
              : 'Pulado (Clean)',
          true,
          GRANULARITY_NOTES.zoneOnPush
        );
      }

      return resolveZoneClickPendingSnapshot(ctx, id);
    });
  },

  buildOnPushSummaryNote(ctx, phase, metrics) {
    if (phase === 'summary') {
      return `OnPush (Zone.js) verificou ${metrics.checked}/${metrics.total} componentes (alvo + ancestrais Dirty) e pulou ${metrics.skipped} Clean.`;
    }
    if (phase === 'schedule') {
      return `markViewDirty() subiu de ${ctx.targetLabels} até a raiz marcando todos os ancestrais como Dirty.`;
    }
    return 'Descida entra apenas nos nós Dirty e poda subárvores Clean.';
  },

  buildPhaseMeta(ctx, phase, eagerMetrics, onPushMetrics) {
    switch (phase) {
      case 'trigger':
        return {
          title: `Evento (click) em ${ctx.targetLabels}`,
          badgeText: '(click)',
          themeKey: 'info',
          explanation: `Um evento (click) no template de ${ctx.targetLabels} alterou count em memória de ${ctx.prevValue} para ${ctx.nextValue}. O DOM ainda exibe ${ctx.prevValue}.`,
        };
      case 'schedule':
        return {
          title: 'markViewDirty() vs Tick Global',
          badgeText: 'markViewDirty()',
          themeKey: 'warning',
          explanation: `No Zone.js clássico, markViewDirty() no OnPush sobe de ${ctx.targetLabels} até a raiz marcando todos os ancestrais como Dirty. No Eager, a árvore inteira será percorrida.`,
        };
      case 'root': {
        const rootIsTarget = ctx.targetSet.has(ROOT_NODE_ID);
        return {
          title: 'Travessia na Raiz (AppRoot)',
          badgeText: 'Nível 0 • AppRoot',
          themeKey: 'primary',
          explanation: rootIsTarget
            ? 'Eager verifica AppRoot (CheckAlways). No OnPush com click, AppRoot é o próprio alvo marcado Dirty e tem seu template reavaliado.'
            : 'Eager verifica AppRoot (CheckAlways). No OnPush com click, AppRoot foi marcada como Dirty pelo filho e também precisa ser reavaliada.',
        };
      }
      case 'branch':
        return {
          title: 'Nível 1 • Dashboard e Sidebar',
          badgeText: 'Nível 1 • Ramos',
          themeKey: 'primary',
          explanation:
            'Eager entra em Dashboard e Sidebar. OnPush verifica apenas o ramo ancestral marcado Dirty e poda o ramo irmão Clean.',
        };
      case 'leaf':
        return {
          title: 'Nível 2 • Componentes Folha & DOM',
          badgeText: 'Nível 2 • Folhas',
          themeKey: 'success',
          explanation: `Eager checa todas as ${ctx.totalLeaves} folhas e atualiza ${ctx.targetLabels}. OnPush reavalia o template inteiro de ${ctx.targetLabels} e pula os demais nós Clean.`,
        };
      case 'summary':
        return {
          title: 'Resultado da Comparação',
          badgeText: 'Ciclo Concluído',
          themeKey: 'success',
          explanation: `Resumo: Eager checou ${eagerMetrics.checked}/${eagerMetrics.total} nós (${eagerMetrics.wasted} desperdícios). OnPush + Zone.js checou ${onPushMetrics.checked}/${onPushMetrics.total} (precisou re-checar ${onPushMetrics.wasted} ancestral(is)) e pulou ${onPushMetrics.skipped}.`,
        };
    }
  },
};

const ZONE_TIMEOUT_STRATEGY: ProfileStrategy = {
  buildOnPushNodes(ctx, phase) {
    return buildNodeMap((id) => {
      const def = TREE_NODES[id];
      const isTarget = ctx.targetSet.has(id);

      if (phase === 'trigger') {
        return createNodeSnapshot(
          ctx,
          id,
          isTarget ? 'triggered' : 'idle',
          isTarget ? 'setTimeout() mutou estado' : 'Clean',
          false,
          GRANULARITY_NOTES.timeoutOnPush
        );
      }

      if (phase === 'schedule') {
        return createNodeSnapshot(
          ctx,
          id,
          isTarget ? 'stale' : 'idle',
          isTarget ? 'Sem markForCheck!' : 'Clean (não marcado)',
          false,
          GRANULARITY_NOTES.timeoutOnPush
        );
      }

      if (phase === 'summary') {
        return createNodeSnapshot(
          ctx,
          id,
          isTarget ? 'stale' : 'skipped',
          isTarget ? 'DOM dessincronizado!' : 'Pulado (OnPush Clean)',
          false,
          GRANULARITY_NOTES.timeoutOnPush
        );
      }

      const phaseDepth = PHASE_DEPTH[phase];
      if (isTarget) {
        return createNodeSnapshot(
          ctx,
          id,
          'stale',
          def.depth <= phaseDepth ? 'Ignorado (Clean!)' : 'Sem markForCheck!',
          false,
          GRANULARITY_NOTES.timeoutOnPush
        );
      }

      return createNodeSnapshot(
        ctx,
        id,
        def.depth <= phaseDepth ? 'skipped' : 'idle',
        def.depth <= phaseDepth ? 'Pulado (OnPush Clean)' : 'Clean',
        false,
        GRANULARITY_NOTES.timeoutOnPush
      );
    });
  },

  buildOnPushSummaryNote(ctx, phase) {
    if (phase === 'trigger') {
      return `setTimeout() alterou o estado em memória de ${ctx.targetLabels}, mas nenhum evento de template foi disparado.`;
    }
    if (phase === 'schedule') {
      return 'Zone.js agendou tick(), porém ninguém chamou markForCheck(): todos os nós seguem Clean.';
    }
    return `OnPush pulou a subárvore sem verificar ${ctx.targetLabels}: memória=${ctx.nextValue}, DOM congelado em ${ctx.prevValue}.`;
  },

  buildPhaseMeta(ctx, phase, eagerMetrics, onPushMetrics) {
    switch (phase) {
      case 'trigger':
        return {
          title: `setTimeout() altera estado em ${ctx.targetLabels}`,
          badgeText: 'setTimeout()',
          themeKey: 'info',
          explanation: `Dentro de setTimeout(), a propriedade count de ${ctx.targetLabels} mudou em memória para ${ctx.nextValue}. O Zone.js interceptou o timer assíncrono.`,
        };
      case 'schedule':
        return {
          title: 'Zone.js dispara tick() sem markForCheck()',
          badgeText: 'Sem markForCheck',
          themeKey: 'error',
          explanation:
            'Zone.js dispara ApplicationRef.tick(). Componentes Eager são checados sempre, mas no OnPush ninguém chamou markForCheck() — toda a árvore permanece Clean!',
        };
      case 'root':
        return {
          title: 'Travessia na Raiz (AppRoot)',
          badgeText: 'Nível 0 • AppRoot',
          themeKey: 'primary',
          explanation: `Eager entra em AppRoot normalmente. Já no OnPush, AppRoot está Clean e toda a árvore é pulada — deixando ${ctx.targetLabels} dessincronizado!`,
          staleAlert: buildStaleAlert(ctx),
        };
      case 'branch':
        return {
          title: 'Nível 1 • Dashboard e Sidebar',
          badgeText: 'Nível 1 • Ramos',
          themeKey: 'primary',
          explanation: `Eager verifica Dashboard e Sidebar. OnPush mantém todos os ramos pulados enquanto ${ctx.targetLabels} continua dessincronizado.`,
          staleAlert: buildStaleAlert(ctx),
        };
      case 'leaf':
        return {
          title: 'Nível 2 • Componentes Folha & DOM',
          badgeText: 'Nível 2 • Folhas',
          themeKey: 'error',
          explanation: `Eager atualiza ${ctx.targetLabels} para ${ctx.nextValue} após checar todas as folhas. OnPush pulou ${ctx.targetLabels}, mantendo o DOM antigo (${ctx.prevValue}).`,
          staleAlert: buildStaleAlert(ctx),
        };
      case 'summary':
        return {
          title: 'Resultado da Comparação',
          badgeText: 'Dessincronizado (OnPush)',
          themeKey: 'error',
          explanation: `Resumo: Eager checou ${eagerMetrics.checked}/${eagerMetrics.total} nós e atualizou ${ctx.targetLabels}. OnPush checou ${onPushMetrics.checked}/${onPushMetrics.total} nós e ficou dessincronizado por falta de markForCheck().`,
          staleAlert: buildStaleAlert(ctx),
        };
    }
  },
};

function resolveZonelessPendingSnapshot(
  ctx: SimulationContext,
  id: TreeNodeId
): NodeRuntimeSnapshot {
  const isTarget = ctx.targetSet.has(id);
  const isAncestor = ctx.ancestorSet.has(id);
  return createNodeSnapshot(
    ctx,
    id,
    isTarget ? 'dirty' : isAncestor ? 'traversal' : 'idle',
    isTarget ? 'RefreshView' : isAncestor ? 'HasChildViews' : 'Clean',
    false,
    GRANULARITY_NOTES.zonelessOnPush
  );
}

const ZONELESS_STRATEGY: ProfileStrategy = {
  buildOnPushNodes(ctx, phase) {
    return buildNodeMap((id) => {
      const def = TREE_NODES[id];
      const isTarget = ctx.targetSet.has(id);
      const isAncestor = ctx.ancestorSet.has(id);

      if (phase === 'trigger') {
        const triggerLabel =
          ctx.profile.scenario === 'shared-signal'
            ? 'Service signal.update()'
            : 'signal.update()';
        return createNodeSnapshot(
          ctx,
          id,
          isTarget ? 'triggered' : 'idle',
          isTarget ? triggerLabel : 'Clean',
          false,
          GRANULARITY_NOTES.zonelessOnPush
        );
      }

      if (phase === 'schedule') {
        return resolveZonelessPendingSnapshot(ctx, id);
      }

      if (phase === 'summary') {
        return createNodeSnapshot(
          ctx,
          id,
          isTarget ? 'updated' : isAncestor ? 'traversal' : 'skipped',
          isTarget
            ? 'DOM atualizado'
            : isAncestor
              ? 'Atravessado s/ check'
              : 'Ignorado (Clean)',
          true,
          GRANULARITY_NOTES.zonelessOnPush
        );
      }

      const phaseDepth = PHASE_DEPTH[phase];

      if (def.depth <= phaseDepth) {
        return createNodeSnapshot(
          ctx,
          id,
          isTarget ? 'updated' : isAncestor ? 'traversal' : 'skipped',
          isTarget
            ? 'Binding do signal atualizado'
            : isAncestor
              ? 'Passa direto (sem check)'
              : 'Ignorado (Clean)',
          true,
          GRANULARITY_NOTES.zonelessOnPush
        );
      }

      return resolveZonelessPendingSnapshot(ctx, id);
    });
  },

  buildOnPushSummaryNote(ctx, phase, metrics) {
    if (phase === 'summary') {
      return `Zoneless + OnPush verificou apenas ${metrics.checked}/${metrics.total} componente(s) (${ctx.targetLabels}) — 0 re-checks desperdiçados!`;
    }
    if (phase === 'schedule') {
      return `Signal marcou ${ctx.targetLabels} com RefreshView e os ancestrais apenas com HasChildViews (sem sujar templates pais).`;
    }
    return 'Local Change Detection: ancestrais são apenas atravessados sem executar dirty check.';
  },

  buildPhaseMeta(ctx, phase, eagerMetrics, onPushMetrics) {
    switch (phase) {
      case 'trigger':
        return {
          title: `Signal atualizado em ${ctx.targetLabels}`,
          badgeText: 'signal.update()',
          themeKey: 'info',
          explanation: `O valor em memória de ${ctx.targetLabels} mudou de ${ctx.prevValue} para ${ctx.nextValue} via signal.update(). O DOM ainda exibe ${ctx.prevValue}.`,
        };
      case 'schedule':
        return {
          title: 'Notificação direcionada do Signal',
          badgeText: 'RefreshView',
          themeKey: 'warning',
          explanation: `No OnPush (padrão v22), o Signal marca apenas ${ctx.targetLabels} com RefreshView e sinaliza ancestrais com HasChildViewsToRefresh (apenas travessia). No Eager, todos os ${ctx.totalNodes} nós serão checados.`,
        };
      case 'root':
        return {
          title: 'Travessia na Raiz (AppRoot)',
          badgeText: 'Nível 0 • AppRoot',
          themeKey: 'purple',
          explanation:
            'Eager verifica AppRoot mesmo que ela não leia o Signal. No OnPush + Zoneless, se AppRoot não for alvo, o Angular passa direto (Traversal) sem reavaliar o template da raiz.',
        };
      case 'branch':
        return {
          title: 'Nível 1 • Dashboard e Sidebar',
          badgeText: 'Nível 1 • Ramos',
          themeKey: 'primary',
          explanation: `Eager verifica Dashboard e Sidebar sem necessidade. OnPush + Zoneless atravessa somente o(s) ramo(s) que levam a ${ctx.targetLabels} (sem reavaliar templates) e ignora o restante.`,
        };
      case 'leaf': {
        const unchangedLeaves = ctx.totalLeaves - ctx.targetLeafCount;
        return {
          title: 'Nível 2 • Componentes Folha & DOM',
          badgeText: 'Nível 2 • Folhas',
          themeKey: 'success',
          explanation: `Eager reavalia as ${ctx.totalLeaves} folhas (${unchangedLeaves} sem mudança). OnPush + Zoneless atualiza cirurgicamente apenas ${ctx.targetLabels} onde o Signal é lido no template.`,
        };
      }
      case 'summary':
        return {
          title: 'Resultado da Comparação',
          badgeText: 'Ciclo Concluído',
          themeKey: 'success',
          explanation: `Resumo: Eager checou ${eagerMetrics.checked}/${eagerMetrics.total} nós (${eagerMetrics.wasted} desperdícios). Zoneless + OnPush atualizou apenas ${onPushMetrics.checked}/${onPushMetrics.total} componente(s) com ${onPushMetrics.wasted} verificações desperdiçadas!`,
        };
    }
  },
};

const PROFILE_STRATEGIES: Record<SimulationProfileKey, ProfileStrategy> = {
  'zone-click': ZONE_CLICK_STRATEGY,
  'zone-timeout': ZONE_TIMEOUT_STRATEGY,
  zoneless: ZONELESS_STRATEGY,
};

function resolveProfileKey(profile: SimulationProfile): SimulationProfileKey {
  if (profile.mode === 'zoneless') {
    return 'zoneless';
  }
  return profile.scenario === 'timeout' ? 'zone-timeout' : 'zone-click';
}

export function createSimulationProfile(
  mode: ChangeDetectionMode,
  scenario: ChangeDetectionScenarioId
): SimulationProfile {
  if (mode === 'zone-js') {
    return {
      mode: 'zone-js',
      scenario: scenario === 'timeout' ? 'timeout' : 'click',
    };
  }
  return {
    mode: 'zoneless',
    scenario: scenario === 'shared-signal' ? 'shared-signal' : 'local-signal',
  };
}

export function buildChangeDetectionSteps(
  profile: SimulationProfile,
  clickedNode: TreeNodeId,
  prevValue: number,
  nextValue: number
): CdDebugStep[] {
  const targets = resolveTargetNodes(profile, clickedNode);
  const ctx: SimulationContext = {
    profile,
    targets,
    targetSet: new Set(targets),
    ancestorSet: computeAncestorSet(targets),
    targetLabels: formatTargetLabels(targets),
    prevValue,
    nextValue,
    totalNodes: TREE_NODE_IDS.length,
    totalLeaves: LEAF_NODE_IDS.length,
    targetLeafCount: targets.filter((id) => TREE_NODES[id].depth === 2).length,
  };

  const strategy = PROFILE_STRATEGIES[resolveProfileKey(profile)];

  return CD_PHASES.map((phase) => {
    const eagerNodes = buildEagerNodes(ctx, phase);
    const eagerMetrics = computeTreeMetrics(eagerNodes);
    const onPushNodes = strategy.buildOnPushNodes(ctx, phase);
    const onPushMetrics = computeTreeMetrics(onPushNodes);

    const meta = strategy.buildPhaseMeta(ctx, phase, eagerMetrics, onPushMetrics);

    return {
      phase,
      shortLabel: PHASE_SHORT_LABELS[phase],
      title: meta.title,
      badgeText: meta.badgeText,
      themeKey: meta.themeKey,
      explanation: meta.explanation,
      staleAlert: meta.staleAlert,
      trees: {
        eager: makeTreeState(
          'eager',
          eagerNodes,
          buildEagerSummaryNote(ctx, phase, eagerMetrics),
          eagerMetrics
        ),
        'on-push': makeTreeState(
          'on-push',
          onPushNodes,
          strategy.buildOnPushSummaryNote(ctx, phase, onPushMetrics),
          onPushMetrics
        ),
      },
    };
  });
}
