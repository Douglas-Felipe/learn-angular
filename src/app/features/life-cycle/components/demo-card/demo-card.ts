import { Component, computed, input, model, output } from '@angular/core';
import { DebugStep, HookTheme } from '../../interfaces/life-cycle.interface';
import { resolveDomCardClasses } from '../../utils/life-cycle.util';

@Component({
  selector: 'app-demo-card',
  templateUrl: './demo-card.html',
})
export class DemoCard {
  readonly step = input.required<DebugStep>();
  readonly theme = input.required<HookTheme>();
  readonly stepIndex = input.required<number>();
  readonly totalSteps = input.required<number>();
  readonly isPlaying = input.required<boolean>();
  readonly isMountedTarget = input.required<boolean>();
  readonly draftText = model.required<string>();

  readonly prevStep = output<void>();
  readonly nextStep = output<void>();
  readonly togglePlay = output<void>();
  readonly submitText = output<void>();

  protected readonly hasPendingChange = computed(() => {
    const currentStep = this.step();
    return currentStep.mounted && currentStep.memoryText !== currentStep.domText;
  });

  protected readonly domCardClasses = computed(() =>
    resolveDomCardClasses(this.step(), this.hasPendingChange())
  );

  protected onTextInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement | null;
    this.draftText.set(inputEl?.value ?? '');
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitText.emit();
  }
}
