import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function JobsPage() {
  return (
    <section data-jobs="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Study jobs
        </h1>
        <p className="mt-1 text-[var(--cxd-muted)]">
          Create, list, patch, and delete study jobs for an org project —
          gate stages and require measurements before “done.”
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create job</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input id="label" placeholder="multi-llm-pass-01" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="query">Query / lesson note</Label>
            <Input id="query" placeholder="Stockout crisis across sales and purchasing" />
          </div>
          <div className="sm:col-span-2">
            <Button className="bg-[var(--cxd-steel)] hover:bg-[var(--cxd-steel-deep)]">
              Create job
            </Button>
          </div>
          <p className="sm:col-span-2 text-sm text-[var(--cxd-muted)]">
            Empty state: no jobs yet — create one via API or this form once
            authenticated.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
