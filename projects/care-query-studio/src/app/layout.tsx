import type { Metadata } from "next";
import { Literata, Figtree } from "next/font/google";
import { DISPLAY_NAME, TAGLINE } from "@/claim";
import "./globals.css";

const display = Literata({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const sans = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: DISPLAY_NAME,
  description: TAGLINE,
};

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full font-[family-name:var(--font-sans)] antialiased">
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
