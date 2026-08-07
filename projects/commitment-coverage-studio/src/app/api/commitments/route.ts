import { NextResponse } from "next/server";
import { z } from "zod";
import { requireBearer } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { createCommitment, listCommitments } from "@/lib/repos";

const createSchema = z.object({
  cloudAccountId: z.string().min(1),
  name: z.string().min(1),
  instrumentType: z.string().min(1),
  provider: z.enum(["aws", "gcp", "azure"]),
  termMonths: z.number().int().positive(),
  rateUsd: z.number().positive(),
  lockStart: z.string().min(1),
  lockEnd: z.string().min(1),
  family: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  const denied = requireBearer(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const search = url.searchParams.get("search") ?? undefined;
  const includeArchived = url.searchParams.get("includeArchived") === "true";
  const db = getDb();
  return NextResponse.json({
    softSim: true,
    commitments: listCommitments(db, { search, includeArchived }),
  });
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
        message: "Invalid commitment payload (soft-sim)",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }
  const { lockStart, lockEnd } = parsed.data;
  if (Date.parse(lockStart) >= Date.parse(lockEnd)) {
    return NextResponse.json(
      {
        error: "validation",
        message: "lockStart must be before lockEnd (soft-sim inventory)",
      },
      { status: 422 },
    );
  }
  const db = getDb();
  const commitment = createCommitment(db, parsed.data);
  return NextResponse.json({ softSim: true, commitment }, { status: 201 });
}

export async function getCommitmentOr404(id: string) {
  const db = getDb();
  const commitment = getCommitment(db, id);
  if (!commitment) {
    return {
      error: NextResponse.json(
        { error: "not_found", message: "Commitment not found (soft-sim)" },
        { status: 404 },
      ),
    };
  }
  return { commitment };
}
