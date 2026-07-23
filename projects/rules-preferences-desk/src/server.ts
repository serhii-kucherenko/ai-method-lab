import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.15562",
  title: "Hard Rules, Soft Preferences: Bridging Reasoning, Learning, and Optimization for Personalized Packing Checklist Generation",
  codeUrl: null,
  buildClaim: "This work offers a generalizable architecture for creating personalized systems where strict rules must coexist with individual preferences, applicable beyond travel to other domains requiring constrained personalization.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Hard Rules Soft", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Hard Rules Soft listening on ${port}`);
});
