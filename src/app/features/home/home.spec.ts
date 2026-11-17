import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero gradient title, active Hooks card, and inactive State and Browser cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Angular');
    expect(compiled.textContent).toContain('por debaixo dos panos');
    expect(compiled.textContent).not.toContain('lifecycle-probe.component.ts');

    const hooksCard = compiled.querySelector('[data-testid="card-hooks"]');
    const stateCard = compiled.querySelector('[data-testid="card-state"]');
    const browserCard = compiled.querySelector('[data-testid="card-browser"]');

    expect(hooksCard?.getAttribute('href')).toBe('/life-cycle');
    expect(stateCard?.getAttribute('aria-disabled')).toBe('true');
    expect(browserCard?.getAttribute('aria-disabled')).toBe('true');
  });
});
