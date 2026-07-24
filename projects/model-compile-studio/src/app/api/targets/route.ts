import { guard, json } from "@/lib/api";
import { createTarget, listTargets, paginate } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listTargets(), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    acceleratorClass?: string;
    memoryGb?: number;
    notes?: string;
  };
  if (!body.name || !body.acceleratorClass) {
    return json({ error: "fields_required" }, { status: 400 });
  }
  const target = createTarget({
    name: body.name,
    acceleratorClass: body.acceleratorClass,
    memoryGb: body.memoryGb ?? 8,
    notes: body.notes,
  });
  return json(target, { status: 201 });
}
