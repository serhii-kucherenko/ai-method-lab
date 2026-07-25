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
  "src/app/diffraction/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CrystalPack, DiffractionLane } from "@/store";

export default function DiffractionPage() {
  const [items, setItems] = useState<DiffractionLane[]>([]);
  const [packs, setPacks] = useState<CrystalPack[]>([]);
  const [packId, setPackId] = useState("");
  const [name, setName] = useState("");
  const [matchScore, setMatchScore] = useState("0.72");
  const [peakRichness, setPeakRichness] = useState("0.66");
  const [error, setError] = useState("");

  async function load() {
    const [lane, packRes] = await Promise.all([
      api<{ items: DiffractionLane[] }>("/api/diffraction"),
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
      await api("/api/diffraction", {
        method: "POST",
        body: JSON.stringify({
          packId,
          name,
          matchScore: Number(matchScore),
          peakRichness: Number(peakRichness),
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
      title="Diffraction lane"
      subtitle="Powder-diffraction fingerprint soft-sim for each crystal pack."
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
        <Input placeholder="Lane name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Match 0-1" value={matchScore} onChange={(e) => setMatchScore(e.target.value)} />
        <Input placeholder="Peak richness" value={peakRichness} onChange={(e) => setPeakRichness(e.target.value)} />
        <Button type="submit">Add diffraction</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li key={row.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">{row.name}</span>
              <span className="text-xs text-slate-500">pack {row.packId.slice(0, 8)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Match {row.matchScore} · peaks {row.peakRichness}
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
  "src/app/dos/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { CrystalPack, DosLane } from "@/store";

export default function DosPage() {
  const [items, setItems] = useState<DosLane[]>([]);
  const [packs, setPacks] = useState<CrystalPack[]>([]);
  const [packId, setPackId] = useState("");
  const [name, setName] = useState("");
  const [alignment, setAlignment] = useState("0.7");
  const [bandGap, setBandGap] = useState("2.8");
  const [error, setError] = useState("");

  async function load() {
    const [lane, packRes] = await Promise.all([
      api<{ items: DosLane[] }>("/api/dos"),
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
      await api("/api/dos", {
        method: "POST",
        body: JSON.stringify({
          packId,
          name,
          alignment: Number(alignment),
          bandGapProxy: Number(bandGap),
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
      title="DOS lane"
      subtitle="Electronic density-of-states alignment soft-sim for each pack."
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
        <Input placeholder="Lane name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Alignment 0-1" value={alignment} onChange={(e) => setAlignment(e.target.value)} />
        <Input placeholder="Band gap proxy" value={bandGap} onChange={(e) => setBandGap(e.target.value)} />
        <Button type="submit">Add DOS</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li key={row.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">{row.name}</span>
              <span className="text-xs text-slate-500">pack {row.packId.slice(0, 8)}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Alignment {row.alignment} · Eg≈ {row.bandGapProxy}
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
  "src/app/language/page.tsx",
  `"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/client-api";
import type { CrystalPack, LanguageLane } from "@/store";

export default function LanguagePage() {
  const [items, setItems] = useState<LanguageLane[]>([]);
  const [packs, setPacks] = useState<CrystalPack[]>([]);
  const [packId, setPackId] = useState("");
  const [name, setName] = useState("");
  const [clarity, setClarity] = useState("0.74");
  const [descriptorText, setDescriptorText] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [lane, packRes] = await Promise.all([
      api<{ items: LanguageLane[] }>("/api/language"),
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
      await api("/api/language", {
        method: "POST",
        body: JSON.stringify({
          packId,
          name,
          clarity: Number(clarity),
          descriptorText,
        }),
      });
      setName("");
      setDescriptorText("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Language lane"
      subtitle="Written-spec and natural-language descriptors for crystal packs."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2"
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
        <Input placeholder="Lane name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Clarity 0-1" value={clarity} onChange={(e) => setClarity(e.target.value)} />
        <Textarea
          placeholder="Descriptor text"
          value={descriptorText}
          onChange={(e) => setDescriptorText(e.target.value)}
        />
        <Button type="submit">Add language</Button>
      </form>
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((row) => (
          <li key={row.id} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-[family-name:var(--font-display)] text-lg">{row.name}</span>
              <span className="text-xs text-slate-500">clarity {row.clarity}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{row.descriptorText || row.notes}</p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
`,
);

console.log("lanes ok");
