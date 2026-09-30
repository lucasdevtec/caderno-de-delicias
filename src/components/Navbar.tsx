"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  BookMarked,
  Compass,
  Heart,
  Plus,
  LogOut,
  User,
  Menu,
  X,
  ChefHat,
} from "lucide-react";

interface UserProfile {
  id: string;
  name?: string | null;
  username?: string | null;
  email: string;
  image?: string | null;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        setUser(null);
      }
    }
    fetchUser();
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }

  const navLinks = [
    { href: "/descobrir", label: "Descobrir", icon: Compass },
    { href: "/cadernos", label: "Meus Cadernos", icon: BookMarked },
    { href: "/receitas", label: "Minhas Receitas", icon: UtensilsCrossed },
    { href: "/doar", label: "Apoiar Projeto", icon: Heart, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="font-extrabold text-stone-900 text-base sm:text-lg tracking-tight block leading-none">
              Caderno de Delícias
            </span>
            <span className="text-[9px] sm:text-[10px] text-orange-600 font-semibold tracking-wider uppercase block mt-0.5">
              cadernodedelicias.com.br
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            if (link.highlight) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "text-rose-600 hover:bg-rose-50/80"
                  }`}
                >
                  <Icon className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>{link.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-700 font-semibold"
                    : "text-stone-700 hover:text-orange-600 hover:bg-stone-50"
                }`}
              >
                <Icon className="w-4 h-4 opacity-70" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/receitas/nova"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Receita</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xs">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-semibold text-stone-700 max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {user.name || "Chef"}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/cadernos/novo"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-orange-50 hover:text-orange-700"
                    >
                      <BookMarked className="w-4 h-4 text-orange-600" />
                      <span>Criar Novo Caderno</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair da Conta</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-stone-700 hover:text-orange-600 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all hover:shadow-md"
              >
                Criar Conta Grátis
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link
              href="/cadernos"
              className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xs"
              title="Meus Cadernos"
            >
              {user.name?.[0]?.toUpperCase() || "U"}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-700 transition-colors"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? "bg-orange-50 text-orange-700 font-semibold"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/receitas/nova"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Receita</span>
                </Link>
                <Link
                  href="/cadernos/novo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium"
                >
                  <BookMarked className="w-4 h-4 text-orange-600" />
                  <span>Novo Caderno</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 text-rose-600 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair ({user.name || user.email})</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-stone-800"
                >
                  Entrar
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold"
                >
                  Criar Conta Grátis
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
