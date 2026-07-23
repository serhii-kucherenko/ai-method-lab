import type { Metadata } from "next";
import { Outfit, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import { DeskShell } from "@/components/desk-shell";
import "./globals.css";

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Truth Game Desk",
  description:
    "Game-theoretic multi-agent truth plans versus single-agent and majority-vote baselines — method experiment, not a hallucination-elimination product.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <DeskShell>{children}</DeskShell>
      </body>
    </html>
  );
}
