/**
 * Write UI pages for Tactile Chart Studio.
 * Run: node scripts/write-pages.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function write(rel, content) {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
  console.log("wrote", rel);
}

write(
  "src/app/page.tsx",
  `import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-accent)]">
          {DISPLAY_NAME}
        </span>
        <Link
          href="/honesty"
          className="text-sm text-slate-500 underline-offset-4 hover:underline"
        >
          Honesty
        </Link>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--studio-line)]">
        <div className="layer-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Chart exploration blind and low-vision users can talk through and feel
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Accessibility and data teams ship conversational + layered tactile
              presentation with a select-confirm-ask-verify loop — not visual-only
              dashboards. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/charts"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-accent)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Open chart library
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Compare vs visual-only
              </Link>
            </div>
          </div>
          <div className="animate-peel mt-12 max-w-xl [animation-delay:120ms]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--studio-sand)]">
              Layer peel · verify pulse
            </p>
            <div className="flex flex-col gap-3">
              {[
                ["Tactile layer coverage", 78],
                ["Grammar fidelity", 72],
                ["Verify discipline", 84],
              ].map(([label, pct], i) => (
                <div key={String(label)} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-slate-100">
                    <div
                      className="animate-peel h-full rounded bg-[var(--studio-accent)]"
                      style={{
                        width: \`\${pct}%\`,
                        animationDelay: \`\${i * 120}ms\`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-500">
          Data charts stay locked behind visual UIs. Blind and low-vision users need
          layered tactile encodings plus conversation that confirms selections before
          answering. This studio helps teams plan that experience and compare it to a
          visual-only baseline.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-white/70 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Chart library for BLV exploration",
                d: "Register chart assets with kinds and series labels teams can explore.",
              },
              {
                t: "Layered tactile presentation",
                d: "Stack overview, axis, series, and outlier layers with texture and elevation.",
              },
              {
                t: "Feedback grammar editor",
                d: "Define spoken and haptic tokens triggered by exploration events.",
              },
              {
                t: "Select-confirm-ask-verify",
                d: "Run conversational sessions that confirm before answering.",
              },
              {
                t: "Dual compare",
                d: "Score conversational+tactile plans against a visual-only baseline.",
              },
            ].map((item) => (
              <li key={item.t}>
                <p className="font-medium text-slate-900">{item.t}</p>
                <p className="mt-2 text-sm text-slate-500">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-slate-600">
          <li>Register charts your product ships to BLV users.</li>
          <li>Configure tactile layers and feedback grammar.</li>
          <li>Run explore sessions with select → confirm → ask → verify.</li>
          <li>Compare conversational+tactile quality to visual-only.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-400">
          Inspired by{" "}
          <a className="underline" href={PAPER_URL}>
            arXiv:{PAPER_URL.split("/").pop()}
          </a>
          . Method-lab soft simulation — not live tactile hardware drivers. Not branded as Graphy.
        </p>
      </section>
    </div>
  );
}
`,
);

function crudPage({ route, title, subtitle, formFields, listKey, createFields, typeName, extra }) {
  return `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
${extra?.imports ?? ""}

export default function ${route}Page() {
  const [items, setItems] = useState<any[]>([]);
  ${extra?.state ?? 'const [q, setQ] = useState("");'}
${formFields.map((f) => `  const [${f}, set${f[0].toUpperCase() + f.slice(1)}] = useState("");`).join("\n")}
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      ${extra?.load ?? `const res = await api<{ items: any[] }>(\`/api/${listKey}?q=\${encodeURIComponent(q)}&page=1&pageSize=20\`);
      setItems(res.items);`}
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/${listKey}", {
          method: "POST",
          body: JSON.stringify({
${createFields}
          }),
        });
${formFields.map((f) => `        set${f[0].toUpperCase() + f.slice(1)}("");`).join("\n")}
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell title="${title}" subtitle="${subtitle}">
      ${extra?.onboarding ?? ""}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New ${typeName}</p>
          ${extra?.form ?? formFields.map((f) => `<div>
            <Label>${f}</Label>
            <Input value={${f}} onChange={(e) => set${f[0].toUpperCase() + f.slice(1)}(e.target.value)} />
          </div>`).join("\n          ")}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending} onClick={create}>
            Create ${typeName}
          </Button>
        </div>
        <div className="space-y-3">
          ${extra?.search ?? `<div className="flex gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
            <Button variant="outline" onClick={() => load()} disabled={pending}>Search</Button>
          </div>`}
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3">
                ${extra?.item ?? `<p className="font-medium text-slate-900">{item.title ?? item.name}</p>
                <p className="text-sm text-slate-500">{item.notes ?? item.spoken ?? item.prompt ?? ""}</p>`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
`;
}

// Charts page - handcrafted for quality
write(
  "src/app/charts/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ChartAsset } from "@/store";

export default function ChartsPage() {
  const [items, setItems] = useState<ChartAsset[]>([]);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("bar");
  const [seriesLabel, setSeriesLabel] = useState("");
  const [categoryCount, setCategoryCount] = useState("4");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: ChartAsset[] }>(
        \`/api/charts?q=\${encodeURIComponent(search)}&page=1&pageSize=20\`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/charts", {
          method: "POST",
          body: JSON.stringify({
            title,
            kind,
            seriesLabel,
            categoryCount: Number(categoryCount) || 4,
            notes,
          }),
        });
        setTitle("");
        setSeriesLabel("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Chart library"
      subtitle="Register chart assets for blind and low-vision conversational exploration."
    >
      <div className="mb-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <p className="font-medium text-slate-900">Onboarding</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-500">
          <li>Add a chart asset with kind and series label.</li>
          <li>Configure tactile layers and feedback grammar.</li>
          <li>Run a session, verify turns, then compare vs visual-only.</li>
        </ol>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New chart</p>
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quarterly revenue…" />
          </div>
          <div>
            <Label>Kind</Label>
            <Input value={kind} onChange={(e) => setKind(e.target.value)} placeholder="bar | line | pie | scatter" />
          </div>
          <div>
            <Label>Series label</Label>
            <Input value={seriesLabel} onChange={(e) => setSeriesLabel(e.target.value)} />
          </div>
          <div>
            <Label>Category count</Label>
            <Input value={categoryCount} onChange={(e) => setCategoryCount(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !title.trim() || !seriesLabel.trim()}
            onClick={create}
          >
            Create chart
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search charts…" />
            <Button variant="outline" onClick={() => load()} disabled={pending}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <Badge variant="secondary">{item.kind}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {item.seriesLabel} · {item.categoryCount} categories
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/layers/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ChartAsset, TactileLayer } from "@/store";

export default function LayersPage() {
  const [items, setItems] = useState<TactileLayer[]>([]);
  const [charts, setCharts] = useState<ChartAsset[]>([]);
  const [chartId, setChartId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState("series");
  const [texture, setTexture] = useState("ridged");
  const [elevation, setElevation] = useState("0.6");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [layers, chartRes] = await Promise.all([
        api<{ items: TactileLayer[] }>("/api/layers"),
        api<{ items: ChartAsset[] }>("/api/charts?page=1&pageSize=50"),
      ]);
      setItems(layers.items);
      setCharts(chartRes.items);
      if (!chartId && chartRes.items[0]) setChartId(chartRes.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/layers", {
          method: "POST",
          body: JSON.stringify({
            chartId,
            name,
            kind,
            texture,
            elevation: Number(elevation) || 0.5,
            notes,
          }),
        });
        setName("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Tactile layers"
      subtitle="Stack layered tactile presentation — overview, axis, series, outlier, summary."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="animate-peel space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New layer</p>
          <div>
            <Label>Chart id</Label>
            <Input value={chartId} onChange={(e) => setChartId(e.target.value)} list="chart-ids" />
            <datalist id="chart-ids">
              {charts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Kind</Label>
            <Input value={kind} onChange={(e) => setKind(e.target.value)} placeholder="overview | axis | series | outlier | summary" />
          </div>
          <div>
            <Label>Texture</Label>
            <Input value={texture} onChange={(e) => setTexture(e.target.value)} />
          </div>
          <div>
            <Label>Elevation (0–1)</Label>
            <Input value={elevation} onChange={(e) => setElevation(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !chartId.trim()} onClick={create}>
            Create layer
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="animate-peel rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3"
              style={{ animationDelay: \`\${i * 40}ms\` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{item.name}</p>
                <Badge variant="secondary">{item.kind}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {item.texture} · elevation {item.elevation} · order {item.order}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/grammar/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { GrammarToken } from "@/store";

export default function GrammarPage() {
  const [items, setItems] = useState<GrammarToken[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [spoken, setSpoken] = useState("");
  const [haptic, setHaptic] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load(search = q) {
    start(async () => {
      const res = await api<{ items: GrammarToken[] }>(
        \`/api/grammar?q=\${encodeURIComponent(search)}\`,
      );
      setItems(res.items);
    });
  }

  useEffect(() => {
    load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/grammar", {
          method: "POST",
          body: JSON.stringify({ name, trigger, spoken, haptic, notes }),
        });
        setName("");
        setTrigger("");
        setSpoken("");
        setHaptic("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Feedback grammar"
      subtitle="Edit spoken and haptic tokens triggered during chart exploration."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New token</p>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Trigger</Label>
            <Input value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="on_select_max" />
          </div>
          <div>
            <Label>Spoken</Label>
            <Input value={spoken} onChange={(e) => setSpoken(e.target.value)} />
          </div>
          <div>
            <Label>Haptic</Label>
            <Input value={haptic} onChange={(e) => setHaptic(e.target.value)} placeholder="double_pulse" />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={pending || !name.trim() || !trigger.trim() || !spoken.trim()}
            onClick={create}
          >
            Create token
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search grammar…" />
            <Button variant="outline" onClick={() => load()} disabled={pending}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3"
              >
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.trigger} · {item.haptic}
                </p>
                <p className="mt-1 text-sm text-slate-600">{item.spoken}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/sessions/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ChartAsset, ExploreSession } from "@/store";

export default function SessionsPage() {
  const [items, setItems] = useState<ExploreSession[]>([]);
  const [charts, setCharts] = useState<ChartAsset[]>([]);
  const [chartId, setChartId] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [sessions, chartRes] = await Promise.all([
        api<{ items: ExploreSession[] }>("/api/sessions"),
        api<{ items: ChartAsset[] }>("/api/charts?page=1&pageSize=50"),
      ]);
      setItems(sessions.items);
      setCharts(chartRes.items);
      if (!chartId && chartRes.items[0]) setChartId(chartRes.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/sessions", {
          method: "POST",
          body: JSON.stringify({ chartId, name, notes }),
        });
        setName("");
        setNotes("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Explore sessions"
      subtitle="Conversational chart exploration sessions for BLV users."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New session</p>
          <div>
            <Label>Chart id</Label>
            <Input value={chartId} onChange={(e) => setChartId(e.target.value)} list="session-charts" />
            <datalist id="session-charts">
              {charts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !name.trim() || !chartId.trim()} onClick={create}>
            Start session
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{item.name}</p>
                <Badge variant="secondary">{item.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">{item.turns} turns · {item.id}</p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/verify/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ExploreSession, VerifyTurn } from "@/store";

export default function VerifyPage() {
  const [items, setItems] = useState<VerifyTurn[]>([]);
  const [sessions, setSessions] = useState<ExploreSession[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [phase, setPhase] = useState("select");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [confirmed, setConfirmed] = useState(true);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [verifies, sess] = await Promise.all([
        api<{ items: VerifyTurn[] }>("/api/verifies"),
        api<{ items: ExploreSession[] }>("/api/sessions"),
      ]);
      setItems(verifies.items);
      setSessions(sess.items);
      if (!sessionId && sess.items[0]) setSessionId(sess.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/verifies", {
          method: "POST",
          body: JSON.stringify({
            sessionId,
            phase,
            prompt,
            response,
            confirmed,
          }),
        });
        setPrompt("");
        setResponse("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Select · confirm · ask · verify"
      subtitle="Discipline the conversational loop so selections are confirmed before answers."
    >
      <div className="mb-4 animate-confirm-pulse inline-flex rounded-lg border border-[var(--studio-sand)] bg-[var(--studio-sand-soft)] px-3 py-2 text-sm text-slate-700">
        Confirm pulse — selections must be verified before asking.
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">New verify turn</p>
          <div>
            <Label>Session id</Label>
            <Input value={sessionId} onChange={(e) => setSessionId(e.target.value)} list="verify-sessions" />
            <datalist id="verify-sessions">
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <Label>Phase</Label>
            <Input value={phase} onChange={(e) => setPhase(e.target.value)} placeholder="select | confirm | ask | verify" />
          </div>
          <div>
            <Label>Prompt</Label>
            <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>
          <div>
            <Label>Response</Label>
            <Input value={response} onChange={(e) => setResponse(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            Confirmed
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !prompt.trim() || !sessionId.trim()} onClick={create}>
            Record turn
          </Button>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{item.phase}</Badge>
                {item.confirmed ? (
                  <Badge className="bg-[var(--studio-sand)] text-white">confirmed</Badge>
                ) : null}
              </div>
              <p className="mt-2 font-medium text-slate-900">{item.prompt}</p>
              <p className="text-sm text-slate-500">{item.response}</p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/compare/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { ChartAsset, CompareResult } from "@/store";

export default function ComparePage() {
  const [items, setItems] = useState<CompareResult[]>([]);
  const [charts, setCharts] = useState<ChartAsset[]>([]);
  const [chartId, setChartId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [compares, chartRes] = await Promise.all([
        api<{ items: CompareResult[] }>("/api/compare"),
        api<{ items: ChartAsset[] }>("/api/charts?page=1&pageSize=50"),
      ]);
      setItems(compares.items);
      setCharts(chartRes.items);
      if (!chartId && chartRes.items[0]) setChartId(chartRes.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api("/api/compare", {
          method: "POST",
          body: JSON.stringify({ chartId, name: name || "Tactile vs visual" }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Compare"
      subtitle="Conversational + tactile plan quality versus visual-only baseline."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Run compare</p>
          <div>
            <Label>Chart id</Label>
            <Input value={chartId} onChange={(e) => setChartId(e.target.value)} list="compare-charts" />
            <datalist id="compare-charts">
              {charts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending || !chartId.trim()} onClick={create}>
            Compare tactile vs visual
          </Button>
        </div>
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{item.name}</p>
                <Badge>winner: {item.winner}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  Tactile overall:{" "}
                  <strong>{item.tactile.overall}</strong>
                </p>
                <p>
                  Visual overall: <strong>{item.visual.overall}</strong>
                </p>
                <p>Verify: {item.tactile.verifyScore}</p>
                <p>Visual verify: {item.visual.verifyScore}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/settings/page.tsx",
  `"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Member, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [auditsCsv, setAuditsCsv] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [o, m] = await Promise.all([
        api<OrgSettings>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
      ]);
      setOrg(o);
      setMembers(m.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save() {
    if (!org) return;
    start(async () => {
      try {
        const next = await api<OrgSettings>("/api/settings", {
          method: "PATCH",
          body: JSON.stringify({
            name: org.name,
            webhookUrl: org.webhookUrl,
            rateLimitPerMinute: org.rateLimitPerMinute,
            defaultProfile: org.defaultProfile,
            defaultMode: org.defaultMode,
          }),
        });
        setOrg(next);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function invite() {
    start(async () => {
      try {
        await api("/api/members", {
          method: "POST",
          body: JSON.stringify({ email, role }),
        });
        setEmail("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function exportAudits() {
    start(async () => {
      const csv = await api<string>("/api/audits?format=csv");
      setAuditsCsv(csv);
    });
  }

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Org, members, webhook.">
        <p className="text-slate-500">Loading…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell title="Settings" subtitle="Org, members, webhook, and exports.">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Organization</p>
          <div>
            <Label>Name</Label>
            <Input
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Webhook URL</Label>
            <Input
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label>Rate limit / minute</Label>
            <Input
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value) || 120,
                })
              }
            />
          </div>
          <div>
            <Label>Default profile</Label>
            <Input
              value={org.defaultProfile}
              onChange={(e) =>
                setOrg({
                  ...org,
                  defaultProfile: e.target.value as OrgSettings["defaultProfile"],
                })
              }
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={pending} onClick={save}>
            Save settings
          </Button>
          <Button variant="outline" disabled={pending} onClick={exportAudits}>
            Export audits CSV
          </Button>
          {auditsCsv ? (
            <pre className="max-h-40 overflow-auto rounded bg-slate-50 p-2 text-xs">
              {auditsCsv}
            </pre>
          ) : null}
        </div>
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-slate-900">Members</p>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="owner | designer | viewer" />
          </div>
          <Button disabled={pending || !email.trim()} onClick={invite}>
            Invite member
          </Button>
          <ul className="space-y-2 pt-2">
            {members.map((m) => (
              <li key={m.id} className="text-sm text-slate-600">
                {m.email} · {m.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
`,
);

write(
  "src/app/honesty/page.tsx",
  `import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  CLAIM,
  DISPLAY_NAME,
  GUIDE_PATH,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="What this Method Lab studio is — and is not."
    >
      <div className="max-w-3xl space-y-6 text-slate-600">
        <p>
          <strong className="text-slate-900">{DISPLAY_NAME}</strong> is a
          method-lab product inspired by conversational + tactile chart research
          for blind and low-vision users. It soft-simulates chart libraries,
          layered tactile presentation, feedback grammar, and
          select-confirm-ask-verify sessions. It is <em>not</em> a live
          refreshable tactile hardware driver, and it is not branded as Graphy.
        </p>
        <p>
          <strong className="text-slate-900">Claim:</strong> {CLAIM}
        </p>
        <p>
          Dual score: <strong>A</strong> conversational + tactile plan quality
          (layers + grammar + verify loop) vs <strong>B</strong> visual-only
          baseline without tactile layers or verify discipline.
        </p>
        <div>
          <p className="font-medium text-slate-900">Sources</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Paper:{" "}
              <a className="underline" href={PAPER_URL}>
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors&apos; code:{" "}
              {AUTHORS_CODE_URL ? (
                <a className="underline" href={AUTHORS_CODE_URL}>
                  {AUTHORS_CODE_URL}
                </a>
              ) : (
                "none published with the digest"
              )}
            </li>
            <li>
              Tutor guide:{" "}
              <span className="font-mono text-xs">{GUIDE_PATH}</span>
              {" · "}
              <Link className="underline" href="/charts">
                open studio
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
`,
);

console.log("pages done");
// silence unused helper
void crudPage;
