"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Pack = {
  id: string;
  label: string;
  version: string;
  channelModel: string;
  actuatorCount: number;
  status: string;
};

export default function ChannelsPage() {
  const [items, setItems] = useState<Pack[]>([]);
  const [q, setQ] = useState("");
  const [label, setLabel] = useState("");
  const [version, setVersion] = useState("1.0");
  const [channelModel, setChannelModel] = useState(
    "periodic half-channel Re_tau 180",
  );
  const [error, setError] = useState("");

  async function load(query = q) {
    const data = await api<{ items: Pack[] }>(
      `/api/packs?q=${encodeURIComponent(query)}`,
    );
    setItems(data.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/packs", {
        method: "POST",
        body: JSON.stringify({
          label: label || "Untitled channel pack",
          version,
          channelModel,
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
      title="Channel packs"
      subtitle="Versioned channel geometry and Reynolds assumptions for drag soft-sim."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          placeholder="Search pack or channel model"
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
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-3">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="channelModel">Channel model</Label>
          <Input
            id="channelModel"
            value={channelModel}
            onChange={(e) => setChannelModel(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create channel pack</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">
          No channel packs yet — create the first pack above.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((p) => (
            <li
              key={p.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{p.label}</div>
              <div className="mt-1 text-sm text-slate-500">
                v{p.version} · {p.channelModel} · {p.actuatorCount} actuator
                zones · {p.status}
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
