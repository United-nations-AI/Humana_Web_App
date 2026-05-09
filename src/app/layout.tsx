import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Humana AI — Human Rights AI for Everyone",
  description:
    "Humana AI is a free, globally accessible human rights AI assistant. Ask questions about your rights, international law, and humanitarian issues — no login required.",
  keywords: ["human rights", "AI", "free", "humanitarian", "international law", "Qatar CPD"],
  authors: [{ name: "Qatar CPD", url: "https://qatarcpd.com" }],
  openGraph: {
    title: "Humana AI — Human Rights AI for Everyone",
    description: "Free AI-powered human rights assistant for the world.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: "'Space Grotesk', Arial, sans-serif" }}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
