import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AppRoute } from '@routing';
import { Layout } from './layout';

@Component({ template: '' })
class DummyPage {}

const testRoutes: AppRoute[] = [
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
  {
    path: 'blocked',
    component: DummyPage,
    canActivate: [() => false],
  },
];

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout],
      providers: [provideRouter(testRoutes)],
    }).compileComponents();

    router = TestBed.inject(Router);
    await router.navigateByUrl('/');

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function scrollContainer(): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      '[data-testid="layout-scroll-container"]'
    ) as HTMLElement;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the sidebar and header with initial route data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();

    const header = compiled.querySelector('app-header');
    expect(header).toBeTruthy();
    expect(header?.querySelector('h1')?.textContent?.trim()).toBe('Home');
    expect(header?.querySelector('a')?.getAttribute('href')).toBe('https://angular.dev/overview');
  });

  it('should update header inputs and reset scroll position to top when route changes', async () => {
    const container = scrollContainer();
    container.scrollTop = 350;
    expect(container.scrollTop).toBe(350);

    await router.navigateByUrl('/life-cycle');
    fixture.detectChanges();

    expect(container.scrollTop).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('app-header');
    expect(header?.querySelector('h1')?.textContent?.trim()).toBe('Life Cycle');
    expect(header?.querySelector('a')?.getAttribute('href')).toBe(
      'https://angular.dev/guide/components/lifecycle'
    );
  });

  it('should preserve scroll position when navigation is blocked before NavigationEnd', async () => {
    const container = scrollContainer();
    container.scrollTop = 250;

    const navigated = await router.navigateByUrl('/blocked');
    fixture.detectChanges();

    expect(navigated).toBe(false);
    expect(container.scrollTop).toBe(250);
  });

  it('should unsubscribe router events on destroy', async () => {
    const container = scrollContainer();
    fixture.destroy();

    container.scrollTop = 180;
    await router.navigateByUrl('/life-cycle');
    expect(container.scrollTop).toBe(180);
  });

  it('should safely handle navigation when scroll container is absent', async () => {
    scrollContainer().remove();

    await expect(router.navigateByUrl('/life-cycle')).resolves.toBe(true);
  });
});
