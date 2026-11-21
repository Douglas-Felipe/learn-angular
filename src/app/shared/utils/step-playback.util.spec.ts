import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { createStepPlayback, StepPlayback } from './step-playback.util';

@Component({ template: '' })
class TestPlaybackHost {
  readonly totalSteps = signal(4);
  readonly playback: StepPlayback = createStepPlayback(this.totalSteps, 1000);
}

describe('createStepPlayback', () => {
  let fixture: ComponentFixture<TestPlaybackHost>;
  let host: TestPlaybackHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPlaybackHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPlaybackHost);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should navigate prev, next, goTo, and reset while enforcing boundaries', () => {
    expect(host.playback.stepIndex()).toBe(0);
    expect(host.playback.isPlaying()).toBe(false);

    host.playback.prev();
    expect(host.playback.stepIndex()).toBe(0);

    host.playback.next();
    expect(host.playback.stepIndex()).toBe(1);

    host.playback.goTo(-1);
    expect(host.playback.stepIndex()).toBe(1);

    host.playback.goTo(4);
    expect(host.playback.stepIndex()).toBe(1);

    host.playback.goTo(3);
    expect(host.playback.stepIndex()).toBe(3);

    host.playback.next();
    expect(host.playback.stepIndex()).toBe(3);

    host.playback.prev();
    expect(host.playback.stepIndex()).toBe(2);

    host.playback.reset();
    expect(host.playback.stepIndex()).toBe(0);
  });

  it('should auto-advance, pause, resume from middle, stop at end, and restart from step 0', () => {
    vi.useFakeTimers();

    host.playback.togglePlay();
    expect(host.playback.isPlaying()).toBe(true);

    vi.advanceTimersByTime(1000);
    expect(host.playback.stepIndex()).toBe(1);

    // Pause keeps current step and stops timer
    host.playback.togglePlay();
    expect(host.playback.isPlaying()).toBe(false);
    vi.advanceTimersByTime(3000);
    expect(host.playback.stepIndex()).toBe(1);

    // Resume from middle continues forward rather than resetting to 0
    host.playback.togglePlay();
    expect(host.playback.isPlaying()).toBe(true);
    expect(host.playback.stepIndex()).toBe(1);

    vi.advanceTimersByTime(1000);
    expect(host.playback.stepIndex()).toBe(2);
    expect(host.playback.isPlaying()).toBe(true);

    // Reaching last step stops playback automatically
    vi.advanceTimersByTime(1000);
    expect(host.playback.stepIndex()).toBe(3);
    expect(host.playback.isPlaying()).toBe(false);

    vi.advanceTimersByTime(3000);
    expect(host.playback.stepIndex()).toBe(3);

    // Restarting from last step resets to 0
    host.playback.togglePlay();
    expect(host.playback.stepIndex()).toBe(0);
    expect(host.playback.isPlaying()).toBe(true);
  });

  it('should stop active playback when prev, next, goTo, or reset are invoked manually', () => {
    vi.useFakeTimers();

    host.playback.togglePlay();
    host.playback.next();
    expect(host.playback.isPlaying()).toBe(false);
    expect(host.playback.stepIndex()).toBe(1);
    vi.advanceTimersByTime(2000);
    expect(host.playback.stepIndex()).toBe(1);

    host.playback.togglePlay();
    host.playback.prev();
    expect(host.playback.isPlaying()).toBe(false);
    expect(host.playback.stepIndex()).toBe(0);

    host.playback.togglePlay();
    host.playback.goTo(2);
    expect(host.playback.isPlaying()).toBe(false);
    expect(host.playback.stepIndex()).toBe(2);

    host.playback.togglePlay();
    host.playback.reset();
    expect(host.playback.isPlaying()).toBe(false);
    expect(host.playback.stepIndex()).toBe(0);
  });

  it('should not start playback when totalSteps <= 1 and should stop safely if totalSteps shrinks mid-playback', () => {
    vi.useFakeTimers();

    host.totalSteps.set(1);
    host.playback.togglePlay();
    expect(host.playback.isPlaying()).toBe(false);

    host.totalSteps.set(0);
    host.playback.togglePlay();
    expect(host.playback.isPlaying()).toBe(false);

    host.totalSteps.set(4);
    host.playback.togglePlay();
    vi.advanceTimersByTime(1000);
    expect(host.playback.stepIndex()).toBe(1);

    // Shrink totalSteps below current stepIndex while timer is running
    host.totalSteps.set(1);
    vi.advanceTimersByTime(1000);
    expect(host.playback.stepIndex()).toBe(1);
    expect(host.playback.isPlaying()).toBe(false);
  });

  it('should clear active interval on host destroy', () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');

    host.playback.togglePlay();
    fixture.destroy();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
