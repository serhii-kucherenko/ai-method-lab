import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.12527",
  title: "Evidence-Grounded AI for Musculoskeletal Care",
  codeUrl: null,
  buildClaim: "This system demonstrates the potential of clinical artificial intelligence to improve longitudinal management of complex diseases, moving beyond predictive analytics to executable decision-making.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Evidence Grounded Musculoskeletal", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Evidence Grounded Musculoskeletal listening on ${port}`);
});
