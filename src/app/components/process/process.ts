import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';

interface Step {
  number: string;
  icon: string;
  title: string;
  description: string;
  output: string;
}

@Component({
  selector: 'app-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective],
  templateUrl: './process.html',
  styleUrl: './process.scss',
})
export class ProcessComponent {
  protected readonly steps: readonly Step[] = [
    {
      number: '01',
      icon: 'search',
      title: 'Diagnóstico e escopo',
      description:
        'Entendemos o negócio, o público e as restrições. Definimos o que entra no projeto, o que fica para depois e quais resultados precisam ser alcançados.',
      output: 'Briefing, escopo e prioridades',
    },
    {
      number: '02',
      icon: 'pen',
      title: 'Arquitetura e design',
      description:
        'Desenhamos os fluxos, a interface e a estrutura técnica. Você visualiza o produto antes da primeira linha de código e aprova cada decisão.',
      output: 'Protótipo navegável e stack definida',
    },
    {
      number: '03',
      icon: 'code',
      title: 'Desenvolvimento',
      description:
        'Sprints curtas, código versionado e entregas frequentes. Frontend, backend, banco de dados e integrações evoluem juntos, com ambiente de testes.',
      output: 'Entregas contínuas e revisadas',
    },
    {
      number: '04',
      icon: 'check-circle',
      title: 'Testes e publicação',
      description:
        'Validamos responsividade, acessibilidade, performance e segurança. Publicamos com domínio, certificado, backup e monitoramento configurados.',
      output: 'Projeto no ar, estável e monitorado',
    },
    {
      number: '05',
      icon: 'rocket',
      title: 'Evolução contínua',
      description:
        'Acompanhamos o uso real, corrigimos desvios e planejamos as próximas melhorias. O produto continua evoluindo conforme o negócio cresce.',
      output: 'Suporte, métricas e novas versões',
    },
  ];
}
