import http from "node:http";
import { describeClaim } from "./claim.ts";

const port = Number(process.env.PORT || 3847);
const claim = describeClaim({
  paperId: "2607.09305",
  title: "From Classification to Localization and Clinical Validation: Large-Scale Development of a Deep Learning System for Thoracic Disease Detection on Chest Radiographs in Thailand",
  codeUrl: null,
  buildClaim: "The Attend-and-Compare Modules and PCAM aggregation layer enable simultaneous classification and localization in a single model, which may influence future CXR AI architectures.",
});

const server = http.createServer((_req, res) => {
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ product: "Classification Localization Clinical", claim }, null, 2));
});

server.listen(port, () => {
  console.log(`Classification Localization Clinical listening on ${port}`);
});
