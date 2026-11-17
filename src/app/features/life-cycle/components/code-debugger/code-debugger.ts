import { Component, computed, input } from '@angular/core';
import {
  DebugStep,
  HookCodeBlock,
  HookId,
  HookTheme,
} from '../../interfaces/life-cycle.interface';
import { HOOK_CODE_BLOCKS, HOOK_THEMES } from '../../utils/life-cycle.util';

@Component({
  selector: 'app-code-debugger',
  templateUrl: './code-debugger.html',
})
export class CodeDebugger {
  readonly step = input.required<DebugStep>();
  readonly theme = input.required<HookTheme>();
  readonly draftText = input.required<string>();
  readonly codeBlocks = input<HookCodeBlock[]>(HOOK_CODE_BLOCKS);

  protected readonly inputLiteral = computed(
    () => this.step().memoryText || this.step().domText || this.draftText()
  );

  protected hookTheme(id: HookId): HookTheme {
    return HOOK_THEMES[id];
  }
}
