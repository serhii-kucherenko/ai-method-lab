"use client";

import { useEffect, useState, useTransition } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";
import type { Course, TutorRole, TutorRoleKind } from "@/store";

const KINDS: TutorRoleKind[] = ["explainer", "safety", "rubric", "coach"];

export default function TutorsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tutors, setTutors] = useState<TutorRole[]>([]);
  const [courseId, setCourseId] = useState("");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<TutorRoleKind>("explainer");
  const [spec, setSpec] = useState("0.7");
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
      const t = await api<{ items: TutorRole[] }>(
        `/api/tutors?courseId=${encodeURIComponent(cid || "")}`,
      );
      setTutors(t.items);
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!courseId) return;
    start(async () => {
      const t = await api<{ items: TutorRole[] }>(
        `/api/tutors?courseId=${encodeURIComponent(courseId)}`,
      );
      setTutors(t.items);
    });
  }, [courseId]);

  function create() {
    start(async () => {
      try {
        await api<TutorRole>("/api/tutors", {
          method: "POST",
          body: JSON.stringify({
            courseId,
            name,
            kind,
            specialization: Number(spec),
          }),
        });
        setName("");
        setError("");
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    });
  }

  function toggle(id: string, active: boolean) {
    start(async () => {
      await api<TutorRole>("/api/tutors", {
        method: "PATCH",
        body: JSON.stringify({ id, active: !active }),
      });
      load();
    });
  }

  return (
    <StudioShell
      title="Tutor roster"
      subtitle="Multi-LLM tutor roles — explainer, safety, rubric, and coach — with orchestration toggles."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4">
          <p className="font-medium text-stone-900">Add tutor role</p>
          <div>
            <Label htmlFor="t-course">Course</Label>
            <select
              id="t-course"
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
            <Label htmlFor="t-name">Name</Label>
            <Input
              id="t-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Safety checker"
            />
          </div>
          <div>
            <Label htmlFor="t-kind">Kind</Label>
            <select
              id="t-kind"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value as TutorRoleKind)}
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="t-spec">Specialization</Label>
            <Input
              id="t-spec"
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            onClick={create}
            disabled={pending || !name.trim() || !courseId}
          >
            Add tutor
          </Button>
        </div>

        <ul className="space-y-3">
          {tutors.map((t, i) => (
            <li
              key={t.id}
              className="animate-chip-stagger flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-4"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-stone-900">{t.name}</p>
                  <Badge variant="secondary">{t.kind}</Badge>
                  <Badge variant={t.active ? "default" : "outline"}>
                    {t.active ? "active" : "off"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  Spec {t.specialization.toFixed(2)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggle(t.id, t.active)}
                disabled={pending}
              >
                {t.active ? "Disable" : "Enable"}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </StudioShell>
  );
}
