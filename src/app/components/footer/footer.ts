import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { QuoteService } from '../../core/quote.service';
import { NAV_LINKS, SITE } from '../../core/site-info';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  private readonly quote = inject(QuoteService);

  protected readonly site = SITE;
  protected readonly links = NAV_LINKS;
  protected readonly year = new Date().getFullYear();

  protected readonly services = [
    'Sites e landing pages',
    'Sistemas web fullstack',
    'APIs e integrações',
    'Automação de processos',
    'E-commerce e produtos digitais',
    'Performance, segurança e infra',
  ];

  protected openQuote(): void {
    this.quote.open();
  }

  protected toTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
