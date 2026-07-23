import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BatchPage() {
  return (
    <section data-batch="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Batch transitions
        </h1>
        <p className="mt-1 text-[var(--qkd-muted)]">
          Transition sibling jobs independently — one failure does not roll back
          the others.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Independence</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[var(--qkd-muted)]">
          POST batch items with project_id, job_id, and target status. Results
          return per-item ok or reject reasons (illegal transition, version
          conflict, duplicate_in_batch).
        </CardContent>
      </Card>
    </section>
  );
}
