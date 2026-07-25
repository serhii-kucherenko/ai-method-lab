import { guard, json } from "@/lib/api";
import { createDepartment, listDepartments } from "@/store";
import type { DepartmentKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listDepartments(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    department?: DepartmentKind;
    coverage?: number;
    caseCount?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.department) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createDepartment(body as { name: string; department: DepartmentKind });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
