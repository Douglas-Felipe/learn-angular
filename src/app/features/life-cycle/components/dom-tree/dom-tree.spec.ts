import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { HookId } from '../../interfaces/life-cycle.interface';
import { DomTree } from './dom-tree';

describe('DomTree', () => {
  let component: DomTree;
  let fixture: ComponentFixture<DomTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomTree],
    }).compileComponents();

    fixture = TestBed.createComponent(DomTree);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('hook', 'constructor');
    fixture.componentRef.setInput('mounted', false);
    fixture.componentRef.setInput('domText', '');
    fixture.componentRef.setInput('memoryText', '');
    fixture.detectChanges();
  });

  function el(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function text(): string {
    return el().textContent ?? '';
  }

  function nodeBtn(id: HookId): HTMLButtonElement {
    const match = el().querySelector(`button[data-hook="${id}"]`) as HTMLButtonElement | null;
    if (!match) {
      throw new Error(`Tree hook node "${id}" not found`);
    }
    return match;
  }

  it('should render the Angular execution-order tree with all 11 hooks and subgraphs', () => {
    expect(component).toBeTruthy();
    expect(text()).toContain('Creation');
    expect(text()).toContain('Change Detection');
    expect(text()).toContain('Content');
    expect(text()).toContain('View');
    expect(text()).toContain('Rendering (DOM)');
    expect(text()).toContain('Destruction');

    const allHooks: HookId[] = [
      'constructor',
      'ngOnChanges',
      'ngOnInit',
      'ngDoCheck',
      'ngAfterContentInit',
      'ngAfterContentChecked',
      'ngAfterViewInit',
      'ngAfterViewChecked',
      'afterNextRender',
      'afterEveryRender',
      'ngOnDestroy',
    ];
    for (const id of allHooks) {
      expect(nodeBtn(id)).toBeTruthy();
    }
  });

  it('should highlight active hook node and track completed, upcoming, and skipped statuses', () => {
    fixture.componentRef.setInput('cycleHooks', [
      'ngOnChanges',
      'ngDoCheck',
      'ngAfterContentChecked',
      'ngAfterViewChecked',
      'afterEveryRender',
    ]);
    fixture.componentRef.setInput('hook', 'ngDoCheck');
    fixture.componentRef.setInput('mounted', true);
    fixture.componentRef.setInput('domText', 'Antes');
    fixture.componentRef.setInput('memoryText', 'Depois');
    fixture.detectChanges();

    expect(nodeBtn('ngOnChanges').getAttribute('data-status')).toBe('completed');
    expect(nodeBtn('ngDoCheck').getAttribute('data-status')).toBe('active');
    expect(nodeBtn('ngDoCheck').className).toContain('border-ng-primary');
    expect(nodeBtn('ngAfterViewChecked').getAttribute('data-status')).toBe('upcoming');
    expect(nodeBtn('ngOnInit').getAttribute('data-status')).toBe('skipped');
    expect(nodeBtn('ngOnInit').disabled).toBe(true);
    expect(text()).toContain('DOM: "Antes" → Pendente: "Depois"');
  });

  it('should display synchronized DOM summary on view/render hooks and destroyed summary on ngOnDestroy', () => {
    fixture.componentRef.setInput('hook', 'afterNextRender');
    fixture.componentRef.setInput('mounted', true);
    fixture.componentRef.setInput('domText', 'Pronto');
    fixture.componentRef.setInput('memoryText', 'Pronto');
    fixture.detectChanges();

    expect(nodeBtn('afterNextRender').getAttribute('data-status')).toBe('active');
    expect(text()).toContain('DOM sincronizado: "Pronto"');

    fixture.componentRef.setInput('hook', 'ngOnDestroy');
    fixture.componentRef.setInput('mounted', false);
    fixture.componentRef.setInput('domText', '');
    fixture.componentRef.setInput('memoryText', '');
    fixture.detectChanges();

    expect(nodeBtn('ngOnDestroy').getAttribute('data-status')).toBe('active');
    expect(nodeBtn('ngOnDestroy').className).toContain('border-ng-error');
    expect(text()).toContain('DOM removido da tela');
  });

  it('should emit selectHook when clicking an active-cycle tree node', () => {
    const emitted: HookId[] = [];
    component.selectHook.subscribe((id) => emitted.push(id));

    fixture.componentRef.setInput('cycleHooks', ['constructor', 'ngOnChanges', 'ngOnInit']);
    fixture.componentRef.setInput('hook', 'constructor');
    fixture.detectChanges();

    nodeBtn('ngOnInit').click();
    expect(emitted).toEqual(['ngOnInit']);
  });
});
