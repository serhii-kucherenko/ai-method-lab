"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Parser = {
  id: string;
  packId: string;
  label: string;
  kind: string;
  vendors: string;
  vendorCount: number;
  status: string;
};

type Pack = { id: string; label: string };

export default function ParsersPage() {
  const [items, setItems] = useState<Parser[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Optopol/Zeiss hybrid SNOMED gate");
  const [kind, setKind] = useState("hybrid");
  const [vendors, setVendors] = useState("optopol,zeiss,snomed");
  const [vendorCount, setVendorCount] = useState("3");
  const [error, setError] = useState("");

  async function load() {
    const [parsers, ps] = await Promise.all([
      api<{ items: Parser[] }>("/api/parsers"),
      api<{ items: Pack[] }>("/api/measures"),
    ]);
    setItems(parsers.items);
    setPacks(ps.items);
    if (!packId && ps.items[0]) setPackId(ps.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/parsers", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          kind,
          vendors,
          vendorCount: Number(vendorCount),
          coverageMin: 0.4,
          coverageMax: 0.9,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Parser configs"
      subtitle="Configure Optopol and Zeiss parsers with vendors and coverage spans."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Measure pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
          >
            {packs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="kind">Kind</Label>
          <select
            id="kind"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] px-3 py-2 text-sm"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            {["optopol", "zeiss", "hybrid", "snomed", "mixed"].map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="count">Vendor count</Label>
          <Input
            id="count"
            value={vendorCount}
            onChange={(e) => setVendorCount(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="vendors">Vendors</Label>
          <Input
            id="vendors"
            value={vendors}
            onChange={(e) => setVendors(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create parser</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{c.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {c.kind} · {c.vendorCount} vendors · {c.vendors} · {c.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
