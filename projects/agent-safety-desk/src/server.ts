import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.14570",
  title: "Agent Safety Desk Safety: A Structural Monitoring Approach",
  codeUrl: null,
  buildClaim: "The IFG monitor provides a new approach to detecting security regressions in AI agent deployments, which can contribute to the development of more robust and trustworthy AI systems.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Agent Safety Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Agent Safety Desk listening on ${port}`);
});
