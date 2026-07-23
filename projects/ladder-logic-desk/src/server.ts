import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.08417",
  title: "Ladder Logic Desk Bombs in IEC 61131-3 PLC Programs using ESBMC-PLC+: A Formal Verification Approach with Trigger Synthesis",
  codeUrl: null,
  buildClaim: "This tool can help improve the security of PLC programs and provide a new approach to detecting malicious code in these programs.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Ladder Logic Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Ladder Logic Desk listening on ${port}`);
});
