import { Component } from '@angular/core';
import { injectActiveRouteData } from '@routing';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  imports: [Header, Sidebar],
  selector: 'app-layout',
  templateUrl: './layout.html',
})
export class Layout {
  protected readonly currentRoute = injectActiveRouteData();
}
