import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { CHANGE_DETECTION_ROUTES } from './change-detection.routes';
import { CdWorkbench } from './components/cd-workbench/cd-workbench';
import { CdSummary } from './pages/cd-summary/cd-summary';

describe('CHANGE_DETECTION_ROUTES', () => {
  it('should define redirect to resumo and lazy-loaded resumo, zone-js, and zoneless routes', async () => {
    expect(CHANGE_DETECTION_ROUTES).toHaveLength(4);

    const [redirectRoute, summaryRoute, zoneRoute, zonelessRoute] = CHANGE_DETECTION_ROUTES;

    expect(redirectRoute).toEqual({
      path: '',
      pathMatch: 'full',
      redirectTo: 'resumo',
    });

    expect(summaryRoute.path).toBe('resumo');
    expect(summaryRoute.title).toBe('Detecção de Mudanças • Resumo');
    expect(summaryRoute.data?.docsUrl).toBe('https://angular.dev/best-practices/skipping-subtrees');
    expect(await summaryRoute.loadComponent?.()).toBe(CdSummary);

    expect(zoneRoute.path).toBe('zone-js');
    expect(zoneRoute.title).toBe('Detecção de Mudanças • Zone.js');
    expect(zoneRoute.data).toEqual({
      mode: 'zone-js',
      docsUrl: 'https://angular.dev/best-practices/skipping-subtrees',
    });
    expect(await zoneRoute.loadComponent?.()).toBe(CdWorkbench);

    expect(zonelessRoute.path).toBe('zoneless');
    expect(zonelessRoute.title).toBe('Detecção de Mudanças • Zoneless + Signals');
    expect(zonelessRoute.data).toEqual({
      mode: 'zoneless',
      docsUrl: 'https://angular.dev/guide/zoneless',
    });
    expect(await zonelessRoute.loadComponent?.()).toBe(CdWorkbench);
  });

  it('should bind route data mode directly into CdWorkbench via withComponentInputBinding', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(CHANGE_DETECTION_ROUTES, withComponentInputBinding())],
    });

    const harness = await RouterTestingHarness.create('/zone-js');
    expect(harness.routeNativeElement?.textContent).toContain('Detecção de Mudanças • Zone.js');

    await harness.navigateByUrl('/zoneless');
    expect(harness.routeNativeElement?.textContent).toContain(
      'Detecção de Mudanças • Zoneless + Signals'
    );
  });
});
