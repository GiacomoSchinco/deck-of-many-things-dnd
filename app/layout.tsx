import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import Topbar from "@/components/layout/Topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Topbar />
          <main className="min-h-screen mx-auto max-w-6xl px-4 sm:px-8 py-6 bg-parchment-50 shadow-[0_0_40px_rgba(0,0,0,0.08)] rounded-sm">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
