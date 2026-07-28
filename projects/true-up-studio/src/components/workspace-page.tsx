import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  vendors: {
    lead: "Register SaaS vendors and lock true-up forecast policies.",
    actions: ["Add vendor", "Attach owner", "Lock policy", "Export JSON"],
  },
  contracts: {
    lead: "Capture committed units, seat counts, and overage rates.",
    actions: ["Create contract", "Set seats", "Set overage rate", "Version pack"],
  },
  meters: {
    lead: "Ingest usage meters that drive true-up dollars.",
    actions: ["Import meter", "Reconcile units", "Flag overage", "Export CSV"],
  },
  trueups: {
    lead: "Review projected true-up dollars before Finance sees the invoice.",
    actions: ["Open true-up", "Assign owner", "Approve forecast", "Share report"],
  },
  invoices: {
    lead: "Compare forecasted true-ups against incoming vendor invoices.",
    actions: ["Attach invoice", "Diff variance", "Dispute line", "Close period"],
  },
  variances: {
    lead: "Queue variance between seat renewals and usage true-ups.",
    actions: ["Open variance", "Explain delta", "Escalate", "Resolve"],
  },
  compare: {
    lead: "Contrast usage true-up pricing against seat-renewal-only baselines.",
    actions: ["Run A/B compare", "Inspect dollars", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track true-up dollars, variance rate, and seat-renewal miss rate.",
    actions: ["Rank vendors", "Filter period", "Inspect trend", "Share report"],
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
            className="rounded border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-teal-400"
          >
            <span className="text-teal-400">0{i + 1}</span>
            <p className="mt-2 text-lg">{a}</p>
          </button>
        ))}
      </div>
      {name === "compare" && (
        <div className="compare-slide mt-10 rounded border border-slate-700 p-6">
          <p className="text-sm text-slate-400">Sample usage true-up</p>
          <p className="mt-2 text-4xl text-teal-400">
            ${GOLDENS[0].usageTrueUp.trueUpDollars}{" "}
            <span className="text-base text-slate-400">
              variance ${GOLDENS[0].usageTrueUp.varianceDollars}
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A prices meter overages. B seat-renewal reports zero true-up.
          </p>
        </div>
      )}
      {name === "variances" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["trueUpDollars", GOLDENS[0].usageTrueUp.trueUpDollars],
              ["varianceDollars", GOLDENS[0].usageTrueUp.varianceDollars],
              ["trust", GOLDENS[0].usageTrueUp.trust],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-teal-400">{k}</p>
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
