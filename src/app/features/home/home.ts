import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export const CLI_COMMAND = 'ng serve --open';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  private readonly destroyRef = inject(DestroyRef);
  private copyTimerId: ReturnType<typeof setTimeout> | null = null;

  protected readonly cliCommand = CLI_COMMAND;
  protected readonly isCliCopied = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.clearCopyTimer());
  }

  protected copyCli(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(this.cliCommand).catch(() => undefined);
    }
    this.isCliCopied.set(true);
    this.clearCopyTimer();
    this.copyTimerId = setTimeout(() => {
      this.isCliCopied.set(false);
      this.copyTimerId = null;
    }, 1800);
  }

  private clearCopyTimer(): void {
    if (this.copyTimerId !== null) {
      clearTimeout(this.copyTimerId);
      this.copyTimerId = null;
    }
  }
}
