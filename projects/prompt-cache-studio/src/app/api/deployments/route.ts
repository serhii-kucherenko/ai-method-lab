import { guard, json } from "@/lib/api";
import { createDeployment, listDeployments, paginate } from "@/store";
import type { ProviderKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listDeployments(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    provider?: ProviderKind;
    model?: string;
    region?: string;
    notes?: string;
  };
  if (!body.name?.trim() || !body.model?.trim()) {
    return json({ error: "name_and_model_required" }, { status: 400 });
  }
  const row = createDeployment({
    name: body.name,
    provider: body.provider ?? "other",
    model: body.model,
    region: body.region ?? "",
    notes: body.notes ?? "",
  });
  return json(row, { status: 201 });
}
