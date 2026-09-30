import React from "react";
import Link from "next/link";
import {
  Heart,
  Coffee,
  QrCode,
  ShieldCheck,
  Sparkles,
  Server,
  Database,
  Globe,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from "lucide-react";

export default function DoarPage() {
  const pixKey = "pix@cadernodedelicias.com.br";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold shadow-2xs">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          <span>Sustentado com Amor e pela Comunidade</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Apoie o Caderno de Delícias
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          O <strong>Caderno de Delícias</strong> é um projeto de código aberto, livre e sem fins lucrativos abusivos. Nosso compromisso é nunca exibir anúncios invasivos enquanto você cozinha.
        </p>
      </div>

      {/* Card Principal: Doação via Pix */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden space-y-6">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="space-y-4 max-w-lg text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
              <Coffee className="w-3.5 h-3.5" /> Pague um Cafezinho para os Devs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Contribua com qualquer valor no Pix
            </h2>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              Toda doação, seja de R$ 2, R$ 10 ou R$ 50, ajuda diretamente a pagar a hospedagem do servidor, banco de dados e manutenção do domínio <strong>cadernodedelicias.com.br</strong>.
            </p>

            <div className="pt-2 bg-black/20 p-4 rounded-2xl backdrop-blur-xs space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-200 block">
                Chave Pix (E-mail):
              </span>
              <div className="flex items-center justify-between gap-2 font-mono text-sm sm:text-base font-bold bg-white text-stone-900 px-3 py-2 rounded-xl">
                <span className="truncate">{pixKey}</span>
                <span className="text-xs text-orange-600 font-sans font-bold">Chave E-mail</span>
              </div>
            </div>
          </div>

          {/* QR Code Simbólico */}
          <div className="bg-white p-6 rounded-2xl text-stone-900 text-center shadow-lg shrink-0 space-y-2">
            <div className="w-36 h-36 bg-stone-100 rounded-xl flex flex-col items-center justify-center border border-stone-200">
              <QrCode className="w-20 h-20 text-stone-800" />
              <span className="text-[10px] text-stone-500 font-mono mt-1">PIX QR CODE</span>
            </div>
            <p className="text-[11px] font-bold text-stone-700">Abra o app do seu banco</p>
          </div>
        </div>

        {/* Círculo decorativo */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/10 pointer-events-none" />
      </div>

      {/* Outras Formas de Apoio Contínuo */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-stone-900">
          Apoio Recorrente e Software Livre
        </h3>
        <p className="text-xs sm:text-sm text-stone-500">
          Para quem prefere apoiar mensalmente ou colaborar com o ecossistema open source:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">Apoia.se / Catarse</h4>
            <p className="text-xs text-stone-500 leading-normal">
              Assinatura voluntária mensal a partir de R$ 5/mês para ajudar nos custos fixos.
            </p>
            <span className="inline-block text-xs font-semibold text-orange-600">
              Em breve disponível
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">GitHub Sponsors</h4>
            <p className="text-xs text-stone-500 leading-normal">
              Apoie os desenvolvedores do repositório diretamente pela sua conta do GitHub.
            </p>
            <span className="inline-block text-xs font-semibold text-orange-600">
              github.com/sponsors
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <h4 className="font-bold text-stone-900 text-sm">Open Collective</h4>
            <p className="text-xs text-stone-500 leading-normal">
              Orçamento 100% público e transparente com notas e comprovantes de hospedagem.
            </p>
            <span className="inline-block text-xs font-semibold text-orange-600">
              opencollective.com
            </span>
          </div>
        </div>
      </section>

      {/* Transparência de Custos */}
      <section id="transparencia" className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-stone-900">
            Para Onde Vão os Recursos?
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Total transparência com a comunidade gastronômica.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50">
            <Server className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h5 className="font-bold text-stone-900 text-xs sm:text-sm">Hospedagem Web</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Servidores para manter o site rápido em qualquer lugar do Brasil.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50">
            <Database className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h5 className="font-bold text-stone-900 text-xs sm:text-sm">Banco de Dados</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">
                PostgreSQL para armazenar suas receitas com segurança e backups diários.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50">
            <Globe className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <h5 className="font-bold text-stone-900 text-xs sm:text-sm">Domínio .com.br</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Renovação anual do registro cadernodedelicias.com.br.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-orange-700" />
            Documento de Estratégia de Monetização Ética
          </p>
          <p className="text-orange-800 leading-relaxed">
            Consulte o arquivo <code className="bg-orange-100 px-1 py-0.5 rounded font-mono text-[11px]">/docs/MONETIZATION.md</code> no repositório para conhecer todas as diretrizes e ideias futuras de sustentabilidade que nunca comprometem a experiência do usuário.
          </p>
        </div>
      </section>
    </div>
  );
}
