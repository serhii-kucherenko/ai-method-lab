import { NextResponse } from "next/server";
import { scoreOpenTools, scoreScopeBound } from "@/domain/scoring";

export async function POST(req: Request) {
  const input = await req.json();
  return NextResponse.json({
    scopeBound: scoreScopeBound(input),
    openTools: scoreOpenTools(input),
  });
}
