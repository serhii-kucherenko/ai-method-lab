import { guard, json } from "@/lib/api";
import { sampleGoldenInput, scorePlan } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  const hitl = scorePlan(input, "hitl_foundation");
  const auto = scorePlan({ ...input, plan: "auto_only" }, "auto_only");
  return json({ input, hitlFoundation: hitl, autoOnly: auto });
}
