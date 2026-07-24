"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type {
  InferStage,
  InferStageKind,
  LegacyDevice,
  StageStatus,
} from "@/store";

const KINDS: InferStageKind[] = [
  "vision_encode",
  "token_merge",
  "prefill",
  "decode",
];
const STATUSES: StageStatus[] = ["draft", "gated", "passed", "failed"];

export default function StagesPage() {
  const [devices, setDevices] = useState<LegacyDevice[]>([]);
  const [items, setItems] = useState<InferStage[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<InferStageKind>("prefill");
  const [status, setStatus] = useState<StageStatus>("gated");
  const [agreement, setAgreement] = useState("0.85");
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [devs, stages] = await Promise.all([
      api<{ items: LegacyDevice[] }>("/api/devices"),
      api<InferStage[]>(
        `/api/stages?deviceId=${encodeURIComponent(deviceId)}&q=${encodeURIComponent(q)}`,
      ),
    ]);
    setDevices(devs.items);
    if (!deviceId && devs.items[0]) setDeviceId(devs.items[0].id);
    setItems(stages);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/stages", {
        method: "POST",
        body: JSON.stringify({
          deviceId,
          name,
          kind,
          status,
          agreement: Number(agreement),
        }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Inference stages"
      subtitle="Gate each stage against reference agreement before claiming all-GPU fit."
    >
      <form
        onSubmit={onCreate}
        className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-white p-4 md:grid-cols-3"
      >
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          required
        >
          {devices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Stage name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={kind}
          onChange={(e) => setKind(e.target.value as InferStageKind)}
        >
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <select
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as StageStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Input
          placeholder="Agreement 0–1"
          value={agreement}
          onChange={(e) => setAgreement(e.target.value)}
        />
        <Button type="submit">Add stage</Button>
      </form>

      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Filter stages"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button type="button" variant="outline" onClick={() => load()}>
          Filter
        </Button>
      </div>

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className={`rounded-lg border border-[var(--studio-line)] bg-white px-4 py-3 ${
              s.status === "passed" ? "animate-stage-flash" : ""
            }`}
          >
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-[family-name:var(--font-display)] text-lg">
                {s.name}
              </p>
              <p className="text-xs uppercase text-slate-500">
                {s.kind} · {s.status}
              </p>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Agreement {(s.agreement * 100).toFixed(0)}% · {s.notes || "—"}
            </p>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
