/**
 * Remaining domain + commercial pages.
 * Run: node scripts/bootstrap-pages2.mjs
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
  "src/app/populations/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = Record<string, string | number | undefined> & { id: string; label: string };
type Ref = { id: string; label: string };

export function PopulationsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [packs, setPacks] = useState<Ref[]>([]);
  const [scenarios, setScenarios] = useState<Ref[]>([]);
  const [species, setSpecies] = useState<Ref[]>([]);
  const [error, setError] = useState("");
  const [packId, setPackId] = useState("");
  const [scenarioId, setScenarioId] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("urban_density");
  const [thermalSuitIndex, setThermalSuitIndex] = useState("0.7");
  const [populationAtRisk, setPopulationAtRisk] = useState("0.65");
  const [climateShiftSignal, setClimateShiftSignal] = useState("0.7");
  const [assaySignal, setAssaySignal] = useState("0.7");

  const load = async () => {
    try {
      const [popList, packList, scenarioList, speciesList] = await Promise.all([
        api<{ items: Row[] }>("/api/populations"),
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/scenarios"),
        api<{ items: Ref[] }>("/api/species"),
      ]);
      setItems(popList.items);
      setPacks(packList.items);
      setScenarios(scenarioList.items);
      setSpecies(speciesList.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
      if (!scenarioId && scenarioList.items[0]) setScenarioId(scenarioList.items[0].id);
      if (!speciesId && speciesList.items[0]) setSpeciesId(speciesList.items[0].id);
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
      await api("/api/populations", {
        method: "POST",
        body: JSON.stringify({
          packId,
          scenarioId,
          speciesId,
          label,
          kind,
          thermalSuitIndex: Number(thermalSuitIndex),
          populationAtRisk: Number(populationAtRisk),
          climateShiftSignal: Number(climateShiftSignal),
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
      title="Population overlays"
      subtitle="Attach population-at-risk overlays to a scenario and species niche for thermal-suitability soft-sim."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="scenario">Scenario</Label>
          <select id="scenario" className="w-full rounded-md border px-3 py-2 text-sm" value={scenarioId} onChange={(e) => setScenarioId(e.target.value)}>
            {scenarios.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="species">Species</Label>
          <select id="species" className="w-full rounded-md border px-3 py-2 text-sm" value={speciesId} onChange={(e) => setSpeciesId(e.target.value)}>
            {species.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Overlay kind</Label>
          <select id="kind" className="w-full rounded-md border px-3 py-2 text-sm" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="urban_density">urban_density</option>
            <option value="peri_urban">peri_urban</option>
            <option value="rural_dispersed">rural_dispersed</option>
            <option value="mixed_exposure">mixed_exposure</option>
            <option value="custom">custom</option>
          </select>
          <Label htmlFor="thermal">Thermal suit index</Label>
          <Input id="thermal" value={thermalSuitIndex} onChange={(e) => setThermalSuitIndex(e.target.value)} />
          <Label htmlFor="par">Population at risk</Label>
          <Input id="par" value={populationAtRisk} onChange={(e) => setPopulationAtRisk(e.target.value)} />
          <Label htmlFor="shift">Climate shift signal</Label>
          <Input id="shift" value={climateShiftSignal} onChange={(e) => setClimateShiftSignal(e.target.value)} />
          <Label htmlFor="assay">Assay signal</Label>
          <Input id="assay" value={assaySignal} onChange={(e) => setAssaySignal(e.target.value)} />
          <Button type="submit">Create overlay</Button>
        </form>
        <ul className="space-y-2">
          {items.map((row) => (
            <li key={row.id} className="row-lift rounded-lg border bg-white px-4 py-3">
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {String(row.kind)} · thermal {String(row.thermalSuitIndex)} · PAR {String(row.populationAtRisk)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default PopulationsPage;
`,
);

w(
  "src/app/compare/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Ref = { id: string; label: string };
type Compare = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  cmip6: { overall: number; thermalScore: number };
  historical: { overall: number; thermalScore: number };
};

export function ComparePage() {
  const [packs, setPacks] = useState<Ref[]>([]);
  const [scenarios, setScenarios] = useState<Ref[]>([]);
  const [species, setSpecies] = useState<Ref[]>([]);
  const [populations, setPopulations] = useState<Ref[]>([]);
  const [items, setItems] = useState<Compare[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("CMIP6 vs historical");
  const [packId, setPackId] = useState("");
  const [scenarioId, setScenarioId] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [populationId, setPopulationId] = useState("");
  const [climateBias, setClimateBias] = useState("balanced");

  const load = async () => {
    try {
      const [packList, scenarioList, speciesList, popList, compares] = await Promise.all([
        api<{ items: Ref[] }>("/api/packs"),
        api<{ items: Ref[] }>("/api/scenarios"),
        api<{ items: Ref[] }>("/api/species"),
        api<{ items: Ref[] }>("/api/populations"),
        api<{ items: Compare[] }>("/api/compare"),
      ]);
      setPacks(packList.items);
      setScenarios(scenarioList.items);
      setSpecies(speciesList.items);
      setPopulations(popList.items);
      setItems(compares.items);
      if (!packId && packList.items[0]) setPackId(packList.items[0].id);
      if (!scenarioId && scenarioList.items[0]) setScenarioId(scenarioList.items[0].id);
      if (!speciesId && speciesList.items[0]) setSpeciesId(speciesList.items[0].id);
      if (!populationId && popList.items[0]) setPopulationId(popList.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/compare", {
        method: "POST",
        body: JSON.stringify({
          name,
          packId,
          scenarioId,
          speciesId,
          populationId,
          climateBias,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not compare");
    }
  };

  return (
    <StudioShell
      title="Compare"
      subtitle="Dual soft-sim: CMIP6 thermal suitability (A) versus static historical baseline (B)."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={run} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Compare name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="scenario">Scenario</Label>
          <select id="scenario" className="w-full rounded-md border px-3 py-2 text-sm" value={scenarioId} onChange={(e) => setScenarioId(e.target.value)}>
            {scenarios.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="species">Species</Label>
          <select id="species" className="w-full rounded-md border px-3 py-2 text-sm" value={speciesId} onChange={(e) => setSpeciesId(e.target.value)}>
            {species.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="population">Population overlay</Label>
          <select id="population" className="w-full rounded-md border px-3 py-2 text-sm" value={populationId} onChange={(e) => setPopulationId(e.target.value)}>
            {populations.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="bias">Climate bias</Label>
          <select id="bias" className="w-full rounded-md border px-3 py-2 text-sm" value={climateBias} onChange={(e) => setClimateBias(e.target.value)}>
            <option value="balanced">balanced</option>
            <option value="ssp585_first">ssp585_first</option>
            <option value="ssp126_first">ssp126_first</option>
            <option value="historical_first">historical_first</option>
          </select>
          <Button type="submit">Run A/B compare</Button>
        </form>
        <ul className="space-y-3">
          {items.map((row) => (
            <li key={row.id} className="rounded-lg border bg-white p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">{row.name}</p>
                <p className="text-sm text-[var(--ds-teal)]">winner {row.winner} · gap {row.gap}</p>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">CMIP6 thermal</p>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                    <div className="score-bar h-full bg-[var(--ds-teal)]" style={{ width: \`\${row.cmip6.overall}%\` }} />
                  </div>
                  <p className="mt-1 text-sm">{row.cmip6.overall}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">Static historical</p>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-[var(--studio-gauze-soft)]">
                    <div className="score-bar h-full bg-[var(--ds-amber)]" style={{ width: \`\${row.historical.overall}%\` }} />
                  </div>
                  <p className="mt-1 text-sm">{row.historical.overall}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}

export default ComparePage;
`,
);

w(
  "src/app/scoreboard/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  cmip6: { overall: number };
  historical: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [exportMsg, setExportMsg] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const exportCsv = async () => {
    try {
      const csv = await api<string>("/api/export?format=csv");
      setExportMsg(\`Exported \${csv.split("\\n").length - 1} compare rows\`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    }
  };

  return (
    <StudioShell
      title="Scoreboard"
      subtitle="Rank soft-sim compares by CMIP6 thermal-suitability overall — method-lab only."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="mb-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => void load()}>
          Refresh
        </Button>
        <Button type="button" variant="outline" onClick={() => void exportCsv()}>
          Export CSV
        </Button>
        {exportMsg ? <p className="text-sm text-[var(--ds-teal)]">{exportMsg}</p> : null}
      </div>
      <ol className="space-y-2">
        {items.map((row, i) => (
          <li key={row.id} className="row-lift flex items-center justify-between rounded-lg border bg-white px-4 py-3">
            <div>
              <p className="font-medium">
                #{i + 1} {row.name}
              </p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                winner {row.winner} · gap {row.gap}
              </p>
            </div>
            <p className="text-sm">
              CMIP6 {row.cmip6.overall} · hist {row.historical.overall}
            </p>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            No compares yet — run one from Compare.
          </li>
        ) : null}
      </ol>
    </StudioShell>
  );
}

export default ScoreboardPage;
`,
);

w(
  "src/app/settings/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Org = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  bearerToken: string;
  defaultClimateBias: string;
  defaultMode: string;
  rateLimitPerMinute: number;
};
type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const [settings, memberList, auditList] = await Promise.all([
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit"),
      ]);
      setOrg(settings.org);
      setMembers(memberList.items);
      setAudits(auditList.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    try {
      const res = await api<{ org: Org }>("/api/settings", {
        method: "POST",
        body: JSON.stringify(org),
      });
      setOrg(res.org);
      setMsg("Settings saved");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Save failed");
    }
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "evaluator" }),
      });
      setEmail("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Invite failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, webhooks, members, and audit trail for the dengue thermal-suitability soft-sim bench."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {msg ? <p className="mb-4 text-sm text-[var(--ds-teal)]">{msg}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-10 grid max-w-xl gap-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="webhook">Webhook URL</Label>
          <Input id="webhook" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          <Label htmlFor="secret">Webhook secret</Label>
          <Input id="secret" value={org.webhookSecret} onChange={(e) => setOrg({ ...org, webhookSecret: e.target.value })} />
          <Label htmlFor="bias">Default climate bias</Label>
          <select
            id="bias"
            className="rounded-md border px-3 py-2 text-sm"
            value={org.defaultClimateBias}
            onChange={(e) => setOrg({ ...org, defaultClimateBias: e.target.value })}
          >
            <option value="balanced">balanced</option>
            <option value="ssp585_first">ssp585_first</option>
            <option value="ssp126_first">ssp126_first</option>
            <option value="historical_first">historical_first</option>
          </select>
          <Label htmlFor="rate">Rate limit / minute</Label>
          <Input
            id="rate"
            type="number"
            value={org.rateLimitPerMinute}
            onChange={(e) => setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })}
          />
          <Button type="submit">Save settings</Button>
        </form>
      ) : null}
      <form onSubmit={invite} className="mb-10 flex max-w-xl flex-wrap items-end gap-2">
        <div className="grow">
          <Label htmlFor="email">Invite member</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit">Invite</Button>
      </form>
      <ul className="mb-10 space-y-1 text-sm">
        {members.map((m) => (
          <li key={m.id}>
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">Audit</h2>
      <ul className="space-y-2 text-sm">
        {audits.map((a) => (
          <li key={a.id} className="rounded border bg-white px-3 py-2">
            {a.at} · {a.actor} · {a.action} — {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default SettingsPage;
`,
);

console.log("bootstrap-pages2 done");
