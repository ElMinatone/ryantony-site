import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../shared/icon';
import { RevealDirective } from '../shared/reveal.directive';

interface Highlight {
  value: string;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-highlights',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective],
  template: `
    <section class="section section--tight">
      <div class="container">
        <div class="highlights">
          @for (item of items; track item.label; let i = $index) {
            <article class="highlight" appReveal [appReveal]="i * 90">
              <span class="highlight__icon"><app-icon [name]="item.icon" [size]="20" /></span>
              <div class="highlight__body">
                <strong class="highlight__value">{{ item.value }}</strong>
                <span class="highlight__label">{{ item.label }}</span>
                <p>{{ item.description }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .highlights {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.008));
      overflow: hidden;
    }

    .highlight {
      position: relative;
      padding: 28px 26px;
      border-right: 1px solid var(--border);
    }

    .highlight:last-child {
      border-right: 0;
    }

    .highlight__icon {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      margin-bottom: 18px;
      border: 1px solid var(--green-line);
      border-radius: 11px;
      background: var(--green-soft);
      color: var(--green);
    }

    .highlight__value {
      display: block;
      font-family: var(--font-display);
      font-size: 1.65rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--green);
    }

    .highlight__label {
      display: block;
      margin-top: 6px;
      font-family: var(--font-display);
      font-size: 0.98rem;
      font-weight: 600;
      color: var(--text);
    }

    .highlight p {
      margin-top: 10px;
      color: var(--muted);
      font-size: 0.86rem;
      line-height: 1.65;
    }

    @media (max-width: 1024px) {
      .highlights {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .highlight:nth-child(2n) {
        border-right: 0;
      }
      .highlight:nth-child(-n + 2) {
        border-bottom: 1px solid var(--border);
      }
    }

    @media (max-width: 620px) {
      .highlights {
        grid-template-columns: 1fr;
      }
      .highlight {
        border-right: 0;
        border-bottom: 1px solid var(--border);
      }
      .highlight:last-child {
        border-bottom: 0;
      }
    }
  `,
})
export class HighlightsComponent {
  protected readonly items: readonly Highlight[] = [
    {
      value: '100%',
      label: 'Sob medida',
      description: 'Código próprio, escrito para o seu contexto. Nada de templates genéricos empurrados na sua operação.',
      icon: 'code',
    },
    {
      value: '< 24h',
      label: 'Retorno inicial',
      description: 'Você envia a ideia e recebe um direcionamento claro de escopo, caminho técnico e próximos passos.',
      icon: 'clock',
    },
    {
      value: '1:1',
      label: 'Contato direto',
      description: 'Sem intermediários: você fala com quem projeta, programa e acompanha a entrega do projeto.',
      icon: 'users',
    },
    {
      value: '360°',
      label: 'Visão completa',
      description: 'Estratégia, design, frontend, backend, banco de dados, integrações, deploy e evolução contínua.',
      icon: 'globe',
    },
  ];
}
