import { inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AppRouteData } from '../interfaces/router-data.interface';

export const DEFAULT_PAGE_TITLE = 'Home';
export const DEFAULT_DOCS_URL = 'https://angular.dev/overview';

export interface ActiveRouteMeta {
  title: string;
  docsUrl: string;
}

function getDeepestChild(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  let current = route;
  while (current.firstChild) {
    current = current.firstChild;
  }
  return current;
}

function resolveActiveRouteData(router: Router): ActiveRouteMeta {
  const snapshot = getDeepestChild(router.routerState.snapshot.root);
  const data = snapshot.data as AppRouteData | undefined;

  const title =
    snapshot.title ??
    (typeof snapshot.routeConfig?.title === 'string' ? snapshot.routeConfig.title : undefined) ??
    data?.title ??
    DEFAULT_PAGE_TITLE;

  const docsUrl = data?.docsUrl ?? DEFAULT_DOCS_URL;

  return { title, docsUrl };
}

export function injectActiveRouteData(): Signal<ActiveRouteMeta> {
  const router = inject(Router);

  return toSignal(
    router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => resolveActiveRouteData(router))
    ),
    { initialValue: resolveActiveRouteData(router) }
  );
}
