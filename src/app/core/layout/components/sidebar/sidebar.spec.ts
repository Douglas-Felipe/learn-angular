import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the sidebar component', () => {
    const fixture = TestBed.createComponent(Sidebar);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render navigation links', () => {
    const fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('nav a');
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(compiled.textContent).toContain('Home');
    expect(compiled.textContent).toContain('Lifecycle');
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
