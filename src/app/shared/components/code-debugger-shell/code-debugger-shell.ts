import { Component, input } from '@angular/core';
import { DebuggerCodeBlockView } from './code-debugger-shell.interface';

@Component({
  selector: 'app-code-debugger-shell',
  templateUrl: './code-debugger-shell.html',
})
export class CodeDebuggerShell {
  readonly ariaLabel = input.required<string>();
  readonly fileName = input.required<string>();
  readonly breakpointLabel = input.required<string>();
  readonly breakpointBadgeClasses = input.required<string>();
  readonly breakpointDotClass = input.required<string>();
  readonly blocks = input.required<readonly DebuggerCodeBlockView[]>();
}
