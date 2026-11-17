import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from './interfaces/nav-item.interface';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  protected readonly navItems = signal<NavItem[]>([
    {
      label: 'Home',
      route: '/',
      exact: true,
      description: 'Visão geral do projeto',
    },
    {
      label: 'Lifecycle',
      route: '/life-cycle',
      exact: false,
      description: 'Ganchos de ciclo de vida',
    },
  ]);
}
