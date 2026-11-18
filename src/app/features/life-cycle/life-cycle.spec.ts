import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { LifeCycle } from './life-cycle';

describe('LifeCycle', () => {
  let component: LifeCycle;
  let fixture: ComponentFixture<LifeCycle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeCycle],
    }).compileComponents();

    fixture = TestBed.createComponent(LifeCycle);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  function text(): string {
    return el().textContent ?? '';
  }

  it('should create paused at constructor() with purple theme, code usage examples, and no label or color name', () => {
    expect(component).toBeTruthy();
    const card = el().querySelector('article[aria-label="Card de Demonstração"]');
    expect(card?.className).toContain('ng-card');
    const domCard = el().querySelector('[data-testid="dom-render-card"]');
    expect(domCard?.className).toContain('border-zinc-700');
    expect(card?.textContent).not.toContain('Roxo');
    expect(el().querySelector('label')).toBeNull();
    expect(el().querySelector('app-dom-tree')).toBeTruthy();
    expect(text()).toContain('Árvore de Execução & Mudança do DOM');
    expect(text()).toContain('Breakpoint: constructor()');
    expect(text()).toContain("readonly texto = input(");
    expect(text()).toContain('// Injetar serviços e dependências');
    expect(text()).toContain('private service = inject(DataService);');
    expect(text()).toContain('ngAfterContentInit()');
    expect(text()).toContain('ngAfterContentChecked()');
    expect(text()).toContain('afterNextRender(() =>');
    expect(text()).toContain('afterEveryRender(() =>');
    expect(text()).toContain('// [DEBUG] this = CardDemoComponent {}');
    expect(text()).toContain('DOM ainda não montado...');
  });

  it('should step through hooks using the execution tree nodes and render DOM text', () => {
    // Jump to ngOnChanges via tree node click
    const onChangesNode = el().querySelector(
      'app-dom-tree button[data-hook="ngOnChanges"]'
    ) as HTMLButtonElement;
    onChangesNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    expect(el().querySelector('article')?.className).toContain('ng-card');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-zinc-700');

    // Jump to step constructor
    const constructorNode = el().querySelector(
      'app-dom-tree button[data-hook="constructor"]'
    ) as HTMLButtonElement;
    constructorNode.click();
    fixture.detectChanges();
    expect(el().querySelector('app-dom-tree')).toBeTruthy();
    expect(text()).toContain('Árvore de Execução & Mudança do DOM');
    expect(text()).toContain('Breakpoint: constructor()');

    // Jump to ngAfterContentInit
    const contentInitNode = el().querySelector(
      'app-dom-tree button[data-hook="ngAfterContentInit"]'
    ) as HTMLButtonElement;
    contentInitNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngAfterContentInit()');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-zinc-700');
    expect(text()).toContain('DOM ainda não montado...');

    // Jump to ngAfterViewInit
    const viewInitNode = el().querySelector(
      'app-dom-tree button[data-hook="ngAfterViewInit"]'
    ) as HTMLButtonElement;
    viewInitNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngAfterViewInit()');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-ng-success');
    expect(text()).toContain('Olá, Angular!');

    // Step through ngAfterViewChecked -> afterNextRender -> afterEveryRender via tree
    const viewCheckedNode = el().querySelector(
      'app-dom-tree button[data-hook="ngAfterViewChecked"]'
    ) as HTMLButtonElement;
    viewCheckedNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngAfterViewChecked()');

    const nextRenderNode = el().querySelector(
      'app-dom-tree button[data-hook="afterNextRender"]'
    ) as HTMLButtonElement;
    nextRenderNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: afterNextRender()');

    const everyRenderNode = el().querySelector(
      'app-dom-tree button[data-hook="afterEveryRender"]'
    ) as HTMLButtonElement;
    everyRenderNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: afterEveryRender()');
  });

  it('should update card text through ngOnChanges -> ngDoCheck -> ngAfterContentChecked -> ngAfterViewChecked -> afterEveryRender', () => {
    const input = el().querySelector('#card-text-input') as HTMLInputElement;
    input.value = 'Signals em Ação';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    clickButton('Atualizar');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    expect(text()).toContain('Olá, Angular!');
    expect(text()).toContain('Na memória: "Signals em Ação"');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-white');

    const doCheckNode = el().querySelector(
      'app-dom-tree button[data-hook="ngDoCheck"]'
    ) as HTMLButtonElement;
    doCheckNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngDoCheck()');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-white');
    expect(text()).toContain('DOM: "Olá, Angular!" → Pendente: "Signals em Ação"');

    const contentCheckedNode = el().querySelector(
      'app-dom-tree button[data-hook="ngAfterContentChecked"]'
    ) as HTMLButtonElement;
    contentCheckedNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngAfterContentChecked()');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-white');
    expect(text()).toContain('Na memória: "Signals em Ação"');

    const viewCheckedNode = el().querySelector(
      'app-dom-tree button[data-hook="ngAfterViewChecked"]'
    ) as HTMLButtonElement;
    viewCheckedNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngAfterViewChecked()');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-ng-success');
    expect(text()).not.toContain('aguardando ngAfterViewChecked');
    expect(text()).toContain('DOM sincronizado: "Signals em Ação"');

    const everyRenderNode = el().querySelector(
      'app-dom-tree button[data-hook="afterEveryRender"]'
    ) as HTMLButtonElement;
    everyRenderNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: afterEveryRender()');
    expect(text()).toContain('Signals em Ação');

    // Jump via tree node click back to ngOnChanges
    const onChangesNode = el().querySelector(
      'app-dom-tree button[data-hook="ngOnChanges"]'
    ) as HTMLButtonElement;
    onChangesNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngOnChanges()');
  });

  it('should destroy with red ngOnDestroy state and remount via Montar', () => {
    clickButton('Destruir');
    expect(text()).toContain('Breakpoint: ngOnDestroy()');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-ng-error');
    expect(text()).toContain('Instância destruída (removida do DOM)');

    clickButton('Montar');
    expect(el().querySelector('app-dom-tree')).toBeTruthy();
    expect(text()).toContain('Árvore de Execução & Mudança do DOM');
    expect(text()).toContain('Breakpoint: constructor()');
  });

  it('should play, pause, step forward and backward inside demo card', () => {
    vi.useFakeTimers();

    clickButton('Play');
    expect(text()).toContain('Pausar');

    vi.advanceTimersByTime(1100);
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngOnChanges()');

    clickButton('Pausar');
    expect(text()).toContain('Play');

    clickButton('Próximo hook');
    expect(text()).toContain('Breakpoint: ngOnInit()');

    clickButton('Hook anterior');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
  });

  it('should auto-stop timer when reaching the last step during playback and reset to step 0 if restarted', () => {
    vi.useFakeTimers();

    // Advance to last step
    const everyRenderNode = el().querySelector(
      'app-dom-tree button[data-hook="afterEveryRender"]'
    ) as HTMLButtonElement;
    everyRenderNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: afterEveryRender()');

    // Starting play at last step resets to step 0
    clickButton('Play');
    expect(text()).toContain('Breakpoint: constructor()');
    expect(text()).toContain('Pausar');

    // Fast-forward until all remaining steps complete
    vi.advanceTimersByTime(1100 * 10);
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: afterEveryRender()');
    expect(text()).toContain('Play');
  });

  it('should ignore text updates and destroy actions when already unmounted', () => {
    clickButton('Destruir');
    expect(text()).toContain('Breakpoint: ngOnDestroy()');

    // Trying to submit or destroy when unmounted
    const form = el().querySelector('form');
    form?.dispatchEvent(new Event('submit'));
    const internal = component as unknown as {
      destroy: () => void;
      mutateObject: () => void;
      recreateObject: () => void;
      prev: () => void;
      next: () => void;
      goToHook: (id: string) => void;
      draftText: { set: (val: string) => void };
      draftObjectName: { set: (val: string) => void };
      mount: () => void;
    };
    internal.destroy();
    internal.mutateObject();
    internal.recreateObject();
    internal.prev();
    internal.next();
    internal.goToHook('constructor');
    internal.draftText.set('   ');
    internal.draftObjectName.set('   ');
    internal.mount();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: constructor()');
    expect(text()).toContain("readonly usuario = input({ nome: 'Ada Lovelace' });");
  });

  it('should ignore ngOnChanges on object attribute mutation and trigger full update cycle on object recreation', () => {
    const objInput = el().querySelector('#card-object-input') as HTMLInputElement;
    objInput.value = 'Grace Hopper';
    objInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // 1. Mutar atributo sem trocar referência
    clickButton('Mutar atributo');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    expect(text()).toContain('Ciclo ignorado (mesma referência)');
    expect(text()).toContain('ngOnChanges ignorado (mesma ref)');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-ng-warning');
    expect(el().querySelector('[data-testid="mutation-ignored-alert"]')?.textContent).toContain(
      'Mutação ignorada (ref #1 === ref #1)'
    );
    expect(el().querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain('Ada Lovelace');
    expect(text()).toContain('IGNORADO! ref #1 === ref #1');
    expect(
      el()
        .querySelector('app-dom-tree button[data-hook="ngDoCheck"]')
        ?.getAttribute('data-status')
    ).toBe('skipped');

    // 2. Recriar objeto com nova referência
    objInput.value = 'Margaret Hamilton';
    objInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    clickButton('Recriar objeto');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    expect(text()).toContain('Recebimento de input()');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-white');
    expect(el().querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain('Ada Lovelace');
    expect(el().querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain('ref #1');
    expect(text()).toContain('Na memória (ref #2): { nome: "Margaret Hamilton" }');

    // Avançar para ngAfterViewChecked -> DOM atualizado com o novo objeto e ref #2
    const viewCheckedNode = el().querySelector(
      'app-dom-tree button[data-hook="ngAfterViewChecked"]'
    ) as HTMLButtonElement;
    viewCheckedNode.click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngAfterViewChecked()');
    expect(el().querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-ng-success');
    expect(el().querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain(
      'Margaret Hamilton'
    );
    expect(el().querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain('ref #2');
    expect(text()).toContain('DOM sincronizado: "Margaret Hamilton"');
  });
});
