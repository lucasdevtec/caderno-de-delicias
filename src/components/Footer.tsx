import React from "react";
import Link from "next/link";
import { ChefHat, Heart, Coffee, ShieldCheck, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto bg-stone-900 text-stone-300 border-t border-stone-800 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna 1: Sobre */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">Caderno de Delícias</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              O espaço livre e de código aberto para cozinhar sem distrações. Guarde suas memórias culinárias, organize cadernos temáticos e compartilhe com quem você ama.
            </p>
            <div className="pt-2 text-[11px] text-orange-400 font-medium">
              cadernodedelicias.com.br
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Explorar
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/descobrir" className="hover:text-orange-400 transition-colors">
                  Cadernos Públicos
                </Link>
              </li>
              <li>
                <Link href="/receitas" className="hover:text-orange-400 transition-colors">
                  Minhas Receitas
                </Link>
              </li>
              <li>
                <Link href="/cadernos" className="hover:text-orange-400 transition-colors">
                  Meus Cadernos
                </Link>
              </li>
              <li>
                <Link href="/receitas/nova" className="hover:text-orange-400 transition-colors">
                  Adicionar Receita
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Sustentabilidade & Open Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Transparência
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/doar" className="flex items-center gap-1.5 hover:text-orange-400 text-rose-400 transition-colors font-medium">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>Apoiar Projeto (Doações)</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-orange-400 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>Código Aberto (GitHub)</span>
                </a>
              </li>
              <li>
                <span className="text-[11px] text-stone-500">
                  Licença MIT & Livre para a Comunidade
                </span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Manifesto Ético */}
          <div className="space-y-3 bg-stone-800/60 p-4 rounded-2xl border border-stone-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Compromisso com o Usuário</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              Nunca exibiremos banners intrusivos nem bloquearemos suas receitas com anúncios na hora de cozinhar. Sustentado com amor, carinho e doações voluntárias.
            </p>
            <Link
              href="/doar"
              className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-semibold"
            >
              <Coffee className="w-3 h-3" />
              <span>Pague um cafézinho via Pix →</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} Caderno de Delícias (cadernodedelicias.com.br). Todos os direitos compartilhados.</p>
          <p className="flex items-center gap-1">
            Feito com carinho para cozinheiros, famílias e amantes da boa comida.
          </p>
        </div>
      </div>
    </footer>
  );
}
