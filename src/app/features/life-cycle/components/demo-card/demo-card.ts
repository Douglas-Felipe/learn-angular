import { Component, computed, input, model, output } from '@angular/core';
import { DebugStep, HookTheme } from '../../interfaces/life-cycle.interface';
import { DEFAULT_OBJECT_NAME, resolveDomCardClasses } from '../../utils/life-cycle.util';

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
  readonly draftObjectName = model<string>(DEFAULT_OBJECT_NAME);

  readonly prevStep = output<void>();
  readonly nextStep = output<void>();
  readonly togglePlay = output<void>();
  readonly submitText = output<void>();
  readonly mutateObject = output<void>();
  readonly recreateObject = output<void>();

  protected readonly hasPendingTextChange = computed(() => {
    const currentStep = this.step();
    return currentStep.mounted && currentStep.memoryText !== currentStep.domText;
  });

  protected readonly hasPendingObjectChange = computed(() => {
    const currentStep = this.step();
    return Boolean(
      currentStep.mounted &&
        !currentStep.mutationIgnored &&
        currentStep.memoryObjectName &&
        currentStep.domObjectName &&
        currentStep.memoryObjectName !== currentStep.domObjectName
    );
  });

  protected readonly hasPendingChange = computed(
    () => this.hasPendingTextChange() || this.hasPendingObjectChange()
  );

  protected readonly domObjectRefId = computed(() => {
    const currentStep = this.step();
    if (this.hasPendingObjectChange()) {
      return currentStep.previousObjectRefId ?? currentStep.objectRefId ?? 1;
    }
    return currentStep.objectRefId ?? 1;
  });

  protected readonly domCardClasses = computed(() =>
    resolveDomCardClasses(this.step(), this.hasPendingChange())
  );

  protected onTextInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement | null;
    this.draftText.set(inputEl?.value ?? '');
  }

  protected onObjectNameInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement | null;
    this.draftObjectName.set(inputEl?.value ?? '');
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitText.emit();
  }
}
