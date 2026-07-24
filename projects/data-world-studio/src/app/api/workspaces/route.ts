import { guard, json } from "@/lib/api";
import { createWorkspace, listWorkspaces, paginate } from "@/store";
import type { WorkspaceTier } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listWorkspaces(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    code?: string;
    tier?: WorkspaceTier;
    datasetCount?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.code?.trim()) {
    return json({ error: "name_and_code_required" }, { status: 400 });
  }
  const workspace = createWorkspace({
    name: body.name,
    code: body.code,
    tier: body.tier ?? "team",
    datasetCount: body.datasetCount ?? 1,
    notes: body.notes ?? "",
  });
  return json(workspace, { status: 201 });
}
