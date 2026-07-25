import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const w = (rel, content) => {
  const p = join(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content, "utf8");
  console.log("wrote", rel);
};

function entityPage({
  title,
  subtitle,
  apiPath,
  createFields,
  kindDefault,
  extraBody,
  rowMeta,
}) {
  const fieldState = createFields
    .map((f) => `  const [${f.name}, set${f.Name}] = useState(${f.init});`)
    .join("\n");
  const fieldInputs = createFields
    .map(
      (f) => `          <Label htmlFor="${f.name}">${f.label}</Label>
          <Input id="${f.name}" value={${f.name}} onChange={(e) => set${f.Name}(e.target.value)} ${f.required ? "required" : ""} />`,
    )
    .join("\n");
  const bodyParts = createFields
    .map((f) =>
      f.number
        ? `${f.name}: Number(${f.name})`
        : `${f.name}`,
    )
    .join(",\n          ");

  return `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; [k: string]: string | number };

export function ${title.replace(/\s/g, "")}Page() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
${fieldState}
${extraBody ?? ""}

  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(\`${apiPath}?q=\${encodeURIComponent(query)}\`)).items,
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
      await api("${apiPath}", {
        method: "POST",
        body: JSON.stringify({
          ${bodyParts}${kindDefault ? `,\n          kind: "${kindDefault}"` : ""},
          packId: "pack-demo",
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create");
    }
  };

  const archive = async (id: string) => {
    await api("${apiPath}", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  };

  return (
    <StudioShell title="${title}" subtitle="${subtitle}">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
${fieldInputs}
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
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">${rowMeta} · {row.status}</p>
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

export default ${title.replace(/\s/g, "")}Page;
`;
}

w(
  "src/app/packs/page.tsx",
  `"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Row = { id: string; label: string; status: string; [k: string]: string | number };

export function PacksPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [assayFocus, setAssayFocus] = useState("");
  const [error, setError] = useState("");

  const load = async (query = q) => {
    try {
      setItems(
        (await api<{ items: Row[] }>(\`/api/packs?q=\${encodeURIComponent(query)}\`)).items,
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
        body: JSON.stringify({ label, version, assayFocus }),
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
    <StudioShell title="Library packs" subtitle="Version the DNA-encoded library context before comparing iterative DELT vs single-pass screens.">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
          <Label htmlFor="version">Version</Label>
          <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} required />
          <Label htmlFor="assayFocus">Assay focus</Label>
          <Input id="assayFocus" value={assayFocus} onChange={(e) => setAssayFocus(e.target.value)} required />
          <Button>Create pack</Button>
          <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">Seed pack-demo ships for compare demos.</p>
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
                  <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">Library pack · {row.status}</p>
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

export default PacksPage;
`,
);

w(
  "src/app/libraries/page.tsx",
  entityPage({
    title: "Libraries",
    subtitle:
      "Register DNA-encoded library scaffolds and diversity floors for soft-sim.",
    apiPath: "/api/libraries",
    kindDefault: "macrocyclic",
    rowMeta: "Encoded library",
    createFields: [
      { name: "label", Name: "Label", label: "Label", init: '""', required: true },
      {
        name: "scaffoldHint",
        Name: "ScaffoldHint",
        label: "Scaffold hint",
        init: '"macrocycle,dna-tag"',
        required: true,
      },
      {
        name: "memberCount",
        Name: "MemberCount",
        label: "Member count",
        init: '"10000"',
        required: true,
        number: true,
      },
      {
        name: "diversityFloor",
        Name: "DiversityFloor",
        label: "Diversity floor",
        init: '"0.35"',
        required: true,
        number: true,
      },
    ],
  }),
);

w(
  "src/app/cycles/page.tsx",
  entityPage({
    title: "Construct cycles",
    subtitle:
      "Configure iterative construct–screen rounds before you score enrichment.",
    apiPath: "/api/cycles",
    kindDefault: "construct_screen",
    rowMeta: "Construct cycle",
    createFields: [
      { name: "label", Name: "Label", label: "Label", init: '""', required: true },
      {
        name: "cycleHint",
        Name: "CycleHint",
        label: "Cycle hint",
        init: '"construct,screen,enrich"',
        required: true,
      },
      {
        name: "roundCount",
        Name: "RoundCount",
        label: "Round count",
        init: '"3"',
        required: true,
        number: true,
      },
      {
        name: "enrichmentFloor",
        Name: "EnrichmentFloor",
        label: "Enrichment floor",
        init: '"0.4"',
        required: true,
        number: true,
      },
    ],
  }),
);

w(
  "src/app/hits/page.tsx",
  entityPage({
    title: "Hit shortlists",
    subtitle:
      "Filter hit shortlists with precision floors — soft-sim only, not clinical nomination.",
    apiPath: "/api/hits",
    kindDefault: "macrocycle_fit",
    rowMeta: "Hit shortlist",
    createFields: [
      { name: "label", Name: "Label", label: "Label", init: '""', required: true },
      {
        name: "filterHint",
        Name: "FilterHint",
        label: "Filter hint",
        init: '"enrichment,diversity"',
        required: true,
      },
      {
        name: "hitCount",
        Name: "HitCount",
        label: "Hit count",
        init: '"48"',
        required: true,
        number: true,
      },
      {
        name: "precisionFloor",
        Name: "PrecisionFloor",
        label: "Precision floor",
        init: '"0.35"',
        required: true,
        number: true,
      },
    ],
  }),
);

console.log("entity pages done");
