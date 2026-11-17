import type { HookId } from '../../../interfaces/life-cycle.interface';

export type TreeNodeStatus = 'active' | 'completed' | 'upcoming' | 'skipped';

export interface HookNodeMeta {
  id: HookId;
  label: string;
  subLabel: string;
  activeClasses: string;
  dotClass: string;
  textClass: string;
}

export interface DomStageSummary {
  label: string;
  badgeClass: string;
}
