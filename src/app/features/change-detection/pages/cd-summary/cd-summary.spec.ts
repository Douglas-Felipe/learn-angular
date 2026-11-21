import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CdSummary } from './cd-summary';

describe('CdSummary', () => {
  let fixture: ComponentFixture<CdSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdSummary],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CdSummary);
    fixture.detectChanges();
  });

  it('should render analogies for Zone.js, OnPush common errors, Signals, comparison table, and lab CTAs', () => {
    expect(fixture.componentInstance).toBeTruthy();
    const el = fixture.nativeElement as HTMLElement;
    const content = el.textContent ?? '';

    expect(content).toContain('Como o Angular sabe o que atualizar na tela?');
    expect(content).toContain('O Porteiro Curioso que Bate em Todas as Portas');
    expect(content).toContain('A Placa de "Não Perturbe" na Porta do Apartamento');
    expect(content).toContain('Trocar o conteúdo mantendo a mesma caixa');
    expect(content).toContain('Esquecer de avisar após setTimeout ou callback externo');
    expect(content).toContain('Acordar todo o corredor para entregar em 1 apartamento');
    expect(content).toContain('Notificação Direta por Assinatura (Entrega por GPS)');

    const rows = el.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(3);
    expect(content).toContain('Zone.js + Eager');
    expect(content).toContain('Zone.js + OnPush');
    expect(content).toContain('Zoneless + Signals (OnPush v22)');

    const mutationLink = el.querySelector('[data-testid="error-example-mutation"]');
    expect(mutationLink?.getAttribute('href')).toBe('/life-cycle');
    expect(mutationLink?.textContent).toContain('Ver exemplo prático em Ciclo de Vida');
    expect(el.querySelector('[data-testid="error-example-timeout"]')).toBeNull();
    expect(el.querySelector('[data-testid="error-example-ancestors"]')).toBeNull();

    const zoneCta = el.querySelector('[data-testid="summary-cta-zone-js"]');
    const zonelessCta = el.querySelector('[data-testid="summary-cta-zoneless"]');
    expect(zoneCta?.getAttribute('href')).toBe('/change-detection/zone-js');
    expect(zonelessCta?.getAttribute('href')).toBe('/change-detection/zoneless');
  });
});
