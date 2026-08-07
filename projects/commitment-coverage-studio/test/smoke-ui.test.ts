import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = join(import.meta.dirname, "..");

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

const DOMAIN_ROUTES = [
  "commitments",
  "coverage",
  "gaps",
  "renewals",
  "imports",
  "compare",
  "scoreboard",
] as const;

const DOMAIN_HREFS = DOMAIN_ROUTES.map((r) => `/${r}`);

const DESK_HREFS = [
  "/jobs",
  "/lifecycle",
  "/scenario",
  "/batch",
  "/goldens",
  "/audit",
] as const;

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

  it("api.ts sends Authorization Bearer", () => {
    const apiPath = join(root, "src/lib/api.ts");
    assert.ok(existsSync(apiPath), "src/lib/api.ts must exist");
    const api = read("src/lib/api.ts");
    assert.ok(/Authorization/i.test(api), "api.ts must set Authorization");
    assert.ok(/Bearer/i.test(api), "api.ts must use Bearer");
  });

  it("commitments page uses StudioShell and Bearer api/commitments", () => {
    const page = read("src/app/commitments/page.tsx");
    assert.ok(page.includes("StudioShell"), "commitments must use StudioShell");
    assert.ok(
      page.includes("/api/commitments") || page.includes("api/commitments"),
      "commitments must call /api/commitments",
    );
  });

  it("imports page uses StudioShell and /api/imports", () => {
    const page = read("src/app/imports/page.tsx");
    assert.ok(page.includes("StudioShell"), "imports must use StudioShell");
    assert.ok(
      page.includes("/api/imports") || page.includes("api/imports"),
      "imports must call /api/imports",
    );
  });

  it("coverage page uses StudioShell, api/coverage, and CoverageBar motion", () => {
    const page = read("src/app/coverage/page.tsx");
    assert.ok(page.includes("StudioShell"), "coverage must use StudioShell");
    assert.ok(
      page.includes("/api/coverage") || page.includes("api/coverage"),
      "coverage must call /api/coverage",
    );
    assert.ok(
      page.includes("CoverageBar") || page.includes("coverage-bar"),
      "coverage must use CoverageBar",
    );
    const bar = read("src/components/coverage-bar.tsx");
    assert.ok(
      bar.includes("transition") || bar.includes("coverage-bar-fill"),
      "CoverageBar must animate fill",
    );
  });

  it("gaps page uses StudioShell and unused_commit / ondemand_spill", () => {
    const page = read("src/app/gaps/page.tsx");
    assert.ok(page.includes("StudioShell"), "gaps must use StudioShell");
    assert.ok(
      page.includes("/api/gaps") || page.includes("api/gaps"),
      "gaps must call /api/gaps",
    );
    assert.ok(page.includes("unused_commit"), "gaps must show unused_commit");
    assert.ok(
      page.includes("ondemand_spill"),
      "gaps must show ondemand_spill",
    );
  });

  it("compare page uses StudioShell and commit_vs_ondemand", () => {
    const page = read("src/app/compare/page.tsx");
    assert.ok(page.includes("StudioShell"), "compare must use StudioShell");
    assert.ok(
      page.includes("commit_vs_ondemand"),
      "compare must use commit_vs_ondemand",
    );
    assert.ok(
      page.includes("/api/compares") || page.includes("api/compares"),
      "compare must call /api/compares",
    );
  });

  it("scoreboard page uses StudioShell and api/scoreboard", () => {
    assert.ok(
      existsSync(join(root, "src/app/api/scoreboard/route.ts")),
      "scoreboard API must exist",
    );
    const page = read("src/app/scoreboard/page.tsx");
    assert.ok(page.includes("StudioShell"), "scoreboard must use StudioShell");
    assert.ok(
      page.includes("/api/scoreboard") || page.includes("api/scoreboard"),
      "scoreboard must call /api/scoreboard",
    );
  });

  it("renewals page uses StudioShell, pack recommendations, and /api/renewals", () => {
    const page = read("src/app/renewals/page.tsx");
    assert.ok(page.includes("StudioShell"), "renewals must use StudioShell");
    assert.ok(
      page.includes("/api/renewals") || page.includes("api/renewals"),
      "renewals must call /api/renewals",
    );
    assert.ok(
      page.includes("recommendedAction") ||
        (page.includes("buy") &&
          page.includes("reduce") &&
          page.includes("hold")),
      "renewals must reference recommendedAction or buy/reduce/hold",
    );
    assert.ok(
      page.includes("No renew-by dates") ||
        page.includes("lock_end") ||
        page.includes("renew-by") ||
        page.includes("Renew-by"),
      "renewals must keep renew-by empty copy or lock_end language",
    );
  });

  it("all seven domain pages exist and wrap StudioShell (D-01, UI-03)", () => {
    for (const route of DOMAIN_ROUTES) {
      const rel = `src/app/${route}/page.tsx`;
      assert.ok(existsSync(join(root, rel)), `${rel} must exist`);
      const page = read(rel);
      assert.ok(
        page.includes("StudioShell"),
        `${route} page must import/render StudioShell`,
      );
    }
  });

  it("settings page wires org/members and audit under settings (PLT-01, PLT-04)", () => {
    const page = read("src/app/settings/page.tsx");
    assert.ok(page.includes("StudioShell"), "settings must use StudioShell");
    assert.ok(
      page.includes("/api/org") || page.includes("api/org"),
      "settings must call /api/org",
    );
    assert.ok(
      page.includes("/api/members") || page.includes("api/members"),
      "settings must call /api/members",
    );
    assert.ok(
      page.includes("/api/audit") || page.includes("api/audit"),
      "settings must surface audit via /api/audit",
    );
    assert.ok(/Audit/i.test(page), "settings must show Audit section");
  });

  it("studio-shell keeps settings as footer utility, not eighth primary nav (D-12)", () => {
    const shell = read("src/components/studio-shell.tsx");
    assert.ok(
      shell.includes('href="/settings"') || shell.includes("href='/settings'"),
      "studio-shell must link settings as utility",
    );
    const primaryBlock =
      shell.match(
        /aria-label="Studio primary"[\s\S]*?<\/nav>/,
      )?.[0] ?? "";
    assert.ok(primaryBlock.length > 0, "primary nav block must exist");
    assert.ok(
      !primaryBlock.includes("/settings"),
      "settings must not be in primary domain nav",
    );
    for (const href of DOMAIN_HREFS) {
      assert.ok(
        primaryBlock.includes(`href="${href}"`) ||
          primaryBlock.includes(`href='${href}'`),
        `primary nav must still include ${href}`,
      );
    }
  });
});
