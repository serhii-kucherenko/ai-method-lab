import { guard, json } from "@/lib/api";
import {
  exportCandidatesJson,
  listCandidates,
  paginate,
  type CandidateFilters,
} from "@/store";
import type { GenerationMode } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  const filters: CandidateFilters = {
    q: url.searchParams.get("q") ?? undefined,
    mode: (url.searchParams.get("mode") as GenerationMode | null) ?? undefined,
    programId: url.searchParams.get("programId") ?? undefined,
    minAffinity: url.searchParams.get("minAffinity")
      ? Number(url.searchParams.get("minAffinity"))
      : undefined,
    minDiseaseFit: url.searchParams.get("minDiseaseFit")
      ? Number(url.searchParams.get("minDiseaseFit"))
      : undefined,
  };

  if (url.searchParams.get("format") === "json") {
    return new Response(exportCandidatesJson(filters), {
      headers: {
        "content-type": "application/json",
        "content-disposition": 'attachment; filename="candidates.json"',
      },
    });
  }

  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listCandidates(filters), page, pageSize));
}
