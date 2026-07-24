import { guard, json } from "@/lib/api";
import {
  advanceFinding,
  createFinding,
  exportFindingsJson,
  listFindings,
  paginate,
} from "@/store";
import type { BombTaxonomy } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("export") === "json") {
    const plantId = url.searchParams.get("plantId") ?? undefined;
    return new Response(exportFindingsJson(plantId), {
      headers: {
        "content-type": "application/json",
        "content-disposition": "attachment; filename=findings.json",
      },
    });
  }
  const plantId = url.searchParams.get("plantId") ?? undefined;
  const taxonomy = (url.searchParams.get("taxonomy") as BombTaxonomy) || undefined;
  const status =
    (url.searchParams.get("status") as "open" | "triaged" | "resolved") ||
    undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(
    paginate(listFindings({ plantId, taxonomy, status }), page, pageSize),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    scanId?: string;
    title?: string;
    taxonomy?: BombTaxonomy;
    id?: string;
    status?: "open" | "triaged" | "resolved";
  };
  if (body.id && body.status) {
    try {
      return json(advanceFinding(body.id, body.status));
    } catch (e) {
      return json(
        { error: e instanceof Error ? e.message : "error" },
        { status: 400 },
      );
    }
  }
  if (!body.scanId) {
    return json({ error: "scan_required" }, { status: 400 });
  }
  try {
    const finding = createFinding({
      scanId: body.scanId,
      title: body.title,
      taxonomy: body.taxonomy,
    });
    return json(finding, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
