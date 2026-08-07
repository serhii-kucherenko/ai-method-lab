import { NextResponse } from "next/server";
import { z } from "zod";
import { extractBearer, requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { appendAudit } from "@/services/audit";
import { buildExport } from "@/services/export";

const querySchema = z.object({
  kind: z.enum(["gaps", "renewals", "compares"]),
  format: z.enum(["json", "csv"]).default("json"),
});

/** GET export pack JSON/CSV (PLT-03, D-09). */
export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    kind: url.searchParams.get("kind") ?? undefined,
    format: url.searchParams.get("format") ?? "json",
  });
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation",
        message: "kind=gaps|renewals|compares and format=json|csv required (soft-sim)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  const db = getDb();
  const { body, contentType, filename } = buildExport(
    db,
    parsed.data.kind,
    parsed.data.format,
  );

  const token = extractBearer(req) ?? "anonymous";
  appendAudit(db, {
    actor: `soft-sim:${token}`,
    action: "export.action",
    entityType: "export",
    entityId: parsed.data.kind,
    detail: { format: parsed.data.format, bytes: body.length },
  });

  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": contentType,
      "content-disposition": `attachment; filename="${filename}"`,
    },
  });
}
