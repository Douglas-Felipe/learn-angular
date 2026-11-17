import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HOOK_THEMES, buildMountSteps } from '../../utils/life-cycle.util';
import { DemoCard } from './demo-card';

describe('DemoCard', () => {
  let component: DemoCard;
  let fixture: ComponentFixture<DemoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(DemoCard);
    component = fixture.componentInstance;

    const initialStep = buildMountSteps('Olá, Angular!')[0];
    fixture.componentRef.setInput('step', initialStep);
    fixture.componentRef.setInput('theme', HOOK_THEMES[initialStep.hook]);
    fixture.componentRef.setInput('stepIndex', 0);
    fixture.componentRef.setInput('totalSteps', 10);
    fixture.componentRef.setInput('isPlaying', false);
    fixture.componentRef.setInput('isMountedTarget', true);
    fixture.componentRef.setInput('draftText', 'Olá, Angular!');
    fixture.detectChanges();
  });

  it('should create and emit transport and form events', () => {
    expect(component).toBeTruthy();

    let nextCalled = false;
    let playCalled = false;
    let submitted = false;

    component.nextStep.subscribe(() => (nextCalled = true));
    component.togglePlay.subscribe(() => (playCalled = true));
    component.submitText.subscribe(() => (submitted = true));

    const el = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(el.querySelectorAll('button'));

    buttons.find((b) => b.textContent?.includes('Próximo hook'))?.click();
    expect(nextCalled).toBe(true);

    buttons.find((b) => b.textContent?.includes('Play'))?.click();
    expect(playCalled).toBe(true);

    const input = el.querySelector('#card-text-input') as HTMLInputElement;
    input.value = 'Novo valor';
    input.dispatchEvent(new Event('input'));
    expect(component.draftText()).toBe('Novo valor');

    const form = el.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    expect(submitted).toBe(true);
  });
});
