import { guard, json } from "@/lib/api";
import { GOLDENS } from "@/goldens";
import { scoreAdhoc, scoreAgentic } from "@/domain/synthesis";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const g = GOLDENS[0];
  return json({
    id: g.id,
    input: g.input,
    agentic: scoreAgentic(g.input),
    adhoc: scoreAdhoc(g.input),
  });
}
