import { NextResponse } from "next/server";
import { z } from "zod";
import { extractBearer, requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { appendAudit } from "@/services/audit";
import { getRenewalCase, updateRenewalStatus } from "@/services/renewals";

const patchSchema = z.object({
  status: z.enum(["acted", "dismissed"]),
});

type RouteContext = { params: Promise<{ id: string }> };

/** Soft-sim actor label from Bearer token subject. */
function softSimActor(req: Request): string {
  const token = extractBearer(req) ?? "anonymous";
  return `soft-sim:${token}`;
}

export async function PATCH(req: Request, context: RouteContext) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const { id } = await context.params;
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
        message: "status must be acted or dismissed (soft-sim)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  const db = getDb();
  const existing = getRenewalCase(db, id);
  if (!existing) {
    return NextResponse.json(
      { error: "not_found", message: "Renewal case not found (soft-sim)" },
      { status: 404 },
    );
  }
  if (existing.status !== "open") {
    return NextResponse.json(
      {
        error: "conflict",
        message: "Only open renewal cases can be acted or dismissed (soft-sim)",
        softSim: true,
        case: existing,
      },
      { status: 409 },
    );
  }

  const updated = updateRenewalStatus(db, id, parsed.data.status);
  if (!updated) {
    return NextResponse.json(
      { error: "not_found", message: "Renewal case not found (soft-sim)" },
      { status: 404 },
    );
  }

  const action =
    parsed.data.status === "acted" ? "renewals.act" : "renewals.dismiss";
  appendAudit(db, {
    actor: softSimActor(req),
    action,
    entityType: "renewal_case",
    entityId: id,
    detail: {
      status: parsed.data.status,
      recommendedAction: updated.recommendedAction,
      gapUsd: updated.gapUsd,
    },
  });

  return NextResponse.json({ softSim: true, case: updated });
}
