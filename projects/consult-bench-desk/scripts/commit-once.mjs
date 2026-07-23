import { execSync } from "node:child_process";

const msg =
  "Shipped Consult Bench Desk with multimodal-realworld plans and live checks.\n";

execSync(`git commit -m ${JSON.stringify(msg)}`, {
  stdio: "inherit",
  env: {
    ...process.env,
    GIT_AUTHOR_NAME: "AI Method Lab",
    GIT_AUTHOR_EMAIL: "lab@ai-method-lab.local",
    GIT_COMMITTER_NAME: "AI Method Lab",
    GIT_COMMITTER_EMAIL: "lab@ai-method-lab.local",
  },
});
