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
  applicationName: "Caderno de Delícias",
  title: {
    default: "Caderno de Delícias - Organize e Compartilhe suas Receitas",
    template: "%s | Caderno de Delícias",
  },
  description:
    "Caderno de Delícias é a plataforma de código aberto para salvar suas receitas, organizar em cadernos públicos ou privados, ordenar pratos e copiar coleções com atribuição justa.",
  keywords: [
    "caderno de delícias",
    "caderno de delicias",
    "cadernodedelicias",
    "receitas",
    "caderno de receitas",
    "culinária",
    "livro de receitas",
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
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
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
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Caderno de Delícias - Seu Caderno de Receitas, sem distrações",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caderno de Delícias - Organize e Compartilhe suas Receitas",
    description:
      "Crie seus cadernos de receitas, defina a ordem dos pratos e compartilhe com a comunidade sem anúncios invasivos.",
    images: ["/opengraph-image"],
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
  const structuredDataJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        name: "Caderno de Delícias",
        alternateName: [
          "Caderno de Delicias",
          "CadernoDeDelicias",
          "cadernodedelicias.com.br",
        ],
        url: baseUrl,
        inLanguage: "pt-BR",
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/descobrir?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Caderno de Delícias",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/icon.svg`,
        },
        sameAs: ["https://github.com/lucasdevtec/caderno-de-delicias"],
      },
    ],
  };

  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataJsonLd) }}
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

