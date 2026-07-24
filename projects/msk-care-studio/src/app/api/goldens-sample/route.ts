import { guard, json } from "@/lib/api";
import { sampleGoldenInput } from "@/store";
import { scoreEvidenceGrounded, scoreUngroundedLlm } from "@/domain/care";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const input = sampleGoldenInput();
  return json({
    input,
    evidenceGrounded: scoreEvidenceGrounded(input),
    ungroundedLlm: scoreUngroundedLlm(input),
  });
}
