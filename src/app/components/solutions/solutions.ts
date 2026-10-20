import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { QuoteService } from '../../core/quote.service';

interface Solution {
  step: string;
  icon: string;
  title: string;
  audience: string;
  description: string;
  items: string[];
}

@Component({
  selector: 'app-solutions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective],
  templateUrl: './solutions.html',
  styleUrl: './solutions.scss',
})
export class SolutionsComponent {
  private readonly quote = inject(QuoteService);

  protected readonly solutions: readonly Solution[] = [
    {
      step: '01',
      icon: 'rocket',
      title: 'Tirar a ideia do papel',
      audience: 'Novos negócios, produtos e projetos do zero',
      description:
        'Transformamos a ideia em um produto funcional. Começamos pelo essencial: público, proposta, fluxo e um MVP com escopo enxuto, testável e pronto para receber os primeiros usuários sem meses de espera.',
      items: [
        'MVP em etapas curtas, com entregas visíveis',
        'Site, landing page ou aplicação web completa',
        'Identidade aplicada e experiência responsiva',
        'Publicação, domínio e acompanhamento inicial',
      ],
    },
    {
      step: '02',
      icon: 'cpu',
      title: 'Organizar a operação',
      audience: 'Times que já vendem e precisam de estrutura',
      description:
        'Planilhas espalhadas, aprovações por mensagem e retrabalho consomem tempo. Construímos um sistema central para a rotina da empresa, com dados confiáveis, permissões por perfil e visão clara do que acontece.',
      items: [
        'Sistema interno, portal ou painel administrativo',
        'Modelagem de dados e migração do que já existe',
        'Automação de tarefas e notificações',
        'Relatórios e indicadores para decisão',
      ],
    },
    {
      step: '03',
      icon: 'chart',
      title: 'Escalar o que já funciona',
      audience: 'Empresas com produto validado e metas de crescimento',
      description:
        'O projeto funciona, mas precisa de velocidade, integrações e uma base mais sólida. Auditamos o que existe, organizamos a arquitetura e evoluímos o produto sem interromper a operação.',
      items: [
        'Auditoria de performance, segurança e código',
        'Integrações com pagamentos, ERPs e CRMs',
        'Refatoração e evolução da arquitetura',
        'Deploy, monitoramento e melhoria contínua',
      ],
    },
  ];

  protected openQuote(): void {
    this.quote.open();
  }
}
