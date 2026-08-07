import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = join(import.meta.dirname, "..");

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

const DOMAIN_HREFS = [
  "/commitments",
  "/coverage",
  "/gaps",
  "/renewals",
  "/imports",
  "/compare",
  "/scoreboard",
] as const;

describe("smoke-ui: StudioShell IA + live /commitments", () => {
  it("studio-shell primary nav includes the seven domain hrefs", () => {
    const shellPath = join(root, "src/components/studio-shell.tsx");
    assert.ok(existsSync(shellPath), "studio-shell.tsx must exist");
    const shell = read("src/components/studio-shell.tsx");
    for (const href of DOMAIN_HREFS) {
      assert.ok(
        shell.includes(`href="${href}"`) || shell.includes(`href='${href}'`),
        `StudioShell must link to ${href}`,
      );
    }
    assert.ok(
      shell.includes("scoreboard"),
      "StudioShell must expose scoreboard in primary nav",
    );
  });

  it("commitments page uses StudioShell and Bearer commitments API", () => {
    const pagePath = join(root, "src/app/commitments/page.tsx");
    assert.ok(existsSync(pagePath), "commitments page must exist");
    const page = read("src/app/commitments/page.tsx");
    assert.ok(
      page.includes("StudioShell"),
      "commitments page must use StudioShell",
    );
    assert.ok(
      page.includes("/api/commitments") || page.includes("api/commitments"),
      "commitments page must call /api/commitments",
    );
  });

  it("api client attaches Authorization Bearer", () => {
    const apiPath = join(root, "src/lib/api.ts");
    assert.ok(existsSync(apiPath), "api.ts must exist");
    const api = read("src/lib/api.ts");
    assert.ok(/Authorization/i.test(api), "api.ts must set Authorization");
    assert.ok(/Bearer/i.test(api), "api.ts must use Bearer scheme");
  });
});
