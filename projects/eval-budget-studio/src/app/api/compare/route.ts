import { NextResponse } from "next/server";
import { scoreAlwaysMax, scoreBudgetAware } from "@/domain/scoring";

export async function POST(req: Request) {
  const input = await req.json();
  return NextResponse.json({ budgetAware: scoreBudgetAware(input), alwaysMax: scoreAlwaysMax(input) });
}
