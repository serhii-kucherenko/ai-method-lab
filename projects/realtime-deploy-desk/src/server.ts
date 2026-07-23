import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.18171",
  title: "FlashRT: Agent Harness for Guiding Agents to Deploy Real-Time Multimodal Applications",
  codeUrl: null,
  buildClaim: "This work offers a novel, agent-driven approach to automate the complex optimization of AI model deployments, potentially reducing the need for expert manual tuning and making high-performance AI more accessible to developers.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Realtime Deploy Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Realtime Deploy Desk listening on ${port}`);
});
