import {
  DebugStep,
  DomCardClasses,
  HookCodeBlock,
  HookId,
  HookTheme,
} from '../interfaces/life-cycle.interface';

export const DEFAULT_CARD_TEXT = 'Olá, Angular!';
export const FALLBACK_UPDATED_TEXT = 'Texto Atualizado!';
export const DEFAULT_OBJECT_NAME = 'Ada Lovelace';
export const FALLBACK_OBJECT_NAME = 'Alan Turing';
export const PLAYBACK_INTERVAL_MS = 1100;

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

export function buildMountSteps(
  text: string,
  objectName: string = DEFAULT_OBJECT_NAME,
  objectRefId = 1
): DebugStep[] {
  const refMeta = { objectRefId, previousObjectRefId: objectRefId };

  return [
    {
      hook: 'constructor',
      mounted: false,
      domText: '',
      memoryText: '',
      previousText: '',
      domObjectName: '',
      memoryObjectName: '',
      ...refMeta,
      explanation: 'Instância da classe criada em memória. input() ainda não recebeu valor e não há DOM.',
      debugLine: 'this = CardDemoComponent {} | texto() = undefined',
    },
    {
      hook: 'ngOnChanges',
      mounted: false,
      domText: '',
      memoryText: text,
      previousText: '',
      domObjectName: '',
      memoryObjectName: objectName,
      ...refMeta,
      explanation: 'Primeiro input() recebido em memória antes mesmo do ngOnInit().',
      debugLine: `changes['texto'] = { previousValue: undefined, currentValue: '${text}', firstChange: true }`,
    },
    {
      hook: 'ngOnInit',
      mounted: false,
      domText: '',
      memoryText: text,
      previousText: '',
      domObjectName: '',
      memoryObjectName: objectName,
      ...refMeta,
      explanation: 'Componente inicializado com os primeiros inputs disponíveis na classe.',
      debugLine: `this.texto() === '${text}' (aguardando criação do DOM)`,
    },
    {
      hook: 'ngDoCheck',
      mounted: false,
      domText: '',
      memoryText: text,
      previousText: '',
      domObjectName: '',
      memoryObjectName: objectName,
      ...refMeta,
      explanation: 'Angular avalia as expressões do template para construir os nós HTML.',
      debugLine: `Template dirty check: {{ texto() }} = '${text}'`,
    },
    {
      hook: 'ngAfterContentInit',
      mounted: false,
      domText: '',
      memoryText: text,
      previousText: '',
      domObjectName: '',
      memoryObjectName: objectName,
      ...refMeta,
      explanation: 'Conteúdo projetado via <ng-content> vinculado ao componente pela primeira vez.',
      debugLine: `<ng-content> projetado | texto() = '${text}'`,
    },
    {
      hook: 'ngAfterContentChecked',
      mounted: false,
      domText: '',
      memoryText: text,
      previousText: '',
      domObjectName: '',
      memoryObjectName: objectName,
      ...refMeta,
      explanation: 'Bindings do conteúdo projetado verificados; seguindo para montar a View.',
      debugLine: `Conteúdo projetado verificado (DOM próprio ainda pendente)`,
    },
    {
      hook: 'ngAfterViewInit',
      mounted: true,
      domText: text,
      memoryText: text,
      previousText: '',
      domObjectName: objectName,
      memoryObjectName: objectName,
      ...refMeta,
      explanation: 'DOM criado e visível na tela! O texto do card foi renderizado.',
      debugLine: `View montada no DOM -> <p>${text}</p>`,
    },
    {
      hook: 'ngAfterViewChecked',
      mounted: true,
      domText: text,
      memoryText: text,
      previousText: '',
      domObjectName: objectName,
      memoryObjectName: objectName,
      ...refMeta,
      explanation: 'View do componente e views filhas verificadas após a criação inicial.',
      debugLine: `View sincronizada com texto() === '${text}'`,
    },
    {
      hook: 'afterNextRender',
      mounted: true,
      domText: text,
      memoryText: text,
      previousText: '',
      domObjectName: objectName,
      memoryObjectName: objectName,
      ...refMeta,
      explanation: 'Executado uma única vez após o navegador pintar o DOM inicial na tela.',
      debugLine: `Browser pintou o DOM inicial pela 1ª vez ('${text}')`,
    },
    {
      hook: 'afterEveryRender',
      mounted: true,
      domText: text,
      memoryText: text,
      previousText: '',
      domObjectName: objectName,
      memoryObjectName: objectName,
      ...refMeta,
      explanation: 'Executado ao final de cada ciclo de renderização no navegador.',
      debugLine: `Renderização finalizada no browser -> <p>${text}</p>`,
    },
  ];
}

export function buildUpdateSteps(
  prevText: string,
  nextText: string,
  objectName: string = DEFAULT_OBJECT_NAME,
  objectRefId = 1
): DebugStep[] {
  const objectMeta = {
    domObjectName: objectName,
    memoryObjectName: objectName,
    objectRefId,
    previousObjectRefId: objectRefId,
  };

  return [
    {
      hook: 'ngOnChanges',
      mounted: true,
      domText: prevText,
      memoryText: nextText,
      previousText: prevText,
      ...objectMeta,
      explanation: `input() mudou em memória para "${nextText}". No DOM o card ainda exibe "${prevText}".`,
      debugLine: `changes['texto'] = { previousValue: '${prevText}', currentValue: '${nextText}' }`,
    },
    {
      hook: 'ngDoCheck',
      mounted: true,
      domText: prevText,
      memoryText: nextText,
      previousText: prevText,
      ...objectMeta,
      explanation: 'Change Detection compara a memória com o DOM e prepara a atualização da View.',
      debugLine: `Dirty check: memória ('${nextText}') !== DOM ('${prevText}')`,
    },
    {
      hook: 'ngAfterContentChecked',
      mounted: true,
      domText: prevText,
      memoryText: nextText,
      previousText: prevText,
      ...objectMeta,
      explanation: 'Conteúdo projetado verificado antes de aplicar a atualização na View do card.',
      debugLine: `Conteúdo verificado | aguardando ViewChecked para aplicar '${nextText}'`,
    },
    {
      hook: 'ngAfterViewChecked',
      mounted: true,
      domText: nextText,
      memoryText: nextText,
      previousText: prevText,
      ...objectMeta,
      explanation: `DOM atualizado! O texto do card agora exibe "${nextText}" na tela.`,
      debugLine: `DOM atualizado -> <p>${nextText}</p>`,
    },
    {
      hook: 'afterEveryRender',
      mounted: true,
      domText: nextText,
      memoryText: nextText,
      previousText: prevText,
      ...objectMeta,
      explanation: 'Browser concluiu a nova pintura na tela com o texto atualizado.',
      debugLine: `Browser repintou o DOM com '${nextText}'`,
    },
  ];
}

export function buildDestroySteps(
  prevText: string,
  prevObjectName: string = DEFAULT_OBJECT_NAME,
  objectRefId = 1
): DebugStep[] {
  return [
    {
      hook: 'ngOnDestroy',
      mounted: false,
      domText: '',
      memoryText: '',
      previousText: prevText,
      domObjectName: '',
      memoryObjectName: '',
      objectRefId,
      previousObjectRefId: objectRefId,
      explanation: 'Último hook antes de o Angular destruir a instância e remover o card do DOM.',
      debugLine: `Cleanup executado — instância destruída (último texto: '${prevText}', usuario: '${prevObjectName}')`,
    },
  ];
}

/** Simula mutação direta de propriedade mantendo a mesma referência de objeto. */
export function buildObjectMutateSteps(
  currentText: string,
  domObjectName: string,
  mutatedObjectName: string,
  objectRefId = 1
): DebugStep[] {
  return [
    {
      hook: 'ngOnChanges',
      mounted: true,
      domText: currentText,
      memoryText: currentText,
      previousText: currentText,
      domObjectName,
      memoryObjectName: mutatedObjectName,
      objectRefId,
      previousObjectRefId: objectRefId,
      mutationIgnored: true,
      isObjectCycle: true,
      explanation: `Pegadinha do ngOnChanges! O atributo interno mudou para "${mutatedObjectName}", mas a referência do objeto em memória continuou a mesma (ref #${objectRefId} === ref #${objectRefId}). Como o Angular compara inputs por referência (===), o ngOnChanges NÃO dispara e o ciclo de atualização é ignorado.`,
      debugLine: `IGNORADO! ref #${objectRefId} === ref #${objectRefId} (mutar usuario.nome = '${mutatedObjectName}' não dispara ngOnChanges)`,
    },
  ];
}

/** Simula recriação imutável do objeto gerando nova referência e disparando o ciclo completo. */
export function buildObjectRecreateSteps(
  currentText: string,
  prevObjectName: string,
  nextObjectName: string,
  prevRefId: number,
  nextRefId: number
): DebugStep[] {
  const shared = {
    mounted: true,
    domText: currentText,
    memoryText: currentText,
    previousText: currentText,
    objectRefId: nextRefId,
    previousObjectRefId: prevRefId,
    mutationIgnored: false,
    isObjectCycle: true,
  };

  return [
    {
      hook: 'ngOnChanges',
      ...shared,
      domObjectName: prevObjectName,
      memoryObjectName: nextObjectName,
      explanation: `Nova referência criada (ref #${prevRefId} !== ref #${nextRefId})! Como o endereço do objeto mudou, o Angular dispara ngOnChanges() com usuario.nome = "${nextObjectName}", enquanto o DOM ainda exibe "${prevObjectName}".`,
      debugLine: `changes['usuario'] = { previousValue: { nome: '${prevObjectName}' } (ref #${prevRefId}), currentValue: { nome: '${nextObjectName}' } (ref #${nextRefId}) }`,
    },
    {
      hook: 'ngDoCheck',
      ...shared,
      domObjectName: prevObjectName,
      memoryObjectName: nextObjectName,
      explanation: `Change Detection confirma nova referência (ref #${nextRefId}) e prepara a atualização de usuario.nome no template.`,
      debugLine: `Dirty check: ref #${prevRefId} !== ref #${nextRefId} ('${nextObjectName}' !== '${prevObjectName}')`,
    },
    {
      hook: 'ngAfterContentChecked',
      ...shared,
      domObjectName: prevObjectName,
      memoryObjectName: nextObjectName,
      explanation: `Conteúdo projetado verificado antes de aplicar { nome: "${nextObjectName}" } (ref #${nextRefId}) na View.`,
      debugLine: `Conteúdo verificado | aguardando ViewChecked para aplicar '{ nome: "${nextObjectName}" }'`,
    },
    {
      hook: 'ngAfterViewChecked',
      ...shared,
      domObjectName: nextObjectName,
      memoryObjectName: nextObjectName,
      explanation: `DOM atualizado com o novo objeto! O card agora exibe usuario.nome = "${nextObjectName}" (ref #${nextRefId}).`,
      debugLine: `DOM atualizado -> usuario = { nome: '${nextObjectName}' } (ref #${nextRefId})`,
    },
    {
      hook: 'afterEveryRender',
      ...shared,
      domObjectName: nextObjectName,
      memoryObjectName: nextObjectName,
      explanation: `Browser concluiu a pintura na tela com a nova referência ref #${nextRefId} ("${nextObjectName}").`,
      debugLine: `Browser repintou o DOM com usuario = { nome: '${nextObjectName}' } (ref #${nextRefId})`,
    },
  ];
}

function resolveNextValue(
  prevValue: string,
  rawDraft: string,
  defaultValue: string,
  fallbackValue: string
): string {
  const typed = rawDraft.trim();
  if (typed && typed !== prevValue) {
    return typed;
  }
  return prevValue === defaultValue ? fallbackValue : defaultValue;
}

export function resolveNextCardText(prevText: string, rawDraftText: string): string {
  return resolveNextValue(prevText, rawDraftText, DEFAULT_CARD_TEXT, FALLBACK_UPDATED_TEXT);
}

export function resolveNextObjectName(prevObjectName: string, rawDraftObjectName: string): string {
  return resolveNextValue(
    prevObjectName,
    rawDraftObjectName,
    DEFAULT_OBJECT_NAME,
    FALLBACK_OBJECT_NAME
  );
}

export function resolveDomCardClasses(step: DebugStep, hasPendingChange: boolean): DomCardClasses {
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
  if (step.mutationIgnored) {
    return {
      card: 'border-ng-warning bg-ng-warning/15',
      title: 'text-ng-warning',
    };
  }
  if (hasPendingChange) {
    return {
      card: 'border-white bg-ng-text/10 text-ng-text shadow-md',
      title: 'text-ng-text',
    };
  }
  return {
    card: 'border-ng-success bg-ng-success/15',
    title: 'text-ng-success',
  };
}
