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

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://cadernodedelicias.com.br").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Caderno de Delícias - Organize e Compartilhe suas Receitas",
    template: "%s | Caderno de Delícias",
  },
  description:
    "Plataforma de código aberto para salvar suas receitas, organizar em cadernos públicos ou privados, ordenar pratos e copiar coleções com atribuição justa.",
  keywords: [
    "receitas",
    "caderno de receitas",
    "culinária",
    "livro de receitas",
    "caderno de delícias",
    "receitas fáceis",
    "comida caseira",
    "gastronomia",
    "open source",
  ],
  authors: [{ name: "Caderno de Delícias", url: baseUrl }],
  creator: "Caderno de Delícias",
  publisher: "Caderno de Delícias",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Caderno de Delícias - Organize e Compartilhe suas Receitas",
    description:
      "Crie seus cadernos de receitas, defina a ordem dos pratos e compartilhe com a comunidade sem anúncios invasivos.",
    url: baseUrl,
    siteName: "Caderno de Delícias",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Caderno de Delícias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caderno de Delícias - Organize e Compartilhe suas Receitas",
    description:
      "Crie seus cadernos de receitas, defina a ordem dos pratos e compartilhe com a comunidade sem anúncios invasivos.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Caderno de Delícias",
    alternateName: "CadernoDeDelicias",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/descobrir?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen selection:bg-orange-200 selection:text-orange-950">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}

