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
  rateLimitPerMinute: number;
  bearerToken: string;
};
type Member = { id: string; email: string; role: string };
type Audit = { id: string; at: string; actor: string; action: string; detail: string };

export default function SettingsPage() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const s = await api<{ org: Org }>("/api/settings");
    setOrg(s.org);
    setName(s.org.name);
    const m = await api<{ items: Member[] }>("/api/members");
    setMembers(m.items);
    const a = await api<{ items: Audit[] }>("/api/audits");
    setAudits(a.items);
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function saveOrg() {
    setError("");
    try {
      await api("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({ name }),
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
      setEmail("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function download(format: "cases-json" | "compares-csv") {
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
    a.download = format === "cases-json" ? "cases.json" : "compares.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, exports, audits, and webhook notes."
    >
      <section className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg">Org</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <div className="min-w-[240px] flex-1">
            <Label htmlFor="org">Org name</Label>
            <Input
              id="org"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button className="bg-[var(--studio-signal)]" onClick={saveOrg}>
              Save org
            </Button>
          </div>
        </div>
        {org ? (
          <p className="mt-3 text-xs text-slate-500">
            Bearer token for APIs: {org.bearerToken} · rate limit{" "}
            {org.rateLimitPerMinute}/min · webhook URL{" "}
            {org.webhookUrl || "(unset)"} — POST /api/webhook with Idempotency-Key
            and X-Signature sha256=…
          </p>
        ) : null}
      </section>

      <section className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Members
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Input
            placeholder="evaluator@org.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" onClick={invite}>
            Invite evaluator
          </Button>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-slate-700">
          {members.map((m) => (
            <li key={m.id}>
              {m.email} · {m.role}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Export
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => download("cases-json")}>
            Export cases JSON
          </Button>
          <Button variant="outline" onClick={() => download("compares-csv")}>
            Export compares CSV
          </Button>
        </div>
      </section>

      <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-lg">
          Audit trail
        </h2>
        <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm text-slate-600">
          {audits.map((a) => (
            <li key={a.id}>
              {a.at} · {a.actor} · {a.action} — {a.detail}
            </li>
          ))}
        </ul>
      </section>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-signal)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
