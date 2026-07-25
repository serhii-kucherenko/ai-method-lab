import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function w(rel, s) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, s);
}

w(
  "src/app/packs/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CrystalPack } from "@/store";

export default function PacksPage() {
  const [items, setItems] = useState<CrystalPack[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("TiO2");
  const [spaceGroup, setSpaceGroup] = useState("I41/amd");
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(false);

  async function load(search = q) {
    const res = await api<{ items: CrystalPack[] }>(
      \`/api/packs?q=\${encodeURIComponent(search)}\`,
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
      await api("/api/packs", {
        method: "POST",
        body: JSON.stringify({
          name,
          formula,
          spaceGroup,
          status: "ready",
          notes: "Captured from packs page",
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
      title="Crystal packs"
      subtitle="Register crystal packs before you attach multimodal descriptor lanes."
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
            Onboarding: packs and embeddings are soft-sim fixtures — not wet-lab
            inventory. Guide:{" "}
            <a
              className="text-[var(--studio-teal-deep)] underline-offset-2 hover:underline"
              href="/docs/guides/63-crystal-bind-studio-lessons.md"
            >
              lessons
            </a>
          </span>
        </label>
      </div>

      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4"
      >
        <Input placeholder="Pack name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Formula" value={formula} onChange={(e) => setFormula(e.target.value)} />
        <Input placeholder="Space group" value={spaceGroup} onChange={(e) => setSpaceGroup(e.target.value)} />
        <Button type="submit">Add pack</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input placeholder="Search packs" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button type="button" variant="secondary" onClick={() => load()}>
          Search
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No packs yet — create one to unlock structure, diffraction, DOS, and language lanes.
        </p>
      ) : null}

      <ul className="space-y-3">
        {items.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {p.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {p.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {p.formula} · {p.spaceGroup}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

w(
  "src/app/bind/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { BindProjection, CrystalPack } from "@/store";

export default function BindPage() {
  const [items, setItems] = useState<BindProjection[]>([]);
  const [packs, setPacks] = useState<CrystalPack[]>([]);
  const [packId, setPackId] = useState("");
  const [name, setName] = useState("");
  const [coherence, setCoherence] = useState("0.72");
  const [error, setError] = useState("");

  async function load() {
    const [binds, packRes] = await Promise.all([
      api<{ items: BindProjection[] }>("/api/bind"),
      api<{ items: CrystalPack[] }>("/api/packs"),
    ]);
    setItems(binds.items);
    setPacks(packRes.items);
    if (!packId && packRes.items[0]) setPackId(packRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/bind", {
        method: "POST",
        body: JSON.stringify({
          packId,
          name,
          coherence: Number(coherence),
          status: "draft",
          profile: "multimodal",
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onScore(id: string) {
    setError("");
    try {
      await api("/api/bind", {
        method: "POST",
        body: JSON.stringify({ action: "score", id }),
      });
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Bind-space explorer"
      subtitle="Project four descriptor lanes into a shared soft-sim bind space."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-md border border-[var(--studio-line)] bg-white px-2 text-sm"
          value={packId}
          onChange={(e) => setPackId(e.target.value)}
          required
        >
          {packs.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input placeholder="Projection name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Coherence 0-1" value={coherence} onChange={(e) => setCoherence(e.target.value)} />
        <Button type="submit">Project bind</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li
            key={row.id}
            className="bind-pulse rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {row.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {row.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Coherence {row.coherence} · cross-modal {row.crossModalAgreement} ·
              A {row.multimodalOverall ?? "—"} / B {row.singleOverall ?? "—"}
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-2"
              onClick={() => onScore(row.id)}
            >
              Score A vs B
            </Button>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

w(
  "src/app/retrieve/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { BindProjection, RetrieveCompare } from "@/store";

export default function RetrievePage() {
  const [items, setItems] = useState<RetrieveCompare[]>([]);
  const [binds, setBinds] = useState<BindProjection[]>([]);
  const [bindId, setBindId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [retrieves, bindRes] = await Promise.all([
      api<{ items: RetrieveCompare[] }>("/api/retrieve"),
      api<{ items: BindProjection[] }>("/api/bind"),
    ]);
    setItems(retrieves.items);
    setBinds(bindRes.items);
    if (!bindId && bindRes.items[0]) setBindId(bindRes.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/retrieve", {
        method: "POST",
        body: JSON.stringify({ name, bindId }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Retrieve compare"
      subtitle="Multimodal bind retrieve quality (A) versus single-modality baseline (B)."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-md border border-[var(--studio-line)] bg-white px-2 text-sm"
          value={bindId}
          onChange={(e) => setBindId(e.target.value)}
          required
        >
          {binds.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <Input placeholder="Compare name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Button type="submit">Run retrieve</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li
            key={row.id}
            className="score-fill rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {row.name}
              </span>
              <span className="text-xs uppercase tracking-wide text-[var(--studio-teal-deep)]">
                {row.winner}
              </span>
            </div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-500">A multimodal</p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-slate-200">
                  <div
                    className="h-full bg-[var(--studio-teal)] transition-all"
                    style={{ width: \`\${Math.min(100, row.multimodal.overall)}%\` }}
                  />
                </div>
                <p className="mt-1 text-sm">{row.multimodal.overall}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">B single</p>
                <div className="mt-1 h-2 overflow-hidden rounded bg-slate-200">
                  <div
                    className="h-full bg-[var(--studio-gold)] transition-all"
                    style={{ width: \`\${Math.min(100, row.single.overall)}%\` }}
                  />
                </div>
                <p className="mt-1 text-sm">{row.single.overall}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">Gap {row.gap}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

console.log("packs bind retrieve ok");
