import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import type { HookId } from '../../life-cycle';

export type TreeNodeStatus = 'active' | 'completed' | 'upcoming' | 'skipped';

export interface HookNodeMeta {
  id: HookId;
  label: string;
  subLabel: string;
  activeClasses: string;
  dotClass: string;
  textClass: string;
}

const HOOK_META: Record<HookId, HookNodeMeta> = {
  constructor: {
    id: 'constructor',
    label: 'constructor()',
    subLabel: 'Instanciação',
    activeClasses: 'border-2 border-ng-secondary bg-ng-secondary/20 text-ng-text',
    dotClass: 'bg-ng-secondary',
    textClass: 'text-ng-secondary',
  },
  ngOnChanges: {
    id: 'ngOnChanges',
    label: 'ngOnChanges()',
    subLabel: 'input() mudou',
    activeClasses: 'border-2 border-ng-warning bg-ng-warning/20 text-ng-text',
    dotClass: 'bg-ng-warning',
    textClass: 'text-ng-warning',
  },
  ngOnInit: {
    id: 'ngOnInit',
    label: 'ngOnInit()',
    subLabel: 'Inicialização',
    activeClasses: 'border-2 border-ng-info bg-ng-info/20 text-ng-text',
    dotClass: 'bg-ng-info',
    textClass: 'text-ng-info',
  },
  ngDoCheck: {
    id: 'ngDoCheck',
    label: 'ngDoCheck()',
    subLabel: 'Dirty Check',
    activeClasses: 'border-2 border-ng-primary bg-ng-primary/20 text-ng-text',
    dotClass: 'bg-ng-primary',
    textClass: 'text-ng-primary',
  },
  ngAfterContentInit: {
    id: 'ngAfterContentInit',
    label: 'ngAfterContentInit()',
    subLabel: '1ª projeção',
    activeClasses: 'border-2 border-ng-accent bg-ng-accent/20 text-ng-text',
    dotClass: 'bg-ng-accent',
    textClass: 'text-ng-accent',
  },
  ngAfterContentChecked: {
    id: 'ngAfterContentChecked',
    label: 'ngAfterContentChecked()',
    subLabel: '<ng-content>',
    activeClasses: 'border-2 border-ng-accent bg-ng-accent/20 text-ng-text',
    dotClass: 'bg-ng-accent',
    textClass: 'text-ng-accent',
  },
  ngAfterViewInit: {
    id: 'ngAfterViewInit',
    label: 'ngAfterViewInit()',
    subLabel: '1ª View DOM',
    activeClasses: 'border-2 border-ng-success bg-ng-success/20 text-ng-text',
    dotClass: 'bg-ng-success',
    textClass: 'text-ng-success',
  },
  ngAfterViewChecked: {
    id: 'ngAfterViewChecked',
    label: 'ngAfterViewChecked()',
    subLabel: 'View no DOM',
    activeClasses: 'border-2 border-ng-success bg-ng-success/20 text-ng-text',
    dotClass: 'bg-ng-success',
    textClass: 'text-ng-success',
  },
  afterNextRender: {
    id: 'afterNextRender',
    label: 'afterNextRender()',
    subLabel: '1ª pintura',
    activeClasses: 'border-2 border-ng-success bg-ng-success/20 text-ng-text',
    dotClass: 'bg-ng-success',
    textClass: 'text-ng-success',
  },
  afterEveryRender: {
    id: 'afterEveryRender',
    label: 'afterEveryRender()',
    subLabel: 'Pós-pintura',
    activeClasses: 'border-2 border-ng-success bg-ng-success/20 text-ng-text',
    dotClass: 'bg-ng-success',
    textClass: 'text-ng-success',
  },
  ngOnDestroy: {
    id: 'ngOnDestroy',
    label: 'ngOnDestroy()',
    subLabel: 'Limpeza',
    activeClasses: 'border-2 border-ng-error bg-ng-error/20 text-ng-text',
    dotClass: 'bg-ng-error',
    textClass: 'text-ng-error',
  },
};

@Component({
  imports: [NgTemplateOutlet],
  selector: 'app-dom-tree',
  templateUrl: './dom-tree.html',
})
export class DomTree {
  readonly hook = input.required<HookId>();
  readonly mounted = input.required<boolean>();
  readonly domText = input.required<string>();
  readonly memoryText = input.required<string>();
  readonly cycleHooks = input<HookId[]>([]);

  readonly selectHook = output<HookId>();

  protected readonly activeMeta = computed(() => HOOK_META[this.hook()]);

  protected readonly domStageSummary = computed(() => {
    const activeHook = this.hook();
    const isMounted = this.mounted();
    const dom = this.domText();
    const memory = this.memoryText();

    if (activeHook === 'ngOnDestroy') {
      return {
        label: 'DOM removido da tela',
        badgeClass: 'border-ng-error/40 bg-ng-error/15 text-ng-error',
      };
    }
    if (!isMounted) {
      return {
        label: memory ? `Memória: "${memory}" • DOM vazio` : 'DOM ainda não montado',
        badgeClass: 'border-ng-border bg-ng-surface text-ng-text-subtle',
      };
    }
    if (memory !== dom) {
      return {
        label: `DOM: "${dom}" → Pendente: "${memory}"`,
        badgeClass: 'border-ng-warning/50 bg-ng-warning/15 text-ng-warning',
      };
    }
    return {
      label: `DOM sincronizado: "${dom}"`,
      badgeClass: 'border-ng-success/50 bg-ng-success/15 text-ng-success',
    };
  });

  protected readonly nodeStatuses = computed<Record<HookId, TreeNodeStatus>>(() => {
    const activeHook = this.hook();
    const cycle = this.cycleHooks();
    const activeIndex = cycle.indexOf(activeHook);
    const result = {} as Record<HookId, TreeNodeStatus>;

    for (const id of Object.keys(HOOK_META) as HookId[]) {
      if (id === activeHook) {
        result[id] = 'active';
        continue;
      }
      if (cycle.length === 0) {
        result[id] = 'upcoming';
        continue;
      }
      const index = cycle.indexOf(id);
      if (index === -1) {
        result[id] = 'skipped';
      } else if (activeIndex !== -1 && index < activeIndex) {
        result[id] = 'completed';
      } else {
        result[id] = 'upcoming';
      }
    }
    return result;
  });

  protected nodeMeta(id: HookId): HookNodeMeta {
    return HOOK_META[id];
  }

  protected nodeStatus(id: HookId): TreeNodeStatus {
    return this.nodeStatuses()[id];
  }

  protected onSelectNode(id: HookId): void {
    if (this.nodeStatuses()[id] !== 'skipped') {
      this.selectHook.emit(id);
    }
  }
}
