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
  "src/components/studio-shell.tsx",
  `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DISPLAY_NAME } from "@/claim";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/packs", label: "Packs" },
  { href: "/structure", label: "Structure" },
  { href: "/diffraction", label: "Diffraction" },
  { href: "/dos", label: "DOS" },
  { href: "/language", label: "Language" },
  { href: "/bind", label: "Bind" },
  { href: "/retrieve", label: "Retrieve" },
  { href: "/settings", label: "Settings" },
  { href: "/honesty", label: "Honesty" },
] as const;

export function StudioShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <header className="border-b border-[var(--studio-line)] bg-[color-mix(in_srgb,var(--studio-panel)_92%,transparent)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--studio-teal)]"
          >
            {DISPLAY_NAME}
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(\`\${item.href}/\`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 transition-colors",
                    active
                      ? "bg-[var(--studio-teal-soft)] text-[var(--studio-ink-deep)]"
                      : "text-slate-500 hover:bg-slate-200 hover:text-slate-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  );
}
`,
);

function lanePage({
  title,
  subtitle,
  api,
  typeName,
  fields,
  createFields,
}) {
  return `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { ${typeName}, CrystalPack } from "@/store";

export default function Page() {
  const [items, setItems] = useState<${typeName}[]>([]);
  const [packs, setPacks] = useState<CrystalPack[]>([]);
  const [packId, setPackId] = useState("");
  const [name, setName] = useState("");
${createFields.stateDefs}
  const [error, setError] = useState("");

  async function load() {
    const [lane, packRes] = await Promise.all([
      api<{ items: ${typeName}[] }>("${api}"),
      api<{ items: CrystalPack[] }>("/api/packs"),
    ]);
    setItems(lane.items);
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
      await api("${api}", {
        method: "POST",
        body: JSON.stringify({
          packId,
          name,
${createFields.body}
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell title="${title}" subtitle="${subtitle}">
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
        <Input
          placeholder="Lane name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
${createFields.inputs}
        <Button type="submit">Add lane</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {row.name}
              </span>
              <span className="text-xs text-slate-500">pack {row.packId.slice(0, 8)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">${fields}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`;
}

w(
  "src/app/structure/page.tsx",
  lanePage({
    title: "Structure lane",
    subtitle: "Atomic / lattice fidelity descriptors for each crystal pack.",
    api: "/api/structure",
    typeName: "StructureLane",
    fields: "Fidelity {row.fidelity} · atoms {row.atomCountProxy}",
    createFields: {
      stateDefs: `  const [fidelity, setFidelity] = useState("0.75");
  const [atoms, setAtoms] = useState("10");`,
      body: `          fidelity: Number(fidelity),
          atomCountProxy: Number(atoms),`,
      inputs: `        <Input placeholder="Fidelity 0-1" value={fidelity} onChange={(e) => setFidelity(e.target.value)} />
        <Input placeholder="Atom count proxy" value={atoms} onChange={(e) => setAtoms(e.target.value)} />`,
    },
  }).replace(
    "Fidelity {row.fidelity} · atoms {row.atomCountProxy}",
    "Fidelity {row.fidelity} · atoms {row.atomCountProxy}",
  ),
);

// Fix structure page fields to use JSX expression properly
w(
  "src/app/structure/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CrystalPack, StructureLane } from "@/store";

export default function StructurePage() {
  const [items, setItems] = useState<StructureLane[]>([]);
  const [packs, setPacks] = useState<CrystalPack[]>([]);
  const [packId, setPackId] = useState("");
  const [name, setName] = useState("");
  const [fidelity, setFidelity] = useState("0.75");
  const [atoms, setAtoms] = useState("10");
  const [error, setError] = useState("");

  async function load() {
    const [lane, packRes] = await Promise.all([
      api<{ items: StructureLane[] }>("/api/structure"),
      api<{ items: CrystalPack[] }>("/api/packs"),
    ]);
    setItems(lane.items);
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
      await api("/api/structure", {
        method: "POST",
        body: JSON.stringify({
          packId,
          name,
          fidelity: Number(fidelity),
          atomCountProxy: Number(atoms),
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
      title="Structure lane"
      subtitle="Atomic / lattice fidelity descriptors for each crystal pack."
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
        <Input
          placeholder="Lane name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Fidelity 0-1"
          value={fidelity}
          onChange={(e) => setFidelity(e.target.value)}
        />
        <Input
          placeholder="Atom count proxy"
          value={atoms}
          onChange={(e) => setAtoms(e.target.value)}
        />
        <Button type="submit">Add structure</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">
                {row.name}
              </span>
              <span className="text-xs text-slate-500">
                pack {row.packId.slice(0, 8)}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Fidelity {row.fidelity} · atoms {row.atomCountProxy}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

console.log("shell+structure ok");
