/**
 * Live Next.js smoke: production build must succeed, then `next start`
 * must serve `/` with the product display name.
 *
 * Required before sustain / finish email (see docs/COMPREHENSIVE_PRODUCT.md).
 */
import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { DISPLAY_NAME } from "../src/claim.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isWin = process.platform === "win32";
const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");

async function freePort(): Promise<number> {
  return await new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, "127.0.0.1", () => {
      const addr = s.address();
      if (!addr || typeof addr === "string") {
        s.close();
        reject(new Error("no port"));
        return;
      }
      const port = addr.port;
      s.close((err) => (err ? reject(err) : resolve(port)));
    });
  });
}

function runNode(
  args: string[],
): Promise<{ code: number | null; out: string }> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    let out = "";
    child.stdout?.on("data", (b) => {
      out += String(b);
    });
    child.stderr?.on("data", (b) => {
      out += String(b);
    });
    child.on("close", (code) => resolve({ code, out }));
  });
}

async function killTree(child: ChildProcess): Promise<void> {
  if (!child.pid) return;
  if (isWin) {
    await new Promise<void>((resolve) => {
      const killer = spawn(
        "cmd.exe",
        ["/c", "taskkill", "/pid", String(child.pid), "/T", "/F"],
        { stdio: "ignore", windowsHide: true },
      );
      killer.on("close", () => resolve());
    });
    return;
  }
  child.kill("SIGTERM");
  await delay(300);
  try {
    child.kill("SIGKILL");
  } catch {
    /* gone */
  }
}

describe("app-up live smoke", () => {
  it(
    "next build succeeds and next start serves the landing",
    { timeout: 300_000 },
    async () => {
      const build = await runNode([nextBin, "build"]);
      assert.equal(
        build.code,
        0,
        `next build failed:\n${build.out.slice(-4000)}`,
      );

      const port = await freePort();
      const child = spawn(
        process.execPath,
        [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)],
        {
          cwd: root,
          env: { ...process.env, PORT: String(port) },
          stdio: ["ignore", "pipe", "pipe"],
          windowsHide: true,
        },
      );
      let boot = "";
      child.stdout?.on("data", (b) => {
        boot += String(b);
      });
      child.stderr?.on("data", (b) => {
        boot += String(b);
      });

      let ok = false;
      let lastErr = "";
      try {
        for (let i = 0; i < 60; i++) {
          await delay(500);
          try {
            const res = await fetch(`http://127.0.0.1:${port}/`);
            const body = await res.text();
            if (res.ok && body.includes(DISPLAY_NAME)) {
              ok = true;
              break;
            }
            lastErr = `status ${res.status}, missing ${DISPLAY_NAME}`;
          } catch (e) {
            lastErr = e instanceof Error ? e.message : String(e);
          }
        }
        assert.equal(
          ok,
          true,
          `app not up on :${port}: ${lastErr}\nboot:\n${boot.slice(-2000)}`,
        );
      } finally {
        await killTree(child);
      }
    },
  );
});
