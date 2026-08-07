import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = join(import.meta.dirname, "..");

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

describe("smoke-mkt: DESIGN tokens and brand landing", () => {
  it("DESIGN.md and globals.css expose ink/paper/accent/gap tokens", () => {
    assert.ok(existsSync(join(root, "DESIGN.md")), "DESIGN.md must exist");
    const design = read("DESIGN.md");
    const globals = read("src/app/globals.css");

    for (const token of [
      "--color-ink",
      "--color-paper",
      "--color-accent",
      "--color-gap",
    ]) {
      assert.ok(design.includes(token), `DESIGN.md missing ${token}`);
      assert.ok(globals.includes(token), `globals.css missing ${token}`);
    }
    assert.ok(design.includes("Fraunces"), "DESIGN.md must name Fraunces");
  });

  it("landing copy includes display name and locked headline", () => {
    const page = read("src/app/page.tsx");
    const claimPath = join(root, "src/lib/claim.ts");
    const claim = existsSync(claimPath) ? read("src/lib/claim.ts") : "";
    const blob = `${page}\n${claim}`;

    assert.ok(
      blob.includes("Commitment Coverage Studio"),
      "missing display name Commitment Coverage Studio",
    );
    assert.ok(
      blob.includes("See commitment waste in dollars before renewal"),
      "missing locked landing headline",
    );
  });

  it("layout loads Fraunces, Source Sans 3, and IBM Plex Mono via next/font/google", () => {
    const layout = read("src/app/layout.tsx");
    assert.ok(
      layout.includes('from "next/font/google"') ||
        layout.includes("from 'next/font/google'"),
      "layout must import next/font/google",
    );
    assert.ok(layout.includes("Fraunces"), "layout must load Fraunces");
    assert.ok(
      layout.includes("Source_Sans_3"),
      "layout must load Source_Sans_3",
    );
    assert.ok(
      layout.includes("IBM_Plex_Mono"),
      "layout must load IBM_Plex_Mono",
    );
  });

  it("landing below-fold includes Problem, Product, Honesty tease and links to /honesty", () => {
    const page = read("src/app/page.tsx");
    const claim = existsSync(join(root, "src/lib/claim.ts"))
      ? read("src/lib/claim.ts")
      : "";
    const below = existsSync(join(root, "src/components/landing/below-fold.tsx"))
      ? read("src/components/landing/below-fold.tsx")
      : "";
    const blob = `${page}\n${claim}\n${below}`;

    assert.ok(/Problem/i.test(blob), "landing must include Problem section");
    assert.ok(/Product/i.test(blob), "landing must include Product section");
    assert.ok(/Honesty/i.test(blob), "landing must include Honesty tease");
    assert.ok(
      blob.includes('href="/honesty"') || blob.includes("href='/honesty'"),
      "landing must link to /honesty",
    );
  });

  it("first viewport has no invented numeric KPI strip", () => {
    const page = read("src/app/page.tsx");
    const heroSlice = page.split(/BelowFold|below-fold/i)[0] ?? page;
    assert.ok(
      !/\b\d{2,}%\b/.test(heroSlice) && !/\$\d{2,}/.test(heroSlice),
      "hero must not invent numeric KPI metrics",
    );
  });

  it("honesty page states soft-sim fence, not Idle Seat or True Up, with Sources", () => {
    const honestyPath = join(root, "src/app/honesty/page.tsx");
    assert.ok(existsSync(honestyPath), "src/app/honesty/page.tsx must exist");
    const honesty = read("src/app/honesty/page.tsx");
    const claim = existsSync(join(root, "src/lib/claim.ts"))
      ? read("src/lib/claim.ts")
      : "";
    const blob = `${honesty}\n${claim}`;

    assert.ok(/soft-sim/i.test(blob), "honesty must state soft-sim");
    assert.ok(
      /system of record/i.test(blob) || /billing/i.test(blob),
      "honesty must fence cloud billing system of record",
    );
    assert.ok(/Idle Seat/i.test(blob), "honesty must name Idle Seat");
    assert.ok(/True Up/i.test(blob), "honesty must name True Up");
    assert.ok(/Sources/i.test(blob), "honesty must include Sources");
    assert.ok(
      honesty.includes('from "@/lib/claim"') ||
        honesty.includes("from '@/lib/claim'"),
      "honesty must import shared copy from @/lib/claim",
    );
  });

  it("CTA placeholders exist for /commitments and /demo", () => {
    assert.ok(
      existsSync(join(root, "src/app/commitments/page.tsx")),
      "commitments placeholder must exist",
    );
    assert.ok(
      existsSync(join(root, "src/app/demo/page.tsx")),
      "demo placeholder must exist",
    );
  });

  it("primary marketing routes avoid isomorphic desk IA links", () => {
    const files = [
      "src/app/page.tsx",
      "src/components/landing/below-fold.tsx",
      "src/app/honesty/page.tsx",
      "src/app/commitments/page.tsx",
      "src/app/demo/page.tsx",
      "src/app/pricing/page.tsx",
      "src/app/onboarding/page.tsx",
      "src/app/flows/page.tsx",
    ];
    const blob = files
      .filter((rel) => existsSync(join(root, rel)))
      .map((rel) => read(rel))
      .join("\n");

    for (const desk of ["/jobs", "/lifecycle", "/scenario", "/batch"]) {
      assert.ok(
        !blob.includes(`href="${desk}"`) && !blob.includes(`href='${desk}'`),
        `marketing IA must not link to ${desk}`,
      );
    }
  });
});

describe("smoke-mkt: commercial surfaces COM-01..04", () => {
  it("/pricing shows seat + connected-account tiers and no live checkout (COM-01, D-03)", () => {
    const rel = "src/app/pricing/page.tsx";
    assert.ok(existsSync(join(root, rel)), "pricing page must exist");
    const page = read(rel);
    assert.ok(/seat/i.test(page), "pricing must mention seats");
    assert.ok(
      /connected.?account/i.test(page),
      "pricing must mention connected-account tiers",
    );
    assert.ok(
      /no live (card )?checkout/i.test(page) ||
        (/soft-sim/i.test(page) && /checkout/i.test(page)),
      "pricing must state soft-sim / no live card checkout",
    );
    assert.ok(
      page.includes('href="/demo"') || page.includes("href='/demo'"),
      "pricing must CTA to /demo",
    );
    assert.ok(
      !/card number|stripe|payment form|credit card/i.test(page),
      "pricing must not add live payment capture",
    );
  });

  it("/demo guides Import → Match → Gap → Renew with A vs B (COM-02, D-04)", () => {
    const page = read("src/app/demo/page.tsx");
    assert.ok(/Import/i.test(page), "demo must include Import step");
    assert.ok(/Match/i.test(page), "demo must include Match step");
    assert.ok(/Gap/i.test(page), "demo must include Gap step");
    assert.ok(/Renew/i.test(page), "demo must include Renew step");
    assert.ok(
      /A\s*vs\s*B|compare/i.test(page),
      "demo must include A vs B compare step",
    );
    for (const href of ["/imports", "/gaps", "/compare", "/renewals"]) {
      assert.ok(
        page.includes(`href="${href}"`) || page.includes(`href='${href}'`),
        `demo must CTA to ${href}`,
      );
    }
    assert.ok(
      page.includes('href="/commitments"') ||
        page.includes("href='/commitments'") ||
        page.includes('href="/coverage"') ||
        page.includes("href='/coverage'"),
      "demo Match step must link /commitments or /coverage",
    );
  });

  it("pricing and demo avoid isomorphic desk IA links (D-12)", () => {
    const files = ["src/app/pricing/page.tsx", "src/app/demo/page.tsx"];
    const blob = files
      .filter((rel) => existsSync(join(root, rel)))
      .map((rel) => read(rel))
      .join("\n");

    for (const desk of ["/jobs", "/lifecycle", "/scenario", "/batch"]) {
      assert.ok(
        !blob.includes(`href="${desk}"`) && !blob.includes(`href='${desk}'`),
        `commercial IA must not link to ${desk}`,
      );
    }
  });
});
