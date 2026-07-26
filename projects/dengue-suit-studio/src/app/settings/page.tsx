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
  defaultClimateBias: string;
  defaultMode: string;
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
  const [msg, setMsg] = useState("");

  const load = async () => {
    try {
      const [settings, memberList, auditList] = await Promise.all([
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit"),
      ]);
      setOrg(settings.org);
      setMembers(memberList.items);
      setAudits(auditList.items);
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
      const res = await api<{ org: Org }>("/api/settings", {
        method: "POST",
        body: JSON.stringify(org),
      });
      setOrg(res.org);
      setMsg("Settings saved");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Save failed");
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
      setError(x instanceof Error ? x.message : "Invite failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, webhooks, members, and audit trail for the dengue thermal-suitability soft-sim bench."
    >
      {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}
      {msg ? <p className="mb-4 text-sm text-[var(--ds-teal)]">{msg}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-10 grid max-w-xl gap-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          <Label htmlFor="webhook">Webhook URL</Label>
          <Input id="webhook" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          <Label htmlFor="secret">Webhook secret</Label>
          <Input id="secret" value={org.webhookSecret} onChange={(e) => setOrg({ ...org, webhookSecret: e.target.value })} />
          <Label htmlFor="bias">Default climate bias</Label>
          <select
            id="bias"
            className="rounded-md border px-3 py-2 text-sm"
            value={org.defaultClimateBias}
            onChange={(e) => setOrg({ ...org, defaultClimateBias: e.target.value })}
          >
            <option value="balanced">balanced</option>
            <option value="ssp585_first">ssp585_first</option>
            <option value="ssp126_first">ssp126_first</option>
            <option value="historical_first">historical_first</option>
          </select>
          <Label htmlFor="rate">Rate limit / minute</Label>
          <Input
            id="rate"
            type="number"
            value={org.rateLimitPerMinute}
            onChange={(e) => setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })}
          />
          <Button type="submit">Save settings</Button>
        </form>
      ) : null}
      <form onSubmit={invite} className="mb-10 flex max-w-xl flex-wrap items-end gap-2">
        <div className="grow">
          <Label htmlFor="email">Invite member</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit">Invite</Button>
      </form>
      <ul className="mb-10 space-y-1 text-sm">
        {members.map((m) => (
          <li key={m.id}>
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">Audit</h2>
      <ul className="space-y-2 text-sm">
        {audits.map((a) => (
          <li key={a.id} className="rounded border bg-white px-3 py-2">
            {a.at} · {a.actor} · {a.action} — {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default SettingsPage;
