"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Contact = {
  id: string;
  packId: string;
  label: string;
  contactPoints: string[];
  contactCoverage: number;
  tactilePriority: number;
  status: string;
};

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("");
  const [contactPoints, setContactPoints] = useState("fingertip,palm");
  const [contactCoverage, setContactCoverage] = useState(0.4);
  const [tactilePriority, setTactilePriority] = useState(0.65);
  const [error, setError] = useState("");

  async function load() {
    const data = await api<{ items: Contact[] }>("/api/contacts");
    setItems(data.items);
  }

  useEffect(() => {
    api<{ items: Pack[] }>("/api/packs")
      .then((d) => {
        setPacks(d.items);
        if (d.items[0]) setPackId(d.items[0].id);
      })
      .catch(() => undefined);
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    if (!packId) {
      setError("Select a manipulator pack first");
      return;
    }
    try {
      await api("/api/contacts", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label: label || "Untitled contact definition",
          contactPoints: contactPoints
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          contactCoverage,
          tactilePriority,
        }),
      });
      setLabel("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Contact points"
      subtitle="Declare intended arm contact and tactile priority."
    >
      {packs.length === 0 ? (
        <p className="mb-4 text-slate-500">
          Need a manipulator pack — create one on Manipulators first.
        </p>
      ) : null}
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="pack">Manipulator pack</Label>
          <select
            id="pack"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
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
          <Label htmlFor="label">Contact definition</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="features">Contact points (comma-separated)</Label>
          <Input
            id="features"
            value={contactPoints}
            onChange={(e) => setContactPoints(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="coverage">Contact coverage</Label>
          <Input
            id="coverage"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={contactCoverage}
            onChange={(e) => setContactCoverage(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="salience">Tactile priority</Label>
          <Input
            id="salience"
            type="number"
            step="0.05"
            min={0}
            max={1}
            value={tactilePriority}
            onChange={(e) => setTactilePriority(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create contact definition</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No contact definitions yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((m) => (
            <li
              key={m.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{m.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                {m.contactPoints.join(", ")} · coverage {m.contactCoverage} ·
                tactile {m.tactilePriority} · {m.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
