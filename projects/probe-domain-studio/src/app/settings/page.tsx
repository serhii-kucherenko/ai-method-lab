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
    a.download = "probe-domain-export.json";
    a.click();
    setMsg("Exported JSON");
  };

  const exportCsv = async () => {
    const text = await api<string>("/api/export?format=csv");
    const blob = new Blob([typeof text === "string" ? text : String(text)], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "probe-domain-compares.csv";
    a.click();
    setMsg("Exported CSV");
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
    <StudioShell title="Settings" subtitle="Org, members, audit, export, and HMAC webhook — platform must-haves.">
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={save} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input id="webhookUrl" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          <Label htmlFor="rate">Rate limit / min</Label>
          <Input
            id="rate"
            type="number"
            value={org.rateLimitPerMinute}
            onChange={(e) => setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })}
          />
          <Button>Save org</Button>
        </form>
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="font-semibold">Members</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {members.map((m) => (
                <li key={m.id}>{m.email} · {m.role}</li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="button" onClick={() => void invite()}>Invite</Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => void exportJson()}>Export JSON</Button>
            <Button type="button" variant="outline" onClick={() => void exportCsv()}>Export CSV</Button>
            <Button type="button" variant="outline" onClick={() => void pingWebhook()}>Ping webhook</Button>
          </div>
          {msg ? <p className="text-sm text-[var(--pd-teal)]">{msg}</p> : null}
          <div className="rounded-lg border bg-white p-4">
            <h2 className="font-semibold">Audit trail</h2>
            <ul className="mt-2 max-h-48 space-y-1 overflow-auto text-sm">
              {audit.map((a, i) => (
                <li key={`${a.at}-${i}`}>{a.action}: {a.detail}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            Guide: docs/guides/129-probe-domain-studio-lessons.md
          </p>
        </div>
      </div>
    </StudioShell>
  );
}

export default SettingsPage;
