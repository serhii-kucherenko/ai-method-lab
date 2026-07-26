#!/usr/bin/env node
/**
 * Capture live platform screenshots into projects/<slug>/screenshots/
 * and ensure README.md embeds them.
 *
 * Usage:
 *   node scripts/capture-product-screenshots.mjs projects/<slug>
 *   node scripts/capture-product-screenshots.mjs projects/<slug> --start
 *   node scripts/capture-product-screenshots.mjs projects/<slug> --base http://127.0.0.1:3000
 *   node scripts/capture-product-screenshots.mjs projects/<slug> --paths /,/packs,/pricing,/demo,/onboarding
 */
import { spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:net";
import { dirname, join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const DEFAULT_PATHS = [
  { path: "/", file: "01-landing.png", label: "Landing" },
  { path: "/pricing", file: "03-pricing.png", label: "Pricing" },
  { path: "/demo", file: "04-demo.png", label: "Demo" },
  { path: "/onboarding", file: "05-onboarding.png", label: "Onboarding" },
  { path: "/flows", file: "06-flows.png", label: "Flows" },
];

const WORKSPACE_CANDIDATES = [
  "/packs",
  "/workspace",
  "/jobs",
  "/dashboard",
  "/bench",
  "/cases",
  "/scenarios",
  "/compare",
  "/runs",
  "/studio",
];

function parseArgs(argv) {
  const args = {
    productRel: null,
    start: false,
    base: null,
    paths: null,
    port: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--start") args.start = true;
    else if (a === "--base") args.base = argv[++i];
    else if (a === "--paths") args.paths = argv[++i];
    else if (a === "--port") args.port = Number(argv[++i]);
    else if (!a.startsWith("-") && !args.productRel) args.productRel = a;
  }
  if (!args.productRel) {
    console.error(
      "Usage: node scripts/capture-product-screenshots.mjs projects/<slug> [--start] [--base URL] [--paths /,/pricing,...]",
    );
    process.exit(1);
  }
  return args;
}

async function freePort() {
  return await new Promise((resolvePort, reject) => {
    const s = createServer();
    s.listen(0, "127.0.0.1", () => {
      const addr = s.address();
      if (!addr || typeof addr === "string") {
        s.close();
        reject(new Error("no port"));
        return;
      }
      const port = addr.port;
      s.close((err) => (err ? reject(err) : resolvePort(port)));
    });
  });
}

async function waitForOk(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.ok || res.status === 404) return true;
    } catch {
      /* retry */
    }
    await delay(500);
  }
  return false;
}

function detectWorkspacePath(productDir) {
  const appRoots = [
    join(productDir, "src", "app"),
    join(productDir, "app"),
  ];
  for (const root of appRoots) {
    if (!existsSync(root)) continue;
    for (const candidate of WORKSPACE_CANDIDATES) {
      const seg = candidate.slice(1);
      const page = join(root, seg, "page.tsx");
      if (existsSync(page)) return candidate;
    }
  }
  return null;
}

function buildShotList(productDir, pathOverride) {
  if (pathOverride) {
    return pathOverride.split(",").map((raw, i) => {
      const path = raw.trim().startsWith("/") ? raw.trim() : `/${raw.trim()}`;
      const slug = path === "/" ? "landing" : path.slice(1).replace(/\//g, "-");
      return {
        path,
        file: `${String(i + 1).padStart(2, "0")}-${slug}.png`,
        label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    });
  }

  const shots = [{ ...DEFAULT_PATHS[0] }];
  const workspace = detectWorkspacePath(productDir);
  if (workspace) {
    shots.push({
      path: workspace,
      file: "02-workspace.png",
      label: "Primary workspace",
    });
  }
  shots.push(...DEFAULT_PATHS.slice(1));
  return shots;
}

async function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    /* install below */
  }

  console.log("Installing playwright (one-time for screenshot capture)...");
  await new Promise((resolveInstall, reject) => {
    const child = spawn(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["install", "--no-save", "playwright@1.55.0"],
      { cwd: repoRoot, stdio: "inherit", env: process.env },
    );
    child.on("close", (code) =>
      code === 0 ? resolveInstall() : reject(new Error(`npm install playwright failed: ${code}`)),
    );
  });

  const pw = require("playwright");
  // Ensure Chromium is present; ignore if already cached.
  await new Promise((resolveInstall) => {
    const child = spawn(
      process.execPath,
      [join(repoRoot, "node_modules", "playwright", "cli.js"), "install", "chromium"],
      { cwd: repoRoot, stdio: "inherit", env: process.env },
    );
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      resolveInstall();
    }, 120_000);
    child.on("close", () => {
      clearTimeout(timer);
      resolveInstall();
    });
  });
  return pw;
}

function ensureReadmeScreenshots(readmePath, shots) {
  const block = [
    "## Screenshots",
    "",
    ...shots.flatMap((s) => [
      `### ${s.label}`,
      "",
      `![${s.label}](screenshots/${s.file})`,
      "",
    ]),
  ].join("\n");

  let readme = existsSync(readmePath)
    ? readFileSync(readmePath, "utf8")
    : "# Product\n\n";

  if (/^## Screenshots\b/m.test(readme)) {
    readme = readme.replace(
      /^## Screenshots\b[\s\S]*?(?=^## |\Z)/m,
      `${block}\n`,
    );
  } else {
    const lines = readme.split("\n");
    let insertAt = 1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].startsWith("## ")) {
        insertAt = i;
        break;
      }
      insertAt = i + 1;
    }
    lines.splice(insertAt, 0, "", block);
    readme = lines.join("\n").replace(/\n{3,}/g, "\n\n");
  }

  writeFileSync(readmePath, readme.endsWith("\n") ? readme : `${readme}\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const productDir = resolve(repoRoot, args.productRel);
  if (!existsSync(productDir)) {
    console.error(`Product not found: ${productDir}`);
    process.exit(1);
  }

  const outDir = join(productDir, "screenshots");
  mkdirSync(outDir, { recursive: true });
  const shots = buildShotList(productDir, args.paths);

    let child = null;
  let base = args.base;
  try {
    if (!base) {
      if (!args.start) {
        console.error("Pass --start (boots next start) or --base http://127.0.0.1:PORT");
        process.exit(1);
      }
      const port = args.port || (await freePort());
      base = `http://127.0.0.1:${port}`;
      const nextBin = join(productDir, "node_modules", "next", "dist", "bin", "next");
      if (!existsSync(nextBin)) {
        console.error(`Next not installed in ${productDir}. Run npm install there first.`);
        process.exit(1);
      }
      if (!existsSync(join(productDir, ".next", "BUILD_ID"))) {
        console.log("No production build found; running next build ...");
        const build = await new Promise((resolveBuild) => {
          const b = spawn(process.execPath, [nextBin, "build"], {
            cwd: productDir,
            env: process.env,
            stdio: "inherit",
          });
          b.on("close", (code) => resolveBuild(code));
        });
        if (build !== 0) {
          console.error("next build failed");
          process.exit(1);
        }
      }
      console.log(`Starting next start on ${base} ...`);
      child = spawn(
        process.execPath,
        [nextBin, "start", "-H", "127.0.0.1", "-p", String(new URL(base).port)],
        {
          cwd: productDir,
          env: { ...process.env, PORT: String(new URL(base).port) },
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
      let bootLog = "";
      child.stdout?.on("data", (b) => {
        bootLog += String(b);
      });
      child.stderr?.on("data", (b) => {
        bootLog += String(b);
      });
      const ok = await waitForOk(base);
      if (!ok) {
        console.error("Server did not become ready.\n", bootLog.slice(-2000));
        process.exit(1);
      }
    }

    const { chromium } = await loadPlaywright();
    const browser = await chromium.launch({
      headless: true,
      channel: "chrome",
    });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });

    const captured = [];
    for (const shot of shots) {
      const url = new URL(shot.path, base).href;
      const res = await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => null);
      if (!res || res.status() >= 500) {
        console.warn(`Skip ${shot.path} (status ${res?.status() ?? "nav fail"})`);
        continue;
      }
      if (res.status() === 404 && shot.path !== "/") {
        console.warn(`Skip ${shot.path} (404)`);
        continue;
      }
      await delay(400);
      const dest = join(outDir, shot.file);
      await page.screenshot({ path: dest, fullPage: false });
      console.log(`Wrote ${dest}`);
      captured.push(shot);
    }

    await browser.close();

    if (captured.length < 3) {
      console.error(
        `Only captured ${captured.length} screenshots; need at least landing + pricing/demo + one more.`,
      );
      process.exit(1);
    }

    ensureReadmeScreenshots(join(productDir, "README.md"), captured);
    console.log(`Updated ${join(productDir, "README.md")} with ${captured.length} screenshots.`);
    console.log(
      `Done. Existing files: ${readdirSync(outDir).filter((f) => f.endsWith(".png")).join(", ")}`,
    );
  } finally {
    if (child?.pid) {
      child.kill("SIGTERM");
      await delay(300);
      try {
        child.kill("SIGKILL");
      } catch {
        /* gone */
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
