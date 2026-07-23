import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.09076",
  title: "Neuro-Agentic Control: A Deep Learning-based LLM-Powered Agentic AI Framework for Controlling Security Controls",
  codeUrl: null,
  buildClaim: "The Counterfactual Physics Injection mechanism and coupling of an LLM planner with a time-series foundation model offer a new architecture pattern for safe agentic control, though broader validation is needed.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Security Control Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Security Control Desk listening on ${port}`);
});
