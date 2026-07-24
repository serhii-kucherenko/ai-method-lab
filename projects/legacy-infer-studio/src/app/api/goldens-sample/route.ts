import { guard, json } from "@/lib/api";
import { scoreStageValidated, scoreNaiveOffload } from "@/domain/infer";
import { sampleGoldenInput } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    input,
    stageValidated: scoreStageValidated(input),
    naiveOffload: scoreNaiveOffload({ ...input, plan: "naive_offload" }),
  });
}
