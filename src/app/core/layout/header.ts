import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

const DEFAULT_DOCS_URL = 'https://angular.dev/overview';

@Component({
  imports: [],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  private readonly router = inject(Router);

  protected readonly pageTitle = signal('Home');
  protected readonly docsUrl = signal(DEFAULT_DOCS_URL);

  constructor() {
    this.syncFromRoute();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.syncFromRoute());
  }

  private syncFromRoute(): void {
    let route: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    while (route?.firstChild) {
      route = route.firstChild;
    }

    const resolvedTitle =
      route?.title ??
      (typeof route?.routeConfig?.title === 'string' ? route.routeConfig.title : undefined);

    const routeDocsUrl =
      typeof route?.data?.['docsUrl'] === 'string' ? route.data['docsUrl'] : undefined;

    if (resolvedTitle) {
      this.pageTitle.set(resolvedTitle);
    } else if (this.router.url.includes('life-cycle')) {
      this.pageTitle.set('Life Cycle');
    } else {
      this.pageTitle.set('Home');
    }

    if (routeDocsUrl) {
      this.docsUrl.set(routeDocsUrl);
    } else if (this.router.url.includes('life-cycle')) {
      this.docsUrl.set('https://angular.dev/guide/components/lifecycle');
    } else {
      this.docsUrl.set(DEFAULT_DOCS_URL);
    }
  }
}
