import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";
import { scoreMultimodal, scoreTextOnly } from "@/domain/score";
import { scoreMultimodal as scoreMultimodalB, scoreTextOnly as scoreTextOnlyB } from "@/domain/scoreB";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const sample = GOLDENS.slice(0, 3).map((g) => {
    const a1 = scoreMultimodal(g.input);
    const a2 = scoreMultimodalB(g.input);
    const b1 = scoreTextOnly(g.input);
    const b2 = scoreTextOnlyB(g.input);
    return {
      id: g.id,
      dualImplMatch:
        JSON.stringify(a1) === JSON.stringify(a2) &&
        JSON.stringify(b1) === JSON.stringify(b2),
      multimodal: a1,
      textOnly: b1,
    };
  });
  return json({ count: GOLDENS.length, sample });
}
