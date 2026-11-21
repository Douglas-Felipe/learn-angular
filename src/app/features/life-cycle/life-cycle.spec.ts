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

  it('should stop active playback timer on pause, navigation, mutations, mount, destroy, and component destruction', () => {
    vi.useFakeTimers();

    // Pause must actually clear interval (advancing time should not move step)
    clickButton('Play');
    vi.advanceTimersByTime(1100);
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngOnChanges()');

    clickButton('Pausar');
    vi.advanceTimersByTime(1100 * 3);
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    expect(text()).toContain('Play');

    // Resuming from middle step should NOT reset to step 0
    clickButton('Play');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    vi.advanceTimersByTime(1100);
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngOnInit()');

    // prev() stops playback
    clickButton('Hook anterior');
    expect(text()).toContain('Play');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    vi.advanceTimersByTime(1100 * 2);
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngOnChanges()');

    // goToHook() stops playback
    clickButton('Play');
    (el().querySelector('app-dom-tree button[data-hook="ngDoCheck"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(text()).toContain('Play');
    expect(text()).toContain('Breakpoint: ngDoCheck()');

    // updateText() stops playback, resets stepIndex to 0, and syncs draftText to fallback
    clickButton('Play');
    const textInput = el().querySelector('#card-text-input') as HTMLInputElement;
    textInput.value = '   ';
    textInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    clickButton('Atualizar');
    expect(text()).toContain('Play');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    expect(textInput.value).toBe('Texto Atualizado!');

    // Advance to step 2 before mutateObject() -> stops playback, resets to step 0, syncs draftObjectName
    (el().querySelector('app-dom-tree button[data-hook="ngAfterContentChecked"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngAfterContentChecked()');
    clickButton('Play');
    const objInput = el().querySelector('#card-object-input') as HTMLInputElement;
    objInput.value = '   ';
    objInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    clickButton('Mutar atributo');
    expect(text()).toContain('Play');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    expect(objInput.value).toBe('Alan Turing');

    // recreateObject() with blank input syncs draftObjectName to fallback and increments ref
    objInput.value = '   ';
    objInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    clickButton('Recriar objeto');
    expect(objInput.value).toBe('Alan Turing');
    expect(text()).toContain('Na memória (ref #2): { nome: "Alan Turing" }');

    // recreateObject() twice -> increments ref #2 -> #3, stops playback, resets to step 0
    (el().querySelector('app-dom-tree button[data-hook="ngAfterViewChecked"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    clickButton('Play');
    objInput.value = 'Linus Torvalds';
    objInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    clickButton('Recriar objeto');
    expect(text()).toContain('Play');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    expect(el().querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain('Alan Turing');
    expect(el().querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain('ref #2');
    expect(text()).toContain('Na memória (ref #3): { nome: "Linus Torvalds" }');
    expect(objInput.value).toBe('Linus Torvalds');

    // destroy() stops playback and resets stepIndex to 0
    (el().querySelector('app-dom-tree button[data-hook="ngDoCheck"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    clickButton('Play');
    clickButton('Destruir');
    expect(text()).toContain('Play');
    expect(text()).toContain('Breakpoint: ngOnDestroy()');

    // mount() stops playback, trims values, resets refId to 1, committedObjectName, and stepIndex to 0
    textInput.value = '  Texto Limpo  ';
    textInput.dispatchEvent(new Event('input'));
    objInput.value = '  Katherine Johnson  ';
    objInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    clickButton('Montar');
    expect(text()).toContain('Breakpoint: constructor()');
    expect(textInput.value).toBe('Texto Limpo');
    expect(objInput.value).toBe('Katherine Johnson');
    expect(text()).toContain("readonly texto = input('Texto Limpo');");
    expect(text()).toContain('// ref #1');

    clickButton('Próximo hook');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    expect(text()).toContain("readonly usuario = input({ nome: 'Katherine Johnson' });");

    // Verify mount() also reset committedObjectName and objectRefId to 1 for subsequent transitions
    clickButton('Recriar objeto');
    expect(el().querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain(
      'Katherine Johnson'
    );
    expect(el().querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain('ref #1');
    expect(text()).toContain('Na memória (ref #2): { nome: "Ada Lovelace" }');

    // Calling mount while playing at a later step stops timer and resets to step 0
    (el().querySelector('app-dom-tree button[data-hook="ngDoCheck"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    clickButton('Play');
    clickButton('Montar');
    expect(text()).toContain('Play');
    expect(text()).toContain('Breakpoint: constructor()');

    // Component destroy clears interval via DestroyRef
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    clickButton('Play');
    fixture.destroy();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('should enforce stepIndex boundaries and keep state unchanged when unmounted or hook is absent', () => {
    const internal = component as unknown as {
      stepIndex: () => number;
      steps: () => { hook: string }[];
      prev: () => void;
      next: () => void;
      goToHook: (id: string) => void;
      updateText: () => void;
      destroy: () => void;
      mutateObject: () => void;
      recreateObject: () => void;
    };

    // prev() at index 0 stays at 0
    expect(internal.stepIndex()).toBe(0);
    internal.prev();
    expect(internal.stepIndex()).toBe(0);

    // goToHook() for hook absent from current cycle keeps index unchanged
    internal.goToHook('ngOnDestroy');
    expect(internal.stepIndex()).toBe(0);

    // next() at last step stays at last step
    internal.goToHook('afterEveryRender');
    const lastIdx = internal.steps().length - 1;
    expect(internal.stepIndex()).toBe(lastIdx);
    internal.next();
    expect(internal.stepIndex()).toBe(lastIdx);

    // When unmounted, updateText/mutateObject/recreateObject/destroy must not alter steps
    clickButton('Destruir');
    expect(internal.steps()).toHaveLength(1);
    expect(internal.steps()[0].hook).toBe('ngOnDestroy');

    internal.updateText();
    expect(internal.steps()).toHaveLength(1);
    expect(internal.steps()[0].hook).toBe('ngOnDestroy');

    internal.mutateObject();
    expect(internal.steps()).toHaveLength(1);
    expect(internal.steps()[0].hook).toBe('ngOnDestroy');

    internal.recreateObject();
    expect(internal.steps()).toHaveLength(1);
    expect(internal.steps()[0].hook).toBe('ngOnDestroy');

    const destroyRef = internal.steps();
    internal.destroy();
    expect(internal.steps()).toBe(destroyRef);
  });
});
