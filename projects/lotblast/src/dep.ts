export type DepClient = {
  notify: (event: string, payload: Record<string, unknown>) => Promise<{ ok: boolean }>;
  notifyPartner: (
    partner: string,
    payload: Record<string, unknown>,
  ) => Promise<{ ok: boolean; partner: string }>;
  failures: number;
};

export function createMockDep(
  opts?: { failTimes?: number; failPartnerTimes?: number },
): DepClient {
  let remaining = opts?.failTimes ?? 0;
  let partnerRemaining = opts?.failPartnerTimes ?? 0;
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
    async notifyPartner(partner, payload) {
      if (partnerRemaining > 0) {
        partnerRemaining -= 1;
        this.failures += 1;
        throw new Error(`dep 5xx for partner ${partner}`);
      }
      return { ok: true, partner, ...payload };
    },
  };
}
