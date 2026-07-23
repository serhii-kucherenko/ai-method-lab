import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.14601",
  title: "SYNAPSE: A Multi-LLM Orchestrated AI Tutor for Secure Software Development Education with Neurodivergent-First Design",
  codeUrl: null,
  buildClaim: "SYNAPSE demonstrates the potential of multi-LLM orchestration for adaptive tutoring, but further research is needed to fully realize its potential",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Secure Tutor Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Secure Tutor Desk listening on ${port}`);
});
