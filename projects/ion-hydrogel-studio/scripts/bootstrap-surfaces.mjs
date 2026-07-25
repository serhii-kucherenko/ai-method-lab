/**
 * Bootstrap Ion Hydrogel Studio surfaces (APIs + pages).
 * Run: node scripts/bootstrap-surfaces.mjs
 */
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = join(root, "src/app");

function write(rel, body) {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body);
  console.log("wrote", rel);
}

// Clean mistaken duplicate UI at components/ root (keep ui/)
for (const f of [
  "badge.tsx",
  "button.tsx",
  "card.tsx",
  "input.tsx",
  "label.tsx",
  "separator.tsx",
  "table.tsx",
  "tabs.tsx",
]) {
  const p = join(root, "src/components", f);
  if (existsSync(p)) rmSync(p);
}

const entityPages = [
  {
    route: "packs",
    title: "Gel packs",
    subtitle:
      "Version the hydrogel ion-transport context before comparing dynamic charge regulation vs fixed-charge baselines.",
    entity: "Gel pack",
    fields: [
      { id: "label", label: "Label", state: "label", init: '""' },
      { id: "version", label: "Version", state: "version", init: '"1.0"' },
      {
        id: "electrolyteFocus",
        label: "Electrolyte focus",
        state: "electrolyteFocus",
        init: '""',
      },
    ],
    createBody: "{ label, version, electrolyteFocus }",
  },
  {
    route: "gels",
    title: "Gel networks",
    subtitle:
      "Capture weak polyelectrolyte / ampholytic network soft-sim floors.",
    entity: "Gel",
    fields: [
      { id: "label", label: "Label", state: "label", init: '""' },
      {
        id: "networkHint",
        label: "Network hint",
        state: "networkHint",
        init: '""',
      },
      {
        id: "permeabilityFloor",
        label: "Permeability floor",
        state: "permeabilityFloor",
        init: '"0.4"',
      },
    ],
    createBody:
      '{ packId: "pack-demo", label, kind: "weak_polyelectrolyte", networkHint, permeabilityFloor: Number(permeabilityFloor), crosslinkDensity: 0.4 }',
  },
  {
    route: "charges",
    title: "Charge regulation",
    subtitle:
      "Define dynamic charge regulation windows, pKa spans, and floors.",
    entity: "Charge",
    fields: [
      { id: "label", label: "Label", state: "label", init: '""' },
      {
        id: "regulationHint",
        label: "Regulation hint",
        state: "regulationHint",
        init: '""',
      },
      {
        id: "regulationFloor",
        label: "Regulation floor",
        state: "regulationFloor",
        init: '"0.4"',
      },
    ],
    createBody:
      '{ packId: "pack-demo", label, kind: "dynamic_regulation", regulationHint, pKaWindow: 4.5, regulationFloor: Number(regulationFloor) }',
  },
  {
    route: "salts",
    title: "Salt runs",
    subtitle:
      "Configure salt / ionic-strength soft-sim drafts for ion mobility.",
    entity: "Salt",
    fields: [
      { id: "label", label: "Label", state: "label", init: '""' },
      { id: "saltHint", label: "Salt hint", state: "saltHint", init: '""' },
      {
        id: "mobilityFloor",
        label: "Mobility floor",
        state: "mobilityFloor",
        init: '"0.4"',
      },
    ],
    createBody:
      '{ packId: "pack-demo", label, kind: "monovalent_nacl", saltHint, ionicStrengthFloor: 0.35, mobilityFloor: Number(mobilityFloor) }',
  },
];

for (const p of entityPages) {
  const states = p.fields
    .map(
      (f) =>
        `  const [${f.state}, set${f.state[0].toUpperCase()}${f.state.slice(1)}] = useState(${f.init});`,
    )
    .join("\n");
  const formFields = p.fields
    .map(
      (f) => `          <Label htmlFor="${f.id}">${f.label}</Label>
          <Input id="${f.id}" value={${f.state}} onChange={(e) => set${f.state[0].toUpperCase()}${f.state.slice(1)}(e.target.value)} required />`,
    )
    .join("\n");
  write(
    `src/app/${p.route}/page.tsx`,
    `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; [k: string]: string | number };

export function ${p.route[0].toUpperCase()}${p.route.slice(1)}Page() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
${states}

  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(\`/api/${p.route}?q=\${encodeURIComponent(query)}\`)).items,
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
      await api("/api/${p.route}", {
        method: "POST",
        body: JSON.stringify(${p.createBody}),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("/api/${p.route}", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="${p.title}" subtitle="${p.subtitle}">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
${formFields}
          <Button>Create</Button>
        </form>
        <section>
          <div className="mb-4 flex gap-2">
            <Input aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" onClick={() => void load()}>Search</Button>
          </div>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <ul className="space-y-3">
            {items.map((row) => (
              <li key={row.id} className="row-lift flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
                <div>
                  <p className="font-semibold">{row.label}</p>
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">${p.entity} · {row.status}</p>
                </div>
                <Button type="button" variant="outline" onClick={() => void archive(row.id)}>Archive</Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}

export default ${p.route[0].toUpperCase()}${p.route.slice(1)}Page;
`,
  );
}

const apiRoutes = {
  packs: `import { guard, json } from "@/lib/api";
import { archivePack, createPack, listPacks } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPacks({
      q: url.searchParams.get("q") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const pack = archivePack(body.id);
    if (!pack) return json({ error: "not_found" }, { status: 404 });
    return json({ pack });
  }
  const pack = createPack({
    label: body.label,
    version: body.version,
    electrolyteFocus: body.electrolyteFocus ?? body.assayFocus ?? "",
    sessionBudget: body.sessionBudget,
    notes: body.notes,
  });
  return json({ pack }, { status: 201 });
}
`,
  gels: `import { guard, json } from "@/lib/api";
import { archiveGel, createGel, listGels } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listGels({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const gel = archiveGel(body.id);
    if (!gel) return json({ error: "not_found" }, { status: 404 });
    return json({ gel });
  }
  const gel = createGel(body);
  if (!gel) return json({ error: "bad_refs" }, { status: 400 });
  return json({ gel }, { status: 201 });
}
`,
  charges: `import { guard, json } from "@/lib/api";
import { archiveCharge, createCharge, listCharges } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listCharges({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const charge = archiveCharge(body.id);
    if (!charge) return json({ error: "not_found" }, { status: 404 });
    return json({ charge });
  }
  const charge = createCharge(body);
  if (!charge) return json({ error: "bad_refs" }, { status: 400 });
  return json({ charge }, { status: 201 });
}
`,
  salts: `import { guard, json } from "@/lib/api";
import { archiveSalt, createSalt, listSalts } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSalts({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const salt = archiveSalt(body.id);
    if (!salt) return json({ error: "not_found" }, { status: 404 });
    return json({ salt });
  }
  const salt = createSalt(body);
  if (!salt) return json({ error: "bad_refs" }, { status: 400 });
  return json({ salt }, { status: 201 });
}
`,
  assays: `import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      gelId: url.searchParams.get("gelId") ?? undefined,
      chargeId: url.searchParams.get("chargeId") ?? undefined,
      saltId: url.searchParams.get("saltId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createAssayRun({
    packId: body.packId ?? "pack-demo",
    gelId: body.gelId ?? "gel-demo",
    chargeId: body.chargeId ?? "charge-demo",
    saltId: body.saltId ?? "salt-demo",
    chargeRegulation: Number(body.chargeRegulation ?? 0.6),
    ionMobility: Number(body.ionMobility ?? 0.65),
    gelPermeability: Number(body.gelPermeability ?? 0.7),
    swellingRatio: Number(body.swellingRatio ?? 0.65),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
`,
  compare: `import { guard, json } from "@/lib/api";
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
    name: body.name ?? "Seed hydrogel compare",
    packId: body.packId ?? "pack-demo",
    gelId: body.gelId ?? "gel-demo",
    chargeId: body.chargeId ?? "charge-demo",
    saltId: body.saltId ?? "salt-demo",
    assayRunId: body.assayRunId ?? "assay-demo",
    chargeBias: body.chargeBias ?? body.bias,
    fixedChargeDensity: body.fixedChargeDensity,
    saltLoad: body.saltLoad,
    bindingStrength: body.bindingStrength,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
`,
  scoreboard: `import { guard, json } from "@/lib/api";
import { getScoreboard } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: getScoreboard() });
}
`,
  settings: `import { guard, json } from "@/lib/api";
import { getOrg, updateOrg } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ org: getOrg() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  return json({ org: updateOrg(body) });
}
`,
  members: `import { guard, json } from "@/lib/api";
import { inviteMember, listMembers } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listMembers() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (!body.email) return json({ error: "email_required" }, { status: 400 });
  return json(
    { member: inviteMember(body.email, body.role ?? "viewer") },
    { status: 201 },
  );
}
`,
  audit: `import { guard, json } from "@/lib/api";
import { listAudits } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json({ items: listAudits(Number(url.searchParams.get("limit") ?? 50)) });
}
`,
  export: `import { guard, json } from "@/lib/api";
import { exportComparesCsv, exportPacksJson } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";
  if (format === "csv") {
    return new Response(exportComparesCsv(), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="compares.csv"',
      },
    });
  }
  return new Response(exportPacksJson(), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="packs.json"',
    },
  });
}
`,
  webhook: `import { json } from "@/lib/api";
import { ingestWebhook } from "@/store";

export async function POST(req: Request) {
  const body = await req.json();
  const key =
    req.headers.get("idempotency-key") ??
    body.idempotencyKey ??
    crypto.randomUUID();
  const signature = req.headers.get("x-signature");
  const result = ingestWebhook(key, body, signature);
  if (!result.ok) return json(result, { status: 401 });
  return json(result, { status: result.duplicate ? 200 : 201 });
}
`,
  features: `import { guard, json } from "@/lib/api";
import { featureInventory } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: featureInventory() });
}
`,
  "goldens-sample": `import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: GOLDENS.slice(0, 5), total: GOLDENS.length });
}
`,
};

for (const [name, body] of Object.entries(apiRoutes)) {
  write(`src/app/api/${name}/route.ts`, body);
}

console.log("bootstrap surfaces done");
