import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/layout/header';
import { Sidebar } from './core/layout/sidebar';

@Component({
  imports: [RouterOutlet, Sidebar, Header],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('learn-angular');
}
