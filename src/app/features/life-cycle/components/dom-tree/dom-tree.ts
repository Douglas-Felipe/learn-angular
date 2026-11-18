import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import type { HookId } from '../../interfaces/life-cycle.interface';
import { HookNodeMeta, TreeNodeStatus } from './interfaces/dom-tree.interface';
import { HOOK_META, resolveDomStageSummary, resolveTreeNodeStatuses } from './utils/dom-tree.util';

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
  readonly mutationIgnored = input<boolean>(false);

  readonly selectHook = output<HookId>();

  protected readonly activeMeta = computed(() => HOOK_META[this.hook()]);

  protected readonly domStageSummary = computed(() =>
    resolveDomStageSummary(
      this.hook(),
      this.mounted(),
      this.domText(),
      this.memoryText(),
      this.mutationIgnored()
    )
  );

  protected readonly nodeStatuses = computed<Record<HookId, TreeNodeStatus>>(() =>
    resolveTreeNodeStatuses(this.hook(), this.cycleHooks())
  );

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
