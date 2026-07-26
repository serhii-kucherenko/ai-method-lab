import { NextResponse } from "next/server";
import { scoreHeadcountOnly, scoreUsageAware } from "@/domain/scoring";

export async function POST(req: Request) {
  const input = await req.json();
  return NextResponse.json({
    usageAware: scoreUsageAware(input),
    headcountOnly: scoreHeadcountOnly(input),
  });
}
