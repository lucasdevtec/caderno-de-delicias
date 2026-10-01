import type { Metadata } from 'next';
import TermosClient from './TermosClient';

export const metadata: Metadata = {
  title: 'Termos de Uso e Política de Privacidade',
  description:
    'Diretrizes de uso, privacidade de dados, conformidade com a LGPD e termos éticos da plataforma comunitária Caderno de Delícias.',
  alternates: {
    canonical: '/termos',
  },
  openGraph: {
    title: 'Termos de Uso e Política de Privacidade | Caderno de Delícias',
    description:
      'Diretrizes de uso, privacidade de dados, conformidade com a LGPD e termos éticos da plataforma comunitária Caderno de Delícias.',
    url: '/termos',
  },
};

export default function TermosPage() {
  return <TermosClient />;
}
