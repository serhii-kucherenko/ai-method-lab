import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.11701",
  title: "$\\mathtt{Q^2SAR}$: overcoming classical bottlenecks in drug discovery via quantum multiple kernel learning",
  codeUrl: null,
  buildClaim: "This framework could contribute to the development of autonomous cognitive architectures and self-improving drug discovery pipelines, but its impact on the field depends on further research and validation",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Mathtt 2sar Overcoming", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Mathtt 2sar Overcoming listening on ${port}`);
});
