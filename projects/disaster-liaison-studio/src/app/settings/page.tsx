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
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [exportMsg, setExportMsg] = useState("");

  const load = async () => {
    try {
      setOrg(await api<Org>("/api/settings"));
      setMembers((await api<{ items: Member[] }>("/api/members")).items);
      setAudits((await api<{ items: Audit[] }>("/api/audit")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
    try {
      setOrg(await api<Org>("/api/settings", { method: "POST", body: JSON.stringify(org) }));
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not save");
    }
  };

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "evaluator" }),
      });
      setEmail("");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not invite");
    }
  };

  const doExport = async (format: string) => {
    try {
      const text = await api<string>(`/api/export?format=${format}`);
      setExportMsg(`Exported ${format} (${String(text).length} chars)`);
    } catch (x) {
      setError(x instanceof Error ? x.message : "Export failed");
    }
  };

  const pingWebhook = async () => {
    try {
      await api("/api/webhook", {
        method: "POST",
        body: JSON.stringify({ event: "pack.lock_soft_sim", at: new Date().toISOString() }),
        headers: { "idempotency-key": `dl-${Date.now()}` },
      });
      setExportMsg("Webhook ingested");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Webhook failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, export, and webhook — platform must-haves for emergency-ops soft-sims."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {exportMsg ? <p className="mb-4 text-sm text-[var(--dl-teal)]">{exportMsg}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-10 max-w-lg space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input id="webhookUrl" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          <Label htmlFor="rate">Rate limit / min</Label>
          <Input
            id="rate"
            type="number"
            value={org.rateLimitPerMinute}
            onChange={(e) =>
              setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })
            }
          />
          <Button type="submit">Save settings</Button>
        </form>
      ) : null}
      <form onSubmit={invite} className="mb-10 flex max-w-lg gap-2">
        <Input placeholder="member@org.local" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit">Invite</Button>
      </form>
      <ul className="mb-8 space-y-1 text-sm">
        {members.map((m) => (
          <li key={m.id}>
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
      <div className="mb-8 flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => void doExport("json")}>
          Export JSON
        </Button>
        <Button type="button" variant="outline" onClick={() => void doExport("csv")}>
          Export CSV
        </Button>
        <Button type="button" variant="outline" onClick={() => void pingWebhook()}>
          Ping webhook
        </Button>
      </div>
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">Audit</h2>
      <ul className="space-y-2">
        {audits.slice(0, 12).map((a) => (
          <li key={a.id} className="rounded-lg border bg-white px-3 py-2 text-sm">
            {a.at} · {a.actor} · {a.action} · {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default SettingsPage;
