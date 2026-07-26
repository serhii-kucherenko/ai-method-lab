import { NextResponse } from "next/server";
import { scoreAlwaysStrong, scoreSelective } from "@/domain/scoring";

export async function POST(req: Request) {
  const input = await req.json();
  return NextResponse.json({ selective: scoreSelective(input), alwaysStrong: scoreAlwaysStrong(input) });
}
