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
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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
    load().catch((e) =>
      setError(
        e instanceof Error
          ? `Auth fail or load error: ${e.message}`
          : String(e),
      ),
    );
  }, []);

  async function save() {
    if (!org) return;
    setError("");
    try {
      const next = await api<{ org: Org }>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          webhookUrl: org.webhookUrl,
          webhookSecret: org.webhookSecret,
          rateLimitPerMinute: org.rateLimitPerMinute,
        }),
      });
      setOrg(next.org);
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
        body: JSON.stringify({
          email: email || "evaluator@hcc-reason.local",
          role: "evaluator",
        }),
      });
      setEmail("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function download(format: string) {
    setError("");
    try {
      const text = await api<string>(`/api/export?format=${format}`);
      const blob = new Blob([text], {
        type: format.includes("csv") ? "text/csv" : "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = format === "csv" ? "hcc-compares.csv" : "hcc-packs.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org token, members, webhook, audit, and export."
    >
      {error ? <p className="mb-4 text-sm text-[var(--hr-wine)]">{error}</p> : null}
      {org ? (
        <div className="mb-8 grid gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4 md:grid-cols-2">
          <div>
            <Label>Org name</Label>
            <Input value={org.name} readOnly />
          </div>
          <div>
            <Label>Bearer token</Label>
            <Input value={org.bearerToken} readOnly />
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
          <div>
            <Label htmlFor="rl">Rate limit / min</Label>
            <Input
              id="rl"
              type="number"
              value={org.rateLimitPerMinute}
              onChange={(e) =>
                setOrg({
                  ...org,
                  rateLimitPerMinute: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => download("json")}>
              Export JSON
            </Button>
            <Button variant="outline" onClick={() => download("csv")}>
              Export CSV
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Members
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            placeholder="email@hcc-reason.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs"
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
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Audit trail
        </h2>
        <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
          {audits.map((a) => (
            <li key={a.id}>
              <span className="text-[color-mix(in_srgb,var(--studio-ink)_45%,transparent)]">
                {a.at}
              </span>{" "}
              {a.actor} · {a.action} · {a.detail}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
