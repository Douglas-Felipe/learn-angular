import { Component, computed, effect, input, linkedSignal, untracked } from '@angular/core';
import { createStepPlayback } from '../../../../shared/utils/step-playback.util';
import {
  DEFAULT_TARGET_NODE,
  INITIAL_NODE_VALUE,
  PLAYBACK_INTERVAL_MS,
  TREE_NODES,
} from '../../data/cd-tree.data';
import {
  LEGEND_STATUS_ORDER,
  MODE_METADATA,
  PHASE_THEME_CLASSES,
  SCENARIO_VARIANT_CLASSES,
  STATUS_VISUAL_META,
} from '../../data/cd-visual.config';
import {
  ChangeDetectionMode,
  ChangeDetectionScenarioId,
  ScenarioOption,
  TreeNodeId,
} from '../../interfaces/change-detection.interface';
import {
  buildChangeDetectionSteps,
  createSimulationProfile,
} from '../../utils/cd-simulation.util';
import { ComponentTree } from '../component-tree/component-tree';

@Component({
  imports: [ComponentTree],
  selector: 'app-cd-workbench',
  templateUrl: './cd-workbench.html',
})
export class CdWorkbench {
  readonly mode = input.required<ChangeDetectionMode>();

  protected readonly modeMeta = computed(() => MODE_METADATA[this.mode()]);

  protected readonly scenario = linkedSignal<ChangeDetectionMode, ChangeDetectionScenarioId>({
    source: this.mode,
    computation: (nextMode) => MODE_METADATA[nextMode].defaultScenario,
  });

  protected readonly profile = computed(() =>
    createSimulationProfile(this.mode(), this.scenario())
  );

  protected readonly targetNodeId = linkedSignal<ChangeDetectionMode, TreeNodeId>({
    source: this.mode,
    computation: () => DEFAULT_TARGET_NODE,
  });

  protected readonly cycleCounter = linkedSignal<ChangeDetectionMode, number>({
    source: this.mode,
    computation: () => INITIAL_NODE_VALUE,
  });

  protected readonly steps = computed(() => {
    const prev = this.cycleCounter();
    return buildChangeDetectionSteps(this.profile(), this.targetNodeId(), prev, prev + 1);
  });

  private readonly playback = createStepPlayback(
    computed(() => this.steps().length),
    PLAYBACK_INTERVAL_MS
  );

  protected readonly stepIndex = this.playback.stepIndex;
  protected readonly isPlaying = this.playback.isPlaying;

  protected readonly currentStep = computed(() => this.steps()[this.stepIndex()]);
  protected readonly currentPhaseTheme = computed(
    () => PHASE_THEME_CLASSES[this.currentStep().themeKey]
  );
  protected readonly targetLabel = computed(() => TREE_NODES[this.targetNodeId()].label);
  protected readonly legendItems = computed(() =>
    LEGEND_STATUS_ORDER[this.mode()].map((status) => STATUS_VISUAL_META[status])
  );

  constructor() {
    effect(() => {
      this.mode();
      untracked(() => this.playback.reset());
    });
  }

  protected scenarioButtonClass(option: ScenarioOption): string {
    const activeClasses =
      this.scenario() === option.id ? ' ring-2 ring-ng-purple/70' : ' opacity-75';
    return `cyber-button text-xs ${SCENARIO_VARIANT_CLASSES[option.buttonVariant]}${activeClasses}`;
  }

  protected stepPillClass(index: number): string {
    const current = this.stepIndex();
    const stateClasses =
      index === current
        ? 'border-ng-purple bg-ng-purple/15 text-ng-text'
        : index < current
          ? 'border-ng-success/40 bg-ng-success/10 text-ng-text-muted hover:border-ng-purple/50'
          : 'border-ng-border bg-ng-bg text-ng-text-subtle hover:border-ng-purple/50 hover:text-ng-text';
    return `ui-btn ui-pill rounded-lg border px-2.5 py-2 text-left font-mono text-xs font-semibold ${stateClasses}`;
  }

  protected selectScenario(nextScenario: ChangeDetectionScenarioId): void {
    this.playback.reset();
    this.scenario.set(nextScenario);
  }

  protected triggerInNode(nodeId: TreeNodeId): void {
    this.playback.reset();
    this.targetNodeId.set(nodeId);
    this.cycleCounter.update((c) => c + 1);
  }

  protected triggerCurrentNode(): void {
    this.triggerInNode(this.targetNodeId());
  }

  protected resetSimulation(): void {
    this.playback.reset();
    this.scenario.set(this.modeMeta().defaultScenario);
    this.targetNodeId.set(DEFAULT_TARGET_NODE);
    this.cycleCounter.set(INITIAL_NODE_VALUE);
  }

  protected prev(): void {
    this.playback.prev();
  }

  protected next(): void {
    this.playback.next();
  }

  protected goToStep(index: number): void {
    this.playback.goTo(index);
  }

  protected togglePlay(): void {
    this.playback.togglePlay();
  }
}
