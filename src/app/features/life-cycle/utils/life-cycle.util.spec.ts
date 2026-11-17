import {
  DEFAULT_CARD_TEXT,
  FALLBACK_UPDATED_TEXT,
  HOOK_CODE_BLOCKS,
  HOOK_THEMES,
  buildDestroySteps,
  buildMountSteps,
  buildUpdateSteps,
  resolveDomCardClasses,
  resolveNextCardText,
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
  });
});
