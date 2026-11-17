import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { DomTree } from './components/dom-tree/dom-tree';

export type HookId =
  | 'constructor'
  | 'ngOnChanges'
  | 'ngOnInit'
  | 'ngDoCheck'
  | 'ngAfterContentInit'
  | 'ngAfterContentChecked'
  | 'ngAfterViewInit'
  | 'ngAfterViewChecked'
  | 'afterNextRender'
  | 'afterEveryRender'
  | 'ngOnDestroy';

export interface HookTheme {
  id: HookId;
  label: string;
  phaseLabel: string;
  cardClasses: string;
  badgeClasses: string;
  dotClass: string;
  codeActiveClasses: string;
  textClass: string;
}

export interface HookCodeBlock {
  id: HookId;
  signature: string;
  descriptionComment: string;
  exampleLine: string;
  closingBrace?: string;
}

export const HOOK_CODE_BLOCKS: HookCodeBlock[] = [
  {
    id: 'constructor',
    signature: 'constructor()',
    descriptionComment: '// Injetar serviços e dependências',
    exampleLine: 'private service = inject(DataService);',
  },
  {
    id: 'ngOnChanges',
    signature: 'ngOnChanges(changes: SimpleChanges)',
    descriptionComment: '// Reagir quando um input() muda',
    exampleLine: "if (changes['texto']) this.validar(this.texto());",
  },
  {
    id: 'ngOnInit',
    signature: 'ngOnInit()',
    descriptionComment: '// Buscar dados iniciais na montagem',
    exampleLine: 'this.service.carregarDados();',
  },
  {
    id: 'ngDoCheck',
    signature: 'ngDoCheck()',
    descriptionComment: '// Auditar mudanças profundas manualmente',
    exampleLine: 'this.checarMudancaManual();',
  },
  {
    id: 'ngAfterContentInit',
    signature: 'ngAfterContentInit()',
    descriptionComment: '// Quando <ng-content> é projetado pela 1ª vez',
    exampleLine: 'this.validarConteudoProjetado();',
  },
  {
    id: 'ngAfterContentChecked',
    signature: 'ngAfterContentChecked()',
    descriptionComment: '// Após cada verificação do <ng-content>',
    exampleLine: 'this.sincronizarAbasProjetadas();',
  },
  {
    id: 'ngAfterViewInit',
    signature: 'ngAfterViewInit()',
    descriptionComment: '// Acessar elementos do DOM prontos na tela',
    exampleLine: 'this.elementoDom.focus();',
  },
  {
    id: 'ngAfterViewChecked',
    signature: 'ngAfterViewChecked()',
    descriptionComment: '// Ler medidas ou scroll após atualizar o DOM',
    exampleLine: 'this.atualizarPosicaoScroll();',
  },
  {
    id: 'afterNextRender',
    signature: 'afterNextRender(() =>',
    descriptionComment: '// Roda 1x após o browser pintar o DOM na tela',
    exampleLine: 'this.inicializarGraficoTerceiros();',
    closingBrace: '});',
  },
  {
    id: 'afterEveryRender',
    signature: 'afterEveryRender(() =>',
    descriptionComment: '// Roda após toda pintura do DOM no browser',
    exampleLine: 'this.recalcularAlturaDoContainer();',
    closingBrace: '});',
  },
  {
    id: 'ngOnDestroy',
    signature: 'ngOnDestroy()',
    descriptionComment: '// Limpar timers, sockets ou subscriptions',
    exampleLine: 'clearInterval(this.timerId);',
  },
];

export interface DebugStep {
  hook: HookId;
  mounted: boolean;
  domText: string;
  memoryText: string;
  previousText: string;
  explanation: string;
  debugLine: string;
}

const THEME_PALETTE = {
  secondary: {
    cardClasses: 'border-ng-secondary bg-ng-secondary/15',
    badgeClasses: 'border-2 border-ng-secondary bg-ng-secondary/25 text-ng-secondary',
    dotClass: 'bg-ng-secondary',
    codeActiveClasses: 'border-ng-secondary bg-ng-secondary/20 opacity-100',
    textClass: 'text-ng-secondary',
  },
  warning: {
    cardClasses: 'border-ng-warning bg-ng-warning/15',
    badgeClasses: 'border-2 border-ng-warning bg-ng-warning/25 text-ng-warning',
    dotClass: 'bg-ng-warning',
    codeActiveClasses: 'border-ng-warning bg-ng-warning/20 opacity-100',
    textClass: 'text-ng-warning',
  },
  info: {
    cardClasses: 'border-ng-info bg-ng-info/15',
    badgeClasses: 'border-2 border-ng-info bg-ng-info/25 text-ng-info',
    dotClass: 'bg-ng-info',
    codeActiveClasses: 'border-ng-info bg-ng-info/20 opacity-100',
    textClass: 'text-ng-info',
  },
  primary: {
    cardClasses: 'border-ng-primary bg-ng-primary/15',
    badgeClasses: 'border-2 border-ng-primary bg-ng-primary/25 text-ng-primary',
    dotClass: 'bg-ng-primary',
    codeActiveClasses: 'border-ng-primary bg-ng-primary/20 opacity-100',
    textClass: 'text-ng-primary',
  },
  accent: {
    cardClasses: 'border-ng-accent bg-ng-accent/15',
    badgeClasses: 'border-2 border-ng-accent bg-ng-accent/25 text-ng-accent',
    dotClass: 'bg-ng-accent',
    codeActiveClasses: 'border-ng-accent bg-ng-accent/20 opacity-100',
    textClass: 'text-ng-accent',
  },
  success: {
    cardClasses: 'border-ng-success bg-ng-success/15',
    badgeClasses: 'border-2 border-ng-success bg-ng-success/25 text-ng-success',
    dotClass: 'bg-ng-success',
    codeActiveClasses: 'border-ng-success bg-ng-success/20 opacity-100',
    textClass: 'text-ng-success',
  },
  error: {
    cardClasses: 'border-ng-error bg-ng-error/15',
    badgeClasses: 'border-2 border-ng-error bg-ng-error/25 text-ng-error',
    dotClass: 'bg-ng-error',
    codeActiveClasses: 'border-ng-error bg-ng-error/20 opacity-100',
    textClass: 'text-ng-error',
  },
} as const;

export const HOOK_THEMES: Record<HookId, HookTheme> = {
  constructor: {
    id: 'constructor',
    label: 'constructor()',
    phaseLabel: 'Instanciação',
    ...THEME_PALETTE.secondary,
  },
  ngOnChanges: {
    id: 'ngOnChanges',
    label: 'ngOnChanges()',
    phaseLabel: 'Recebimento de input()',
    ...THEME_PALETTE.warning,
  },
  ngOnInit: {
    id: 'ngOnInit',
    label: 'ngOnInit()',
    phaseLabel: 'Inicialização',
    ...THEME_PALETTE.info,
  },
  ngDoCheck: {
    id: 'ngDoCheck',
    label: 'ngDoCheck()',
    phaseLabel: 'Verificação de Mudanças',
    ...THEME_PALETTE.primary,
  },
  ngAfterContentInit: {
    id: 'ngAfterContentInit',
    label: 'ngAfterContentInit()',
    phaseLabel: 'Conteúdo Projetado',
    ...THEME_PALETTE.accent,
  },
  ngAfterContentChecked: {
    id: 'ngAfterContentChecked',
    label: 'ngAfterContentChecked()',
    phaseLabel: 'Conteúdo Projetado Verificado',
    ...THEME_PALETTE.accent,
  },
  ngAfterViewInit: {
    id: 'ngAfterViewInit',
    label: 'ngAfterViewInit()',
    phaseLabel: 'DOM Montado na Tela',
    ...THEME_PALETTE.success,
  },
  ngAfterViewChecked: {
    id: 'ngAfterViewChecked',
    label: 'ngAfterViewChecked()',
    phaseLabel: 'DOM Atualizado na Tela',
    ...THEME_PALETTE.success,
  },
  afterNextRender: {
    id: 'afterNextRender',
    label: 'afterNextRender()',
    phaseLabel: 'Pintura Inicial no Browser',
    ...THEME_PALETTE.success,
  },
  afterEveryRender: {
    id: 'afterEveryRender',
    label: 'afterEveryRender()',
    phaseLabel: 'Pintura Concluída no Browser',
    ...THEME_PALETTE.success,
  },
  ngOnDestroy: {
    id: 'ngOnDestroy',
    label: 'ngOnDestroy()',
    phaseLabel: 'Destruição e Limpeza',
    ...THEME_PALETTE.error,
  },
};

function buildMountSteps(text: string): DebugStep[] {
  return [
    {
      hook: 'constructor',
      mounted: false,
      domText: '',
      memoryText: '',
      previousText: '',
      explanation: 'Instância da classe criada em memória. input() ainda não recebeu valor e não há DOM.',
      debugLine: 'this = CardDemoComponent {} | texto() = undefined',
    },
    {
      hook: 'ngOnChanges',
      mounted: false,
      domText: '',
      memoryText: text,
      previousText: '',
      explanation: 'Primeiro input() recebido em memória antes mesmo do ngOnInit().',
      debugLine: `changes['texto'] = { previousValue: undefined, currentValue: '${text}', firstChange: true }`,
    },
    {
      hook: 'ngOnInit',
      mounted: false,
      domText: '',
      memoryText: text,
      previousText: '',
      explanation: 'Componente inicializado com os primeiros inputs disponíveis na classe.',
      debugLine: `this.texto() === '${text}' (aguardando criação do DOM)`,
    },
    {
      hook: 'ngDoCheck',
      mounted: false,
      domText: '',
      memoryText: text,
      previousText: '',
      explanation: 'Angular avalia as expressões do template para construir os nós HTML.',
      debugLine: `Template dirty check: {{ texto() }} = '${text}'`,
    },
    {
      hook: 'ngAfterContentInit',
      mounted: false,
      domText: '',
      memoryText: text,
      previousText: '',
      explanation: 'Conteúdo projetado via <ng-content> vinculado ao componente pela primeira vez.',
      debugLine: `<ng-content> projetado | texto() = '${text}'`,
    },
    {
      hook: 'ngAfterContentChecked',
      mounted: false,
      domText: '',
      memoryText: text,
      previousText: '',
      explanation: 'Bindings do conteúdo projetado verificados; seguindo para montar a View.',
      debugLine: `Conteúdo projetado verificado (DOM próprio ainda pendente)`,
    },
    {
      hook: 'ngAfterViewInit',
      mounted: true,
      domText: text,
      memoryText: text,
      previousText: '',
      explanation: 'DOM criado e visível na tela! O texto do card foi renderizado.',
      debugLine: `View montada no DOM -> <p>${text}</p>`,
    },
    {
      hook: 'ngAfterViewChecked',
      mounted: true,
      domText: text,
      memoryText: text,
      previousText: '',
      explanation: 'View do componente e views filhas verificadas após a criação inicial.',
      debugLine: `View sincronizada com texto() === '${text}'`,
    },
    {
      hook: 'afterNextRender',
      mounted: true,
      domText: text,
      memoryText: text,
      previousText: '',
      explanation: 'Executado uma única vez após o navegador pintar o DOM inicial na tela.',
      debugLine: `Browser pintou o DOM inicial pela 1ª vez ('${text}')`,
    },
    {
      hook: 'afterEveryRender',
      mounted: true,
      domText: text,
      memoryText: text,
      previousText: '',
      explanation: 'Executado ao final de cada ciclo de renderização no navegador.',
      debugLine: `Renderização finalizada no browser -> <p>${text}</p>`,
    },
  ];
}

function buildUpdateSteps(prevText: string, nextText: string): DebugStep[] {
  return [
    {
      hook: 'ngOnChanges',
      mounted: true,
      domText: prevText,
      memoryText: nextText,
      previousText: prevText,
      explanation: `input() mudou em memória para "${nextText}". No DOM o card ainda exibe "${prevText}".`,
      debugLine: `changes['texto'] = { previousValue: '${prevText}', currentValue: '${nextText}' }`,
    },
    {
      hook: 'ngDoCheck',
      mounted: true,
      domText: prevText,
      memoryText: nextText,
      previousText: prevText,
      explanation: 'Change Detection compara a memória com o DOM e prepara a atualização da View.',
      debugLine: `Dirty check: memória ('${nextText}') !== DOM ('${prevText}')`,
    },
    {
      hook: 'ngAfterContentChecked',
      mounted: true,
      domText: prevText,
      memoryText: nextText,
      previousText: prevText,
      explanation: 'Conteúdo projetado verificado antes de aplicar a atualização na View do card.',
      debugLine: `Conteúdo verificado | aguardando ViewChecked para aplicar '${nextText}'`,
    },
    {
      hook: 'ngAfterViewChecked',
      mounted: true,
      domText: nextText,
      memoryText: nextText,
      previousText: prevText,
      explanation: `DOM atualizado! O texto do card agora exibe "${nextText}" na tela.`,
      debugLine: `DOM atualizado -> <p>${nextText}</p>`,
    },
    {
      hook: 'afterEveryRender',
      mounted: true,
      domText: nextText,
      memoryText: nextText,
      previousText: prevText,
      explanation: 'Browser concluiu a nova pintura na tela com o texto atualizado.',
      debugLine: `Browser repintou o DOM com '${nextText}'`,
    },
  ];
}

function buildDestroySteps(prevText: string): DebugStep[] {
  return [
    {
      hook: 'ngOnDestroy',
      mounted: false,
      domText: '',
      memoryText: '',
      previousText: prevText,
      explanation: 'Último hook antes de o Angular destruir a instância e remover o card do DOM.',
      debugLine: `Cleanup executado — instância destruída (último texto: '${prevText}')`,
    },
  ];
}

@Component({
  imports: [DomTree],
  selector: 'app-life-cycle',
  templateUrl: './life-cycle.html',
})
export class LifeCycle {
  private readonly destroyRef = inject(DestroyRef);
  private timerId: ReturnType<typeof setInterval> | null = null;

  protected readonly codeBlocks = HOOK_CODE_BLOCKS;
  protected readonly steps = signal<DebugStep[]>(buildMountSteps('Olá, Angular!'));
  protected readonly stepIndex = signal(0);
  protected readonly isPlaying = signal(false);
  protected readonly draftText = signal('Olá, Angular!');

  protected readonly current = computed(() => this.steps()[this.stepIndex()]);
  protected readonly currentTheme = computed(() => HOOK_THEMES[this.current().hook]);
  protected readonly cycleHookIds = computed(() => this.steps().map((s) => s.hook));
  protected readonly isMountedTarget = computed(() => {
    const list = this.steps();
    return list[list.length - 1]?.mounted ?? false;
  });
  protected readonly hasPendingChange = computed(() => {
    const step = this.current();
    return step.mounted && step.memoryText !== step.domText;
  });
  protected readonly domCardClasses = computed(() => {
    const step = this.current();
    if (step.hook === 'ngOnDestroy') {
      return {
        card: 'border-ng-error bg-ng-error/15',
        title: 'text-ng-error',
      };
    }
    if (!step.mounted) {
      return {
        card: 'border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-600 dark:text-zinc-400',
        title: 'text-zinc-600 dark:text-zinc-400',
      };
    }
    if (this.hasPendingChange()) {
      return {
        card: 'border-white bg-white text-zinc-950 shadow-md',
        title: 'text-zinc-950',
      };
    }
    return {
      card: 'border-ng-success bg-ng-success/15',
      title: 'text-ng-success',
    };
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.stopTimer();
    });
  }

  protected hookTheme(id: HookId): HookTheme {
    return HOOK_THEMES[id];
  }

  protected onTextInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.draftText.set(input?.value ?? '');
  }

  protected updateText(event?: Event): void {
    event?.preventDefault();
    if (!this.isMountedTarget()) {
      return;
    }

    this.stopTimer();
    const list = this.steps();
    const prev = list[list.length - 1]?.memoryText || 'Olá, Angular!';
    const typed = this.draftText().trim();
    const next =
      typed && typed !== prev
        ? typed
        : prev === 'Olá, Angular!'
          ? 'Texto Atualizado!'
          : 'Olá, Angular!';

    this.draftText.set(next);
    this.steps.set(buildUpdateSteps(prev, next));
    this.stepIndex.set(0);
  }

  protected mount(): void {
    this.stopTimer();
    const text = this.draftText().trim() || 'Olá, Angular!';
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
    const prev = list[list.length - 1]?.memoryText || this.draftText();
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

  protected goToStep(index: number): void {
    this.stopTimer();
    if (index >= 0 && index < this.steps().length) {
      this.stepIndex.set(index);
    }
  }

  protected goToHook(id: HookId): void {
    const idx = this.steps().findIndex((s) => s.hook === id);
    if (idx !== -1) {
      this.goToStep(idx);
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
    this.timerId = setInterval(() => this.next(), 1100);
  }

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying.set(false);
  }
}
