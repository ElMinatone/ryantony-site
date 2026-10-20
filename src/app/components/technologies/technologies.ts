import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';

interface TechGroup {
  title: string;
  icon: string;
  description: string;
  items: string[];
}

@Component({
  selector: 'app-technologies',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective],
  templateUrl: './technologies.html',
  styleUrl: './technologies.scss',
})
export class TechnologiesComponent {
  protected readonly groups: readonly TechGroup[] = [
    {
      title: 'Frontend',
      icon: 'browser',
      description: 'Interfaces rápidas, acessíveis e fáceis de manter.',
      items: ['Angular', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind', 'SCSS', 'HTML/CSS'],
    },
    {
      title: 'Backend',
      icon: 'terminal',
      description: 'Regras de negócio, APIs e serviços confiáveis.',
      items: ['Node.js', 'NestJS', 'Express', 'Python', 'Laravel', 'PHP', 'REST', 'GraphQL'],
    },
    {
      title: 'Dados',
      icon: 'database',
      description: 'Estrutura, integridade e performance para crescer.',
      items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Prisma', 'Supabase'],
    },
    {
      title: 'Infra e DevOps',
      icon: 'cloud',
      description: 'Deploy seguro, monitoramento e entrega contínua.',
      items: ['Docker', 'AWS', 'Vercel', 'Cloudflare', 'Git', 'GitHub Actions', 'Linux', 'Nginx'],
    },
  ];

  protected readonly dailyTools = [
    'Figma',
    'Postman',
    'Sentry',
    'Notion',
    'Trello',
    'Jira',
    'Google Analytics',
    'Search Console',
  ];
}
