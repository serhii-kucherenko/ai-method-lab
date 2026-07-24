import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";
import { sampleGoldenInput } from "@/store";
import { scoreDesireFirst, scorePlaFeasibility } from "@/domain/trip";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    count: GOLDENS.length,
    sample: GOLDENS[0] ?? null,
    live: {
      input,
      plaFeasibility: scorePlaFeasibility(input),
      desireFirst: scoreDesireFirst(input),
    },
  });
}
