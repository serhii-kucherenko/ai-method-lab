"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Threshold = {
  id: string;
  packId?: string;
  label: string;
  thresholdText: string;
  lockCondition: string;
  signalChannel: string;
  status: string;
};

export function ThresholdsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Threshold[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("District outbreak soft-sim threshold");
  const [thresholdText, setThresholdText] = useState(
    "Soft-sim AI-assisted escalation for public-health emergency signal.",
  );
  const [lockCondition, setLockCondition] = useState("lock_soft_sim");
  const [signalChannel, setSignalChannel] = useState("soft_sim_phe_signal");
  const [error, setError] = useState("");

  async function load() {
    const [p, s] = await Promise.all([
      api<{ items: Pack[] }>("/api/escalates"),
      api<{ items: Threshold[] }>(
        `/api/thresholds?q=${encodeURIComponent(q)}`,
      ),
    ]);
    setPacks(p.items);
    setItems(s.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/thresholds", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          thresholdText,
          lockCondition,
          signalChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/thresholds", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Thresholds"
      subtitle="Escalation thresholds and lock conditions for soft-sim pack decisions."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search thresholds"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Escalate pack</Label>
          <select
            id="pack"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
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
        <div className="md:col-span-2">
          <Label htmlFor="text">Threshold text</Label>
          <Input
            id="text"
            value={thresholdText}
            onChange={(e) => setThresholdText(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lock">Lock condition</Label>
          <Input
            id="lock"
            value={lockCondition}
            onChange={(e) => setLockCondition(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="channel">Signal channel</Label>
          <Input
            id="channel"
            value={signalChannel}
            onChange={(e) => setSignalChannel(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={create}>Create threshold</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-3">
        {items.map((t) => (
          <li
            key={t.id}
            className="row-lift flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <div className="font-medium">{t.label}</div>
              <p className="text-sm">
                {t.lockCondition} · {t.signalChannel} · {t.status}
              </p>
            </div>
            {t.status !== "archived" ? (
              <Button variant="outline" size="sm" onClick={() => archive(t.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ThresholdsPage;
