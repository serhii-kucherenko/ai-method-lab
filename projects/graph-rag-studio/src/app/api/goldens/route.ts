import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";
import { scoreMultiStep, scoreSingleShot } from "@/domain/graphQuality";
import {
  scoreMultiStep as scoreMultiStepB,
  scoreSingleShot as scoreSingleShotB,
} from "@/domain/graphQualityB";

export function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const results = GOLDENS.map((g) => {
    const a1 = scoreMultiStep(g.input);
    const a2 = scoreMultiStepB(g.input);
    const b1 = scoreSingleShot(g.input);
    const b2 = scoreSingleShotB(g.input);
    const agree =
      JSON.stringify(a1) === JSON.stringify(a2) &&
      JSON.stringify(b1) === JSON.stringify(b2) &&
      JSON.stringify(a1) === JSON.stringify(g.expectedMultiStep) &&
      JSON.stringify(b1) === JSON.stringify(g.expectedSingleShot);
    return { id: g.id, agree, multiStep: a1.overall, singleShot: b1.overall };
  });
  return json({
    count: results.length,
    agreeing: results.filter((r) => r.agree).length,
    results,
  });
}
