import { AppRoute, CHANGE_DETECTION_SLUGS } from '@routing';
import { ChangeDetectionMode } from './interfaces/change-detection.interface';

export interface ChangeDetectionRouteData {
  title?: string;
  docsUrl?: string;
  mode: ChangeDetectionMode;
}

const zoneJsRoute: AppRoute<ChangeDetectionRouteData> = {
  path: CHANGE_DETECTION_SLUGS.zoneJs,
  loadComponent: () =>
    import('./components/cd-workbench/cd-workbench').then((m) => m.CdWorkbench),
  title: 'Detecção de Mudanças • Zone.js',
  data: {
    mode: 'zone-js',
    docsUrl: 'https://angular.dev/best-practices/skipping-subtrees',
  },
};

const zonelessRoute: AppRoute<ChangeDetectionRouteData> = {
  path: CHANGE_DETECTION_SLUGS.zoneless,
  loadComponent: () =>
    import('./components/cd-workbench/cd-workbench').then((m) => m.CdWorkbench),
  title: 'Detecção de Mudanças • Zoneless + Signals',
  data: {
    mode: 'zoneless',
    docsUrl: 'https://angular.dev/guide/zoneless',
  },
};

export const CHANGE_DETECTION_ROUTES: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: CHANGE_DETECTION_SLUGS.summary,
  },
  {
    path: CHANGE_DETECTION_SLUGS.summary,
    loadComponent: () => import('./pages/cd-summary/cd-summary').then((m) => m.CdSummary),
    title: 'Detecção de Mudanças • Resumo',
    data: {
      docsUrl: 'https://angular.dev/best-practices/skipping-subtrees',
    },
  },
  zoneJsRoute,
  zonelessRoute,
];
