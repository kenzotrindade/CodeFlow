import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";

// #################################
// ### Global Layout & SEO
// #################################

export const viewport: Viewport = {
  themeColor: "#0a0414",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "CodeFlow | Console d'Ingénierie Logicielle",
    template: "%s | CodeFlow",
  },
  description:
    "Évoluez vers l'excellence technique avec CodeFlow. Audit de code par IA, veille technologique temps réel et modules d'apprentissage immersifs.",
  keywords: [
    "développement",
    "IA",
    "audit code",
    "mentorat",
    "ingénierie logicielle",
    "veille tech",
  ],
  authors: [{ name: "CodeFlow Team" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://codeflow.dev",
    siteName: "CodeFlow",
    title: "CodeFlow | Forgez votre futur d'ingénieur",
    description:
      "La plateforme ultime pour les développeurs souhaitant maîtriser l'architecture logicielle.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="relative">
        <SessionProviderWrapper>
          <div
            className="fixed inset-0 overflow-hidden pointer-events-none z-0"
            aria-hidden="true"
          >
            <div className="prisma-shape w-125 h-125 top-[-10%] right-[-5%] rotate-12 opacity-30" />
            <div className="prisma-shape w-150 h-150 bottom-[-10%] left-[-10%] -rotate-12 opacity-20" />

            <svg
              className="absolute inset-0 w-full h-full opacity-[0.03]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-100 100 Q 150 300 500 100 T 1200 400"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M-100 800 Q 400 600 800 900 T 1500 700"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M200 -100 L 800 1200"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                strokeDasharray="5,5"
              />
            </svg>
          </div>

          <header>
            <Navbar />
          </header>

          <main className="relative z-10 pt-12 pb-12">{children}</main>

          <Toaster richColors position="bottom-right" theme="dark" />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
