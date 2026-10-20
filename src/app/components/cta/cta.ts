import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { QuoteService } from '../../core/quote.service';
import { SITE } from '../../core/site-info';

@Component({
  selector: 'app-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective],
  templateUrl: './cta.html',
  styleUrl: './cta.scss',
})
export class CtaComponent {
  private readonly quote = inject(QuoteService);

  protected readonly site = SITE;

  protected openQuote(): void {
    this.quote.open();
  }
}
