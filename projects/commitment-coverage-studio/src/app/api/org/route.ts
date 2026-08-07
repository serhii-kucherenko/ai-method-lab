import { NextResponse } from "next/server";
import { z } from "zod";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getOrg, toOrgPublic, updateOrg } from "@/services/org";

const patchSchema = z
  .object({
    name: z.string().min(1).optional(),
    seatTier: z.enum(["evaluator", "platform", "site"]).optional(),
    webhookSecret: z.string().min(1).optional(),
  })
  .refine(
    (body) =>
      body.name !== undefined ||
      body.seatTier !== undefined ||
      body.webhookSecret !== undefined,
    { message: "At least one org field required" },
  );

/** GET demo org settings (soft-sim). Never returns raw webhookSecret (T-04-09). */
export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const org = getOrg(getDb());
  if (!org) {
    return NextResponse.json(
      { error: "not_found", message: "Demo org missing (soft-sim)" },
      { status: 404 },
    );
  }
  return NextResponse.json({ softSim: true, org: toOrgPublic(org) });
}

/** PATCH org name / seat tier / webhook secret set-only (D-07). */
export async function PATCH(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Soft-sim expects JSON body" },
      { status: 422 },
    );
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation",
        message: "Invalid org payload (soft-sim)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }
  const updated = updateOrg(getDb(), {
    name: parsed.data.name,
    seatTier: parsed.data.seatTier,
    webhookSecret: parsed.data.webhookSecret,
  });
  return NextResponse.json({ softSim: true, org: toOrgPublic(updated) });
}
