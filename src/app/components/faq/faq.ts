import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { QuoteService } from '../../core/quote.service';
import { SITE } from '../../core/site-info';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class FaqComponent {
  private readonly quote = inject(QuoteService);

  protected readonly site = SITE;
  protected readonly openIndex = signal(0);

  protected readonly items: readonly FaqItem[] = [
    {
      question: 'Como começo um projeto com a RYANTONY?',
      answer:
        'O primeiro passo é uma conversa direta com Ryan Christian pelo telefone 495-044-9327. Nela entendemos o objetivo, o cenário atual, o prazo desejado e a faixa de investimento. A partir disso, preparamos uma proposta com escopo, etapas, prazos e valores. A conversa inicial é sem compromisso.',
    },
    {
      question: 'Quanto custa criar um site ou um sistema?',
      answer:
        'Depende do escopo. Um site institucional, uma loja virtual e um sistema fullstack têm níveis de complexidade diferentes. Trabalhamos com orçamento por etapas, explicando o que está incluído antes de qualquer contrato. Assim você compara propostas com clareza e evita surpresas no meio do caminho.',
    },
    {
      question: 'Quanto tempo leva para o projeto ficar pronto?',
      answer:
        'O prazo nasce do escopo. Landing pages e sites institucionais costumam ter ciclos mais curtos; sistemas, integrações e automações exigem mais etapas de modelagem e testes. Trabalhamos com entregas contínuas, então você acompanha o produto ganhando forma desde as primeiras semanas.',
    },
    {
      question: 'Vocês assumem projetos que já existem?',
      answer:
        'Sim. Podemos assumir a manutenção, auditar o código, corrigir falhas, melhorar a performance, atualizar a interface ou evoluir funcionalidades. O primeiro passo é uma análise do que já foi construído, da documentação disponível e das prioridades do negócio.',
    },
    {
      question: 'Como funciona o pagamento do projeto?',
      answer:
        'O projeto é dividido em etapas com marcos de entrega. O pagamento acompanha esses marcos, combinado previamente na proposta. Não cobramos pela conversa inicial e nenhuma etapa começa sem aprovação e alinhamento prévios.',
    },
    {
      question: 'O atendimento é presencial ou remoto?',
      answer:
        'O atendimento é remoto, com reuniões online, mensagens e acompanhamento direto. Isso permite atender empresas de diferentes cidades com a mesma proximidade e agilidade, sem deslocamentos desnecessários.',
    },
    {
      question: 'E depois que o projeto entra no ar?',
      answer:
        'Oferecemos suporte, monitoramento e evolução contínua. Você pode contratar um acompanhamento mensal para manutenção e melhorias, ou solicitar ajustes pontuais conforme a necessidade. O importante é que o produto continue saudável depois do lançamento.',
    },
    {
      question: 'Como ficam a segurança e a LGPD?',
      answer:
        'Seguimos boas práticas de proteção de dados: controle de acesso, autenticação, backups, monitoramento e tratamento cuidadoso das informações. Quando o projeto envolve dados pessoais, as soluções são desenhadas considerando os princípios da LGPD e as regras do seu negócio.',
    },
  ];

  protected toggle(index: number): void {
    this.openIndex.update((current) => (current === index ? -1 : index));
  }

  protected openQuote(): void {
    this.quote.open();
  }
}
