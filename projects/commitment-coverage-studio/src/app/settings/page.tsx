"use client";

import { useCallback, useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/studio-states";
import { Button } from "@/components/ui/button";
import { apiJson } from "@/lib/api";

type OrgPublic = {
  id: string;
  name: string;
  seatTier: string;
  webhookSecretMasked: string | null;
  updatedAt: string;
  createdAt: string;
};

type MemberPublic = {
  id: string;
  orgId: string;
  email: string;
  role: string;
  createdAt: string;
};

type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};

type OrgResponse = { softSim: boolean; org: OrgPublic };
type MembersResponse = { softSim: boolean; members: MemberPublic[] };
type AuditResponse = { softSim: boolean; entries: AuditEntry[] };

export default function SettingsPage() {
  const [org, setOrg] = useState<OrgPublic | null>(null);
  const [members, setMembers] = useState<MemberPublic[] | null>(null);
  const [audit, setAudit] = useState<AuditEntry[] | null>(null);
  const [name, setName] = useState("");
  const [seatTier, setSeatTier] = useState("evaluator");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("viewer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [saveNote, setSaveNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [orgResult, membersResult, auditResult] = await Promise.all([
      apiJson<OrgResponse>("/api/org"),
      apiJson<MembersResponse>("/api/members"),
      apiJson<AuditResponse>("/api/audit"),
    ]);
    if (!orgResult.ok) {
      setOrg(null);
      setMembers(null);
      setAudit(null);
      setError(orgResult.message);
      setLoading(false);
      return;
    }
    if (!membersResult.ok) {
      setOrg(orgResult.data.org);
      setMembers(null);
      setAudit(null);
      setError(membersResult.message);
      setLoading(false);
      return;
    }
    if (!auditResult.ok) {
      setOrg(orgResult.data.org);
      setMembers(membersResult.data.members);
      setAudit(null);
      setError(auditResult.message);
      setLoading(false);
      return;
    }
    setOrg(orgResult.data.org);
    setName(orgResult.data.org.name);
    setSeatTier(orgResult.data.org.seatTier);
    setMembers(membersResult.data.members);
    setAudit(auditResult.data.entries);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveOrg() {
    setSaving(true);
    setSaveNote(null);
    setError(null);
    const body: {
      name: string;
      seatTier: string;
      webhookSecret?: string;
    } = { name, seatTier };
    if (webhookSecret.trim()) {
      body.webhookSecret = webhookSecret.trim();
    }
    const result = await apiJson<OrgResponse>("/api/org", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setOrg(result.data.org);
    setName(result.data.org.name);
    setSeatTier(result.data.org.seatTier);
    setWebhookSecret("");
    setSaveNote("Org settings saved (soft-sim).");
    await load();
  }

  async function addMember() {
    setAdding(true);
    setError(null);
    const result = await apiJson<{ softSim: boolean; member: MemberPublic }>(
      "/api/members",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: memberEmail, role: memberRole }),
      },
    );
    setAdding(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setMemberEmail("");
    setMemberRole("viewer");
    await load();
  }

  return (
    <StudioShell
      title="Settings"
      description="Org profile, seats, and members for this soft-sim desk. Not a live identity provider."
    >
      {loading ? <LoadingState label="Loading org settings…" /> : null}
      {!loading && error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && org ? (
        <div className="flex flex-col gap-10">
          <section className="max-w-xl" aria-labelledby="org-heading">
            <h2
              id="org-heading"
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground"
            >
              Organization
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Name and seat tier for the demo org. Webhook secret is set-only —
              GET never returns the raw value.
            </p>
            <form
              className="mt-4 flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                void saveOrg();
              }}
            >
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Seat tier</span>
                <select
                  value={seatTier}
                  onChange={(e) => setSeatTier(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="evaluator">evaluator</option>
                  <option value="platform">platform</option>
                  <option value="site">site</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">
                  Webhook secret{" "}
                  {org.webhookSecretMasked
                    ? `(current ${org.webhookSecretMasked})`
                    : "(not set)"}
                </span>
                <input
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="Leave blank to keep"
                  autoComplete="off"
                  className="h-8 rounded-md border border-input bg-background px-2.5 font-[family-name:var(--font-mono)] text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save org"}
                </Button>
                {saveNote ? (
                  <p className="text-sm text-muted-foreground">{saveNote}</p>
                ) : null}
              </div>
            </form>
          </section>

          <section aria-labelledby="members-heading">
            <h2
              id="members-heading"
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground"
            >
              Members
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Soft-sim roster for the demo org. Add by email and role.
            </p>

            <form
              className="mt-4 flex flex-wrap items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                void addMember();
              }}
            >
              <label className="flex min-w-[14rem] flex-1 flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Email</span>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                  placeholder="finops@example.com"
                  className="h-8 rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
              <label className="flex w-36 flex-col gap-1 text-sm">
                <span className="text-muted-foreground">Role</span>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="admin">admin</option>
                  <option value="editor">editor</option>
                  <option value="viewer">viewer</option>
                </select>
              </label>
              <Button type="submit" disabled={adding || !memberEmail.trim()}>
                {adding ? "Adding…" : "Add member"}
              </Button>
            </form>

            {members && members.length === 0 ? (
              <EmptyState
                className="mt-4"
                title="No members yet"
                detail="Seed should add a demo admin — try reload."
              />
            ) : null}

            {members && members.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">Email</th>
                      <th className="py-2 pr-4 font-medium">Role</th>
                      <th className="py-2 font-medium">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr
                        key={m.id}
                        className="border-b border-[color-mix(in_srgb,var(--color-rule)_20%,transparent)]"
                      >
                        <td className="py-2.5 pr-4 font-[family-name:var(--font-mono)] text-[0.8rem]">
                          {m.email}
                        </td>
                        <td className="py-2.5 pr-4">{m.role}</td>
                        <td className="py-2.5 font-[family-name:var(--font-mono)] text-[0.75rem] text-muted-foreground">
                          {m.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>

          <section aria-labelledby="audit-heading">
            <h2
              id="audit-heading"
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-foreground"
            >
              Audit
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Recent soft-sim mutations for this org. Shown here under settings —
              not a primary Studio nav item.
            </p>
            {audit && audit.length === 0 ? (
              <EmptyState
                className="mt-4"
                title="No audit entries yet"
                detail="Save org settings or add a member to write the first row."
              />
            ) : null}
            {audit && audit.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">When</th>
                      <th className="py-2 pr-4 font-medium">Actor</th>
                      <th className="py-2 pr-4 font-medium">Action</th>
                      <th className="py-2 font-medium">Entity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-[color-mix(in_srgb,var(--color-rule)_20%,transparent)]"
                      >
                        <td className="py-2.5 pr-4 font-[family-name:var(--font-mono)] text-[0.75rem] text-muted-foreground">
                          {entry.createdAt}
                        </td>
                        <td className="py-2.5 pr-4 font-[family-name:var(--font-mono)] text-[0.75rem]">
                          {entry.actor}
                        </td>
                        <td className="py-2.5 pr-4">{entry.action}</td>
                        <td className="py-2.5 font-[family-name:var(--font-mono)] text-[0.75rem]">
                          {entry.entityType}/{entry.entityId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </StudioShell>
  );
}
