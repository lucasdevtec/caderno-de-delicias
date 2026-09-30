"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, BookMarked, UtensilsCrossed } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Início", icon: Home },
    { href: "/descobrir", label: "Descobrir", icon: Compass },
    { href: "/receitas/nova", label: "Criar", icon: Plus, isAction: true },
    { href: "/cadernos", label: "Cadernos", icon: BookMarked },
    { href: "/receitas", label: "Receitas", icon: UtensilsCrossed },
  ];

  return (
    <nav
      aria-label="Navegação inferior mobile"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 md:hidden shadow-lg pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 px-2"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          if (tab.isAction) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center -mt-5 group"
                aria-label="Criar nova receita"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-transform">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-stone-700 mt-1">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors min-w-[56px] ${
                isActive
                  ? "text-orange-600 font-bold"
                  : "text-stone-500 hover:text-stone-900 font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              <span className="text-[10px] tracking-tight mt-0.5">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
