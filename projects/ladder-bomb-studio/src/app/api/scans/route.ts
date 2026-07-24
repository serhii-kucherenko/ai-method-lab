import { guard, json } from "@/lib/api";
import { createScan, listScans, paginate } from "@/store";
import type { ScanProfile, ScoreMode } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const programId = url.searchParams.get("programId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listScans(programId), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    programId?: string;
    name?: string;
    mode?: ScoreMode;
    profile?: ScanProfile;
  };
  if (!body.programId || !body.name?.trim()) {
    return json({ error: "program_and_name_required" }, { status: 400 });
  }
  try {
    const scan = createScan({
      programId: body.programId,
      name: body.name,
      mode: body.mode,
      profile: body.profile,
    });
    return json(scan, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
