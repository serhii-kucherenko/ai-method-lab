import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function w(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel);
}

w(
  "src/app/page.tsx",
  `import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="mist-fade absolute inset-0 bg-[var(--studio-wash)]" />
        <div aria-hidden className="feature-grid sand-mist absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-teal)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-slate-100 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-200/90 md:text-lg">
            Feature packs and observation masks for sufficiency checks — compare
            partial-feature performance against full-feature baselines before you
            lock an eval pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/features"
              className="rounded-md bg-[var(--studio-teal)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              Open features
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-slate-200/40 px-5 py-2.5 text-sm text-slate-100 transition hover:border-slate-100"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-slate-200/40 px-5 py-2.5 text-sm text-slate-100 transition hover:border-slate-100"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-slate-200/40 px-5 py-2.5 text-sm text-slate-100 transition hover:border-slate-100"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-slate-200/40 px-5 py-2.5 text-sm text-slate-100 transition hover:border-slate-100"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Clinical ML models train on rich feature sets, then meet patients with
          partial observations. Teams lack a bench that shows when a mask is still
          enough versus when it silently underperforms the full-feature baseline.
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
                "Feature packs",
                "Versioned clinical feature catalogs for eval soft-sim.",
              ],
              [
                "Observation masks",
                "Declare which features are present under partial observation.",
              ],
              [
                "Cohort cases",
                "Cases with gold outcomes and segment filters.",
              ],
              [
                "Partial vs full",
                "Falsify whether the mask is sufficient before locking a pack.",
              ],
              [
                "Honesty fence",
                "Soft-sim method-lab packing — not clinical advice, not FDA, not FSA.",
              ],
            ].map(([t, d]) => (
              <li key={t}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {t}
                </h3>
                <p className="mt-1 text-slate-600">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Sources
        </h2>
        <p className="mt-3 text-slate-600">
          Soft-sim inspired by arXiv paper{" "}
          <a className="text-[var(--studio-teal)] underline" href={PAPER_URL}>
            2607.09165
          </a>
          . Authors&apos; code: none published. Not the paper system; not clinical
          advice.
        </p>
      </section>
    </div>
  );
}
`,
);

w(
  "src/app/features/page.tsx",
  `"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = {
  id: string;
  label: string;
  version: string;
  clinicalDomain: string;
  featureCount: number;
  status: string;
};

export default function FeaturesPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [clinicalDomain, setClinicalDomain] = useState("cardiology");
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Pack[] }>(
      \`/api/packs?q=\${encodeURIComponent(query)}\`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/packs", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled feature pack",
          version,
          clinicalDomain,
        }),
      });
      setLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Feature packs"
      subtitle="Versioned clinical feature catalogs for sufficiency soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search label or domain"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load(q).catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="version">Version</Label>
          <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="domain">Clinical domain</Label>
          <Input
            id="domain"
            value={clinicalDomain}
            onChange={(e) => setClinicalDomain(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create feature pack</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">
          No feature packs yet — create the first pack above.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{p.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                v{p.version} · {p.clinicalDomain} · {p.featureCount} features ·{" "}
                {p.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
`,
);

w(
  "src/app/masks/page.tsx",
  `"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Mask = {
  id: string;
  packId: string;
  label: string;
  presentFeatures: string[];
  coverageRatio: number;
  salienceHint: number;
  status: string;
};

export default function MasksPage() {
  const [items, setItems] = useState<Mask[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [features, setFeatures] = useState("ldl,hba1c,creatinine");
  const [coverageRatio, setCoverageRatio] = useState(0.4);
  const [salienceHint, setSalienceHint] = useState(0.65);
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: Mask[] }>("/api/masks");
    setItems(data.items);
  }

  useEffect(() => {
    api<{ items: Pack[] }>("/api/packs")
      .then((d) => {
        setPacks(d.items);
        if (d.items[0]) setPackId(d.items[0].id);
      })
      .catch(() => undefined);
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    if (!packId) {
      setError("Select a feature pack first");
      return;
    }
    try {
      await api("/api/masks", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled mask",
          presentFeatures: features
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          coverageRatio,
          salienceHint,
        }),
      });
      setLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Observation masks"
      subtitle="Declare which features are present under partial observation."
    >
      {packs.length === 0 ? (
        <p className="mb-4 text-slate-500">
          Need a feature pack selected — create one on Features first.
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="pack">Feature pack</Label>
          <select
            id="pack"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="label">Mask label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="features">Present features (comma-separated)</Label>
          <Input
            id="features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="coverage">Coverage ratio</Label>
          <Input
            id="coverage"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={coverageRatio}
            onChange={(e) => setCoverageRatio(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="salience">Salience hint</Label>
          <Input
            id="salience"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={salienceHint}
            onChange={(e) => setSalienceHint(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create mask</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No observation masks yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((m) => (
            <li
              key={m.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{m.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                {m.presentFeatures.join(", ")} · coverage {m.coverageRatio} ·
                salience {m.salienceHint} · {m.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
`,
);

console.log("batch1 done");
