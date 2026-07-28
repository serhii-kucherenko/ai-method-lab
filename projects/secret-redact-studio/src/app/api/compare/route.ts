import { NextResponse } from "next/server";
import { scorePatternRedact, scoreRawExport } from "@/domain/scoring";

export async function POST(req: Request) {
  const input = await req.json();
  return NextResponse.json({
    patternRedact: scorePatternRedact(input),
    rawExport: scoreRawExport(input),
  });
}
