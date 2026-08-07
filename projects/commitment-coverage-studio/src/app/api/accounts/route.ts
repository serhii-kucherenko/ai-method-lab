import { NextResponse } from "next/server";
import { z } from "zod";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { createAccount, listAccounts } from "@/lib/repos";

const createSchema = z.object({
  provider: z.enum(["aws", "gcp", "azure"]),
  accountKey: z.string().min(1),
  displayName: z.string().min(1),
});

export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const db = getDb();
  return NextResponse.json({ softSim: true, accounts: listAccounts(db) });
}

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
        message: "Invalid account payload (soft-sim)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }
  const db = getDb();
  try {
    const account = createAccount(db, parsed.data);
    return NextResponse.json({ softSim: true, account }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "create failed";
    if (/UNIQUE/i.test(message)) {
      return NextResponse.json(
        { error: "conflict", message: "Account already exists (soft-sim)" },
        { status: 409 },
      );
    }
    throw err;
  }
}
