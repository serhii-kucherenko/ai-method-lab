"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/client-api";

type Conversation = {
  id: string;
  label: string;
  clinicalContent: string;
  goldUrgency: string;
  specialty: string;
  status: string;
};

export default function ConversationsPage() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [clinicalContent, setClinicalContent] = useState("");
  const [goldUrgency, setGoldUrgency] = useState("urgent");
  const [specialty, setSpecialty] = useState("urgent_care");
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Conversation[] }>(
      `/api/conversations?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/conversations", {
        method: "POST",
        body: JSON.stringify({
          packId: "pack-demo",
          label: label || "Untitled conversation",
          clinicalContent:
            clinicalContent || "Patient describes symptoms with hedging.",
          goldUrgency,
          specialty,
        }),
      });
      setLabel("");
      setClinicalContent("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Conversations"
      subtitle="Conversation cases with gold urgency for style-aware triage."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search content or specialty"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load(q).catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="specialty">Specialty</Label>
          <Input
            id="specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="urgency">Gold urgency</Label>
          <select
            id="urgency"
            className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
            value={goldUrgency}
            onChange={(e) => setGoldUrgency(e.target.value)}
          >
            <option value="self_care">self_care</option>
            <option value="primary_care">primary_care</option>
            <option value="urgent">urgent</option>
            <option value="emergency">emergency</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="content">Clinical content</Label>
          <Textarea
            id="content"
            value={clinicalContent}
            onChange={(e) => setClinicalContent(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <Button onClick={() => create()}>Add conversation case</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-[var(--studio-coral)]">{error}</p> : null}
      {items.length === 0 ? (
        <p className="text-slate-500">
          Need a pack selected — create the first conversation case above.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li
              key={c.id}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{c.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                {c.goldUrgency} · {c.specialty} · {c.status}
              </div>
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                {c.clinicalContent}
              </p>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
