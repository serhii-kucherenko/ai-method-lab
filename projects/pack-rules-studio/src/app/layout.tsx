import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { DISPLAY_NAME, TAGLINE } from "@/claim";
import "./globals.css";

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: DISPLAY_NAME,
  description: TAGLINE,
};

export default function RootLayout({
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
