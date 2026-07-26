import { NextResponse } from "next/server";
import { GOLDENS } from "@/goldens";

export function GET(req: Request) {
  if (req.headers.get("authorization") !== "Bearer eval-budget-demo") {
    return NextResponse.json({ error: "bearer token required" }, { status: 401 });
  }
  return NextResponse.json({
    items: [
      "budget packs",
      "plans",
      "forecasts",
      "caps",
      "overruns",
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
