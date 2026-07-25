import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";
import { scoreChannelAware, scoreUniform } from "@/domain/quant";
import {
  scoreChannelAware as scoreChannelAwareB,
  scoreUniform as scoreUniformB,
} from "@/domain/quantB";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const sample = GOLDENS.slice(0, 3).map((g) => {
    const a1 = scoreChannelAware({ ...g.input, profile: "channel" });
    const a2 = scoreChannelAwareB({ ...g.input, profile: "channel" });
    const b1 = scoreUniform({ ...g.input, profile: "uniform" });
    const b2 = scoreUniformB({ ...g.input, profile: "uniform" });
    return {
      id: g.id,
      dualImplMatch:
        JSON.stringify(a1) === JSON.stringify(a2) &&
        JSON.stringify(b1) === JSON.stringify(b2),
      channelAware: a1,
      uniform: b1,
    };
  });
  return json({ count: GOLDENS.length, sample });
}
