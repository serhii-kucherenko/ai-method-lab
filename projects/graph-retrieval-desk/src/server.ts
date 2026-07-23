import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.11683",
  title: "RAGU: A Multi-Step GraphRAG Engine with a Compact Domain-Adapted LLM",
  codeUrl: "https://github.com/RaguTeam/RAGU",
  buildClaim: "RAGU offers a more robust and efficient architecture for GraphRAG, separating extraction from consolidation. Its use of a compact, domain-adapted LLM (Meno-Lite-0.1) that runs on a single GPU makes advanced GraphRAG capabilities more accessible and resource-friendly for developer",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Graph Retrieval Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Graph Retrieval Desk listening on ${port}`);
});
