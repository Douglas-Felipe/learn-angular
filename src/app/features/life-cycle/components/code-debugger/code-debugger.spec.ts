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

  it('should render card-demo.component.ts with active breakpoint line and object input', () => {
    expect(component).toBeTruthy();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('card-demo.component.ts');
    expect(text).toContain('Breakpoint: constructor()');
    expect(text).toContain('// [DEBUG] this = CardDemoComponent {} | texto() = undefined');
    expect(text).toContain("readonly texto = input('Olá, Angular!');");
    expect(text).toContain("readonly usuario = input({ nome: 'Ada Lovelace' });");
    expect(text).toContain('// ref #1');
  });

  it('should resolve inputLiteral, objectLiteral, and objectRefLiteral across all fallback branches', () => {
    const baseStep = buildMountSteps('Base')[0];

    // 1. memoryText & memoryObjectName present with custom objectRefId
    fixture.componentRef.setInput('step', {
      ...baseStep,
      memoryText: 'MemTexto',
      domText: 'DomTexto',
      memoryObjectName: 'Grace Hopper',
      domObjectName: 'Ada Lovelace',
      objectRefId: 3,
    });
    fixture.componentRef.setInput('draftText', 'DraftTexto');
    fixture.detectChanges();
    let text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain("readonly texto = input('MemTexto');");
    expect(text).toContain("readonly usuario = input({ nome: 'Grace Hopper' });");
    expect(text).toContain('// ref #3');

    // 2. memoryText empty -> falls back to domText; memoryObjectName empty -> falls back to domObjectName
    fixture.componentRef.setInput('step', {
      ...baseStep,
      memoryText: '',
      domText: 'DomTexto',
      memoryObjectName: '',
      domObjectName: 'Margaret Hamilton',
      objectRefId: undefined,
    });
    fixture.detectChanges();
    text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain("readonly texto = input('DomTexto');");
    expect(text).toContain("readonly usuario = input({ nome: 'Margaret Hamilton' });");
    expect(text).toContain('// ref #1');

    // 3. both memory and dom empty -> falls back to draftText and DEFAULT_OBJECT_NAME
    fixture.componentRef.setInput('step', {
      ...baseStep,
      memoryText: '',
      domText: '',
      memoryObjectName: '',
      domObjectName: '',
      objectRefId: undefined,
    });
    fixture.detectChanges();
    text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain("readonly texto = input('DraftTexto');");
    expect(text).toContain("readonly usuario = input({ nome: 'Ada Lovelace' });");
    expect(text).toContain('// ref #1');
  });
});
