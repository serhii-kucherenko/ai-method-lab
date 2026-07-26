/**
 * Bootstrap Coload Order Studio surfaces (APIs, pages, CSS, tests).
 * Run: node scripts/bootstrap-product.mjs
 */
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
  "src/lib/api.ts",
  `import { NextResponse } from "next/server";
import { checkBearer, checkRateLimit } from "@/store";

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function unauthorized() {
  return json({ error: "unauthorized" }, { status: 401 });
}

export function tooMany() {
  return json(
    { error: "rate_limit", message: "Too many requests" },
    { status: 429 },
  );
}

export function guard(req: Request): NextResponse | null {
  if (!checkBearer(req.headers.get("authorization"))) {
    return unauthorized();
  }
  const rl = checkRateLimit();
  if (!rl.ok) return tooMany();
  return null;
}
`,
);

w(
  "src/lib/client-api.ts",
  `import { DEV_TOKEN } from "@/claim";

export const API_TOKEN = DEV_TOKEN;

export async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      authorization: \`Bearer \${API_TOKEN}\`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      typeof err === "object" && err && "error" in err
        ? String((err as { error: string }).error)
        : res.statusText,
    );
  }
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/csv") || ct.includes("text/plain")) {
    return (await res.text()) as T;
  }
  return (await res.json()) as T;
}
`,
);

w(
  "src/components/studio-shell.tsx",
  `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY_NAME } from "@/claim";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/packs", label: "Packs" },
  { href: "/carriers", label: "Carriers" },
  { href: "/loads", label: "Loads" },
  { href: "/assays", label: "Assays" },
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
            className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--co-amber)]"
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
          <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
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
  "src/app/globals.css",
  `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-heading: var(--font-display);
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
}

:root {
  --co-ink: #12161b;
  --co-slate: #3a5566;
  --co-mist: #eef2f4;
  --co-line: #c4c9ce;
  --co-amber: #b4833a;
  --studio-ink: var(--co-ink);
  --studio-ink-deep: #0a0d10;
  --studio-accent: var(--co-slate);
  --studio-accent-deep: #2a3f4c;
  --studio-accent-soft: #d7e1e7;
  --studio-gauze-soft: #e4e9ec;
  --studio-bg: #eef2f4;
  --studio-panel: #ffffff;
  --studio-line: #c4c9ce;
  --studio-signal: #b4833a;
  --studio-wash: radial-gradient(ellipse 55% 45% at 10% 0%, #3a556655 0%, transparent 55%),
    radial-gradient(ellipse 40% 35% at 90% 20%, #b4833a44 0%, transparent 50%),
    linear-gradient(165deg, #0a0d10 0%, #12161b 48%, #1a2228 100%);

  --background: #eef2f4;
  --foreground: #12161b;
  --card: #ffffff;
  --card-foreground: #12161b;
  --popover: #ffffff;
  --popover-foreground: #12161b;
  --primary: #3a5566;
  --primary-foreground: #eef2f4;
  --secondary: #e4e9ec;
  --secondary-foreground: #12161b;
  --muted: #e4e9ec;
  --muted-foreground: #5a6570;
  --accent: #d7e1e7;
  --accent-foreground: #12161b;
  --destructive: #8b3a45;
  --border: #c4c9ce;
  --input: #c4c9ce;
  --ring: #3a5566;
  --radius: 0.5rem;
}

body {
  background: var(--studio-bg);
  color: var(--studio-ink);
  font-family: var(--font-sans), system-ui, sans-serif;
}

.hero-fade {
  animation: heroIn 0.9s ease-out both;
}

.mist-fade {
  animation: mistDrift 14s ease-in-out infinite alternate;
}

.signal-underline {
  display: block;
  width: 4.5rem;
  height: 3px;
  margin-top: 0.75rem;
  background: var(--co-amber);
  animation: underlineGrow 0.8s ease-out 0.25s both;
}

.mesopore-mist {
  background:
    radial-gradient(circle at 22% 40%, #3a556633 0%, transparent 42%),
    radial-gradient(circle at 70% 55%, #b4833a30 0%, transparent 38%);
  animation: mistDrift 18s ease-in-out infinite alternate;
}

.schema-grid {
  background-image:
    linear-gradient(to right, #ffffff0a 1px, transparent 1px),
    linear-gradient(to bottom, #ffffff0a 1px, transparent 1px);
  background-size: 48px 48px;
}

.row-lift {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.row-lift:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px #12161b14;
}

.score-bar {
  transition: width 0.6s ease;
}

@keyframes heroIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes mistDrift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(-1.5%, 1%, 0) scale(1.03); }
}
@keyframes underlineGrow {
  from { width: 0; opacity: 0; }
  to { width: 4.5rem; opacity: 1; }
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

console.log("core surfaces done");
