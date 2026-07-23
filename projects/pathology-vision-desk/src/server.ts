import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.09526",
  title: "ALICE: Learning a General-Purpose Pathology Foundation Model from Vision, Vision-Language, and Slide-Level Experts",
  codeUrl: "https://github.com/WonderLandxD/ALICE",
  buildClaim: "Builders can adopt ALICE as a general-purpose backbone for computational pathology, leveraging its unified architecture and open-source release to accelerate downstream tool development.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Pathology Vision Desk", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Pathology Vision Desk listening on ${port}`);
});
