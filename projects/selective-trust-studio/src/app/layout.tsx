import { Manrope, Sora } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const display = Sora({ subsets: ["latin"], variable: "--font-display" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Selective Trust Studio",
  description: "Escalate when unsure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
