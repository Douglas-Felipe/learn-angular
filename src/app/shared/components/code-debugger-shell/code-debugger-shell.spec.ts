import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeDebuggerShell } from './code-debugger-shell';
import { DebuggerCodeBlockView } from './code-debugger-shell.interface';

@Component({
  imports: [CodeDebuggerShell],
  template: `
    <app-code-debugger-shell
      ariaLabel="Debugger de Teste"
      fileName="sample.component.ts"
      breakpointLabel="init()"
      breakpointBadgeClasses="border-ng-info text-ng-info"
      breakpointDotClass="bg-ng-info"
      [blocks]="blocks()"
    >
      <button debuggerHeaderActions type="button">Tab</button>
      <div debuggerClassHeader>export class SampleComponent &#123;</div>
    </app-code-debugger-shell>
  `,
})
class TestShellHost {
  readonly blocks = signal<readonly DebuggerCodeBlockView[]>([
    {
      id: 'first',
      signature: 'firstHook()',
      descriptionComment: '// first comment',
      exampleLine: 'firstCall();',
      isActive: true,
      activeClasses: 'border-ng-info bg-ng-info/15',
      activeTextClass: 'text-ng-info',
      debugLine: 'active debug output',
    },
    {
      id: 'second',
      signature: 'secondHook(() =>',
      descriptionComment: '// second comment',
      exampleLine: 'secondCall();',
      closingBrace: '});',
      isActive: false,
      activeClasses: 'border-ng-success',
      activeTextClass: 'text-ng-success',
      debugLine: 'hidden debug output',
    },
  ]);
}

describe('CodeDebuggerShell', () => {
  let fixture: ComponentFixture<TestShellHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestShellHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestShellHost);
    fixture.detectChanges();
  });

  it('should render header chrome, projected slots, active debug line, and closing braces', () => {
    const el = fixture.nativeElement as HTMLElement;
    const section = el.querySelector('section');
    expect(section?.getAttribute('aria-label')).toBe('Debugger de Teste');
    expect(el.textContent).toContain('sample.component.ts');
    expect(el.textContent).toContain('Breakpoint: init()');
    expect(el.textContent).toContain('Tab');
    expect(el.textContent).toContain('export class SampleComponent {');

    const firstBlock = el.querySelector('[data-phase-block="first"]') as HTMLElement;
    expect(firstBlock.className).toContain('border-ng-info');
    expect(firstBlock.textContent).toContain('// [DEBUG] active debug output');
    expect(firstBlock.textContent).toContain('}');

    const secondBlock = el.querySelector('[data-phase-block="second"]') as HTMLElement;
    expect(secondBlock.className).toContain('opacity-45');
    expect(secondBlock.textContent).not.toContain('hidden debug output');
    expect(secondBlock.textContent).toContain('});');
  });

  it('should omit debug line when active block has no debugLine', () => {
    fixture.componentInstance.blocks.set([
      {
        id: 'only',
        signature: 'onlyHook()',
        descriptionComment: '// comment',
        exampleLine: 'call();',
        isActive: true,
        activeClasses: 'border-ng-info',
        activeTextClass: 'text-ng-info',
      },
    ]);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).not.toContain('// [DEBUG]');
  });
});
