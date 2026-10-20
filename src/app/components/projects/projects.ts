import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { QuoteService } from '../../core/quote.service';

interface Project {
  visual: 'dashboard' | 'shop' | 'portal' | 'automation';
  tags: string[];
  title: string;
  description: string;
  outcome: string;
}

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {
  private readonly quote = inject(QuoteService);

  protected readonly projects: readonly Project[] = [
    {
      visual: 'dashboard',
      tags: ['Sistema web', 'Fullstack'],
      title: 'Painel de gestão operacional',
      description:
        'Pedidos, equipe, estoque e indicadores em uma interface única. Perfis de acesso, histórico de ações, filtros e relatórios para acompanhar a operação sem depender de planilhas paralelas.',
      outcome: 'Menos retrabalho e decisões com dados atualizados.',
    },
    {
      visual: 'shop',
      tags: ['E-commerce', 'Integrações'],
      title: 'Loja online e catálogo integrado',
      description:
        'Vitrine rápida, busca, carrinho, checkout e painel de pedidos conectados ao meio de pagamento e à logística. Uma jornada de compra curta, com controle total do catálogo.',
      outcome: 'Mais conversão e uma operação de vendas organizada.',
    },
    {
      visual: 'portal',
      tags: ['Portal', 'Autoatendimento'],
      title: 'Portal do cliente',
      description:
        'Área segura para acompanhar solicitações, baixar documentos, consultar histórico e atualizar dados. O cliente resolve sozinho o que antes exigia uma mensagem para o atendimento.',
      outcome: 'Menos tickets repetitivos e mais autonomia.',
    },
    {
      visual: 'automation',
      tags: ['Automação', 'Dados'],
      title: 'Rotinas e relatórios automáticos',
      description:
        'Rotinas agendadas sincronizam dados entre sistemas, geram arquivos, enviam notificações e registram falhas. O time deixa de copiar informação e passa a analisar o que importa.',
      outcome: 'Horas de trabalho manual viram processos confiáveis.',
    },
  ];

  protected openQuote(): void {
    this.quote.open();
  }
}
