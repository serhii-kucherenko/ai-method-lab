/**
 * Domain + marketing pages for Dengue Suit Studio.
 * Run: node scripts/bootstrap-pages.mjs
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
        <div aria-hidden className="thermal-mist absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--ds-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--ds-mist)]">
            Risk packs for dengue surveillance — compare CMIP6 thermal
            suitability against static historical baselines before you lock a
            pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--ds-amber)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open packs
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-[var(--ds-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-[var(--ds-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--ds-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-[var(--ds-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Static historical dengue maps miss climate-shifted thermal
          suitability and population risk.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Risk packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs for CMIP6 dengue thermal-suitability
              surveillance.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Scenarios and species</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make SSP horizons and vector niches explicit before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test CMIP6 thermal suitability against static historical
              baselines.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned risk pack for your dengue surveillance soft-sim case.</li>
          <li>Configure CMIP6 scenarios, species niches, and population overlays.</li>
          <li>Run a thermal-suitability soft-sim, then compare CMIP6 vs historical.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="underline text-[var(--ds-teal)]">
            Pricing
          </Link>
          {" · "}
          <Link href="/honesty" className="underline text-[var(--ds-teal)]">
            Honesty
          </Link>
          {" · "}
          <a href={PAPER_URL} className="underline text-[var(--ds-teal)]">
            Source paper
          </a>
        </p>
        <p className="mt-4 max-w-2xl text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
          Soft-sim only. Not live outbreak prediction, not clinical diagnosis,
          not operational mosquito control deployment, and not the authors&apos;
          dengue atlas.
        </p>
      </section>
    </div>
  );
}

export default LandingPage;
`,
);

w(
  "src/app/packs/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & {
  id: string;
  label: string;
  status: string;
};

export function PacksPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [riskFocus, setRiskFocus] = useState("");

  const load = async (query = q) => {
    try {
      setItems(
        (
          await api<{ items: Row[] }>(
            \`/api/packs?q=\${encodeURIComponent(query)}\`,
          )
        ).items,
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
      await api("/api/packs", {
        method: "POST",
        body: JSON.stringify({ label, version, riskFocus }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/packs", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Risk packs"
      subtitle="Version the dengue surveillance risk context before comparing CMIP6 thermal suitability against static historical baselines."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="version">Version</Label>
          <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} required />
          <Label htmlFor="riskFocus">Risk focus</Label>
          <Input id="riskFocus" value={riskFocus} onChange={(e) => setRiskFocus(e.target.value)} required />
          <Button type="submit">Create</Button>
        </form>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" variant="outline" onClick={() => void load()}>
              Search
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
                <div>
                  <p className="font-medium">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                    {row.riskFocus as string} · {row.version as string} · {row.status}
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={() => void archive(row.id)}>
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

export default PacksPage;
`,
);

w(
  "src/app/scenarios/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string; status: string };
type Ref = { id: string; label: string };

export function ScenariosPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Ref[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("ssp585");
  const [horizonHint, setHorizonHint] = useState("2040-2060");
  const [thermalFloor, setThermalFloor] = useState("0.45");
  const [shiftFloor, setShiftFloor] = useState("0.4");

  const load = async () => {
    try {
      const [scenarioList, packList] = await Promise.all([
        api<{ items: Row[] }>("/api/scenarios"),
        api<{ items: Ref[] }>("/api/packs"),
      ]);
      setItems(scenarioList.items);
      setPacks(packList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
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
      await api("/api/scenarios", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          horizonHint,
          thermalFloor: Number(thermalFloor),
          shiftFloor: Number(shiftFloor),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/scenarios", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Climate scenarios"
      subtitle="Configure CMIP6 SSP horizons for thermal-suitability soft-sim — not live outbreak forecast layers."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Scenario kind</Label>
          <select id="kind" className="w-full rounded-md border px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="ssp126">ssp126</option>
            <option value="ssp245">ssp245</option>
            <option value="ssp370">ssp370</option>
            <option value="ssp585">ssp585</option>
            <option value="historical">historical</option>
            <option value="custom">custom</option>
          </select>
          <Label htmlFor="horizon">Horizon hint</Label>
          <Input id="horizon" value={horizonHint} onChange={(e) => setHorizonHint(e.target.value)} />
          <Label htmlFor="thermal">Thermal floor</Label>
          <Input id="thermal" value={thermalFloor} onChange={(e) => setThermalFloor(e.target.value)} />
          <Label htmlFor="shift">Shift floor</Label>
          <Input id="shift" value={shiftFloor} onChange={(e) => setShiftFloor(e.target.value)} />
          <Button type="submit">Create scenario</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
              <div>
                <p className="font-medium">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {String(row.kind)} · {String(row.horizonHint)} · {row.status}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => void archive(row.id)}>Archive</Button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ScenariosPage;
`,
);

w(
  "src/app/species/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string; status: string };
type Ref = { id: string; label: string };

export function SpeciesPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Ref[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("aedes_aegypti");
  const [nicheHint, setNicheHint] = useState("urban-container-breeder");
  const [nicheFloor, setNicheFloor] = useState("0.4");
  const [stickinessCeiling, setStickinessCeiling] = useState("0.35");

  const load = async () => {
    try {
      const [speciesList, packList] = await Promise.all([
        api<{ items: Row[] }>("/api/species"),
        api<{ items: Ref[] }>("/api/packs"),
      ]);
      setItems(speciesList.items);
      setPacks(packList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
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
      await api("/api/species", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          nicheHint,
          nicheFloor: Number(nicheFloor),
          stickinessCeiling: Number(stickinessCeiling),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/species", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell
      title="Vector species"
      subtitle="Specify mosquito niche soft-sim parameters — not operational mosquito control deployment."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Species kind</Label>
          <select id="kind" className="w-full rounded-md border px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="aedes_aegypti">aedes_aegypti</option>
            <option value="aedes_albopictus">aedes_albopictus</option>
            <option value="mixed_vector">mixed_vector</option>
            <option value="custom">custom</option>
          </select>
          <Label htmlFor="niche">Niche hint</Label>
          <Input id="niche" value={nicheHint} onChange={(e) => setNicheHint(e.target.value)} />
          <Label htmlFor="floor">Niche floor</Label>
          <Input id="floor" value={nicheFloor} onChange={(e) => setNicheFloor(e.target.value)} />
          <Label htmlFor="stick">Stickiness ceiling</Label>
          <Input id="stick" value={stickinessCeiling} onChange={(e) => setStickinessCeiling(e.target.value)} />
          <Button type="submit">Create species</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
              <div>
                <p className="font-medium">{row.label}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                  {String(row.kind)} · {String(row.nicheHint)} · {row.status}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => void archive(row.id)}>Archive</Button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default SpeciesPage;
`,
);

console.log("bootstrap-pages part1 done");
