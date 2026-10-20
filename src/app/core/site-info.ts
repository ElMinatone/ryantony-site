export const SITE = {
  brand: 'RYANTONY',
  signature: 'DESENVOLVIMENTO · PROGRAMAÇÃO · SOLUÇÕES',
  tagline: 'TECNOLOGIA QUE CONSTRÓI IDEIAS',
  contactName: 'Ryan Christian',
  contactRole: 'Desenvolvedor & sócio-fundador',
  phoneDisplay: '495-044-9327',
  phoneHref: 'tel:4950449327',
} as const;

export interface NavLink {
  id: string;
  label: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { id: 'servicos', label: 'Serviços' },
  { id: 'solucoes', label: 'Soluções' },
  { id: 'processo', label: 'Processo' },
  { id: 'tecnologias', label: 'Tecnologias' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'faq', label: 'FAQ' },
];
