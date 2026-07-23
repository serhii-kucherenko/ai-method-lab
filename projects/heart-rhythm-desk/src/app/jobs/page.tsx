import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function JobsPage() {
  return (
    <section data-jobs="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Rhythm jobs
        </h1>
        <p className="mt-1 text-[var(--hrd-muted)]">
          Create, list, patch, and delete rhythm scoring jobs for an org project.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create job</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input id="label" placeholder="long-tail-pass-01" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="query">Query / cohort note</Label>
            <Input id="query" placeholder="rare PVC-heavy strip" />
          </div>
          <div className="sm:col-span-2">
            <Button className="bg-[var(--hrd-teal)] hover:bg-[var(--hrd-teal-deep)]">
              Create job
            </Button>
          </div>
          <p className="sm:col-span-2 text-sm text-[var(--hrd-muted)]">
            Empty state: no jobs yet — create one via API or this form once
            authenticated.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
