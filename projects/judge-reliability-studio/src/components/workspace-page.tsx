import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  judges: {
    lead: "Create, lock, version, archive, and export judge packs before they score production traffic.",
    actions: ["Create judge pack", "Lock version", "Archive pack", "Export JSON"],
  },
  items: {
    lead: "Search, filter, weight, reorder, and anchor the scoreable items a judge pack uses.",
    actions: ["Add item", "Reorder weights", "Search responses", "Filter gaps"],
  },
  forms: {
    lead: "Build forms and instruments that bind items into a repeatable measurement run.",
    actions: ["Create form", "Bind items", "Set instrument", "Review structure"],
  },
  diagnostics: {
    lead: "Run IRT diagnostic passes, attach item responses, and keep a traceable reliability record.",
    actions: ["Start diagnostic", "Attach responses", "View audit", "Export CSV"],
  },
  flags: {
    lead: "Review unreliable items and unstable judges where IRT trust is too thin.",
    actions: ["Open flag", "Assign reviewer", "Resolve", "Dismiss"],
  },
  compare: {
    lead: "Contrast the IRT-aware reliability path with an agreement-only baseline.",
    actions: ["Run A/B compare", "Inspect IRT panels", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track judge reliability, item discrimination, flag rate, and form fit.",
    actions: ["Rank judges", "Filter period", "Inspect trend", "Share report"],
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
          <p className="text-sm text-slate-400">Sample IRT reliability score</p>
          <p className="mt-2 text-4xl text-teal-400">
            {GOLDENS[0].irt.score}{" "}
            <span className="text-base text-slate-400">trust {GOLDENS[0].irt.trust}%</span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A carries ability {GOLDENS[0].irt.ability}, discrimination{" "}
            {GOLDENS[0].irt.discrimination}, and escalates low trust. B emits one agreement score
            with no IRT diagnostics.
          </p>
        </div>
      )}
      {name === "diagnostics" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(["ability", "difficulty", "discrimination"] as const).map((k) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-teal-400">{k}</p>
              <p className="mt-2 text-3xl">{GOLDENS[0].irt[k]}</p>
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
