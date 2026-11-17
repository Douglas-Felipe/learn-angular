import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero gradient title, pill CTA, active Hooks card, and inactive State and Browser cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Learn Angular');
    expect(compiled.textContent).toContain('por debaixo dos panos');
    expect(compiled.textContent).not.toContain('lifecycle-probe.component.ts');
    expect(compiled.querySelector('[data-testid="hero-cta"]')?.getAttribute('href')).toBe(
      '/life-cycle'
    );

    const hooksCard = compiled.querySelector('[data-testid="card-hooks"]');
    const stateCard = compiled.querySelector('[data-testid="card-state"]');
    const browserCard = compiled.querySelector('[data-testid="card-browser"]');

    expect(hooksCard?.getAttribute('href')).toBe('/life-cycle');
    expect(stateCard?.getAttribute('aria-disabled')).toBe('true');
    expect(browserCard?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should copy CLI command with temporary feedback', () => {
    vi.useFakeTimers();
    const compiled = fixture.nativeElement as HTMLElement;

    const copyCliBtn = compiled.querySelector('[data-testid="copy-cli-btn"]') as HTMLButtonElement;
    expect(copyCliBtn.textContent).toContain('Copiar');
    copyCliBtn.click();
    fixture.detectChanges();
    expect(copyCliBtn.textContent).toContain('Copiado!');

    vi.advanceTimersByTime(1800);
    fixture.detectChanges();
    expect(copyCliBtn.textContent).toContain('Copiar');
  });
});
