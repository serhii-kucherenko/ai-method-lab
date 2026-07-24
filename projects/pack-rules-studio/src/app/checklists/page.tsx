"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { PackChecklist, TravelerProfile } from "@/store";

export default function ChecklistsPage() {
  const [profiles, setProfiles] = useState<TravelerProfile[]>([]);
  const [items, setItems] = useState<PackChecklist[]>([]);
  const [profileId, setProfileId] = useState("");
  const [name, setName] = useState("");
  const [itemCount, setItemCount] = useState("24");
  const [exportJson, setExportJson] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [p, c] = await Promise.all([
        api<{ items: TravelerProfile[] }>("/api/profiles"),
        api<{ items: PackChecklist[] }>("/api/checklists"),
      ]);
      setProfiles(p.items);
      setItems(c.items);
      if (!profileId && p.items[0]) setProfileId(p.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/checklists", {
        method: "POST",
        body: JSON.stringify({
          profileId,
          name,
          status: "ready",
          itemCount: Number(itemCount),
        }),
      });
      setName("");
      load();
    });
  }

  function doExport() {
    start(async () => {
      const text = await api<string>(
        `/api/export/checklists?profileId=${encodeURIComponent(profileId)}`,
      );
      setExportJson(text);
    });
  }

  return (
    <StudioShell
      title="Packing checklists"
      subtitle="Generate rule-compliant packing lists for each traveler profile."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-2">
        <div>
          <Label>Profile</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Item count</Label>
          <Input
            value={itemCount}
            onChange={(e) => setItemCount(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Checklist name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2 md:col-span-2">
          <Button onClick={create} disabled={pending || !name || !profileId}>
            Generate checklist
          </Button>
          <Button variant="outline" onClick={doExport} disabled={!profileId}>
            Export JSON
          </Button>
        </div>
      </div>

      {exportJson ? (
        <pre className="mb-6 max-h-48 overflow-auto rounded-lg border bg-slate-50 p-3 text-xs">
          {exportJson}
        </pre>
      ) : null}

      <ul className="space-y-3">
        {items.map((c) => (
          <li
            key={c.id}
            className="animate-checklist-reveal rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{c.name}</p>
            <p className="text-sm text-slate-500">
              {c.status} · {c.itemCount} items
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
