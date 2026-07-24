import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function w(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
}

w(
  "src/app/layout.tsx",
  `import type { Metadata } from "next";
import { Syne, Work_Sans } from "next/font/google";
import { DISPLAY_NAME, TAGLINE } from "@/claim";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});

const sans = Work_Sans({
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
    <html lang="en" className={\`\${display.variable} \${sans.variable} h-full\`}>
      <body className="min-h-full font-[family-name:var(--font-sans)] antialiased">
        {children}
      </body>
    </html>
  );
}
`,
);

w(
  "src/app/page.tsx",
  `import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-cyan)]">
          {DISPLAY_NAME}
        </span>
        <Link
          href="/honesty"
          className="text-sm text-slate-400 underline-offset-4 hover:underline"
        >
          Honesty
        </Link>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="film-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-white md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-200 md:text-3xl">
              Design multilayer coatings from free-form goals — not fixed catalogs
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-400">
              Capture open-vocabulary briefs, propose material sequences, tune
              continuous thicknesses, review predicted spectra, and prove
              open-vocab plans beat catalog-only baselines. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/briefs"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-cyan)] px-4 text-sm font-medium text-[var(--studio-ink-deep)] hover:opacity-90"
              >
                Open design briefs
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-white/20 bg-white/5 px-4 text-sm font-medium text-slate-100 hover:bg-white/10"
              >
                Compare vs catalog-only
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-magenta)]">
              Layers · thicknesses · spectra
            </p>
            {[
              ["Open-vocab brief fidelity", 88],
              ["Discrete + continuous plan quality", 81],
              ["Gain vs catalog-only baseline", 93],
            ].map(([label, pct], i) => (
              <div
                key={String(label)}
                className={\`animate-layer-peel space-y-1 \${i === 2 ? "animate-spectrum-sweep rounded-md p-1" : ""}\`}
                style={{ animationDelay: \`\${i * 120}ms\` }}
              >
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-white/10">
                  <div
                    className="h-full rounded bg-gradient-to-r from-[var(--studio-cyan)] to-[var(--studio-magenta)]"
                    style={{ width: \`\${pct}%\` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-slate-300">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-400">
          Catalog-only coating optimizers cannot take free-form optical goals.
          Coatings teams need a studio for open-vocabulary briefs, discrete
          material sequences, continuous thicknesses, spectrum review, and an
          honest compare against fixed-catalog baselines.
        </p>
      </section>

      <section className="border-y border-white/10 bg-black/20 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Open-vocabulary briefs",
                d: "Capture free-form coating goals with band and clarity.",
              },
              {
                t: "Discrete material sequences",
                d: "Propose SiO2, TiO2, Ta2O5, and custom layer orders.",
              },
              {
                t: "Continuous thickness plans",
                d: "Tune nanometer thicknesses with fab feasibility.",
              },
              {
                t: "Assembled multilayer stacks",
                d: "Register coherent stacks linking materials and thicknesses.",
              },
              {
                t: "Spectrum review",
                d: "Inspect predicted fit, AOI tolerance, and absorption.",
              },
              {
                t: "Open-vocab vs catalog-only",
                d: "Dual-score compare makes the buyer claim falsifiable.",
              },
            ].map((item) => (
              <li key={item.t}>
                <h3 className="font-[family-name:var(--font-display)] text-lg text-white">
                  {item.t}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">
          How it works
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-slate-400">
          <li>Write an open-vocabulary design brief for the coating goal.</li>
          <li>Propose a discrete material sequence and continuous thicknesses.</li>
          <li>Assemble the stack and review the predicted spectrum.</li>
          <li>Compare open-vocab plan quality against a catalog-only baseline.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-500">
          Method-lab soft simulation — not live fab or spectrometer hardware.
          Sources:{" "}
          <a
            className="text-[var(--studio-cyan)] underline-offset-2 hover:underline"
            href={PAPER_URL}
            target="_blank"
            rel="noreferrer"
          >
            {PAPER_URL}
          </a>
        </p>
      </section>
    </div>
  );
}
`,
);

console.log("layout+landing done");
