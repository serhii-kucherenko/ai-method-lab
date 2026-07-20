export type DepClient = {
  notify: (event: string, payload: Record<string, unknown>) => Promise<{ ok: boolean }>;
  failures: number;
};

export function createMockDep(opts?: { failTimes?: number }): DepClient {
  let remaining = opts?.failTimes ?? 0;
  return {
    failures: 0,
    async notify(event, payload) {
      if (remaining > 0) {
        remaining -= 1;
        this.failures += 1;
        throw new Error(`dep failed for ${event}`);
      }
      return { ok: true, event, ...payload } as { ok: boolean };
    },
  };
}
