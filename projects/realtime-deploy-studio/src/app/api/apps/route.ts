import { guard, json } from "@/lib/api";
import { createApp, listApps, paginate } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listApps(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    environment?: string;
    modalities?: string[];
    gpuBudget?: number;
    targetLatencyMs?: number;
    notes?: string;
  };
  if (!body.name?.trim()) {
    return json({ error: "name_required" }, { status: 400 });
  }
  const app = createApp({
    name: body.name,
    environment: body.environment ?? "unspecified",
    modalities: body.modalities ?? [],
    gpuBudget: body.gpuBudget ?? 1,
    targetLatencyMs: body.targetLatencyMs ?? 300,
    notes: body.notes ?? "",
  });
  return json(app, { status: 201 });
}
