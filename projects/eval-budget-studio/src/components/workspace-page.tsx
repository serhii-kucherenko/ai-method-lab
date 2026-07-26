import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  budgets: {
    lead: "Create, lock, and export evaluation budget packs before runs burn the invoice.",
    actions: ["Create budget pack", "Lock version", "Archive pack", "Export JSON"],
  },
  plans: {
    lead: "Attach run plans with unit costs and quality targets under a budget cap.",
    actions: ["Add plan step", "Set unit cost", "Reorder steps", "Estimate spend"],
  },
  forecasts: {
    lead: "Forecast spend versus quality before execution and keep a traceable record.",
    actions: ["Run forecast", "Attach plan", "View audit", "Export CSV"],
  },
  caps: {
    lead: "Define hard caps and soft warning thresholds for evaluation spend.",
    actions: ["Set hard cap", "Set warning", "Bind budget", "Review policy"],
  },
  overruns: {
    lead: "Queue projected overruns instead of discovering them on the invoice.",
    actions: ["Open overrun", "Assign owner", "Resolve", "Dismiss"],
  },
  compare: {
    lead: "Contrast budget-aware forecasts against unconstrained always-max spend.",
    actions: ["Run A/B compare", "Inspect spend", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track forecast accuracy, overrun rate, and quality under cap.",
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
            className="rounded border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-emerald-400"
          >
            <span className="text-emerald-400">0{i + 1}</span>
            <p className="mt-2 text-lg">{a}</p>
          </button>
        ))}
      </div>
      {name === "compare" && (
        <div className="compare-slide mt-10 rounded border border-slate-700 p-6">
          <p className="text-sm text-slate-400">Sample budget-aware score</p>
          <p className="mt-2 text-4xl text-emerald-400">
            {GOLDENS[0].budgetAware.score}{" "}
            <span className="text-base text-slate-400">
              spend {GOLDENS[0].budgetAware.forecastSpend} · risk{" "}
              {GOLDENS[0].budgetAware.overrunRisk}%
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A stays under the cap when possible. B always-max ignores the ceiling.
          </p>
        </div>
      )}
      {name === "forecasts" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["forecastSpend", GOLDENS[0].budgetAware.forecastSpend],
              ["overrunRisk", GOLDENS[0].budgetAware.overrunRisk],
              ["trust", GOLDENS[0].budgetAware.trust],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-400">{k}</p>
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
