import { NextResponse } from "next/server";
import { z } from "zod";
import { extractBearer, requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { appendAudit } from "@/services/audit";
import {
  createMember,
  listMembers,
  toMemberPublic,
} from "@/services/members";

const createSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "viewer", "editor"]),
});

function softSimActor(req: Request): string {
  const token = extractBearer(req) ?? "anonymous";
  return `soft-sim:${token}`;
}

/** GET org members (soft-sim, D-07). */
export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const members = listMembers(getDb()).map(toMemberPublic);
  return NextResponse.json({ softSim: true, members });
}

/** POST add member (soft-sim, D-07). */
export async function POST(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Soft-sim expects JSON body" },
      { status: 422 },
    );
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation",
        message: "Invalid member payload (soft-sim)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }
  const db = getDb();
  try {
    const member = createMember(db, {
      email: parsed.data.email,
      role: parsed.data.role,
    });
    appendAudit(db, {
      actor: softSimActor(req),
      action: "members.create",
      entityType: "member",
      entityId: member.id,
      detail: { email: member.email, role: member.role },
    });
    return NextResponse.json(
      { softSim: true, member: toMemberPublic(member) },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "create failed";
    if (/UNIQUE/i.test(message)) {
      return NextResponse.json(
        { error: "conflict", message: "Member email already exists (soft-sim)" },
        { status: 409 },
      );
    }
    throw err;
  }
}
