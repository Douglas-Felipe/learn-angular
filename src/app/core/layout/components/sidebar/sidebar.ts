import { NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CHANGE_DETECTION_PATHS } from '@routing';
import { NavItem } from './interfaces/nav-item.interface';

@Component({
  selector: 'app-sidebar',
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  protected readonly isCollapsed = signal(false);
  protected readonly expandedGroups = signal<Record<string, boolean>>({
    [CHANGE_DETECTION_PATHS.root]: true,
  });

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
    {
      label: 'Change Detection',
      route: CHANGE_DETECTION_PATHS.root,
      icon: 'change-detection',
      exact: false,
      description: 'Zone.js vs Zoneless',
      children: [
        {
          label: 'Resumo & Analogias',
          route: CHANGE_DETECTION_PATHS.summary,
          badge: 'Guia',
        },
        {
          label: 'Zone.js (Clássico)',
          route: CHANGE_DETECTION_PATHS.zoneJs,
          badge: 'Tick',
        },
        {
          label: 'Zoneless + Signals',
          route: CHANGE_DETECTION_PATHS.zoneless,
          badge: 'v22',
        },
      ],
    },
  ]);

  protected isGroupExpanded(route: string): boolean {
    return !!this.expandedGroups()[route];
  }

  protected toggleGroup(route: string): void {
    this.expandedGroups.update((groups) => ({
      ...groups,
      [route]: !groups[route],
    }));
  }

  protected toggleCollapse(): void {
    this.isCollapsed.update((collapsed) => !collapsed);
  }
}
