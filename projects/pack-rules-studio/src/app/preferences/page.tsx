"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { SoftPreference, TravelerProfile } from "@/store";

export default function PreferencesPage() {
  const [profiles, setProfiles] = useState<TravelerProfile[]>([]);
  const [prefs, setPrefs] = useState<SoftPreference[]>([]);
  const [profileId, setProfileId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("clothing");
  const [weight, setWeight] = useState("0.6");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const [p, pr] = await Promise.all([
        api<{ items: TravelerProfile[] }>("/api/profiles"),
        api<{ items: SoftPreference[] }>("/api/preferences"),
      ]);
      setProfiles(p.items);
      setPrefs(pr.items);
      if (!profileId && p.items[0]) setProfileId(p.items[0].id);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      await api("/api/preferences", {
        method: "POST",
        body: JSON.stringify({
          profileId,
          name,
          category,
          weight: Number(weight),
        }),
      });
      setName("");
      load();
    });
  }

  return (
    <StudioShell
      title="Soft preferences"
      subtitle="Personal tastes that personalize packing inside the hard-rule envelope."
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
          <Label>Category</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <Label>Preference</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Weight (0–1)</Label>
          <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Button onClick={create} disabled={pending || !name || !profileId}>
            Add preference
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {prefs.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3"
          >
            <p className="font-medium text-slate-900">{p.name}</p>
            <p className="text-sm text-slate-500">
              {p.category} · weight {p.weight}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
