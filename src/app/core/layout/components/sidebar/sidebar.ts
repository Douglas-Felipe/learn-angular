import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from './interfaces/nav-item.interface';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  protected readonly isCollapsed = signal(false);

  protected readonly navItems = signal<NavItem[]>([
    {
      label: 'Home',
      route: '/',
      icon: 'home',
      exact: true,
      description: 'Visão geral do projeto',
    },
    {
      label: 'Lifecycle',
      route: '/life-cycle',
      icon: 'lifecycle',
      exact: false,
      description: 'Ganchos de ciclo de vida',
    },
  ]);

  protected toggleCollapse(): void {
    this.isCollapsed.update((collapsed) => !collapsed);
  }
}
