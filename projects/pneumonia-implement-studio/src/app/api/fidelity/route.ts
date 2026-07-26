import { guard, json } from "@/lib/api";
import {
  createFidelity,
  listFidelity,
  type FidelityKind,
} from "@/store";

const KINDS: FidelityKind[] = [
  "caregiver_delay",
  "antibiotic_timing",
  "referral_completion",
  "chw_adherence",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listFidelity({
      packId: url.searchParams.get("packId") ?? undefined,
      districtId: url.searchParams.get("districtId") ?? undefined,
      pathwayId: url.searchParams.get("pathwayId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (
    typeof body.packId !== "string" ||
    typeof body.districtId !== "string" ||
    typeof body.pathwayId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    !KINDS.includes(body.kind as FidelityKind)
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createFidelity({
    packId: body.packId,
    districtId: body.districtId,
    pathwayId: body.pathwayId,
    label: body.label,
    kind: body.kind as FidelityKind,
    caretakerDelay:
      typeof body.caretakerDelay === "number" ? body.caretakerDelay : 0.3,
    referralFriction:
      typeof body.referralFriction === "number" ? body.referralFriction : 0.3,
    codesignIntensity:
      typeof body.codesignIntensity === "number"
        ? body.codesignIntensity
        : 0.4,
    fidelitySignal:
      typeof body.fidelitySignal === "number" ? body.fidelitySignal : 0.6,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "refs_not_found" }, { status: 404 });
  return json(row);
}
