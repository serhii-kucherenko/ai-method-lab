import { NextResponse } from "next/server";
import { scoreCalendarWindow, scoreInterlockAware } from "@/domain/scoring";

export async function POST(req: Request) {
  const input = await req.json();
  return NextResponse.json({
    interlockAware: scoreInterlockAware(input),
    calendarWindow: scoreCalendarWindow(input),
  });
}
