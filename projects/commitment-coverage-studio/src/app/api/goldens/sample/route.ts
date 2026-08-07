import { NextResponse } from "next/server";
import { GOLDENS } from "@/goldens";

/**
 * Soft-sim dual-path sample. Not a live billing system of record.
 */
export async function GET() {
  const sample = GOLDENS.slice(0, 3).map((g) => ({
    id: g.id,
    scenario: g.scenario,
    pathA: g.pathA,
    pathB: g.pathB,
    deltaUsd: g.deltaUsd,
  }));

  return NextResponse.json({
    softSim: true,
    note: "Fixture samples only — not live cloud billing SOR",
    sample,
  });
}
