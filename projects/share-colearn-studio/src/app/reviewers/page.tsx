"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Reviewer = {
  id: string;
  label: string;
  specialtyText: string;
  lockCondition: string;
  reviewChannel: string;
  status: string;
};

export function ReviewersPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Reviewer[]>([]);
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("Rheumatology reviewer");
  const [specialtyText, setSpecialtyText] = useState(
    "Human–AI colearn soft-sim against disease activity labels.",
  );
  const [lockCondition, setLockCondition] = useState("lock_soft_sim");
  const [reviewChannel, setReviewChannel] = useState("soft_sim_colearn_signal");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [p, r] = await Promise.all([
      api<{ items: Pack[] }>("/api/colearns"),
      api<{ items: Reviewer[] }>(`/api/reviewers?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(r.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/reviewers", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          specialtyText,
          lockCondition,
          reviewChannel,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function archive(id: string) {
    await api("/api/reviewers", {
      method: "POST",
      body: JSON.stringify({ action: "archive", id }),
    });
    await load();
  }

  return (
    <StudioShell
      title="Reviewers"
      subtitle="Human reviewers for SHARE-style disease activity labeling soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Input
          className="max-w-xs"
          placeholder="Search reviewers"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="outline" onClick={() => load()}>
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Colearn pack</Label>
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
          <Label htmlFor="specialty">Specialty text</Label>
          <Input
            id="specialty"
            value={specialtyText}
            onChange={(e) => setSpecialtyText(e.target.value)}
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
          <Label htmlFor="channel">Review channel</Label>
          <Input
            id="channel"
            value={reviewChannel}
            onChange={(e) => setReviewChannel(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create}>Create reviewer</Button>
          {error ? (
            <p className="mt-2 text-sm text-[var(--sc-amber)]">{error}</p>
          ) : null}
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((row) => (
          <li
            key={row.id}
            className="row-lift flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div>
              <p className="font-medium">{row.label}</p>
              <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
                {row.specialtyText} · {row.lockCondition} · {row.status}
              </p>
            </div>
            {row.status !== "archived" ? (
              <Button variant="outline" onClick={() => archive(row.id)}>
                Archive
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default ReviewersPage;
