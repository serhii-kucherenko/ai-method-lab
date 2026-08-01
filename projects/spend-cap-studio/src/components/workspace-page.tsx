import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  accounts: {
    lead: "Register cloud accounts and lock spend-cap policies per cost center.",
    actions: ["Add account", "Set cost center", "Lock policy", "Export JSON"],
  },
  caps: {
    lead: "Declare hard dollar caps that block over-budget charges.",
    actions: ["Create cap", "Set amount", "Bind period", "Publish"],
  },
  meters: {
    lead: "Attach usage meters that feed spend against each cap.",
    actions: ["Add meter", "Map product", "Set owners", "Review feed"],
  },
  charges: {
    lead: "Queue charges and evaluate them against active hard caps.",
    actions: ["Log charge", "Score risk", "Request override", "Block charge"],
  },
  breaches: {
    lead: "Capture breaches when over-cap charges proceed without override.",
    actions: ["Open breach", "Assign owner", "Escalate", "Close"],
  },
  overrides: {
    lead: "Grant or deny spend-cap overrides with an auditable trail.",
    actions: ["Review override", "Approve", "Deny", "Export audit"],
  },
  compare: {
    lead: "Contrast hard-cap blocks against soft-warn baselines.",
    actions: ["Run A/B compare", "Inspect block rate", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track block rate, breach count, and soft-warn drift.",
    actions: ["Rank accounts", "Filter period", "Inspect trend", "Share report"],
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
            className="rounded border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-teal-300"
          >
            <span className="text-teal-300">0{i + 1}</span>
            <p className="mt-2 text-lg">{a}</p>
          </button>
        ))}
      </div>
      {name === "compare" && (
        <div className="compare-slide mt-10 rounded border border-slate-700 p-6">
          <p className="text-sm text-slate-400">Sample hard-cap result</p>
          <p className="mt-2 text-4xl text-teal-300">
            {GOLDENS[0].hardCap.blockRate}% blocked{" "}
            <span className="text-base text-slate-400">
              breaches {GOLDENS[0].hardCap.breachCount}
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A hard-stops over-cap charges. B soft-warn lets them through.
          </p>
        </div>
      )}
      {name === "overrides" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["blockRate", GOLDENS[0].hardCap.blockRate],
              ["breachCount", GOLDENS[0].hardCap.breachCount],
              ["trust", GOLDENS[0].hardCap.trust],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-teal-300">{k}</p>
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
