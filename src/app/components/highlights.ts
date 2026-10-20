import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

interface Highlight {
  value: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-highlights',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="section section--tight">
      <div class="container">
        <div class="specs__head">
          <span class="index">/ 01 — COMPROMISSOS</span>
          <span class="index">04 PONTOS</span>
        </div>

        <div class="specs">
          @for (item of items; track item.label; let i = $index) {
            <article class="spec" appReveal [appReveal]="i * 70">
              <span class="spec__index">{{ '0' + (i + 1) }}</span>
              <strong class="spec__value">{{ item.value }}</strong>
              <span class="spec__label">{{ item.label }}</span>
              <p>{{ item.description }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .specs__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--line-soft);
    }

    .specs {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .spec {
      position: relative;
      padding: 30px 26px 34px 0;
      border-right: 1px solid var(--line-soft);
    }

    .spec + .spec {
      padding-left: 26px;
    }

    .spec:last-child {
      border-right: 0;
    }

    .spec__index {
      display: block;
      margin-bottom: 26px;
      color: var(--muted-2);
      font-family: var(--font-mono);
      font-size: 0.58rem;
      letter-spacing: 0.16em;
    }

    .spec__value {
      display: block;
      font-family: var(--font-display);
      font-size: clamp(1.9rem, 3vw, 2.6rem);
      font-weight: 500;
      letter-spacing: -0.05em;
      line-height: 1;
      color: var(--text);
    }

    .spec:hover .spec__value {
      color: var(--green);
    }

    .spec__label {
      display: block;
      margin-top: 10px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: 0.62rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .spec p {
      margin-top: 12px;
      max-width: 260px;
      color: var(--muted);
      font-size: 0.82rem;
      line-height: 1.65;
    }

    @media (max-width: 1024px) {
      .specs {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .spec,
      .spec + .spec {
        padding-left: 0;
        padding-right: 26px;
      }
      .spec:nth-child(2n) {
        border-right: 0;
        padding-right: 0;
      }
      .spec:nth-child(2n + 1) {
        padding-right: 26px;
      }
      .spec:nth-child(-n + 2) {
        border-bottom: 1px solid var(--line-soft);
      }
    }

    @media (max-width: 620px) {
      .specs {
        grid-template-columns: 1fr;
      }
      .spec,
      .spec + .spec {
        padding: 24px 0;
        border-right: 0;
        border-bottom: 1px solid var(--line-soft);
      }
      .spec:last-child {
        border-bottom: 0;
      }
      .spec__index {
        margin-bottom: 16px;
      }
    }
  `,
})
export class HighlightsComponent {
  protected readonly items: readonly Highlight[] = [
    {
      value: '100%',
      label: 'Sob medida',
      description: 'Código próprio, escrito para o seu contexto. Nada de template genérico empurrado na operação.',
    },
    {
      value: '< 24h',
      label: 'Retorno inicial',
      description: 'Você envia a ideia e recebe um direcionamento claro de escopo, caminho técnico e próximos passos.',
    },
    {
      value: '1:1',
      label: 'Contato direto',
      description: 'Sem intermediários: você fala com quem projeta, programa e acompanha a entrega do projeto.',
    },
    {
      value: '360°',
      label: 'Visão completa',
      description: 'Estratégia, design, frontend, backend, dados, integrações, deploy e evolução contínua.',
    },
  ];
}
