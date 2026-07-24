import { guard, json } from "@/lib/api";
import { sampleGoldenInput, scorePlan } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  const multi = scorePlan(input, "multi_skill");
  const single = scorePlan({ ...input, plan: "single_gait" }, "single_gait");
  return json({ input, multi, single });
}
