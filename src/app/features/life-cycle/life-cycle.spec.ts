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
    expect(card?.className).toContain('border-ng-secondary');
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

  it('should step forward and backward and render DOM text through ngAfterViewInit() and afterRender hooks', () => {
    clickButton('Próximo ▶');
    expect(text()).toContain('Breakpoint: ngOnChanges()');
    expect(el().querySelector('article')?.className).toContain('border-ng-warning');

    clickButton('◀ Anterior');
    expect(el().querySelector('app-dom-tree')).toBeTruthy();
    expect(text()).toContain('Árvore de Execução & Mudança do DOM');
    expect(text()).toContain('Breakpoint: constructor()');

    // Jump to step 5 (ngAfterContentInit)
    clickButton('5. ngAfterContentInit');
    expect(text()).toContain('Breakpoint: ngAfterContentInit()');
    expect(el().querySelector('article')?.className).toContain('border-ng-accent');
    expect(text()).toContain('DOM ainda não montado...');

    // Jump to step 7 (ngAfterViewInit) via pill
    clickButton('7. ngAfterViewInit');
    expect(text()).toContain('Breakpoint: ngAfterViewInit()');
    expect(el().querySelector('article')?.className).toContain('border-ng-success');
    expect(text()).toContain('Olá, Angular!');

    // Step through ngAfterViewChecked -> afterNextRender -> afterEveryRender
    clickButton('Próximo ▶');
    expect(text()).toContain('Breakpoint: ngAfterViewChecked()');

    clickButton('Próximo ▶');
    expect(text()).toContain('Breakpoint: afterNextRender()');

    clickButton('Próximo ▶');
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

    clickButton('Próximo ▶');
    expect(text()).toContain('Breakpoint: ngDoCheck()');
    expect(el().querySelector('article')?.className).toContain('border-ng-primary');
    expect(text()).toContain('DOM: "Olá, Angular!" → Pendente: "Signals em Ação"');

    clickButton('Próximo ▶');
    expect(text()).toContain('Breakpoint: ngAfterContentChecked()');
    expect(el().querySelector('article')?.className).toContain('border-ng-accent');
    expect(text()).toContain('Na memória: "Signals em Ação"');

    clickButton('Próximo ▶');
    expect(text()).toContain('Breakpoint: ngAfterViewChecked()');
    expect(el().querySelector('article')?.className).toContain('border-ng-success');
    expect(text()).not.toContain('aguardando ngAfterViewChecked');
    expect(text()).toContain('DOM sincronizado: "Signals em Ação"');

    clickButton('Próximo ▶');
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
    expect(el().querySelector('article')?.className).toContain('border-ng-error');
    expect(text()).toContain('Instância destruída (removida do DOM)');

    clickButton('Montar');
    expect(el().querySelector('app-dom-tree')).toBeTruthy();
    expect(text()).toContain('Árvore de Execução & Mudança do DOM');
    expect(text()).toContain('Breakpoint: constructor()');
  });

  it('should play and pause debugger automatically', () => {
    vi.useFakeTimers();

    clickButton('▶ Play');
    expect(text()).toContain('⏸ Pausar');

    vi.advanceTimersByTime(1100);
    fixture.detectChanges();
    expect(text()).toContain('Breakpoint: ngOnChanges()');

    clickButton('⏸ Pausar');
    expect(text()).toContain('▶ Play');
  });

  it('should copy debug code snippet from card-demo.component.ts header', () => {
    vi.useFakeTimers();
    const copyBtn = el().querySelector('[data-testid="copy-debug-code-btn"]') as HTMLButtonElement;
    expect(copyBtn).toBeTruthy();
    expect(copyBtn.textContent).toContain('Copiar');

    copyBtn.click();
    fixture.detectChanges();
    expect(copyBtn.textContent).toContain('Copiado!');

    vi.advanceTimersByTime(1800);
    fixture.detectChanges();
    expect(copyBtn.textContent).toContain('Copiar');
  });
});
