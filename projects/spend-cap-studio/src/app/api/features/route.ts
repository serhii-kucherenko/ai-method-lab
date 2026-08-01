import { NextResponse } from "next/server";
import { listFeatures } from "@/store";
import { GOLDENS } from "@/goldens";

export function GET(req: Request) {
  if (req.headers.get("authorization") !== "Bearer spend-cap-demo") {
    return NextResponse.json({ error: "bearer token required" }, { status: 401 });
  }
  return NextResponse.json({
    items: listFeatures(),
    goldenCount: GOLDENS.length,
  });
}
