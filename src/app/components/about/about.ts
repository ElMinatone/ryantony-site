import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { QuoteService } from '../../core/quote.service';
import { SITE } from '../../core/site-info';

interface Value {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  private readonly quote = inject(QuoteService);

  protected readonly site = SITE;

  protected readonly values: readonly Value[] = [
    {
      icon: 'target',
      title: 'Precisão',
      description: 'Escopo claro, código organizado e decisões técnicas explicadas sem jargão desnecessário.',
    },
    {
      icon: 'users',
      title: 'Transparência',
      description: 'Você acompanha o andamento, entende o que está sendo feito e participa das escolhas.',
    },
    {
      icon: 'layers',
      title: 'Parceria',
      description: 'O projeto não termina no deploy. Seguimos junto na evolução e no suporte do produto.',
    },
    {
      icon: 'bolt',
      title: 'Evolução',
      description: 'Tecnologia e negócio mudam. Construímos uma base preparada para as próximas versões.',
    },
  ];

  protected openQuote(): void {
    this.quote.open();
  }
}
