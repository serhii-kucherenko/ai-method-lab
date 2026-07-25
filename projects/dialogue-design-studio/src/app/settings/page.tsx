"use client";
import { useEffect, useState } from "react";
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
};

type Member = { id: string; email: string; role: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [audit, setAudit] = useState<{ action: string; detail: string; at: string }[]>([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const s = await api<{ org: Org; members: Member[] }>("/api/settings");
    setOrg(s.org);
    setMembers(s.members);
    const a = await api<{ items: { action: string; detail: string; at: string }[] }>("/api/audit");
    setAudit(a.items);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    await api("/api/settings", { method: "POST", body: JSON.stringify(org) });
    setMsg("Org saved");
    await load();
  };

  const invite = async () => {
    await api("/api/members", {
      method: "POST",
      body: JSON.stringify({ email, role: "evaluator" }),
    });
    setEmail("");
    await load();
  };

  const exportJson = async () => {
    const text = await api<string>("/api/export?format=json");
    const blob = new Blob([typeof text === "string" ? text : JSON.stringify(text)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dialogue-design-export.json";
    a.click();
    setMsg("Exported JSON");
  };

  const pingWebhook = async () => {
    const res = await api<{ ok: boolean; id?: string }>("/api/webhook", {
      method: "POST",
      body: JSON.stringify({ demo: true, payload: { event: "pack.soft_sim" } }),
    });
    setMsg(`Webhook ${res.ok ? "ok" : "fail"} ${res.id ?? ""}`);
  };

  if (!org) {
    return (
      <StudioShell title="Settings" subtitle="Org, members, export, webhook.">
        <p>Loading…</p>
      </StudioShell>
    );
  }

  return (
    <StudioShell title="Settings" subtitle="Org, members, bearer auth, export, HMAC webhook, audit.">
      <form onSubmit={save} className="mb-8 max-w-lg space-y-3 rounded-lg border bg-white p-4">
        <Label htmlFor="name">Org name</Label>
        <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
        <Label htmlFor="webhook">Webhook URL</Label>
        <Input id="webhook" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
        <Label htmlFor="rl">Rate limit / min</Label>
        <Input id="rl" type="number" value={org.rateLimitPerMinute} onChange={(e) => setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })} />
        <p className="text-xs">Bearer token: {org.bearerToken}</p>
        <Button>Save org</Button>
      </form>
      <div className="mb-8 flex flex-wrap gap-2">
        <Button type="button" onClick={() => void exportJson()}>Export JSON</Button>
        <Button type="button" variant="outline" onClick={() => void pingWebhook()}>Demo webhook</Button>
      </div>
      <div className="mb-8 flex gap-2">
        <Input placeholder="member@org.local" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="button" onClick={() => void invite()}>Invite</Button>
      </div>
      <ul className="mb-8 space-y-2 text-sm">
        {members.map((m) => (
          <li key={m.id}>{m.email} · {m.role}</li>
        ))}
      </ul>
      <h2 className="font-[family-name:var(--font-display)] text-xl">Audit</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {audit.slice(0, 12).map((a, i) => (
          <li key={`${a.at}-${i}`}>{a.at} · {a.action} · {a.detail}</li>
        ))}
      </ul>
      {msg ? <p className="mt-4 text-sm text-[var(--dd-teal)]">{msg}</p> : null}
    </StudioShell>
  );
}

export default SettingsPage;
