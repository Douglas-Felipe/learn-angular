import {
  INITIAL_NODE_VALUE,
  PLAYBACK_INTERVAL_MS,
  SHARED_SIGNAL_PARTNER,
  TREE_NODE_IDS,
  TREE_NODES,
} from '../data/cd-tree.data';
import {
  EDGE_CLASSES,
  LEGEND_STATUS_ORDER,
  MODE_METADATA,
  PHASE_THEME_CLASSES,
  STATUS_VISUAL_META,
} from '../data/cd-visual.config';
import type {
  CdDebugStep,
  SimulationProfile,
  TreeNodeId,
} from '../interfaces/change-detection.interface';
import { buildChangeDetectionSteps, createSimulationProfile } from './cd-simulation.util';

describe('cd-simulation.util', () => {
  function expectValidStepShape(step: CdDebugStep, shortLabel: string): void {
    expect(step.shortLabel).toBe(shortLabel);
    expect(step.title.length).toBeGreaterThan(0);
    expect(step.badgeText.length).toBeGreaterThan(0);
    expect(step.explanation.length).toBeGreaterThan(0);
    expect(step.trees.eager.summaryNote.length).toBeGreaterThan(0);
    expect(step.trees['on-push'].summaryNote.length).toBeGreaterThan(0);
  }

  it('should define consistent static metadata and normalize mismatched mode/scenario profiles', () => {
    expect(PLAYBACK_INTERVAL_MS).toBe(1300);
    expect(INITIAL_NODE_VALUE).toBe(1);
    expect(TREE_NODE_IDS).toHaveLength(7);
    expect(Object.keys(TREE_NODES)).toHaveLength(7);
    expect(Object.keys(SHARED_SIGNAL_PARTNER)).toHaveLength(7);
    expect(Object.keys(STATUS_VISUAL_META)).toHaveLength(9);
    expect(Object.keys(PHASE_THEME_CLASSES)).toHaveLength(6);
    expect(Object.keys(EDGE_CLASSES)).toHaveLength(6);

    expect(MODE_METADATA['zone-js'].defaultScenario).toBe('click');
    expect(MODE_METADATA.zoneless.defaultScenario).toBe('local-signal');
    expect(LEGEND_STATUS_ORDER['zone-js']).toContain('stale');
    expect(LEGEND_STATUS_ORDER.zoneless).toContain('traversal');

    expect(createSimulationProfile('zone-js', 'click')).toEqual({
      mode: 'zone-js',
      scenario: 'click',
    });
    expect(createSimulationProfile('zone-js', 'timeout')).toEqual({
      mode: 'zone-js',
      scenario: 'timeout',
    });
    expect(createSimulationProfile('zone-js', 'shared-signal')).toEqual({
      mode: 'zone-js',
      scenario: 'click',
    });
    expect(createSimulationProfile('zoneless', 'local-signal')).toEqual({
      mode: 'zoneless',
      scenario: 'local-signal',
    });
    expect(createSimulationProfile('zoneless', 'shared-signal')).toEqual({
      mode: 'zoneless',
      scenario: 'shared-signal',
    });
    expect(createSimulationProfile('zoneless', 'timeout')).toEqual({
      mode: 'zoneless',
      scenario: 'local-signal',
    });
  });

  describe('zone-js click scenario', () => {
    it('should build all 6 phases for leaf target Counter with Eager (7/7) vs OnPush (3/7)', () => {
      const steps = buildChangeDetectionSteps(
        { mode: 'zone-js', scenario: 'click' },
        'counter',
        1,
        2
      );
      expect(steps).toHaveLength(6);
      expect(steps.map((s) => s.phase)).toEqual([
        'trigger',
        'schedule',
        'root',
        'branch',
        'leaf',
        'summary',
      ]);

      const [trigger, schedule, root, branch, leaf, summary] = steps;

      expectValidStepShape(trigger, '1. Gatilho');
      expect(trigger.title).toBe('Evento (click) em Counter');
      expect(trigger.badgeText).toBe('(click)');
      expect(trigger.themeKey).toBe('info');
      expect(trigger.explanation).toBe(
        'Um evento (click) no template de Counter alterou count em memória de 1 para 2. O DOM ainda exibe 1.'
      );
      expect(trigger.trees.eager.summaryNote).toBe(
        'Mudança iniciada em Counter; Eager ainda não iniciou a travessia.'
      );
      expect(trigger.trees['on-push'].summaryNote).toBe(
        'Descida entra apenas nos nós Dirty e poda subárvores Clean.'
      );
      expect(trigger.trees.eager.nodes.counter.status).toBe('triggered');
      expect(trigger.trees.eager.nodes.counter.flagLabel).toBe('Evento (click)');
      expect(trigger.trees.eager.nodes.counter.domValue).toBe(1);
      expect(trigger.trees.eager.nodes.counter.memoryValue).toBe(2);
      expect(trigger.trees.eager.nodes.app.flagLabel).toBe('Aguardando');
      expect(trigger.trees['on-push'].nodes.counter.status).toBe('triggered');
      expect(trigger.trees['on-push'].nodes.counter.flagLabel).toBe('Evento (click)');
      expect(trigger.trees['on-push'].nodes.counter.domValue).toBe(1);
      expect(trigger.trees['on-push'].nodes.app.flagLabel).toBe('Clean');
      expect(trigger.staleAlert).toBeUndefined();

      expectValidStepShape(schedule, '2. Marcação');
      expect(schedule.title).toBe('markViewDirty() vs Tick Global');
      expect(schedule.badgeText).toBe('markViewDirty()');
      expect(schedule.themeKey).toBe('warning');
      expect(schedule.explanation).toBe(
        'No Zone.js clássico, markViewDirty() no OnPush sobe de Counter até a raiz marcando todos os ancestrais como Dirty. No Eager, a árvore inteira será percorrida.'
      );
      expect(schedule.trees.eager.summaryNote).toBe(
        'Zone.js dispara tick() global; componentes Eager são marcados para verificação irrestrita.'
      );
      expect(schedule.trees['on-push'].summaryNote).toBe(
        'markViewDirty() subiu de Counter até a raiz marcando todos os ancestrais como Dirty.'
      );
      expect(schedule.trees.eager.nodes.counter.status).toBe('dirty');
      expect(schedule.trees.eager.nodes.counter.flagLabel).toBe('Evento na Zone');
      expect(schedule.trees.eager.nodes.counter.domValue).toBe(1);
      expect(schedule.trees.eager.nodes.app.flagLabel).toBe('Será verificado (Eager)');
      expect(schedule.trees['on-push'].nodes.app.status).toBe('dirty');
      expect(schedule.trees['on-push'].nodes.app.flagLabel).toBe('Dirty (ancestral)');
      expect(schedule.trees['on-push'].nodes.counter.flagLabel).toBe('Dirty (alvo)');
      expect(schedule.trees['on-push'].nodes.counter.domValue).toBe(1);
      expect(schedule.trees['on-push'].nodes.sidebar.status).toBe('idle');
      expect(schedule.trees['on-push'].nodes.sidebar.flagLabel).toBe('Clean');
      expect(schedule.trees['on-push'].edges.dashboard).toBe('dirty');
      expect(schedule.trees['on-push'].edges.app).toBe('idle');

      expectValidStepShape(root, '3. Raiz');
      expect(root.title).toBe('Travessia na Raiz (AppRoot)');
      expect(root.badgeText).toBe('Nível 0 • AppRoot');
      expect(root.themeKey).toBe('primary');
      expect(root.explanation).toBe(
        'Eager verifica AppRoot (CheckAlways). No OnPush com click, AppRoot foi marcada como Dirty pelo filho e também precisa ser reavaliada.'
      );
      expect(root.trees.eager.summaryNote).toBe(
        'Travessia CheckAlways percorrendo todos os nós nível a nível, independente de quem mudou.'
      );
      expect(root.trees['on-push'].summaryNote).toBe(
        'Descida entra apenas nos nós Dirty e poda subárvores Clean.'
      );
      expect(root.trees.eager.nodes.app.status).toBe('checking');
      expect(root.trees.eager.nodes.app.flagLabel).toBe('Verificando template');
      expect(root.trees.eager.nodes.dashboard.flagLabel).toBe('Aguardando descida');
      expect(root.trees.eager.nodes.counter.flagLabel).toBe('Dirty');
      expect(root.trees.eager.nodes.counter.domValue).toBe(1);
      expect(root.trees['on-push'].nodes.app.status).toBe('checking');
      expect(root.trees['on-push'].nodes.app.flagLabel).toBe('Verificando ancestral Dirty');
      expect(root.trees['on-push'].nodes.dashboard.status).toBe('dirty');
      expect(root.trees['on-push'].nodes.dashboard.flagLabel).toBe('Dirty (ancestral)');
      expect(root.trees['on-push'].nodes.counter.status).toBe('dirty');
      expect(root.trees['on-push'].nodes.counter.flagLabel).toBe('Dirty (alvo)');
      expect(root.trees['on-push'].nodes.counter.domValue).toBe(1);
      expect(root.trees['on-push'].nodes.sidebar.status).toBe('idle');
      expect(root.trees['on-push'].nodes.sidebar.flagLabel).toBe('Clean');

      expectValidStepShape(branch, '4. Ramos');
      expect(branch.title).toBe('Nível 1 • Dashboard e Sidebar');
      expect(branch.badgeText).toBe('Nível 1 • Ramos');
      expect(branch.themeKey).toBe('primary');
      expect(branch.explanation).toBe(
        'Eager entra em Dashboard e Sidebar. OnPush verifica apenas o ramo ancestral marcado Dirty e poda o ramo irmão Clean.'
      );
      expect(branch.trees.eager.nodes.app.status).toBe('checked-wasted');
      expect(branch.trees.eager.nodes.app.flagLabel).toBe('Verificado s/ mudança');
      expect(branch.trees.eager.nodes.dashboard.status).toBe('checking');
      expect(branch.trees.eager.nodes.dashboard.flagLabel).toBe('Verificando template');
      expect(branch.trees.eager.nodes.counter.domValue).toBe(1);
      expect(branch.trees['on-push'].nodes.app.status).toBe('checked-wasted');
      expect(branch.trees['on-push'].nodes.app.flagLabel).toBe('Ancestral verificado');
      expect(branch.trees['on-push'].nodes.dashboard.status).toBe('checking');
      expect(branch.trees['on-push'].nodes.dashboard.flagLabel).toBe('Verificando ancestral Dirty');
      expect(branch.trees['on-push'].nodes.sidebar.status).toBe('skipped');
      expect(branch.trees['on-push'].nodes.sidebar.flagLabel).toBe('Pulado (Clean)');
      expect(branch.trees['on-push'].nodes.counter.status).toBe('dirty');
      expect(branch.trees['on-push'].nodes.counter.flagLabel).toBe('Dirty (alvo)');
      expect(branch.trees['on-push'].nodes.counter.domValue).toBe(1);

      expectValidStepShape(leaf, '5. Folhas');
      expect(leaf.title).toBe('Nível 2 • Componentes Folha & DOM');
      expect(leaf.badgeText).toBe('Nível 2 • Folhas');
      expect(leaf.themeKey).toBe('success');
      expect(leaf.explanation).toBe(
        'Eager checa todas as 4 folhas e atualiza Counter. OnPush reavalia o template inteiro de Counter e pula os demais nós Clean.'
      );
      expect(leaf.trees.eager.nodes.counter.status).toBe('updated');
      expect(leaf.trees.eager.nodes.counter.flagLabel).toBe('DOM atualizado');
      expect(leaf.trees.eager.nodes.counter.domValue).toBe(2);
      expect(leaf.trees.eager.nodes.stats.status).toBe('checking');
      expect(leaf.trees.eager.nodes.stats.flagLabel).toBe('Verificando template');
      expect(leaf.trees['on-push'].nodes.dashboard.flagLabel).toBe('Ancestral verificado');
      expect(leaf.trees['on-push'].nodes.counter.status).toBe('updated');
      expect(leaf.trees['on-push'].nodes.counter.flagLabel).toBe('DOM atualizado');
      expect(leaf.trees['on-push'].nodes.counter.domValue).toBe(2);
      expect(leaf.trees['on-push'].nodes.stats.status).toBe('skipped');
      expect(leaf.trees['on-push'].nodes.stats.flagLabel).toBe('Pulado (Clean)');

      expectValidStepShape(summary, '6. Resumo');
      expect(summary.title).toBe('Resultado da Comparação');
      expect(summary.badgeText).toBe('Ciclo Concluído');
      expect(summary.themeKey).toBe('success');
      expect(summary.explanation).toBe(
        'Resumo: Eager checou 7/7 nós (6 desperdícios). OnPush + Zone.js checou 3/7 (precisou re-checar 2 ancestral(is)) e pulou 4.'
      );
      expect(summary.trees.eager.summaryNote).toBe(
        'Eager verificou 7/7 componentes para atualizar Counter (6 re-checks sem mudança).'
      );
      expect(summary.trees['on-push'].summaryNote).toBe(
        'OnPush (Zone.js) verificou 3/7 componentes (alvo + ancestrais Dirty) e pulou 4 Clean.'
      );
      expect(summary.trees.eager.metrics).toEqual({
        checked: 7,
        wasted: 6,
        updated: 1,
        skipped: 0,
        traversalOnly: 0,
        stale: 0,
        total: 7,
      });
      expect(summary.trees['on-push'].metrics).toEqual({
        checked: 3,
        wasted: 2,
        updated: 1,
        skipped: 4,
        traversalOnly: 0,
        stale: 0,
        total: 7,
      });
      expect(summary.trees.eager.nodes.counter.flagLabel).toBe('DOM atualizado');
      expect(summary.trees.eager.nodes.counter.domValue).toBe(2);
      expect(summary.trees.eager.nodes.stats.flagLabel).toBe('Re-check desnecessário');
      expect(summary.trees.eager.nodes.counter.granularityNote).toBe(
        'Template inteiro avaliado (Eager)'
      );
      expect(summary.trees['on-push'].nodes.counter.flagLabel).toBe('DOM atualizado');
      expect(summary.trees['on-push'].nodes.counter.domValue).toBe(2);
      expect(summary.trees['on-push'].nodes.app.flagLabel).toBe('Re-check p/ propagar');
      expect(summary.trees['on-push'].nodes.stats.flagLabel).toBe('Pulado (Clean)');
      expect(summary.trees['on-push'].nodes.counter.granularityNote).toBe(
        'Template inteiro reavaliado (Zone.js)'
      );
    });

    it('should describe AppRoot directly as Dirty target when clicking AppRoot and handle branch target', () => {
      const rootSteps = buildChangeDetectionSteps(
        { mode: 'zone-js', scenario: 'click' },
        'app',
        1,
        2
      );
      expect(rootSteps[2].explanation).toBe(
        'Eager verifica AppRoot (CheckAlways). No OnPush com click, AppRoot é o próprio alvo marcado Dirty e tem seu template reavaliado.'
      );
      expect(rootSteps[2].trees.eager.nodes.app.flagLabel).toBe('DOM atualizado');
      expect(rootSteps[2].trees.eager.nodes.app.domValue).toBe(2);
      expect(rootSteps[2].trees['on-push'].nodes.app.flagLabel).toBe('DOM atualizado');
      expect(rootSteps[2].trees['on-push'].nodes.app.domValue).toBe(2);
      expect(rootSteps[3].trees.eager.nodes.app.flagLabel).toBe('DOM atualizado');
      expect(rootSteps[3].trees['on-push'].nodes.app.flagLabel).toBe('DOM atualizado');

      const branchSteps = buildChangeDetectionSteps(
        { mode: 'zone-js', scenario: 'click' },
        'dashboard',
        1,
        2
      );
      expect(branchSteps[3].trees.eager.nodes.dashboard.status).toBe('updated');
      expect(branchSteps[3].trees.eager.nodes.dashboard.domValue).toBe(2);
      expect(branchSteps[3].trees['on-push'].nodes.dashboard.status).toBe('updated');
      expect(branchSteps[3].trees['on-push'].nodes.dashboard.flagLabel).toBe('DOM atualizado');
      expect(branchSteps[3].trees['on-push'].nodes.dashboard.domValue).toBe(2);
      expect(branchSteps[3].trees['on-push'].nodes.sidebar.status).toBe('skipped');
      expect(branchSteps[4].trees['on-push'].nodes.dashboard.flagLabel).toBe('DOM atualizado');
      expect(branchSteps[5].trees['on-push'].metrics).toEqual({
        checked: 2,
        wasted: 1,
        updated: 1,
        skipped: 5,
        traversalOnly: 0,
        stale: 0,
        total: 7,
      });
    });
  });

  describe('zone-js timeout scenario', () => {
    it('should surface stale DOM alert from root through summary when markForCheck is omitted', () => {
      const steps = buildChangeDetectionSteps(
        { mode: 'zone-js', scenario: 'timeout' },
        'counter',
        2,
        3
      );
      const [trigger, schedule, root, branch, leaf, summary] = steps;

      expect(trigger.title).toBe('setTimeout() altera estado em Counter');
      expect(trigger.badgeText).toBe('setTimeout()');
      expect(trigger.themeKey).toBe('info');
      expect(trigger.explanation).toBe(
        'Dentro de setTimeout(), a propriedade count de Counter mudou em memória para 3. O Zone.js interceptou o timer assíncrono.'
      );
      expect(trigger.trees.eager.nodes.counter.flagLabel).toBe('setTimeout()');
      expect(trigger.trees.eager.nodes.counter.domValue).toBe(2);
      expect(trigger.trees.eager.nodes.counter.memoryValue).toBe(3);
      expect(trigger.trees['on-push'].nodes.counter.flagLabel).toBe('setTimeout() mutou estado');
      expect(trigger.trees['on-push'].nodes.counter.domValue).toBe(2);
      expect(trigger.trees['on-push'].nodes.app.flagLabel).toBe('Clean');
      expect(trigger.trees['on-push'].summaryNote).toBe(
        'setTimeout() alterou o estado em memória de Counter, mas nenhum evento de template foi disparado.'
      );

      expect(schedule.title).toBe('Zone.js dispara tick() sem markForCheck()');
      expect(schedule.badgeText).toBe('Sem markForCheck');
      expect(schedule.themeKey).toBe('error');
      expect(schedule.explanation).toBe(
        'Zone.js dispara ApplicationRef.tick(). Componentes Eager são checados sempre, mas no OnPush ninguém chamou markForCheck() — toda a árvore permanece Clean!'
      );
      expect(schedule.staleAlert).toBeUndefined();
      expect(schedule.trees['on-push'].nodes.counter.status).toBe('stale');
      expect(schedule.trees['on-push'].nodes.counter.flagLabel).toBe('Sem markForCheck!');
      expect(schedule.trees['on-push'].nodes.counter.domValue).toBe(2);
      expect(schedule.trees['on-push'].nodes.app.flagLabel).toBe('Clean (não marcado)');
      expect(schedule.trees['on-push'].summaryNote).toBe(
        'Zone.js agendou tick(), porém ninguém chamou markForCheck(): todos os nós seguem Clean.'
      );

      expect(root.title).toBe('Travessia na Raiz (AppRoot)');
      expect(root.badgeText).toBe('Nível 0 • AppRoot');
      expect(root.themeKey).toBe('primary');
      expect(root.explanation).toBe(
        'Eager entra em AppRoot normalmente. Já no OnPush, AppRoot está Clean e toda a árvore é pulada — deixando Counter dessincronizado!'
      );
      expect(root.trees['on-push'].summaryNote).toBe(
        'OnPush pulou a subárvore sem verificar Counter: memória=3, DOM congelado em 2.'
      );
      expect(root.staleAlert).toBe(
        'Bug clássico do OnPush + Zone.js: setTimeout() mudou a memória de Counter para 3, mas o DOM ficou travado em 2 porque faltou chamar ChangeDetectorRef.markForCheck() (ou usar Signal).'
      );
      expect(root.trees['on-push'].nodes.app.status).toBe('skipped');
      expect(root.trees['on-push'].nodes.app.flagLabel).toBe('Pulado (OnPush Clean)');
      expect(root.trees['on-push'].nodes.sidebar.status).toBe('idle');
      expect(root.trees['on-push'].nodes.sidebar.flagLabel).toBe('Clean');
      expect(root.trees['on-push'].nodes.counter.flagLabel).toBe('Sem markForCheck!');
      expect(root.trees['on-push'].nodes.counter.domValue).toBe(2);

      expect(branch.title).toBe('Nível 1 • Dashboard e Sidebar');
      expect(branch.badgeText).toBe('Nível 1 • Ramos');
      expect(branch.themeKey).toBe('primary');
      expect(branch.explanation).toBe(
        'Eager verifica Dashboard e Sidebar. OnPush mantém todos os ramos pulados enquanto Counter continua dessincronizado.'
      );
      expect(branch.staleAlert).toBe(root.staleAlert);
      expect(branch.trees['on-push'].nodes.sidebar.status).toBe('skipped');
      expect(branch.trees['on-push'].nodes.sidebar.flagLabel).toBe('Pulado (OnPush Clean)');
      expect(branch.trees['on-push'].nodes.counter.flagLabel).toBe('Sem markForCheck!');
      expect(branch.trees['on-push'].nodes.counter.domValue).toBe(2);

      expect(leaf.title).toBe('Nível 2 • Componentes Folha & DOM');
      expect(leaf.badgeText).toBe('Nível 2 • Folhas');
      expect(leaf.themeKey).toBe('error');
      expect(leaf.explanation).toBe(
        'Eager atualiza Counter para 3 após checar todas as folhas. OnPush pulou Counter, mantendo o DOM antigo (2).'
      );
      expect(leaf.staleAlert).toBe(root.staleAlert);
      expect(leaf.trees.eager.nodes.counter.domValue).toBe(3);
      expect(leaf.trees['on-push'].nodes.counter.flagLabel).toBe('Ignorado (Clean!)');
      expect(leaf.trees['on-push'].nodes.counter.domValue).toBe(2);
      expect(leaf.trees['on-push'].nodes.counter.memoryValue).toBe(3);
      expect(leaf.trees['on-push'].nodes.stats.flagLabel).toBe('Pulado (OnPush Clean)');

      expect(summary.title).toBe('Resultado da Comparação');
      expect(summary.badgeText).toBe('Dessincronizado (OnPush)');
      expect(summary.themeKey).toBe('error');
      expect(summary.explanation).toBe(
        'Resumo: Eager checou 7/7 nós e atualizou Counter. OnPush checou 0/7 nós e ficou dessincronizado por falta de markForCheck().'
      );
      expect(summary.trees['on-push'].summaryNote).toBe(
        'OnPush pulou a subárvore sem verificar Counter: memória=3, DOM congelado em 2.'
      );
      expect(summary.staleAlert).toBe(root.staleAlert);
      expect(summary.trees['on-push'].nodes.counter.flagLabel).toBe('DOM dessincronizado!');
      expect(summary.trees['on-push'].nodes.counter.domValue).toBe(2);
      expect(summary.trees['on-push'].nodes.stats.flagLabel).toBe('Pulado (OnPush Clean)');
      expect(summary.trees['on-push'].nodes.counter.granularityNote).toBe(
        'Sem markForCheck() — template congelado'
      );
      expect(summary.trees['on-push'].metrics).toEqual({
        checked: 0,
        wasted: 0,
        updated: 0,
        skipped: 6,
        traversalOnly: 0,
        stale: 1,
        total: 7,
      });
    });

    it('should handle timeout directly on AppRoot', () => {
      const rootTimeout = buildChangeDetectionSteps(
        { mode: 'zone-js', scenario: 'timeout' },
        'app',
        1,
        2
      );
      expect(rootTimeout[2].trees['on-push'].nodes.app.status).toBe('stale');
      expect(rootTimeout[2].trees['on-push'].nodes.app.flagLabel).toBe('Ignorado (Clean!)');
      expect(rootTimeout[2].trees['on-push'].nodes.app.domValue).toBe(1);
      expect(rootTimeout[5].trees['on-push'].metrics.stale).toBe(1);
      expect(rootTimeout[5].trees['on-push'].metrics.skipped).toBe(6);
    });
  });

  describe('zoneless scenarios', () => {
    it('should build local-signal steps with traversal-only ancestors and 0 wasted checks', () => {
      const steps = buildChangeDetectionSteps(
        { mode: 'zoneless', scenario: 'local-signal' },
        'counter',
        1,
        2
      );
      const [trigger, schedule, root, branch, leaf, summary] = steps;

      expect(trigger.title).toBe('Signal atualizado em Counter');
      expect(trigger.badgeText).toBe('signal.update()');
      expect(trigger.themeKey).toBe('info');
      expect(trigger.explanation).toBe(
        'O valor em memória de Counter mudou de 1 para 2 via signal.update(). O DOM ainda exibe 1.'
      );
      expect(trigger.trees.eager.nodes.counter.flagLabel).toBe('signal.update()');
      expect(trigger.trees.eager.nodes.counter.domValue).toBe(1);
      expect(trigger.trees['on-push'].nodes.counter.flagLabel).toBe('signal.update()');
      expect(trigger.trees['on-push'].nodes.counter.domValue).toBe(1);
      expect(trigger.trees['on-push'].nodes.app.flagLabel).toBe('Clean');

      expect(schedule.title).toBe('Notificação direcionada do Signal');
      expect(schedule.badgeText).toBe('RefreshView');
      expect(schedule.themeKey).toBe('warning');
      expect(schedule.explanation).toBe(
        'No OnPush (padrão v22), o Signal marca apenas Counter com RefreshView e sinaliza ancestrais com HasChildViewsToRefresh (apenas travessia). No Eager, todos os 7 nós serão checados.'
      );
      expect(schedule.trees.eager.summaryNote).toBe(
        'Signal notificou mudança, mas componentes Eager ignoram a poda e verificam toda a árvore.'
      );
      expect(schedule.trees['on-push'].summaryNote).toBe(
        'Signal marcou Counter com RefreshView e os ancestrais apenas com HasChildViews (sem sujar templates pais).'
      );
      expect(schedule.trees.eager.nodes.counter.status).toBe('dirty');
      expect(schedule.trees.eager.nodes.counter.flagLabel).toBe('RefreshView');
      expect(schedule.trees.eager.nodes.counter.domValue).toBe(1);
      expect(schedule.trees.eager.nodes.app.status).toBe('traversal');
      expect(schedule.trees.eager.nodes.app.flagLabel).toBe('HasChildViews');
      expect(schedule.trees.eager.nodes.sidebar.flagLabel).toBe('CheckAlways (Eager)');
      expect(schedule.trees['on-push'].nodes.counter.flagLabel).toBe('RefreshView');
      expect(schedule.trees['on-push'].nodes.counter.domValue).toBe(1);
      expect(schedule.trees['on-push'].nodes.app.status).toBe('traversal');
      expect(schedule.trees['on-push'].nodes.app.flagLabel).toBe('HasChildViews');
      expect(schedule.trees['on-push'].nodes.sidebar.flagLabel).toBe('Clean');
      expect(schedule.trees['on-push'].edges.dashboard).toBe('traversal');

      expect(root.title).toBe('Travessia na Raiz (AppRoot)');
      expect(root.badgeText).toBe('Nível 0 • AppRoot');
      expect(root.themeKey).toBe('purple');
      expect(root.explanation).toBe(
        'Eager verifica AppRoot mesmo que ela não leia o Signal. No OnPush + Zoneless, se AppRoot não for alvo, o Angular passa direto (Traversal) sem reavaliar o template da raiz.'
      );
      expect(root.trees['on-push'].summaryNote).toBe(
        'Local Change Detection: ancestrais são apenas atravessados sem executar dirty check.'
      );
      expect(root.trees.eager.nodes.dashboard.status).toBe('traversal');
      expect(root.trees.eager.nodes.dashboard.flagLabel).toBe('HasChildViews');
      expect(root.trees.eager.nodes.sidebar.flagLabel).toBe('CheckAlways (Eager)');
      expect(root.trees.eager.nodes.counter.flagLabel).toBe('RefreshView');
      expect(root.trees['on-push'].nodes.app.flagLabel).toBe('Passa direto (sem check)');
      expect(root.trees['on-push'].nodes.dashboard.status).toBe('traversal');
      expect(root.trees['on-push'].nodes.dashboard.flagLabel).toBe('HasChildViews');
      expect(root.trees['on-push'].nodes.counter.status).toBe('dirty');
      expect(root.trees['on-push'].nodes.counter.flagLabel).toBe('RefreshView');
      expect(root.trees['on-push'].nodes.counter.domValue).toBe(1);
      expect(root.trees['on-push'].nodes.sidebar.status).toBe('idle');
      expect(root.trees['on-push'].nodes.sidebar.flagLabel).toBe('Clean');

      expect(branch.title).toBe('Nível 1 • Dashboard e Sidebar');
      expect(branch.badgeText).toBe('Nível 1 • Ramos');
      expect(branch.themeKey).toBe('primary');
      expect(branch.explanation).toBe(
        'Eager verifica Dashboard e Sidebar sem necessidade. OnPush + Zoneless atravessa somente o(s) ramo(s) que levam a Counter (sem reavaliar templates) e ignora o restante.'
      );
      expect(branch.trees['on-push'].nodes.dashboard.flagLabel).toBe('Passa direto (sem check)');
      expect(branch.trees['on-push'].nodes.sidebar.status).toBe('skipped');
      expect(branch.trees['on-push'].nodes.sidebar.flagLabel).toBe('Ignorado (Clean)');
      expect(branch.trees['on-push'].nodes.counter.status).toBe('dirty');
      expect(branch.trees['on-push'].nodes.counter.flagLabel).toBe('RefreshView');
      expect(branch.trees['on-push'].nodes.counter.domValue).toBe(1);

      expect(leaf.title).toBe('Nível 2 • Componentes Folha & DOM');
      expect(leaf.badgeText).toBe('Nível 2 • Folhas');
      expect(leaf.themeKey).toBe('success');
      expect(leaf.explanation).toBe(
        'Eager reavalia as 4 folhas (3 sem mudança). OnPush + Zoneless atualiza cirurgicamente apenas Counter onde o Signal é lido no template.'
      );
      expect(leaf.trees['on-push'].nodes.counter.flagLabel).toBe('Binding do signal atualizado');
      expect(leaf.trees['on-push'].nodes.counter.domValue).toBe(2);
      expect(leaf.trees['on-push'].nodes.stats.flagLabel).toBe('Ignorado (Clean)');

      expect(summary.title).toBe('Resultado da Comparação');
      expect(summary.badgeText).toBe('Ciclo Concluído');
      expect(summary.themeKey).toBe('success');
      expect(summary.explanation).toBe(
        'Resumo: Eager checou 7/7 nós (6 desperdícios). Zoneless + OnPush atualizou apenas 1/7 componente(s) com 0 verificações desperdiçadas!'
      );
      expect(summary.trees['on-push'].summaryNote).toBe(
        'Zoneless + OnPush verificou apenas 1/7 componente(s) (Counter) — 0 re-checks desperdiçados!'
      );
      expect(summary.trees['on-push'].nodes.counter.flagLabel).toBe('DOM atualizado');
      expect(summary.trees['on-push'].nodes.counter.domValue).toBe(2);
      expect(summary.trees['on-push'].nodes.app.flagLabel).toBe('Atravessado s/ check');
      expect(summary.trees['on-push'].nodes.stats.flagLabel).toBe('Ignorado (Clean)');
      expect(summary.trees['on-push'].metrics).toEqual({
        checked: 1,
        wasted: 0,
        updated: 1,
        skipped: 4,
        traversalOnly: 2,
        stale: 0,
        total: 7,
      });
      expect(summary.trees['on-push'].nodes.counter.granularityNote).toBe(
        'Cirúrgico: apenas {{ count() }} atualizado'
      );
    });

    it('should update both targets across branches in shared-signal and reflect exact unchanged leaves count', () => {
      const sharedSteps = buildChangeDetectionSteps(
        { mode: 'zoneless', scenario: 'shared-signal' },
        'counter',
        4,
        5
      );
      expect(sharedSteps[0].trees['on-push'].nodes.counter.flagLabel).toBe(
        'Service signal.update()'
      );
      expect(sharedSteps[4].explanation).toContain('Eager reavalia as 4 folhas (2 sem mudança)');
      expect(sharedSteps[5].trees['on-push'].metrics).toEqual({
        checked: 2,
        wasted: 0,
        updated: 2,
        skipped: 2,
        traversalOnly: 3,
        stale: 0,
        total: 7,
      });
      expect(sharedSteps[5].trees.eager.metrics.updated).toBe(2);
      expect(sharedSteps[5].trees.eager.metrics.wasted).toBe(5);
    });

    it('should update AppRoot directly in zoneless when AppRoot is a target including shared-signal', () => {
      const appLocal = buildChangeDetectionSteps(
        { mode: 'zoneless', scenario: 'local-signal' },
        'app',
        1,
        2
      );
      expect(appLocal[2].trees['on-push'].nodes.app.status).toBe('updated');
      expect(appLocal[4].explanation).toContain('Eager reavalia as 4 folhas (4 sem mudança)');

      const appShared = buildChangeDetectionSteps(
        { mode: 'zoneless', scenario: 'shared-signal' },
        'app',
        1,
        2
      );
      expect(appShared[2].trees['on-push'].nodes.app.status).toBe('updated');
      expect(appShared[2].trees['on-push'].nodes.app.flagLabel).toBe(
        'Binding do signal atualizado'
      );
      expect(appShared[2].trees['on-push'].nodes.app.domValue).toBe(2);
      expect(appShared[4].explanation).toContain('Eager reavalia as 4 folhas (3 sem mudança)');
      expect(appShared[5].trees['on-push'].metrics).toEqual({
        checked: 2,
        wasted: 0,
        updated: 2,
        skipped: 4,
        traversalOnly: 1,
        stale: 0,
        total: 7,
      });
    });
  });

  it('should preserve totalNodes invariant across every valid mode, scenario, node, and phase', () => {
    const profiles: SimulationProfile[] = [
      { mode: 'zone-js', scenario: 'click' },
      { mode: 'zone-js', scenario: 'timeout' },
      { mode: 'zoneless', scenario: 'local-signal' },
      { mode: 'zoneless', scenario: 'shared-signal' },
    ];

    for (const profile of profiles) {
      for (const nodeId of TREE_NODE_IDS as readonly TreeNodeId[]) {
        const steps = buildChangeDetectionSteps(profile, nodeId, 1, 2);
        expect(steps).toHaveLength(6);
        for (const step of steps) {
          expect(step.trees.eager.metrics.total).toBe(TREE_NODE_IDS.length);
          expect(step.trees['on-push'].metrics.total).toBe(TREE_NODE_IDS.length);
        }
      }
    }
  });
});
