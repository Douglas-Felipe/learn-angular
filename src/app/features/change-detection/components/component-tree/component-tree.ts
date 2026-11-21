import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { ROOT_NODE_ID, TREE_NODES } from '../../data/cd-tree.data';
import {
  EDGE_CLASSES,
  STATUS_VISUAL_META,
  STRATEGY_META,
} from '../../data/cd-visual.config';
import {
  ChangeDetectionMode,
  NodeRuntimeSnapshot,
  StatusVisualMeta,
  TreeNodeDefinition,
  TreeNodeId,
  TreeStepState,
} from '../../interfaces/change-detection.interface';

@Component({
  imports: [NgTemplateOutlet],
  selector: 'app-component-tree',
  templateUrl: './component-tree.html',
})
export class ComponentTree {
  readonly tree = input.required<TreeStepState>();
  readonly mode = input.required<ChangeDetectionMode>();

  readonly triggerNode = output<TreeNodeId>();

  protected readonly rootNodeId = ROOT_NODE_ID;
  protected readonly rootBranches = TREE_NODES[ROOT_NODE_ID].children;

  protected readonly isOnPush = computed(() => this.tree().strategy === 'on-push');
  protected readonly isZonelessOnPush = computed(
    () => this.mode() === 'zoneless' && this.isOnPush()
  );
  protected readonly strategyMeta = computed(() => STRATEGY_META[this.tree().strategy]);

  protected readonly strategySubtitle = computed(() => {
    if (!this.isOnPush()) {
      return 'Verifica toda a árvore a cada ciclo (CheckAlways)';
    }
    return this.mode() === 'zoneless'
      ? 'Atualiza só o consumidor do Signal (0 desperdício)'
      : 'Marca Dirty do alvo até a raiz (poda ramos Clean)';
  });

  protected nodeDef(id: TreeNodeId): TreeNodeDefinition {
    return TREE_NODES[id];
  }

  protected nodeSnapshot(id: TreeNodeId): NodeRuntimeSnapshot {
    return this.tree().nodes[id];
  }

  protected nodeVisual(id: TreeNodeId): StatusVisualMeta {
    return STATUS_VISUAL_META[this.tree().nodes[id].status];
  }

  protected edgeClass(id: TreeNodeId): string {
    return EDGE_CLASSES[this.tree().edges[id]];
  }

  protected memDomBadgeClass(snap: NodeRuntimeSnapshot): string {
    if (snap.status === 'stale') {
      return 'border-ng-error/50 bg-ng-error/15 text-ng-error';
    }
    if (snap.memoryValue !== snap.domValue) {
      return 'border-ng-warning/50 bg-ng-warning/15 text-ng-warning';
    }
    return 'border-ng-success/50 bg-ng-success/15 text-ng-success';
  }

  protected onTriggerNode(id: TreeNodeId): void {
    this.triggerNode.emit(id);
  }
}
