"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Course, LessonSession } from "@/store";
import type { ScoreMode, TutorProfile } from "@/domain/types";

export default function LessonsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<LessonSession[]>([]);
  const [courseId, setCourseId] = useState("");
  const [mode, setMode] = useState<ScoreMode>("orchestrated");
  const [profile, setProfile] = useState<TutorProfile>("guided");
  const [rubricItems, setRubricItems] = useState("10");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function load() {
    start(async () => {
      const c = await api<{ items: Course[] }>(
        "/api/courses?page=1&pageSize=50",
      );
      setCourses(c.items);
      const cid = courseId || c.items[0]?.id || "";
      if (!courseId && cid) setCourseId(cid);
      const l = await api<{ items: LessonSession[] }>(
        `/api/lessons?courseId=${encodeURIComponent(cid || "")}`,
      );
      setLessons(l.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function create() {
    start(async () => {
      try {
        await api<LessonSession>("/api/lessons", {
          method: "POST",
          body: JSON.stringify({
            courseId,
            mode,
            profile,
            tutorInput: { rubricItemCount: Number(rubricItems) },
          }),
        });
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function advance(id: string) {
    start(async () => {
      try {
        await api<LessonSession>(`/api/lessons/${id}/advance`, {
          method: "POST",
        });
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  return (
    <StudioShell
      title="Lesson session console"
      subtitle="Advance secure tutoring sessions through brief, teach, quiz, and rubric stages."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Start lesson</p>
          <div>
            <Label htmlFor="l-course">Course</Label>
            <select
              id="l-course"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="l-mode">Mode</Label>
            <select
              id="l-mode"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as ScoreMode)}
            >
              <option value="orchestrated">Orchestrated multi-LLM</option>
              <option value="single">Single-LLM unchecked</option>
            </select>
          </div>
          <div>
            <Label htmlFor="l-profile">Profile</Label>
            <select
              id="l-profile"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={profile}
              onChange={(e) => setProfile(e.target.value as TutorProfile)}
            >
              <option value="guided">Guided</option>
              <option value="strict">Strict</option>
            </select>
          </div>
          <div>
            <Label htmlFor="l-rubric">Rubric items</Label>
            <Input
              id="l-rubric"
              value={rubricItems}
              onChange={(e) => setRubricItems(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button onClick={create} disabled={pending || !courseId}>
            Queue lesson
          </Button>
        </div>

        <ul className="space-y-3">
          {lessons.map((l) => (
            <li
              key={l.id}
              className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-stone-900">{l.courseLabel}</p>
                <Badge variant="secondary">{l.mode}</Badge>
                <Badge>{l.stage}</Badge>
                <Badge variant="outline">{l.profile}</Badge>
              </div>
              <p className="mt-2 text-sm text-stone-500">
                Rubric items {l.input.rubricItemCount} · Tutor coverage{" "}
                {l.input.tutorCoverage.toFixed(2)} · Safety gate{" "}
                {l.input.safetyGateStrength.toFixed(2)}
              </p>
              {l.quality ? (
                <p className="mt-2 text-sm text-[var(--studio-forest)]">
                  Overall {l.quality.overall.toFixed(1)} · Pedagogy{" "}
                  {l.quality.pedagogyFit.toFixed(1)} · Safety{" "}
                  {l.quality.safetyGateScore.toFixed(1)}
                </p>
              ) : null}
              {l.rubric ? (
                <p className="mt-1 text-xs text-stone-500">
                  Ready: tutors {String(l.rubric.tutorsReady)} · safety{" "}
                  {String(l.rubric.safetyReady)} · pedagogy{" "}
                  {String(l.rubric.pedagogyReady)} · rubric{" "}
                  {String(l.rubric.rubricReady)}
                </p>
              ) : null}
              {l.stage !== "complete" && l.stage !== "failed" ? (
                <Button
                  className="mt-3"
                  size="sm"
                  onClick={() => advance(l.id)}
                  disabled={pending}
                >
                  Advance stage
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
