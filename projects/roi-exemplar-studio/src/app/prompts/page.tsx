"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/client-api";

type Pack = { id: string; label: string };
type Prompt = {
  id: string;
  packId?: string;
  label: string;
  promptText: string;
  successCondition: string;
  taskChannel: string;
  status: string;
};

export default function PromptsPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [items, setItems] = useState<Prompt[]>([]);
  const [q, setQ] = useState("");
  const [packId, setPackId] = useState("");
  const [label, setLabel] = useState("In-context ROI selection prompt");
  const [promptText, setPromptText] = useState(
    "Given curated exemplars, select the region of interest that matches the lesion morphology.",
  );
  const [successCondition, setSuccessCondition] = useState("lock_soft_sim");
  const [error, setError] = useState("");

  async function load() {
    const [p, prompts] = await Promise.all([
      api<{ items: Pack[] }>("/api/exemplars"),
      api<{ items: Prompt[] }>(`/api/prompts?q=${encodeURIComponent(q)}`),
    ]);
    setPacks(p.items);
    setItems(prompts.items);
    if (!packId && p.items[0]) setPackId(p.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/prompts", {
        method: "POST",
        body: JSON.stringify({
          packId,
          label,
          promptText,
          successCondition,
          taskChannel: "soft_sim_roi_vlm",
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Prompt sets"
      subtitle="In-context instruction packs that steer VLM ROI selection — soft-sim only."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search prompts"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          onClick={() => load().catch((e) => setError(String(e)))}
        >
          Search
        </Button>
      </div>
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="pack">Exemplar pack</Label>
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
          <Label htmlFor="prompt">Prompt text</Label>
          <Textarea
            id="prompt"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="success">Success condition</Label>
          <select
            id="success"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={successCondition}
            onChange={(e) => setSuccessCondition(e.target.value)}
          >
            <option value="hold_pack">hold_pack</option>
            <option value="review">review</option>
            <option value="lock_soft_sim">lock_soft_sim</option>
            <option value="strong_lock">strong_lock</option>
          </select>
        </div>
        <div>
          <Button onClick={create}>Create prompt set</Button>
        </div>
      </div>
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      <ul className="space-y-2">
        {items.map((p) => (
          <li
            key={p.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
          >
            <div className="font-medium">{p.label}</div>
            <div className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {p.successCondition} · {p.taskChannel} · {p.status}
            </div>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {p.promptText}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
