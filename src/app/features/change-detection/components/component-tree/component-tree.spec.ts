import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { buildChangeDetectionSteps } from '../../utils/cd-simulation.util';
import { ComponentTree } from './component-tree';

describe('ComponentTree', () => {
  let fixture: ComponentFixture<ComponentTree>;
  let component: ComponentTree;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentTree],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentTree);
    component = fixture.componentInstance;
  });

  it('should render Eager tree with CheckAlways metrics, nodes, and memory vs DOM badge', () => {
    const steps = buildChangeDetectionSteps(
      { mode: 'zone-js', scenario: 'click' },
      'counter',
      1,
      2
    );
    fixture.componentRef.setInput('tree', steps[5].trees.eager);
    fixture.componentRef.setInput('mode', 'zone-js');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('ChangeDetectionStrategy.Eager');
    expect(el.textContent).toContain('Verifica toda a árvore a cada ciclo');
    expect(el.querySelector('[data-testid="metric-checked"]')?.textContent).toContain('7/7');
    expect(el.querySelector('[data-testid="metric-skipped"]')?.textContent).toContain('0');
    expect(el.querySelector('[data-testid="metric-wasted"]')?.textContent).toContain('6');
    expect(el.querySelector('[data-testid="metric-traversal"]')).toBeNull();
    expect(el.querySelector('[data-testid="metric-stale"]')).toBeNull();

    const counterNode = el.querySelector('button[data-node="counter"]') as HTMLButtonElement;
    expect(counterNode.getAttribute('data-status')).toBe('updated');
    expect(counterNode.getAttribute('data-strategy')).toBe('eager');
    expect(counterNode.textContent).toContain('<app-counter>');
    expect(counterNode.textContent).toContain('DOM: 2 | Mem: 2');
    expect(counterNode.querySelector('[data-testid="node-mem-dom"]')?.className).toContain(
      'border-ng-success'
    );
    expect(el.querySelector('[data-testid="tree-summary-note"]')?.textContent).toContain('7/7');
  });

  it('should render Zoneless OnPush tree with padrão v22 badge, traversal metric, and highlight all shared-signal targets', () => {
    const steps = buildChangeDetectionSteps(
      { mode: 'zoneless', scenario: 'shared-signal' },
      'counter',
      3,
      4
    );
    fixture.componentRef.setInput('tree', steps[1].trees['on-push']);
    fixture.componentRef.setInput('mode', 'zoneless');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('ChangeDetectionStrategy.OnPush');
    expect(el.textContent).toContain('padrão v22');
    expect(el.textContent).toContain('Atualiza só o consumidor do Signal');
    expect(el.querySelector('[data-testid="metric-traversal"]')?.textContent).toContain('3');

    const counterNode = el.querySelector('button[data-node="counter"]') as HTMLButtonElement;
    const profileNode = el.querySelector('button[data-node="profile"]') as HTMLButtonElement;
    const statsNode = el.querySelector('button[data-node="stats"]') as HTMLButtonElement;

    expect(counterNode.getAttribute('data-status')).toBe('dirty');
    expect(counterNode.className).toContain('ring-ng-purple/60');
    expect(profileNode.className).toContain('ring-ng-purple/60');
    expect(statsNode.className).not.toContain('ring-ng-purple/60');
    expect(counterNode.textContent).toContain('DOM: 3 | Mem: 4');
    expect(counterNode.querySelector('[data-testid="node-mem-dom"]')?.className).toContain(
      'border-ng-warning'
    );
  });

  it('should render Zone.js OnPush timeout stale metric and emit triggerNode when clicking a node', () => {
    const steps = buildChangeDetectionSteps(
      { mode: 'zone-js', scenario: 'timeout' },
      'counter',
      1,
      2
    );
    fixture.componentRef.setInput('tree', steps[5].trees['on-push']);
    fixture.componentRef.setInput('mode', 'zone-js');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Marca Dirty do alvo até a raiz');
    expect(el.textContent).not.toContain('padrão v22');
    expect(el.querySelector('[data-testid="metric-stale"]')?.textContent).toContain('1');
    const counterNode = el.querySelector('button[data-node="counter"]') as HTMLButtonElement;
    expect(counterNode.querySelector('[data-testid="node-mem-dom"]')?.className).toContain(
      'border-ng-error'
    );

    const emitSpy = vi.spyOn(component.triggerNode, 'emit');
    const profileNode = el.querySelector('button[data-node="profile"]') as HTMLButtonElement;
    profileNode.click();
    expect(emitSpy).toHaveBeenCalledWith('profile');
  });
});
