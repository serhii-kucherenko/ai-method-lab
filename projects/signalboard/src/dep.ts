import { randomUUID } from "node:crypto";

export type DepClient = {
  charge: (
    amount: number,
  ) => Promise<{ ok: true; id: string } | { ok: false; error: string }>;
};

export function createMockDep(
  opts: { fail?: boolean; timeoutMs?: number } = {},
): DepClient {
  return {
    async charge() {
      if (opts.timeoutMs) {
        await new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("dependency timeout")), opts.timeoutMs);
        });
      }
      if (opts.fail) return { ok: false, error: "dependency 5xx" };
      return { ok: true, id: `prov_${randomUUID()}` };
    },
  };
}
