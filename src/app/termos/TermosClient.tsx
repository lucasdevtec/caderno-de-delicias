'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  FileText,
  Lock,
  Heart,
  ChefHat,
  EyeOff,
  Database,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

function TermosContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'privacidade' ? 'privacidade' : 'termos';
  const [activeTab, setActiveTab] = useState<'termos' | 'privacidade'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Cabeçalho */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-semibold shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
          <span>Transparência, Ética & Segurança</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Termos de Uso e Política de Privacidade
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Nosso compromisso inegociável com a proteção dos seus dados pessoais, o respeito à autoria de suas receitas e uma experiência culinária acolhedora e livre de distrações.
        </p>
        <p className="text-xs text-stone-400">
          Última atualização: Outubro de 2026 • Versão 1.0 (LGPD Compliant)
        </p>
      </div>

      {/* 4 Pilares de Garantia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Zero Anúncios Invasivos</h2>
            <p className="text-xs text-stone-500 mt-0.5 leading-normal">
              Nunca venderemos seus dados nem usaremos rastreadores invasivos de terceiros para publicidade.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Suas Receitas São Suas</h2>
            <p className="text-xs text-stone-500 mt-0.5 leading-normal">
              Você detém a autoria de suas memórias culinárias e decide o que é público ou 100% privado.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Atribuição Permanente</h2>
            <p className="text-xs text-stone-500 mt-0.5 leading-normal">
              Cadernos inspirados preservam perpetuamente o crédito do autor original através de selos éticos.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Conforme a LGPD</h2>
            <p className="text-xs text-stone-500 mt-0.5 leading-normal">
              Direito irrestrito de visualizar, corrigir, exportar ou excluir todos os seus dados a qualquer momento.
            </p>
          </div>
        </div>
      </div>

      {/* Seletor de Abas */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('termos')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
            activeTab === 'termos'
              ? 'border-orange-600 text-orange-600 bg-orange-50/30'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Termos de Uso</span>
        </button>

        <button
          onClick={() => setActiveTab('privacidade')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
            activeTab === 'privacidade'
              ? 'border-orange-600 text-orange-600 bg-orange-50/30'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Política de Privacidade (LGPD)</span>
        </button>
      </div>

      {/* Conteúdo da Aba: Termos de Uso */}
      {activeTab === 'termos' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-8 text-stone-700 leading-relaxed text-sm">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Visão Geral e Aceite dos Termos</span>
            </h2>
            <p>
              O <strong>Caderno de Delícias</strong> (<code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">cadernodedelicias.com.br</code>) é uma plataforma web aberta e colaborativa, idealizada para o registro, preservação, organização e compartilhamento de receitas e cadernos culinários.
            </p>
            <p>
              Ao criar uma conta ou utilizar a plataforma, você concorda expressamente com as diretrizes aqui estabelecidas. Se não concordar com qualquer um dos pontos, pedimos que interrompa o uso do serviço.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Autoria das Receitas e Direitos de Conteúdo</span>
            </h2>
            <p>
              <strong>Suas receitas pertencem a você.</strong> Você mantém a integridade e autoria dos seus textos, fotos, modo de preparo e relatos afetivos cadastrados.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
              <li>
                <strong>Cadernos e Receitas Públicas:</strong> Ao optar por tornar uma receita ou caderno público, você concede uma licença não exclusiva para que outros membros da comunidade possam visualizá-lo e copiá-lo para seus próprios cadernos.
              </li>
              <li>
                <strong>Cadernos e Receitas Privadas:</strong> Os conteúdos mantidos como privados são estritamente confidenciais. Eles nunca aparecem em mecanismos de busca da plataforma nem são listados para outros usuários.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Sistema Ético de Atribuição e Cópia (Forks)</span>
            </h2>
            <p>
              Inspirar-se em outra pessoa na cozinha é um dos gestos mais bonitos da gastronomia. Para honrar isso de forma justa, nosso sistema adota regras estritas de atribuição:
            </p>
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/80 text-xs sm:text-sm text-stone-800 space-y-2">
              <p className="font-semibold text-orange-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orange-600" />
                Preservação Perpétua de Crédito
              </p>
              <p>
                Quando um usuário copia um caderno público da comunidade, o sistema cria automaticamente o vínculo original e exibe de forma indelével o selo:
                <em className="block mt-1 pl-3 border-l-2 border-orange-400 font-medium">
                  &ldquo;🌿 Caderno inspirado e copiado de [Nome do Caderno] por @Autor&rdquo;
                </em>
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-bold">
                4
              </span>
              <span>Uso Aceitável e Segurança da Comunidade</span>
            </h2>
            <p>
              Nosso objetivo é proporcionar um ambiente seguro, familiar e agradável. Você concorda em <strong>NÃO</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Publicar conteúdos com ofensas, discursos de ódio, assédio, nudez ou materiais ilegais.</li>
              <li>Inserir receitas intencionalmente perigosas que recomendem ingestão de substâncias tóxicas, impróprias para consumo ou nocivas à saúde.</li>
              <li>Realizar varreduras abusivas (scraping massivo), ataques de negação de serviço ou tentativas de burlar mecanismos de segurança e senhas.</li>
              <li>Divulgar spam, links afiliados maliciosos ou propagandas não autorizadas em receitas.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-bold">
                5
              </span>
              <span>Isenção de Responsabilidade Culinária e Alergias</span>
            </h2>
            <p className="text-xs sm:text-sm">
              As receitas disponíveis na plataforma são criadas e compartilhadas de maneira voluntária pela comunidade culinária. O <strong>Caderno de Delícias</strong> não realiza análises laboratoriais e não garante a adequação nutricional ou médica dos pratos.
            </p>
            <p className="text-xs text-stone-500 italic bg-stone-50 p-3 rounded-xl border border-stone-200">
              Atenção: Cabe a cada cozinheiro e comensal verificar restrições alimentares, intolerâncias severas (como doença celíaca, alergia a frutos do mar, nozes ou ovos) e adotar os devidos cuidados sanitários na manipulação de alimentos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-bold">
                6
              </span>
              <span>Doações Voluntárias e Código Aberto</span>
            </h2>
            <p>
              As contribuições financeiras enviadas via Pix ou plataformas de financiamento coletivo são doações voluntárias destinadas ao custeio de infraestrutura de servidores, banco de dados e valorização do trabalho contínuo de manutenção. Elas não conferem cotas societárias, propriedade sobre a plataforma ou promessa de lucros futuros.
            </p>
          </section>
        </div>
      )}

      {/* Conteúdo da Aba: Política de Privacidade (LGPD) */}
      {activeTab === 'privacidade' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 space-y-8 text-stone-700 leading-relaxed text-sm">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Nosso Compromisso com a Sua Privacidade</span>
            </h2>
            <p>
              No <strong>Caderno de Delícias</strong>, respeitamos a sua privacidade acima de tudo. Tratamos seus dados pessoais em total conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)</strong>.
            </p>
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-900 font-medium">
              🛡️ <strong>Regra Pétrea:</strong> Nós nunca vendemos, alugamos, compartilhamos ou comercializamos seus dados pessoais, histórico de receitas ou listas com corretores de dados ou redes de anunciantes.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Quais Dados Coletamos e Para Quê</span>
            </h2>
            <div className="space-y-3">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                  Dados de Cadastro
                </span>
                <p className="text-xs text-stone-600">
                  Nome (ou apelido de cozinheiro), endereço de e-mail e senha. Utilizados unicamente para criar sua conta, permitir login seguro e possibilitar a recuperação de senha.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                  Login com Google (OAuth 2.0)
                </span>
                <p className="text-xs text-stone-600">
                  Quando você opta por autenticar via Google, recebemos apenas nome, e-mail e foto pública de perfil autorizados por você. Não temos acesso a fotos particulares, contatos ou outros serviços da sua conta Google.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                  Conteúdo Culinário
                </span>
                <p className="text-xs text-stone-600">
                  Receitas, ingredientes, instruções e cadernos organizados por você, armazenados para que você possa acessá-los em qualquer celular, tablet ou computador.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                  Métricas de Acesso Anônimas
                </span>
                <p className="text-xs text-stone-600">
                  Contabilizamos contadores numéricos agregados de visualizações de receitas (<code className="text-[11px] bg-stone-200 px-1 rounded">viewsCount</code>) para ordenar pratos populares na aba de descoberta da comunidade, sem cruzar com perfis de usuários.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Armazenamento Seguro e Criptografia</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Senhas com Hash Forte:</strong> Senhas nunca são salvas em texto puro. Utilizamos <code className="text-xs bg-stone-100 px-1 py-0.5 rounded">bcryptjs</code> com salt rounds rigorosos, tornando matematicamente inviável a leitura da sua senha por terceiros ou por nossos servidores.
              </li>
              <li>
                <strong>Comunicação Criptografada:</strong> 100% do tráfego trafega através de conexões seguras HTTPS (TLS/SSL).
              </li>
              <li>
                <strong>Sessões HttpOnly:</strong> Tokens de autenticação JWT são armazenados em cookies protegidos com sinalizadores <code className="text-xs bg-stone-100 px-1 py-0.5 rounded">HttpOnly</code> e <code className="text-xs bg-stone-100 px-1 py-0.5 rounded">SameSite=Lax</code>, impedindo acesso indevido por scripts externos.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">
                4
              </span>
              <span>Seus Direitos como Titular de Dados (LGPD)</span>
            </h2>
            <p>
              Em conformidade com o artigo 18 da LGPD, você possui os seguintes direitos garantidos:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-0.5">Acesso e Correção</span>
                Você pode revisar e atualizar suas informações e receitas a qualquer momento no sistema.
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-0.5">Anonimização e Exclusão</span>
                Você tem o direito de solicitar a exclusão definitiva da sua conta e de suas informações pessoais.
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-0.5">Portabilidade de Dados</span>
                Você pode requisitar a exportação das receitas de sua autoria.
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-0.5">Revogação do Consentimento</span>
                Você pode optar por cancelar o acesso de provedores externos (como Google) a qualquer momento.
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">
                5
              </span>
              <span>Contato e Encarregado de Proteção de Dados</span>
            </h2>
            <p>
              Para dúvidas sobre o tratamento de dados, solicitações de exclusão de conta ou sugestões sobre segurança e privacidade, entre em contato com nossa equipe:
            </p>
            <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-xs sm:text-sm space-y-1">
              <p>
                <strong>E-mail de Contato:</strong>{' '}
                <a href="mailto:contato@cadernodedelicias.com.br" className="text-orange-600 hover:underline font-semibold">
                  contato@cadernodedelicias.com.br
                </a>
              </p>
              <p>
                <strong>Repositório de Código Aberto:</strong>{' '}
                <a href="https://github.com/lucasdevtec/caderno-de-delicias/issues" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline font-semibold">
                  Canal de Issues no GitHub
                </a>
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Rodapé da página com chamada para ação */}
      <div className="text-center pt-4">
        <Link
          href="/descobrir"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
        >
          <span>Explorar Receitas da Comunidade</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function TermosClient() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center text-stone-400">
          Carregando informações...
        </div>
      }
    >
      <TermosContent />
    </Suspense>
  );
}
