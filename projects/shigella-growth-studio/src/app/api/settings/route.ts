import { guard, json } from "@/lib/api";
import { getOrg, updateOrg, type ScoreMode, type TreatmentBias } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  return json(getOrg());
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  return json(
    updateOrg({
      name: typeof body.name === "string" ? body.name : undefined,
      webhookUrl:
        typeof body.webhookUrl === "string" ? body.webhookUrl : undefined,
      webhookSecret:
        typeof body.webhookSecret === "string" ? body.webhookSecret : undefined,
      bearerToken:
        typeof body.bearerToken === "string" ? body.bearerToken : undefined,
      defaultTreatmentBias:
        typeof body.defaultTreatmentBias === "string"
          ? (body.defaultTreatmentBias as TreatmentBias)
          : undefined,
      defaultMode:
        typeof body.defaultMode === "string"
          ? (body.defaultMode as ScoreMode)
          : undefined,
      rateLimitPerMinute:
        typeof body.rateLimitPerMinute === "number"
          ? body.rateLimitPerMinute
          : undefined,
    }),
  );
}
