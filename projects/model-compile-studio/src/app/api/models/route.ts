import { guard, json } from "@/lib/api";
import { createModel, listModels, paginate } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listModels(q), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    family?: string;
    parameterScale?: string;
    tags?: string[];
    parameterBillion?: number;
  };
  if (!body.name || !body.family || !body.parameterScale) {
    return json({ error: "fields_required" }, { status: 400 });
  }
  const model = createModel({
    name: body.name,
    family: body.family,
    parameterScale: body.parameterScale,
    tags: body.tags ?? [],
    parameterBillion: body.parameterBillion ?? 1,
  });
  return json(model, { status: 201 });
}
