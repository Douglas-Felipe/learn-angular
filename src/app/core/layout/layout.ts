import { Component, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { injectActiveRouteData } from '@routing';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  imports: [Header, Sidebar],
  selector: 'app-layout',
  templateUrl: './layout.html',
})
export class Layout {
  protected readonly currentRoute = injectActiveRouteData();

  constructor() {
    const hostElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    inject(Router)
      .events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        const container = hostElement.querySelector<HTMLElement>('[data-layout-scroll]');
        if (container) {
          container.scrollTop = 0;
        }
      });
  }
}
