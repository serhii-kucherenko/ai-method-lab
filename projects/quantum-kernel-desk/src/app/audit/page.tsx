import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditPage() {
  return (
    <section data-audit="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Audit
        </h1>
        <p className="mt-1 text-[var(--qkd-muted)]">
          Lifecycle history with CSV export for org review.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[var(--qkd-muted)]">
            Empty state: no audit entries until a job advances.
          </p>
          <Button variant="outline">Export CSV</Button>
        </CardContent>
      </Card>
    </section>
  );
}
