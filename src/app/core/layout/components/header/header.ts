import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  readonly pageTitle = input<string>();
  readonly docsUrl = input<string>();
}
