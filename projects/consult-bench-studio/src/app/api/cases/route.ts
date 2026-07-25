import { guard, json } from "@/lib/api";
import { createCase, listCases } from "@/store";
import type { CaseStatus, DepartmentKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const department = (url.searchParams.get("department") ?? undefined) as
    | DepartmentKind
    | undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listCases(q, page, pageSize, department));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    title?: string;
    department?: DepartmentKind;
    status?: CaseStatus;
    patientAgeBand?: string;
    chiefComplaint?: string;
    notes?: string;
  };
  if (!body.title?.trim() || !body.department) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createCase(body as { title: string; department: DepartmentKind });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
