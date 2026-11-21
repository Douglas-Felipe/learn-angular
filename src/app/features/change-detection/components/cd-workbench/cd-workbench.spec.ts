import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PLAYBACK_INTERVAL_MS } from '../../data/cd-tree.data';
import { CdWorkbench } from './cd-workbench';

describe('CdWorkbench', () => {
  let fixture: ComponentFixture<CdWorkbench>;
  let component: CdWorkbench;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdWorkbench],
    }).compileComponents();

    fixture = TestBed.createComponent(CdWorkbench);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function el(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function clickButton(label: string): void {
    const buttons = Array.from(el().querySelectorAll('button'));
    const match = buttons.find((b) => b.textContent?.includes(label));
    if (!match) {
      throw new Error(`Button "${label}" not found`);
    }
    match.click();
    fixture.detectChanges();
  }

  function clickSelector(selector: string): void {
    const target = el().querySelector(selector) as HTMLButtonElement | null;
    if (!target) {
      throw new Error(`Selector "${selector}" not found`);
    }
    target.click();
    fixture.detectChanges();
  }

  it('should render Zone.js workbench with both trees, legend, exact initial values (1 -> 2), and timeout stale alert', () => {
    fixture.componentRef.setInput('mode', 'zone-js');
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(el().textContent).toContain('Detecção de Mudanças • Zone.js');
    expect(el().querySelector('[data-testid="tree-eager"]')).toBeTruthy();
    expect(el().querySelector('[data-testid="tree-on-push"]')).toBeTruthy();
    expect(el().querySelector('app-cd-code-debugger')).toBeNull();
    expect(el().textContent).toContain('Etapa 1 / 6');
    expect(el().textContent).toContain('Memória != DOM (stale)');
    expect(
      el().querySelector('[data-testid="tree-eager"] button[data-node="counter"]')?.textContent
    ).toContain('DOM: 1 | Mem: 2');

    const clickBtn = el().querySelector('[data-testid="scenario-click"]') as HTMLButtonElement;
    const timeoutBtn = el().querySelector('[data-testid="scenario-timeout"]') as HTMLButtonElement;
    expect(clickBtn.className).toContain('ring-ng-purple/70');
    expect(clickBtn.className).not.toContain('opacity-75');
    expect(timeoutBtn.className).toContain('opacity-75');
    expect(timeoutBtn.className).not.toContain('ring-ng-purple/70');

    clickSelector('[data-testid="scenario-timeout"]');
    expect(timeoutBtn.getAttribute('aria-pressed')).toBe('true');
    expect(timeoutBtn.className).toContain('ring-ng-purple/70');
    expect(clickBtn.className).toContain('opacity-75');

    clickSelector('[data-step-phase="root"]');
    expect(el().textContent).toContain('Etapa 3 / 6');
    expect(el().querySelector('[data-step-phase="trigger"]')?.className).toContain(
      'border-ng-success/40'
    );
    expect(el().querySelector('[data-step-phase="root"]')?.className).toContain('border-ng-purple');
    expect(el().querySelector('[data-step-phase="branch"]')?.className).toContain(
      'border-ng-border'
    );
    expect(el().querySelector('[data-testid="stale-dom-alert"]')?.textContent).toContain(
      'markForCheck'
    );
  });

  it('should render Zoneless mode, increment cycle counter on node clicks, switch to shared-signal, and reset simulation', () => {
    fixture.componentRef.setInput('mode', 'zoneless');
    fixture.detectChanges();

    expect(el().textContent).toContain('Detecção de Mudanças • Zoneless + Signals');
    expect(el().textContent).toContain('padrão v22');
    expect(el().textContent).toContain('Traversal (sem check)');

    clickSelector('[data-testid="tree-on-push"] button[data-node="profile"]');
    expect(el().textContent).toContain('Disparar em Profile');
    expect(el().textContent).toContain('Etapa 1 / 6');
    expect(
      el().querySelector('[data-testid="tree-on-push"] button[data-node="profile"]')?.textContent
    ).toContain('DOM: 2 | Mem: 3');

    clickSelector('[data-testid="scenario-shared-signal"]');
    clickSelector('[data-step-phase="summary"]');
    expect(
      el().querySelector('[data-testid="tree-on-push"] [data-testid="metric-checked"]')?.textContent
    ).toContain('2/7');

    clickSelector('[data-testid="trigger-current-node"]');
    expect(el().textContent).toContain('Etapa 1 / 6');
    expect(
      el().querySelector('[data-testid="tree-on-push"] button[data-node="profile"]')?.textContent
    ).toContain('DOM: 3 | Mem: 4');

    clickSelector('[data-testid="reset-simulation"]');
    expect(el().textContent).toContain('Disparar em Counter');
    expect(
      el().querySelector('[data-testid="tree-on-push"] button[data-node="counter"]')?.textContent
    ).toContain('DOM: 1 | Mem: 2');
    expect(
      el().querySelector('[data-testid="scenario-local-signal"]')?.getAttribute('aria-pressed')
    ).toBe('true');
  });

  it('should play, pause, resume from middle, auto-stop at end, and restart from step 0', () => {
    vi.useFakeTimers();
    fixture.componentRef.setInput('mode', 'zone-js');
    fixture.detectChanges();

    clickButton('Play');
    expect(el().textContent).toContain('Pausar');

    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 2 / 6');

    clickButton('Pausar');
    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS * 3);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 2 / 6');
    expect(el().textContent).toContain('Play');

    // Resuming from step 2 continues to step 3 without resetting to step 1
    clickButton('Play');
    expect(el().textContent).toContain('Etapa 2 / 6');
    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 3 / 6');

    // Fast-forward to last step -> auto-stops
    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS * 3);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 6 / 6');
    expect(el().textContent).toContain('Play');

    // Starting play at last step restarts at step 1
    clickButton('Play');
    expect(el().textContent).toContain('Etapa 1 / 6');
    expect(el().textContent).toContain('Pausar');
  });

  it('should stop active playback on manual next, prev, step pill click, scenario switch, node trigger, and reset', () => {
    vi.useFakeTimers();
    fixture.componentRef.setInput('mode', 'zone-js');
    fixture.detectChanges();

    // Regression: manual next() stops active playback
    clickButton('Play');
    clickButton('Próxima etapa');
    expect(el().textContent).toContain('Play');
    expect(el().textContent).toContain('Etapa 2 / 6');
    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS * 2);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 2 / 6');

    // prev() stops active playback
    clickButton('Play');
    clickButton('Etapa anterior');
    expect(el().textContent).toContain('Play');
    expect(el().textContent).toContain('Etapa 1 / 6');
    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS * 2);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 1 / 6');

    // Step pill click stops active playback
    clickButton('Play');
    clickSelector('[data-step-phase="branch"]');
    expect(el().textContent).toContain('Play');
    expect(el().textContent).toContain('Etapa 4 / 6');
    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS * 2);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 4 / 6');

    // Scenario switch stops active playback
    clickButton('Play');
    clickSelector('[data-testid="scenario-timeout"]');
    expect(el().textContent).toContain('Play');
    expect(el().textContent).toContain('Etapa 1 / 6');
    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS * 2);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 1 / 6');

    // Tree node click stops active playback
    clickButton('Próxima etapa');
    clickButton('Play');
    clickSelector('[data-testid="tree-eager"] button[data-node="stats"]');
    expect(el().textContent).toContain('Play');
    expect(el().textContent).toContain('Etapa 1 / 6');
    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS * 2);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 1 / 6');

    // Reset stops active playback
    clickButton('Próxima etapa');
    clickButton('Play');
    clickSelector('[data-testid="reset-simulation"]');
    expect(el().textContent).toContain('Play');
    expect(el().textContent).toContain('Etapa 1 / 6');
    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS * 2);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 1 / 6');
  });

  it('should enforce transport button disabled states and reset simulation state when mode input changes dynamically', () => {
    vi.useFakeTimers();
    fixture.componentRef.setInput('mode', 'zone-js');
    fixture.detectChanges();

    const prevBtn = el().querySelector('button[aria-label="Etapa anterior"]') as HTMLButtonElement;
    const nextBtn = el().querySelector('button[aria-label="Próxima etapa"]') as HTMLButtonElement;
    expect(prevBtn.disabled).toBe(true);
    expect(nextBtn.disabled).toBe(false);

    clickSelector('[data-testid="tree-eager"] button[data-node="profile"]');
    clickSelector('[data-step-phase="summary"]');
    expect(prevBtn.disabled).toBe(false);
    expect(nextBtn.disabled).toBe(true);
    expect(el().textContent).toContain('Disparar em Profile');

    clickSelector('[data-step-phase="branch"]');
    clickButton('Play');
    expect(el().textContent).toContain('Pausar');

    // Changing mode stops playback and resets targetNodeId, cycleCounter, stepIndex, and scenario
    fixture.componentRef.setInput('mode', 'zoneless');
    fixture.detectChanges();

    expect(el().textContent).toContain('Play');
    expect(el().textContent).toContain('Etapa 1 / 6');
    expect(el().textContent).toContain('Disparar em Counter');
    expect(
      el().querySelector('[data-testid="tree-on-push"] button[data-node="counter"]')?.textContent
    ).toContain('DOM: 1 | Mem: 2');
    expect(
      el().querySelector('[data-testid="scenario-local-signal"]')?.getAttribute('aria-pressed')
    ).toBe('true');

    vi.advanceTimersByTime(PLAYBACK_INTERVAL_MS * 2);
    fixture.detectChanges();
    expect(el().textContent).toContain('Etapa 1 / 6');
  });

  it('should clear active timer when workbench is destroyed', () => {
    vi.useFakeTimers();
    fixture.componentRef.setInput('mode', 'zone-js');
    fixture.detectChanges();

    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    clickButton('Play');
    fixture.destroy();

    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
