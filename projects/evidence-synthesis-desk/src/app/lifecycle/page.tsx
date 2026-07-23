import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LifecyclePage() {
  return (
    <section data-lifecycle="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Lifecycle
        </h1>
        <p className="mt-1 text-[var(--esd-muted)]">
          Enforce draft → queued → running → terminal. Illegal edges reject.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Allowed path</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Badge>draft</Badge>
          <span className="text-[var(--esd-muted)]">→</span>
          <Badge>queued</Badge>
          <span className="text-[var(--esd-muted)]">→</span>
          <Badge>running</Badge>
          <span className="text-[var(--esd-muted)]">→</span>
          <Badge variant="secondary">succeeded / failed / cancelled</Badge>
        </CardContent>
      </Card>
      <p className="text-sm text-[var(--esd-muted)]">
        Optimistic version conflicts return an error — advance status with the
        expected version.
      </p>
    </section>
  );
}
