import { NextResponse } from "next/server";

/** Soft-sim demo bearer. Override with CCS_API_TOKEN. */
export const DEMO_BEARER_TOKEN =
  process.env.CCS_API_TOKEN ?? "ccs-demo-token";

export function extractBearer(req: Request): string | null {
  const header = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1]?.trim() || null;
}

export function requireBearer(req: Request): NextResponse | null {
  const token = extractBearer(req);
  if (!token || token !== DEMO_BEARER_TOKEN) {
    return NextResponse.json(
      {
        error: "unauthorized",
        message: "Bearer token required (soft-sim lab desk)",
      },
      { status: 401 },
    );
  }
  return null;
}
