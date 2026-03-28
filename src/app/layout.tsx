import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Header from "@/components/Header";

// Mock localStorage for SSR to prevent 500 errors from third-party scripts
if (typeof window === "undefined") {
  (global as any).localStorage = {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
    clear: () => null,
    key: () => null,    
    length: 0,
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vortia | Ecosistemas de Agentes IA & Academia",
  description: "Diseñamos y desplegamos ecosistemas de agentes IA para agencias y SaaS. Aprende la nueva era de la IA Agéntica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased font-sans">
        <Header />
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
