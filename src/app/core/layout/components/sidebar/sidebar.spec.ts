import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Sidebar } from './sidebar';

@Component({ template: '' })
class DummyRouteComponent {}

describe('Sidebar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([
          { path: '', component: DummyRouteComponent },
          {
            path: 'life-cycle',
            children: [
              { path: '', component: DummyRouteComponent },
              { path: 'sub', component: DummyRouteComponent },
            ],
          },
          {
            path: 'change-detection',
            children: [
              { path: '', redirectTo: 'resumo', pathMatch: 'full' },
              { path: 'resumo', component: DummyRouteComponent },
              { path: 'zone-js', component: DummyRouteComponent },
              { path: 'zoneless', component: DummyRouteComponent },
            ],
          },
        ]),
      ],
    }).compileComponents();
  });

  it('should create the sidebar component', () => {
    const fixture = TestBed.createComponent(Sidebar);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render navigation links, descriptions, icons, badges, expandable group, and active matching', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/life-cycle/sub');

    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('nav a'));
    expect(links).toHaveLength(5);
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[1].getAttribute('href')).toBe('/life-cycle');
    expect(links[2].getAttribute('href')).toBe('/change-detection/resumo');
    expect(links[3].getAttribute('href')).toBe('/change-detection/zone-js');
    expect(links[4].getAttribute('href')).toBe('/change-detection/zoneless');

    expect(compiled.textContent).toContain('Home');
    expect(compiled.textContent).toContain('Visão geral do projeto');
    expect(compiled.textContent).toContain('Lifecycle');
    expect(compiled.textContent).toContain('Ganchos de ciclo de vida');
    expect(compiled.textContent).toContain('Change Detection');
    expect(compiled.textContent).toContain('Zone.js vs Zoneless');
    expect(compiled.textContent).toContain('Resumo & Analogias');
    expect(links[2].textContent).toContain('Guia');
    expect(compiled.textContent).toContain('Zone.js (Clássico)');
    expect(links[3].textContent).toContain('Tick');
    expect(compiled.textContent).toContain('Zoneless + Signals');
    expect(links[4].textContent).toContain('v22');

    // Home, Lifecycle and Change Detection group each render their SVG icon
    expect(links[0].querySelector('svg')).toBeTruthy();
    expect(links[1].querySelector('svg')).toBeTruthy();
    expect(
      compiled.querySelector('[data-testid="nav-group-change-detection"] svg')
    ).toBeTruthy();

    // Home has exact: true so it is inactive on /life-cycle/sub; Lifecycle has exact: false so it stays active
    expect(links[0].classList.contains('ng-active-glow')).toBe(false);
    expect(links[1].classList.contains('ng-active-glow')).toBe(true);

    // Navigating to /change-detection/zoneless highlights the Zoneless child link
    await router.navigateByUrl('/change-detection/zoneless');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(links[1].classList.contains('ng-active-glow')).toBe(false);
    expect(links[2].classList.contains('ng-active-glow')).toBe(false);
    expect(links[3].classList.contains('ng-active-glow')).toBe(false);
    expect(links[4].classList.contains('ng-active-glow')).toBe(true);
  });

  it('should toggle Change Detection group children when clicking the group button', () => {
    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const groupBtn = compiled.querySelector(
      '[data-testid="nav-group-change-detection"]'
    ) as HTMLButtonElement;

    expect(groupBtn.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.querySelectorAll('nav a')).toHaveLength(5);

    groupBtn.click();
    fixture.detectChanges();

    expect(groupBtn.getAttribute('aria-expanded')).toBe('false');
    expect(compiled.querySelectorAll('nav a')).toHaveLength(2);

    groupBtn.click();
    fixture.detectChanges();

    expect(groupBtn.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.querySelectorAll('nav a')).toHaveLength(5);
  });

  it('should collapse and expand the sidebar keeping active highlight on /change-detection child route', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/change-detection/zoneless');

    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const aside = compiled.querySelector('aside') as HTMLElement;
    const toggleBtn = compiled.querySelector('[data-testid="sidebar-toggle"]') as HTMLButtonElement;

    expect(aside.getAttribute('data-collapsed')).toBe('false');
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.textContent).toContain('Learn Angular');

    toggleBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(aside.getAttribute('data-collapsed')).toBe('true');
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
    expect(compiled.textContent).not.toContain('Learn Angular');

    // Collapsed mode exposes top-level Change Detection link with exact: false (active on child route)
    const collapsedLinks = Array.from(compiled.querySelectorAll('nav a'));
    expect(collapsedLinks).toHaveLength(3);
    expect(collapsedLinks[2].getAttribute('href')).toBe('/change-detection');
    expect(collapsedLinks[2].classList.contains('ng-active-glow')).toBe(true);

    toggleBtn.click();
    fixture.detectChanges();

    expect(aside.getAttribute('data-collapsed')).toBe('false');
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.textContent).toContain('Learn Angular');
  });
});
