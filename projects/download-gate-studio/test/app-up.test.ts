import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { describe, it } from "node:test";

describe("app up", () => {
  it("serves the landing page from the production build", async () => {
    const port = 43159;
    const child = spawn(`npm run start -- --port ${port}`, { stdio: "ignore", shell: true });
    try {
      let response: Response | undefined;
      for (let attempt = 0; attempt < 30; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        try {
          response = await fetch(`http://127.0.0.1:${port}/`);
          if (response.ok) break;
        } catch {
          /* wait */
        }
      }
      assert.equal(response?.status, 200);
      const text = await response!.text();
      assert.match(text, /Download Gate Studio/);
      assert.match(text, /Honesty|soft-sim|method-lab/i);
    } finally {
      child.kill();
      await once(child, "exit");
    }
  }, 15000);
});
