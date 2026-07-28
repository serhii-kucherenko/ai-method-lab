import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  plants: {
    lead: "Register plants and lock change-freeze policies per line.",
    actions: ["Add plant", "Set risk class", "Lock policy", "Export JSON"],
  },
  freezes: {
    lead: "Declare freeze periods that block unapproved production changes.",
    actions: ["Create freeze", "Set start", "Set end", "Publish"],
  },
  windows: {
    lead: "Define maintenance windows where exceptions may be granted.",
    actions: ["Add window", "Bind freeze", "Set owners", "Review calendar"],
  },
  requests: {
    lead: "Queue change requests and evaluate them against active freezes.",
    actions: ["Log request", "Score risk", "Request exception", "Hold change"],
  },
  violations: {
    lead: "Capture freeze violations when risky changes proceed without approval.",
    actions: ["Open violation", "Assign owner", "Escalate", "Close"],
  },
  approvals: {
    lead: "Grant or deny freeze exceptions with an auditable trail.",
    actions: ["Review exception", "Approve", "Deny", "Export audit"],
  },
  compare: {
    lead: "Contrast freeze-aware holds against always-allow baselines.",
    actions: ["Run A/B compare", "Inspect hold rate", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track hold rate, violation count, and always-allow drift.",
    actions: ["Rank plants", "Filter period", "Inspect trend", "Share report"],
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
            className="rounded border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-yellow-400"
          >
            <span className="text-yellow-400">0{i + 1}</span>
            <p className="mt-2 text-lg">{a}</p>
          </button>
        ))}
      </div>
      {name === "compare" && (
        <div className="compare-slide mt-10 rounded border border-slate-700 p-6">
          <p className="text-sm text-slate-400">Sample freeze-aware result</p>
          <p className="mt-2 text-4xl text-yellow-400">
            {GOLDENS[0].freezeAware.holdRate}% held{" "}
            <span className="text-base text-slate-400">
              violations {GOLDENS[0].freezeAware.violationCount}
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A holds unapproved freeze-window changes. B always-allow lets them through.
          </p>
        </div>
      )}
      {name === "approvals" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["holdRate", GOLDENS[0].freezeAware.holdRate],
              ["violationCount", GOLDENS[0].freezeAware.violationCount],
              ["trust", GOLDENS[0].freezeAware.trust],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-yellow-400">{k}</p>
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
