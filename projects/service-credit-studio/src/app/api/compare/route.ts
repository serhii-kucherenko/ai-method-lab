import { NextResponse } from "next/server";
import { scoreCalendarOnly, scoreCreditAware } from "@/domain/scoring";

export async function POST(req: Request) {
  const input = await req.json();
  return NextResponse.json({
    creditAware: scoreCreditAware(input),
    calendarOnly: scoreCalendarOnly(input),
  });
}
