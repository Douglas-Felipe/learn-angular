import { Route } from '@angular/router';

export interface AppRouteData {
  title?: string;
  docsUrl?: string;
}

export interface AppRoute<TData extends AppRouteData = AppRouteData> extends Route {
  data?: TData;
  children?: AppRoute<AppRouteData>[];
}
