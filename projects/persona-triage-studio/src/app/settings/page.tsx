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
  defaultStyleBias: string;
  defaultMode: string;
  rateLimitPerMinute: number;
};

type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export default function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const [o, m, a] = await Promise.all([
      api<{ org: Org }>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: Audit[] }>("/api/audits?limit=20"),
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
      const data = await api<{ org: Org }>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify(org),
      });
      setOrg(data.org);
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
        body: JSON.stringify({ email: email || "peer@persona-triage.local", role: "evaluator" }),
      });
      setEmail("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function download(format: "packs-json" | "compares-csv") {
    const res = await fetch(`/api/export?format=${format}`, {
      headers: { authorization: `Bearer ${API_TOKEN}` },
    });
    const text = await res.text();
    const blob = new Blob([text], {
      type: format.endsWith("csv") ? "text/csv" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = format === "packs-json" ? "packs.json" : "compares.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook HMAC, exports, and audit trail."
    >
      {error ? (
        <p className="mb-4 text-sm text-[var(--studio-coral)]">
          {error} (dev bearer: {API_TOKEN})
        </p>
      ) : null}
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
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="webhookSecret">Webhook secret</Label>
            <Input
              id="webhookSecret"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="bias">Default style bias</Label>
            <select
              id="bias"
              className="mt-1 flex h-9 w-full rounded-md border border-[var(--studio-line)] bg-white px-3 text-sm"
              value={org.defaultStyleBias}
              onChange={(e) =>
                setOrg({ ...org, defaultStyleBias: e.target.value })
              }
            >
              <option value="style_strict">style_strict</option>
              <option value="balanced">balanced</option>
              <option value="urgency_first">urgency_first</option>
              <option value="idealized_first">idealized_first</option>
            </select>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <Button onClick={() => save()}>Save org</Button>
            <Button variant="outline" onClick={() => download("packs-json")}>
              Export packs JSON
            </Button>
            <Button variant="outline" onClick={() => download("compares-csv")}>
              Export compares CSV
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-medium text-slate-900">Members</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => invite()}>Invite</Button>
        </div>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          {members.map((m) => (
            <li key={m.id}>
              {m.email} · {m.role}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-medium text-slate-900">Audit</h2>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          {audits.map((a) => (
            <li key={a.id}>
              {a.at} · {a.actor} · {a.action} — {a.detail}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
