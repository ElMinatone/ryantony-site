import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { QuoteService } from '../../core/quote.service';

interface Service {
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  tags: string[];
}

@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class ServicesComponent {
  private readonly quote = inject(QuoteService);

  protected readonly services: readonly Service[] = [
    {
      number: '01',
      title: 'Sites e Landing Pages',
      tagline: 'Presença digital que trabalha pela sua marca',
      description:
        'Sites institucionais, páginas de campanha, portfólios e landing pages pensados para carregar rápido, aparecer no Google e transformar visita em contato. Arquitetura da informação, redação das seções, design responsivo e publicação incluídos no fluxo.',
      deliverables: [
        'Design exclusivo e 100% responsivo',
        'SEO técnico, meta tags e dados estruturados',
        'Formulários, WhatsApp e integrações de contato',
      ],
      tags: ['UI/UX', 'SEO', 'Core Web Vitals'],
    },
    {
      number: '02',
      title: 'Sistemas Web Fullstack',
      tagline: 'Software sob medida para a sua operação',
      description:
        'Painéis administrativos, ERPs enxutos, CRMs, portais internos e dashboards construídos do zero. Modelamos o banco de dados, escrevemos a API e montamos a interface — tudo conversando com os processos reais da sua equipe.',
      deliverables: [
        'Frontend, backend e banco de dados integrados',
        'Perfis de acesso, permissões e histórico de ações',
        'Relatórios, filtros e exportação de dados',
      ],
      tags: ['Angular', 'Node.js', 'PostgreSQL'],
    },
    {
      number: '03',
      title: 'APIs e Integrações',
      tagline: 'Seus sistemas conversando entre si',
      description:
        'Desenvolvimento de APIs REST, integrações com meios de pagamento, sistemas de gestão, ERPs, CRMs, disparos de mensagem e serviços externos. Autenticação segura, tratamento de erros, logs e webhooks confiáveis.',
      deliverables: [
        'APIs documentadas e versionadas',
        'Autenticação, tokens e controle de acesso',
        'Webhooks, filas e reprocessamento de falhas',
      ],
      tags: ['REST', 'OAuth', 'Webhooks'],
    },
    {
      number: '04',
      title: 'Automação de Processos',
      tagline: 'Menos tarefas manuais, mais tempo útil',
      description:
        'Automatizamos rotinas repetitivas: geração de relatórios, sincronização de planilhas, envio de notificações, coleta de dados e tarefas agendadas. Se a sua equipe faz sempre do mesmo jeito, existe um caminho para automatizar.',
      deliverables: [
        'Robôs, rotinas agendadas e pipelines de dados',
        'Integração entre planilhas, bancos e sistemas',
        'Painéis de acompanhamento das execuções',
      ],
      tags: ['Bots', 'ETL', 'Agendamentos'],
    },
    {
      number: '05',
      title: 'E-commerce e Produtos Digitais',
      tagline: 'Vender online com experiência impecável',
      description:
        'Lojas virtuais, catálogos, checkouts, assinaturas recorrentes e áreas de membros. Cuidamos da jornada completa de compra: busca, carrinho, pagamento, entrega e pós-venda, com painel para o time comercial.',
      deliverables: [
        'Catálogo, carrinho e checkout otimizado',
        'Pagamentos, frete e emissão de pedidos',
        'Área de membros, cursos e conteúdo pago',
      ],
      tags: ['Checkout', 'Pagamentos', 'Área de membros'],
    },
    {
      number: '06',
      title: 'Performance, Segurança e Infra',
      tagline: 'Base sólida para crescer sem sustos',
      description:
        'Otimização de velocidade, hardening, monitoramento, backup, deploy automatizado e ambientes de homologação. Deixamos o projeto rápido, seguro e pronto para receber mais usuários sem reescrever tudo de novo.',
      deliverables: [
        'Auditoria de performance e acessibilidade',
        'Deploy automatizado, backup e monitoramento',
        'Boas práticas de segurança e LGPD',
      ],
      tags: ['CI/CD', 'Cloud', 'Segurança'],
    },
  ];

  protected openQuote(): void {
    this.quote.open();
  }
}
