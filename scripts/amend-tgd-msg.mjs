import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";

const msgPath = "scripts/_commit-msg-tgd.txt";
writeFileSync(
  msgPath,
  `Shipped Truth Game Desk with game-theoretic multi-agent truth plans and live checks.

- Added marketing landing and desk pages for jobs, lifecycle, scenario, batch, audit, goldens, honesty, and settings
- Compared challenge/payoff multi-agent plans against single-agent, majority-vote, and confidence-only baselines
- Included dual-impl goldens, tutor guide, and production app-up smoke
`,
);

execSync(`git commit --amend -F ${msgPath}`, {
  stdio: "inherit",
  env: {
    ...process.env,
    GIT_AUTHOR_NAME: "AI Method Lab",
    GIT_AUTHOR_EMAIL: "lab@ai-method-lab.local",
    GIT_COMMITTER_NAME: "AI Method Lab",
    GIT_COMMITTER_EMAIL: "lab@ai-method-lab.local",
  },
});

unlinkSync(msgPath);
execSync('git log -1 --format="%H%n%s%n%b"', { stdio: "inherit" });
