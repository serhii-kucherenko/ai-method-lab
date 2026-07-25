"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GUIDE_PATH } from "@/claim";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Org = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  bearerToken: string;
  rateLimitPerMinute: number;
  defaultEquityBias: string;
};

type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [features, setFeatures] = useState(0);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [settings, memberRes, auditRes, featureRes] = await Promise.all([
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit"),
        api<{ items: { id: string }[] }>("/api/features"),
      ]);
      setOrg(settings.org);
      setMembers(memberRes.items);
      setAudits(auditRes.items);
      setFeatures(featureRes.items.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load settings");
    }
  };

  useEffect(() => { void load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    try {
      await api("/api/settings", { method: "POST", body: JSON.stringify(org) });
      setMsg("Org saved");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Save failed");
    }
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/members", { method: "POST", body: JSON.stringify({ email, role: "evaluator" }) });
      setEmail("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Invite failed");
    }
  };

  const exportJson = async () => {
    const json = await api<string>("/api/export?format=json");
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "access-equity-packs.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pingWebhook = async () => {
    try {
      const data = await api<{ id?: string }>("/api/webhook", {
        method: "POST",
        body: JSON.stringify({
          demo: true,
          idempotencyKey: `demo-${Date.now()}`,
          payload: { event: "pack.soft_sim", at: new Date().toISOString() },
        }),
      });
      setMsg(`Webhook ok ${data.id ?? ""}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Webhook failed");
    }
  };

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Org, members, audit, export.">
        {error ? <p className="text-sm text-red-700">{error}</p> : <p>Loading…</p>}
      </StudioShell>
    );
  }

  return (
    <StudioShell title="Settings" subtitle="Org bearer auth, members, webhook HMAC, audit, export, and feature inventory.">
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={save} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="token">Bearer token</Label>
          <Input id="token" value={org.bearerToken} onChange={(e) => setOrg({ ...org, bearerToken: e.target.value })} />
          <Label htmlFor="secret">Webhook secret</Label>
          <Input id="secret" value={org.webhookSecret} onChange={(e) => setOrg({ ...org, webhookSecret: e.target.value })} />
          <Label htmlFor="rl">Rate limit / minute</Label>
          <Input id="rl" type="number" value={org.rateLimitPerMinute} onChange={(e) => setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })} />
          <Button>Save org</Button>
        </form>
        <div className="space-y-4">
          <form onSubmit={invite} className="space-y-3 rounded-lg border bg-white p-4">
            <Label htmlFor="email">Invite member</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button>Invite evaluator</Button>
            <ul className="mt-3 space-y-1 text-sm">
              {members.map((m) => <li key={m.id}>{m.email} · {m.role}</li>)}
            </ul>
          </form>
          <div className="rounded-lg border bg-white p-4 text-sm">
            <p>Features inventory: {features}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => void exportJson()}>Export JSON</Button>
              <Button type="button" variant="outline" onClick={() => void pingWebhook()}>Ping webhook</Button>
            </div>
            <p className="mt-3">Guide: <Link href={GUIDE_PATH} className="underline text-[var(--ae-teal)]">{GUIDE_PATH}</Link></p>
          </div>
        </div>
      </div>
      {msg ? <p className="mt-4 text-[var(--ae-teal)]">{msg}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Audit trail</h2>
        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
          {audits.map((a) => (
            <li key={a.id} className="rounded border bg-white px-3 py-2">{a.at} · {a.actor} · {a.action} — {a.detail}</li>
          ))}
        </ul>
      </section>
    </StudioShell>
  );
}

export default SettingsPage;
