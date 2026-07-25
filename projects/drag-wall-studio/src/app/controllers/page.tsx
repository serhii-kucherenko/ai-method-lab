"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Actuator = { id: string; label: string };
type Sensor = { id: string; label: string };
type Run = {
  id: string;
  sensorId: string;
  actuatorId: string;
  wallCoverage: number;
  sensorConfidence: number;
  channelConfidence: number;
  cueAgreement: number;
  reviewerNotes: string;
  status: string;
};

export default function ControllersPage() {
  const [actuators, setActuators] = useState<Actuator[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [sensorId, setSensorId] = useState("");
  const [actuatorId, setActuatorId] = useState("");
  const [wallCoverage, setWallCoverage] = useState("0.42");
  const [sensorConf, setSensorConf] = useState("0.7");
  const [channelConf, setChannelConf] = useState("0.74");
  const [agreement, setAgreement] = useState("0.68");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [a, s, r] = await Promise.all([
      api<{ items: Actuator[] }>("/api/actuators"),
      api<{ items: Sensor[] }>("/api/sensors"),
      api<{ items: Run[] }>("/api/controllers"),
    ]);
    setActuators(a.items);
    setSensors(s.items);
    setItems(r.items);
    if (!actuatorId && a.items[0]) setActuatorId(a.items[0].id);
    if (!sensorId && s.items[0]) setSensorId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/controllers", {
        method: "POST",
        body: JSON.stringify({
          sensorId,
          actuatorId,
          wallCoverage: Number(wallCoverage),
          sensorConfidence: Number(sensorConf),
          channelConfidence: Number(channelConf),
          cueAgreement: Number(agreement),
          reviewerNotes: notes,
        }),
      });
      setNotes("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Controller runs"
      subtitle="Record ES closed-loop soft-sim runs against a sensor layout and actuator plan."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="sensor">Sensor layout</Label>
          <select
            id="sensor"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
          >
            {sensors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="actuator">Actuator plan</Label>
          <select
            id="actuator"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={actuatorId}
            onChange={(e) => setActuatorId(e.target.value)}
          >
            {actuators.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="wall">Wall coverage</Label>
          <Input
            id="wall"
            value={wallCoverage}
            onChange={(e) => setWallCoverage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sensorConf">Sensor confidence</Label>
          <Input
            id="sensorConf"
            value={sensorConf}
            onChange={(e) => setSensorConf(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="channelConf">Channel confidence</Label>
          <Input
            id="channelConf"
            value={channelConf}
            onChange={(e) => setChannelConf(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="agreement">Cue agreement</Label>
          <Input
            id="agreement"
            value={agreement}
            onChange={(e) => setAgreement(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Reviewer notes</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={() => create()}>Create controller run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      {items.length === 0 ? (
        <p className="text-slate-500">No controller runs yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              tabIndex={0}
              className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 py-3"
            >
              <div className="font-medium text-slate-900">{r.id}</div>
              <div className="mt-1 text-sm text-slate-500">
                coverage {r.wallCoverage} · sensor {r.sensorConfidence} ·
                channel {r.channelConfidence} · agreement {r.cueAgreement}
              </div>
              {r.reviewerNotes ? (
                <p className="mt-1 text-sm text-slate-600">{r.reviewerNotes}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </StudioShell>
  );
}
