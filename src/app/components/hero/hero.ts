import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { TiltDirective } from '../../shared/tilt.directive';
import { PixelFieldComponent } from '../pixel-field';
import { QuoteService } from '../../core/quote.service';
import { SITE } from '../../core/site-info';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective, TiltDirective, PixelFieldComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  private readonly quote = inject(QuoteService);

  protected readonly site = SITE;

  protected readonly footItems = [
    { icon: 'bolt', label: 'Entrega contínua', value: 'do MVP à evolução' },
    { icon: 'layers', label: 'Fullstack', value: 'front, back e dados' },
    { icon: 'shield', label: 'Base sólida', value: 'performance e segurança' },
  ];

  protected readonly ticker = [
    'SITES',
    'SISTEMAS WEB',
    'APIS',
    'AUTOMAÇÃO',
    'E-COMMERCE',
    'DASHBOARDS',
    'INTEGRAÇÕES',
    'PERFORMANCE',
    'INFRAESTRUTURA',
    'FULLSTACK',
  ];

  protected openQuote(): void {
    this.quote.open();
  }
}
