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
  defaultTargetBias: string;
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
      const [o, m, a] = await Promise.all([
        api<{ org: Org }>("/api/settings"),
        api<{ items: Member[] }>("/api/members"),
        api<{ items: Audit[] }>("/api/audit"),
      ]);
      setOrg(o.org);
      setMembers(m.items);
      setAudits(a.items);
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
      await api("/api/settings", { method: "POST", body: JSON.stringify(org) });
      setMsg("Saved");
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

  const fireWebhook = async () => {
    try {
      await api("/api/webhook", {
        method: "POST",
        body: JSON.stringify({
          sign: true,
          idempotencyKey: `demo-${Date.now()}`,
          payload: { event: "pack.locked", softSim: true },
        }),
      });
      setMsg("Webhook ingested");
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Webhook failed");
    }
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, export, and webhook soft-sim controls."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {msg ? <p className="mb-3 text-sm text-[var(--nt-teal)]">{msg}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-8 grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Org name</Label>
            <Input id="name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="bias">Default target bias</Label>
            <Input
              id="bias"
              value={org.defaultTargetBias}
              onChange={(e) => setOrg({ ...org, defaultTargetBias: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="wh">Webhook URL</Label>
            <Input id="wh" value={org.webhookUrl} onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="rl">Rate limit / min</Label>
            <Input
              id="rl"
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) || 120 })
              }
            />
          </div>
          <Button>Save org</Button>
        </form>
      ) : null}
      <div className="mb-8 flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => void fireWebhook()}>
          Test webhook
        </Button>
        <a href="/api/export?format=json" className="rounded-md border px-3 py-2 text-sm">
          Export packs JSON
        </a>
        <a href="/api/export?format=csv" className="rounded-md border px-3 py-2 text-sm">
          Export compares CSV
        </a>
        <Link href={GUIDE_PATH} className="rounded-md border px-3 py-2 text-sm">
          Tutor guide
        </Link>
      </div>
      <form onSubmit={invite} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
        <div>
          <Label htmlFor="email">Invite member</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button>Invite</Button>
      </form>
      <h2 className="mb-2 font-semibold">Members</h2>
      <ul className="mb-8 space-y-2">
        {members.map((m) => (
          <li key={m.id} className="text-sm">
            {m.email} · {m.role}
          </li>
        ))}
      </ul>
      <h2 className="mb-2 font-semibold">Audit trail</h2>
      <ul className="space-y-2">
        {audits.map((a) => (
          <li key={a.id} className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
            {a.at} · {a.actor} · {a.action} · {a.detail}
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default SettingsPage;
