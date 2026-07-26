import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  sites: {
    lead: "Register plant sites and lock bypass audit policies per line.",
    actions: ["Add site", "Set risk class", "Lock policy", "Export JSON"],
  },
  bypasses: {
    lead: "Log temporary safety bypasses with owners and max open hours.",
    actions: ["Create bypass", "Set max hours", "Mark critical", "Assign owner"],
  },
  expiries: {
    lead: "Track grace windows and overdue clocks before a bypass hardens open.",
    actions: ["Set grace", "Scan overdue", "Notify owner", "Escalate"],
  },
  restorals: {
    lead: "Record restoral proof when temporary bypasses are closed.",
    actions: ["Log restoral", "Attach evidence", "Close bypass", "Export audit"],
  },
  alerts: {
    lead: "Queue overdue and critical bypass alerts for OT safety owners.",
    actions: ["Open alert", "Assign owner", "Ack", "Resolve"],
  },
  ledgers: {
    lead: "Keep a durable ledger of bypass open hours and restoral outcomes.",
    actions: ["Open ledger", "Filter period", "Export CSV", "Share report"],
  },
  compare: {
    lead: "Contrast expiry-aware audits against permanent-open baselines.",
    actions: ["Run A/B compare", "Inspect exposure", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track overdue count, exposure hours, and permanent-open drift.",
    actions: ["Rank sites", "Filter period", "Inspect trend", "Share report"],
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
            className="rounded border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-orange-400"
          >
            <span className="text-orange-400">0{i + 1}</span>
            <p className="mt-2 text-lg">{a}</p>
          </button>
        ))}
      </div>
      {name === "compare" && (
        <div className="compare-slide mt-10 rounded border border-slate-700 p-6">
          <p className="text-sm text-slate-400">Sample expiry-aware audit</p>
          <p className="mt-2 text-4xl text-orange-400">
            {GOLDENS[0].expiryAware.overdueCount} overdue{" "}
            <span className="text-base text-slate-400">
              exposure {GOLDENS[0].expiryAware.exposureHours}h
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A enforces max hours and restoral. B permanent-open never marks overdue.
          </p>
        </div>
      )}
      {name === "ledgers" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["overdueCount", GOLDENS[0].expiryAware.overdueCount],
              ["exposureHours", GOLDENS[0].expiryAware.exposureHours],
              ["trust", GOLDENS[0].expiryAware.trust],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-orange-400">{k}</p>
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
