"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GUIDE_PATH } from "@/claim";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, API_TOKEN } from "@/lib/client-api";

type Org = {
  name: string;
  webhookUrl: string;
  rateLimitPerMinute: number;
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
    const [s, m, a] = await Promise.all([
      api<{ org: Org }>("/api/settings"),
      api<{ items: Member[] }>("/api/members"),
      api<{ items: Audit[] }>("/api/audits"),
    ]);
    setOrg(s.org);
    setName(s.org.name);
    setMembers(m.items);
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
        body: JSON.stringify({ email: email || "planner@example.com", role: "planner" }),
      });
      setEmail("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function download(format: string) {
    window.open(`/api/export?format=${format}`, "_blank");
    // bearer can't be set on window.open — use fetch blob
    fetch(`/api/export?format=${format}`, {
      headers: { authorization: `Bearer ${API_TOKEN}` },
    })
      .then(async (res) => {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          format === "compares-csv" ? "compares.csv" : "routes.json";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch((e) => setError(String(e)));
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, webhook, export, and audit — chem-planning platform must-haves."
    >
      <section className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Org</h2>
        <div className="mt-3 flex max-w-md flex-wrap gap-2">
          <div className="flex-1">
            <Label htmlFor="org">Name</Label>
            <Input
              id="org"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button className="bg-[var(--studio-teal)]" onClick={saveOrg}>
              Save
            </Button>
          </div>
        </div>
        {org ? (
          <p className="mt-2 text-sm text-slate-500">
            Rate limit {org.rateLimitPerMinute}/min · webhook{" "}
            {org.webhookUrl || "(unset)"}
          </p>
        ) : null}
      </section>

      <section className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Members
        </h2>
        <div className="mt-3 flex max-w-md gap-2">
          <Input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="outline" onClick={invite}>
            Invite
          </Button>
        </div>
        <ul className="mt-3 space-y-1 text-sm">
          {members.map((m) => (
            <li key={m.id}>
              {m.email} · {m.role}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Export
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => download("routes-json")}>
            Export routes JSON
          </Button>
          <Button variant="outline" onClick={() => download("compares-csv")}>
            Export compares CSV
          </Button>
        </div>
      </section>

      <section className="mb-8 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl">
          Audit trail
        </h2>
        <ul className="mt-3 max-h-64 space-y-1 overflow-auto text-sm text-slate-600">
          {audits.map((a) => (
            <li key={a.id}>
              {a.at} · {a.actor} · {a.action} — {a.detail}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-slate-500">
        Guide:{" "}
        <Link className="text-[var(--studio-teal)] underline" href={GUIDE_PATH}>
          {GUIDE_PATH}
        </Link>
      </p>
      {error ? (
        <p className="mt-4 text-sm text-[var(--studio-amber)]">{error}</p>
      ) : null}
    </StudioShell>
  );
}
