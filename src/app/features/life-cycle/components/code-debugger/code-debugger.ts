import { Component, computed, input } from '@angular/core';
import { CodeDebuggerShell } from '../../../../shared/components/code-debugger-shell/code-debugger-shell';
import { DebuggerCodeBlockView } from '../../../../shared/components/code-debugger-shell/code-debugger-shell.interface';
import {
  DebugStep,
  HookCodeBlock,
  HookId,
  HookTheme,
} from '../../interfaces/life-cycle.interface';
import { DEFAULT_OBJECT_NAME, HOOK_CODE_BLOCKS, HOOK_THEMES } from '../../utils/life-cycle.util';

@Component({
  imports: [CodeDebuggerShell],
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
  protected readonly objectLiteral = computed(
    () => this.step().memoryObjectName || this.step().domObjectName || DEFAULT_OBJECT_NAME
  );
  protected readonly objectRefLiteral = computed(() => this.step().objectRefId ?? 1);

  protected readonly blockViews = computed<readonly DebuggerCodeBlockView[]>(() => {
    const currentStep = this.step();
    return this.codeBlocks().map((block) => {
      const blockTheme = this.hookTheme(block.id);
      return {
        id: block.id,
        signature: block.signature,
        descriptionComment: block.descriptionComment,
        exampleLine: block.exampleLine,
        closingBrace: block.closingBrace,
        isActive: currentStep.hook === block.id,
        activeClasses: blockTheme.codeActiveClasses,
        activeTextClass: blockTheme.textClass,
        debugLine: currentStep.debugLine,
      };
    });
  });

  protected hookTheme(id: HookId): HookTheme {
    return HOOK_THEMES[id];
  }
}
