import { NextResponse } from "next/server";
import { GOLDENS } from "@/goldens";

export function GET(req: Request) {
  if (req.headers.get("authorization") !== "Bearer selective-studio-demo") {
    return NextResponse.json({ error: "bearer token required" }, { status: 401 });
  }
  return NextResponse.json({
    items: [
      "policy packs",
      "cascades",
      "selective trust scoring",
      "escalations",
      "handoffs",
      "cost panels",
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
