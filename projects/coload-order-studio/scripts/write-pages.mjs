/**
 * Write Coload Order Studio pages + API routes.
 * Run: node scripts/write-pages.mjs
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
  "src/app/page.tsx",
  `import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative min-h-screen overflow-hidden">
        <div aria-hidden className="mist-fade absolute inset-0 bg-[var(--studio-wash)]" />
        <div aria-hidden className="schema-grid absolute inset-0 opacity-60" />
        <div aria-hidden className="mesopore-mist absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--co-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--co-mist)]">
            Carrier packs for chemo-photothermal formulation — compare ordered
            co-load sequences against simultaneous-load baselines before you
            lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--co-amber)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open packs
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-[var(--co-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-[var(--co-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--co-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-[var(--co-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Simultaneous co-loading can waste encapsulation — load order fills
          the pore with intent.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Carrier packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs for hollow mesoporous co-load design.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Loads and assays</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make chemo-then-photo order and encapsulation soft-sim explicit before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test ordered co-load sequences against simultaneous-load baselines.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned carrier pack for your co-load soft-sim case.</li>
          <li>Configure carriers, load sequences, and assay runs.</li>
          <li>Run an assay soft-sim, then compare ordered vs simultaneous.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="underline text-[var(--co-slate)]">
            Pricing
          </Link>
          {" · "}
          <Link href="/honesty" className="underline text-[var(--co-slate)]">
            Honesty
          </Link>
          {" · "}
          <a href={PAPER_URL} className="underline text-[var(--co-slate)]">
            Source paper
          </a>
        </p>
        <p className="mt-4 max-w-2xl text-xs text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
          Soft-sim only — not wet-lab validated GMP nanomedicine manufacture,
          not live patient dosing, not clinical oncology clearance. Not the
          authors&apos; HSN system.
        </p>
      </section>
    </div>
  );
}

export default LandingPage;
`,
);

const crudPage = (opts) => `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string; status: string };

export function ${opts.exportName}() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  ${opts.stateDecls}

  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(\`${opts.api}?q=\${encodeURIComponent(query)}\`))
          .items,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load("");
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("${opts.api}", {
        method: "POST",
        body: JSON.stringify(${opts.createBody}),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("${opts.api}", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="${opts.title}" subtitle="${opts.subtitle}">
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          ${opts.formFields}
          <Button type="submit">Create</Button>
        </form>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((row) => (
              <li
                key={row.id}
                className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium">{row.label}</p>
                  <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    ${opts.rowMeta}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void archive(row.id)}
                >
                  Archive
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}

export default ${opts.exportName};
`;

w(
  "src/app/packs/page.tsx",
  crudPage({
    exportName: "PacksPage",
    api: "/api/packs",
    title: "Carrier packs",
    subtitle:
      "Version the hollow mesoporous co-load context before comparing ordered sequences against simultaneous-load baselines.",
    stateDecls: `const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [formulationFocus, setFormulationFocus] = useState("");`,
    createBody: "{ label, version, formulationFocus }",
    formFields: `<Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="version">Version</Label>
          <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} required />
          <Label htmlFor="focus">Formulation focus</Label>
          <Input id="focus" value={formulationFocus} onChange={(e) => setFormulationFocus(e.target.value)} required />`,
    rowMeta: `{row.version} · {row.formulationFocus} · {row.status}`,
  }),
);

w(
  "src/app/carriers/page.tsx",
  crudPage({
    exportName: "CarriersPage",
    api: "/api/carriers",
    title: "Carriers",
    subtitle:
      "Register hollow mesoporous silica carriers and pore hints for ordered co-load soft-sim.",
    stateDecls: `const [label, setLabel] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [kind, setKind] = useState("hollow_mesoporous_silica");
  const [poreHint, setPoreHint] = useState("mesopore-shell");
  const [orderFloor, setOrderFloor] = useState("0.5");
  const [chemoFloor, setChemoFloor] = useState("0.45");`,
    createBody:
      "{ packId, label, kind, poreHint, orderFloor: Number(orderFloor), chemoFloor: Number(chemoFloor) }",
    formFields: `<Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="pore">Pore hint</Label>
          <Input id="pore" value={poreHint} onChange={(e) => setPoreHint(e.target.value)} required />
          <Label htmlFor="orderFloor">Order floor</Label>
          <Input id="orderFloor" value={orderFloor} onChange={(e) => setOrderFloor(e.target.value)} />
          <Label htmlFor="chemoFloor">Chemo floor</Label>
          <Input id="chemoFloor" value={chemoFloor} onChange={(e) => setChemoFloor(e.target.value)} />`,
    rowMeta: `{row.kind} · {row.poreHint} · {row.status}`,
  }),
);

w(
  "src/app/loads/page.tsx",
  crudPage({
    exportName: "LoadsPage",
    api: "/api/loads",
    title: "Load sequences",
    subtitle:
      "Configure chemo-then-photo (or staged) load order before assay soft-sim.",
    stateDecls: `const [label, setLabel] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [kind, setKind] = useState("dtx_then_icg");
  const [orderHint, setOrderHint] = useState("docetaxel-first,icg-second");
  const [photoFloor, setPhotoFloor] = useState("0.45");
  const [leakCeiling, setLeakCeiling] = useState("0.35");`,
    createBody:
      "{ packId, label, kind, orderHint, photoFloor: Number(photoFloor), leakCeiling: Number(leakCeiling) }",
    formFields: `<Label htmlFor="packId">Pack id</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} required />
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Order kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Label htmlFor="orderHint">Order hint</Label>
          <Input id="orderHint" value={orderHint} onChange={(e) => setOrderHint(e.target.value)} required />
          <Label htmlFor="photoFloor">Photo floor</Label>
          <Input id="photoFloor" value={photoFloor} onChange={(e) => setPhotoFloor(e.target.value)} />
          <Label htmlFor="leakCeiling">Leak ceiling</Label>
          <Input id="leakCeiling" value={leakCeiling} onChange={(e) => setLeakCeiling(e.target.value)} />`,
    rowMeta: `{row.kind} · {row.orderHint} · {row.status}`,
  }),
);

w(
  "src/app/assays/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  label: string;
  kind: string;
  orderFidelity: number;
  chemoEncapsulation: number;
  photoEncapsulation: number;
  status: string;
};

export function AssaysPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [carrierId, setCarrierId] = useState("carrier-demo");
  const [loadId, setLoadId] = useState("load-demo");
  const [kind, setKind] = useState("encapsulation_efficiency");
  const [orderFidelity, setOrderFidelity] = useState("0.7");
  const [chemoEncapsulation, setChemo] = useState("0.65");
  const [photoEncapsulation, setPhoto] = useState("0.7");
  const [assaySignal, setSignal] = useState("0.7");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/assays")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/assays", {
        method: "POST",
        body: JSON.stringify({
          packId,
          carrierId,
          loadId,
          label,
          kind,
          orderFidelity: Number(orderFidelity),
          chemoEncapsulation: Number(chemoEncapsulation),
          photoEncapsulation: Number(photoEncapsulation),
          assaySignal: Number(assaySignal),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  return (
    <StudioShell
      title="Assay runs"
      subtitle="Soft-sim encapsulation and photothermal assays for ordered co-load sequences — not wet-lab GMP manufacture."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="packId">Pack</Label>
          <Input id="packId" value={packId} onChange={(e) => setPackId(e.target.value)} />
          <Label htmlFor="carrierId">Carrier</Label>
          <Input id="carrierId" value={carrierId} onChange={(e) => setCarrierId(e.target.value)} />
          <Label htmlFor="loadId">Load</Label>
          <Input id="loadId" value={loadId} onChange={(e) => setLoadId(e.target.value)} />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} />
          <Label htmlFor="order">Order fidelity</Label>
          <Input id="order" value={orderFidelity} onChange={(e) => setOrderFidelity(e.target.value)} />
          <Label htmlFor="chemo">Chemo encapsulation</Label>
          <Input id="chemo" value={chemoEncapsulation} onChange={(e) => setChemo(e.target.value)} />
          <Label htmlFor="photo">Photo encapsulation</Label>
          <Input id="photo" value={photoEncapsulation} onChange={(e) => setPhoto(e.target.value)} />
          <Label htmlFor="signal">Assay signal</Label>
          <Input id="signal" value={assaySignal} onChange={(e) => setSignal(e.target.value)} />
          <Button type="submit">Create assay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.kind} · order {row.orderFidelity} · chemo {row.chemoEncapsulation} · photo{" "}
                {row.photoEncapsulation}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default AssaysPage;
`,
);

console.log("domain pages done");
