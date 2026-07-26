import { NextResponse } from "next/server";
import { scoreExpiryAware, scorePermanentOpen } from "@/domain/scoring";

export async function POST(req: Request) {
  const input = await req.json();
  return NextResponse.json({
    expiryAware: scoreExpiryAware(input),
    permanentOpen: scorePermanentOpen(input),
  });
}
