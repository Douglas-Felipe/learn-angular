import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UPCOMING_HOME_MODULES } from './data/home-modules.data';
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

  it('should render the hero gradient title, active Hooks and State cards, and inactive Browser card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Angular');
    expect(compiled.textContent).toContain('por debaixo dos panos');
    expect(compiled.textContent).not.toContain('lifecycle-probe.component.ts');

    const hooksCard = compiled.querySelector('[data-testid="card-hooks"]');
    const stateCard = compiled.querySelector('[data-testid="card-state"]');
    const browserCard = compiled.querySelector('[data-testid="card-browser"]');

    expect(hooksCard?.getAttribute('href')).toBe('/life-cycle');
    expect(stateCard?.getAttribute('href')).toBe('/change-detection');
    expect(browserCard?.getAttribute('aria-disabled')).toBe('true');
  });

  it('should render 15 module cards in total with all 13 upcoming cards disabled in order', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const activeCards = compiled.querySelectorAll('a.ui-item-card');
    const upcomingCards = Array.from(compiled.querySelectorAll('article.ui-item-card'));

    expect(UPCOMING_HOME_MODULES.length).toBe(13);
    expect(activeCards.length).toBe(2);
    expect(upcomingCards.length).toBe(13);
    expect(compiled.querySelectorAll('.ui-item-card').length).toBe(15);
    expect(upcomingCards.map((card) => card.getAttribute('data-testid'))).toEqual(
      UPCOMING_HOME_MODULES.map((module) => `card-${module.id}`)
    );

    for (const module of UPCOMING_HOME_MODULES) {
      const card = compiled.querySelector(`[data-testid="card-${module.id}"]`);
      expect(card).toBeTruthy();
      expect(card?.getAttribute('aria-disabled')).toBe('true');
      expect(card?.textContent).toContain(module.badge);
      expect(card?.textContent).toContain(module.title);
      expect(card?.textContent).toContain(module.description);
      expect(card?.textContent).toContain('Em breve');
    }
  });
});
