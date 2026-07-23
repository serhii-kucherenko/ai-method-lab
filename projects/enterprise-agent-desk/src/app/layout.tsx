import type { Metadata } from "next";
import { Literata, Source_Sans_3, Source_Code_Pro } from "next/font/google";
import { DeskShell } from "@/components/desk-shell";
import "./globals.css";

const display = Literata({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Enterprise Agent Desk",
  description:
    "Multi-agent ERP coordination vs single-agent baseline — method experiment, not a live ERP automation product.",
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
