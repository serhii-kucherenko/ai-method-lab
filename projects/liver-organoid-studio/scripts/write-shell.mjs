import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel);
};

w(
  "src/components/studio-shell.tsx",
  `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY_NAME } from "@/claim";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/packs", label: "Packs" },
  { href: "/models", label: "Models" },
  { href: "/lineages", label: "Lineages" },
  { href: "/assays", label: "Assays" },
  { href: "/masld", label: "MASLD" },
  { href: "/compare", label: "Compare" },
  { href: "/scoreboard", label: "Scoreboard" },
  { href: "/flows", label: "Flows" },
  { href: "/demo", label: "Demo" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/pricing", label: "Pricing" },
  { href: "/settings", label: "Settings" },
  { href: "/honesty", label: "Honesty" },
] as const;

export function StudioShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <header className="border-b border-[var(--studio-line)] bg-[color-mix(in_srgb,var(--studio-panel)_92%,transparent)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--lo-rust)]"
          >
            {DISPLAY_NAME}
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(\`\${item.href}/\`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 transition-colors",
                    active
                      ? "bg-[var(--studio-accent-soft)] text-[var(--studio-ink-deep)]"
                      : "text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)] hover:bg-[var(--studio-gauze-soft)] hover:text-[var(--studio-ink)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--studio-ink)]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}
`,
);

w(
  "src/app/layout.tsx",
  `import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { DISPLAY_NAME, TAGLINE } from "@/claim";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Manrope({
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
    <html lang="en" className={\`\${display.variable} \${sans.variable} h-full\`}>
      <body className="min-h-full font-[family-name:var(--font-sans)] antialiased">
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
`,
);

w(
  "src/app/globals.css",
  `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-display);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --lo-ink: #14161a;
  --lo-rust: #8a4a3a;
  --lo-mist: #f1f0ed;
  --lo-line: #c8c6c1;
  --lo-teal: #2f6568;
  --studio-ink: var(--lo-ink);
  --studio-ink-deep: #0c0e11;
  --studio-accent: var(--lo-teal);
  --studio-accent-deep: #234c4e;
  --studio-accent-soft: #d5e3e4;
  --studio-gauze-soft: #e8e6e2;
  --studio-cyan: #2f6568;
  --studio-cyan-soft: #d5e3e4;
  --studio-white: #f1f0ed;
  --studio-bg: #f1f0ed;
  --studio-panel: #ffffff;
  --studio-line: #c8c6c1;
  --studio-signal: #8a4a3a;
  --studio-warn: #8a4a3a;
  --studio-warn-soft: #efe4df;
  --studio-wash: radial-gradient(ellipse 55% 45% at 8% 0%, #2f656855 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 92% 18%, #8a4a3a44 0%, transparent 50%),
    linear-gradient(165deg, #0c0e11 0%, #14161a 48%, #1a1e22 100%);

  --background: #f1f0ed;
  --foreground: #14161a;
  --card: #ffffff;
  --card-foreground: #14161a;
  --popover: #ffffff;
  --popover-foreground: #14161a;
  --primary: #2f6568;
  --primary-foreground: #f1f0ed;
  --secondary: #f1f0ed;
  --secondary-foreground: #14161a;
  --muted: #f1f0ed;
  --muted-foreground: #4f5459;
  --accent: #d5e3e4;
  --accent-foreground: #14161a;
  --destructive: #8a4a3a;
  --border: #c8c6c1;
  --input: #c8c6c1;
  --ring: #2f6568;
  --radius: 0.5rem;
  --sidebar: #f1f0ed;
  --sidebar-foreground: #14161a;
  --sidebar-primary: #2f6568;
  --sidebar-primary-foreground: #f1f0ed;
  --sidebar-accent: #d5e3e4;
  --sidebar-accent-foreground: #14161a;
  --sidebar-border: #c8c6c1;
  --sidebar-ring: #2f6568;
  --chart-1: #2f6568;
  --chart-2: #8a4a3a;
  --chart-3: #4f5459;
  --chart-4: #14161a;
  --chart-5: #c8c6c1;
}

@keyframes mist-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes brand-underline {
  from { width: 0; }
  to { width: 7.5rem; }
}
@keyframes hero-fade {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes route-focus {
  from { background-color: transparent; }
  to { background-color: var(--studio-accent-soft); }
}
@keyframes organoid-drift {
  from { transform: translateX(0); }
  to { transform: translateX(-36px); }
}

.hero-fade { animation: hero-fade 0.7s ease-out both; }
.mist-fade { animation: mist-fade 1.1s ease-out both; }
.signal-underline {
  display: block;
  height: 3px;
  width: 7.5rem;
  margin-top: 0.75rem;
  background: var(--lo-rust);
  animation: brand-underline 0.8s ease-out 0.2s both;
}
.score-bar { transition: width 0.45s ease; }
.row-lift { transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.2s ease; }
.row-lift:hover, .row-lift:focus-within {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(12, 14, 17, 0.08);
  background-color: var(--studio-gauze-soft);
  animation: route-focus 0.25s ease both;
}
.schema-grid {
  background-image:
    radial-gradient(circle at 1px 1px, rgba(47, 101, 104, 0.22) 1px, transparent 0),
    linear-gradient(rgba(138, 74, 58, 0.08) 1px, transparent 1px);
  background-size: 22px 22px, 44px 44px;
}
.infra-mist {
  background: linear-gradient(
    135deg,
    rgba(241, 240, 237, 0.16) 0%,
    transparent 40%,
    rgba(47, 101, 104, 0.1) 100%
  );
}
.organoid-mist {
  background-image:
    repeating-linear-gradient(
      95deg,
      rgba(47, 101, 104, 0.16) 0 1px,
      transparent 1px 18px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(241, 240, 237, 0.06) 0 1px,
      transparent 1px 32px
    );
  animation: organoid-drift 18s linear infinite;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
`,
);

console.log("shell/layout/css done");
