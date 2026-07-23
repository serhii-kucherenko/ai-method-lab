import { listGoldenCards } from "@/goldens";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GoldensPage() {
  const pack = listGoldenCards();

  return (
    <section data-goldens="live" className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Goldens browser
        </h1>
        <p className="mt-1 text-[var(--asd-muted)]">
          Dual-impl tutor-fit fixtures ({pack.total}). Pack{" "}
          {pack.all_pass ? "green" : "has failures"}.
        </p>
      </div>
      <div className="overflow-x-auto rounded-md border border-[var(--asd-line)] bg-white/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pass</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pack.cards.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.id}</TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell className="font-mono text-xs">
                  {c.expect_status}
                </TableCell>
                <TableCell>
                  <Badge variant={c.pass ? "secondary" : "destructive"}>
                    {c.pass ? "pass" : "fail"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
