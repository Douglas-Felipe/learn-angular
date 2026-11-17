import { DOCUMENT } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  private readonly document = inject(DOCUMENT);

  readonly pageTitle = input<string>();
  readonly docsUrl = input<string>();

  protected readonly isDarkMode = signal(true);

  protected toggleTheme(): void {
    const nextDark = !this.isDarkMode();
    this.isDarkMode.set(nextDark);
    const root = this.document.documentElement;
    if (nextDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }
}
