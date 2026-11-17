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

  it('should update header inputs when route changes', async () => {
    await router.navigateByUrl('/life-cycle');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const header = compiled.querySelector('app-header');
    expect(header?.querySelector('h1')?.textContent?.trim()).toBe('Life Cycle');
    expect(header?.querySelector('a')?.getAttribute('href')).toBe(
      'https://angular.dev/guide/components/lifecycle'
    );
  });
});
