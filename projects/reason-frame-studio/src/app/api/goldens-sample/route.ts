import { guard, json } from "@/lib/api";
import { sampleGoldenInput, scorePlan } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    input,
    multiAgent: scorePlan(input, "multi_agent"),
    singleAgent: scorePlan({ ...input, plan: "single_agent" }, "single_agent"),
  });
}
