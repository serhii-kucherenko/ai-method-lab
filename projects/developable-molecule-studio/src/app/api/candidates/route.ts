import { guard, json } from "@/lib/api";
import {
  createCandidate,
  listCandidates,
  type CandidateStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listCandidates(
      url.searchParams.get("pocketId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    pocketId?: string;
    name?: string;
    smilesHint?: string;
    status?: CandidateStatus;
    qedScore?: number;
    notes?: string;
  };
  if (!body.pocketId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createCandidate({
        pocketId: body.pocketId,
        name: body.name,
        smilesHint: body.smilesHint,
        status: body.status,
        qedScore: body.qedScore,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
