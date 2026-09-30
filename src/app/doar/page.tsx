import React from "react";
import { Heart } from "lucide-react";
import { PixDonationCard } from "@/components/PixDonationCard";

export default function DoarPage() {
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

      {/* Card Principal: Doação via Pix com QR Code */}
      <PixDonationCard />

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

      {/* Seção Transparência de Custos */}
      <section id="transparencia" className="space-y-4 pt-6 border-t border-stone-200">
        <h3 className="text-xl font-bold text-stone-900">
          Transparência e Custos de Manutenção
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Para mantermos o <strong>Caderno de Delícias</strong> funcionando de forma rápida, segura e livre de anúncios invasivos, nossos custos mensais estimados de infraestrutura são:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/80">
            <div className="text-xs text-orange-800 font-semibold">Banco de Dados</div>
            <div className="text-lg font-black text-stone-900 mt-1">~R$ 35/mês</div>
            <p className="text-[11px] text-stone-600 mt-1">PostgreSQL gerenciado com backups diários.</p>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
            <div className="text-xs text-amber-800 font-semibold">Servidor Web / API</div>
            <div className="text-lg font-black text-stone-900 mt-1">~R$ 40/mês</div>
            <p className="text-[11px] text-stone-600 mt-1">Hospedagem Next.js com alta disponibilidade.</p>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
            <div className="text-xs text-emerald-800 font-semibold">Armazenamento & CDN</div>
            <div className="text-lg font-black text-stone-900 mt-1">~R$ 20/mês</div>
            <p className="text-[11px] text-stone-600 mt-1">Entrega rápida de fotos e assets.</p>
          </div>

          <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200">
            <div className="text-xs text-stone-700 font-semibold">Domínio & Segurança</div>
            <div className="text-lg font-black text-stone-900 mt-1">~R$ 5/mês</div>
            <p className="text-[11px] text-stone-600 mt-1">cadernodedelicias.com.br e certificados SSL.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
