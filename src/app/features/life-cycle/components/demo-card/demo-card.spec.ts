import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HOOK_THEMES,
  buildMountSteps,
  buildObjectMutateSteps,
  buildObjectRecreateSteps,
} from '../../utils/life-cycle.util';
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

  it('should create and emit transport, form, and object mutation/recreation events', () => {
    expect(component).toBeTruthy();

    let nextCalled = false;
    let playCalled = false;
    let submitted = false;
    let mutated = false;
    let recreated = false;

    component.nextStep.subscribe(() => (nextCalled = true));
    component.togglePlay.subscribe(() => (playCalled = true));
    component.submitText.subscribe(() => (submitted = true));
    component.mutateObject.subscribe(() => (mutated = true));
    component.recreateObject.subscribe(() => (recreated = true));

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
    const submitEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(submitEvent);
    expect(submitEvent.defaultPrevented).toBe(true);
    expect(submitted).toBe(true);

    const objInput = el.querySelector('#card-object-input') as HTMLInputElement;
    objInput.value = 'Grace Hopper';
    objInput.dispatchEvent(new Event('input'));
    expect(component.draftObjectName()).toBe('Grace Hopper');

    // Null event target fallback to empty string
    const internal = component as unknown as {
      onTextInput: (e: Event) => void;
      onObjectNameInput: (e: Event) => void;
    };
    internal.onTextInput({ target: null } as unknown as Event);
    expect(component.draftText()).toBe('');
    internal.onObjectNameInput({ target: null } as unknown as Event);
    expect(component.draftObjectName()).toBe('');

    buttons.find((b) => b.textContent?.includes('Mutar atributo'))?.click();
    expect(mutated).toBe(true);

    buttons.find((b) => b.textContent?.includes('Recriar objeto'))?.click();
    expect(recreated).toBe(true);
  });

  it('should evaluate hasPendingObjectChange strictly across mounted, mutationIgnored, and object name states', () => {
    const el = fixture.nativeElement as HTMLElement;
    const recreateStep = buildObjectRecreateSteps('Olá', 'Ada Lovelace', 'Grace Hopper', 1, 2)[0];

    // Unmounted with differing object names -> not pending
    fixture.componentRef.setInput('step', { ...recreateStep, mounted: false });
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-zinc-300');
    expect(el.textContent).not.toContain('Na memória (ref #');

    // Mounted with missing memoryObjectName -> not pending
    fixture.componentRef.setInput('step', {
      ...recreateStep,
      mounted: true,
      memoryObjectName: '',
      domObjectName: 'Ada Lovelace',
    });
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-ng-success');

    // Mounted with missing domObjectName -> not pending
    fixture.componentRef.setInput('step', {
      ...recreateStep,
      mounted: true,
      memoryObjectName: 'Grace Hopper',
      domObjectName: '',
    });
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-ng-success');

    // Mounted with identical memory and dom object names -> not pending
    fixture.componentRef.setInput('step', {
      ...recreateStep,
      mounted: true,
      memoryObjectName: 'Grace Hopper',
      domObjectName: 'Grace Hopper',
    });
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="dom-render-card"]')?.className).toContain('border-ng-success');
  });

  it('should render pending object change, ignored mutation, and mounted card without object metadata', () => {
    const el = fixture.nativeElement as HTMLElement;

    const recreateStep = buildObjectRecreateSteps('Olá', 'Ada Lovelace', 'Grace Hopper', 1, 2)[0];
    fixture.componentRef.setInput('step', recreateStep);
    fixture.componentRef.setInput('theme', HOOK_THEMES[recreateStep.hook]);
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain('ref #1');
    expect(el.textContent).toContain('Na memória (ref #2)');

    const pendingWithoutPrevRef = {
      ...recreateStep,
      previousObjectRefId: undefined,
      objectRefId: undefined,
    };
    fixture.componentRef.setInput('step', pendingWithoutPrevRef);
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="dom-object-badge"]')?.textContent).toContain('ref #1');

    const mutateStep = buildObjectMutateSteps('Olá', 'Ada Lovelace', 'Grace Hopper', 1)[0];
    fixture.componentRef.setInput('step', mutateStep);
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="mutation-ignored-alert"]')).toBeTruthy();

    const mountedWithoutObject = {
      ...buildMountSteps('Olá')[6],
      domObjectName: '',
      memoryObjectName: '',
      objectRefId: undefined,
    };
    fixture.componentRef.setInput('step', mountedWithoutObject);
    fixture.detectChanges();
    expect(el.querySelector('[data-testid="dom-object-badge"]')).toBeNull();
  });
});
