import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  contracts: {
    lead: "Create and lock SLA contract packs with credit rates, caps, and monthly fees.",
    actions: ["Create contract", "Set credit rate", "Lock version", "Export JSON"],
  },
  incidents: {
    lead: "Attach downtime incidents with severity so credit math sees compounding risk.",
    actions: ["Log incident", "Set downtime", "Mark severity", "Link contract"],
  },
  credits: {
    lead: "Review projected service credits in dollars before Finance posts a refund.",
    actions: ["Open credit draft", "Apply cap", "Assign owner", "Export CSV"],
  },
  windows: {
    lead: "Define measurement windows and maintenance exclusions that change billable minutes.",
    actions: ["Add window", "Set timezone", "Bind contract", "Review policy"],
  },
  exclusions: {
    lead: "Queue excluded events so calendar noise does not inflate credit forecasts.",
    actions: ["Add exclusion", "Justify reason", "Approve", "Dismiss"],
  },
  forecasts: {
    lead: "Forecast literal-dollar credits versus breach risk before the invoice closes.",
    actions: ["Run forecast", "Attach incidents", "View audit", "Share report"],
  },
  compare: {
    lead: "Contrast credit-aware dollar forecasts against calendar-breach-only baselines.",
    actions: ["Run A/B compare", "Inspect dollars", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track forecast accuracy, credit exposure, and calendar false alarms.",
    actions: ["Rank packs", "Filter period", "Inspect trend", "Share report"],
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
            className="rounded border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-amber-400"
          >
            <span className="text-amber-400">0{i + 1}</span>
            <p className="mt-2 text-lg">{a}</p>
          </button>
        ))}
      </div>
      {name === "compare" && (
        <div className="compare-slide mt-10 rounded border border-slate-700 p-6">
          <p className="text-sm text-slate-400">Sample credit-aware forecast</p>
          <p className="mt-2 text-4xl text-amber-400">
            ${GOLDENS[0].creditAware.forecastCredit}{" "}
            <span className="text-base text-slate-400">
              score {GOLDENS[0].creditAware.score} · risk {GOLDENS[0].creditAware.breachRisk}%
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A prices credits with caps and exclusions. B flags calendar breach without dollar math.
          </p>
        </div>
      )}
      {name === "forecasts" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["forecastCredit", GOLDENS[0].creditAware.forecastCredit],
              ["breachRisk", GOLDENS[0].creditAware.breachRisk],
              ["trust", GOLDENS[0].creditAware.trust],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-amber-400">{k}</p>
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
