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
});
