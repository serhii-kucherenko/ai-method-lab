import { NextResponse } from "next/server";
import { scoreAgreement, scoreIrt } from "@/domain/scoring";

export async function POST(req: Request) {
  const input = await req.json();
  return NextResponse.json({ irt: scoreIrt(input), agreement: scoreAgreement(input) });
}
