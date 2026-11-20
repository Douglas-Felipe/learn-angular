import {
  DEFAULT_CARD_TEXT,
  DEFAULT_OBJECT_NAME,
  FALLBACK_OBJECT_NAME,
  FALLBACK_UPDATED_TEXT,
  HOOK_CODE_BLOCKS,
  HOOK_THEMES,
  buildDestroySteps,
  buildMountSteps,
  buildObjectMutateSteps,
  buildObjectRecreateSteps,
  buildUpdateSteps,
  resolveDomCardClasses,
  resolveNextCardText,
  resolveNextObjectName,
} from './life-cycle.util';

describe('life-cycle.util', () => {
  it('should expose 11 hook themes and code blocks', () => {
    expect(HOOK_CODE_BLOCKS).toHaveLength(11);
    expect(Object.keys(HOOK_THEMES)).toHaveLength(11);
  });

  it('should build mount, update, and destroy step sequences accurately', () => {
    const mountSteps = buildMountSteps('Inicial', 'Grace Hopper', 4);
    expect(mountSteps).toHaveLength(10);
    expect(mountSteps.map((s) => s.hook)).toEqual([
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
    ]);
    mountSteps.forEach((step, idx) => {
      const isMounted = idx >= 6;
      expect(step.mounted).toBe(isMounted);
      expect(step.previousText).toBe('');
      expect(step.domText).toBe(isMounted ? 'Inicial' : '');
      expect(step.memoryText).toBe(idx === 0 ? '' : 'Inicial');
      expect(step.domObjectName).toBe(isMounted ? 'Grace Hopper' : '');
      expect(step.memoryObjectName).toBe(idx === 0 ? '' : 'Grace Hopper');
      expect(step.objectRefId).toBe(4);
      expect(step.previousObjectRefId).toBe(4);
      expect(step.explanation.length).toBeGreaterThan(0);
      expect(step.debugLine.length).toBeGreaterThan(0);
    });

    const updateSteps = buildUpdateSteps('Inicial', 'Novo', 'Grace Hopper', 3);
    expect(updateSteps).toHaveLength(5);
    expect(updateSteps.map((s) => s.hook)).toEqual([
      'ngOnChanges',
      'ngDoCheck',
      'ngAfterContentChecked',
      'ngAfterViewChecked',
      'afterEveryRender',
    ]);
    updateSteps.forEach((step, idx) => {
      const applied = idx >= 3;
      expect(step.mounted).toBe(true);
      expect(step.domText).toBe(applied ? 'Novo' : 'Inicial');
      expect(step.memoryText).toBe('Novo');
      expect(step.previousText).toBe('Inicial');
      expect(step.domObjectName).toBe('Grace Hopper');
      expect(step.memoryObjectName).toBe('Grace Hopper');
      expect(step.objectRefId).toBe(3);
      expect(step.previousObjectRefId).toBe(3);
      expect(step.explanation.length).toBeGreaterThan(0);
      expect(step.debugLine.length).toBeGreaterThan(0);
    });

    const destroySteps = buildDestroySteps('Novo', 'Grace Hopper', 5);
    expect(destroySteps).toHaveLength(1);
    expect(destroySteps[0]).toMatchObject({
      hook: 'ngOnDestroy',
      mounted: false,
      domText: '',
      memoryText: '',
      previousText: 'Novo',
      domObjectName: '',
      memoryObjectName: '',
      objectRefId: 5,
      previousObjectRefId: 5,
    });
    expect(destroySteps[0].explanation.length).toBeGreaterThan(0);
    expect(destroySteps[0].debugLine).toContain('Novo');
    expect(destroySteps[0].debugLine).toContain('Grace Hopper');
  });

  it('should resolve next card text with fallback alternation when input is blank or unchanged', () => {
    expect(resolveNextCardText(DEFAULT_CARD_TEXT, 'Customizado')).toBe('Customizado');
    expect(resolveNextCardText(DEFAULT_CARD_TEXT, '   ')).toBe(FALLBACK_UPDATED_TEXT);
    expect(resolveNextCardText(DEFAULT_CARD_TEXT, DEFAULT_CARD_TEXT)).toBe(FALLBACK_UPDATED_TEXT);
    expect(resolveNextCardText(FALLBACK_UPDATED_TEXT, FALLBACK_UPDATED_TEXT)).toBe(
      DEFAULT_CARD_TEXT
    );
  });

  it('should resolve DOM card classes for destroy, unmounted, pending, and mounted states', () => {
    const [destroyStep] = buildDestroySteps('Teste');
    expect(resolveDomCardClasses(destroyStep, false).card).toContain('border-ng-error');
    expect(resolveDomCardClasses(destroyStep, false).title).toContain('text-ng-error');

    const [unmountedStep] = buildMountSteps('Teste');
    expect(resolveDomCardClasses(unmountedStep, false).card).toContain('border-zinc-300');
    expect(resolveDomCardClasses(unmountedStep, false).title).toContain('text-zinc-600');

    const [pendingStep] = buildUpdateSteps('Antigo', 'Novo');
    expect(resolveDomCardClasses(pendingStep, true).card).toContain('border-white');
    expect(resolveDomCardClasses(pendingStep, true).title).toContain('text-ng-text');

    const syncedStep = buildUpdateSteps('Antigo', 'Novo')[3];
    expect(resolveDomCardClasses(syncedStep, false).card).toContain('border-ng-success');
    expect(resolveDomCardClasses(syncedStep, false).title).toContain('text-ng-success');

    const [mutateStep] = buildObjectMutateSteps('Texto', 'Ada Lovelace', 'Grace Hopper', 1);
    expect(resolveDomCardClasses(mutateStep, false).card).toContain('border-ng-warning');
    expect(resolveDomCardClasses(mutateStep, false).title).toContain('text-ng-warning');
  });

  it('should build object mutate and recreate step sequences and resolve next object name', () => {
    const mutateSteps = buildObjectMutateSteps('Olá', 'Ada Lovelace', 'Grace Hopper', 2);
    expect(mutateSteps).toHaveLength(1);
    expect(mutateSteps[0]).toMatchObject({
      hook: 'ngOnChanges',
      mounted: true,
      domText: 'Olá',
      memoryText: 'Olá',
      previousText: 'Olá',
      domObjectName: 'Ada Lovelace',
      memoryObjectName: 'Grace Hopper',
      objectRefId: 2,
      previousObjectRefId: 2,
      mutationIgnored: true,
      isObjectCycle: true,
    });
    expect(mutateSteps[0].explanation.length).toBeGreaterThan(0);
    expect(mutateSteps[0].debugLine).toContain('IGNORADO! ref #2 === ref #2');

    const recreateSteps = buildObjectRecreateSteps('Olá', 'Ada Lovelace', 'Grace Hopper', 2, 3);
    expect(recreateSteps).toHaveLength(5);
    expect(recreateSteps.map((s) => s.hook)).toEqual([
      'ngOnChanges',
      'ngDoCheck',
      'ngAfterContentChecked',
      'ngAfterViewChecked',
      'afterEveryRender',
    ]);
    recreateSteps.forEach((step, idx) => {
      const applied = idx >= 3;
      expect(step.mounted).toBe(true);
      expect(step.domText).toBe('Olá');
      expect(step.memoryText).toBe('Olá');
      expect(step.previousText).toBe('Olá');
      expect(step.domObjectName).toBe(applied ? 'Grace Hopper' : 'Ada Lovelace');
      expect(step.memoryObjectName).toBe('Grace Hopper');
      expect(step.previousObjectRefId).toBe(2);
      expect(step.objectRefId).toBe(3);
      expect(step.mutationIgnored).toBe(false);
      expect(step.isObjectCycle).toBe(true);
      expect(step.explanation.length).toBeGreaterThan(0);
      expect(step.debugLine.length).toBeGreaterThan(0);
    });

    expect(resolveNextObjectName(DEFAULT_OBJECT_NAME, 'Grace Hopper')).toBe('Grace Hopper');
    expect(resolveNextObjectName(DEFAULT_OBJECT_NAME, '   ')).toBe(FALLBACK_OBJECT_NAME);
    expect(resolveNextObjectName(DEFAULT_OBJECT_NAME, DEFAULT_OBJECT_NAME)).toBe(
      FALLBACK_OBJECT_NAME
    );
    expect(resolveNextObjectName(FALLBACK_OBJECT_NAME, FALLBACK_OBJECT_NAME)).toBe(
      DEFAULT_OBJECT_NAME
    );
  });
});
