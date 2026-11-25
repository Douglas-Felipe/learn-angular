import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UPCOMING_HOME_MODULES } from './data/home-modules.data';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  protected readonly upcomingModules = UPCOMING_HOME_MODULES;
}
