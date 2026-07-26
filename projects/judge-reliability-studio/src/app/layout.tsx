import { DM_Sans, Literata } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const display = Literata({ subsets: ["latin"], variable: "--font-display" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Judge Reliability Studio",
  description: "Agreement is not reliability.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
