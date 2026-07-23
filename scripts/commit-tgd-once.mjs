import { execSync } from "node:child_process";

const msg = `Shipped Truth Game Desk with game-theoretic multi-agent truth plans and live checks.

- Added marketing landing and desk pages for jobs, lifecycle, scenario, batch, audit, goldens, honesty, and settings
- Compared challenge/payoff multi-agent plans against single-agent, majority-vote, and confidence-only baselines
- Included dual-impl goldens, tutor guide, and production app-up smoke`;

execSync(
  "git add docs/guides/README.md docs/guides/33-truth-game-desk-lessons.md docs/ideas/truth-game-desk.md docs/ideas/truth-game-desk-DESIGN.md projects/PORTFOLIO.md projects/truth-game-desk matrix/CONTROLLER.json",
  { stdio: "inherit" },
);

execSync("git commit -m " + JSON.stringify(msg), {
  stdio: "inherit",
  env: {
    ...process.env,
    GIT_AUTHOR_NAME: "AI Method Lab",
    GIT_AUTHOR_EMAIL: "lab@ai-method-lab.local",
    GIT_COMMITTER_NAME: "AI Method Lab",
    GIT_COMMITTER_EMAIL: "lab@ai-method-lab.local",
  },
});

execSync("git status --short", { stdio: "inherit" });
execSync('git log -1 --format="%H %s"', { stdio: "inherit" });
