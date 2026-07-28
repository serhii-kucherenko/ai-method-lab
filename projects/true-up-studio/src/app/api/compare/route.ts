import { NextResponse } from "next/server";
import { scoreSeatRenewal, scoreUsageTrueUp } from "@/domain/scoring";

export async function POST(req: Request) {
  const input = await req.json();
  return NextResponse.json({
    usageTrueUp: scoreUsageTrueUp(input),
    seatRenewal: scoreSeatRenewal(input),
  });
}
