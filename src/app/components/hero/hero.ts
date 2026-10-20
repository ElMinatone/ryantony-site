import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { QuoteService } from '../../core/quote.service';
import { SITE } from '../../core/site-info';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  private readonly quote = inject(QuoteService);

  protected readonly site = SITE;

  protected readonly capabilities = [
    'Sites institucionais e landing pages',
    'Sistemas web e painéis administrativos',
    'APIs, integrações e automações',
    'Performance, segurança e infraestrutura',
  ];

  protected readonly marquee = [
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
