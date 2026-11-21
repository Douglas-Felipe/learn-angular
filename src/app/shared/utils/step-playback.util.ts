import { DestroyRef, inject, signal, Signal } from '@angular/core';

export interface StepPlayback {
  readonly stepIndex: Signal<number>;
  readonly isPlaying: Signal<boolean>;
  prev(): void;
  next(): void;
  goTo(index: number): void;
  reset(): void;
  stop(): void;
  togglePlay(): void;
}

/**
 * Creates a signal-backed step playback controller tied to the current injection context's DestroyRef.
 */
export function createStepPlayback(totalSteps: Signal<number>, intervalMs: number): StepPlayback {
  const destroyRef = inject(DestroyRef);
  const stepIndexSignal = signal(0);
  const isPlayingSignal = signal(false);
  let timerId: ReturnType<typeof setInterval> | null = null;

  const stop = (): void => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    isPlayingSignal.set(false);
  };

  destroyRef.onDestroy(stop);

  const advanceOne = (): void => {
    const nextIndex = stepIndexSignal() + 1;
    const lastIndex = totalSteps() - 1;
    if (nextIndex <= lastIndex) {
      stepIndexSignal.set(nextIndex);
    }
    if (nextIndex >= lastIndex) {
      stop();
    }
  };

  return {
    stepIndex: stepIndexSignal.asReadonly(),
    isPlaying: isPlayingSignal.asReadonly(),

    stop,

    prev(): void {
      stop();
      if (stepIndexSignal() > 0) {
        stepIndexSignal.update((i) => i - 1);
      }
    },

    next(): void {
      stop();
      if (stepIndexSignal() < totalSteps() - 1) {
        stepIndexSignal.update((i) => i + 1);
      }
    },

    goTo(index: number): void {
      stop();
      if (index >= 0 && index < totalSteps()) {
        stepIndexSignal.set(index);
      }
    },

    reset(): void {
      stop();
      stepIndexSignal.set(0);
    },

    togglePlay(): void {
      if (isPlayingSignal()) {
        stop();
        return;
      }
      const count = totalSteps();
      if (count <= 1) {
        return;
      }
      if (stepIndexSignal() >= count - 1) {
        stepIndexSignal.set(0);
      }
      isPlayingSignal.set(true);
      timerId = setInterval(advanceOne, intervalMs);
    },
  };
}
