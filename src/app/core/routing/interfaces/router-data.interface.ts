import { Route } from '@angular/router';

export interface AppRouteData {
  title?: string;
  docsUrl?: string;
}

export interface AppRoute extends Route {
  data?: AppRouteData;
  children?: AppRoute[];
}
