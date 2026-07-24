import { guard, json } from "@/lib/api";
import {
  createArtifact,
  listArtifacts,
  paginate,
  type ArtifactKind,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const modelId = url.searchParams.get("modelId") ?? undefined;
  const kind = (url.searchParams.get("kind") as ArtifactKind | null) ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listArtifacts({ modelId, kind }), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    runId?: string;
    modelId?: string;
    kind?: ArtifactKind;
    label?: string;
    sizeKb?: number;
    notes?: string;
  };
  if (!body.runId || !body.modelId || !body.kind || !body.label) {
    return json({ error: "fields_required" }, { status: 400 });
  }
  try {
    const art = createArtifact({
      runId: body.runId,
      modelId: body.modelId,
      kind: body.kind,
      label: body.label,
      sizeKb: body.sizeKb ?? 64,
      notes: body.notes,
    });
    return json(art, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "create_failed" },
      { status: 400 },
    );
  }
}
