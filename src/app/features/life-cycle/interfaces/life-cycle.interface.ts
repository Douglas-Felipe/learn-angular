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

export interface DebugStep {
  hook: HookId;
  mounted: boolean;
  domText: string;
  memoryText: string;
  previousText: string;
  explanation: string;
  debugLine: string;
  domObjectName?: string;
  memoryObjectName?: string;
  objectRefId?: number;
  previousObjectRefId?: number;
  mutationIgnored?: boolean;
  isObjectCycle?: boolean;
}

export interface DomCardClasses {
  card: string;
  title: string;
}
