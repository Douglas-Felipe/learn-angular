import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CodeDebugger } from './components/code-debugger/code-debugger';
import { DemoCard } from './components/demo-card/demo-card';
import { DomTree } from './components/dom-tree/dom-tree';
import { DebugStep, HookId } from './interfaces/life-cycle.interface';
import {
  DEFAULT_CARD_TEXT,
  HOOK_THEMES,
  PLAYBACK_INTERVAL_MS,
  buildDestroySteps,
  buildMountSteps,
  buildUpdateSteps,
  resolveNextCardText,
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

  protected readonly current = computed(() => this.steps()[this.stepIndex()]);
  protected readonly currentTheme = computed(() => HOOK_THEMES[this.current().hook]);
  protected readonly cycleHookIds = computed(() => this.steps().map((s) => s.hook));
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
    this.steps.set(buildUpdateSteps(prev, next));
    this.stepIndex.set(0);
  }

  protected mount(): void {
    this.stopTimer();
    const text = this.draftText().trim() || DEFAULT_CARD_TEXT;
    this.draftText.set(text);
    this.steps.set(buildMountSteps(text));
    this.stepIndex.set(0);
  }

  protected destroy(): void {
    if (!this.isMountedTarget()) {
      return;
    }

    this.stopTimer();
    const list = this.steps();
    const prev = list[list.length - 1].memoryText;
    this.steps.set(buildDestroySteps(prev));
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

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying.set(false);
  }
}
