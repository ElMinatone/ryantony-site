import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-manifesto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="manifesto light-band">
      <span class="manifesto__pattern" aria-hidden="true"></span>

      <div class="container">
        <div class="manifesto__top" appReveal>
          <span>/ MANIFESTO</span>
          <span>RYANTONY — 2026</span>
        </div>

        <div class="manifesto__body">
          <h2 class="manifesto__title" appReveal>
            Tecnologia que
            <span class="manifesto__inline">
              constrói<span class="manifesto__pixel" aria-hidden="true"></span>ideias
            </span>
          </h2>

          <p class="manifesto__text" appReveal="120">
            Não entregamos apenas código. Entregamos estrutura: o site que apresenta, o sistema que
            organiza, a integração que economiza horas e a base técnica que sustenta o crescimento do
            seu negócio.
          </p>
        </div>

        <ul class="manifesto__steps" appReveal="200">
          @for (step of steps; track step.label) {
            <li>
              <span>{{ step.index }}</span>
              <strong>{{ step.label }}</strong>
              <em>{{ step.detail }}</em>
            </li>
          }
        </ul>
      </div>

      <div class="manifesto__ticker" aria-hidden="true">
        <div class="manifesto__track">
          @for (word of words; track word) {
            <span class="manifesto__word" [class.is-outline]="$index % 2 === 1">{{ word }}</span>
          }
          @for (word of words; track word + '-b') {
            <span class="manifesto__word" [class.is-outline]="$index % 2 === 1">{{ word }}</span>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './manifesto.scss',
})
export class ManifestoComponent {
  protected readonly steps = [
    { index: '01', label: 'Estratégia', detail: 'problema, escopo e prioridades' },
    { index: '02', label: 'Design', detail: 'fluxo, interface e identidade' },
    { index: '03', label: 'Código', detail: 'frontend, backend e dados' },
    { index: '04', label: 'Operação', detail: 'deploy, monitor e evolução' },
  ];

  protected readonly words = ['CÓDIGO', '·', 'PROCESSOS', '·', 'RESULTADOS', '·'];
}
