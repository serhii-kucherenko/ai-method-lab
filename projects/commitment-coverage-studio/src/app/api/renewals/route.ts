import { NextResponse } from "next/server";
import { z } from "zod";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listRenewalCases, packRenewalCases } from "@/services/renewals";

const packSchema = z.object({
  cloudAccountId: z.string().min(1).optional(),
});

/** GET RenewalCase list (soft-sim). Not only lock_end queue (D-02). */
export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const cloudAccountId = url.searchParams.get("cloudAccountId") ?? undefined;
  const cases = listRenewalCases(getDb(), { cloudAccountId });
  return NextResponse.json({ softSim: true, cases });
}

/** POST pack-build from commitments.lock_end + linked gap findings (D-01, D-02). */
export async function POST(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  let body: unknown = {};
  const text = await req.text();
  if (text.trim()) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      return NextResponse.json(
        { error: "invalid_json", message: "Soft-sim expects JSON body" },
        { status: 422 },
      );
    }
  }
  const parsed = packSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation",
        message: "Invalid renewals pack body (soft-sim)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }
  const cases = packRenewalCases(getDb(), {
    cloudAccountId: parsed.data.cloudAccountId,
  });
  return NextResponse.json({ softSim: true, cases }, { status: 201 });
}
