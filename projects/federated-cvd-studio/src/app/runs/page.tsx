"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Entity = { id: string; label?: string };
type Run = {
  id: string;
  siteParticipation: number;
  featureConfidence: number;
  schemaConfidence: number;
  federationAgreement: number;
  status: string;
};

export default function RunsPage() {
  const [federations, setFederations] = useState<Entity[]>([]);
  const [schemas, setSchemas] = useState<Entity[]>([]);
  const [items, setItems] = useState<Run[]>([]);
  const [federationId, setFederationId] = useState("");
  const [schemaId, setSchemaId] = useState("");
  const [siteParticipation, setSiteParticipation] = useState("0.6");
  const [featureConfidence, setFeatureConfidence] = useState("0.7");
  const [schemaConfidence, setSchemaConfidence] = useState("0.72");
  const [federationAgreement, setFederationAgreement] = useState("0.65");
  const [error, setError] = useState("");

  async function load() {
    const [f, s, r] = await Promise.all([
      api<{ items: Entity[] }>("/api/federation"),
      api<{ items: Entity[] }>("/api/features?kind=schemas"),
      api<{ items: Run[] }>("/api/runs"),
    ]);
    setFederations(f.items);
    setSchemas(s.items);
    setItems(r.items);
    if (!federationId && f.items[0]) setFederationId(f.items[0].id);
    if (!schemaId && s.items[0]) setSchemaId(s.items[0].id);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function create() {
    setError("");
    try {
      await api("/api/runs", {
        method: "POST",
        body: JSON.stringify({
          federationId,
          schemaId,
          siteParticipation: Number(siteParticipation),
          featureConfidence: Number(featureConfidence),
          schemaConfidence: Number(schemaConfidence),
          federationAgreement: Number(federationAgreement),
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="CVD runs"
      subtitle="Record soft-sim federation participation and agreement cues."
    >
      <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
        <div>
          <Label htmlFor="fed">Federation</Label>
          <select
            id="fed"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={federationId}
            onChange={(e) => setFederationId(e.target.value)}
          >
            {federations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label ?? f.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="schema">Feature schema</Label>
          <select
            id="schema"
            className="mt-1 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 py-2 text-sm"
            value={schemaId}
            onChange={(e) => setSchemaId(e.target.value)}
          >
            {schemas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label ?? s.id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="sp">Site participation</Label>
          <Input
            id="sp"
            value={siteParticipation}
            onChange={(e) => setSiteParticipation(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fc">Feature confidence</Label>
          <Input
            id="fc"
            value={featureConfidence}
            onChange={(e) => setFeatureConfidence(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sc">Schema confidence</Label>
          <Input
            id="sc"
            value={schemaConfidence}
            onChange={(e) => setSchemaConfidence(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fa">Federation agreement</Label>
          <Input
            id="fa"
            value={federationAgreement}
            onChange={(e) => setFederationAgreement(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <Button onClick={() => create()}>Create CVD run</Button>
        </div>
      </div>
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-warn)]">{error}</p>
      ) : null}
      <ul className="space-y-3">
        {items.map((r) => (
          <li
            key={r.id}
            className="row-lift rounded-md border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
          >
            <div className="font-medium">{r.id}</div>
            <div className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              participation {r.siteParticipation} · features{" "}
              {r.featureConfidence} · schema {r.schemaConfidence} · agreement{" "}
              {r.federationAgreement} · {r.status}
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
