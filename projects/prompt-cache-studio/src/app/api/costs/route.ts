import { NextResponse } from "next/server";
import { guard, json } from "@/lib/api";
import { createCostEstimate, exportCostsJson, listCosts } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("export") === "json") {
    return new NextResponse(exportCostsJson(), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
  const deploymentId = url.searchParams.get("deploymentId") ?? undefined;
  return json({ items: listCosts(deploymentId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    policyId?: string;
    label?: string;
    monthlyCalls?: number;
  };
  if (!body.policyId) {
    return json({ error: "policy_required" }, { status: 400 });
  }
  try {
    const row = createCostEstimate({
      policyId: body.policyId,
      label: body.label,
      monthlyCalls: body.monthlyCalls,
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
