export interface DebuggerCodeBlockView {
  readonly id: string;
  readonly signature: string;
  readonly descriptionComment: string;
  readonly exampleLine: string;
  readonly closingBrace?: string;
  readonly isActive: boolean;
  readonly activeClasses: string;
  readonly activeTextClass: string;
  readonly debugLine?: string;
}
