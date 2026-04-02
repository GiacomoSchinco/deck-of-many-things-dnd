import type { Metadata } from "next";
import { Cinzel, IM_Fell_English } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import Topbar from "@/components/layout/Topbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layout/Footer";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "900"],
});

const imFellEnglish = IM_Fell_English({
  variable: "--font-im-fell",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Deck of Many Things",
  description: "Il destino è nelle carte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="scroll-smooth">
      <body className={`${cinzel.variable} ${imFellEnglish.variable} antialiased bg-[#1a0f08]`}>
        <Providers>
          <Toaster richColors position="top-right" />

          <div className="flex flex-col min-h-screen">
            <Topbar />

            <main
              className="relative flex-grow overflow-x-hidden min-h-screen flex flex-col"
              style={{
                // STRATO 1: COLORE BASE LEGNO CHIARO (BETULLA/ACERO)
                backgroundColor: "#e8d5b5", // Colore molto più chiaro
                backgroundImage: `
      /* STRATO 2: OMBRE LEGGERISSIME TRA LE ASSI */
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 38px,
        rgba(0,0,0,0.03) 39px,
        rgba(0,0,0,0.08) 40px,
        transparent 41px
      ),
      /* STRATO 3: RIFLESSI DI LUCE */
      repeating-linear-gradient(
        90deg,
        rgba(255,255,255,0.1) 0px,
        transparent 1px,
        transparent 37px,
        rgba(255,255,255,0.08) 38px,
        transparent 39px
      ),
      /* STRATO 4: VIGNETTATURA LEGGERISSIMA */
      radial-gradient(circle at center, rgba(255,255,240,0.15) 0%, transparent 100%)
    `
              }}
            >
              {/* STRATO 5: VENATURE PIÙ SOTTILI E CHIARE */}
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='woodFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.008 0.25' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.8 0 0 0 0.1 0.6 0 0 0 0.05 0.5 0 0 0 0.02 0 0 0 0.15 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23woodFilter)'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'multiply',
                  opacity: 0.15 // Molto più trasparente
                }}
              />

              {/* STRATO 6: OMBRA AMBIENTALE LEGGERA */}
              <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle,transparent_60%,rgba(100,70,40,0.15)_100%)]" />

              {/* CONTENUTO */}
              <div className="relative z-10 py-6 px-4 sm:px-8 flex-grow">
                <div className="w-full max-w-6xl mx-auto">
                  {children}
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}