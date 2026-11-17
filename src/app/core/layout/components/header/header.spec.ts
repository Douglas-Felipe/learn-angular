import { TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
    }).compileComponents();
  });

  it('should render default title and docs link when no inputs are provided', () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe('');

    const docsLink = compiled.querySelector('a');
    expect(docsLink?.textContent?.trim()).toBe('?');
    expect(docsLink?.getAttribute('href')).toBe('');
    expect(docsLink?.getAttribute('target')).toBe('_blank');
    expect(docsLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render custom pageTitle and docsUrl passed as inputs', () => {
    const fixture = TestBed.createComponent(Header);

    fixture.componentRef.setInput('pageTitle', 'Life Cycle');
    fixture.componentRef.setInput('docsUrl', 'https://angular.dev/guide/components/lifecycle');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe('Life Cycle');

    const docsLink = compiled.querySelector('a');
    expect(docsLink?.getAttribute('href')).toBe('https://angular.dev/guide/components/lifecycle');
  });
});
