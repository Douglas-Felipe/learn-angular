import { AppRoute } from '@routing';

export const routes: AppRoute[] = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: 'Home',
    data: {
      docsUrl: 'https://angular.dev/overview',
    },
  },
  {
    path: 'life-cycle',
    loadComponent: () => import('./features/life-cycle/life-cycle').then((m) => m.LifeCycle),
    title: 'Life Cycle',
    data: {
      docsUrl: 'https://angular.dev/guide/components/lifecycle',
    },
  },
  {
    path: 'change-detection',
    loadChildren: () =>
      import('./features/change-detection/change-detection.routes').then(
        (m) => m.CHANGE_DETECTION_ROUTES
      ),
  },
];
