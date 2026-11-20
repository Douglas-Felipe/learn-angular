import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AppRoute } from '../interfaces/router-data.interface';
import { DEFAULT_DOCS_URL, DEFAULT_PAGE_TITLE, injectActiveRouteData } from './route-data.util';

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
    path: 'fallback',
    component: DummyPage,
  },
  {
    path: 'data-title',
    component: DummyPage,
    data: { title: 'Custom Data Title', docsUrl: 'https://angular.dev/data' },
  },
  {
    path: 'resolved-title',
    component: DummyPage,
    title: () => 'Resolved Function Title',
  },
  {
    path: 'nested',
    children: [
      {
        path: 'child',
        component: DummyPage,
        title: 'Nested Child',
        data: { docsUrl: 'https://angular.dev/nested' },
      },
    ],
  },
];

describe('injectActiveRouteData', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(testRoutes)],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should return initial route metadata as a reactive signal', async () => {
    await router.navigateByUrl('/');

    TestBed.runInInjectionContext(() => {
      const routeData = injectActiveRouteData();
      expect(routeData().title).toBe('Home');
      expect(routeData().docsUrl).toBe('https://angular.dev/overview');
    });
  });

  it('should update signal values upon router navigation', async () => {
    await router.navigateByUrl('/');

    await TestBed.runInInjectionContext(async () => {
      const routeData = injectActiveRouteData();
      expect(routeData().title).toBe('Home');

      await router.navigateByUrl('/life-cycle');
      expect(routeData().title).toBe('Life Cycle');
      expect(routeData().docsUrl).toBe('https://angular.dev/guide/components/lifecycle');
    });
  });

  it('should return default values when route metadata is absent', async () => {
    await router.navigateByUrl('/fallback');

    TestBed.runInInjectionContext(() => {
      const routeData = injectActiveRouteData();
      expect(routeData().title).toBe(DEFAULT_PAGE_TITLE);
      expect(routeData().docsUrl).toBe(DEFAULT_DOCS_URL);
    });
  });

  it('should fall back to route data.title when snapshot.title and routeConfig.title are absent', async () => {
    await router.navigateByUrl('/data-title');

    TestBed.runInInjectionContext(() => {
      const routeData = injectActiveRouteData();
      expect(routeData().title).toBe('Custom Data Title');
      expect(routeData().docsUrl).toBe('https://angular.dev/data');
    });
  });

  it('should resolve deepest child route metadata and function-based titles', async () => {
    await router.navigateByUrl('/nested/child');

    TestBed.runInInjectionContext(() => {
      const routeData = injectActiveRouteData();
      expect(routeData().title).toBe('Nested Child');
      expect(routeData().docsUrl).toBe('https://angular.dev/nested');
    });

    await router.navigateByUrl('/resolved-title');

    TestBed.runInInjectionContext(() => {
      const routeData = injectActiveRouteData();
      expect(routeData().title).toBe('Resolved Function Title');
      expect(routeData().docsUrl).toBe(DEFAULT_DOCS_URL);
    });
  });
});
