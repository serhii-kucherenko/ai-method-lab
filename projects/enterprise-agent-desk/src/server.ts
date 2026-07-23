import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.17331",
  title: "Agentic ERP: Multi-Agent Large Language Model Architecture for Autonomous Enterprise Resource Planning",
  codeUrl: null,
  buildClaim: "This work provides a reference architecture and evaluation protocol for building autonomous enterprise systems using multi-agent LLMs, advancing the field of AI in business process automation.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Enterprise Agent Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Enterprise Agent Desk listening on ${port}`);
});
