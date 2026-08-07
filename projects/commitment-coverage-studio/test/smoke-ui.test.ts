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

const DESK_HREFS = ["/jobs", "/lifecycle", "/scenario", "/batch", "/goldens", "/audit"] as const;

describe("smoke-ui: StudioShell IA + domain pages", () => {
  it("studio-shell primary nav includes seven domain hrefs (D-01, UI-03)", () => {
    const shellPath = join(root, "src/components/studio-shell.tsx");
    assert.ok(existsSync(shellPath), "studio-shell.tsx must exist");
    const shell = read("src/components/studio-shell.tsx");
    for (const href of DOMAIN_HREFS) {
      assert.ok(
        shell.includes(`href="${href}"`) || shell.includes(`href='${href}'`),
        `studio-shell missing primary href ${href}`,
      );
    }
    assert.ok(
      shell.includes("scoreboard") || shell.includes("/scoreboard"),
      "studio-shell must expose scoreboard",
    );
  });

  it("studio-shell primary nav omits isomorphic desk shells (UI-03)", () => {
    const shell = read("src/components/studio-shell.tsx");
    for (const desk of DESK_HREFS) {
      assert.ok(
        !shell.includes(`href="${desk}"`) && !shell.includes(`href='${desk}'`),
        `studio-shell must not primary-link ${desk}`,
      );
    }
  });

  it("commitments page uses StudioShell and Bearer api/commitments", () => {
    const page = read("src/app/commitments/page.tsx");
    assert.ok(
      page.includes("StudioShell") || page.includes("studio-shell"),
      "commitments must use StudioShell",
    );
    assert.ok(
      page.includes("/api/commitments") || page.includes("api/commitments"),
      "commitments must call /api/commitments",
    );
    assert.ok(
      page.includes("apiFetch") ||
        existsSync(join(root, "src/lib/api.ts")),
      "api client must exist for Bearer fetches",
    );
  });

  it("api.ts sends Authorization Bearer", () => {
    const apiPath = join(root, "src/lib/api.ts");
    assert.ok(existsSync(apiPath), "src/lib/api.ts must exist");
    const api = read("src/lib/api.ts");
    assert.ok(/Authorization/i.test(api), "api.ts must set Authorization");
    assert.ok(/Bearer/i.test(api), "api.ts must use Bearer");
  });

  it("imports page uses StudioShell and /api/imports", () => {
    const pagePath = join(root, "src/app/imports/page.tsx");
    assert.ok(existsSync(pagePath), "imports page must exist");
    const page = read("src/app/imports/page.tsx");
    assert.ok(page.includes("StudioShell"), "imports must use StudioShell");
    assert.ok(
      page.includes("/api/imports") || page.includes("api/imports"),
      "imports must call /api/imports",
    );
  });
});
