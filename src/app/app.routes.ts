import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
    title: "Home",
  },
  {
    path: "life-cycle",
    loadComponent: () => import('./features/life-cycle/life-cycle').then((m) => m.LifeCycle),
    title: "Life Cycle",
  }
];
