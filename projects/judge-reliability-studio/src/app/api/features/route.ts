import { NextResponse } from "next/server";
import { GOLDENS } from "@/goldens";

export function GET(req: Request) {
  if (req.headers.get("authorization") !== "Bearer judge-studio-demo") {
    return NextResponse.json({ error: "bearer token required" }, { status: 401 });
  }
  return NextResponse.json({
    items: [
      "locked judge packs",
      "IRT diagnostics",
      "ability/difficulty/discrimination",
      "reliability flags",
      "compare",
      "scoreboard",
      "members",
      "webhook HMAC",
      "audit export",
      "pagination",
      "rate limit",
    ],
    goldenCount: GOLDENS.length,
  });
}
