import { guard, json } from "@/lib/api";
import { createPrompt, listPrompts, paginate } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const deploymentId = url.searchParams.get("deploymentId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listPrompts(deploymentId, q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    deploymentId?: string;
    name?: string;
    prefixTokens?: number;
    suffixTokens?: number;
    sharedPrefix?: boolean;
    notes?: string;
  };
  if (!body.deploymentId || !body.name?.trim()) {
    return json({ error: "deployment_and_name_required" }, { status: 400 });
  }
  try {
    const row = createPrompt({
      deploymentId: body.deploymentId,
      name: body.name,
      prefixTokens: body.prefixTokens ?? 0,
      suffixTokens: body.suffixTokens ?? 0,
      sharedPrefix: body.sharedPrefix ?? true,
      notes: body.notes ?? "",
    });
    return json(row, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
