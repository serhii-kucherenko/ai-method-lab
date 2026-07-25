"use client";

import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, API_TOKEN } from "@/lib/client-api";

type Org = {
  name: string;
  webhookUrl: string;
  webhookSecret: string;
  defaultChargeBias: string;
  rateLimitPerMinute: number;
};

type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

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
      const res = await api<{ org: Org }>("/api/settings", {
        method: "POST",
        body: JSON.stringify(org),
      });
      setOrg(res.org);
      setNote("Org saved");
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

  const exportJson = async () => {
    const text = await api<string>("/api/export?format=json");
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "packs.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = async () => {
    const text = await api<string>("/api/export?format=csv");
    const blob = new Blob([text], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compares.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pingWebhook = async () => {
    if (!org) return;
    const payload = { event: "ping", at: new Date().toISOString() };
    const body = JSON.stringify(payload);
    const sig =
      "sha256=" +
      (await hmacHex(org.webhookSecret, body));
    const res = await fetch("/api/webhook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": `settings-${Date.now()}`,
        "x-signature": sig,
        authorization: `Bearer ${API_TOKEN}`,
      },
      body,
    });
    const data = await res.json();
    setNote(`Webhook ${res.status}: ${JSON.stringify(data)}`);
    await load();
  };

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, audit, export, and HMAC webhook — category platform must-haves."
    >
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
      {note ? <p className="mb-3 text-sm text-[var(--ih-sea)]">{note}</p> : null}
      {org ? (
        <form onSubmit={save} className="mb-8 space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="name">Org name</Label>
          <Input
            id="name"
            value={org.name}
            onChange={(e) => setOrg({ ...org, name: e.target.value })}
          />
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input
            id="webhookUrl"
            value={org.webhookUrl}
            onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
          />
          <Label htmlFor="bias">Default charge bias</Label>
          <Input
            id="bias"
            value={org.defaultChargeBias}
            onChange={(e) =>
              setOrg({ ...org, defaultChargeBias: e.target.value })
            }
          />
          <Button>Save org</Button>
        </form>
      ) : null}
      <form onSubmit={invite} className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
        <div>
          <Label htmlFor="email">Invite member</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button>Invite</Button>
      </form>
      <div className="mb-8 flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => void exportJson()}>
          Export packs JSON
        </Button>
        <Button type="button" variant="outline" onClick={() => void exportCsv()}>
          Export compares CSV
        </Button>
        <Button type="button" onClick={() => void pingWebhook()}>
          Ping signed webhook
        </Button>
      </div>
      <section className="mb-8">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
          Members
        </h2>
        <ul className="space-y-2">
          {members.map((m) => (
            <li key={m.id} className="rounded border bg-white px-3 py-2 text-sm">
              {m.email} · {m.role}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
          Audit trail
        </h2>
        <ul className="space-y-2">
          {audits.slice(0, 12).map((a) => (
            <li key={a.id} className="rounded border bg-white px-3 py-2 text-sm">
              {a.at} · {a.actor} · {a.action} — {a.detail}
            </li>
          ))}
        </ul>
      </section>
    </StudioShell>
  );
}

async function hmacHex(secret: string, body: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default SettingsPage;
