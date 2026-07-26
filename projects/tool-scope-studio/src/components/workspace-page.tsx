import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  fleets: {
    lead: "Group agents into fleets and lock shared tool-scope policies.",
    actions: ["Create fleet", "Attach policy", "Lock version", "Export JSON"],
  },
  agents: {
    lead: "Register agents and bind them to declared capability scopes.",
    actions: ["Add agent", "Assign fleet", "Set risk class", "Rotate identity"],
  },
  scopes: {
    lead: "Author capability scopes such as files, calendar, and database prefixes.",
    actions: ["Create scope", "Add prefixes", "Mark sensitive", "Version pack"],
  },
  tools: {
    lead: "Catalog tools and map each to a scope prefix before grants run.",
    actions: ["Register tool", "Map prefix", "Flag sensitive", "Deprecate tool"],
  },
  grants: {
    lead: "Review in-scope grants with a traceable decision history.",
    actions: ["Inspect grant", "Attach call", "Export CSV", "Share report"],
  },
  denials: {
    lead: "Queue out-of-scope and sensitive denials before they escape to production.",
    actions: ["Open denial", "Assign owner", "Escalate", "Resolve"],
  },
  compare: {
    lead: "Contrast scope-bound grants against open-tools baselines that ignore scopes.",
    actions: ["Run A/B compare", "Inspect deny risk", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track grant rate, sensitive denials, and open-tools exposure across fleets.",
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
            className="rounded border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-rose-400"
          >
            <span className="text-rose-400">0{i + 1}</span>
            <p className="mt-2 text-lg">{a}</p>
          </button>
        ))}
      </div>
      {name === "compare" && (
        <div className="compare-slide mt-10 rounded border border-slate-700 p-6">
          <p className="text-sm text-slate-400">Sample scope-bound result</p>
          <p className="mt-2 text-4xl text-rose-400">
            {GOLDENS[0].scopeBound.grantRate}% granted{" "}
            <span className="text-base text-slate-400">
              deny risk {GOLDENS[0].scopeBound.denyRisk}%
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A binds calls to declared scopes. B open-tools grants everything and ignores scopes.
          </p>
        </div>
      )}
      {name === "denials" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["grantRate", GOLDENS[0].scopeBound.grantRate],
              ["denyRisk", GOLDENS[0].scopeBound.denyRisk],
              ["trust", GOLDENS[0].scopeBound.trust],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-rose-400">{k}</p>
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
