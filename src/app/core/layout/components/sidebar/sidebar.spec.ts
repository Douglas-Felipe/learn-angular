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
        ]),
      ],
    }).compileComponents();
  });

  it('should create the sidebar component', () => {
    const fixture = TestBed.createComponent(Sidebar);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render navigation links with routes, descriptions, and exact active matching', async () => {
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/life-cycle/sub');

    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const links = Array.from(compiled.querySelectorAll('nav a'));
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[1].getAttribute('href')).toBe('/life-cycle');
    expect(compiled.textContent).toContain('Home');
    expect(compiled.textContent).toContain('Visão geral do projeto');
    expect(compiled.textContent).toContain('Lifecycle');
    expect(compiled.textContent).toContain('Ganchos de ciclo de vida');

    // Home has exact: true so it is inactive on /life-cycle/sub; Lifecycle has exact: false so it stays active
    expect(links[0].classList.contains('ng-active-glow')).toBe(false);
    expect(links[1].classList.contains('ng-active-glow')).toBe(true);
  });

  it('should collapse and expand the sidebar when toggle button is clicked', () => {
    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const aside = compiled.querySelector('aside') as HTMLElement;
    const toggleBtn = compiled.querySelector('[data-testid="sidebar-toggle"]') as HTMLButtonElement;

    expect(aside.getAttribute('data-collapsed')).toBe('false');
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.textContent).toContain('Learn Angular');

    toggleBtn.click();
    fixture.detectChanges();

    expect(aside.getAttribute('data-collapsed')).toBe('true');
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
    expect(compiled.textContent).not.toContain('Learn Angular');

    toggleBtn.click();
    fixture.detectChanges();

    expect(aside.getAttribute('data-collapsed')).toBe('false');
    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.textContent).toContain('Learn Angular');
  });
});
