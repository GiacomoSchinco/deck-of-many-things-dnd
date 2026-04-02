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
  description: "“Il destino è nelle carte”",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${imFellEnglish.variable} antialiased`}
      >
        <Providers>
          <Toaster richColors position="top-right" />
          <Topbar />
          <main className="min-h-screen mx-auto max-w-6xl px-4 sm:px-8 py-6 bg-parchment-50 shadow-[0_0_40px_rgba(0,0,0,0.08)] rounded-sm">
            {children}
          </main>
           <Footer />
        </Providers>
      </body>
    </html>
  );
}
