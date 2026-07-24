import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  advanceLesson,
  createCompare,
  createCourse,
  createLesson,
  exportAuditsCsv,
  ingestWebhook,
  inviteMember,
  listCourses,
  listFeatures,
  listLessons,
  listTutors,
  resetStore,
  signWebhook,
} from "../src/store.ts";

describe("store", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds course tutors and completed orchestrated lesson", () => {
    const courses = listCourses();
    assert.ok(courses.length >= 1);
    const tutors = listTutors(courses[0].id);
    assert.ok(tutors.length >= 3);
    const lessons = listLessons();
    assert.equal(lessons[0].mode, "orchestrated");
    assert.equal(lessons[0].stage, "complete");
    assert.ok((lessons[0].quality?.overall ?? 0) > 0);
  });

  it("creates course and advances an orchestrated lesson to complete", () => {
    const c = createCourse({
      name: "API threat modeling",
      kind: "api",
      vulnComplexity: 0.55,
      threatCoverage: 0.6,
      notes: "test",
    });
    const lesson = createLesson({ courseId: c.id, mode: "orchestrated" });
    assert.equal(lesson.stage, "queued");
    let cur = lesson;
    for (let i = 0; i < 5; i++) {
      cur = advanceLesson(cur.id);
    }
    assert.equal(cur.stage, "complete");
    assert.ok(cur.quality);
    assert.equal(cur.quality?.mode, "orchestrated");
  });

  it("compare prefers orchestrated under role-heavy input", () => {
    const c = listCourses()[0];
    const row = createCompare({
      name: "lift check",
      courseId: c.id,
      tutorInput: {
        vulnComplexity: 0.8,
        rubricItemCount: 14,
        tutorCoverage: 0.9,
        orchestrationRounds: 5,
        pedagogyDepth: 0.85,
        threatCoverage: 0.8,
        safetyGateStrength: 0.85,
        studentRiskLevel: 0.55,
        exploitHintRisk: 0.5,
        explainerSpecialization: 0.85,
        safetySpecialization: 0.88,
        rubricSpecialization: 0.8,
        profile: "guided",
      },
    });
    assert.equal(row.winner, "orchestrated");
    assert.ok(row.orchestrated.overall > row.single.overall);
  });

  it("webhook HMAC + idempotent ingest", () => {
    const body = JSON.stringify({ event: "lesson.ready" });
    const sig = signWebhook(body);
    const first = ingestWebhook(body, sig, "idem-1");
    assert.equal(first.ok, true);
    assert.equal(first.duplicate, false);
    const second = ingestWebhook(body, sig, "idem-1");
    assert.equal(second.ok, true);
    assert.equal(second.duplicate, true);
  });

  it("members invite and audit csv export", () => {
    inviteMember("new@studio.local", "instructor");
    const csv = exportAuditsCsv();
    assert.ok(csv.includes("member.invite"));
  });

  it("lists at least 20 features", () => {
    assert.ok(listFeatures().length >= 20);
  });
});
