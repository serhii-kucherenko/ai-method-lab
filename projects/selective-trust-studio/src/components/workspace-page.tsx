import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  policies: {
    lead: "Create, lock, version, and export cascade policy packs before they burn eval spend.",
    actions: ["Create policy pack", "Lock version", "Archive pack", "Export JSON"],
  },
  cascades: {
    lead: "Define cheap → mid → strong steps with confidence gates and cost weights.",
    actions: ["Add cascade step", "Set confidence gate", "Reorder steps", "Estimate cost"],
  },
  handoffs: {
    lead: "Track human handoffs when selective trust escalates uncertain scores.",
    actions: ["Open handoff", "Assign reviewer", "Close with note", "Export trail"],
  },
  costs: {
    lead: "Inspect cascade cost, escalate rate, and quality tradeoffs across runs.",
    actions: ["View cost panel", "Filter period", "Export CSV", "Compare budgets"],
  },
  escalations: {
    lead: "Queue uncertain cases instead of shipping overconfident always-strong scores.",
    actions: ["Open escalation", "Assign", "Resolve", "Dismiss"],
  },
  compare: {
    lead: "Contrast selective trust cascades against always-strong never-escalate baselines.",
    actions: ["Run A/B compare", "Inspect costs", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track cascade quality, cost, escalate rate, and handoff latency.",
    actions: ["Rank policies", "Filter period", "Inspect trend", "Share report"],
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
          <p className="text-sm text-slate-400">Sample selective trust score</p>
          <p className="mt-2 text-4xl text-amber-400">
            {GOLDENS[0].selective.score}{" "}
            <span className="text-base text-slate-400">
              trust {GOLDENS[0].selective.trust}% · cost {GOLDENS[0].selective.cascadeCost}
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A escalates when unsure and stops early when confident. B always burns the strong
            path with escalate rate 0.
          </p>
        </div>
      )}
      {name === "costs" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["cascadeCost", GOLDENS[0].selective.cascadeCost],
              ["escalateRate", GOLDENS[0].selective.escalateRate],
              ["trust", GOLDENS[0].selective.trust],
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
