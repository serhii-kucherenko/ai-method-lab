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
  bearerToken: string;
  rateLimitPerMinute: number;
};

type Member = { id: string; email: string; role: string };
type Audit = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
};

export default function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("peer@chem-trace.local");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function load() {
    const [o, m, a] = await Promise.all([
      api<{ org: Org }>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: Audit[] }>("/api/audits"),
    ]);
    setOrg(o.org);
    setMembers(m.items);
    setAudits(a.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function save() {
    if (!org) return;
    setError("");
    try {
      const res = await api<{ org: Org }>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          webhookSecret: org.webhookSecret,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(res.org);
      setNote("Settings saved.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function invite() {
    setError("");
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "evaluator" }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function download(format: "json" | "csv") {
    const res = await fetch(`/api/export?format=${format}`, {
      headers: { authorization: `Bearer ${API_TOKEN}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = format === "csv" ? "compares.csv" : "packs.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook HMAC secret, exports, and audit trail."
    >
      {org ? (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Org name</Label>
            <Input
              id="name"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="rate">Rate limit / min</Label>
            <Input
              id="rate"
              value={String(org.rateLimitPerMinute)}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value) || 120,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="url">Webhook URL</Label>
            <Input
              id="url"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="secret">Webhook secret</Label>
            <Input
              id="secret"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Button onClick={save}>Save settings</Button>
            <Button variant="outline" onClick={() => download("json")}>
              Export JSON
            </Button>
            <Button variant="outline" onClick={() => download("csv")}>
              Export CSV
            </Button>
          </div>
          <p className="md:col-span-2 text-xs text-[color-mix(in_srgb,var(--studio-ink)_50%,transparent)]">
            Bearer token (dev): {org.bearerToken}
          </p>
        </div>
      ) : null}
      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-medium">Invite member</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            className="max-w-xs"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={invite}>Invite evaluator</Button>
        </div>
        <ul className="mt-4 space-y-1 text-sm">
          {members.map((m) => (
            <li key={m.id}>
              {m.email} · {m.role}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-medium">Audit trail</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {audits.slice(0, 12).map((a) => (
            <li key={a.id}>
              {a.at} · {a.actor} · {a.action} — {a.detail}
            </li>
          ))}
        </ul>
      </div>
      {note ? <p className="mt-4 text-sm text-[var(--ct-teal)]">{note}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
    </StudioShell>
  );
}
