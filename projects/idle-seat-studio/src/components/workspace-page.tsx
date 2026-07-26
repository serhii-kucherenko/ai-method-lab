import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  orgs: {
    lead: "Register SaaS orgs and lock seat FinOps policies per vendor.",
    actions: ["Add org", "Attach vendor", "Lock policy", "Export JSON"],
  },
  seats: {
    lead: "Import seats with monthly cost so waste can be priced in dollars.",
    actions: ["Import seats", "Set cost", "Assign owner", "Archive seat"],
  },
  activity: {
    lead: "Capture login and active-day signals that prove a seat is busy.",
    actions: ["Ingest activity", "Set threshold", "Flag idle", "Export CSV"],
  },
  waste: {
    lead: "Review idle seat waste in dollars before the renewal invoice lands.",
    actions: ["Open waste pack", "Sort by dollars", "Tag reclaim", "Share report"],
  },
  reclaim: {
    lead: "Queue reclaim candidates and track friction-adjusted savings.",
    actions: ["Create reclaim", "Assign owner", "Mark recovered", "Dismiss"],
  },
  forecasts: {
    lead: "Forecast next-cycle waste if headcount licensing continues unchanged.",
    actions: ["Run forecast", "Attach seats", "View audit", "Export report"],
  },
  compare: {
    lead: "Contrast usage-aware waste pricing against headcount-only baselines.",
    actions: ["Run A/B compare", "Inspect dollars", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track waste dollars, reclaim rate, and headcount false confidence.",
    actions: ["Rank orgs", "Filter period", "Inspect trend", "Share report"],
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
            className="rounded border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-lime-400"
          >
            <span className="text-lime-400">0{i + 1}</span>
            <p className="mt-2 text-lg">{a}</p>
          </button>
        ))}
      </div>
      {name === "compare" && (
        <div className="compare-slide mt-10 rounded border border-slate-700 p-6">
          <p className="text-sm text-slate-400">Sample usage-aware waste</p>
          <p className="mt-2 text-4xl text-lime-400">
            ${GOLDENS[0].usageAware.wasteDollars}{" "}
            <span className="text-base text-slate-400">
              reclaimable ${GOLDENS[0].usageAware.reclaimable}
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A prices idle seats from activity. B headcount-only reports zero waste.
          </p>
        </div>
      )}
      {name === "forecasts" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["wasteDollars", GOLDENS[0].usageAware.wasteDollars],
              ["reclaimable", GOLDENS[0].usageAware.reclaimable],
              ["trust", GOLDENS[0].usageAware.trust],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-lime-400">{k}</p>
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
