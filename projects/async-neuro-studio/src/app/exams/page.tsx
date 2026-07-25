"use client";
import { useEffect, useState } from "react";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/client-api";

type Exam = {
  id: string;
  videoId: string;
  siteId: string;
  protocolId: string;
  protocolFidelity: number;
  siteConsistency: number;
  videoCompleteness: number;
  packReadiness: number;
  status: string;
};

export function ExamsPage() {
  const [items, setItems] = useState<Exam[]>([]);
  const [videoId, setVideoId] = useState("video-demo");
  const [siteId, setSiteId] = useState("site-demo");
  const [protocolId, setProtocolId] = useState("protocol-demo");
  const [protocolFidelity, setPf] = useState("0.7");
  const [siteConsistency, setSc] = useState("0.7");
  const [videoCompleteness, setVc] = useState("0.75");
  const [packReadiness, setPr] = useState("0.7");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await api<{ items: Exam[] }>("/api/exams")).items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load exams");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/exams", {
        method: "POST",
        body: JSON.stringify({
          videoId,
          siteId,
          protocolId,
          protocolFidelity: Number(protocolFidelity),
          siteConsistency: Number(siteConsistency),
          videoCompleteness: Number(videoCompleteness),
          packReadiness: Number(packReadiness),
        }),
      });
      await load();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Could not create exam");
    }
  };

  return (
    <StudioShell
      title="Exam sessions"
      subtitle="Soft-sim exam runs that feed dual standardized vs ad-hoc scoring."
    >
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
        <form onSubmit={create} className="space-y-3 rounded-lg border bg-white p-4">
          <Label htmlFor="video">Video id</Label>
          <Input id="video" value={videoId} onChange={(e) => setVideoId(e.target.value)} />
          <Label htmlFor="site">Site id</Label>
          <Input id="site" value={siteId} onChange={(e) => setSiteId(e.target.value)} />
          <Label htmlFor="protocol">Protocol id</Label>
          <Input
            id="protocol"
            value={protocolId}
            onChange={(e) => setProtocolId(e.target.value)}
          />
          <Label htmlFor="pf">Protocol fidelity</Label>
          <Input id="pf" value={protocolFidelity} onChange={(e) => setPf(e.target.value)} />
          <Label htmlFor="sc">Site consistency</Label>
          <Input id="sc" value={siteConsistency} onChange={(e) => setSc(e.target.value)} />
          <Label htmlFor="vc">Video completeness</Label>
          <Input id="vc" value={videoCompleteness} onChange={(e) => setVc(e.target.value)} />
          <Label htmlFor="pr">Pack readiness</Label>
          <Input id="pr" value={packReadiness} onChange={(e) => setPr(e.target.value)} />
          <Button>Create exam session</Button>
        </form>
        <section>
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <div className="space-y-3">
            {items.map((exam) => (
              <article key={exam.id} className="row-lift rounded-lg border bg-white p-4">
                <h2 className="font-semibold font-mono text-sm">{exam.id}</h2>
                <p className="text-sm text-slate-600">
                  fidelity {exam.protocolFidelity} · site {exam.siteConsistency} ·
                  video {exam.videoCompleteness} · ready {exam.packReadiness}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </StudioShell>
  );
}

export default ExamsPage;
