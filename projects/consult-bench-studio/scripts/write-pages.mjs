/**
 * Writes UI pages for Consult Bench Studio.
 * Run: node scripts/write-pages.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
}

write(
  "src/app/layout.tsx",
  `import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { DISPLAY_NAME, TAGLINE } from "@/claim";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const sans = IBM_Plex_Sans({
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

write(
  "src/app/page.tsx",
  `import Link from "next/link";
import {
  CLAIM,
  DISPLAY_NAME,
  PAPER_URL,
  TAGLINE,
} from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="absolute inset-0 bg-[var(--studio-wash)]" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-mint)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-slate-100 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
            Evaluate LLM next-responses on real consult moments where the photo
            changes the answer — not text-only chat evals.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cases"
              className="rounded-md bg-[var(--studio-mint)] px-5 py-2.5 text-sm font-medium text-[var(--studio-ink-deep)] transition hover:brightness-110"
            >
              Open consult cases
            </Link>
            <Link
              href="/honesty"
              className="rounded-md border border-slate-500 px-5 py-2.5 text-sm text-slate-200 transition hover:border-slate-300"
            >
              Honesty fence
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Text-only medical chat benchmarks miss image-dependent consult turns.
          Models that sound fluent can invent findings that are not in the photo —
          or ignore the photo entirely.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            The product
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">{CLAIM}</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              [
                "Consult case registry",
                "Register real-style consult moments by department and chief complaint.",
              ],
              [
                "Multimodal turn workspace",
                "Pair patient text with image captions and image-relevance signals.",
              ],
              [
                "Department coverage map",
                "See where your eval set is thin across dermatology, radiology, and more.",
              ],
              [
                "Next-response scoring",
                "Score the reply the patient needs — clinical plan, safety, clarity.",
              ],
              [
                "Multimodal vs text-only compare",
                "Dual score A (image-aware) vs B (text-only) makes the gap falsifiable.",
              ],
            ].map(([title, body]) => (
              <li key={title}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-slate-600">
          <li>Register consult cases and department tags.</li>
          <li>Capture multimodal turns (text + image context).</li>
          <li>Score next-responses and rank models on the leaderboard.</li>
          <li>Compare multimodal-aware quality against a text-only baseline.</li>
        </ol>
      </section>

      <section className="border-t border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Honesty
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Method-lab experiment inspired by multimodal medical consult evaluation
            research. Not clinical certification, not a live hospital chat system,
            and not branded as MedRealMM.{" "}
            <Link href="/honesty" className="text-[var(--studio-mint-deep)] underline-offset-2 hover:underline">
              Full fence
            </Link>
            .
          </p>
          <p className="mt-6 text-sm text-slate-500">
            Sources:{" "}
            <a
              className="underline-offset-2 hover:underline"
              href={PAPER_URL}
              target="_blank"
              rel="noreferrer"
            >
              arXiv {PAPER_URL.split("/").pop()}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
`,
);

write(
  "src/app/cases/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ConsultCase, DepartmentKind } from "@/store";

const DEPTS: DepartmentKind[] = [
  "dermatology",
  "radiology",
  "ophthalmology",
  "orthopedics",
  "general",
];

export default function CasesPage() {
  const [items, setItems] = useState<ConsultCase[]>([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState<DepartmentKind>("dermatology");
  const [complaint, setComplaint] = useState("");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: ConsultCase[] }>(
      \`/api/cases?q=\${encodeURIComponent(search)}\`,
    );
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/cases", {
        method: "POST",
        body: JSON.stringify({
          title,
          department,
          chiefComplaint: complaint,
          status: "active",
          notes: "Captured from cases page",
        }),
      });
      setTitle("");
      setComplaint("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Consult case registry"
      subtitle="Register consult moments where the next reply may depend on an attached image."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={checklist}
            onChange={(e) => setChecklist(e.target.checked)}
            className="mt-1"
          />
          <span>
            Onboarding: cases are method-lab eval fixtures — not live patient
            records. Guide:{" "}
            <a
              className="text-[var(--studio-mint-deep)] underline-offset-2 hover:underline"
              href="/docs/guides/61-consult-bench-studio-lessons.md"
            >
              lessons
            </a>
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <Input
          placeholder="Case title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={department}
          onChange={(e) => setDepartment(e.target.value as DepartmentKind)}
        >
          {DEPTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <Input
          className="md:col-span-2"
          placeholder="Chief complaint"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
        />
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <Button type="submit">Add case</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const params = new URLSearchParams({ q });
              load(q).catch((e) => setError(String(e)));
              void params;
            }}
          >
            Search
          </Button>
          <Input
            className="max-w-xs"
            placeholder="Search cases"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      </form>

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg text-slate-900">
                {c.title}
              </h2>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {c.department} · {c.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{c.chiefComplaint || "—"}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/turns/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ConsultCase, MultimodalTurn } from "@/store";

export default function TurnsPage() {
  const [items, setItems] = useState<MultimodalTurn[]>([]);
  const [cases, setCases] = useState<ConsultCase[]>([]);
  const [caseId, setCaseId] = useState("");
  const [label, setLabel] = useState("");
  const [patientText, setPatientText] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageRelevance, setImageRelevance] = useState("0.8");
  const [scrub, setScrub] = useState(0.8);
  const [error, setError] = useState("");

  async function load() {
    const [turns, caseRes] = await Promise.all([
      api<{ items: MultimodalTurn[] }>("/api/turns"),
      api<{ items: ConsultCase[] }>("/api/cases"),
    ]);
    setItems(turns.items);
    setCases(caseRes.items);
    if (!caseId && caseRes.items[0]) setCaseId(caseRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/turns", {
        method: "POST",
        body: JSON.stringify({
          caseId,
          label,
          patientText,
          imageCaption,
          hasImage: true,
          imageRelevance: Number(imageRelevance),
          visualGrounding: scrub,
          status: "ready",
        }),
      });
      setLabel("");
      setPatientText("");
      setImageCaption("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Multimodal turns"
      subtitle="Pair patient text with image captions and scrub image relevance for the next reply."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          required
        >
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <Input
          placeholder="Turn label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
        <Input
          className="md:col-span-2"
          placeholder="Patient text"
          value={patientText}
          onChange={(e) => setPatientText(e.target.value)}
        />
        <Input
          className="md:col-span-2"
          placeholder="Image caption / findings"
          value={imageCaption}
          onChange={(e) => setImageCaption(e.target.value)}
        />
        <Input
          placeholder="Image relevance 0–1"
          value={imageRelevance}
          onChange={(e) => setImageRelevance(e.target.value)}
        />
        <div>
          <label className="mb-1 block text-xs text-slate-500">
            Visual grounding scrub: {scrub.toFixed(2)}
          </label>
          <input
            className="turn-scrub w-full"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={scrub}
            onChange={(e) => setScrub(Number(e.target.value))}
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Add turn</Button>
        </div>
        {error ? <p className="md:col-span-2 text-sm text-red-700">{error}</p> : null}
      </form>

      <ul className="space-y-3">
        {items.map((t) => (
          <li
            key={t.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-lg">
                {t.label}
              </h2>
              <span className="text-xs text-slate-500">
                img {t.imageRelevance} · ground {t.visualGrounding}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{t.patientText}</p>
            <p className="mt-1 text-sm text-slate-500">{t.imageCaption}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/departments/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { DepartmentKind, DepartmentTag } from "@/store";

const DEPTS: DepartmentKind[] = [
  "dermatology",
  "radiology",
  "ophthalmology",
  "orthopedics",
  "general",
];

export default function DepartmentsPage() {
  const [items, setItems] = useState<DepartmentTag[]>([]);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<DepartmentKind>("dermatology");
  const [coverage, setCoverage] = useState("0.6");
  const [error, setError] = useState("");

  async function load() {
    const res = await api<{ items: DepartmentTag[] }>("/api/departments");
    setItems(res.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/departments", {
        method: "POST",
        body: JSON.stringify({
          name,
          department,
          coverage: Number(coverage),
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Department coverage"
      subtitle="Map where your multimodal consult eval set is strong or thin."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <Input
          placeholder="Coverage label"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={department}
          onChange={(e) => setDepartment(e.target.value as DepartmentKind)}
        >
          {DEPTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <Input
          placeholder="Coverage 0–1"
          value={coverage}
          onChange={(e) => setCoverage(e.target.value)}
        />
        <div className="md:col-span-3">
          <Button type="submit">Add department tag</Button>
        </div>
        {error ? <p className="md:col-span-3 text-sm text-red-700">{error}</p> : null}
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((d) => (
          <div
            key={d.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <h2 className="font-[family-name:var(--font-display)] text-lg">
              {d.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {d.department} · coverage {(d.coverage * 100).toFixed(0)}% ·{" "}
              {d.caseCount} cases
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded bg-slate-200">
              <div
                className="h-full bg-[var(--studio-mint)] transition-all"
                style={{ width: \`\${Math.min(100, d.coverage * 100)}%\` }}
              />
            </div>
          </div>
        ))}
      </div>
    </StudioShell>
  );
}
`,
);

console.log("pages batch 1 done");
