import {
  HOOK_META,
  resolveDomStageSummary,
  resolveTreeNodeStatuses,
} from './dom-tree.util';

describe('dom-tree.util', () => {
  it('should define metadata for all 11 Angular lifecycle hooks', () => {
    expect(Object.keys(HOOK_META)).toHaveLength(11);
    expect(HOOK_META.constructor.label).toBe('constructor()');
  });

  it('should resolve DOM stage summary for destroyed, unmounted, pending, and synchronized states', () => {
    expect(resolveDomStageSummary('ngOnDestroy', false, '', '').label).toBe(
      'DOM removido da tela'
    );
    expect(resolveDomStageSummary('constructor', false, '', '').label).toBe(
      'DOM ainda não montado'
    );
    expect(resolveDomStageSummary('ngOnInit', false, '', 'Olá').label).toBe(
      'Memória: "Olá" • DOM vazio'
    );
    expect(resolveDomStageSummary('ngDoCheck', true, 'Antes', 'Depois').label).toBe(
      'DOM: "Antes" → Pendente: "Depois"'
    );
    expect(resolveDomStageSummary('afterEveryRender', true, 'Pronto', 'Pronto').label).toBe(
      'DOM sincronizado: "Pronto"'
    );
    const ignoredSummary = resolveDomStageSummary('ngOnChanges', true, 'Ada', 'Grace', true);
    expect(ignoredSummary.label).toBe('ngOnChanges ignorado (mesma ref)');
    expect(ignoredSummary.badgeClass).toContain('border-ng-warning');
  });

  it('should compute active, completed, upcoming, and skipped statuses across cycle hooks', () => {
    const emptyCycleStatuses = resolveTreeNodeStatuses('constructor', []);
    expect(emptyCycleStatuses.constructor).toBe('active');
    expect(emptyCycleStatuses.ngOnInit).toBe('upcoming');

    const updateCycleStatuses = resolveTreeNodeStatuses('ngDoCheck', [
      'ngOnChanges',
      'ngDoCheck',
      'ngAfterViewChecked',
    ]);
    expect(updateCycleStatuses.ngOnChanges).toBe('completed');
    expect(updateCycleStatuses.ngDoCheck).toBe('active');
    expect(updateCycleStatuses.ngAfterViewChecked).toBe('upcoming');
    expect(updateCycleStatuses.ngOnInit).toBe('skipped');
  });
});
