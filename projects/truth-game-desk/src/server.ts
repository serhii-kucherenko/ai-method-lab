import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.08403",
  title: "Game Theory Driven Multi-Agent Framework Mitigates Language Model Hallucination",
  codeUrl: null,
  buildClaim: "The G-Frame framework offers a scalable paradigm for developing more reliable lightweight LLMs in specialized, rule-based domains by integrating multi-agent systems, Bayesian principles, and game theory, addressing a key limitation of current models.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Game Theory Driven", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Game Theory Driven listening on ${port}`);
});
