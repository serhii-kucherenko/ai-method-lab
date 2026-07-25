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
  const [email, setEmail] = useState("peer@variant-probe.local");
  const [error, setError] = useState("");
  const [exportNote, setExportNote] = useState("");

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
      await api("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          name: org.name,
          webhookUrl: org.webhookUrl,
          webhookSecret: org.webhookSecret,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
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

  async function doExport(format: "json" | "csv") {
    setError("");
    try {
      const text = await api<string>(`/api/export?format=${format}`);
      setExportNote(`Exported ${format} (${text.length} chars)`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook secret, exports, and audit trail."
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
            <Label htmlFor="rl">Rate limit / min</Label>
            <Input
              id="rl"
              type="number"
              value={org.rateLimitPerMinute}
              onChange={(e) =>
                setOrg({ ...org, rateLimitPerMinute: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="wh">Webhook URL</Label>
            <Input
              id="wh"
              value={org.webhookUrl}
              onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="sec">Webhook secret</Label>
            <Input
              id="sec"
              value={org.webhookSecret}
              onChange={(e) =>
                setOrg({ ...org, webhookSecret: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            Bearer token (dev): <code>{org.bearerToken}</code>
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-2">
            <Button onClick={save}>Save org</Button>
            <Button variant="outline" onClick={() => doExport("json")}>
              Export packs JSON
            </Button>
            <Button variant="outline" onClick={() => doExport("csv")}>
              Export compares CSV
            </Button>
          </div>
          {exportNote ? (
            <p className="md:col-span-2 text-sm text-[var(--vp-teal)]">
              {exportNote}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Members
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            className="max-w-xs"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={invite}>Invite evaluator</Button>
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {members.map((m) => (
            <li key={m.id}>
              {m.email} · {m.role}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Audit trail
        </h2>
        <ul className="mt-3 space-y-1 text-sm">
          {audits.slice(0, 12).map((a) => (
            <li key={a.id}>
              {a.at} · {a.actor} · {a.action} · {a.detail}
            </li>
          ))}
        </ul>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <p className="mt-6 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Lessons:{" "}
        <a
          className="underline"
          href="/docs/guides/93-variant-probe-studio-lessons.md"
        >
          93-variant-probe-studio-lessons
        </a>
      </p>
    </StudioShell>
  );
}
