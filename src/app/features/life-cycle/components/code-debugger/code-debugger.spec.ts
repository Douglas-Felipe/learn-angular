import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HOOK_THEMES, buildMountSteps } from '../../utils/life-cycle.util';
import { CodeDebugger } from './code-debugger';

describe('CodeDebugger', () => {
  let component: CodeDebugger;
  let fixture: ComponentFixture<CodeDebugger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeDebugger],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeDebugger);
    component = fixture.componentInstance;

    const initialStep = buildMountSteps('Olá, Angular!')[0];
    fixture.componentRef.setInput('step', initialStep);
    fixture.componentRef.setInput('theme', HOOK_THEMES[initialStep.hook]);
    fixture.componentRef.setInput('draftText', 'Olá, Angular!');
    fixture.detectChanges();
  });

  it('should render card-demo.component.ts with active breakpoint line', () => {
    expect(component).toBeTruthy();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('card-demo.component.ts');
    expect(text).toContain('Breakpoint: constructor()');
    expect(text).toContain('// [DEBUG] this = CardDemoComponent {} | texto() = undefined');
  });
});
