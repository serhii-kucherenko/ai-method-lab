/**
 * Bootstrap Tactile Chart Studio pages, APIs, tests, and assets.
 * Run: node scripts/bootstrap.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel);
}

// --- globals.css ---
write(
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
  /* Soft indigo-gray + warm sand — DESIGN brief (not purple glow / cream terracotta / broadsheet) */
  --studio-bg: #f3f4f7;
  --studio-ink: #1c2430;
  --studio-ink-deep: #121821;
  --studio-accent: #4a5d7a;
  --studio-accent-soft: #dfe5ef;
  --studio-sand: #c4a574;
  --studio-sand-soft: #f0e6d6;
  --studio-panel: #ffffff;
  --studio-line: #c8ced8;
  --studio-wash: radial-gradient(ellipse 70% 55% at 10% 0%, #4a5d7a33 0%, transparent 55%),
    radial-gradient(ellipse 45% 40% at 95% 8%, #c4a57444 0%, transparent 50%),
    linear-gradient(180deg, #e8ebf1 0%, #f3f4f7 42%, #ebe6dc 100%);

  --background: #f3f4f7;
  --foreground: #1c2430;
  --card: #ffffff;
  --card-foreground: #1c2430;
  --popover: #ffffff;
  --popover-foreground: #1c2430;
  --primary: #4a5d7a;
  --primary-foreground: #f4f6f9;
  --secondary: #e4e8ef;
  --secondary-foreground: #1c2430;
  --muted: #e4e8ef;
  --muted-foreground: #5a6575;
  --accent: #f0e6d6;
  --accent-foreground: #121821;
  --destructive: oklch(0.577 0.245 27.325);
  --border: #c8ced8;
  --input: #c8ced8;
  --ring: #4a5d7a;
  --radius: 0.5rem;
  --chart-1: #4a5d7a;
  --chart-2: #c4a574;
  --chart-3: #6b7c93;
  --chart-4: #8b7355;
  --chart-5: #3d4a5c;
  --sidebar: #f3f4f7;
  --sidebar-foreground: #1c2430;
  --sidebar-primary: #4a5d7a;
  --sidebar-primary-foreground: #f4f6f9;
  --sidebar-accent: #e4e8ef;
  --sidebar-accent-foreground: #1c2430;
  --sidebar-border: #c8ced8;
  --sidebar-ring: #4a5d7a;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

.layer-grid {
  background-image:
    linear-gradient(to right, #c8ced833 1px, transparent 1px),
    linear-gradient(to bottom, #c8ced833 1px, transparent 1px);
  background-size: 28px 28px;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes peel {
  from { opacity: 0; transform: translateY(8px) scaleY(0.92); transform-origin: top; }
  to { opacity: 1; transform: translateY(0) scaleY(1); }
}
@keyframes confirm-pulse {
  0%, 100% { box-shadow: 0 0 0 0 #c4a57455; }
  50% { box-shadow: 0 0 0 8px #c4a57400; }
}
.animate-fade-up { animation: fade-up 0.7s ease-out both; }
.animate-peel { animation: peel 0.65s ease-out both; }
.animate-confirm-pulse { animation: confirm-pulse 1.6s ease-in-out infinite; }
`,
);

write(
  "src/app/layout.tsx",
  `import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Fraunces } from "next/font/google";
import { DISPLAY_NAME, TAGLINE } from "@/claim";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
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
    <html lang="en" className={\`\${display.variable} \${sans.variable} h-full\`}>
      <body className="min-h-full font-[family-name:var(--font-sans)] antialiased">
        {children}
      </body>
    </html>
  );
}
`,
);

write(
  "src/components/studio-shell.tsx",
  `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY_NAME } from "@/claim";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/charts", label: "Charts" },
  { href: "/layers", label: "Layers" },
  { href: "/grammar", label: "Grammar" },
  { href: "/sessions", label: "Sessions" },
  { href: "/verify", label: "Verify" },
  { href: "/compare", label: "Compare" },
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
            className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--studio-accent)]"
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
                      : "text-slate-500 hover:bg-slate-200 hover:text-slate-900",
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
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}
`,
);

console.log("core ui written");
