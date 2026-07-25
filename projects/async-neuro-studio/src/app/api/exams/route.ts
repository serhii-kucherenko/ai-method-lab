import { guard, json } from "@/lib/api";
import { createExam, listExams } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listExams({
      videoId: url.searchParams.get("videoId") ?? undefined,
      siteId: url.searchParams.get("siteId") ?? undefined,
      protocolId: url.searchParams.get("protocolId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const exam = createExam({
    videoId: body.videoId,
    siteId: body.siteId,
    protocolId: body.protocolId,
    protocolFidelity: Number(body.protocolFidelity),
    siteConsistency: Number(body.siteConsistency),
    videoCompleteness: Number(body.videoCompleteness),
    packReadiness: Number(body.packReadiness),
    runNotes: body.runNotes,
  });
  if (!exam) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ exam }, { status: 201 });
}
