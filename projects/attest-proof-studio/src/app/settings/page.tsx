"use client";

import { FormEvent, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/client-api";
import type { AuditEntry, Member, OrgSettings } from "@/store";

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [rateMsg, setRateMsg] = useState("");

  async function load() {
    const res = await api<{ org: OrgSettings; members: Member[] }>(
      "/api/settings",
    );
    setOrg(res.org);
    setOrgName(res.org.name);
    setMembers(res.members);
    const a = await api<{ items: AuditEntry[] }>("/api/audits");
    setAudits(a.items.slice(0, 8));
  }

  useEffect(() => {
    load().catch((e) => setError(String(e)));
  }, []);

  async function onInvite(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/members", {
        method: "POST",
        body: JSON.stringify({ email, role: "reader" }),
      });
      setEmail("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onSaveOrg(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/settings", {
        method: "POST",
        body: JSON.stringify({
          action: "updateOrg",
          patch: { name: orgName },
        }),
      });
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  async function exportClaims() {
    try {
      const text = await api<string>("/api/export?kind=claims");
      const blob = new Blob([text], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "claims.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(String(err));
    }
  }

  async function exportCompares() {
    try {
      const text = await api<string>("/api/export?kind=compares");
      const blob = new Blob([text], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compares.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <StudioShell
      title="Settings"
      subtitle="Org, members, exports, webhook, and audit trail."
    >
      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
      {rateMsg ? (
        <p className="mb-4 text-sm text-amber-700">{rateMsg}</p>
      ) : null}

      <form
        onSubmit={onSaveOrg}
        className="mb-8 flex flex-wrap gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
      >
        <Input
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Org name"
        />
        <Button type="submit">Save org</Button>
        <Button type="button" variant="secondary" onClick={exportClaims}>
          Export claims JSON
        </Button>
        <Button type="button" variant="secondary" onClick={exportCompares}>
          Export compares CSV
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setRateMsg(
              `Rate limit: ${org?.rateLimitPerMinute ?? 120}/min (429 when exceeded)`,
            )
          }
        >
          Rate-limit hint
        </Button>
      </form>

      <form
        onSubmit={onInvite}
        className="mb-8 flex flex-wrap gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
      >
        <Input
          type="email"
          placeholder="Invite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Invite member</Button>
      </form>

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
        Members
      </h2>
      <ul className="mb-8 space-y-2">
        {members.map((m) => (
          <li key={m.id} className="text-sm text-slate-600">
            {m.email} · {m.role}
          </li>
        ))}
      </ul>

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl">
        Recent audits
      </h2>
      <ul className="space-y-2">
        {audits.map((a) => (
          <li key={a.id} className="text-sm text-slate-600">
            {a.at} · {a.action} · {a.detail}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs text-slate-500">
        Bearer token (dev): {org?.bearerToken} · webhook secret configured
      </p>
    </StudioShell>
  );
}
