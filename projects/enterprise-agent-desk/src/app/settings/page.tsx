import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <section data-settings="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Org settings
        </h1>
        <p className="mt-1 text-[var(--ead-muted)]">
          Rotate webhook secrets (admin). Viewer roles cannot see the secret.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[var(--ead-muted)]">
            Inbound jobs require HMAC (`x-ead-signature`) and an idempotency key.
          </p>
          <Button className="bg-[var(--ead-teal)] hover:bg-[var(--ead-teal-deep)]">
            Rotate webhook secret
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
