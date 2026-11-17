import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Header } from './header';

@Component({ template: '' })
class DummyPage {}

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([
          {
            path: '',
            component: DummyPage,
            title: 'Home',
            data: { docsUrl: 'https://angular.dev/overview' },
          },
          {
            path: 'life-cycle',
            component: DummyPage,
            title: 'Life Cycle',
            data: { docsUrl: 'https://angular.dev/guide/components/lifecycle' },
          },
        ]),
      ],
    }).compileComponents();
  });

  it('should render page title and Angular docs link on initial route', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');

    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe('Home');

    const docsLink = compiled.querySelector('a');
    expect(docsLink?.textContent?.trim()).toBe('?');
    expect(docsLink?.getAttribute('href')).toBe('https://angular.dev/overview');
    expect(docsLink?.getAttribute('target')).toBe('_blank');
    expect(docsLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should update title and docsUrl when navigating between routes', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(Header);

    await router.navigateByUrl('/life-cycle');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe('Life Cycle');
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe(
      'https://angular.dev/guide/components/lifecycle'
    );

    await router.navigateByUrl('/');
    fixture.detectChanges();

    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe('Home');
    expect(compiled.querySelector('a')?.getAttribute('href')).toBe('https://angular.dev/overview');
  });
});
