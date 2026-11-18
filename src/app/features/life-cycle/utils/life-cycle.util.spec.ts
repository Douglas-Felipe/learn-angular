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
    const mountSteps = buildMountSteps('Inicial');
    expect(mountSteps).toHaveLength(10);
    expect(mountSteps[0].hook).toBe('constructor');
    expect(mountSteps[0].mounted).toBe(false);
    expect(mountSteps[6].hook).toBe('ngAfterViewInit');
    expect(mountSteps[6].mounted).toBe(true);
    expect(mountSteps[6].domText).toBe('Inicial');

    const updateSteps = buildUpdateSteps('Inicial', 'Novo');
    expect(updateSteps).toHaveLength(5);
    expect(updateSteps[0].domText).toBe('Inicial');
    expect(updateSteps[0].memoryText).toBe('Novo');
    expect(updateSteps[3].hook).toBe('ngAfterViewChecked');
    expect(updateSteps[3].domText).toBe('Novo');

    const destroySteps = buildDestroySteps('Novo');
    expect(destroySteps).toHaveLength(1);
    expect(destroySteps[0].hook).toBe('ngOnDestroy');
    expect(destroySteps[0].mounted).toBe(false);
    expect(destroySteps[0].previousText).toBe('Novo');
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

    const [unmountedStep] = buildMountSteps('Teste');
    expect(resolveDomCardClasses(unmountedStep, false).card).toContain('border-zinc-300');

    const [pendingStep] = buildUpdateSteps('Antigo', 'Novo');
    expect(resolveDomCardClasses(pendingStep, true).card).toContain('border-white');

    const syncedStep = buildUpdateSteps('Antigo', 'Novo')[3];
    expect(resolveDomCardClasses(syncedStep, false).card).toContain('border-ng-success');

    const [mutateStep] = buildObjectMutateSteps('Texto', 'Ada Lovelace', 'Grace Hopper', 1);
    expect(resolveDomCardClasses(mutateStep, false).card).toContain('border-ng-warning');
    expect(resolveDomCardClasses(mutateStep, false).title).toContain('text-ng-warning');
  });

  it('should build object mutate and recreate step sequences and resolve next object name', () => {
    const mutateSteps = buildObjectMutateSteps('Olá', 'Ada Lovelace', 'Grace Hopper', 2);
    expect(mutateSteps).toHaveLength(1);
    expect(mutateSteps[0].hook).toBe('ngOnChanges');
    expect(mutateSteps[0].mutationIgnored).toBe(true);
    expect(mutateSteps[0].isObjectCycle).toBe(true);
    expect(mutateSteps[0].domObjectName).toBe('Ada Lovelace');
    expect(mutateSteps[0].memoryObjectName).toBe('Grace Hopper');
    expect(mutateSteps[0].objectRefId).toBe(2);
    expect(mutateSteps[0].debugLine).toContain('IGNORADO! ref #2 === ref #2');

    const recreateSteps = buildObjectRecreateSteps('Olá', 'Ada Lovelace', 'Grace Hopper', 2, 3);
    expect(recreateSteps).toHaveLength(5);
    expect(recreateSteps[0].hook).toBe('ngOnChanges');
    expect(recreateSteps[0].mutationIgnored).toBe(false);
    expect(recreateSteps[0].domObjectName).toBe('Ada Lovelace');
    expect(recreateSteps[0].memoryObjectName).toBe('Grace Hopper');
    expect(recreateSteps[0].previousObjectRefId).toBe(2);
    expect(recreateSteps[0].objectRefId).toBe(3);
    expect(recreateSteps[3].hook).toBe('ngAfterViewChecked');
    expect(recreateSteps[3].domObjectName).toBe('Grace Hopper');

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
