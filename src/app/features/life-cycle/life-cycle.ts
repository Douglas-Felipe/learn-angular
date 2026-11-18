import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CodeDebugger } from './components/code-debugger/code-debugger';
import { DemoCard } from './components/demo-card/demo-card';
import { DomTree } from './components/dom-tree/dom-tree';
import { DebugStep, HookId } from './interfaces/life-cycle.interface';
import {
  DEFAULT_CARD_TEXT,
  DEFAULT_OBJECT_NAME,
  HOOK_THEMES,
  PLAYBACK_INTERVAL_MS,
  buildDestroySteps,
  buildMountSteps,
  buildObjectMutateSteps,
  buildObjectRecreateSteps,
  buildUpdateSteps,
  resolveNextCardText,
  resolveNextObjectName,
} from './utils/life-cycle.util';

@Component({
  imports: [DemoCard, DomTree, CodeDebugger],
  selector: 'app-life-cycle',
  templateUrl: './life-cycle.html',
})
export class LifeCycle {
  private readonly destroyRef = inject(DestroyRef);
  private timerId: ReturnType<typeof setInterval> | null = null;

  protected readonly steps = signal<DebugStep[]>(buildMountSteps(DEFAULT_CARD_TEXT));
  protected readonly stepIndex = signal(0);
  protected readonly isPlaying = signal(false);
  protected readonly draftText = signal(DEFAULT_CARD_TEXT);
  protected readonly draftObjectName = signal(DEFAULT_OBJECT_NAME);
  protected readonly committedObjectName = signal(DEFAULT_OBJECT_NAME);
  protected readonly objectRefId = signal(1);

  protected readonly current = computed(() => this.steps()[this.stepIndex()]);
  protected readonly currentTheme = computed(() => HOOK_THEMES[this.current().hook]);
  protected readonly cycleHookIds = computed(() => this.steps().map((s) => s.hook));
  protected readonly domTreeDomValue = computed(() => {
    const s = this.current();
    return s.isObjectCycle ? s.domObjectName! : s.domText;
  });
  protected readonly domTreeMemoryValue = computed(() => {
    const s = this.current();
    return s.isObjectCycle ? s.memoryObjectName! : s.memoryText;
  });
  protected readonly isMountedTarget = computed(() => {
    const list = this.steps();
    return list[list.length - 1].mounted;
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.stopTimer();
    });
  }

  protected updateText(): void {
    if (!this.isMountedTarget()) {
      return;
    }

    this.stopTimer();
    const list = this.steps();
    const prev = list[list.length - 1].memoryText;
    const next = resolveNextCardText(prev, this.draftText());

    this.draftText.set(next);
    this.steps.set(buildUpdateSteps(prev, next, this.committedObjectName(), this.objectRefId()));
    this.stepIndex.set(0);
  }

  protected mutateObject(): void {
    if (!this.isMountedTarget()) {
      return;
    }

    const { currentText, domObjName, nextObjName, currentRef } = this.resolveObjectTransition();
    this.draftObjectName.set(nextObjName);
    this.steps.set(buildObjectMutateSteps(currentText, domObjName, nextObjName, currentRef));
    this.stepIndex.set(0);
  }

  protected recreateObject(): void {
    if (!this.isMountedTarget()) {
      return;
    }

    const { currentText, domObjName, nextObjName, currentRef } = this.resolveObjectTransition();
    const nextRef = currentRef + 1;

    this.objectRefId.set(nextRef);
    this.committedObjectName.set(nextObjName);
    this.draftObjectName.set(nextObjName);
    this.steps.set(
      buildObjectRecreateSteps(currentText, domObjName, nextObjName, currentRef, nextRef)
    );
    this.stepIndex.set(0);
  }

  protected mount(): void {
    this.stopTimer();
    const text = this.draftText().trim() || DEFAULT_CARD_TEXT;
    const objName = this.draftObjectName().trim() || DEFAULT_OBJECT_NAME;
    this.draftText.set(text);
    this.draftObjectName.set(objName);
    this.committedObjectName.set(objName);
    this.objectRefId.set(1);
    this.steps.set(buildMountSteps(text, objName, 1));
    this.stepIndex.set(0);
  }

  protected destroy(): void {
    if (!this.isMountedTarget()) {
      return;
    }

    this.stopTimer();
    const list = this.steps();
    const prev = list[list.length - 1].memoryText;
    this.steps.set(buildDestroySteps(prev, this.committedObjectName(), this.objectRefId()));
    this.stepIndex.set(0);
  }

  protected prev(): void {
    this.stopTimer();
    if (this.stepIndex() > 0) {
      this.stepIndex.update((i) => i - 1);
    }
  }

  protected next(): void {
    if (this.stepIndex() < this.steps().length - 1) {
      this.stepIndex.update((i) => i + 1);
    }
    if (this.stepIndex() >= this.steps().length - 1) {
      this.stopTimer();
    }
  }

  protected goToHook(id: HookId): void {
    this.stopTimer();
    const idx = this.steps().findIndex((s) => s.hook === id);
    if (idx !== -1) {
      this.stepIndex.set(idx);
    }
  }

  protected togglePlay(): void {
    if (this.isPlaying()) {
      this.stopTimer();
      return;
    }
    if (this.stepIndex() >= this.steps().length - 1) {
      this.stepIndex.set(0);
    }
    this.isPlaying.set(true);
    this.timerId = setInterval(() => this.next(), PLAYBACK_INTERVAL_MS);
  }

  private resolveObjectTransition(): {
    currentText: string;
    domObjName: string;
    nextObjName: string;
    currentRef: number;
  } {
    this.stopTimer();
    const list = this.steps();
    const domObjName = this.committedObjectName();
    return {
      currentText: list[list.length - 1].memoryText,
      domObjName,
      nextObjName: resolveNextObjectName(domObjName, this.draftObjectName()),
      currentRef: this.objectRefId(),
    };
  }

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying.set(false);
  }
}
