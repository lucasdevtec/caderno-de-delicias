import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#EA580C",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Caderno de Delícias - Organize e Compartilhe suas Receitas",
  description:
    "Plataforma de código aberto para salvar suas receitas, organizar em cadernos públicos ou privados, ordenar pratos e copiar coleções com atribuição justa. cadernodedelicias.com.br",
  keywords: [
    "receitas",
    "caderno de receitas",
    "culinaria",
    "livro de receitas",
    "caderno de delicias",
    "opensource",
  ],
  authors: [{ name: "Caderno de Delícias Community", url: "https://cadernodedelicias.com.br" }],
  metadataBase: new URL("https://cadernodedelicias.com.br"),
  openGraph: {
    title: "Caderno de Delícias - Receitas Organizadas com Afeto",
    description:
      "Crie seus cadernos de receitas, defina a ordem dos pratos e compartilhe com a comunidade sem anúncios invasivos.",
    url: "https://cadernodedelicias.com.br",
    siteName: "Caderno de Delícias",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased flex flex-col min-h-screen selection:bg-orange-200 selection:text-orange-950">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}

