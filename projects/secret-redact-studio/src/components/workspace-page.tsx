import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  fleets: {
    lead: "Group agents into fleets and lock shared secret-redact policies.",
    actions: ["Create fleet", "Attach policy", "Lock version", "Export JSON"],
  },
  traces: {
    lead: "Ingest agent traces that may contain secrets before export.",
    actions: ["Import trace", "Tag source", "Scan findings", "Archive"],
  },
  patterns: {
    lead: "Maintain pattern packs for API keys, tokens, passwords, and PII.",
    actions: ["Add pattern", "Test match", "Version pack", "Disable pattern"],
  },
  redactions: {
    lead: "Review redacted spans and confirm coverage before export.",
    actions: ["Open redaction", "Approve span", "Reject span", "Export audit"],
  },
  exports: {
    lead: "Gate exports so unredacted secrets cannot leave the vault.",
    actions: ["Request export", "Run gate", "Attach pack", "Download safe copy"],
  },
  leaks: {
    lead: "Queue leak findings when matched secrets were not redacted.",
    actions: ["Open leak", "Assign owner", "Escalate", "Resolve"],
  },
  compare: {
    lead: "Contrast pattern-redact coverage against raw-export baselines.",
    actions: ["Run A/B compare", "Inspect leaks", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track redact coverage, leak rate, and raw-export exposure.",
    actions: ["Rank fleets", "Filter period", "Inspect trend", "Share report"],
  },
  settings: {
    lead: "Manage organization details, bearer token access, members, webhooks, audits, and exports.",
    actions: ["Invite member", "Rotate bearer token", "Configure HMAC", "Download audit"],
  },
};

export function WorkspacePage({ name }: { name: string }) {
  const x = data[name];
  return (
    <StudioShell title={name[0].toUpperCase() + name.slice(1)}>
      <p className="mt-4 max-w-2xl text-slate-300">{x.lead}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {x.actions.map((a, i) => (
          <button
            key={a}
            className="rounded border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-sky-400"
          >
            <span className="text-sky-400">0{i + 1}</span>
            <p className="mt-2 text-lg">{a}</p>
          </button>
        ))}
      </div>
      {name === "compare" && (
        <div className="compare-slide mt-10 rounded border border-slate-700 p-6">
          <p className="text-sm text-slate-400">Sample pattern-redact result</p>
          <p className="mt-2 text-4xl text-sky-400">
            {GOLDENS[0].patternRedact.redactCoverage}% coverage{" "}
            <span className="text-base text-slate-400">
              leaks {GOLDENS[0].patternRedact.leakCount}
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A redacts matched secrets before export. B raw-export ships them untouched.
          </p>
        </div>
      )}
      {name === "leaks" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["leakCount", GOLDENS[0].patternRedact.leakCount],
              ["redactCoverage", GOLDENS[0].patternRedact.redactCoverage],
              ["trust", GOLDENS[0].patternRedact.trust],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-sky-400">{k}</p>
              <p className="mt-2 text-3xl">{v}</p>
            </div>
          ))}
        </div>
      )}
    </StudioShell>
  );
}

export function StaticPage({ title, body }: { title: string; body: string }) {
  return (
    <StudioShell title={title}>
      <p className="mt-5 max-w-2xl text-slate-300">{body}</p>
    </StudioShell>
  );
}
