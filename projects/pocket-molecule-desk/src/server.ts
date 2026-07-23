import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.12349",
  title: "Generating Developable 3D Molecules via Pocket-Conditioned Diffusion and Property-Aware Optimization",
  codeUrl: null,
  buildClaim: "ConDitar-dev could be a useful tool for researchers and developers working on drug discovery and development, but its effectiveness and limitations need to be further evaluated.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Generating Developable Molecules", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Generating Developable Molecules listening on ${port}`);
});
