import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import { DeskShell } from "@/components/desk-shell";
import "./globals.css";

const display = Space_Grotesk({
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
  title: "Evidence Synthesis Desk",
  description:
    "Screened eligibility, standardized effect sizes, and random-effects pooling versus naive averages — method experiment, not a commercial evidence-synthesis vendor.",
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
