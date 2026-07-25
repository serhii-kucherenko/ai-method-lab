"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Stream = {
  id: string;
  label: string;
  languagePair: string;
  signerPace: number;
  motionStability: number;
  occlusionNoise: number;
  status: string;
};

export default function StreamsPage() {
  const [items, setItems] = useState<Stream[]>([]);
  const [q, setQ] = useState("");
  const [languagePair, setLanguagePair] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (languagePair) params.set("languagePair", languagePair);
    const data = await api<{ items: Stream[] }>(`/api/streams?${params}`);
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/streams", {
        method: "POST",
        body: JSON.stringify({
          label: label || `Stream ${Date.now()}`,
          languagePair: languagePair || "ASL→EN",
          status: "live",
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
      title="Streams"
      subtitle="Sign stream registry. Search and filter by language pair."
    >
      <div className="mb-6 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-4">
        <div>
          <Label htmlFor="label">Stream label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lp">Language pair</Label>
          <Input
            id="lp"
            value={languagePair}
            onChange={(e) => setLanguagePair(e.target.value)}
            placeholder="ASL→EN"
          />
        </div>
        <div>
          <Label htmlFor="q">Search</Label>
          <Input
            id="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Label, language…"
          />
        </div>
        <div className="flex items-end gap-2">
          <Button onClick={create}>Create stream</Button>
          <Button
            variant="outline"
            onClick={() => load().catch((e) => setError(String(e)))}
          >
            Search
          </Button>
        </div>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No streams yet — create one or seed from onboarding.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--studio-line)] text-slate-500">
              <th className="py-2">Label</th>
              <th>Language</th>
              <th>Pace</th>
              <th>Stability</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b border-[var(--studio-line)]">
                <td className="py-2 font-medium">{s.label}</td>
                <td>{s.languagePair}</td>
                <td>{s.signerPace}</td>
                <td>{s.motionStability}</td>
                <td>{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </StudioShell>
  );
}
