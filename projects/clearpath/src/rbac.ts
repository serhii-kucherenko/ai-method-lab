import type { DatabaseSync } from "node:sqlite";
import type { ProjectRole } from "./db.js";

export function getProjectRole(
  db: DatabaseSync,
  projectId: string,
  userId: string,
): ProjectRole | null {
  const row = db
    .prepare(
      "SELECT role FROM project_members WHERE project_id = ? AND user_id = ?",
    )
    .get(projectId, userId) as { role: ProjectRole } | undefined;
  return row?.role ?? null;
}

export function canReadProject(role: ProjectRole | null): boolean {
  return role !== null;
}

export function canMutateTasks(role: ProjectRole | null): boolean {
  return role === "owner" || role === "member";
}

export function canMutateComments(role: ProjectRole | null): boolean {
  return role === "owner" || role === "member";
}

export function canManageMembers(role: ProjectRole | null): boolean {
  return role === "owner";
}

export function canDeleteProject(role: ProjectRole | null): boolean {
  return role === "owner";
}
