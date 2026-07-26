import { StudioShell } from "@/components/studio-shell";
import { GOLDENS } from "@/goldens";

const data: Record<string, { lead: string; actions: string[] }> = {
  plants: {
    lead: "Register plant cells and lock OT download policies per line.",
    actions: ["Add plant", "Set risk class", "Lock policy", "Export JSON"],
  },
  programs: {
    lead: "Track PLC/ICS program revisions waiting for a gated download.",
    actions: ["Register program", "Set risk score", "Attach plant", "Diff revision"],
  },
  interlocks: {
    lead: "Define critical and soft interlock checks that must pass before download.",
    actions: ["Add interlock", "Mark critical", "Record state", "Fail closed"],
  },
  permits: {
    lead: "Collect signed change permits that authorize a maintenance download.",
    actions: ["Create permit", "Collect signature", "Bind program", "Expire permit"],
  },
  downloads: {
    lead: "Queue download attempts and keep a traceable gate decision history.",
    actions: ["Request download", "Inspect gate", "Approve hold", "Export audit"],
  },
  holds: {
    lead: "Hold risky downloads when interlocks fail even inside a maintenance window.",
    actions: ["Open hold", "Assign owner", "Resolve check", "Release gate"],
  },
  compare: {
    lead: "Contrast interlock-aware gates against calendar-window-only baselines.",
    actions: ["Run A/B compare", "Inspect hold risk", "Choose winner", "Export result"],
  },
  scoreboard: {
    lead: "Track blocked downloads, false calendar opens, and interlock coverage.",
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
            className="rounded border border-slate-700 bg-slate-900/70 p-5 text-left hover:border-cyan-400"
          >
            <span className="text-cyan-400">0{i + 1}</span>
            <p className="mt-2 text-lg">{a}</p>
          </button>
        ))}
      </div>
      {name === "compare" && (
        <div className="compare-slide mt-10 rounded border border-slate-700 p-6">
          <p className="text-sm text-slate-400">Sample interlock-aware gate</p>
          <p className="mt-2 text-4xl text-cyan-400">
            {GOLDENS[0].interlockAware.gateOpen ? "OPEN" : "HOLD"}{" "}
            <span className="text-base text-slate-400">
              score {GOLDENS[0].interlockAware.score} · risk {GOLDENS[0].interlockAware.holdRisk}%
            </span>
          </p>
          <p className="mt-3 text-sm text-slate-300">
            A requires signed permits and critical interlocks. B opens whenever the calendar window is
            active.
          </p>
        </div>
      )}
      {name === "holds" && (
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            [
              ["gateOpen", GOLDENS[0].interlockAware.gateOpen ? 1 : 0],
              ["holdRisk", GOLDENS[0].interlockAware.holdRisk],
              ["trust", GOLDENS[0].interlockAware.trust],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded border border-slate-700 p-4">
              <p className="text-xs uppercase tracking-wide text-cyan-400">{k}</p>
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
