import { guard, json } from "@/lib/api";
import { createStep, listSteps, markStepOk } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const proofId = url.searchParams.get("proofId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "50");
  return json(listSteps(proofId, page, pageSize));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  try {
    if (body.action === "mark" && body.id != null) {
      return json(markStepOk(body.id, Boolean(body.softSimOk)));
    }
    return json(createStep(body), { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
