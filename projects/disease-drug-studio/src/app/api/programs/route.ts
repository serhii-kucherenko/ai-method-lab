import { guard, json } from "@/lib/api";
import { createProgram, listPrograms, paginate } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listPrograms(q), page, pageSize));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = (await req.json()) as {
    name?: string;
    indication?: string;
    meshTags?: string[];
    targetName?: string;
    targetUniprot?: string;
  };
  if (!body.name?.trim() || !body.indication?.trim() || !body.targetName?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const program = createProgram({
    name: body.name,
    indication: body.indication,
    meshTags: body.meshTags ?? [],
    targetName: body.targetName,
    targetUniprot: body.targetUniprot ?? "",
  });
  return json(program, { status: 201 });
}
