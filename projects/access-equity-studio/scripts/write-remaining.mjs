/**
 * Remaining domain pages + API routes for Access Equity Studio.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
};

w("src/app/api/compare/route.ts", `import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const compare = runCompare({
    name: body.name ?? "compare",
    equityGateId: body.equityGateId,
    cohortId: body.cohortId,
    screenId: body.screenId,
    pathwayId: body.pathwayId,
    accessRunId: body.accessRunId,
    equityBias: body.equityBias ?? body.bias,
    accuracyAdherence: body.accuracyAdherence,
    accuracyTunnel: body.accuracyTunnel,
    screenNoise: body.screenNoise,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
`);

w("src/app/api/cohorts/route.ts", `import { guard, json } from "@/lib/api";
import { archiveCohort, createCohort, listCohorts } from "@/store";
import type { CohortKind } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(listCohorts({
    q: url.searchParams.get("q") ?? undefined,
    packId: url.searchParams.get("packId") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 20),
  }));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const cohort = archiveCohort(body.id);
    if (!cohort) return json({ error: "not_found" }, { status: 404 });
    return json({ cohort });
  }
  const cohort = createCohort({
    packId: body.packId,
    label: body.label,
    kind: body.kind as CohortKind,
    regionHint: body.regionHint ?? "",
    strataCount: Number(body.strataCount ?? 1),
    accessMin: Number(body.accessMin ?? 0.3),
    accessMax: Number(body.accessMax ?? 0.9),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!cohort) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ cohort }, { status: 201 });
}
`);

w("src/app/api/pathways/route.ts", `import { guard, json } from "@/lib/api";
import { archivePathway, createPathway, listPathways } from "@/store";
import type { PathwayStage } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(listPathways({
    q: url.searchParams.get("q") ?? undefined,
    packId: url.searchParams.get("packId") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 20),
  }));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const pathway = archivePathway(body.id);
    if (!pathway) return json({ error: "not_found" }, { status: 404 });
    return json({ pathway });
  }
  const pathway = createPathway({
    packId: body.packId,
    label: body.label,
    stage: body.stage as PathwayStage,
    referralHint: body.referralHint ?? "",
    stepCount: Number(body.stepCount ?? 3),
    waitDaysFloor: Number(body.waitDaysFloor ?? 7),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!pathway) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ pathway }, { status: 201 });
}
`);

w("src/app/api/screens/route.ts", `import { guard, json } from "@/lib/api";
import { archiveScreen, createScreen, listScreens } from "@/store";
import type { ScreenKind } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(listScreens({
    q: url.searchParams.get("q") ?? undefined,
    packId: url.searchParams.get("packId") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 20),
  }));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const screen = archiveScreen(body.id);
    if (!screen) return json({ error: "not_found" }, { status: 404 });
    return json({ screen });
  }
  const screen = createScreen({
    packId: body.packId,
    label: body.label,
    kind: body.kind as ScreenKind,
    fidelityHint: body.fidelityHint ?? "",
    itemCount: Number(body.itemCount ?? 8),
    sensitivityFloor: Number(body.sensitivityFloor ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!screen) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ screen }, { status: 201 });
}
`);

w("src/app/api/equity/route.ts", `import { guard, json } from "@/lib/api";
import {
  archiveEquityGate,
  createAccessRun,
  createEquityGate,
  listAccessRuns,
  listEquityGates,
} from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  if (url.searchParams.get("runs") === "1") {
    return json(listAccessRuns({
      equityGateId: url.searchParams.get("equityGateId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }));
  }
  return json(listEquityGates({
    q: url.searchParams.get("q") ?? undefined,
    equityChannel: url.searchParams.get("equityChannel") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    packId: url.searchParams.get("packId") ?? undefined,
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 20),
  }));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const gate = archiveEquityGate(body.id);
    if (!gate) return json({ error: "not_found" }, { status: 404 });
    return json({ gate });
  }
  if (body.action === "run") {
    const run = createAccessRun({
      equityGateId: body.equityGateId,
      cohortId: body.cohortId,
      screenId: body.screenId,
      pathwayId: body.pathwayId,
      accessReach: Number(body.accessReach ?? 0.6),
      equityGapClosure: Number(body.equityGapClosure ?? 0.6),
      taskSharingFidelity: Number(body.taskSharingFidelity ?? 0.6),
      packReadiness: Number(body.packReadiness ?? 0.6),
      runNotes: body.runNotes,
    });
    if (!run) return json({ error: "refs_not_found" }, { status: 400 });
    return json({ run }, { status: 201 });
  }
  const gate = createEquityGate({
    packId: body.packId,
    label: body.label,
    gateNotes: body.gateNotes ?? "",
    lockCondition: body.lockCondition ?? "review",
    equityChannel: body.equityChannel ?? "soft_sim_access_equity",
    notes: body.notes,
  });
  return json({ gate }, { status: 201 });
}
`);

w("src/app/api/scoreboard/route.ts", `import { guard, json } from "@/lib/api";
import { getScoreboard } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: getScoreboard() });
}
`);

w("src/app/api/features/route.ts", `import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: featureInventory() });
}
`);

w("src/app/api/goldens-sample/route.ts", `import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: GOLDENS.slice(0, 5), total: GOLDENS.length });
}
`);

w("src/app/api/members/route.ts", `import { guard, json } from "@/lib/api";
import { inviteMember, listMembers, type MemberRole } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const member = inviteMember(body.email, (body.role ?? "evaluator") as MemberRole);
  return json({ member }, { status: 201 });
}
`);

w("src/app/api/audit/route.ts", `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 50);
  return json({ items: listAudits(limit) });
}
`);

w("src/app/cohorts/page.tsx", `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Cohort = { id: string; packId: string; label: string; kind: string; status: string; strataCount: number };
type Pack = { id: string; label: string };

export function CohortsPage() {
  const [items, setItems] = useState<Cohort[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("community");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      const [cohorts, packRes] = await Promise.all([
        api<{ items: Cohort[] }>(\`/api/cohorts?q=\${encodeURIComponent(query)}\`),
        api<{ items: Pack[] }>("/api/packs"),
      ]);
      setItems(cohorts.items);
      setPacks(packRes.items);
      if (packRes.items[0] && !packRes.items.find((p) => p.id === packId)) setPackId(packRes.items[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load cohorts");
    }
  };

  useEffect(() => { void load(""); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/cohorts", {
        method: "POST",
        body: JSON.stringify({ packId, label, kind, regionHint: "multi_strata", strataCount: 4, accessMin: 0.4, accessMax: 0.9 }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create cohort");
    }
  };

  return (
    <StudioShell title="Cohorts" subtitle="Register multi-strata screen cohorts with access bounds for equity soft-sim.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Button>Create cohort</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input aria-label="Search cohorts" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cohorts" />
            <Button type="button" variant="outline" onClick={() => void load()}>Search</Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((cohort) => (
              <article key={cohort.id} className="row-lift rounded-lg border bg-white p-4">
                <h2 className="font-semibold">{cohort.label}</h2>
                <p className="text-sm text-slate-600">{cohort.kind} · strata {cohort.strataCount} · {cohort.status}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default CohortsPage;
`);

w("src/app/pathways/page.tsx", `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pathway = { id: string; label: string; stage: string; status: string; stepCount: number };
type Pack = { id: string; label: string };

export function PathwaysPage() {
  const [items, setItems] = useState<Pathway[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [stage, setStage] = useState("screen");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      const [rows, packRes] = await Promise.all([
        api<{ items: Pathway[] }>(\`/api/pathways?q=\${encodeURIComponent(query)}\`),
        api<{ items: Pack[] }>("/api/packs"),
      ]);
      setItems(rows.items);
      setPacks(packRes.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load pathways");
    }
  };

  useEffect(() => { void load(""); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/pathways", {
        method: "POST",
        body: JSON.stringify({ packId, label, stage, referralHint: "community_navigator", stepCount: 5, waitDaysFloor: 7 }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create pathway");
    }
  };

  return (
    <StudioShell title="Pathways" subtitle="Screen-to-referral pathway stages for equity-access soft-sim.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="stage">Stage</Label>
          <Input id="stage" value={stage} onChange={(e) => setStage(e.target.value)} required />
          <Button>Create pathway</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input aria-label="Search pathways" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pathways" />
            <Button type="button" variant="outline" onClick={() => void load()}>Search</Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((row) => (
              <article key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <h2 className="font-semibold">{row.label}</h2>
                <p className="text-sm text-slate-600">{row.stage} · steps {row.stepCount} · {row.status}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default PathwaysPage;
`);

w("src/app/screens/page.tsx", `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Screen = { id: string; label: string; kind: string; status: string; itemCount: number };
type Pack = { id: string; label: string };

export function ScreensPage() {
  const [items, setItems] = useState<Screen[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("pack-demo");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState("task_shared");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      const [rows, packRes] = await Promise.all([
        api<{ items: Screen[] }>(\`/api/screens?q=\${encodeURIComponent(query)}\`),
        api<{ items: Pack[] }>("/api/packs"),
      ]);
      setItems(rows.items);
      setPacks(packRes.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load screens");
    }
  };

  useEffect(() => { void load(""); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/screens", {
        method: "POST",
        body: JSON.stringify({ packId, label, kind, fidelityHint: "caregiver,navigator", itemCount: 10, sensitivityFloor: 0.35 }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create screen");
    }
  };

  return (
    <StudioShell title="Screen recipes" subtitle="Task-shared and digital probe recipes for autism screening soft-sim.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="pack">Pack</Label>
          <select id="pack" className="w-full rounded-md border px-3 py-2 text-sm" value={packId} onChange={(e) => setPackId(e.target.value)}>
            {packs.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="kind">Kind</Label>
          <Input id="kind" value={kind} onChange={(e) => setKind(e.target.value)} required />
          <Button>Create screen</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input aria-label="Search screens" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search screens" />
            <Button type="button" variant="outline" onClick={() => void load()}>Search</Button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((row) => (
              <article key={row.id} className="row-lift rounded-lg border bg-white p-4">
                <h2 className="font-semibold">{row.label}</h2>
                <p className="text-sm text-slate-600">{row.kind} · items {row.itemCount} · {row.status}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default ScreensPage;
`);

w("src/app/equity/page.tsx", `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Gate = { id: string; label: string; lockCondition: string; status: string; equityChannel: string };
type Run = { id: string; accessReach: number; equityGapClosure: number; taskSharingFidelity: number; status: string };

export function EquityPage() {
  const [gates, setGates] = useState<Gate[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [g, r] = await Promise.all([
        api<{ items: Gate[] }>("/api/equity"),
        api<{ items: Run[] }>("/api/equity?runs=1"),
      ]);
      setGates(g.items);
      setRuns(r.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load equity");
    }
  };

  useEffect(() => { void load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/equity", {
        method: "POST",
        body: JSON.stringify({ packId: "pack-demo", label, gateNotes: "Access and equity under dual methods", lockCondition: "review", equityChannel: "soft_sim_access_equity" }),
      });
      setLabel("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create gate");
    }
  };

  const runSoftSim = async () => {
    try {
      await api("/api/equity", {
        method: "POST",
        body: JSON.stringify({
          action: "run",
          equityGateId: "equity-demo",
          cohortId: "cohort-demo",
          screenId: "screen-demo",
          pathwayId: "pathway-demo",
          accessReach: 0.72,
          equityGapClosure: 0.68,
          taskSharingFidelity: 0.7,
          packReadiness: 0.65,
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Run failed");
    }
  };

  return (
    <StudioShell title="Equity gates" subtitle="Configure equity gates and soft-sim access runs before dual compare.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Gate label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Button>Create equity gate</Button>
          <Button type="button" variant="outline" onClick={() => void runSoftSim()}>Run access soft-sim</Button>
        </form>
        <section className="space-y-6">
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            <h2 className="font-semibold">Gates</h2>
            {gates.map((g) => (
              <article key={g.id} className="row-lift rounded-lg border bg-white p-4">
                <h3 className="font-semibold">{g.label}</h3>
                <p className="text-sm text-slate-600">{g.lockCondition} · {g.equityChannel} · {g.status}</p>
              </article>
            ))}
          </div>
          <div className="space-y-3">
            <h2 className="font-semibold">Access runs</h2>
            {runs.map((r) => (
              <article key={r.id} className="row-lift rounded-lg border bg-white p-4">
                <p className="text-sm">reach {r.accessReach} · equity {r.equityGapClosure} · sharing {r.taskSharingFidelity} · {r.status}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default EquityPage;
`);

w("src/app/scoreboard/page.tsx", `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/client-api";

type Row = {
  id: string;
  name: string;
  winner: string;
  gap: number;
  equityAccess: { overall: number };
  accuracyOnly: { overall: number };
};

export function ScoreboardPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Row[] }>("/api/scoreboard")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load scoreboard");
    }
  };

  useEffect(() => { void load(); }, []);

  const exportCsv = async () => {
    const csv = await api<string>("/api/export?format=csv");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "access-equity-compares.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <StudioShell title="Scoreboard" subtitle="Ranked dual compares by equity-access task-sharing overall.">
      <div className="mb-4 flex gap-2">
        <Button type="button" variant="outline" onClick={() => void load()}>Refresh</Button>
        <Button type="button" onClick={() => void exportCsv()}>Export CSV</Button>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-[var(--studio-gauze-soft)]">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Winner</th>
              <th className="px-3 py-2">Gap</th>
              <th className="px-3 py-2">Equity-access</th>
              <th className="px-3 py-2">Accuracy-only</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">{row.winner}</td>
                <td className="px-3 py-2">{row.gap}</td>
                <td className="px-3 py-2">{row.equityAccess.overall}</td>
                <td className="px-3 py-2">{row.accuracyOnly.overall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StudioShell>
  );
}

export default ScoreboardPage;
`);

w("src/app/settings/page.tsx", `"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GUIDE_PATH } from "@/claim";
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
  rateLimitPerMinute: number;
  defaultEquityBias: string;
};

type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [features, setFeatures] = useState(0);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [settings, memberRes, auditRes, featureRes] = await Promise.all([
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit"),
        api<{ items: { id: string }[] }>("/api/features"),
      ]);
      setOrg(settings.org);
      setMembers(memberRes.items);
      setAudits(auditRes.items);
      setFeatures(featureRes.items.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load settings");
    }
  };

  useEffect(() => { void load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    try {
      await api("/api/settings", { method: "POST", body: JSON.stringify(org) });
      setMsg("Org saved");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Save failed");
    }
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/members", { method: "POST", body: JSON.stringify({ email, role: "evaluator" }) });
      setEmail("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Invite failed");
    }
  };

  const exportJson = async () => {
    const json = await api<string>("/api/export?format=json");
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "access-equity-packs.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pingWebhook = async () => {
    try {
      const data = await api<{ id?: string }>("/api/webhook", {
        method: "POST",
        body: JSON.stringify({
          demo: true,
          idempotencyKey: \`demo-\${Date.now()}\`,
          payload: { event: "pack.soft_sim", at: new Date().toISOString() },
        }),
      });
      setMsg(\`Webhook ok \${data.id ?? ""}\`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Webhook failed");
    }
  };

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Org, members, audit, export.">
        {error ? <p className="text-sm text-red-700">{error}</p> : <p>Loading…</p>}
      </StudioShell>
    );
  }

  return (
    <StudioShell title="Settings" subtitle="Org bearer auth, members, webhook HMAC, audit, export, and feature inventory.">
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={save} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="token">Bearer token</Label>
          <Input id="token" value={org.bearerToken} onChange={(e) => setOrg({ ...org, bearerToken: e.target.value })} />
          <Label htmlFor="secret">Webhook secret</Label>
          <Input id="secret" value={org.webhookSecret} onChange={(e) => setOrg({ ...org, webhookSecret: e.target.value })} />
          <Label htmlFor="rl">Rate limit / minute</Label>
          <Input id="rl" type="number" value={org.rateLimitPerMinute} onChange={(e) => setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })} />
          <Button>Save org</Button>
        </form>
        <div className="space-y-4">
          <form onSubmit={invite} className="space-y-3 rounded-lg border bg-white p-4">
            <Label htmlFor="email">Invite member</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button>Invite evaluator</Button>
            <ul className="mt-3 space-y-1 text-sm">
              {members.map((m) => <li key={m.id}>{m.email} · {m.role}</li>)}
            </ul>
          </form>
          <div className="rounded-lg border bg-white p-4 text-sm">
            <p>Features inventory: {features}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => void exportJson()}>Export JSON</Button>
              <Button type="button" variant="outline" onClick={() => void pingWebhook()}>Ping webhook</Button>
            </div>
            <p className="mt-3">Guide: <Link href={GUIDE_PATH} className="underline text-[var(--ae-teal)]">{GUIDE_PATH}</Link></p>
          </div>
        </div>
      </div>
      {msg ? <p className="mt-4 text-[var(--ae-teal)]">{msg}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Audit trail</h2>
        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
          {audits.map((a) => (
            <li key={a.id} className="rounded border bg-white px-3 py-2">{a.at} · {a.actor} · {a.action} — {a.detail}</li>
          ))}
        </ul>
      </section>
    </StudioShell>
  );
}

export default SettingsPage;
`);

console.log("remaining surfaces written");
