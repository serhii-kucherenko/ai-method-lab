import type { Metadata } from "next";
import { Literata, DM_Sans, JetBrains_Mono } from "next/font/google";
import { DeskShell } from "@/components/desk-shell";
import "./globals.css";

const display = Literata({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Pathology Vision Desk",
  description:
    "Multi-expert pathology scoring vs single-view baseline — method experiment, not a clinical diagnostic tool.",
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
